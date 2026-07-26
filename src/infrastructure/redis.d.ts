/**
 * Redis client singleton — provides a single, lazily-initialized ioredis
 * instance for the lifetime of the process.
 */
import Redis from "ioredis";
export declare function getRedisClient(): Redis;
/**
 * Gracefully disconnect Redis so pending commands can complete.
 */
export declare function disconnectRedis(): Promise<void>;
//# sourceMappingURL=redis.d.ts.map