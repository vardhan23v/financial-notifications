"use strict";
/**
 * Idempotency middleware — ensures that requests carrying an
 * `Idempotency-Key` header are processed exactly once.
 *
 * The IdempotencyRepository records each key after a successful response
 * and replays the cached response for duplicate keys.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdempotencyRepository = void 0;
exports.idempotencyMiddleware = idempotencyMiddleware;
// ---------------------------------------------------------------------------
// IdempotencyRepository
// ---------------------------------------------------------------------------
class IdempotencyRepository {
    store = new Map();
    /**
     * Returns the cached record for `key`, or `undefined` if this key has
     * never been seen before.
     */
    get(key) {
        return this.store.get(key);
    }
    /**
     * Persists a completed response so future duplicate requests can be
     * short-circuited.
     */
    set(key, record) {
        this.store.set(key, record);
    }
    /**
     * Removes a key (useful for testing or manual invalidation).
     */
    delete(key) {
        return this.store.delete(key);
    }
}
exports.IdempotencyRepository = IdempotencyRepository;
// ---------------------------------------------------------------------------
// Middleware factory
// ---------------------------------------------------------------------------
const HEADER_IDEMPOTENCY_KEY = "idempotency-key";
/**
 * Creates Express middleware that checks the `Idempotency-Key` header.
 *
 * - If the key is missing the request passes through unchanged.
 * - If the key is present and already recorded, the cached response is
 *   returned immediately and the handler is skipped.
 * - If the key is present but new, the request is processed normally and
 *   the response is recorded on success (2xx).
 */
function idempotencyMiddleware(repo) {
    return async function (req, res, next) {
        const key = req.headers[HEADER_IDEMPOTENCY_KEY];
        // No key — pass through
        if (!key || Array.isArray(key)) {
            return next();
        }
        // Duplicate — replay cached response
        const cached = repo.get(key);
        if (cached) {
            res.status(cached.statusCode).json(cached.body);
            return;
        }
        // New key — intercept the response to record it after success
        const originalJson = res.json.bind(res);
        res.json = function (body) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                repo.set(key, {
                    key,
                    statusCode: res.statusCode,
                    body,
                    completedAt: new Date().toISOString(),
                });
            }
            return originalJson(body);
        };
        next();
    };
}
//# sourceMappingURL=idempotency.js.map