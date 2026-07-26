import type { Request, Response } from "express";
import { findAllProviders, updateProviderStatus } from "../../repositories/provider";

export async function getProviders(req: Request, res: Response): Promise<void> {
  const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : undefined;
  const take = req.query.take ? parseInt(req.query.take as string, 10) : undefined;
  const result = await findAllProviders({ skip, take });
  res.json(result);
}

export async function toggleProvider(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    res.status(400).json({ error: "isActive must be a boolean" });
    return;
  }

  try {
    const provider = await updateProviderStatus(id, isActive);
    res.json({ provider });
  } catch (err) {
    res.status(404).json({ error: "Provider not found" });
  }
}
