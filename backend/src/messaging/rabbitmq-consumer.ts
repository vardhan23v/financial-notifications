import { getRabbitMQChannel } from "../../../src/infrastructure/rabbitmq";
import { processMessage } from "../services/message-processor";
import { getLogger } from "../../../src/logging";
import { recordMetric } from "../../../src/metrics";
import { addToDLQ } from "../api/controllers/dlq";

// ---------------------------------------------------------------------------
// RabbitMQ Consumer — consumes events from notification queue
// ---------------------------------------------------------------------------

let consumerRunning = false;

export async function startRabbitMQConsumer(): Promise<void> {
  if (consumerRunning) return;

  const log = getLogger();

  try {
    const channel = await getRabbitMQChannel();
    const queue = "notifications.queue";
    const exchange = "notifications.exchange";
    const routingKey = "notification.event";

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        log.info({ msgId: content.id }, "RabbitMQ message received");

        await processMessage(content);
        channel.ack(msg);
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        log.error({ error }, "RabbitMQ message processing failed");

        // Reject and don't requeue (send to DLQ)
        channel.nack(msg, false, false);

        const content = JSON.parse(msg.content.toString());
        await addToDLQ({
          id: `rmq-${Date.now()}`,
          eventId: content.id ?? "unknown",
          eventType: content.type ?? "unknown",
          userId: content.userId ?? "unknown",
          error,
          timestamp: new Date().toISOString(),
          payload: content.payload ?? {},
        });

        recordMetric("notifications_failed_total", 1, { channel: "rabbitmq", type: content.type ?? "unknown" });
      }
    });

    consumerRunning = true;
    log.info("RabbitMQ consumer started");
  } catch (err) {
    log.error({ err }, "Failed to start RabbitMQ consumer");
  }
}
