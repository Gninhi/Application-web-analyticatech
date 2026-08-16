import { cookies } from "next/headers";
import type { Metadata } from "next";
import { getAppContent } from "@/lib/services/content.service";
import { getSeoMetadata } from "@/lib/services/seo.service";
import { safe, FALLBACK_SEO_METADATA } from "@/lib/services/safe";
import { AppClientShell } from "@/components/layout/AppClientShell";
import type { Locale } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "fr";
  // Résilient : si la DB est injoignable, on retombe sur des métadonnées statiques
  // plutôt que de faire échouer la page entière.
  const seo = await safe("seoMetadata", getSeoMetadata(locale), FALLBACK_SEO_METADATA);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      url: seo.canonicalUrl,
      siteName: "Analyticatech",
      images: seo.ogImageUrl ? [{ url: seo.ogImageUrl }] : [],
      type: "website",
    },
    twitter: {
      card: seo.twitterCard as "summary" | "summary_large_image" | "app" | "player",
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: seo.ogImageUrl ? [seo.ogImageUrl] : [],
    },
  };
}

/**
 * Server Component principal d'Analyticatech.
 * Récupère l'ensemble des données dynamiques depuis Supabase avec le cache React
 * et transmet le payload typé à la coquille client.
 */
export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "fr";
  const content = await getAppContent(locale);

  return <AppClientShell content={content} />;
}
