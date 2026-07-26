"use strict";
/**
 * Correlation ID middleware — attaches an `x-correlation-id` header to every
 * request and propagates it through AsyncLocalStorage so downstream code
 * (Kafka producers, RabbitMQ publishers, loggers) can include it without
 * threading it through every function signature.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorrelationId = getCorrelationId;
exports.runWithCorrelationId = runWithCorrelationId;
exports.correlationMiddleware = correlationMiddleware;
exports.correlationKafkaHeaders = correlationKafkaHeaders;
exports.correlationRabbitMQHeaders = correlationRabbitMQHeaders;
const node_async_hooks_1 = require("node:async_hooks");
const uuid_1 = require("uuid");
const storage = new node_async_hooks_1.AsyncLocalStorage();
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
const HEADER_CORRELATION_ID = "x-correlation-id";
/**
 * Returns the correlation ID for the current async execution context.
 * Returns `undefined` when called outside of a request scope (e.g. during
 * startup or in a background job that hasn't been wrapped).
 */
function getCorrelationId() {
    return storage.getStore()?.correlationId;
}
/**
 * Runs `fn` inside a synthetic correlation context. Useful for background
 * jobs, Kafka consumers, and other non-HTTP entry points that still need
 * traceability.
 */
function runWithCorrelationId(correlationId, fn) {
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
function correlationMiddleware(req, res, next) {
    const incoming = req.headers[HEADER_CORRELATION_ID];
    const correlationId = typeof incoming === "string" && incoming.length > 0
        ? incoming
        : (0, uuid_1.v4)();
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
function correlationKafkaHeaders() {
    const cid = getCorrelationId();
    return cid ? { "x-correlation-id": cid } : {};
}
/**
 * Returns a RabbitMQ headers object containing the current correlation ID.
 * Safe to call outside of a request context — returns an empty object.
 */
function correlationRabbitMQHeaders() {
    const cid = getCorrelationId();
    return cid ? { "x-correlation-id": cid } : {};
}
//# sourceMappingURL=correlation.js.map