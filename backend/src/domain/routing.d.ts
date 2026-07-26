import type { EventPayload } from "./events";
export interface RouteDecision {
    eventType: string;
    channels: string[];
    priority: number;
    requiresRegulatoryOverride: boolean;
    regulator?: string;
}
export declare function routeEvent(event: EventPayload): RouteDecision;
export declare function getPriority(eventType: string): number;
//# sourceMappingURL=routing.d.ts.map