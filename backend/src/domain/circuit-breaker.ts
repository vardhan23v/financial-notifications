// ---------------------------------------------------------------------------
// Circuit Breaker — prevents cascading failures across delivery providers
// ---------------------------------------------------------------------------

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeoutMs: number;
  halfOpenMaxCalls: number;
}

interface CircuitBreakerRecord {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailureTime: number;
  halfOpenCalls: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  recoveryTimeoutMs: 30000,
  halfOpenMaxCalls: 3,
};

const store = new Map<string, CircuitBreakerRecord>();

export class CircuitBreaker {
  private providerName: string;
  private config: CircuitBreakerConfig;

  constructor(providerName: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.providerName = providerName;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  getState(): CircuitState {
    const record = this.getRecord();
    return record.state;
  }

  canExecute(): boolean {
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

  recordSuccess(): void {
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

  recordFailure(): void {
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

  reset(): void {
    store.set(this.providerName, {
      state: "CLOSED",
      failures: 0,
      successes: 0,
      lastFailureTime: 0,
      halfOpenCalls: 0,
    });
  }

  private getRecord(): CircuitBreakerRecord {
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

export function getAllCircuitBreakerStates(): Array<{ provider: string; state: CircuitState }> {
  return Array.from(store.entries()).map(([provider, record]) => ({
    provider,
    state: record.state,
  }));
}
