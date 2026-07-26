import type { Request, Response } from "express";
interface DLQEntry {
    id: string;
    eventId: string;
    eventType: string;
    userId: string;
    error: string;
    timestamp: string;
    payload: Record<string, unknown>;
}
export declare function getDLQ(req: Request, res: Response): void;
export declare function replayDLQ(req: Request, res: Response): Promise<void>;
export declare function addToDLQ(entry: DLQEntry): Promise<void>;
export {};
//# sourceMappingURL=dlq.d.ts.map