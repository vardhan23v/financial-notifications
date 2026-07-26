"use strict";
/**
 * PrismaClient singleton — provides a single, lazily-initialized PrismaClient
 * instance for the lifetime of the process.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClient = getPrismaClient;
exports.disconnectPrisma = disconnectPrisma;
const client_1 = require("@prisma/client");
let client;
function getPrismaClient() {
    if (!client) {
        client = new client_1.PrismaClient({
            log: process.env.NODE_ENV === "development"
                ? ["query", "warn", "error"]
                : ["warn", "error"],
        });
    }
    return client;
}
/**
 * Gracefully disconnect Prisma so pending queries can finish.
 */
async function disconnectPrisma() {
    if (client) {
        await client.$disconnect();
        client = undefined;
    }
}
//# sourceMappingURL=prisma.js.map