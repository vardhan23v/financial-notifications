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
Object.defineProperty(exports, "__esModule", { value: true });
// Barrel export — re-exports all backend domain functions at the dist/ level
__exportStar(require("../backend/src/domain/events"), exports);
__exportStar(require("../backend/src/domain/schemas"), exports);
__exportStar(require("../backend/src/domain/factory"), exports);
__exportStar(require("../backend/src/domain/routing"), exports);
__exportStar(require("../backend/src/domain/scoring"), exports);
__exportStar(require("../backend/src/domain/channels"), exports);
__exportStar(require("../backend/src/domain/enrichment"), exports);
__exportStar(require("../backend/src/domain/circuit-breaker"), exports);
__exportStar(require("../backend/src/domain/idempotency"), exports);
__exportStar(require("../backend/src/domain/retry"), exports);
//# sourceMappingURL=index.js.map