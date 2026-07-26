"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findActiveProvidersByChannel = findActiveProvidersByChannel;
exports.findAllProviders = findAllProviders;
exports.updateProviderStatus = updateProviderStatus;
exports.createProvider = createProvider;
const prisma_1 = require("../../../src/infrastructure/prisma");
// ---------------------------------------------------------------------------
// Provider Repository — data access for DeliveryProvider
// ---------------------------------------------------------------------------
async function findActiveProvidersByChannel(channel) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.deliveryProvider.findMany({
        where: { channel, isActive: true },
        orderBy: { priority: "asc" },
    });
}
async function findAllProviders(options = {}) {
    const prisma = (0, prisma_1.getPrismaClient)();
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
async function updateProviderStatus(id, isActive) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.deliveryProvider.update({
        where: { id },
        data: { isActive },
    });
}
async function createProvider(data) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.deliveryProvider.create({ data: { ...data, config: data.config } });
}
//# sourceMappingURL=provider.js.map