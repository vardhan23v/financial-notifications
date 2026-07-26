"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTracing = initTracing;
const sdk_node_1 = require("@opentelemetry/sdk-node");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------
let sdk;
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
function initTracing() {
    if (sdk) {
        return sdk;
    }
    const traceExporter = new exporter_trace_otlp_http_1.OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
            "http://localhost:4318/v1/traces",
    });
    sdk = new sdk_node_1.NodeSDK({
        resource: (0, resources_1.resourceFromAttributes)({
            [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? "pro4",
            [semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version ?? "1.0.0",
        }),
        traceExporter,
        instrumentations: [
            (0, auto_instrumentations_node_1.getNodeAutoInstrumentations)({
                // Disable fs instrumentation — too noisy for a backend service
                "@opentelemetry/instrumentation-fs": { enabled: false },
            }),
        ],
    });
    sdk.start();
    return sdk;
}
//# sourceMappingURL=tracing.js.map