"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const logging_1 = require("../../../../src/logging");
// ---------------------------------------------------------------------------
// Request Logging Middleware — logs incoming requests
// ---------------------------------------------------------------------------
function requestLogger(req, res, next) {
    const log = (0, logging_1.getLogger)();
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        log.info({
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            correlationId: req.correlationId,
        }, `${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
}
//# sourceMappingURL=logging.js.map