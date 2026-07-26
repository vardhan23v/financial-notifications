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
/**
 * Records a metric value.
 *
 * For counters the value is added to the existing total. For gauges the
 * value replaces the previous reading.
 *
 * Labels are optional key-value pairs that produce Prometheus label dimensions
 * (e.g. `{channel="SMS"}`).
 */
export declare function recordMetric(name: string, value: number, labels?: Record<string, string>): void;
/**
 * Starts an HTTP server that exposes Prometheus metrics at GET /metrics.
 *
 * The port defaults to 9090 and can be overridden with METRICS_PORT.
 * The server also responds to GET /health with a 200 for liveness probes.
 */
export declare function startMetricsServer(port?: number): http.Server;
/**
 * Stops the metrics HTTP server gracefully.
 */
export declare function stopMetricsServer(): Promise<void>;
//# sourceMappingURL=metrics.d.ts.map