import { NextResponse } from "next/server";

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
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
