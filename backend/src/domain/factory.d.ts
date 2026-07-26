import type { EventPayload } from "./events";
export interface CreateEventInput {
    type: string;
    userId: string;
    payload: Record<string, unknown>;
    correlationId?: string;
}
export declare function createEvent(input: CreateEventInput): EventPayload;
export declare function createEventUnsafe(input: CreateEventInput): EventPayload;
//# sourceMappingURL=factory.d.ts.map