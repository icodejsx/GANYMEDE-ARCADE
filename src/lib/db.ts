import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** SQLite file DBs cannot persist (or often even open) on Vercel serverless. */
export function canUseDatabase() {
  if (process.env.VERCEL === "1") return false;
  const url = process.env.DATABASE_URL?.trim();
  return Boolean(url);
}

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export function getPrisma() {
  if (!canUseDatabase()) {
    throw new Error("Database is unavailable in this environment");
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

/** @deprecated Prefer getPrisma() so Vercel never opens SQLite. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
