import { NextResponse, type NextRequest } from "next/server";
import { getAppContent } from "@/lib/services/content.service";
import type { Locale } from "@/types/content";

/**
 * Route GET /api/v1/content?locale=en|fr
 *
 * Fournit l'ensemble des données dynamiques traduites depuis Supabase/Prisma
 * pour alimenter le ContentProvider lors du basculement de langue client-side.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawLocale = searchParams.get("locale");
  const locale: Locale = rawLocale === "en" ? "en" : "fr";

  try {
    const content = await getAppContent(locale);

    return NextResponse.json(
      {
        success: true,
        data: content,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
          "CDN-Cache-Control": "public, s-maxage=3600",
          "Vary": "Accept-Encoding",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur interne",
      },
      { status: 500 }
    );
  }
}
