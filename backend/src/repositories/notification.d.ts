export interface NotificationFilter {
    userId?: string;
    eventType?: string;
    channel?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    skip?: number;
    take?: number;
}
export declare function createNotification(data: {
    userId: string;
    eventId: string;
    eventType: string;
    channel: string;
    status: string;
    error?: string;
}): Promise<{
    status: string;
    id: string;
    userId: string;
    error: string | null;
    eventType: string;
    channel: string;
    createdAt: Date;
    eventId: string;
}>;
export declare function findNotifications(filter: NotificationFilter): Promise<{
    notifications: ({
        user: {
            name: string;
            email: string;
        };
    } & {
        status: string;
        id: string;
        userId: string;
        error: string | null;
        eventType: string;
        channel: string;
        createdAt: Date;
        eventId: string;
    })[];
    total: number;
}>;
export declare function getNotificationStats(): Promise<{
    sent: number;
    failed: number;
    pending: number;
    dlq: number;
    total: number;
}>;
export declare function updateNotificationStatus(id: string, status: string, error?: string): Promise<{
    status: string;
    id: string;
    userId: string;
    error: string | null;
    eventType: string;
    channel: string;
    createdAt: Date;
    eventId: string;
}>;
//# sourceMappingURL=notification.d.ts.map