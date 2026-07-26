import type { EventPayload } from "./events";
export interface EventScore {
    riskScore: number;
    urgencyScore: number;
    recommendedChannels: string[];
    quietHoursBypass: boolean;
}
export declare function scoreEvent(event: EventPayload): EventScore;
//# sourceMappingURL=scoring.d.ts.map