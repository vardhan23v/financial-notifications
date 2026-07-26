/**
 * OpenTelemetry tracing initialisation.
 *
 * Configures the NodeSDK with:
 * - OTLP HTTP trace exporter (configurable via OTEL_EXPORTER_OTLP_ENDPOINT)
 * - Auto-instrumentation for HTTP, gRPC, Redis, Kafka, and more
 * - Resource attributes identifying this service
 *
 * Call `initTracing()` once at application startup, before any other imports
 * that create spans. The returned NodeSDK must be shut down during graceful
 * shutdown to flush pending spans.
 */
import { NodeSDK } from "@opentelemetry/sdk-node";
/**
 * Initialises the OpenTelemetry NodeSDK and returns it.
 *
 * The caller is responsible for calling `sdk.shutdown()` during graceful
 * shutdown so that pending spans are flushed before the process exits.
 *
 * Environment variables that influence behaviour:
 * - `OTEL_EXPORTER_OTLP_ENDPOINT` — OTLP collector URL (default: http://localhost:4318/v1/traces)
 * - `OTEL_SERVICE_NAME` — overrides the default service name "pro4"
 * - `OTEL_TRACES_SAMPLER` — sampling strategy (default: "always_on")
 */
export declare function initTracing(): NodeSDK;
//# sourceMappingURL=tracing.d.ts.map