import { getPrismaClient } from "../../../src/infrastructure/prisma";

// ---------------------------------------------------------------------------
// Regulatory Repository — data access for RegulatoryRule
// ---------------------------------------------------------------------------

export async function findActiveRule(eventType: string) {
  const prisma = getPrismaClient();
  return prisma.regulatoryRule.findFirst({
    where: { eventType, isActive: true },
    orderBy: { priority: "desc" },
  });
}

export async function findAllRules() {
  const prisma = getPrismaClient();
  return prisma.regulatoryRule.findMany({
    orderBy: { priority: "desc" },
  });
}

export async function createRule(data: {
  regulator: string;
  eventType: string;
  channel: string;
  priority: number;
}) {
  const prisma = getPrismaClient();
  return prisma.regulatoryRule.create({ data });
}

export async function updateRule(id: string, data: {
  channel?: string;
  priority?: number;
  isActive?: boolean;
}) {
  const prisma = getPrismaClient();
  return prisma.regulatoryRule.update({
    where: { id },
    data,
  });
}
