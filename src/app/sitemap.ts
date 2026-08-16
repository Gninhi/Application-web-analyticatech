import type { MetadataRoute } from "next";
import { getAppContent } from "@/lib/services/content.service";

// Le contenu dynamique (services, solutions, articles) vient de la DB à la
// requête : on force la génération à la demande pour que les URLs de détail
// reflètent toujours le contenu réel (cohérent avec les pages, toutes
// dynamiques). Le contenu est dédupliqué par requête via React `cache()`.
export const dynamic = "force-dynamic";

/**
 * Sitemap — indexation complète.
 *
 * Depuis la conversion en vraies routes App Router, toutes les pages sont
 * deep-linkables : routes statiques (services, solutions, insights, contact,
 * légal, à-propos) + entités dynamiques (services/[index], solutions/[slug],
 * insights/[slug]) issues du contenu DB. En mode offline (DB injoignable),
 * seules les routes statiques sont exposées — jamais d'URL fantôme.
 *
 * `lastModified` est volontairement stable (et non "now") : un sitemap qui
 * change de date à chaque requête provoque un re-crawl inutile des moteurs.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://analyticatech.fr";
  // Date stable de la dernière refonte de contenu majeure.
  const lastModified = new Date("2026-07-27");

  const entries: MetadataRoute.Sitemap = [];
  const push = (
    url: string,
    priority: number,
    changeFrequency: "daily" | "weekly" | "monthly" | "yearly" = "weekly"
  ) => {
    entries.push({ url: `${baseUrl}${url}`, lastModified, changeFrequency, priority });
  };

  push("/", 1.0);
  push("/services", 0.9);
  push("/solutions", 0.9);
  push("/insights", 0.9);
  push("/contact", 0.8);
  push("/a-propos", 0.6);
  push("/confidentialite", 0.3);
  push("/mentions-legales", 0.3);

  try {
    const content = await getAppContent("fr");
    content.services.forEach((s) => push(`/services/${s.index}`, 0.7));
    content.solutions.forEach((s) => push(`/solutions/${s.slug}`, 0.7));
    content.blogPosts.forEach((p) => push(`/insights/${p.slug}`, 0.6, "monthly"));
  } catch {
    // Offline : seules les routes statiques ci-dessus sont exposées.
  }

  return entries;
}