import { getServerEnv } from "@/lib/env";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { readFileSync } from "node:fs";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const env = getServerEnv();

// CA racine Supabase (`Supabase Root 2021 CA`), auto-signée et publiée
// officiellement : le pooler (`*.pooler.supabase.com`) sert un certificat
// signé par cette CA privée, pas une CA publique. La piéger permet le mode
// `verify-full` (TLS + vérification stricte de la chaîne + hostname) au lieu
// de `rejectUnauthorized: false` (TLS encrypté sans vérification).
// Fichier public de confiance — pas un secret. `DATABASE_SSL="false"` reste
// disponible pour un Postgres local sans TLS (dev uniquement).
const SUPABASE_CA_PATH = path.join(process.cwd(), "src/lib/db/supabase-ca-2021.crt");

function loadSupabaseCa(): string | undefined {
  try {
    return readFileSync(SUPABASE_CA_PATH, "utf8");
  } catch {
    return undefined;
  }
}

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL ?? "",
  // TLS strict (`verify-full`) : vérification de la chaîne via la CA racine
  // Supabase piégée dans le repo. `DATABASE_SSL="false"` pour du dev local
  // Postgres sans TLS (jamais en production).
  ssl:
    env.DATABASE_SSL === "false"
      ? false
      : { rejectUnauthorized: true, ca: loadSupabaseCa() },
});

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error"],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
