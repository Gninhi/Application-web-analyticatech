import type { MetadataRoute } from "next";

/**
 * Robots.txt — autorise l'indexation par moteurs de recherche ET LLMs.
 * Inclut les crawlers IA (GPTBot, ClaudeBot, PerplexityBot, etc.)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Moteurs de recherche classiques
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // OpenAI / ChatGPT
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Anthropic / Claude
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Perplexity
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Google AI
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Common Crawl (utilisé par de nombreux LLMs)
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Amazon / Alexa
        userAgent: "Amazonbot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Bytespider (TikTok / Douyin)
        userAgent: "Bytespider",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://analyticatech.fr/sitemap.xml",
    host: "https://analyticatech.fr",
  };
}
