import { cookies } from "next/headers";
import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/services/seo.service";
import { safe, FALLBACK_SEO_METADATA } from "@/lib/services/safe";
import { HomeRoute } from "@/components/routes/HomeRoute";
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
 * Page d'accueil (route "/").
 * Le contenu est fourni par le layout racine (SiteShell) : la vue accueil
 * consomme le contexte ContentProvider, sans refetch par page.
 */
export default async function HomePage() {
  return <HomeRoute />;
}
