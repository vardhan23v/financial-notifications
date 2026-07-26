import { createServer } from "./api/server";
import proxyRouter from "./routes/proxy";
import { getLogger } from "../../src/logging";
import { startMetricsServer } from "../../src/metrics";
import { initTracing } from "../../src/tracing";
import { gracefulShutdown } from "../../src/infrastructure";
import { startKafkaConsumer } from "./messaging/kafka-consumer";
import { startRabbitMQConsumer } from "./messaging/rabbitmq-consumer";

// ---------------------------------------------------------------------------
// Backend Entry Point
// ---------------------------------------------------------------------------

const PORT = Number(process.env.PORT) || 3000;
const METRICS_PORT = Number(process.env.METRICS_PORT) || 9090;

async function main(): Promise<void> {
  // Initialize tracing first
  initTracing();

  const log = getLogger();
  log.info("Backend starting...");

  // Start metrics server
  startMetricsServer(METRICS_PORT);

  // Start messaging consumers
  await startKafkaConsumer();
  await startRabbitMQConsumer();

  // Create and start HTTP server
  const app = createServer();

  // Register /api/proxy/website — fetches external websites server-side
  // and strips X-Frame-Options/CSP so the frontend can embed in an iframe.
  app.use("/api/proxy", proxyRouter);
  const server = app.listen(PORT, () => {
    log.info(`Backend API listening on :${PORT}`);
    log.info(`Metrics available on :${METRICS_PORT}/metrics`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    log.info({ signal }, "Shutting down...");
    server.close(async () => {
      await gracefulShutdown();
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
