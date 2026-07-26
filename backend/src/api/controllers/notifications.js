"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = getNotifications;
const notification_search_1 = require("../../services/notification-search");
async function getNotifications(req, res) {
    const filter = {
        userId: req.query.userId,
        eventType: req.query.eventType,
        channel: req.query.channel,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        search: req.query.search,
        skip: req.query.skip ? parseInt(req.query.skip, 10) : undefined,
        take: req.query.take ? parseInt(req.query.take, 10) : undefined,
    };
    const result = await (0, notification_search_1.searchNotifications)(filter);
    res.json(result);
}
//# sourceMappingURL=notifications.js.map