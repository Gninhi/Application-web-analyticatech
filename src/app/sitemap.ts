import type { MetadataRoute } from "next";

/**
 * Sitemap dynamique — optimise l'indexation par les moteurs de recherche.
 * Inclut les versions FR et EN pour le référencement multilingue.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://analyticatech.com";
  const now = new Date();

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/#services", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/#solutions", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/#blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/#contact", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  // Génère les URLs pour FR et EN
  return routes.flatMap((route) => [
    {
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          "fr-FR": `${baseUrl}${route.path}`,
          "en-US": `${baseUrl}/en${route.path}`,
        },
      },
    },
  ]);
}
