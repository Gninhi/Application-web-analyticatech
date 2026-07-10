import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/clients
 * Retourne les logos/entreprises clients pour la section "Ils nous confient".
 * Cache long (1h) — les logos changent rarement.
 */
export async function GET() {
  try {
    const clients = await db.clientLogo.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        name: true,
        sector: true,
      },
    });

    return NextResponse.json(
      { success: true, clients },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error) {
    console.error("[clients] Error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des clients" },
      { status: 500 }
    );
  }
}
