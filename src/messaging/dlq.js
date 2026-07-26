"use strict";
/**
 * DLQHandler — moves failed Kafka messages to a DeadLetterQueue store and
 * exposes a replay mechanism for operations teams / automated remediation.
 *
 * The backing store is currently in-memory. Swap `store` for a Prisma-backed
 * DeadLetterQueue table when the schema is available.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DLQHandler = void 0;
// ---------------------------------------------------------------------------
// In-memory store (replace with Prisma-backed DeadLetterQueue table)
// ---------------------------------------------------------------------------
const store = new Map();
// ---------------------------------------------------------------------------
// DLQHandler
// ---------------------------------------------------------------------------
class DLQHandler {
    /**
     * Moves a failed Kafka message into the Dead Letter Queue.
     *
     * The notificationId is derived from the Kafka message key (or offset +
     * partition as a fallback) so replay can target the exact record later.
     */
    async handleFailure(message, error, correlationId) {
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
    async replay(notificationId, replayHandler) {
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
    list() {
        return Array.from(store.values());
    }
    /**
     * Returns the number of entries currently in the DLQ.
     */
    size() {
        return store.size;
    }
    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------
    resolveNotificationId(message) {
        if (message.key) {
            return message.key.toString();
        }
        // Fallback: use offset as a synthetic key
        return message.offset ?? `unknown-${Date.now()}`;
    }
}
exports.DLQHandler = DLQHandler;
//# sourceMappingURL=dlq.js.map