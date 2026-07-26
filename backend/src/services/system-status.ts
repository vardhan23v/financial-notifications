import { healthCheck } from "../../../src/infrastructure";
import { getRedisClient } from "../../../src/infrastructure/redis";
import { getAllCircuitBreakerStates } from "../domain/circuit-breaker";
import { getNotificationStats } from "../repositories/notification";
import { findAllProviders } from "../repositories/provider";

// ---------------------------------------------------------------------------
// System Status Service — aggregates health and metrics for the dashboard
// ---------------------------------------------------------------------------

export interface SystemStatus {
  healthy: boolean;
  components: Array<{
    name: string;
    healthy: boolean;
    error?: string;
  }>;
  metrics: {
    notificationsSent: number;
    notificationsFailed: number;
    notificationsPending: number;
    dlqSize: number;
    totalNotifications: number;
  };
  providers: Array<{
    name: string;
    channel: string;
    healthy: boolean;
    active: boolean;
  }>;
  circuitBreakers: Array<{
    provider: string;
    state: string;
  }>;
  activeConsumers: number;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const [health, stats, providers, breakerStates] = await Promise.all([
    healthCheck(),
    getNotificationStats(),
    findAllProviders(),
    getAllCircuitBreakerStates(),
  ]);

  // Get DLQ size from Redis if available, fallback to stats
  let dlqSize = stats.dlq;
  try {
    const redis = getRedisClient();
    const dlqCount = await redis.get("dlq:size");
    if (dlqCount) {
      dlqSize = parseInt(dlqCount, 10);
    }
  } catch {
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
providers: providers.providers.map((p: { name: string; channel: string; isActive: boolean }) => ({
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
