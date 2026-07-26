export declare function findActiveProvidersByChannel(channel: string): Promise<{
    id: string;
    name: string;
    channel: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    priority: number;
    config: import("@prisma/client/runtime/library").JsonValue;
}[]>;
export declare function findAllProviders(options?: {
    skip?: number;
    take?: number;
}): Promise<{
    providers: {
        id: string;
        name: string;
        channel: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        config: import("@prisma/client/runtime/library").JsonValue;
    }[];
    total: number;
}>;
export declare function updateProviderStatus(id: string, isActive: boolean): Promise<{
    id: string;
    name: string;
    channel: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    priority: number;
    config: import("@prisma/client/runtime/library").JsonValue;
}>;
export declare function createProvider(data: {
    name: string;
    channel: string;
    priority: number;
    config: Record<string, unknown>;
}): Promise<{
    id: string;
    name: string;
    channel: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    priority: number;
    config: import("@prisma/client/runtime/library").JsonValue;
}>;
//# sourceMappingURL=provider.d.ts.map