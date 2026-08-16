import type { MetadataRoute } from "next";

/**
 * Sitemap — optimise l'indexation par les moteurs de recherche.
 *
 * La navigation interne est en SPA (state client) : les "vues" services /
 * solutions / blog / contact / légal / à-propos ne sont PAS des routes
 * distinctes côté serveur. On n'expose donc que la page racine pour éviter
 * de mentir aux crawlers (toute autre URL renverrait un 404).
 *
 * `lastModified` est volontairement stable (et non "now") : un sitemap qui
 * change de date à chaque requête provoque un re-crawl inutile des moteurs.
 *
 * P3 documenté : convertir les vues en vraies routes App Router
 * (/services, /solutions, …) permettrait un sitemap complet, des URLs
 * partageables et un meta par page. Décision d'architecture — à planifier
 * séparément (impact : navigation, deep-links, états, animations).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://analyticatech.fr";
  // Date stable de la dernière refonte de contenu majeure.
  const lastModified = new Date("2026-07-27");

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
