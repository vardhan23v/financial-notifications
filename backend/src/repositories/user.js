"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = findUserById;
exports.findUserByEmail = findUserByEmail;
exports.findAllUsers = findAllUsers;
exports.updateUserPreferences = updateUserPreferences;
const prisma_1 = require("../../../src/infrastructure/prisma");
// ---------------------------------------------------------------------------
// User Repository — data access for User and UserPreferences
// ---------------------------------------------------------------------------
async function findUserById(id) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.user.findUnique({
        where: { id },
        include: { preferences: true },
    });
}
async function findUserByEmail(email) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.user.findUnique({
        where: { email },
        include: { preferences: true },
    });
}
async function findAllUsers(options = {}) {
    const prisma = (0, prisma_1.getPrismaClient)();
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
async function updateUserPreferences(userId, data) {
    const prisma = (0, prisma_1.getPrismaClient)();
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
//# sourceMappingURL=user.js.map