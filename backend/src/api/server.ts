import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import proxyRouter from "../routes/proxy";
import { correlationMiddleware } from "./middleware/correlation";
import { requestLogger } from "./middleware/logging";
import { errorHandler } from "./middleware/error";

// ---------------------------------------------------------------------------
// Express Server Setup
// ---------------------------------------------------------------------------

export function createServer(): express.Application {
  const app = express();

  // Configure helmet: disable X-Frame-Options and CSP so the proxy route
  // can serve external websites in an iframe without those headers.
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }),
  );
  app.use(cors());
  app.use(express.json());
  app.use(correlationMiddleware);
  app.use(requestLogger);

  app.use("/api", routes);
  app.use("/api/proxy", proxyRouter);

  // Prometheus metrics endpoint (reuses existing metrics server on :9090)
  // but also expose a simple /metrics here for convenience
  app.get("/metrics", (_req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send("# Metrics available on :9090/metrics\n");
  });

  app.use(errorHandler);

  return app;
}
