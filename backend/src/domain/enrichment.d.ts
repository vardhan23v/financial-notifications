import type { EventPayload } from "./events";
export interface EnrichedPayload {
    original: Record<string, unknown>;
    enriched: Record<string, unknown>;
    metadata: {
        enrichedAt: string;
        enrichments: string[];
    };
}
export declare function enrichEvent(event: EventPayload, user?: {
    name: string;
    email: string;
    phone?: string | null;
}): EnrichedPayload;
//# sourceMappingURL=enrichment.d.ts.map