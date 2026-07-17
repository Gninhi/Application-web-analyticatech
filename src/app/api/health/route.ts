import { NextResponse } from "next/server";

/** Headers de sécurité pour le health check. */
const HEALTH_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

/**
 * GET /api/health
 * Probe de santé pour monitoring Docker / Kubernetes.
 * Retourne un statut simple + timestamp.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "UP",
      timestamp: Date.now(),
      service: "analyticatech-web",
      version: "2.4.1",
    },
    { status: 200, headers: HEALTH_HEADERS }
  );
}
