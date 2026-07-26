import { getPrismaClient } from "../../../src/infrastructure/prisma";

// ---------------------------------------------------------------------------
// Analytics Repository — writes AnalyticsEvent rows and computes time-series
// aggregates for the real-time analytics dashboard.
// ---------------------------------------------------------------------------

export interface AnalyticsEvent {
  eventType: string;
  channel: string;
  status: string;
  userId: string;
  provider?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

export interface MetricsSnapshot {
  windowStart: string;
  windowEnd: string;
  totalEvents: number;
  byChannel: Record<string, number>;
  byStatus: Record<string, number>;
  byEventType: Record<string, number>;
  avgDurationMs: number;
}

/**
 * Persists a single analytics event to the AnalyticsEvent table.
 */
export async function recordAnalytics(event: AnalyticsEvent): Promise<void> {
  const prisma = getPrismaClient();

  await prisma.analyticsEvent.create({
    data: {
      eventType: event.eventType,
      channel: event.channel,
      status: event.status,
      userId: event.userId,
      provider: event.provider ?? "",
      durationMs: event.durationMs ?? 0,
      metadata: JSON.parse(JSON.stringify(event.metadata ?? {})),
    },
  });
}

/**
 * Computes a time-series aggregate over the last `timeWindowMinutes`
 * minutes. Returns a MetricsSnapshot with counts broken down by channel,
 * status, and event type, plus the average delivery duration.
 */
export async function aggregateMetrics(
  timeWindowMinutes: number,
): Promise<MetricsSnapshot> {
  const prisma = getPrismaClient();

  const windowStart = new Date(
    Date.now() - timeWindowMinutes * 60 * 1000,
  );
  const windowEnd = new Date();

  // Fetch all events in the window
  const events = await prisma.analyticsEvent.findMany({
    where: {
      createdAt: { gte: windowStart, lte: windowEnd },
    },
    select: {
      eventType: true,
      channel: true,
      status: true,
      durationMs: true,
    },
  });

  const totalEvents = events.length;

  const byChannel: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byEventType: Record<string, number> = {};
  let totalDurationMs = 0;
  let durationCount = 0;

  for (const e of events) {
    byChannel[e.channel] = (byChannel[e.channel] ?? 0) + 1;
    byStatus[e.status] = (byStatus[e.status] ?? 0) + 1;
    byEventType[e.eventType] = (byEventType[e.eventType] ?? 0) + 1;

    if (e.durationMs > 0) {
      totalDurationMs += e.durationMs;
      durationCount++;
    }
  }

  const avgDurationMs =
    durationCount > 0 ? Math.round(totalDurationMs / durationCount) : 0;

  return {
    windowStart: windowStart.toISOString(),
    windowEnd: windowEnd.toISOString(),
    totalEvents,
    byChannel,
    byStatus,
    byEventType,
    avgDurationMs,
  };
}