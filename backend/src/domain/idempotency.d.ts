export declare function checkIdempotencyKey(key: string): Promise<boolean>;
export declare function setIdempotencyKey(key: string, metadata?: Record<string, unknown>): Promise<void>;
export declare function generateIdempotencyKey(eventId: string, userId: string, eventType: string): Promise<string>;
//# sourceMappingURL=idempotency.d.ts.map