import { useState, useEffect } from "react";
import { submitEvent, fetchEventTypes } from "../lib/api";
import { Zap, Loader2, CheckCircle2, XCircle, Plus, Trash2 } from "lucide-react";

interface FormEntry {
  id: string;
  type: string;
  userId: string;
  payloadJson: string;
}

export default function EventSimulatorPage() {
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [entries, setEntries] = useState<FormEntry[]>([
    { id: crypto.randomUUID(), type: "trade_confirmation", userId: "", payloadJson: "{}" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<Array<{ id: string; success: boolean; message: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEventTypes()
      .then(setEventTypes)
      .catch(() => setEventTypes([]));
  }, []);

  const updateEntry = (id: string, field: keyof FormEntry, value: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  };

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "trade_confirmation", userId: "", payloadJson: "{}" },
    ]);
  };

  const removeEntry = (id: string) => {
    if (entries.length <= 1) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setResults([]);

    const outcomes: Array<{ id: string; success: boolean; message: string }> = [];

    for (const entry of entries) {
      if (!entry.userId.trim()) {
        outcomes.push({ id: entry.id, success: false, message: "User ID is required" });
        continue;
      }
      let payload: Record<string, unknown>;
      try {
        payload = JSON.parse(entry.payloadJson);
      } catch {
        outcomes.push({ id: entry.id, success: false, message: "Invalid JSON payload" });
        continue;
      }
      try {
        const result = await submitEvent({
          type: entry.type,
          userId: entry.userId,
          payload,
        });
        outcomes.push({ id: entry.id, success: true, message: `Event created: ${result.id}` });
      } catch (err) {
        outcomes.push({
          id: entry.id,
          success: false,
          message: err instanceof Error ? err.message : "Submission failed",
        });
      }
    }

    setResults(outcomes);
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Event Simulator</h2>
          <p className="text-text-muted text-sm mt-1">
            Create and publish events to Kafka for testing
          </p>
        </div>
        <button
          onClick={addEntry}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-background transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Event Entries */}
      <div className="space-y-4">
        {entries.map((entry, idx) => (
          <div key={entry.id} className="bg-surface rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text">Event #{idx + 1}</h3>
              {entries.length > 1 && (
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Event Type</label>
                <select
                  value={entry.type}
                  onChange={(e) => updateEntry(entry.id, "type", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">User ID</label>
                <input
                  type="text"
                  placeholder="e.g. user-001"
                  value={entry.userId}
                  onChange={(e) => updateEntry(entry.id, "userId", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Payload (JSON)</label>
                <textarea
                  rows={3}
                  value={entry.payloadJson}
                  onChange={(e) => updateEntry(entry.id, "payloadJson", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text font-mono placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {submitting ? "Publishing..." : "Publish Events"}
        </button>
        {error && (
          <div className="flex items-center gap-2 text-danger text-sm">
            <XCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-5 space-y-3">
          <h3 className="font-semibold text-text">Results</h3>
          {results.map((r) => (
            <div
              key={r.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                r.success ? "bg-success/5 border border-success/20" : "bg-danger/5 border border-danger/20"
              }`}
            >
              {r.success ? (
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-danger shrink-0" />
              )}
              <p className={`text-sm ${r.success ? "text-success" : "text-danger"}`}>
                {r.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}