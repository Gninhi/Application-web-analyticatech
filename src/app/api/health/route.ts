import { NextResponse } from "next/server";
import { APP_VERSION } from "@/lib/utils/version";

/** Headers de sécurité pour le health check. */
const HEALTH_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

/**
 * GET /api/health
 * Probe de santé pour monitoring Docker / Kubernetes.
 * `version` provient de `src/lib/version.ts` (injectée via NEXT_PUBLIC_APP_VERSION
 * au build, fallback sur constante locale si absente).
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "UP",
      timestamp: Date.now(),
      service: "analyticatech-web",
      version: APP_VERSION,
    },
    { status: 200, headers: HEALTH_HEADERS }
  );
}
