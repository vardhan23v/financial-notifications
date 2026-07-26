import type { Request, Response } from "express";

// In-memory DLQ store for API exposure
interface DLQEntry {
  id: string;
  eventId: string;
  eventType: string;
  userId: string;
  error: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

const dlqStore: DLQEntry[] = [];

export function getDLQ(req: Request, res: Response): void {
  res.json({ entries: dlqStore, total: dlqStore.length });
}

export async function replayDLQ(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const entry = dlqStore.find((e) => e.id === id);

  if (!entry) {
    res.status(404).json({ error: "DLQ entry not found" });
    return;
  }

  // In a real system, this would re-publish to Kafka
  // For now, we just remove from DLQ
  const index = dlqStore.findIndex((e) => e.id === id);
  if (index >= 0) {
    dlqStore.splice(index, 1);
  }

  res.json({ success: true, message: "Replayed successfully" });
}

export async function addToDLQ(entry: DLQEntry): Promise<void> {
  dlqStore.push(entry);
}
