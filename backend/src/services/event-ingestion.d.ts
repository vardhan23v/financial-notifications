export interface IngestEventInput {
    type: string;
    userId: string;
    payload: Record<string, unknown>;
    correlationId?: string;
}
export declare function ingestEvent(input: IngestEventInput): Promise<{
    id: string;
}>;
//# sourceMappingURL=event-ingestion.d.ts.map