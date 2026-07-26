import { getRedisClient } from "../../../src/infrastructure/redis";

// ---------------------------------------------------------------------------
// Idempotency — prevents duplicate event processing using Redis
// ---------------------------------------------------------------------------

const IDEMPOTENCY_TTL_SECONDS = 86400; // 24 hours

export async function checkIdempotencyKey(key: string): Promise<boolean> {
  const redis = getRedisClient();
  const exists = await redis.exists(`idempotency:${key}`);
  return exists === 1;
}

export async function setIdempotencyKey(key: string, metadata?: Record<string, unknown>): Promise<void> {
  const redis = getRedisClient();
  await redis.setex(
    `idempotency:${key}`,
    IDEMPOTENCY_TTL_SECONDS,
    JSON.stringify({ createdAt: new Date().toISOString(), ...metadata }),
  );
}

export async function generateIdempotencyKey(eventId: string, userId: string, eventType: string): Promise<string> {
  const raw = `${eventId}:${userId}:${eventType}`;
  // Simple hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `${eventId}-${Math.abs(hash).toString(16)}`;
}
