import type { EventPayload } from "./events";
export interface ChannelResolution {
    channels: string[];
    regulatoryOverride: boolean;
    regulator?: string;
    quietHoursRespected: boolean;
    fallbackChannel?: string;
}
export declare function resolveChannels(event: EventPayload, userPreferences: {
    channels: string[];
    quietHoursStart?: string | null;
    quietHoursEnd?: string | null;
} | null): ChannelResolution;
//# sourceMappingURL=channels.d.ts.map