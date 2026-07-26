/**
 * PrismaClient singleton — provides a single, lazily-initialized PrismaClient
 * instance for the lifetime of the process.
 */

import { PrismaClient } from "@prisma/client";

let client: PrismaClient | undefined;

export function getPrismaClient(): PrismaClient {
  if (!client) {
    client = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "warn", "error"]
          : ["warn", "error"],
    });
  }
  return client;
}

/**
 * Gracefully disconnect Prisma so pending queries can finish.
 */
export async function disconnectPrisma(): Promise<void> {
  if (client) {
    await client.$disconnect();
    client = undefined;
  }
}