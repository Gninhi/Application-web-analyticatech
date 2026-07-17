import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Headers de sécurité communs à toutes les réponses API. */
const API_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

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
      { status: 200, headers: API_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des clients" },
      { status: 500, headers: API_HEADERS }
    );
  }
}
