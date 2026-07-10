import type { MetadataRoute } from "next";

/**
 * Robots.txt — autorise l'indexation, pointe vers le sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://analyticatech.com/sitemap.xml",
    host: "https://analyticatech.com",
  };
}
