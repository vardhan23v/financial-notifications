/**
 * Idempotency middleware — ensures that requests carrying an
 * `Idempotency-Key` header are processed exactly once.
 *
 * The IdempotencyRepository records each key after a successful response
 * and replays the cached response for duplicate keys.
 */
import type { Request, Response, NextFunction } from "express";
export interface IdempotencyRecord {
    /** The idempotency key supplied by the client. */
    key: string;
    /** The HTTP status code of the original response. */
    statusCode: number;
    /** The serialised response body. */
    body: unknown;
    /** ISO-8601 timestamp of when the original request completed. */
    completedAt: string;
}
export declare class IdempotencyRepository {
    private readonly store;
    /**
     * Returns the cached record for `key`, or `undefined` if this key has
     * never been seen before.
     */
    get(key: string): IdempotencyRecord | undefined;
    /**
     * Persists a completed response so future duplicate requests can be
     * short-circuited.
     */
    set(key: string, record: IdempotencyRecord): void;
    /**
     * Removes a key (useful for testing or manual invalidation).
     */
    delete(key: string): boolean;
}
/**
 * Creates Express middleware that checks the `Idempotency-Key` header.
 *
 * - If the key is missing the request passes through unchanged.
 * - If the key is present and already recorded, the cached response is
 *   returned immediately and the handler is skipped.
 * - If the key is present but new, the request is processed normally and
 *   the response is recorded on success (2xx).
 */
export declare function idempotencyMiddleware(repo: IdempotencyRepository): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=idempotency.d.ts.map