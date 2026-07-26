import { v4 as uuidv4 } from "uuid";
import type { EventPayload } from "../domain/events";
import { createEventUnsafe } from "../domain/factory";
import { checkIdempotencyKey, setIdempotencyKey } from "../domain/idempotency";
import { getKafkaProducer } from "../../../src/infrastructure/kafka";

// ---------------------------------------------------------------------------
// Event Ingestion Service — validates and publishes events to Kafka
// ---------------------------------------------------------------------------

export interface IngestEventInput {
  type: string;
  userId: string;
  payload: Record<string, unknown>;
  correlationId?: string;
}

export async function ingestEvent(input: IngestEventInput): Promise<{ id: string }> {
  const event = createEventUnsafe(input);
  const idempotencyKey = `${event.userId}:${event.type}:${event.id}`;

  // Check idempotency
  const isDuplicate = await checkIdempotencyKey(idempotencyKey);
  if (isDuplicate) {
    return { id: event.id };
  }

  // Publish to Kafka
  const producer = getKafkaProducer();
  await producer.connect();
  await producer.send({
    topic: "notifications.events",
    messages: [
      {
        key: event.userId,
        value: JSON.stringify(event),
        headers: {
          "correlation-id": event.correlationId ?? uuidv4(),
          "event-type": event.type,
        },
      },
    ],
  });

  // Mark as processed
  await setIdempotencyKey(idempotencyKey, { eventId: event.id, type: event.type });

  return { id: event.id };
}
