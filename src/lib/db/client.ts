import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL ?? "",
  ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
});

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error"],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
