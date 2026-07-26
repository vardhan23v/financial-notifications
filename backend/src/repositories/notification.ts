import { getPrismaClient } from "../../../src/infrastructure/prisma";

// ---------------------------------------------------------------------------
// Notification Repository — data access for Notification audit log
// ---------------------------------------------------------------------------

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

export async function createNotification(data: {
  userId: string;
  eventId: string;
  eventType: string;
  channel: string;
  status: string;
  error?: string;
}) {
  const prisma = getPrismaClient();
  return prisma.notification.create({ data });
}

export async function findNotifications(filter: NotificationFilter) {
  const prisma = getPrismaClient();

  const where: Record<string, unknown> = {};

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
      (where.createdAt as Record<string, unknown>).gte = new Date(filter.startDate);
    }
    if (filter.endDate) {
      (where.createdAt as Record<string, unknown>).lte = new Date(filter.endDate);
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

export async function getNotificationStats() {
  const prisma = getPrismaClient();

  const [sent, failed, pending, dlq, total] = await Promise.all([
    prisma.notification.count({ where: { status: "SENT" } }),
    prisma.notification.count({ where: { status: "FAILED" } }),
    prisma.notification.count({ where: { status: "PENDING" } }),
    prisma.notification.count({ where: { status: "DLQ" } }),
    prisma.notification.count(),
  ]);

  return { sent, failed, pending, dlq, total };
}

export async function updateNotificationStatus(id: string, status: string, error?: string) {
  const prisma = getPrismaClient();
  return prisma.notification.update({
    where: { id },
    data: { status, error: error ?? undefined },
  });
}
