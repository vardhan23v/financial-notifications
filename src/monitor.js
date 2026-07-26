"use strict";
/**
 * DLQ monitor and remediation hooks.
 *
 * alertOnDLQ() inspects the current DLQ and generates alert messages for the
 * operations team. remediate() is an async hook that operations teams can
 * override to plug in automated remediation workflows (e.g. replay, escalate,
 * or notify a human operator).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.remediate = void 0;
exports.alertOnDLQ = alertOnDLQ;
exports.setRemediateHook = setRemediateHook;
const processor_1 = require("./processor");
/**
 * Generates alert messages for every entry currently sitting in the DLQ.
 * Returns an empty array when the DLQ is clean.
 */
function alertOnDLQ() {
    const entries = (0, processor_1.getDLQ)();
    if (entries.length === 0) {
        return [];
    }
    return entries.map((entry, index) => {
        const eventSummary = typeof entry.event === "object" && entry.event !== null
            ? JSON.stringify(entry.event)
            : String(entry.event);
        return (`[DLQ ALERT #${index + 1}] ` +
            `Error: ${entry.error} | ` +
            `Event: ${eventSummary} | ` +
            `Timestamp: ${new Date(entry.timestamp).toISOString()}`);
    });
}
/**
 * Default remediation hook. The operations team should replace or wrap this
 * function with their own automated remediation workflow (e.g. replay the
 * event, log to an external system, or page an on-call engineer).
 *
 * The default implementation logs a warning and returns `false` to signal
 * that no automated remediation was performed.
 */
let remediate = async (event) => {
    console.warn("[DLQ REMEDIATE] No custom remediation hook installed. Event:", event);
    return false;
};
exports.remediate = remediate;
/**
 * Replaces the current remediation hook with a custom implementation.
 * Use this to plug in automated workflows without modifying this module.
 */
function setRemediateHook(hook) {
    exports.remediate = hook;
}
//# sourceMappingURL=monitor.js.map