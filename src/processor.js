"use strict";
/**
 * Event processor with Dead Letter Queue (DLQ) support.
 *
 * Events that exhaust their retry budget are pushed to an in-memory DLQ
 * for later inspection, alerting, and remediation by operations teams.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatch = dispatch;
exports.deadLetter = deadLetter;
exports.getDLQ = getDLQ;
const dlq = [];
/**
 * Processes an event with up to `maxRetries` attempts. If all retries
 * are exhausted, the event is pushed to the DLQ via deadLetter().
 *
 * The `handler` function is the actual processing logic; it should throw
 * on failure so the retry mechanism can engage.
 */
async function dispatch(event, handler, maxRetries = 3) {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            await handler(event);
            return; // success — event processed
        }
        catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
        }
    }
    // All retries exhausted — push to DLQ
    deadLetter(event, lastError);
}
/**
 * Pushes a failed event into the in-memory DLQ.
 */
function deadLetter(event, error) {
    dlq.push({
        event,
        error: error.message,
        timestamp: Date.now(),
    });
}
/**
 * Returns the current contents of the DLQ for inspection and monitoring.
 */
function getDLQ() {
    return dlq;
}
//# sourceMappingURL=processor.js.map