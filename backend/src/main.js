"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./api/server");
const logging_1 = require("../../src/logging");
const metrics_1 = require("../../src/metrics");
const tracing_1 = require("../../src/tracing");
const infrastructure_1 = require("../../src/infrastructure");
const kafka_consumer_1 = require("./messaging/kafka-consumer");
const rabbitmq_consumer_1 = require("./messaging/rabbitmq-consumer");
// ---------------------------------------------------------------------------
// Backend Entry Point
// ---------------------------------------------------------------------------
const PORT = Number(process.env.PORT) || 3000;
const METRICS_PORT = Number(process.env.METRICS_PORT) || 9090;
async function main() {
    // Initialize tracing first
    (0, tracing_1.initTracing)();
    const log = (0, logging_1.getLogger)();
    log.info("Backend starting...");
    // Start metrics server
    (0, metrics_1.startMetricsServer)(METRICS_PORT);
    // Create and start HTTP server first so API endpoints are available
    // immediately, even if messaging consumers take time to connect.
    const app = (0, server_1.createServer)();
    const server = app.listen(PORT, () => {
        log.info(`Backend API listening on :${PORT}`);
        log.info(`Metrics available on :${METRICS_PORT}/metrics`);
        // Start messaging consumers in the background — don't block the HTTP server
        (0, kafka_consumer_1.startKafkaConsumer)().catch((err) => log.error({ err }, "Kafka consumer failed"));
        (0, rabbitmq_consumer_1.startRabbitMQConsumer)().catch((err) => log.error({ err }, "RabbitMQ consumer failed"));
    });
    // Graceful shutdown
    const shutdown = async (signal) => {
        log.info({ signal }, "Shutting down...");
        server.close(async () => {
            await (0, infrastructure_1.gracefulShutdown)();
            process.exit(0);
        });
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
}
main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map