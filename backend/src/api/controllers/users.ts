import type { Request, Response } from "express";
import { findAllUsers, updateUserPreferences } from "../../repositories/user";

export async function getUsers(req: Request, res: Response): Promise<void> {
  const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : undefined;
  const take = req.query.take ? parseInt(req.query.take as string, 10) : undefined;
  const result = await findAllUsers({ skip, take });
  res.json(result);
}

export async function updatePreferences(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  const { channels, quietHoursStart, quietHoursEnd, language } = req.body;

  try {
    const preferences = await updateUserPreferences(userId, {
      channels,
      quietHoursStart,
      quietHoursEnd,
      language,
    });
    res.json(preferences);
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
}
