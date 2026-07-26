export declare function findTemplateByEventAndChannel(eventType: string, channel: string): Promise<{
    id: string;
    eventType: string;
    channel: string;
    subject: string;
    body: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare function findAllTemplates(options?: {
    skip?: number;
    take?: number;
}): Promise<{
    templates: {
        id: string;
        eventType: string;
        channel: string;
        subject: string;
        body: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[];
    total: number;
}>;
export declare function createTemplate(data: {
    eventType: string;
    channel: string;
    subject: string;
    body: string;
}): Promise<{
    id: string;
    eventType: string;
    channel: string;
    subject: string;
    body: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function updateTemplate(id: string, data: {
    subject?: string;
    body?: string;
    isActive?: boolean;
}): Promise<{
    id: string;
    eventType: string;
    channel: string;
    subject: string;
    body: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function deleteTemplate(id: string): Promise<{
    id: string;
    eventType: string;
    channel: string;
    subject: string;
    body: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=template.d.ts.map