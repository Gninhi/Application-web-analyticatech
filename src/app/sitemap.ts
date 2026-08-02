import type { MetadataRoute } from "next";

/**
 * Sitemap — optimise l'indexation par les moteurs de recherche.
 *
 * NOTE: la navigation interne est en SPA (state client). Les "vues" services /
 * solutions / blog / contact ne sont PAS des routes distinctes côté serveur.
 * On n'expose donc que la page racine pour éviter de mentir aux crawlers.
 *
 * Si l'on migrera vers App Router routes réelles (/services, /solutions, ...)
 * → décommenter/ajouter les URLs correspondantes ici.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://analyticatech.fr";
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
