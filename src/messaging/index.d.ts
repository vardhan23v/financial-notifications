/**
 * Messaging barrel — re-exports DLQ handler, idempotency middleware, and
 * correlation ID propagation utilities.
 */
export { DLQHandler } from "./dlq";
export type { DLQRecord } from "./dlq";
export { IdempotencyRepository, idempotencyMiddleware } from "./idempotency";
export type { IdempotencyRecord } from "./idempotency";
export { getCorrelationId, runWithCorrelationId, correlationMiddleware, correlationKafkaHeaders, correlationRabbitMQHeaders, } from "./correlation";
//# sourceMappingURL=index.d.ts.map