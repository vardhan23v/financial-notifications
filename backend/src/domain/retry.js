"use strict";
// ---------------------------------------------------------------------------
// Retry Engine — exponential backoff with jitter for delivery attempts
// ---------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_RETRY_CONFIG = void 0;
exports.withRetry = withRetry;
exports.DEFAULT_RETRY_CONFIG = {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 30000,
    jitter: true,
};
async function withRetry(fn, config = {}) {
    const cfg = { ...exports.DEFAULT_RETRY_CONFIG, ...config };
    let lastError;
    for (let attempt = 0; attempt <= cfg.maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            if (attempt < cfg.maxRetries) {
                const delay = calculateDelay(attempt, cfg);
                await sleep(delay);
            }
        }
    }
    throw lastError;
}
function calculateDelay(attempt, config) {
    const exponential = config.baseDelayMs * Math.pow(2, attempt);
    const capped = Math.min(exponential, config.maxDelayMs);
    if (!config.jitter) {
        return capped;
    }
    // Full jitter: random value between 0 and capped
    return Math.floor(Math.random() * capped);
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=retry.js.map