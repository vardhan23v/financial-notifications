"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemStatus = getSystemStatus;
const infrastructure_1 = require("../../../src/infrastructure");
const redis_1 = require("../../../src/infrastructure/redis");
const circuit_breaker_1 = require("../domain/circuit-breaker");
const notification_1 = require("../repositories/notification");
const provider_1 = require("../repositories/provider");
async function getSystemStatus() {
    const [health, stats, providers, breakerStates] = await Promise.all([
        (0, infrastructure_1.healthCheck)(),
        (0, notification_1.getNotificationStats)(),
        (0, provider_1.findAllProviders)(),
        (0, circuit_breaker_1.getAllCircuitBreakerStates)(),
    ]);
    // Get DLQ size from Redis if available, fallback to stats
    let dlqSize = stats.dlq;
    try {
        const redis = (0, redis_1.getRedisClient)();
        const dlqCount = await redis.get("dlq:size");
        if (dlqCount) {
            dlqSize = parseInt(dlqCount, 10);
        }
    }
    catch {
        // Redis may not be available
    }
    const components = health.map((h) => ({
        name: h.component,
        healthy: h.healthy,
        error: h.error,
    }));
    const allHealthy = components.every((c) => c.healthy);
    return {
        healthy: allHealthy,
        components,
        metrics: {
            notificationsSent: stats.sent,
            notificationsFailed: stats.failed,
            notificationsPending: stats.pending,
            dlqSize,
            totalNotifications: stats.total,
        },
        providers: providers.providers.map((p) => ({
            name: p.name,
            channel: p.channel,
            healthy: p.isActive, // Simplified: active = healthy
            active: p.isActive,
        })),
        circuitBreakers: breakerStates.map((b) => ({
            provider: b.provider,
            state: b.state,
        })),
        activeConsumers: 2, // Kafka + RabbitMQ consumers
    };
}
//# sourceMappingURL=system-status.js.map