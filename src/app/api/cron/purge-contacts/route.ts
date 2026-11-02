import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { audit } from "@/lib/observability/audit";
import { getServerEnv } from "@/lib/env";
import { constantTimeEqual } from "@/lib/security/csrf";

/**
 * GET /api/cron/purge-contacts — applique la durée de conservation annoncée
 * dans la politique de confidentialité : les demandes de contact sont
 * supprimées 3 ans après le dernier échange (`updatedAt`).
 *
 * Déclenchée chaque jour par Vercel Cron (`vercel.json`), qui envoie
 * `Authorization: Bearer $CRON_SECRET`. Fail-closed : sans CRON_SECRET
 * configuré, la route refuse toute exécution.
 */

export const dynamic = "force-dynamic";

const RETENTION_YEARS = 3;

function retentionCutoff(now: Date = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - RETENTION_YEARS);
  return cutoff;
}

export async function GET(req: NextRequest) {
  const secret = getServerEnv().CRON_SECRET;
  const provided = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";

  if (!secret || !provided || !constantTimeEqual(provided, secret)) {
    return NextResponse.json({ success: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const cutoff = retentionCutoff();
  try {
    const { count } = await db.contactRequest.deleteMany({ where: { updatedAt: { lt: cutoff } } });
    audit.info("Contact: purge de conservation", { deleted: count, cutoff: cutoff.toISOString() });
    return NextResponse.json({ success: true, deleted: count }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    audit.warn("Contact: échec de la purge de conservation", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ success: false }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
