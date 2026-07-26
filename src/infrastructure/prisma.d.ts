/**
 * PrismaClient singleton — provides a single, lazily-initialized PrismaClient
 * instance for the lifetime of the process.
 */
import { PrismaClient } from "@prisma/client";
export declare function getPrismaClient(): PrismaClient;
/**
 * Gracefully disconnect Prisma so pending queries can finish.
 */
export declare function disconnectPrisma(): Promise<void>;
//# sourceMappingURL=prisma.d.ts.map