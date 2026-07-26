"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logging_1 = require("../../../../src/logging");
// ---------------------------------------------------------------------------
// Error Handling Middleware — centralised error responses
// ---------------------------------------------------------------------------
function errorHandler(err, req, res, _next) {
    const log = (0, logging_1.getLogger)();
    log.error({ err, correlationId: req.correlationId }, "Unhandled error");
    const statusCode = err.statusCode ?? 500;
    const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message;
    res.status(statusCode).json({
        error: message,
        correlationId: req.correlationId,
    });
}
//# sourceMappingURL=error.js.map