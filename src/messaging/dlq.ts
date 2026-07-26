/**
 * DLQHandler — moves failed Kafka messages to a DeadLetterQueue store and
 * exposes a replay mechanism for operations teams / automated remediation.
 *
 * The backing store is currently in-memory. Swap `store` for a Prisma-backed
 * DeadLetterQueue table when the schema is available.
 */

import type { KafkaMessage } from "kafkajs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// In-memory store (replace with Prisma-backed DeadLetterQueue table)
// ---------------------------------------------------------------------------

const store: Map<string, DLQRecord> = new Map();

// ---------------------------------------------------------------------------
// DLQHandler
// ---------------------------------------------------------------------------

export class DLQHandler {
  /**
   * Moves a failed Kafka message into the Dead Letter Queue.
   *
   * The notificationId is derived from the Kafka message key (or offset +
   * partition as a fallback) so replay can target the exact record later.
   */
  async handleFailure(
    message: KafkaMessage,
    error: Error,
    correlationId?: string,
  ): Promise<void> {
    const notificationId = this.resolveNotificationId(message);

    store.set(notificationId, {
      message,
      error: error.message,
      failedAt: new Date().toISOString(),
      correlationId,
    });
  }

  /**
   * Replays a previously-failed message by its notification ID.
   *
   * The caller is responsible for providing a replay handler that re-processes
   * the raw Kafka message. If the notification ID is not found in the DLQ,
   * this is a no-op.
   */
  async replay(
    notificationId: string,
    replayHandler?: (message: KafkaMessage) => Promise<void>,
  ): Promise<void> {
    const record = store.get(notificationId);
    if (!record) {
      return; // nothing to replay
    }

    if (replayHandler) {
      await replayHandler(record.message);
    }

    // Remove from DLQ after successful replay
    store.delete(notificationId);
  }

  /**
   * Returns all DLQ entries for inspection and monitoring.
   */
  list(): DLQRecord[] {
    return Array.from(store.values());
  }

  /**
   * Returns the number of entries currently in the DLQ.
   */
  size(): number {
    return store.size;
  }

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  private resolveNotificationId(message: KafkaMessage): string {
    if (message.key) {
      return message.key.toString();
    }
    // Fallback: use offset as a synthetic key
    return message.offset ?? `unknown-${Date.now()}`;
  }
}