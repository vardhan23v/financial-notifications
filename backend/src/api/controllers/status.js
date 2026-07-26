"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = getStatus;
const system_status_1 = require("../../services/system-status");
async function getStatus(req, res) {
    const status = await (0, system_status_1.getSystemStatus)();
    res.json(status);
}
//# sourceMappingURL=status.js.map