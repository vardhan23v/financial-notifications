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
export interface HealthStatus {
    component: string;
    healthy: boolean;
    error?: string;
}
/**
 * Runs a health check against every infrastructure component and returns
 * a status array suitable for a /health endpoint.
 */
export declare function healthCheck(): Promise<HealthStatus[]>;
/**
 * Disconnects all infrastructure clients in dependency order (channels
 * before connections). Call this on SIGTERM / SIGINT.
 */
export declare function gracefulShutdown(): Promise<void>;
//# sourceMappingURL=index.d.ts.map