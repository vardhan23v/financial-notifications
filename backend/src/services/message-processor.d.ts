export interface Message {
    id: string;
    type: string;
    userId: string;
    timestamp: string;
    correlationId?: string;
    payload: Record<string, unknown>;
}
export declare function processMessage(msg: Message): Promise<void>;
//# sourceMappingURL=message-processor.d.ts.map