import type { MetadataRoute } from "next";
import { getAppContent } from "@/lib/services/content.service";

// Sitemap généré et mis en cache Edge via ISR (revalidation quotidienne 24h).
export const revalidate = 86400; // 24h


/**
 * Sitemap — indexation complète bilingue (FR racine / EN sous /en/).
 *
 * Expose l'ensemble des routes FR et EN avec leurs relations alternates.languages
 * pour un référencement international (SEO multilingue Google).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://analyticatech.fr";
  const lastModified = new Date("2026-07-27");

  const entries: MetadataRoute.Sitemap = [];

  const pushPair = (
    frPath: string,
    enPath: string,
    priority: number,
    changeFrequency: "daily" | "weekly" | "monthly" | "yearly" = "weekly"
  ) => {
    const alternates = {
      languages: {
        fr: `${baseUrl}${frPath}`,
        en: `${baseUrl}${enPath}`,
        "fr-FR": `${baseUrl}${frPath}`,
        "en-US": `${baseUrl}${enPath}`,
        "x-default": `${baseUrl}${frPath}`,
      },
    };

    // Entrée FR
    entries.push({
      url: `${baseUrl}${frPath}`,
      lastModified,
      changeFrequency,
      priority,
      alternates,
    });

    // Entrée EN
    entries.push({
      url: `${baseUrl}${enPath}`,
      lastModified,
      changeFrequency,
      priority: Math.max(0.1, priority - 0.05),
      alternates,
    });
  };

  pushPair("/", "/en", 1.0);
  pushPair("/services", "/en/services", 0.9);
  pushPair("/solutions", "/en/solutions", 0.9);
  pushPair("/insights", "/en/insights", 0.9);
  pushPair("/contact", "/en/contact", 0.8);
  pushPair("/a-propos", "/en/a-propos", 0.6);
  pushPair("/confidentialite", "/en/confidentialite", 0.3);
  pushPair("/mentions-legales", "/en/mentions-legales", 0.3);

  try {
    const content = await getAppContent("fr");
    content.services.forEach((s) => pushPair(`/services/${s.index}`, `/en/services/${s.index}`, 0.7));
    content.solutions.forEach((s) => pushPair(`/solutions/${s.slug}`, `/en/solutions/${s.slug}`, 0.7));
    content.blogPosts.forEach((p) =>
      pushPair(`/insights/${p.slug}`, `/en/insights/${p.slug}`, 0.6, "monthly")
    );
  } catch {
    // Offline : seules les routes statiques ci-dessus sont exposées.
  }

  return entries;
}