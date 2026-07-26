import type { Request, Response, NextFunction } from "express";
import { getLogger } from "../../../../src/logging";

// ---------------------------------------------------------------------------
// Error Handling Middleware — centralised error responses
// ---------------------------------------------------------------------------

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const log = getLogger();
  log.error({ err, correlationId: req.correlationId }, "Unhandled error");

const statusCode = (err as unknown as Record<string, unknown>).statusCode as number | undefined ?? 500;
  const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message;

  res.status(statusCode).json({
    error: message,
    correlationId: req.correlationId,
  });
}
