export interface SystemStatus {
    healthy: boolean;
    components: Array<{
        name: string;
        healthy: boolean;
        error?: string;
    }>;
    metrics: {
        notificationsSent: number;
        notificationsFailed: number;
        notificationsPending: number;
        dlqSize: number;
        totalNotifications: number;
    };
    providers: Array<{
        name: string;
        channel: string;
        healthy: boolean;
        active: boolean;
    }>;
    circuitBreakers: Array<{
        provider: string;
        state: string;
    }>;
    activeConsumers: number;
}
export declare function getSystemStatus(): Promise<SystemStatus>;
//# sourceMappingURL=system-status.d.ts.map