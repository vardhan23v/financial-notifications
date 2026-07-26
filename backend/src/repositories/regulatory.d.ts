export declare function findActiveRule(eventType: string): Promise<{
    regulator: string;
    id: string;
    eventType: string;
    channel: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    priority: number;
} | null>;
export declare function findAllRules(): Promise<{
    regulator: string;
    id: string;
    eventType: string;
    channel: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    priority: number;
}[]>;
export declare function createRule(data: {
    regulator: string;
    eventType: string;
    channel: string;
    priority: number;
}): Promise<{
    regulator: string;
    id: string;
    eventType: string;
    channel: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    priority: number;
}>;
export declare function updateRule(id: string, data: {
    channel?: string;
    priority?: number;
    isActive?: boolean;
}): Promise<{
    regulator: string;
    id: string;
    eventType: string;
    channel: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    priority: number;
}>;
//# sourceMappingURL=regulatory.d.ts.map