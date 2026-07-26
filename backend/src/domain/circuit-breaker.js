"use strict";
// ---------------------------------------------------------------------------
// Circuit Breaker — prevents cascading failures across delivery providers
// ---------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
exports.getAllCircuitBreakerStates = getAllCircuitBreakerStates;
const DEFAULT_CONFIG = {
    failureThreshold: 5,
    recoveryTimeoutMs: 30000,
    halfOpenMaxCalls: 3,
};
const store = new Map();
class CircuitBreaker {
    providerName;
    config;
    constructor(providerName, config = {}) {
        this.providerName = providerName;
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    getState() {
        const record = this.getRecord();
        return record.state;
    }
    canExecute() {
        const record = this.getRecord();
        if (record.state === "CLOSED") {
            return true;
        }
        if (record.state === "OPEN") {
            const now = Date.now();
            if (now - record.lastFailureTime >= this.config.recoveryTimeoutMs) {
                record.state = "HALF_OPEN";
                record.halfOpenCalls = 0;
                return true;
            }
            return false;
        }
        // HALF_OPEN
        if (record.halfOpenCalls < this.config.halfOpenMaxCalls) {
            record.halfOpenCalls++;
            return true;
        }
        return false;
    }
    recordSuccess() {
        const record = this.getRecord();
        if (record.state === "HALF_OPEN") {
            record.successes++;
            if (record.successes >= this.config.halfOpenMaxCalls) {
                this.reset();
                return;
            }
        }
        record.failures = 0;
    }
    recordFailure() {
        const record = this.getRecord();
        record.failures++;
        record.lastFailureTime = Date.now();
        if (record.state === "HALF_OPEN") {
            record.state = "OPEN";
            record.halfOpenCalls = 0;
            return;
        }
        if (record.failures >= this.config.failureThreshold) {
            record.state = "OPEN";
        }
    }
    reset() {
        store.set(this.providerName, {
            state: "CLOSED",
            failures: 0,
            successes: 0,
            lastFailureTime: 0,
            halfOpenCalls: 0,
        });
    }
    getRecord() {
        let record = store.get(this.providerName);
        if (!record) {
            record = {
                state: "CLOSED",
                failures: 0,
                successes: 0,
                lastFailureTime: 0,
                halfOpenCalls: 0,
            };
            store.set(this.providerName, record);
        }
        return record;
    }
}
exports.CircuitBreaker = CircuitBreaker;
function getAllCircuitBreakerStates() {
    return Array.from(store.entries()).map(([provider, record]) => ({
        provider,
        state: record.state,
    }));
}
//# sourceMappingURL=circuit-breaker.js.map