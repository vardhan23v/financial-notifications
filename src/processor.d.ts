/**
 * Event processor with Dead Letter Queue (DLQ) support.
 *
 * Events that exhaust their retry budget are pushed to an in-memory DLQ
 * for later inspection, alerting, and remediation by operations teams.
 */
interface DLQEntry {
    event: object;
    error: string;
    timestamp: number;
}
/**
 * Processes an event with up to `maxRetries` attempts. If all retries
 * are exhausted, the event is pushed to the DLQ via deadLetter().
 *
 * The `handler` function is the actual processing logic; it should throw
 * on failure so the retry mechanism can engage.
 */
export declare function dispatch(event: object, handler: (event: object) => Promise<void>, maxRetries?: number): Promise<void>;
/**
 * Pushes a failed event into the in-memory DLQ.
 */
export declare function deadLetter(event: object, error: Error): void;
/**
 * Returns the current contents of the DLQ for inspection and monitoring.
 */
export declare function getDLQ(): ReadonlyArray<DLQEntry>;
export {};
//# sourceMappingURL=processor.d.ts.map