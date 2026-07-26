type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";
interface CircuitBreakerConfig {
    failureThreshold: number;
    recoveryTimeoutMs: number;
    halfOpenMaxCalls: number;
}
export declare class CircuitBreaker {
    private providerName;
    private config;
    constructor(providerName: string, config?: Partial<CircuitBreakerConfig>);
    getState(): CircuitState;
    canExecute(): boolean;
    recordSuccess(): void;
    recordFailure(): void;
    reset(): void;
    private getRecord;
}
export declare function getAllCircuitBreakerStates(): Array<{
    provider: string;
    state: CircuitState;
}>;
export {};
//# sourceMappingURL=circuit-breaker.d.ts.map