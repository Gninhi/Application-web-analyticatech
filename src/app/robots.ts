import type { MetadataRoute } from "next";

/**
 * Robots.txt — cohérent avec les mentions légales (section 3) :
 * - moteurs de recherche et assistants d'IA qui citent leurs sources :
 *   indexation autorisée (visibilité dans Google, ChatGPT Search, Perplexity…) ;
 * - robots qui collectent pour ENTRAÎNER des modèles : refusés. C'est
 *   l'expression lisible par machine de l'opposition prévue à l'article
 *   L. 122-5-3 du Code de la propriété intellectuelle.
 */
const TRAINING_CRAWLERS = [
  "GPTBot", // OpenAI — entraînement (≠ OAI-SearchBot, autorisé)
  "ClaudeBot", // Anthropic — entraînement (≠ Claude-SearchBot, autorisé)
  "Google-Extended", // Google — usage pour l'entraînement de Gemini
  "Applebot-Extended", // Apple — entraînement
  "CCBot", // Common Crawl — corpus d'entraînement
  "Bytespider", // ByteDance — entraînement
  "Meta-ExternalAgent", // Meta — entraînement
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: TRAINING_CRAWLERS,
        disallow: "/",
      },
    ],
    sitemap: "https://www.analyticatech.fr/sitemap.xml",
    host: "https://www.analyticatech.fr",
  };
}
