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
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let sdk: NodeSDK | undefined;

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
export function initTracing(): NodeSDK {
  if (sdk) {
    return sdk;
  }

  const traceExporter = new OTLPTraceExporter({
    url:
      process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
      "http://localhost:4318/v1/traces",
  });

  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [SemanticResourceAttributes.SERVICE_NAME]:
        process.env.OTEL_SERVICE_NAME ?? "pro4",
      [SemanticResourceAttributes.SERVICE_VERSION]:
        process.env.npm_package_version ?? "1.0.0",
    }),
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        // Disable fs instrumentation — too noisy for a backend service
        "@opentelemetry/instrumentation-fs": { enabled: false },
      }),
    ],
  });

  sdk.start();

  return sdk;
}