import { Kafka, logLevel } from "kafkajs";
import { processMessage } from "../services/message-processor";
import { getLogger } from "../../../src/logging";
import { recordMetric } from "../../../src/metrics";
import { addToDLQ } from "../api/controllers/dlq";

// ---------------------------------------------------------------------------
// Kafka Consumer — consumes events from notifications.events topic
// ---------------------------------------------------------------------------

let consumerRunning = false;

export async function startKafkaConsumer(): Promise<void> {
  if (consumerRunning) return;

  const log = getLogger();
  const brokers = (process.env.KAFKA_BROKERS ?? "localhost:9092").split(",").map((b) => b.trim());

  const kafka = new Kafka({
    clientId: "pro4-backend-consumer",
    brokers,
    logLevel: process.env.NODE_ENV === "development" ? logLevel.INFO : logLevel.WARN,
  });

  const consumer = kafka.consumer({ groupId: "pro4-notification-processors" });

  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "notifications.events", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString();
          if (!value) return;

          const msg = JSON.parse(value);
          log.info({ msgId: msg.id, topic, partition }, "Kafka message received");

          await processMessage(msg);
          recordMetric("consumer_lag", 0, { topic, partition: String(partition) });
        } catch (err) {
          const error = err instanceof Error ? err.message : String(err);
          log.error({ error, topic, partition }, "Kafka message processing failed");

          // Add to DLQ
          const msg = JSON.parse(message.value?.toString() ?? "{}");
          await addToDLQ({
            id: `${topic}-${partition}-${message.offset}`,
            eventId: msg.id ?? "unknown",
            eventType: msg.type ?? "unknown",
            userId: msg.userId ?? "unknown",
            error,
            timestamp: new Date().toISOString(),
            payload: msg.payload ?? {},
          });

          recordMetric("notifications_failed_total", 1, { channel: "kafka", type: msg.type ?? "unknown" });
        }
      },
    });

    consumerRunning = true;
    log.info("Kafka consumer started");
  } catch (err) {
    log.error({ err }, "Failed to start Kafka consumer");
  }
}
