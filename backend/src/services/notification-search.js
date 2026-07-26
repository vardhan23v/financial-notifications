"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchNotifications = searchNotifications;
const notification_1 = require("../repositories/notification");
async function searchNotifications(filter) {
    const result = await (0, notification_1.findNotifications)(filter);
    const notifications = result.notifications.map((n) => ({
        id: n.id,
        userId: n.userId,
        userName: n.user?.name ?? "Unknown",
        userEmail: n.user?.email ?? "",
        eventId: n.eventId,
        eventType: n.eventType,
        channel: n.channel,
        status: n.status,
        error: n.error,
        createdAt: n.createdAt,
    }));
    return { notifications, total: result.total };
}
//# sourceMappingURL=notification-search.js.map