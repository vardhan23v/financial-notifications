import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Globe, ExternalLink, AlertTriangle, Loader2 } from "lucide-react";
import { fetchProxiedWebsite } from "../lib/api";

export default function WebsiteViewerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialUrl = searchParams.get("url") ?? "";
  const [inputValue, setInputValue] = useState(initialUrl);
  const [targetUrl, setTargetUrl] = useState(initialUrl);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) return;
    setLoading(true);
    setError(null);
    fetchProxiedWebsite(targetUrl)
      .then((html) => setHtmlContent(html))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load website"))
      .finally(() => setLoading(false));
  }, [targetUrl]);

  const isValidUrl = /^https?:\/\//i.test(targetUrl);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed) return;

      let normalized = trimmed;
      if (!/^https?:\/\//i.test(normalized)) {
        normalized = "https://" + normalized;
      }

      setTargetUrl(normalized);
      setSearchParams({ url: normalized }, { replace: true });
    },
    [inputValue, setSearchParams],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Website Viewer</h2>
          <p className="text-text-muted text-sm mt-1">
            Preview any website in a sandboxed iframe
          </p>
        </div>
      </div>

      {/* URL Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter a URL (e.g. example.com)"
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shrink-0"
        >
          Load
        </button>
      </form>

      {/* Iframe Viewer */}
      {isValidUrl && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background/50">
            <div className="flex items-center gap-2 text-sm text-text-muted min-w-0">
              <Globe className="w-4 h-4 shrink-0" />
              <span className="truncate">{targetUrl}</span>
            </div>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors shrink-0 ml-3"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open
            </a>
          </div>
          {loading && (
            <div className="flex items-center justify-center py-20 text-text-muted gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm">Loading website...</span>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center py-20 text-error gap-3">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          {htmlContent !== null && !loading && !error && (
            <iframe
              srcDoc={htmlContent}
              title="Website Viewer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              className="w-full border-0"
              style={{ height: "calc(100vh - 280px)", minHeight: "400px" }}
            />
          )}
        </div>
      )}

      {/* Empty State */}
      {!isValidUrl && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-3">
          <Globe className="w-16 h-16 opacity-20" />
          <p className="text-lg font-medium">No website loaded</p>
          <p className="text-sm">
            Enter a URL above to preview a website in the sandboxed viewer.
          </p>
          <div className="flex items-start gap-2 mt-2 bg-warning/10 border border-warning/30 rounded-lg px-4 py-3 max-w-md">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-warning">
              Websites are loaded through the server proxy to bypass{" "}
              <code className="bg-warning/20 px-1 rounded">X-Frame-Options</code>{" "}
              and CSP restrictions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}