import { useEffect, useState } from "react";
import { useNotificationStore } from "../stores/notifications";
import Skeleton from "../components/ui/Skeleton";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import type { Notification } from "../lib/api";

const CHANNELS = ["EMAIL", "SMS", "PUSH", "WHATSAPP", "IN_APP"];
const STATUSES = ["SENT", "FAILED", "PENDING", "RETRYING"];
const EVENT_TYPES = [
  "margin_call", "trade_confirmation", "order_status", "price_alert",
  "portfolio_update", "dividend_credit", "corporate_action",
  "payment_confirmation", "large_transaction_alert", "upi_collect_request",
  "kyc_update", "kyc_expiry_reminder", "account_closure",
  "policy_renewal", "claim_status", "premium_due", "emi_reminder",
  "loan_disbursement", "credit_score_update", "sip_debit", "nav_update",
  "login_alert", "password_change", "suspicious_activity",
  "regulatory_update", "tax_statement",
];

export default function NotificationExplorerPage() {
  const { notifications, total, loading, error, filter, setFilter, refresh } =
    useNotificationStore();
  const [selected, setSelected] = useState<Notification | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    refresh();
  }, [filter, refresh]);

  const page = Math.floor((filter.skip ?? 0) / (filter.take ?? 20)) + 1;
  const totalPages = Math.ceil(total / (filter.take ?? 20));

  const goToPage = (p: number) => {
    setFilter({ skip: (p - 1) * (filter.take ?? 20) });
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "SENT": return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "FAILED": return <XCircle className="w-4 h-4 text-danger" />;
      case "PENDING": return <Clock className="w-4 h-4 text-warning" />;
      case "RETRYING": return <Loader2 className="w-4 h-4 text-info animate-spin" />;
      default: return <AlertTriangle className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text">Notification Explorer</h2>
        <p className="text-text-muted text-sm mt-1">
          Search and filter all notifications across channels
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={filter.search ?? ""}
            onChange={(e) => setFilter({ search: e.target.value || undefined })}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
            showFilters
              ? "bg-primary text-white border-primary"
              : "bg-surface text-text border-border hover:bg-border/30"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-surface rounded-xl border border-border p-4 grid grid-cols-2 lg:grid-cols-5 gap-4">
          <FilterSelect label="Status" value={filter.status ?? ""} options={STATUSES}
            onChange={(v) => setFilter({ status: v || undefined })} />
          <FilterSelect label="Channel" value={filter.channel ?? ""} options={CHANNELS}
            onChange={(v) => setFilter({ channel: v || undefined })} />
          <FilterSelect label="Event Type" value={filter.eventType ?? ""} options={EVENT_TYPES}
            onChange={(v) => setFilter({ eventType: v || undefined })} />
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Start Date</label>
            <input type="date" value={filter.startDate ?? ""}
              onChange={(e) => setFilter({ startDate: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">End Date</label>
            <input type="date" value={filter.endDate ?? ""}
              onChange={(e) => setFilter({ endDate: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-danger" />
          <p className="text-danger text-sm">{error}</p>
          <button onClick={refresh} className="ml-auto text-sm text-danger underline">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Event Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Channel</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && notifications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-5 w-16 rounded" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-28 mb-1" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-36" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-12" />
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <p className="text-text-muted text-sm">No notifications found</p>
                  </td>
                </tr>
              ) : (
                notifications.map((n) => (
                  <tr key={n.id} className="border-b border-border hover:bg-background/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {statusIcon(n.status)}
                        <span className="text-sm font-medium text-text capitalize">{n.status.toLowerCase()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text capitalize">{n.eventType.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 bg-border/30 rounded text-text-muted font-medium">{n.channel}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-text">{n.userName}</p>
                      <p className="text-xs text-text-muted">{n.userEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-muted">{new Date(n.createdAt).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(n)}
                        className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors">
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-text-muted">
              Showing {(filter.skip ?? 0) + 1}–{Math.min((filter.skip ?? 0) + (filter.take ?? 20), total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1}
                className="p-2 rounded-lg border border-border hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + Math.max(1, page - 2);
                if (p > totalPages) return null;
                return (
                  <button key={p} onClick={() => goToPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium ${
                      p === page ? "bg-primary text-white" : "hover:bg-background text-text"
                    }`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages}
                className="p-2 rounded-lg border border-border hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg bg-surface shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">Notification Detail</h3>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-background rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <DetailRow label="ID" value={selected.id} />
              <DetailRow label="Event ID" value={selected.eventId} />
              <DetailRow label="Event Type" value={selected.eventType.replace(/_/g, " ")} />
              <DetailRow label="Channel" value={selected.channel} />
              <DetailRow label="Status" value={selected.status} />
              <DetailRow label="User" value={`${selected.userName} (${selected.userEmail})`} />
              <DetailRow label="Created At" value={new Date(selected.createdAt).toLocaleString()} />
              {selected.error && (
                <div className="bg-danger/10 border border-danger/30 rounded-lg p-3">
                  <p className="text-xs font-medium text-danger mb-1">Error</p>
                  <p className="text-sm text-danger">{selected.error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-1">{label}</label>
      <select value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30">
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>{o.replace(/_/g, " ")}</option>
        ))}
      </select>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-muted mb-0.5">{label}</p>
      <p className="text-sm text-text break-all">{value}</p>
    </div>
  );
}