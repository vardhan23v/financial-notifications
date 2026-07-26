"use strict";
/**
 * Messaging barrel — re-exports DLQ handler, idempotency middleware, and
 * correlation ID propagation utilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationRabbitMQHeaders = exports.correlationKafkaHeaders = exports.correlationMiddleware = exports.runWithCorrelationId = exports.getCorrelationId = exports.idempotencyMiddleware = exports.IdempotencyRepository = exports.DLQHandler = void 0;
var dlq_1 = require("./dlq");
Object.defineProperty(exports, "DLQHandler", { enumerable: true, get: function () { return dlq_1.DLQHandler; } });
var idempotency_1 = require("./idempotency");
Object.defineProperty(exports, "IdempotencyRepository", { enumerable: true, get: function () { return idempotency_1.IdempotencyRepository; } });
Object.defineProperty(exports, "idempotencyMiddleware", { enumerable: true, get: function () { return idempotency_1.idempotencyMiddleware; } });
var correlation_1 = require("./correlation");
Object.defineProperty(exports, "getCorrelationId", { enumerable: true, get: function () { return correlation_1.getCorrelationId; } });
Object.defineProperty(exports, "runWithCorrelationId", { enumerable: true, get: function () { return correlation_1.runWithCorrelationId; } });
Object.defineProperty(exports, "correlationMiddleware", { enumerable: true, get: function () { return correlation_1.correlationMiddleware; } });
Object.defineProperty(exports, "correlationKafkaHeaders", { enumerable: true, get: function () { return correlation_1.correlationKafkaHeaders; } });
Object.defineProperty(exports, "correlationRabbitMQHeaders", { enumerable: true, get: function () { return correlation_1.correlationRabbitMQHeaders; } });
//# sourceMappingURL=index.js.map