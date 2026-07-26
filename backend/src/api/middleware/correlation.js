"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationMiddleware = correlationMiddleware;
const uuid_1 = require("uuid");
function correlationMiddleware(req, res, next) {
    const correlationId = req.headers["x-correlation-id"];
    req.correlationId = correlationId ?? (0, uuid_1.v4)();
    res.setHeader("x-correlation-id", req.correlationId);
    next();
}
//# sourceMappingURL=correlation.js.map