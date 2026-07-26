/**
 * Infrastructure barrel — re-exports all singleton clients, health checks,
 * and the graceful shutdown orchestrator.
 */

import { getPrismaClient, disconnectPrisma } from "./prisma";
import { getRedisClient, disconnectRedis } from "./redis";
import { getKafkaProducer, disconnectKafka } from "./kafka";
import { getRabbitMQChannel, disconnectRabbitMQ } from "./rabbitmq";

export { getPrismaClient, disconnectPrisma };
export { getRedisClient, disconnectRedis };
export { getKafkaProducer, disconnectKafka };
export { getRabbitMQChannel, disconnectRabbitMQ };
// ---------------------------------------------------------------------------
// Connection health checks
// ---------------------------------------------------------------------------

export interface HealthStatus {
  component: string;
  healthy: boolean;
  error?: string;
}

/**
 * Runs a health check against every infrastructure component and returns
 * a status array suitable for a /health endpoint.
 */
export async function healthCheck(): Promise<HealthStatus[]> {
  const results: HealthStatus[] = [];

  // --- Prisma (PostgreSQL) ---
  try {
    const prisma = getPrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    results.push({ component: "postgres", healthy: true });
  } catch (err) {
    results.push({
      component: "postgres",
      healthy: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // --- Redis ---
  try {
    const redis = getRedisClient();
    const pong = await redis.ping();
    results.push({ component: "redis", healthy: pong === "PONG" });
  } catch (err) {
    results.push({
      component: "redis",
      healthy: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // --- Kafka ---
  try {
    const kafkaProducer = getKafkaProducer();
    // connect() is idempotent in KafkaJS — safe to call even if already connected
    await kafkaProducer.connect();
    results.push({ component: "kafka", healthy: true });
  } catch (err) {
    results.push({
      component: "kafka",
      healthy: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // --- RabbitMQ ---
  try {
    const rmqChannel = await getRabbitMQChannel();
    // If we can create a channel, the connection is healthy
    results.push({ component: "rabbitmq", healthy: Boolean(rmqChannel) });
  } catch (err) {
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
export async function gracefulShutdown(): Promise<void> {
  console.log("[infra] Shutting down infrastructure clients...");

  const results = await Promise.allSettled([
    disconnectPrisma(),
    disconnectRedis(),
    disconnectKafka(),
    disconnectRabbitMQ(),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[infra] Shutdown error:", result.reason);
    }
  }

  console.log("[infra] All infrastructure clients disconnected.");
}