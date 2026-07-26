/**
 * Redis client singleton — provides a single, lazily-initialized ioredis
 * instance for the lifetime of the process.
 */

import Redis from "ioredis";

let client: Redis | undefined;

export function getRedisClient(): Redis {
  if (!client) {
    const url = process.env.REDIS_URL ?? "redis://localhost:6379";

    client = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) {
          return null; // stop retrying
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    client.on("error", (err) => {
      console.error("[redis] client error:", err.message);
    });
  }
  return client;
}

/**
 * Gracefully disconnect Redis so pending commands can complete.
 */
export async function disconnectRedis(): Promise<void> {
  if (client) {
    await client.quit();
    client = undefined;
  }
}