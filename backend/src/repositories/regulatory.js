"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findActiveRule = findActiveRule;
exports.findAllRules = findAllRules;
exports.createRule = createRule;
exports.updateRule = updateRule;
const prisma_1 = require("../../../src/infrastructure/prisma");
// ---------------------------------------------------------------------------
// Regulatory Repository — data access for RegulatoryRule
// ---------------------------------------------------------------------------
async function findActiveRule(eventType) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.regulatoryRule.findFirst({
        where: { eventType, isActive: true },
        orderBy: { priority: "desc" },
    });
}
async function findAllRules() {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.regulatoryRule.findMany({
        orderBy: { priority: "desc" },
    });
}
async function createRule(data) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.regulatoryRule.create({ data });
}
async function updateRule(id, data) {
    const prisma = (0, prisma_1.getPrismaClient)();
    return prisma.regulatoryRule.update({
        where: { id },
        data,
    });
}
//# sourceMappingURL=regulatory.js.map