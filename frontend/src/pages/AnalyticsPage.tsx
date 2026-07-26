import { useEffect, useState } from "react";
import { useSystemStore } from "../stores/system";
import { subscribeMetrics, type MetricsSnapshot } from "../lib/api";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Loader2,
  XCircle,
} from "lucide-react";

const CHANNELS = ["EMAIL", "SMS", "PUSH", "WHATSAPP", "IN_APP"] as const;

export default function AnalyticsPage() {
  const { status, loading, error, refresh } = useSystemStore();
  const [history, setHistory] = useState<
    Array<{ time: string; sent: number; failed: number }>
  >([]);
  const [liveSnapshot, setLiveSnapshot] = useState<MetricsSnapshot | null>(null);

  // Poll system status for the history chart
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Subscribe to real-time SSE metrics for live channel counts
  useEffect(() => {
    const unsubscribe = subscribeMetrics((snapshot) => {
      setLiveSnapshot(snapshot);
    });
    return unsubscribe;
  }, []);

  // Track metrics history for charts
  useEffect(() => {
    if (status) {
      setHistory((prev) => {
        const next = [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            sent: status.metrics.notificationsSent,
            failed: status.metrics.notificationsFailed,
          },
        ];
        return next.slice(-30); // Keep last 30 data points
      });
    }
  }, [status]);

  if (loading && !status) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-text-muted animate-spin" />
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <XCircle className="w-12 h-12 text-danger" />
        <p className="text-danger font-medium">Failed to load analytics</p>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark"
        >
          Retry
        </button>
      </div>
    );
  }

  const maxVal = Math.max(
    ...history.map((h) => Math.max(h.sent, h.failed)),
    1,
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text">Analytics</h2>
        <p className="text-text-muted text-sm mt-1">
          Notification delivery metrics and trends
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Delivery Rate"
          value={
            status
              ? `${Math.round(
                  (status.metrics.notificationsSent /
                    Math.max(status.metrics.totalNotifications, 1)) *
                    100,
                )}%`
              : "—"
          }
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-success"
          bg="bg-success/10"
        />
        <SummaryCard
          label="Failure Rate"
          value={
            status
              ? `${Math.round(
                  (status.metrics.notificationsFailed /
                    Math.max(status.metrics.totalNotifications, 1)) *
                    100,
                )}%`
              : "—"
          }
          icon={<Activity className="w-5 h-5" />}
          color="text-danger"
          bg="bg-danger/10"
        />
        <SummaryCard
          label="Avg. Latency"
          value={liveSnapshot ? `${liveSnapshot.avgDurationMs} ms` : "— ms"}
          icon={<BarChart3 className="w-5 h-5" />}
          color="text-info"
          bg="bg-info/10"
        />
        <SummaryCard
          label="Throughput"
          value={liveSnapshot ? `${liveSnapshot.totalEvents} /5m` : "— /min"}
          icon={<Activity className="w-5 h-5" />}
          color="text-accent"
          bg="bg-accent/10"
        />
      </div>

      {/* Chart: Notifications Over Time */}
      <section className="bg-surface rounded-xl border border-border p-5">
        <h3 className="text-lg font-semibold text-text mb-4">
          Notifications Over Time
        </h3>
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-text-muted text-sm">
              Collecting data... chart will appear shortly
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Simple bar chart */}
            <div className="flex items-end gap-1 h-40">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1 min-w-[8px]"
                  title={`${h.time}: ${h.sent} sent, ${h.failed} failed`}
                >
                  <div className="w-full flex flex-col-reverse">
                    <div
                      className="w-full bg-success/60 rounded-t"
                      style={{
                        height: `${(h.sent / maxVal) * 100}%`,
                        minHeight: h.sent > 0 ? 2 : 0,
                      }}
                    />
                    <div
                      className="w-full bg-danger/60"
                      style={{
                        height: `${(h.failed / maxVal) * 100}%`,
                        minHeight: h.failed > 0 ? 2 : 0,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-success/60" />
                <span className="text-text-muted">Sent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-danger/60" />
                <span className="text-text-muted">Failed</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Channel Distribution — live from SSE */}
      <section className="bg-surface rounded-xl border border-border p-5">
        <h3 className="text-lg font-semibold text-text mb-4">
          Channel Distribution
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {CHANNELS.map((ch) => (
            <div
              key={ch}
              className="bg-background rounded-lg p-4 text-center"
            >
              <p className="text-xs text-text-muted mb-1">{ch}</p>
              <p className="text-xl font-bold text-text">
                {liveSnapshot?.byChannel[ch] ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-muted">{label}</span>
        <span className={`${bg} p-1.5 rounded-lg ${color}`}>{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}