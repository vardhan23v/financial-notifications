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

const dlq: DLQEntry[] = [];

/**
 * Processes an event with up to `maxRetries` attempts. If all retries
 * are exhausted, the event is pushed to the DLQ via deadLetter().
 *
 * The `handler` function is the actual processing logic; it should throw
 * on failure so the retry mechanism can engage.
 */
export async function dispatch(
  event: object,
  handler: (event: object) => Promise<void>,
  maxRetries: number = 3,
): Promise<void> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await handler(event);
      return; // success — event processed
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  // All retries exhausted — push to DLQ
  deadLetter(event, lastError!);
}

/**
 * Pushes a failed event into the in-memory DLQ.
 */
export function deadLetter(event: object, error: Error): void {
  dlq.push({
    event,
    error: error.message,
    timestamp: Date.now(),
  });
}

/**
 * Returns the current contents of the DLQ for inspection and monitoring.
 */
export function getDLQ(): ReadonlyArray<DLQEntry> {
  return dlq;
}