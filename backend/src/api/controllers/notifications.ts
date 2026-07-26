import type { Request, Response } from "express";
import { searchNotifications } from "../../services/notification-search";

export async function getNotifications(req: Request, res: Response): Promise<void> {
  const filter = {
    userId: req.query.userId as string | undefined,
    eventType: req.query.eventType as string | undefined,
    channel: req.query.channel as string | undefined,
    status: req.query.status as string | undefined,
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
    search: req.query.search as string | undefined,
    skip: req.query.skip ? parseInt(req.query.skip as string, 10) : undefined,
    take: req.query.take ? parseInt(req.query.take as string, 10) : undefined,
  };

  const result = await searchNotifications(filter);
  res.json(result);
}
