import { v4 as uuidv4 } from "uuid";
import type { Request, Response, NextFunction } from "express";

// ---------------------------------------------------------------------------
// Correlation ID Middleware — attaches correlation ID to every request
// ---------------------------------------------------------------------------

declare global {
  namespace Express {
    interface Request {
      correlationId: string;
    }
  }
}

export function correlationMiddleware(req: Request, res: Response, next: NextFunction): void {
  const correlationId = req.headers["x-correlation-id"] as string | undefined;
  req.correlationId = correlationId ?? uuidv4();
  res.setHeader("x-correlation-id", req.correlationId);
  next();
}
