"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveChannels = resolveChannels;
const routing_1 = require("./routing");
const scoring_1 = require("./scoring");
function resolveChannels(event, userPreferences) {
    const route = (0, routing_1.routeEvent)(event);
    const score = (0, scoring_1.scoreEvent)(event);
    // Regulatory override takes absolute precedence
    if (route.requiresRegulatoryOverride) {
        return {
            channels: route.channels,
            regulatoryOverride: true,
            regulator: route.regulator,
            quietHoursRespected: !score.quietHoursBypass,
        };
    }
    // Check quiet hours
    const inQuietHours = isInQuietHours(userPreferences?.quietHoursStart, userPreferences?.quietHoursEnd);
    let channels;
    if (inQuietHours && !score.quietHoursBypass) {
        // During quiet hours, only EMAIL is allowed unless bypassed
        channels = ["EMAIL"];
    }
    else {
        // Use user preferences intersected with recommended channels
        const preferred = userPreferences?.channels ?? ["EMAIL"];
        const recommended = score.recommendedChannels;
        channels = preferred.filter((ch) => recommended.includes(ch));
        // Fallback to EMAIL if no intersection
        if (channels.length === 0) {
            channels = ["EMAIL"];
        }
    }
    return {
        channels,
        regulatoryOverride: false,
        quietHoursRespected: !inQuietHours || score.quietHoursBypass,
        fallbackChannel: channels.length === 1 && channels[0] === "EMAIL" ? "EMAIL" : undefined,
    };
}
function isInQuietHours(start, end) {
    if (!start || !end)
        return false;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    if (startMinutes < endMinutes) {
        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }
    // Wraps around midnight
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}
//# sourceMappingURL=channels.js.map