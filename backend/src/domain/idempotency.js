"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIdempotencyKey = checkIdempotencyKey;
exports.setIdempotencyKey = setIdempotencyKey;
exports.generateIdempotencyKey = generateIdempotencyKey;
const redis_1 = require("../../../src/infrastructure/redis");
// ---------------------------------------------------------------------------
// Idempotency — prevents duplicate event processing using Redis
// ---------------------------------------------------------------------------
const IDEMPOTENCY_TTL_SECONDS = 86400; // 24 hours
async function checkIdempotencyKey(key) {
    const redis = (0, redis_1.getRedisClient)();
    const exists = await redis.exists(`idempotency:${key}`);
    return exists === 1;
}
async function setIdempotencyKey(key, metadata) {
    const redis = (0, redis_1.getRedisClient)();
    await redis.setex(`idempotency:${key}`, IDEMPOTENCY_TTL_SECONDS, JSON.stringify({ createdAt: new Date().toISOString(), ...metadata }));
}
async function generateIdempotencyKey(eventId, userId, eventType) {
    const raw = `${eventId}:${userId}:${eventType}`;
    // Simple hash
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        const char = raw.charCodeAt(i);
        hash = ((hash << 5) - hash + char) | 0;
    }
    return `${eventId}-${Math.abs(hash).toString(16)}`;
}
//# sourceMappingURL=idempotency.js.map