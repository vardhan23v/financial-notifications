"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFrequencyCap = checkFrequencyCap;
const prisma_1 = require("../../../src/infrastructure/prisma");
// ---------------------------------------------------------------------------
// Frequency Capping — limits the number of deliveries per user/channel
// within a sliding time window to prevent notification fatigue.
// ---------------------------------------------------------------------------
/**
 * Checks whether a notification to the given user on the given channel
 * would exceed the configured frequency cap.
 *
 * Counts the number of successful deliveries to this user on this channel
 * within the last `windowHours` hours. If the count is at or above
 * `maxCount`, the cap is hit and the notification should be suppressed.
 *
 * @param userId - The recipient user ID
 * @param channel - The delivery channel
 * @param windowHours - The sliding window size in hours
 * @param maxCount - Maximum allowed deliveries within the window
 * @returns true if the notification is allowed, false if the cap is exceeded
 */
async function checkFrequencyCap(userId, channel, windowHours, maxCount) {
    const prisma = (0, prisma_1.getPrismaClient)();
    const windowStart = new Date(Date.now() - windowHours * 60 * 60 * 1000);
    const count = await prisma.notification.count({
        where: {
            userId,
            channel,
            status: "SENT",
            createdAt: { gte: windowStart },
        },
    });
    return count < maxCount;
}
//# sourceMappingURL=frequency-cap.js.map