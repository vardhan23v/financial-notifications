export declare function findUserById(id: string): Promise<({
    preferences: {
        id: string;
        userId: string;
        quietHoursStart: string | null;
        quietHoursEnd: string | null;
        createdAt: Date;
        updatedAt: Date;
        channels: string[];
        language: string;
    } | null;
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    pan: string | null;
    phone: string | null;
}) | null>;
export declare function findUserByEmail(email: string): Promise<({
    preferences: {
        id: string;
        userId: string;
        quietHoursStart: string | null;
        quietHoursEnd: string | null;
        createdAt: Date;
        updatedAt: Date;
        channels: string[];
        language: string;
    } | null;
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    pan: string | null;
    phone: string | null;
}) | null>;
export declare function findAllUsers(options?: {
    skip?: number;
    take?: number;
}): Promise<{
    users: ({
        preferences: {
            id: string;
            userId: string;
            quietHoursStart: string | null;
            quietHoursEnd: string | null;
            createdAt: Date;
            updatedAt: Date;
            channels: string[];
            language: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        pan: string | null;
        phone: string | null;
    })[];
    total: number;
}>;
export declare function updateUserPreferences(userId: string, data: {
    channels?: string[];
    quietHoursStart?: string | null;
    quietHoursEnd?: string | null;
    language?: string;
}): Promise<{
    id: string;
    userId: string;
    quietHoursStart: string | null;
    quietHoursEnd: string | null;
    createdAt: Date;
    updatedAt: Date;
    channels: string[];
    language: string;
}>;
//# sourceMappingURL=user.d.ts.map