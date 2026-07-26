import { getPrismaClient } from "../../../src/infrastructure/prisma";

// ---------------------------------------------------------------------------
// Provider Repository — data access for DeliveryProvider
// ---------------------------------------------------------------------------

export async function findActiveProvidersByChannel(channel: string) {
  const prisma = getPrismaClient();
  return prisma.deliveryProvider.findMany({
    where: { channel, isActive: true },
    orderBy: { priority: "asc" },
  });
}

export async function findAllProviders(options: { skip?: number; take?: number } = {}) {
  const prisma = getPrismaClient();
  const [providers, total] = await Promise.all([
    prisma.deliveryProvider.findMany({
      skip: options.skip,
      take: options.take,
      orderBy: { priority: "asc" },
    }),
    prisma.deliveryProvider.count(),
  ]);
  return { providers, total };
}

export async function updateProviderStatus(id: string, isActive: boolean) {
  const prisma = getPrismaClient();
  return prisma.deliveryProvider.update({
    where: { id },
    data: { isActive },
  });
}

export async function createProvider(data: {
  name: string;
  channel: string;
  priority: number;
  config: Record<string, unknown>;
}) {
  const prisma = getPrismaClient();
  return prisma.deliveryProvider.create({ data: { ...data, config: data.config as any } });
}
