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
export declare function recordAnalytics(event: AnalyticsEvent): Promise<void>;
/**
 * Computes a time-series aggregate over the last `timeWindowMinutes`
 * minutes. Returns a MetricsSnapshot with counts broken down by channel,
 * status, and event type, plus the average delivery duration.
 */
export declare function aggregateMetrics(timeWindowMinutes: number): Promise<MetricsSnapshot>;
//# sourceMappingURL=analytics.d.ts.map