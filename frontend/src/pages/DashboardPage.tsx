import { useEffect } from "react";
import { useSystemStore } from "../stores/system";
import Skeleton from "../components/ui/Skeleton";
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Zap,
  Shield,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const { status, loading, error, lastUpdated, refresh } = useSystemStore();

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (loading && !status) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Infrastructure Status skeleton */}
        <section>
          <Skeleton className="h-6 w-44 mb-3" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </section>

        {/* Metrics Cards skeleton */}
        <section>
          <Skeleton className="h-6 w-44 mb-3" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-surface rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </section>

        {/* Providers & Circuit Breakers skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-surface rounded-xl border border-border p-5">
            <Skeleton className="h-6 w-36 mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <Skeleton className="h-5 w-28 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </section>
          <section className="bg-surface rounded-xl border border-border p-5">
            <Skeleton className="h-6 w-36 mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            ))}
          </section>
        </div>

        {/* Active Consumers skeleton */}
        <section className="bg-surface rounded-xl border border-border p-5">
          <Skeleton className="h-6 w-40 mb-2" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-4 w-48" />
          </div>
        </section>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <XCircle className="w-12 h-12 text-danger" />
        <p className="text-danger font-medium">Failed to load dashboard</p>
        <p className="text-text-muted text-sm">{error}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const getComponentIcon = (name: string) => {
    switch (name) {
      case "kafka":
        return <Zap className="w-5 h-5" />;
      case "rabbitmq":
        return <Server className="w-5 h-5" />;
      case "redis":
        return <Activity className="w-5 h-5" />;
      case "postgres":
        return <Server className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Dashboard</h2>
          <p className="text-text-muted text-sm mt-1">
            Real-time system overview and health monitoring
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Clock className="w-4 h-4" />
          {lastUpdated
            ? `Last updated: ${new Date(lastUpdated).toLocaleTimeString()}`
            : "Updating..."}
        </div>
      </div>

      {/* Infrastructure Status */}
      <section>
        <h3 className="text-lg font-semibold text-text mb-3">
          Infrastructure Status
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {status?.components.map((comp) => (
            <div
              key={comp.name}
              className={`bg-surface rounded-xl border p-4 ${
                comp.healthy ? "border-success/30" : "border-danger/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getComponentIcon(comp.name)}
                  <span className="font-medium capitalize text-text">
                    {comp.name}
                  </span>
                </div>
                {comp.healthy ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <XCircle className="w-5 h-5 text-danger" />
                )}
              </div>
              <p
                className={`text-sm ${
                  comp.healthy ? "text-success" : "text-danger"
                }`}
              >
                {comp.healthy ? "Healthy" : comp.error ?? "Unhealthy"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics Cards */}
      <section>
        <h3 className="text-lg font-semibold text-text mb-3">
          Notification Metrics
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            label="Sent"
            value={status?.metrics.notificationsSent ?? 0}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="text-success"
            bg="bg-success/10"
          />
          <MetricCard
            label="Failed"
            value={status?.metrics.notificationsFailed ?? 0}
            icon={<XCircle className="w-5 h-5" />}
            color="text-danger"
            bg="bg-danger/10"
          />
          <MetricCard
            label="Pending"
            value={status?.metrics.notificationsPending ?? 0}
            icon={<Clock className="w-5 h-5" />}
            color="text-warning"
            bg="bg-warning/10"
          />
          <MetricCard
            label="DLQ"
            value={status?.metrics.dlqSize ?? 0}
            icon={<AlertTriangle className="w-5 h-5" />}
            color="text-accent"
            bg="bg-accent/10"
          />
          <MetricCard
            label="Total"
            value={status?.metrics.totalNotifications ?? 0}
            icon={<TrendingUp className="w-5 h-5" />}
            color="text-info"
            bg="bg-info/10"
          />
        </div>
      </section>

      {/* Providers & Circuit Breakers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provider Health */}
        <section className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-lg font-semibold text-text mb-4">
            Provider Health
          </h3>
          <div className="space-y-3">
            {status?.providers.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-text">{p.name}</p>
                  <p className="text-xs text-text-muted">{p.channel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      p.active
                        ? "bg-success/10 text-success"
                        : "bg-text-muted/10 text-text-muted"
                    }`}
                  >
                    {p.active ? "Active" : "Inactive"}
                  </span>
                  {p.healthy ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-danger" />
                  )}
                </div>
              </div>
            ))}
            {(!status?.providers || status.providers.length === 0) && (
              <p className="text-text-muted text-sm">No providers configured</p>
            )}
          </div>
        </section>

        {/* Circuit Breakers */}
        <section className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-lg font-semibold text-text mb-4">
            Circuit Breakers
          </h3>
          <div className="space-y-3">
            {status?.circuitBreakers.map((cb) => (
              <div
                key={cb.provider}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-text-muted" />
                  <p className="font-medium text-text">{cb.provider}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    cb.state === "CLOSED"
                      ? "bg-success/10 text-success"
                      : cb.state === "HALF_OPEN"
                        ? "bg-warning/10 text-warning"
                        : "bg-danger/10 text-danger"
                  }`}
                >
                  {cb.state}
                </span>
              </div>
            ))}
            {(!status?.circuitBreakers ||
              status.circuitBreakers.length === 0) && (
              <p className="text-text-muted text-sm">
                No circuit breakers active
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Active Consumers */}
      <section className="bg-surface rounded-xl border border-border p-5">
        <h3 className="text-lg font-semibold text-text mb-2">
          Active Consumers
        </h3>
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-success" />
          <span className="text-2xl font-bold text-text">
            {status?.activeConsumers ?? 0}
          </span>
          <span className="text-text-muted text-sm">
            Kafka + RabbitMQ consumers running
          </span>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string;
  value: number;
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
      <p className={`text-2xl font-bold ${color}`}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}