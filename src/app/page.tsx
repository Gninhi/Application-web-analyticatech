import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/services/seo.service";
import { safe, FALLBACK_SEO_METADATA } from "@/lib/services/safe";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { HomeRoute } from "@/components/routes/HomeRoute";

export const revalidate = 3600; // 1h

export async function generateMetadata(): Promise<Metadata> {
  // Résilient : si la DB est injoignable, on retombe sur des métadonnées statiques
  const seo = await safe("seoMetadata", getSeoMetadata("fr"), FALLBACK_SEO_METADATA);

  return buildPageMetadata({
    locale: "fr",
    path: "/",
    title: seo.title,
    description: seo.description,
  });
}

/**
 * Page d'accueil (route "/").
 * Le contenu est fourni par le layout racine (SiteShell) : la vue accueil
 * consomme le contexte ContentProvider, sans refetch par page.
 */
export default async function HomePage() {
  return <HomeRoute />;
}
