"use strict";
/**
 * Redis client singleton — provides a single, lazily-initialized ioredis
 * instance for the lifetime of the process.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = getRedisClient;
exports.disconnectRedis = disconnectRedis;
const ioredis_1 = __importDefault(require("ioredis"));
let client;
function getRedisClient() {
    if (!client) {
        const url = process.env.REDIS_URL ?? "redis://localhost:6379";
        client = new ioredis_1.default(url, {
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
async function disconnectRedis() {
    if (client) {
        await client.quit();
        client = undefined;
    }
}
//# sourceMappingURL=redis.js.map