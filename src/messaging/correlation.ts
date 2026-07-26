/**
 * Correlation ID middleware — attaches an `x-correlation-id` header to every
 * request and propagates it through AsyncLocalStorage so downstream code
 * (Kafka producers, RabbitMQ publishers, loggers) can include it without
 * threading it through every function signature.
 */

import { AsyncLocalStorage } from "node:async_hooks";
import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

// ---------------------------------------------------------------------------
// AsyncLocalStorage context
// ---------------------------------------------------------------------------

interface CorrelationContext {
  correlationId: string;
}

const storage = new AsyncLocalStorage<CorrelationContext>();

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const HEADER_CORRELATION_ID = "x-correlation-id";

/**
 * Returns the correlation ID for the current async execution context.
 * Returns `undefined` when called outside of a request scope (e.g. during
 * startup or in a background job that hasn't been wrapped).
 */
export function getCorrelationId(): string | undefined {
  return storage.getStore()?.correlationId;
}

/**
 * Runs `fn` inside a synthetic correlation context. Useful for background
 * jobs, Kafka consumers, and other non-HTTP entry points that still need
 * traceability.
 */
export function runWithCorrelationId<T>(
  correlationId: string,
  fn: () => T,
): T {
  return storage.run({ correlationId }, fn);
}

// ---------------------------------------------------------------------------
// Express middleware
// ---------------------------------------------------------------------------

/**
 * Express middleware that ensures every request carries an
 * `x-correlation-id` header.
 *
 * - If the client already sent one it is reused (trusted upstream).
 * - Otherwise a new UUIDv4 is generated.
 *
 * The correlation ID is stored in AsyncLocalStorage so any code running
 * within the request lifecycle can retrieve it via `getCorrelationId()`.
 */
export function correlationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const incoming = req.headers[HEADER_CORRELATION_ID];
  const correlationId: string =
    typeof incoming === "string" && incoming.length > 0
      ? incoming
      : uuidv4();

  // Always set the response header so callers can trace their request
  res.setHeader(HEADER_CORRELATION_ID, correlationId);

  storage.run({ correlationId }, () => {
    next();
  });
}

// ---------------------------------------------------------------------------
// Kafka / RabbitMQ header helpers
// ---------------------------------------------------------------------------

/**
 * Returns a Kafka headers object containing the current correlation ID.
 * Safe to call outside of a request context — returns an empty array.
 */
export function correlationKafkaHeaders(): { "x-correlation-id"?: string } {
  const cid = getCorrelationId();
  return cid ? { "x-correlation-id": cid } : {};
}

/**
 * Returns a RabbitMQ headers object containing the current correlation ID.
 * Safe to call outside of a request context — returns an empty object.
 */
export function correlationRabbitMQHeaders(): Record<string, string> {
  const cid = getCorrelationId();
  return cid ? { "x-correlation-id": cid } : {};
}