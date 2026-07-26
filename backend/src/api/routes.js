"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const status_1 = require("./controllers/status");
const events_1 = require("./controllers/events");
const notifications_1 = require("./controllers/notifications");
const dlq_1 = require("./controllers/dlq");
const providers_1 = require("./controllers/providers");
const templates_1 = require("./controllers/templates");
const users_1 = require("./controllers/users");
const proxy_1 = __importDefault(require("../routes/proxy"));
const router = (0, express_1.Router)();
// Health
router.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// System Status
router.get("/status", status_1.getStatus);
// Events
router.get("/events/types", events_1.listEventTypes);
router.post("/events", events_1.createEvent);
// Notifications
router.get("/notifications", notifications_1.getNotifications);
// DLQ
router.get("/dlq", dlq_1.getDLQ);
router.post("/dlq/:id/replay", dlq_1.replayDLQ);
// Providers
router.get("/providers", providers_1.getProviders);
router.patch("/providers/:id", providers_1.toggleProvider);
// Templates
router.get("/templates", templates_1.getTemplates);
router.post("/templates", templates_1.createTemplateHandler);
router.patch("/templates/:id", templates_1.updateTemplateHandler);
router.delete("/templates/:id", templates_1.deleteTemplateHandler);
// Users
router.get("/users", users_1.getUsers);
router.patch("/users/:userId/preferences", users_1.updatePreferences);
// Proxy
router.use(proxy_1.default);
exports.default = router;
//# sourceMappingURL=routes.js.map