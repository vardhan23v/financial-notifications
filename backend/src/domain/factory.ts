import { v4 as uuidv4 } from "uuid";
import type { EventPayload } from "./events";
import { eventPayloadSchema } from "./schemas";

// ---------------------------------------------------------------------------
// Event Factory — creates validated event payloads with correlation IDs
// ---------------------------------------------------------------------------

export interface CreateEventInput {
  type: string;
  userId: string;
  payload: Record<string, unknown>;
  correlationId?: string;
}

export function createEvent(input: CreateEventInput): EventPayload {
  const event = {
    id: uuidv4(),
    type: input.type,
    userId: input.userId,
    timestamp: new Date().toISOString(),
    correlationId: input.correlationId ?? uuidv4(),
    payload: input.payload,
  };

  const parsed = eventPayloadSchema.safeParse(event);
  if (!parsed.success) {
    throw new Error(`Invalid event: ${parsed.error.message}`);
  }

  return parsed.data;
}

export function createEventUnsafe(input: CreateEventInput): EventPayload {
  return {
    id: uuidv4(),
    type: input.type,
    userId: input.userId,
    timestamp: new Date().toISOString(),
    correlationId: input.correlationId ?? uuidv4(),
    payload: input.payload,
  } as EventPayload;
}
