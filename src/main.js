"use strict";
/**
 * Application entry point — wires channels, processor, and monitor into a
 * runnable demonstration of regulatory enforcement and DLQ handling.
 *
 * Initialises OpenTelemetry tracing, Pino structured logging, and Prometheus
 * metrics before processing demo events.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tracing_1 = require("./tracing");
const logging_1 = require("./logging");
const metrics_1 = require("./metrics");
const channels_1 = require("./channels");
const processor_1 = require("./processor");
const monitor_1 = require("./monitor");
// ---------------------------------------------------------------------------
// Bootstrap observability
// ---------------------------------------------------------------------------
// Tracing MUST be initialised before any other imports that create spans.
const sdk = (0, tracing_1.initTracing)();
const log = (0, logging_1.getLogger)();
// Start the Prometheus metrics endpoint (default :9090)
(0, metrics_1.startMetricsServer)();
const events = [
    {
        id: "evt-001",
        type: "margin_call",
        regulatoryChannel: "SMS", // SEBI mandates SMS for margin calls
        payload: { clientId: "C1001", marginShortfall: 50000 },
    },
    {
        id: "evt-002",
        type: "trade_confirmation",
        // No regulatory channel — falls back to user preferences
        payload: { clientId: "C1002", tradeId: "T2001", symbol: "RELIANCE" },
    },
    {
        id: "evt-003",
        type: "margin_call",
        regulatoryChannel: "SMS",
        payload: { clientId: "C1003", marginShortfall: 120000 },
    },
    {
        id: "evt-004",
        type: "portfolio_update",
        payload: { clientId: "C1004", nav: 450000 },
    },
];
// ---------------------------------------------------------------------------
// User preferences (simulated)
// ---------------------------------------------------------------------------
const userPreferences = {
    channels: ["EMAIL", "PUSH"],
};
// ---------------------------------------------------------------------------
// Notification handler (simulated — fails for margin calls to exercise DLQ)
// ---------------------------------------------------------------------------
async function notificationHandler(event) {
    const evt = event;
    const channels = await (0, channels_1.resolveChannels)(evt, userPreferences);
    if (channels.length === 0) {
        log.warn({ eventId: evt.id }, "No channels resolved for event");
        return;
    }
    log.info({ eventId: evt.id, type: evt.type, channels }, "Dispatching event");
    // Simulate a processing failure for margin calls to exercise the DLQ path
    if (evt.type === "margin_call") {
        const errMsg = `Simulated failure: unable to deliver ${evt.type} via ${channels[0]}`;
        (0, metrics_1.recordMetric)("notifications_failed_total", 1, { channel: channels[0], type: evt.type });
        throw new Error(errMsg);
    }
    // Simulate successful delivery for other event types
    (0, metrics_1.recordMetric)("notifications_sent_total", 1, { channel: channels[0], type: evt.type });
    log.info({ eventId: evt.id, channels }, "Event delivered successfully");
}
// ---------------------------------------------------------------------------
// Remediation hook (operations team / automated workflow)
// ---------------------------------------------------------------------------
(0, monitor_1.setRemediateHook)(async (event) => {
    const evt = event;
    log.info({ eventId: evt.id, type: evt.type }, "Attempting automated replay");
    // In a real system this would replay the event, escalate, or page on-call.
    // Here we simulate a successful remediation.
    return true;
});
// ---------------------------------------------------------------------------
// Main — process all demo events, then inspect the DLQ
// ---------------------------------------------------------------------------
async function main() {
    log.info("Event-Driven Notification Engine starting");
    // Process each event
    for (const event of events) {
        log.info({ eventId: event.id }, "Processing event");
        await (0, processor_1.dispatch)(event, notificationHandler, 3);
    }
    // --- DLQ Inspection ---
    const dlqEntries = (0, processor_1.getDLQ)();
    (0, metrics_1.recordMetric)("dlq_size", dlqEntries.length);
    log.info({ dlqCount: dlqEntries.length }, "DLQ inspection complete");
    for (const entry of dlqEntries) {
        log.warn({ event: entry.event, error: entry.error }, "DLQ entry");
    }
    // --- DLQ Alerts ---
    const alerts = (0, monitor_1.alertOnDLQ)();
    if (alerts.length === 0) {
        log.info("No alerts — DLQ is clean");
    }
    else {
        for (const alert of alerts) {
            log.warn(alert);
        }
    }
    // --- Remediation ---
    for (const entry of dlqEntries) {
        const { remediate } = require("./monitor");
        const result = await remediate(entry.event);
        log.info({ eventId: entry.event.id, remediated: result }, "Remediation result");
    }
    // --- Circuit breaker & provider health (simulated) ---
    (0, metrics_1.recordMetric)("circuit_breaker_state", 0, { provider: "sms" });
    (0, metrics_1.recordMetric)("circuit_breaker_state", 0, { provider: "email" });
    (0, metrics_1.recordMetric)("provider_health", 1, { provider: "sms" });
    (0, metrics_1.recordMetric)("provider_health", 1, { provider: "email" });
    (0, metrics_1.recordMetric)("consumer_lag", 0, { topic: "notifications", partition: "0" });
    log.info("Demo run complete");
    // Graceful shutdown
    await sdk.shutdown();
    await (0, metrics_1.stopMetricsServer)();
    log.info("Shutdown complete");
}
main().catch((err) => {
    log.fatal({ err }, "Fatal error");
    process.exit(1);
});
//# sourceMappingURL=main.js.map