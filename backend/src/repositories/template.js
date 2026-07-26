"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTemplateByEventAndChannel = findTemplateByEventAndChannel;
exports.findAllTemplates = findAllTemplates;
exports.createTemplate = createTemplate;
exports.updateTemplate = updateTemplate;
exports.deleteTemplate = deleteTemplate;
const prisma_1 = require("../../../src/infrastructure/prisma");
// ---------------------------------------------------------------------------
// Template Repository — data access for NotificationTemplate
// ---------------------------------------------------------------------------
async function findTemplateByEventAndChannel(eventType, channel) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.notificationTemplate.findUnique({
        where: { eventType_channel: { eventType, channel } },
    });
}
async function findAllTemplates(options = {}) {
    const prisma = (0, prisma_1.getPrismaClient)();
    const [templates, total] = await Promise.all([
        prisma.notificationTemplate.findMany({
            skip: options.skip,
            take: options.take,
            orderBy: { createdAt: "desc" },
        }),
        prisma.notificationTemplate.count(),
    ]);
    return { templates, total };
}
async function createTemplate(data) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.notificationTemplate.create({ data });
}
async function updateTemplate(id, data) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.notificationTemplate.update({
        where: { id },
        data,
    });
}
async function deleteTemplate(id) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.notificationTemplate.delete({ where: { id } });
}
//# sourceMappingURL=template.js.map