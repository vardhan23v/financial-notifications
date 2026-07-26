import { Router, Request, Response } from "express";
import { getStatus } from "./controllers/status";
import { createEvent, listEventTypes } from "./controllers/events";
import { getNotifications } from "./controllers/notifications";
import { getDLQ, replayDLQ } from "./controllers/dlq";
import { getProviders, toggleProvider } from "./controllers/providers";
import { getTemplates, createTemplateHandler, updateTemplateHandler, deleteTemplateHandler } from "./controllers/templates";
import { getUsers, updatePreferences } from "./controllers/users";
import { aggregateMetrics } from "../repositories/analytics";
import proxyRoutes from "../routes/proxy";

const router = Router();

// Health
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// System Status
router.get("/status", getStatus);

// Events
router.get("/events/types", listEventTypes);
router.post("/events", createEvent);

// Notifications
router.get("/notifications", getNotifications);

// DLQ
router.get("/dlq", getDLQ);
router.post("/dlq/:id/replay", replayDLQ);

// Providers
router.get("/providers", getProviders);
router.patch("/providers/:id", toggleProvider);

// Templates
router.get("/templates", getTemplates);
router.post("/templates", createTemplateHandler);
router.patch("/templates/:id", updateTemplateHandler);
router.delete("/templates/:id", deleteTemplateHandler);

// Users
router.get("/users", getUsers);
router.patch("/users/:userId/preferences", updatePreferences);

// Analytics SSE — streams MetricsSnapshot every 5 seconds
router.get("/analytics/stream", async (_req: Request, res: Response) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  // Send an initial comment to establish the connection
  res.write(": connected\n\n");

  const sendSnapshot = async () => {
    try {
      const snapshot = await aggregateMetrics(5);
      res.write(`data: ${JSON.stringify(snapshot)}\n\n`);
    } catch (err) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: "Failed to aggregate metrics" })}\n\n`);
    }
  };

  // Send first snapshot immediately
  await sendSnapshot();

  // Then every 5 seconds
  const interval = setInterval(sendSnapshot, 5000);

  // Clean up on client disconnect
  _req.on("close", () => {
    clearInterval(interval);
  });
});

// Proxy
router.use(proxyRoutes);

export default router;
