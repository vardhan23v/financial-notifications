import { useState, useEffect, useCallback } from "react";
import Skeleton from "../components/ui/Skeleton";
import {
  fetchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  type Template,
} from "../lib/api";
import {
  FileText,
  Plus,
  Loader2,
  XCircle,
  CheckCircle2,
  Pencil,
  Trash2,
  X,
  ToggleLeft,
  ToggleRight,
  Eye,
  Globe,
} from "lucide-react";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [_total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  // Form state
  const [formEventType, setFormEventType] = useState("trade_confirmation");
  const [formChannel, setFormChannel] = useState("EMAIL");
  const [formSubject, setFormSubject] = useState("");
  const [formBody, setFormBody] = useState("");

  // Locale & preview
  const [previewLocale, setPreviewLocale] = useState("en-IN");
  const [previewVars, setPreviewVars] = useState("");
  const [previewOutput, setPreviewOutput] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);

  const LOCALES = [
    { code: "en-IN", label: "English (India)" },
    { code: "hi-IN", label: "हिन्दी (India)" },
    { code: "bn-IN", label: "বাংলা (India)" },
    { code: "ta-IN", label: "தமிழ் (India)" },
    { code: "te-IN", label: "తెలుగు (India)" },
    { code: "mr-IN", label: "मराठी (India)" },
    { code: "gu-IN", label: "ગુજરાતી (India)" },
    { code: "kn-IN", label: "ಕನ್ನಡ (India)" },
    { code: "ml-IN", label: "മലയാളം (India)" },
    { code: "pa-IN", label: "ਪੰਜਾਬੀ (India)" },
    { code: "or-IN", label: "ଓଡ଼ିଆ (India)" },
  ];

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTemplates();
      setTemplates(result.templates);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setFormEventType("trade_confirmation");
    setFormChannel("EMAIL");
    setFormSubject("");
    setFormBody("");
    setEditing(null);
    setShowForm(false);
  };

  const handleCreate = async () => {
    if (!formSubject.trim() || !formBody.trim()) return;
    setSaving(true);
    try {
      await createTemplate({
        eventType: formEventType,
        channel: formChannel,
        subject: formSubject,
        body: formBody,
      });
      setToast({ message: "Template created", success: true });
      resetForm();
      load();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to create template",
        success: false,
      });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateTemplate(editing.id, {
        subject: formSubject,
        body: formBody,
      });
      setToast({ message: "Template updated", success: true });
      resetForm();
      load();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to update template",
        success: false,
      });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleToggle = async (t: Template) => {
    try {
      await updateTemplate(t.id, { isActive: !t.isActive });
      load();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to toggle template",
        success: false,
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    try {
      await deleteTemplate(id);
      setToast({ message: "Template deleted", success: true });
      load();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to delete template",
        success: false,
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const startEdit = (t: Template) => {
    setEditing(t);
    setFormEventType(t.eventType);
    setFormChannel(t.channel);
    setFormSubject(t.subject);
    setFormBody(t.body);
    setShowForm(true);
  };

  const handlePreview = () => {
    setPreviewing(true);
    setPreviewOutput(null);
    try {
      let vars: Record<string, unknown> = {};
      if (previewVars.trim()) {
        vars = JSON.parse(previewVars);
      }
      // Simple Handlebars-style interpolation for preview
      let rendered = formBody;
      for (const [key, value] of Object.entries(vars)) {
        rendered = rendered.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), String(value));
      }
      setPreviewOutput(rendered);
    } catch {
      setPreviewOutput("Error: Invalid JSON in variables");
    } finally {
      setPreviewing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Notification Templates</h2>
          <p className="text-text-muted text-sm mt-1">
            Manage message templates for each event type and channel
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
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

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text">
              {editing ? "Edit Template" : "New Template"}
            </h3>
            <button onClick={resetForm} className="p-1 hover:bg-background rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Event Type</label>
              <select
                value={formEventType}
                onChange={(e) => setFormEventType(e.target.value)}
                disabled={!!editing}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              >
                {[
                  "margin_call", "trade_confirmation", "order_status", "price_alert",
                  "portfolio_update", "dividend_credit", "corporate_action",
                  "payment_confirmation", "large_transaction_alert", "upi_collect_request",
                  "kyc_update", "kyc_expiry_reminder", "account_closure",
                  "policy_renewal", "claim_status", "premium_due", "emi_reminder",
                  "loan_disbursement", "credit_score_update", "sip_debit", "nav_update",
                  "login_alert", "password_change", "suspicious_activity",
                  "regulatory_update", "tax_statement",
                ].map((t) => (
                  <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Channel</label>
              <select
                value={formChannel}
                onChange={(e) => setFormChannel(e.target.value)}
                disabled={!!editing}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              >
                {["EMAIL", "SMS", "PUSH", "WHATSAPP", "IN_APP"].map((ch) => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Subject</label>
            <input
              type="text"
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              placeholder="Notification subject line"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Body</label>
            <textarea
              rows={4}
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              placeholder="Template body with {{variables}}"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text font-mono placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                <Globe className="w-3.5 h-3.5 inline mr-1" />
                Preview Locale
              </label>
              <select
                value={previewLocale}
                onChange={(e) => setPreviewLocale(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {LOCALES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Preview Variables (JSON)
              </label>
              <input
                type="text"
                value={previewVars}
                onChange={(e) => setPreviewVars(e.target.value)}
                placeholder='{"name":"John","amount":"₹5,000"}'
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text font-mono placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Preview Output */}
          {previewOutput !== null && (
            <div className="bg-background border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-text-muted" />
                <span className="text-xs font-medium text-text-muted">Preview ({previewLocale})</span>
              </div>
              <div className="bg-white rounded border border-border p-3 text-sm text-text whitespace-pre-wrap font-sans">
                {previewOutput}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={editing ? handleUpdate : handleCreate}
              disabled={saving || !formSubject.trim() || !formBody.trim()}
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? "Update" : "Create"}
            </button>
            <button
              onClick={handlePreview}
              disabled={!formBody.trim()}
              className="px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text hover:bg-background transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              {previewing ? "Rendering..." : "Preview"}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text hover:bg-background transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Event Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Channel</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-36" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-5 w-16 rounded" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-56" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <FileText className="w-8 h-8 text-text-muted mx-auto mb-2" />
                    <p className="text-text-muted text-sm">No templates configured</p>
                  </td>
                </tr>
              ) : (
                templates.map((t) => (
                  <tr key={t.id} className="border-b border-border hover:bg-background/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm text-text capitalize">{t.eventType.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 bg-border/30 rounded text-text-muted font-medium">{t.channel}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text truncate max-w-xs block">{t.subject}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(t)} className="p-1">
                        {t.isActive ? (
                          <ToggleRight className="w-8 h-8 text-success" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-text-muted" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEdit(t)}
                          className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(t.id)}
                          className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}