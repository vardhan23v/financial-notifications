"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const correlation_1 = require("./middleware/correlation");
const logging_1 = require("./middleware/logging");
const error_1 = require("./middleware/error");
// ---------------------------------------------------------------------------
// Express Server Setup
// ---------------------------------------------------------------------------
function createServer() {
    const app = (0, express_1.default)();
    // Configure helmet: disable X-Frame-Options and CSP so the proxy route
    // can serve external websites in an iframe without those headers.
    app.use((0, helmet_1.default)({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: false,
    }));
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(correlation_1.correlationMiddleware);
    app.use(logging_1.requestLogger);
    app.use("/api", routes_1.default);
    // Prometheus metrics endpoint (reuses existing metrics server on :9090)
    // but also expose a simple /metrics here for convenience
    app.get("/metrics", (_req, res) => {
        res.setHeader("Content-Type", "text/plain");
        res.send("# Metrics available on :9090/metrics\n");
    });
    app.use(error_1.errorHandler);
    return app;
}
//# sourceMappingURL=server.js.map