import type { EventPayload } from "../domain/events";
export interface DeliveryResult {
    success: boolean;
    channel: string;
    provider?: string;
    error?: string;
    messageId?: string;
}
export declare function deliverNotification(event: EventPayload, channel: string, enrichedPayload: Record<string, unknown>, locale?: string): Promise<DeliveryResult>;
//# sourceMappingURL=delivery.d.ts.map