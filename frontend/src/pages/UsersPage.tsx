import { useState, useEffect, useCallback } from "react";
import { fetchUsers, updateUserPreferences, type User } from "../lib/api";
import Skeleton from "../components/ui/Skeleton";
import {
  Users,
  Search,
  Loader2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Settings2,
  X,
  CheckCircle2,
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);
  const take = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUsers({ skip: (page - 1) * take, take });
      setUsers(result.users);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(total / take);

  const handleSavePreferences = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateUserPreferences(editing.id, editing.preferences ?? {});
      setToast({ message: "Preferences updated", success: true });
      setEditing(null);
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to update preferences",
        success: false,
      });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filteredUsers = search
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text">Users</h2>
        <p className="text-text-muted text-sm mt-1">
          Manage users and their notification preferences
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            toast.success ? "bg-success/10 border-success/30" : "bg-danger/10 border-danger/30"
          }`}
        >
          {toast.success ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <XCircle className="w-5 h-5 text-danger" />
          )}
          <p className={`text-sm ${toast.success ? "text-success" : "text-danger"}`}>{toast.message}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-danger" />
          <p className="text-danger text-sm">{error}</p>
          <button onClick={load} className="ml-auto text-sm text-danger underline">Retry</button>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Channels</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-32 mb-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-36" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex gap-1">
                            <Skeleton className="h-5 w-14 rounded" />
                            <Skeleton className="h-5 w-12 rounded" />
                            <Skeleton className="h-5 w-10 rounded" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Users className="w-8 h-8 text-text-muted mx-auto mb-2" />
                    <p className="text-text-muted text-sm">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border hover:bg-background/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-text">{u.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-muted">{u.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-muted">{u.phone ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {(u.preferences?.channels ?? []).map((ch) => (
                          <span key={ch} className="text-xs px-2 py-0.5 bg-border/30 rounded text-text-muted font-medium">
                            {ch}
                          </span>
                        ))}
                        {(!u.preferences?.channels || u.preferences.channels.length === 0) && (
                          <span className="text-xs text-text-muted">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditing(u)}
                        className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
                      >
                        <Settings2 className="w-4 h-4" /> Preferences
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
              Showing {(page - 1) * take + 1}–{Math.min(page * take, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                className="p-2 rounded-lg border border-border hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-text-muted px-2">Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="p-2 rounded-lg border border-border hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Preferences Drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-md bg-surface shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">Edit Preferences</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-background rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm font-medium text-text mb-1">{editing.name}</p>
                <p className="text-xs text-text-muted">{editing.email}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">Channels</label>
                <div className="flex flex-wrap gap-2">
                  {["EMAIL", "SMS", "PUSH", "WHATSAPP", "IN_APP"].map((ch) => {
                    const selected = editing.preferences?.channels?.includes(ch) ?? false;
                    return (
                      <button
                        key={ch}
                        onClick={() => {
                          const current = editing.preferences?.channels ?? [];
                          const updated = selected
                            ? current.filter((c) => c !== ch)
                            : [...current, ch];
                          setEditing({
                            ...editing,
                            preferences: { ...editing.preferences, channels: updated },
                          });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          selected
                            ? "bg-primary text-white border-primary"
                            : "bg-background text-text-muted border-border hover:border-primary/50"
                        }`}
                      >
                        {ch}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Language</label>
                <input
                  type="text"
                  value={editing.preferences?.language ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      preferences: { ...editing.preferences, language: e.target.value },
                    })
                  }
                  placeholder="e.g. en, hi"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Quiet Hours Start</label>
                  <input
                    type="time"
                    value={editing.preferences?.quietHoursStart ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        preferences: { ...editing.preferences, quietHoursStart: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Quiet Hours End</label>
                  <input
                    type="time"
                    value={editing.preferences?.quietHoursEnd ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        preferences: { ...editing.preferences, quietHoursEnd: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                disabled={saving}
                className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}