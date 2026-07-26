"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMessage = processMessage;
const channels_1 = require("../domain/channels");
const enrichment_1 = require("../domain/enrichment");
const notification_1 = require("../repositories/notification");
const user_1 = require("../repositories/user");
const delivery_1 = require("./delivery");
const logging_1 = require("../../../src/logging");
const metrics_1 = require("../../../src/metrics");
async function processMessage(msg) {
    const log = (0, logging_1.getLogger)();
    log.info({ msgId: msg.id, type: msg.type, userId: msg.userId }, "Processing message");
    // Find user
    const user = await (0, user_1.findUserById)(msg.userId);
    if (!user) {
        log.warn({ userId: msg.userId }, "User not found");
        throw new Error(`User not found: ${msg.userId}`);
    }
    // Resolve channels
    const event = msg;
    const resolution = (0, channels_1.resolveChannels)(event, user.preferences);
    if (resolution.channels.length === 0) {
        log.warn({ msgId: msg.id }, "No channels resolved");
        throw new Error("No channels resolved for event");
    }
    // Enrich payload
    const enriched = (0, enrichment_1.enrichEvent)(event, user);
    // Deliver to each channel
    for (const channel of resolution.channels) {
        const notification = await (0, notification_1.createNotification)({
            userId: msg.userId,
            eventId: msg.id,
            eventType: msg.type,
            channel,
            status: "PENDING",
        });
        try {
            const locale = user.preferences?.language ?? "en-IN";
            const result = await (0, delivery_1.deliverNotification)(event, channel, enriched.enriched, locale);
            if (result.success) {
                await (0, notification_1.updateNotificationStatus)(notification.id, "SENT");
                (0, metrics_1.recordMetric)("notifications_sent_total", 1, { channel, type: msg.type });
                log.info({ msgId: msg.id, channel, provider: result.provider }, "Notification sent");
            }
            else {
                await (0, notification_1.updateNotificationStatus)(notification.id, "FAILED", result.error);
                (0, metrics_1.recordMetric)("notifications_failed_total", 1, { channel, type: msg.type });
                log.warn({ msgId: msg.id, channel, error: result.error }, "Notification failed");
            }
        }
        catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            await (0, notification_1.updateNotificationStatus)(notification.id, "FAILED", error);
            (0, metrics_1.recordMetric)("notifications_failed_total", 1, { channel, type: msg.type });
            log.error({ msgId: msg.id, channel, error }, "Notification delivery error");
        }
    }
}
//# sourceMappingURL=message-processor.js.map