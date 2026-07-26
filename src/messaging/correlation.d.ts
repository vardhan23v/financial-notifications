/**
 * Correlation ID middleware — attaches an `x-correlation-id` header to every
 * request and propagates it through AsyncLocalStorage so downstream code
 * (Kafka producers, RabbitMQ publishers, loggers) can include it without
 * threading it through every function signature.
 */
import type { Request, Response, NextFunction } from "express";
/**
 * Returns the correlation ID for the current async execution context.
 * Returns `undefined` when called outside of a request scope (e.g. during
 * startup or in a background job that hasn't been wrapped).
 */
export declare function getCorrelationId(): string | undefined;
/**
 * Runs `fn` inside a synthetic correlation context. Useful for background
 * jobs, Kafka consumers, and other non-HTTP entry points that still need
 * traceability.
 */
export declare function runWithCorrelationId<T>(correlationId: string, fn: () => T): T;
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
export declare function correlationMiddleware(req: Request, res: Response, next: NextFunction): void;
/**
 * Returns a Kafka headers object containing the current correlation ID.
 * Safe to call outside of a request context — returns an empty array.
 */
export declare function correlationKafkaHeaders(): {
    "x-correlation-id"?: string;
};
/**
 * Returns a RabbitMQ headers object containing the current correlation ID.
 * Safe to call outside of a request context — returns an empty object.
 */
export declare function correlationRabbitMQHeaders(): Record<string, string>;
//# sourceMappingURL=correlation.d.ts.map