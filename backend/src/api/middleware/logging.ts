import type { Request, Response, NextFunction } from "express";
import { getLogger } from "../../../../src/logging";

// ---------------------------------------------------------------------------
// Request Logging Middleware — logs incoming requests
// ---------------------------------------------------------------------------

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const log = getLogger();
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    log.info(
      {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        correlationId: req.correlationId,
      },
      `${req.method} ${req.path} ${res.statusCode} ${duration}ms`,
    );
  });

  next();
}
