"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestEvent = ingestEvent;
const uuid_1 = require("uuid");
const factory_1 = require("../domain/factory");
const idempotency_1 = require("../domain/idempotency");
const kafka_1 = require("../../../src/infrastructure/kafka");
async function ingestEvent(input) {
    const event = (0, factory_1.createEventUnsafe)(input);
    const idempotencyKey = `${event.userId}:${event.type}:${event.id}`;
    // Check idempotency
    const isDuplicate = await (0, idempotency_1.checkIdempotencyKey)(idempotencyKey);
    if (isDuplicate) {
        return { id: event.id };
    }
    // Publish to Kafka
    const producer = (0, kafka_1.getKafkaProducer)();
    await producer.connect();
    await producer.send({
        topic: "notifications.events",
        messages: [
            {
                key: event.userId,
                value: JSON.stringify(event),
                headers: {
                    "correlation-id": event.correlationId ?? (0, uuid_1.v4)(),
                    "event-type": event.type,
                },
            },
        ],
    });
    // Mark as processed
    await (0, idempotency_1.setIdempotencyKey)(idempotencyKey, { eventId: event.id, type: event.type });
    return { id: event.id };
}
//# sourceMappingURL=event-ingestion.js.map