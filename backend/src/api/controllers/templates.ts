import type { Request, Response } from "express";
import { findAllTemplates, createTemplate, updateTemplate, deleteTemplate } from "../../repositories/template";

export async function getTemplates(req: Request, res: Response): Promise<void> {
  const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : undefined;
  const take = req.query.take ? parseInt(req.query.take as string, 10) : undefined;
  const result = await findAllTemplates({ skip, take });
  res.json(result);
}

export async function createTemplateHandler(req: Request, res: Response): Promise<void> {
  const { eventType, channel, subject, body } = req.body;

  if (!eventType || !channel || !subject || !body) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const template = await createTemplate({ eventType, channel, subject, body });
    res.status(201).json(template);
  } catch (err) {
    res.status(409).json({ error: "Template already exists for this event type and channel" });
  }
}

export async function updateTemplateHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { subject, body, isActive } = req.body;

  try {
    const template = await updateTemplate(id, { subject, body, isActive });
    res.json(template);
  } catch (err) {
    res.status(404).json({ error: "Template not found" });
  }
}

export async function deleteTemplateHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    await deleteTemplate(id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: "Template not found" });
  }
}
