"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startKafkaConsumer = startKafkaConsumer;
const kafkajs_1 = require("kafkajs");
const message_processor_1 = require("../services/message-processor");
const logging_1 = require("../../../src/logging");
const metrics_1 = require("../../../src/metrics");
const dlq_1 = require("../api/controllers/dlq");
// ---------------------------------------------------------------------------
// Kafka Consumer — consumes events from notifications.events topic
// ---------------------------------------------------------------------------
let consumerRunning = false;
async function startKafkaConsumer() {
    if (consumerRunning)
        return;
    const log = (0, logging_1.getLogger)();
    const brokers = (process.env.KAFKA_BROKERS ?? "localhost:9092").split(",").map((b) => b.trim());
    const kafka = new kafkajs_1.Kafka({
        clientId: "pro4-backend-consumer",
        brokers,
        logLevel: process.env.NODE_ENV === "development" ? kafkajs_1.logLevel.INFO : kafkajs_1.logLevel.WARN,
    });
    const consumer = kafka.consumer({ groupId: "pro4-notification-processors" });
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: "notifications.events", fromBeginning: false });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const value = message.value?.toString();
                    if (!value)
                        return;
                    const msg = JSON.parse(value);
                    log.info({ msgId: msg.id, topic, partition }, "Kafka message received");
                    await (0, message_processor_1.processMessage)(msg);
                    (0, metrics_1.recordMetric)("consumer_lag", 0, { topic, partition: String(partition) });
                }
                catch (err) {
                    const error = err instanceof Error ? err.message : String(err);
                    log.error({ error, topic, partition }, "Kafka message processing failed");
                    // Add to DLQ
                    const msg = JSON.parse(message.value?.toString() ?? "{}");
                    await (0, dlq_1.addToDLQ)({
                        id: `${topic}-${partition}-${message.offset}`,
                        eventId: msg.id ?? "unknown",
                        eventType: msg.type ?? "unknown",
                        userId: msg.userId ?? "unknown",
                        error,
                        timestamp: new Date().toISOString(),
                        payload: msg.payload ?? {},
                    });
                    (0, metrics_1.recordMetric)("notifications_failed_total", 1, { channel: "kafka", type: msg.type ?? "unknown" });
                }
            },
        });
        consumerRunning = true;
        log.info("Kafka consumer started");
    }
    catch (err) {
        log.error({ err }, "Failed to start Kafka consumer");
    }
}
//# sourceMappingURL=kafka-consumer.js.map