import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Configuration Prisma CLI (Prisma ORM 7).
 *
 * Supabase : `DATABASE_URL` est l'URL poolée (pgbouncer) utilisée par
 * l'application à l'exécution via `@prisma/adapter-pg` ; le CLI (migrations,
 * db push, studio) passe par `DIRECT_URL` (connexion directe 5432) pour
 * éviter le pooler transactionnel.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
