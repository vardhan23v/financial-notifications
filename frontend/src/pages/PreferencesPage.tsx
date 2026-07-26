import { useState, useEffect, useCallback } from "react";
import {
  fetchUsers,
  updateUserPreferences,
  type User,
} from "../lib/api";
import Skeleton from "../components/ui/Skeleton";
import {
  Settings2,
  Loader2,
  XCircle,
  CheckCircle2,
  Moon,
  Bell,
  Globe,
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ALL_CHANNELS = ["EMAIL", "SMS", "PUSH", "WHATSAPP", "IN_APP"] as const;

const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Europe/London",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Australia/Sydney",
  "Pacific/Auckland",
];

interface PerChannelPrefs {
  enabled: boolean;
  dndOverride: boolean;
}

interface UserPrefs {
  channels: string[];
  quietHoursStart: string;
  quietHoursEnd: string;
  timezone: string;
  dndOverrides: Record<string, PerChannelPrefs>;
}

function defaultPrefs(): UserPrefs {
  const dndOverrides: Record<string, PerChannelPrefs> = {};
  for (const ch of ALL_CHANNELS) {
    dndOverrides[ch] = { enabled: true, dndOverride: false };
  }
  return {
    channels: ["EMAIL"],
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    timezone: "Asia/Kolkata",
    dndOverrides,
  };
}

export default function PreferencesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [prefs, setPrefs] = useState<UserPrefs>(defaultPrefs());
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

  const openUser = (user: User) => {
    setSelectedUser(user);
    const p = defaultPrefs();
    if (user.preferences?.channels) {
      p.channels = user.preferences.channels;
    }
    if (user.preferences?.quietHoursStart) {
      p.quietHoursStart = user.preferences.quietHoursStart;
    }
    if (user.preferences?.quietHoursEnd) {
      p.quietHoursEnd = user.preferences.quietHoursEnd;
    }
    // timezone is not stored on the backend yet, default to Asia/Kolkata
    p.timezone = "Asia/Kolkata";
    setPrefs(p);
  };

  const toggleChannel = (ch: string) => {
    setPrefs((prev) => {
      const channels = prev.channels.includes(ch)
        ? prev.channels.filter((c) => c !== ch)
        : [...prev.channels, ch];
      return { ...prev, channels };
    });
  };

  const toggleDndOverride = (ch: string) => {
    setPrefs((prev) => ({
      ...prev,
      dndOverrides: {
        ...prev.dndOverrides,
        [ch]: {
          ...prev.dndOverrides[ch],
          dndOverride: !prev.dndOverrides[ch].dndOverride,
        },
      },
    }));
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await updateUserPreferences(selectedUser.id, {
        channels: prefs.channels,
        quietHoursStart: prefs.quietHoursStart || null,
        quietHoursEnd: prefs.quietHoursEnd || null,
        language: "en-IN",
      });
      setToast({ message: "Preferences saved", success: true });
      setSelectedUser(null);
      load();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to save preferences",
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
        <h2 className="text-2xl font-bold text-text">User Preferences</h2>
        <p className="text-text-muted text-sm mt-1">
          Configure per-channel notification preferences, quiet hours, and DND overrides
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

      {/* User Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Channels</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Quiet Hours</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                        <div className="flex-1"><Skeleton className="h-4 w-32" /></div>
                        <div className="flex-1"><Skeleton className="h-4 w-48" /></div>
                        <div className="flex-1">
                          <div className="flex gap-1">
                            <Skeleton className="h-5 w-14 rounded" />
                            <Skeleton className="h-5 w-12 rounded" />
                          </div>
                        </div>
                        <div className="flex-1"><Skeleton className="h-4 w-28" /></div>
                        <div className="flex-1"><Skeleton className="h-4 w-20" /></div>
                      </div>
                    ))}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Settings2 className="w-8 h-8 text-text-muted mx-auto mb-2" />
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
                      {u.preferences?.quietHoursStart && u.preferences?.quietHoursEnd ? (
                        <span className="text-xs text-text-muted">
                          {u.preferences.quietHoursStart} – {u.preferences.quietHoursEnd}
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openUser(u)}
                        className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
                      >
                        <Settings2 className="w-4 h-4" /> Configure
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

      {/* Preferences Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-lg bg-surface shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">Configure Preferences</h3>
              <button onClick={() => setSelectedUser(null)} className="p-1 hover:bg-background rounded">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* User info */}
              <div>
                <p className="text-sm font-medium text-text">{selectedUser.name}</p>
                <p className="text-xs text-text-muted">{selectedUser.email}</p>
              </div>

              {/* Per-Channel Preferences */}
              <section>
                <h4 className="text-sm font-semibold text-text flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-text-muted" />
                  Channel Preferences
                </h4>
                <div className="space-y-2">
                  {ALL_CHANNELS.map((ch) => {
                    const active = prefs.channels.includes(ch);
                    return (
                      <div
                        key={ch}
                        className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleChannel(ch)}
                            className={`w-10 h-6 rounded-full transition-colors relative ${
                              active ? "bg-primary" : "bg-border"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                active ? "left-[18px]" : "left-[2px]"
                              }`}
                            />
                          </button>
                          <span className="text-sm font-medium text-text">{ch.replace("_", " ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-text-muted">DND Override</label>
                          <button
                            onClick={() => toggleDndOverride(ch)}
                            className={`w-10 h-6 rounded-full transition-colors relative ${
                              prefs.dndOverrides[ch]?.dndOverride ? "bg-warning" : "bg-border"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                prefs.dndOverrides[ch]?.dndOverride ? "left-[18px]" : "left-[2px]"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Quiet Hours */}
              <section>
                <h4 className="text-sm font-semibold text-text flex items-center gap-2 mb-3">
                  <Moon className="w-4 h-4 text-text-muted" />
                  Quiet Hours
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Start Time</label>
                    <input
                      type="time"
                      value={prefs.quietHoursStart}
                      onChange={(e) => setPrefs({ ...prefs, quietHoursStart: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">End Time</label>
                    <input
                      type="time"
                      value={prefs.quietHoursEnd}
                      onChange={(e) => setPrefs({ ...prefs, quietHoursEnd: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </section>

              {/* Timezone */}
              <section>
                <h4 className="text-sm font-semibold text-text flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-text-muted" />
                  Timezone
                </h4>
                <select
                  value={prefs.timezone}
                  onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </section>

              {/* DND Override Summary */}
              <section>
                <h4 className="text-sm font-semibold text-text flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-text-muted" />
                  DND Override Summary
                </h4>
                <div className="bg-background rounded-lg border border-border p-3">
                  <p className="text-xs text-text-muted mb-2">
                    Channels with DND override enabled will bypass TRAI DND restrictions for transactional messages.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ALL_CHANNELS.filter((ch) => prefs.dndOverrides[ch]?.dndOverride).map((ch) => (
                      <span key={ch} className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded font-medium">
                        {ch}
                      </span>
                    ))}
                    {ALL_CHANNELS.every((ch) => !prefs.dndOverrides[ch]?.dndOverride) && (
                      <span className="text-xs text-text-muted">No DND overrides active</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Save */}
              <button
                onClick={handleSave}
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