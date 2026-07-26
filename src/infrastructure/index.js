"use strict";
/**
 * Infrastructure barrel — re-exports all singleton clients, health checks,
 * and the graceful shutdown orchestrator.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectRabbitMQ = exports.getRabbitMQChannel = exports.disconnectKafka = exports.getKafkaProducer = exports.disconnectRedis = exports.getRedisClient = exports.disconnectPrisma = exports.getPrismaClient = void 0;
exports.healthCheck = healthCheck;
exports.gracefulShutdown = gracefulShutdown;
const prisma_1 = require("./prisma");
Object.defineProperty(exports, "getPrismaClient", { enumerable: true, get: function () { return prisma_1.getPrismaClient; } });
Object.defineProperty(exports, "disconnectPrisma", { enumerable: true, get: function () { return prisma_1.disconnectPrisma; } });
const redis_1 = require("./redis");
Object.defineProperty(exports, "getRedisClient", { enumerable: true, get: function () { return redis_1.getRedisClient; } });
Object.defineProperty(exports, "disconnectRedis", { enumerable: true, get: function () { return redis_1.disconnectRedis; } });
const kafka_1 = require("./kafka");
Object.defineProperty(exports, "getKafkaProducer", { enumerable: true, get: function () { return kafka_1.getKafkaProducer; } });
Object.defineProperty(exports, "disconnectKafka", { enumerable: true, get: function () { return kafka_1.disconnectKafka; } });
const rabbitmq_1 = require("./rabbitmq");
Object.defineProperty(exports, "getRabbitMQChannel", { enumerable: true, get: function () { return rabbitmq_1.getRabbitMQChannel; } });
Object.defineProperty(exports, "disconnectRabbitMQ", { enumerable: true, get: function () { return rabbitmq_1.disconnectRabbitMQ; } });
/**
 * Runs a health check against every infrastructure component and returns
 * a status array suitable for a /health endpoint.
 */
async function healthCheck() {
    const results = [];
    // --- Prisma (PostgreSQL) ---
    try {
        const prisma = (0, prisma_1.getPrismaClient)();
        await prisma.$queryRaw `SELECT 1`;
        results.push({ component: "postgres", healthy: true });
    }
    catch (err) {
        results.push({
            component: "postgres",
            healthy: false,
            error: err instanceof Error ? err.message : String(err),
        });
    }
    // --- Redis ---
    try {
        const redis = (0, redis_1.getRedisClient)();
        const pong = await redis.ping();
        results.push({ component: "redis", healthy: pong === "PONG" });
    }
    catch (err) {
        results.push({
            component: "redis",
            healthy: false,
            error: err instanceof Error ? err.message : String(err),
        });
    }
    // --- Kafka ---
    try {
        const kafkaProducer = (0, kafka_1.getKafkaProducer)();
        // connect() is idempotent in KafkaJS — safe to call even if already connected
        await kafkaProducer.connect();
        results.push({ component: "kafka", healthy: true });
    }
    catch (err) {
        results.push({
            component: "kafka",
            healthy: false,
            error: err instanceof Error ? err.message : String(err),
        });
    }
    // --- RabbitMQ ---
    try {
        const rmqChannel = await (0, rabbitmq_1.getRabbitMQChannel)();
        // If we can create a channel, the connection is healthy
        results.push({ component: "rabbitmq", healthy: Boolean(rmqChannel) });
    }
    catch (err) {
        results.push({
            component: "rabbitmq",
            healthy: false,
            error: err instanceof Error ? err.message : String(err),
        });
    }
    return results;
}
// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
/**
 * Disconnects all infrastructure clients in dependency order (channels
 * before connections). Call this on SIGTERM / SIGINT.
 */
async function gracefulShutdown() {
    console.log("[infra] Shutting down infrastructure clients...");
    const results = await Promise.allSettled([
        (0, prisma_1.disconnectPrisma)(),
        (0, redis_1.disconnectRedis)(),
        (0, kafka_1.disconnectKafka)(),
        (0, rabbitmq_1.disconnectRabbitMQ)(),
    ]);
    for (const result of results) {
        if (result.status === "rejected") {
            console.error("[infra] Shutdown error:", result.reason);
        }
    }
    console.log("[infra] All infrastructure clients disconnected.");
}
//# sourceMappingURL=index.js.map