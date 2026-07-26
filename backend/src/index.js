"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = exports.apiRoutes = void 0;
__exportStar(require("./domain/events"), exports);
__exportStar(require("./domain/schemas"), exports);
__exportStar(require("./domain/factory"), exports);
__exportStar(require("./domain/routing"), exports);
__exportStar(require("./domain/scoring"), exports);
__exportStar(require("./domain/channels"), exports);
__exportStar(require("./domain/enrichment"), exports);
__exportStar(require("./domain/circuit-breaker"), exports);
__exportStar(require("./domain/idempotency"), exports);
__exportStar(require("./domain/retry"), exports);
__exportStar(require("./domain/templates"), exports);
__exportStar(require("./repositories/user"), exports);
__exportStar(require("./repositories/notification"), exports);
__exportStar(require("./repositories/template"), exports);
__exportStar(require("./repositories/provider"), exports);
__exportStar(require("./repositories/regulatory"), exports);
__exportStar(require("./services/system-status"), exports);
__exportStar(require("./services/event-ingestion"), exports);
__exportStar(require("./services/notification-search"), exports);
__exportStar(require("./services/message-processor"), exports);
__exportStar(require("./services/delivery"), exports);
var routes_1 = require("./api/routes");
Object.defineProperty(exports, "apiRoutes", { enumerable: true, get: function () { return __importDefault(routes_1).default; } });
var server_1 = require("./api/server");
Object.defineProperty(exports, "createServer", { enumerable: true, get: function () { return server_1.createServer; } });
//# sourceMappingURL=index.js.map