import type { Request, Response } from "express";
import { getSystemStatus } from "../../services/system-status";

export async function getStatus(req: Request, res: Response): Promise<void> {
  const status = await getSystemStatus();
  res.json(status);
}
