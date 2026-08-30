import { NextResponse } from "next/server";
import { APP_VERSION } from "@/lib/utils/version";
import { db } from "@/lib/db/client";

/** Headers de sécurité pour le health check. */
const HEALTH_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

/**
 * GET /api/health
 * Probe de santé pour monitoring Docker / Kubernetes / Uptime.
 * Vérifie l'état de l'application et de la base de données avec timeout de sécurité.
 */
export async function GET() {
  let dbStatus = "UNKNOWN";

  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Database check timeout")), 2000)
    );
    await Promise.race([db.$queryRaw`SELECT 1`, timeout]);
    dbStatus = "UP";
  } catch {
    dbStatus = "DEGRADED";
  }

  const isHealthy = dbStatus === "UP";

  return NextResponse.json(
    {
      status: isHealthy ? "UP" : "DEGRADED",
      timestamp: Date.now(),
      service: "analyticatech-web",
      version: APP_VERSION,
      components: {
        database: dbStatus,
        web: "UP",
      },
    },
    {
      status: 200,
      headers: HEALTH_HEADERS,
    }
  );
}
