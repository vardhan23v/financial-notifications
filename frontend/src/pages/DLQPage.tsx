import { useState, useEffect, useCallback } from "react";
import { fetchDLQ, replayDLQEntry, type DLQEntry } from "../lib/api";
import {
  AlertTriangle,
  RefreshCw,
  Loader2,
  XCircle,
  CheckCircle2,
  RotateCcw,
  Eye,
  X,
} from "lucide-react";

export default function DLQPage() {
  const [entries, setEntries] = useState<DLQEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replaying, setReplaying] = useState<string | null>(null);
  const [selected, setSelected] = useState<DLQEntry | null>(null);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDLQ();
      setEntries(data.entries);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load DLQ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleReplay = async (id: string) => {
    setReplaying(id);
    try {
      await replayDLQEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setTotal((prev) => prev - 1);
      setToast({ message: "Event replayed successfully", success: true });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Replay failed",
        success: false,
      });
    } finally {
      setReplaying(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Dead Letter Queue</h2>
          <p className="text-text-muted text-sm mt-1">
            Failed events that exhausted retry attempts
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-background transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            toast.success
              ? "bg-success/10 border-success/30"
              : "bg-danger/10 border-danger/30"
          }`}
        >
          {toast.success ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <XCircle className="w-5 h-5 text-danger" />
          )}
          <p className={`text-sm ${toast.success ? "text-success" : "text-danger"}`}>
            {toast.message}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-danger" />
          <p className="text-danger text-sm">{error}</p>
          <button onClick={load} className="ml-auto text-sm text-danger underline">
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent/10 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">{total}</p>
            <p className="text-sm text-text-muted">Messages in DLQ</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Event ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Error</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Loader2 className="w-6 h-6 text-text-muted animate-spin mx-auto mb-2" />
                    <p className="text-text-muted text-sm">Loading DLQ...</p>
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="text-text-muted text-sm">DLQ is empty — all events processed successfully</p>
                  </td>
                </tr>
              ) : (
                entries.map((e) => (
                  <tr key={e.id} className="border-b border-border hover:bg-background/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-text">{e.eventId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text capitalize">{e.eventType.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-muted">{e.userId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-danger max-w-xs truncate block">{e.error}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-muted">{new Date(e.timestamp).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(e)}
                          className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                        <button
                          onClick={() => handleReplay(e.id)}
                          disabled={replaying === e.id}
                          className="flex items-center gap-1 text-sm text-success hover:text-success/80 transition-colors disabled:opacity-50"
                        >
                          {replaying === e.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RotateCcw className="w-4 h-4" />
                          )}
                          Replay
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg bg-surface shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">DLQ Entry Detail</h3>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-background rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <DetailRow label="ID" value={selected.id} />
              <DetailRow label="Event ID" value={selected.eventId} />
              <DetailRow label="Event Type" value={selected.eventType.replace(/_/g, " ")} />
              <DetailRow label="User ID" value={selected.userId} />
              <DetailRow label="Timestamp" value={new Date(selected.timestamp).toLocaleString()} />
              <div className="bg-danger/10 border border-danger/30 rounded-lg p-3">
                <p className="text-xs font-medium text-danger mb-1">Error</p>
                <p className="text-sm text-danger">{selected.error}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-muted mb-1">Payload</p>
                <pre className="bg-background rounded-lg p-3 text-xs text-text font-mono overflow-x-auto">
                  {JSON.stringify(selected.payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
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