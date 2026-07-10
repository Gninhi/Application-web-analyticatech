import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/metrics
 * Retourne les métriques dynamiques affichées sur la home.
 * Cache court (60s) pour équilibrer fraîcheur et perf.
 */
export async function GET() {
  try {
    const metrics = await db.metric.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        key: true,
        label: true,
        value: true,
        suffix: true,
      },
    });

    return NextResponse.json(
      { success: true, metrics },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error) {
    console.error("[metrics] Error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des métriques" },
      { status: 500 }
    );
  }
}
