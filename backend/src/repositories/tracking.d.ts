/**
 * Creates a new delivery tracking record when a notification is first
 * dispatched. The record starts in PENDING state.
 */
export declare function createTrackingRecord(dto: {
    notificationId: string;
    userId: string;
    channel: string;
    provider: string;
}): Promise<void>;
/**
 * Updates the status (and optional metadata) of an existing delivery
 * tracking record. Typical status transitions:
 *
 *   PENDING → SENT   (delivery succeeded)
 *   PENDING → FAILED (delivery failed after retries)
 *   PENDING → DLQ    (exhausted retries, sent to dead letter queue)
 */
export declare function updateTrackingStatus(notificationId: string, status: string, metadata?: object): Promise<void>;
//# sourceMappingURL=tracking.d.ts.map