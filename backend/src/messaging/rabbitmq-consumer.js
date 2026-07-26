"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRabbitMQConsumer = startRabbitMQConsumer;
const rabbitmq_1 = require("../../../src/infrastructure/rabbitmq");
const message_processor_1 = require("../services/message-processor");
const logging_1 = require("../../../src/logging");
const metrics_1 = require("../../../src/metrics");
const dlq_1 = require("../api/controllers/dlq");
// ---------------------------------------------------------------------------
// RabbitMQ Consumer — consumes events from notification queue
// ---------------------------------------------------------------------------
let consumerRunning = false;
async function startRabbitMQConsumer() {
    if (consumerRunning)
        return;
    const log = (0, logging_1.getLogger)();
    try {
        const channel = await (0, rabbitmq_1.getRabbitMQChannel)();
        const queue = "notifications.queue";
        const exchange = "notifications.exchange";
        const routingKey = "notification.event";
        await channel.assertExchange(exchange, "topic", { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);
        channel.consume(queue, async (msg) => {
            if (!msg)
                return;
            try {
                const content = JSON.parse(msg.content.toString());
                log.info({ msgId: content.id }, "RabbitMQ message received");
                await (0, message_processor_1.processMessage)(content);
                channel.ack(msg);
            }
            catch (err) {
                const error = err instanceof Error ? err.message : String(err);
                log.error({ error }, "RabbitMQ message processing failed");
                // Reject and don't requeue (send to DLQ)
                channel.nack(msg, false, false);
                const content = JSON.parse(msg.content.toString());
                await (0, dlq_1.addToDLQ)({
                    id: `rmq-${Date.now()}`,
                    eventId: content.id ?? "unknown",
                    eventType: content.type ?? "unknown",
                    userId: content.userId ?? "unknown",
                    error,
                    timestamp: new Date().toISOString(),
                    payload: content.payload ?? {},
                });
                (0, metrics_1.recordMetric)("notifications_failed_total", 1, { channel: "rabbitmq", type: content.type ?? "unknown" });
            }
        });
        consumerRunning = true;
        log.info("RabbitMQ consumer started");
    }
    catch (err) {
        log.error({ err }, "Failed to start RabbitMQ consumer");
    }
}
//# sourceMappingURL=rabbitmq-consumer.js.map