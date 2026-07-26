export interface RetryConfig {
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
    jitter: boolean;
}
export declare const DEFAULT_RETRY_CONFIG: RetryConfig;
export declare function withRetry<T>(fn: () => Promise<T>, config?: Partial<RetryConfig>): Promise<T>;
//# sourceMappingURL=retry.d.ts.map