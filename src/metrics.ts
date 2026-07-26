/**
 * Custom application metrics exposed via a Prometheus-compatible /metrics
 * endpoint.
 *
 * Metrics tracked:
 * - notifications_sent_total     — counter, incremented on successful delivery
 * - notifications_failed_total   — counter, incremented on delivery failure
 * - dlq_size                     — gauge, current number of DLQ entries
 * - consumer_lag                 — gauge, Kafka consumer lag in messages
 * - circuit_breaker_state        — gauge, 0=closed 1=half-open 2=open
 * - provider_health              — gauge, 0=unhealthy 1=healthy, per provider
 *
 * Usage:
 *   import { recordMetric } from "./metrics";
 *   recordMetric("notifications_sent_total", 1, { channel: "SMS" });
 */

import * as http from "http";

// ---------------------------------------------------------------------------
// Metric value store (in-memory, lock-free — acceptable for a demo)
// ---------------------------------------------------------------------------

interface MetricEntry {
  value: number;
  labels?: Record<string, string>;
}

type MetricType = "counter" | "gauge";

interface MetricDef {
  type: MetricType;
  help: string;
  entries: MetricEntry[];
}

const registry = new Map<string, MetricDef>();

// ---------------------------------------------------------------------------
// Register built-in metrics
// ---------------------------------------------------------------------------

function register(
  name: string,
  type: MetricType,
  help: string,
): void {
  if (!registry.has(name)) {
    registry.set(name, { type, help, entries: [] });
  }
}

// Counters
register("notifications_sent_total", "counter", "Total notifications successfully delivered");
register("notifications_failed_total", "counter", "Total notifications that failed delivery");

// Gauges
register("dlq_size", "gauge", "Current number of entries in the Dead Letter Queue");
register("consumer_lag", "gauge", "Kafka consumer lag in messages");
register("circuit_breaker_state", "gauge", "Circuit breaker state (0=closed, 1=half-open, 2=open)");
register("provider_health", "gauge", "Provider health status (0=unhealthy, 1=healthy)");

// ---------------------------------------------------------------------------
// recordMetric
// ---------------------------------------------------------------------------

/**
 * Records a metric value.
 *
 * For counters the value is added to the existing total. For gauges the
 * value replaces the previous reading.
 *
 * Labels are optional key-value pairs that produce Prometheus label dimensions
 * (e.g. `{channel="SMS"}`).
 */
export function recordMetric(
  name: string,
  value: number,
  labels?: Record<string, string>,
): void {
  const def = registry.get(name);
  if (!def) {
    // Unknown metric — silently ignore in production, log in dev
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(`[metrics] Unknown metric: ${name}`);
    }
    return;
  }

  if (def.type === "counter") {
    // For counters, find an existing entry with matching labels and increment
    const existing = def.entries.find(
      (e) => JSON.stringify(e.labels) === JSON.stringify(labels),
    );
    if (existing) {
      existing.value += value;
    } else {
      def.entries.push({ value, labels });
    }
  } else {
    // For gauges, replace the entry with matching labels
    const idx = def.entries.findIndex(
      (e) => JSON.stringify(e.labels) === JSON.stringify(labels),
    );
    if (idx >= 0) {
      def.entries[idx].value = value;
    } else {
      def.entries.push({ value, labels });
    }
  }
}

// ---------------------------------------------------------------------------
// Prometheus exposition format
// ---------------------------------------------------------------------------

function formatLabels(labels?: Record<string, string>): string {
  if (!labels || Object.keys(labels).length === 0) {
    return "";
  }
  const parts = Object.entries(labels).map(
    ([k, v]) => `${k}="${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`,
  );
  return `{${parts.join(",")}}`;
}

function renderMetrics(): string {
  const lines: string[] = [];

  for (const [name, def] of registry.entries()) {
    lines.push(`# HELP ${name} ${def.help}`);
    lines.push(`# TYPE ${name} ${def.type}`);

    if (def.entries.length === 0) {
      // Emit a zero-value line so the metric appears in Prometheus
      lines.push(`${name} 0`);
    } else {
      for (const entry of def.entries) {
        const labelStr = formatLabels(entry.labels);
        lines.push(`${name}${labelStr} ${entry.value}`);
      }
    }

    lines.push(""); // blank line between metric families
  }

  return lines.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// HTTP server for /metrics
// ---------------------------------------------------------------------------

let server: http.Server | undefined;

/**
 * Starts an HTTP server that exposes Prometheus metrics at GET /metrics.
 *
 * The port defaults to 9090 and can be overridden with METRICS_PORT.
 * The server also responds to GET /health with a 200 for liveness probes.
 */
export function startMetricsServer(port?: number): http.Server {
  if (server) {
    return server;
  }

  const metricsPort = port ?? (Number(process.env.METRICS_PORT) || 9090);

  server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/metrics") {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(renderMetrics());
      return;
    }

    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }

    res.writeHead(404);
    res.end("Not Found");
  });

  server.listen(metricsPort, () => {
    // eslint-disable-next-line no-console
    console.log(`[metrics] Prometheus metrics exposed on :${metricsPort}/metrics`);
  });

  return server;
}

/**
 * Stops the metrics HTTP server gracefully.
 */
export function stopMetricsServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }
    server.close((err) => {
      if (err) {
        reject(err);
      } else {
        server = undefined;
        resolve();
      }
    });
  });
}