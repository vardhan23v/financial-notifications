"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
exports.findNotifications = findNotifications;
exports.getNotificationStats = getNotificationStats;
exports.updateNotificationStatus = updateNotificationStatus;
const prisma_1 = require("../../../src/infrastructure/prisma");
async function createNotification(data) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.notification.create({ data });
}
async function findNotifications(filter) {
    const prisma = (0, prisma_1.getPrismaClient)();
    const where = {};
    if (filter.userId) {
        where.userId = filter.userId;
    }
    if (filter.eventType) {
        where.eventType = filter.eventType;
    }
    if (filter.channel) {
        where.channel = filter.channel;
    }
    if (filter.status) {
        where.status = filter.status;
    }
    if (filter.startDate || filter.endDate) {
        where.createdAt = {};
        if (filter.startDate) {
            where.createdAt.gte = new Date(filter.startDate);
        }
        if (filter.endDate) {
            where.createdAt.lte = new Date(filter.endDate);
        }
    }
    if (filter.search) {
        where.OR = [
            { eventId: { contains: filter.search, mode: "insensitive" } },
            { error: { contains: filter.search, mode: "insensitive" } },
        ];
    }
    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
            where,
            skip: filter.skip ?? 0,
            take: filter.take ?? 50,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } },
        }),
        prisma.notification.count({ where }),
    ]);
    return { notifications, total };
}
async function getNotificationStats() {
    const prisma = (0, prisma_1.getPrismaClient)();
    const [sent, failed, pending, dlq, total] = await Promise.all([
        prisma.notification.count({ where: { status: "SENT" } }),
        prisma.notification.count({ where: { status: "FAILED" } }),
        prisma.notification.count({ where: { status: "PENDING" } }),
        prisma.notification.count({ where: { status: "DLQ" } }),
        prisma.notification.count(),
    ]);
    return { sent, failed, pending, dlq, total };
}
async function updateNotificationStatus(id, status, error) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.notification.update({
        where: { id },
        data: { status, error: error ?? undefined },
    });
}
//# sourceMappingURL=notification.js.map