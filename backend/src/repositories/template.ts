import { getPrismaClient } from "../../../src/infrastructure/prisma";

// ---------------------------------------------------------------------------
// Template Repository — data access for NotificationTemplate
// ---------------------------------------------------------------------------

export async function findTemplateByEventAndChannel(eventType: string, channel: string) {
  const prisma = getPrismaClient();
  return prisma.notificationTemplate.findUnique({
    where: { eventType_channel: { eventType, channel } },
  });
}

export async function findAllTemplates(options: { skip?: number; take?: number } = {}) {
  const prisma = getPrismaClient();
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

export async function createTemplate(data: {
  eventType: string;
  channel: string;
  subject: string;
  body: string;
}) {
  const prisma = getPrismaClient();
  return prisma.notificationTemplate.create({ data });
}

export async function updateTemplate(id: string, data: {
  subject?: string;
  body?: string;
  isActive?: boolean;
}) {
  const prisma = getPrismaClient();
  return prisma.notificationTemplate.update({
    where: { id },
    data,
  });
}

export async function deleteTemplate(id: string) {
  const prisma = getPrismaClient();
  return prisma.notificationTemplate.delete({ where: { id } });
}
