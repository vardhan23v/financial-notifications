/**
 * DLQHandler — moves failed Kafka messages to a DeadLetterQueue store and
 * exposes a replay mechanism for operations teams / automated remediation.
 *
 * The backing store is currently in-memory. Swap `store` for a Prisma-backed
 * DeadLetterQueue table when the schema is available.
 */
import type { KafkaMessage } from "kafkajs";
export interface DLQRecord {
    /** Original Kafka message that failed processing. */
    message: KafkaMessage;
    /** The error that caused the failure. */
    error: string;
    /** ISO-8601 timestamp of when the failure was recorded. */
    failedAt: string;
    /** Optional correlation ID propagated from the original request. */
    correlationId?: string;
}
export declare class DLQHandler {
    /**
     * Moves a failed Kafka message into the Dead Letter Queue.
     *
     * The notificationId is derived from the Kafka message key (or offset +
     * partition as a fallback) so replay can target the exact record later.
     */
    handleFailure(message: KafkaMessage, error: Error, correlationId?: string): Promise<void>;
    /**
     * Replays a previously-failed message by its notification ID.
     *
     * The caller is responsible for providing a replay handler that re-processes
     * the raw Kafka message. If the notification ID is not found in the DLQ,
     * this is a no-op.
     */
    replay(notificationId: string, replayHandler?: (message: KafkaMessage) => Promise<void>): Promise<void>;
    /**
     * Returns all DLQ entries for inspection and monitoring.
     */
    list(): DLQRecord[];
    /**
     * Returns the number of entries currently in the DLQ.
     */
    size(): number;
    private resolveNotificationId;
}
//# sourceMappingURL=dlq.d.ts.map