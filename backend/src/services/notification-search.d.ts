import { type NotificationFilter } from "../repositories/notification";
export interface NotificationResult {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    eventId: string;
    eventType: string;
    channel: string;
    status: string;
    error?: string | null;
    createdAt: Date;
}
export declare function searchNotifications(filter: NotificationFilter): Promise<{
    notifications: NotificationResult[];
    total: number;
}>;
//# sourceMappingURL=notification-search.d.ts.map