import { getPrismaClient } from "../../../src/infrastructure/prisma";

// ---------------------------------------------------------------------------
// User Repository — data access for User and UserPreferences
// ---------------------------------------------------------------------------

export async function findUserById(id: string) {
  const prisma = getPrismaClient();
  return prisma.user.findUnique({
    where: { id },
    include: { preferences: true },
  });
}

export async function findUserByEmail(email: string) {
  const prisma = getPrismaClient();
  return prisma.user.findUnique({
    where: { email },
    include: { preferences: true },
  });
}

export async function findAllUsers(options: { skip?: number; take?: number } = {}) {
  const prisma = getPrismaClient();
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: options.skip,
      take: options.take,
      include: { preferences: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);
  return { users, total };
}

export async function updateUserPreferences(userId: string, data: {
  channels?: string[];
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
  language?: string;
}) {
  const prisma = getPrismaClient();
  return prisma.userPreferences.upsert({
    where: { userId },
    create: {
      userId,
      channels: data.channels ?? ["EMAIL"],
      quietHoursStart: data.quietHoursStart ?? null,
      quietHoursEnd: data.quietHoursEnd ?? null,
      language: data.language ?? "en-IN",
    },
    update: {
      channels: data.channels,
      quietHoursStart: data.quietHoursStart,
      quietHoursEnd: data.quietHoursEnd,
      language: data.language,
    },
  });
}
