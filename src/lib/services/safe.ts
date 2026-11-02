import "server-only";

import { audit } from "@/lib/observability/audit";

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

export { FALLBACK_SEO_METADATA } from "@/lib/content/fallbacks";
