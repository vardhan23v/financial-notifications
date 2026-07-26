"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveChannels = resolveChannels;
const dnd_1 = require("../backend/src/domain/dnd");
const frequency_cap_1 = require("../backend/src/domain/frequency-cap");
const quiet_hours_1 = require("../backend/src/domain/quiet-hours");
/**
 * Resolves the notification channels for a given event, considering
 * regulatory requirements, user preferences, TRAI DND compliance,
 * frequency capping, and quiet hours.
 *
 * If the event carries a regulatory channel mandate (e.g., SEBI requires
 * SMS for margin calls), that channel is always returned regardless of
 * the user's configured preferences.
 */
async function resolveChannels(event, preferences) {
    const regulatoryChannel = event.regulatoryChannel;
    if (typeof regulatoryChannel === "string" && regulatoryChannel.length > 0) {
        return [regulatoryChannel];
    }
    // Fall back to user preferences when no regulatory channel is mandated
    const preferredChannels = preferences.channels;
    let channels;
    if (Array.isArray(preferredChannels) && preferredChannels.length > 0) {
        channels = preferredChannels.filter((ch) => typeof ch === "string");
    }
    else {
        return [];
    }
    const userId = typeof event.userId === "string" ? event.userId : "";
    const eventType = typeof event.type === "string" ? event.type : "";
    const timezone = typeof preferences.timezone === "string" ? preferences.timezone : "Asia/Kolkata";
    // Filter channels through DND, frequency cap, and quiet hours
    const allowed = [];
    for (const channel of channels) {
        // 1. TRAI DND check
        const dndOk = await (0, dnd_1.checkDND)(userId, channel, eventType);
        if (!dndOk)
            continue;
        // 2. Frequency cap check (default: 10 per hour)
        const capOk = await (0, frequency_cap_1.checkFrequencyCap)(userId, channel, 1, 10);
        if (!capOk)
            continue;
        // 3. Quiet hours check — only EMAIL allowed during quiet hours
        if (channel !== "EMAIL" && (0, quiet_hours_1.isQuietHours)(userId, timezone)) {
            continue;
        }
        allowed.push(channel);
    }
    // If everything was filtered out, fall back to EMAIL
    if (allowed.length === 0) {
        return ["EMAIL"];
    }
    return allowed;
}
//# sourceMappingURL=channels.js.map