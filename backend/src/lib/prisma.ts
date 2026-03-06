import { PrismaClient } from "@prisma/client";

// Zapobiega tworzeniu wielu instancji Prisma Client podczas przeładowywania kodu (hot-reload) w trybie deweloperskim
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
