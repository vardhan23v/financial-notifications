"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.createEventUnsafe = createEventUnsafe;
const uuid_1 = require("uuid");
const schemas_1 = require("./schemas");
function createEvent(input) {
    const event = {
        id: (0, uuid_1.v4)(),
        type: input.type,
        userId: input.userId,
        timestamp: new Date().toISOString(),
        correlationId: input.correlationId ?? (0, uuid_1.v4)(),
        payload: input.payload,
    };
    const parsed = schemas_1.eventPayloadSchema.safeParse(event);
    if (!parsed.success) {
        throw new Error(`Invalid event: ${parsed.error.message}`);
    }
    return parsed.data;
}
function createEventUnsafe(input) {
    return {
        id: (0, uuid_1.v4)(),
        type: input.type,
        userId: input.userId,
        timestamp: new Date().toISOString(),
        correlationId: input.correlationId ?? (0, uuid_1.v4)(),
        payload: input.payload,
    };
}
//# sourceMappingURL=factory.js.map