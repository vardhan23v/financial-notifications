import { useEffect } from "react";
import { useProviderStore } from "../stores/providers";
import {
  Server,
  ToggleLeft,
  ToggleRight,
  Loader2,
  XCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function ProvidersPage() {
  const { providers, loading, error, refresh, toggle } = useProviderStore();

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Delivery Providers</h2>
          <p className="text-text-muted text-sm mt-1">
            Manage notification delivery providers and their status
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-background transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-danger" />
          <p className="text-danger text-sm">{error}</p>
          <button onClick={refresh} className="ml-auto text-sm text-danger underline">
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && providers.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-text-muted animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {providers.map((p) => (
            <div
              key={p.id}
              className={`bg-surface rounded-xl border p-5 ${
                p.isActive ? "border-success/20" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      p.isActive ? "bg-success/10" : "bg-text-muted/10"
                    }`}
                  >
                    <Server
                      className={`w-5 h-5 ${
                        p.isActive ? "text-success" : "text-text-muted"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{p.name}</h3>
                    <p className="text-xs text-text-muted">{p.channel}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggle(p.id, !p.isActive)}
                  className="p-1 hover:bg-background rounded-lg transition-colors"
                  title={p.isActive ? "Disable" : "Enable"}
                >
                  {p.isActive ? (
                    <ToggleRight className="w-8 h-8 text-success" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-text-muted" />
                  )}
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    p.isActive
                      ? "bg-success/10 text-success"
                      : "bg-text-muted/10 text-text-muted"
                  }`}
                >
                  {p.isActive ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
          {providers.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <Server className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">No providers configured</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}