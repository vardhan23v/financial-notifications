"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.listEventTypes = listEventTypes;
const event_ingestion_1 = require("../../services/event-ingestion");
const events_1 = require("../../domain/events");
async function createEvent(req, res) {
    const { type, userId, payload, correlationId } = req.body;
    if (!type || !userId || !payload) {
        res.status(400).json({ error: "Missing required fields: type, userId, payload" });
        return;
    }
    if (!events_1.EVENT_TYPES.includes(type)) {
        res.status(400).json({ error: `Invalid event type: ${type}` });
        return;
    }
    try {
        const result = await (0, event_ingestion_1.ingestEvent)({ type, userId, payload, correlationId });
        res.status(202).json(result);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
}
function listEventTypes(req, res) {
    res.json({ eventTypes: events_1.EVENT_TYPES });
}
//# sourceMappingURL=events.js.map