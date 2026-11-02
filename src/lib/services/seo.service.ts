import { cache } from "react";
import type { SeoMetadataDTO, SeoSchemaDTO, Locale } from "@/types/content";
import { FALLBACK_SEO_METADATA, FALLBACK_SEO_METADATA_EN } from "@/lib/content/fallbacks";

/** Métadonnées SEO : définies dans le code ; la base n'est plus lue. */
export const getSeoMetadata = cache(async (locale: Locale = "fr"): Promise<SeoMetadataDTO> =>
  locale === "en" ? FALLBACK_SEO_METADATA_EN : FALLBACK_SEO_METADATA
);

/**
 * Schémas JSON-LD additionnels. Aucun : l'Organization est construite par
 * `JsonLd` à partir de `SITE_CONFIG` (évite le doublon base + code).
 */
export const getSeoSchemas = cache(async (): Promise<SeoSchemaDTO[]> => []);
