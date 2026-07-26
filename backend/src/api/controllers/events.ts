import type { Request, Response } from "express";
import { ingestEvent } from "../../services/event-ingestion";
import { EVENT_TYPES } from "../../domain/events";

export async function createEvent(req: Request, res: Response): Promise<void> {
  const { type, userId, payload, correlationId } = req.body;

  if (!type || !userId || !payload) {
    res.status(400).json({ error: "Missing required fields: type, userId, payload" });
    return;
  }

  if (!EVENT_TYPES.includes(type)) {
    res.status(400).json({ error: `Invalid event type: ${type}` });
    return;
  }

  try {
    const result = await ingestEvent({ type, userId, payload, correlationId });
    res.status(202).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
}

export function listEventTypes(req: Request, res: Response): void {
  res.json({ eventTypes: EVENT_TYPES });
}
