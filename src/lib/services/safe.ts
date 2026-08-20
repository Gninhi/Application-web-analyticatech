import "server-only";

import type { SiteConfigDTO, SeoMetadataDTO } from "@/types/content";
import { audit } from "@/lib/observability/audit";
import { DEFAULT_SITE_CONFIG } from "@/lib/content/site";

/**
 * Sûreté de fonctionnement côté serveur — mode offline.
 *
 * Enveloppe un appel de service Prisma/Supabase : si la promesse rejette
 * (base injoignable, timeout réseau, schéma non sourcé), l'incident est
 * journalisé en audit (WARN) et `fallback` est renvoyé au lieu de faire
 * échouer toute la page (`getAppContent` + `generateMetadata`).
 */
export async function safe<T>(label: string, promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    audit.warn("Content: fallback offline", {
      dataSource: label,
      error: err instanceof Error ? err.message : String(err),
    });
    return fallback;
  }
}

/** Variante d'appel sûre pour les collections : repli sur tableau vide typé. */
export function safeArray<T>(label: string, promise: Promise<T[]>): Promise<T[]> {
  return safe(label, promise, [] as T[]);
}

/** Config site de repli (source unique : `content/site.ts`). */
export const FALLBACK_SITE_CONFIG: SiteConfigDTO = DEFAULT_SITE_CONFIG;

/** Métadonnées SEO de repli (garantissent un `<head>` indexable même hors-ligne). */
export const FALLBACK_SEO_METADATA: SeoMetadataDTO = {
  title: "Analyticatech — Cabinet de conseil en IA, Agents & Automatisation",
  description:
    "Cabinet de conseil IA en France : architecture d'agents LLM, RAG, automatisation workflows et transformation digitale, sur plateforme souveraine.",
  keywords: [
    "cabinet conseil IA",
    "intelligence artificielle",
    "automatisation IA",
    "agents LLM",
    "LLM RAG",
  ],
  ogTitle: "Analyticatech — Consulting IA & Automatisation",
  ogDescription:
    "Cabinet de conseil IA en France : architecture d'agents LLM, RAG, automatisation workflows et transformation digitale, sur plateforme souveraine.",
  ogImageUrl: null,
  canonicalUrl: "https://analyticatech.fr",
  twitterCard: "summary_large_image",
};