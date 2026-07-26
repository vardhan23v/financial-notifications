import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { correlationMiddleware } from "./middleware/correlation";
import { requestLogger } from "./middleware/logging";
import { errorHandler } from "./middleware/error";

// ---------------------------------------------------------------------------
// Express Server Setup
// ---------------------------------------------------------------------------

export function createServer(): express.Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(correlationMiddleware);
  app.use(requestLogger);

  app.use("/api", routes);

  // Prometheus metrics endpoint (reuses existing metrics server on :9090)
  // but also expose a simple /metrics here for convenience
  app.get("/metrics", (_req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send("# Metrics available on :9090/metrics\n");
  });

  app.use(errorHandler);

  return app;
}
