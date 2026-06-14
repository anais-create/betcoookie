/**
 * Client Prisma partagé. Singleton mis en cache sur `globalThis` pour éviter
 * d'ouvrir une nouvelle connexion à chaque hot-reload en dev.
 * À n'importer QUE côté serveur (route handlers, server components, lib/*).
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
