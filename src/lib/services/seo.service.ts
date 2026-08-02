import { cache } from "react";
import { db } from "@/lib/db/client";
import type { SeoMetadataDTO, SeoSchemaDTO, Locale } from "@/types/content";

export const getSeoMetadata = cache(async (locale: Locale = "fr"): Promise<SeoMetadataDTO> => {
  const meta = await db.seoMetadata.findUnique({
    where: { id: "singleton" },
    include: {
      translations: { where: { locale: locale as any } },
    },
  });

  const tr = meta?.translations[0];

  return {
    title: tr?.title || "Analyticatech",
    description: tr?.description || "",
    keywords: tr?.keywords || [],
    ogTitle: tr?.ogTitle || tr?.title || null,
    ogDescription: tr?.ogDescription || tr?.description || null,
    ogImageUrl: meta?.ogImageUrl || null,
    canonicalUrl: meta?.canonicalUrl || "https://analyticatech.fr",
    twitterCard: meta?.twitterCard || "summary_large_image",
  };
});

export const getSeoSchemas = cache(async (): Promise<SeoSchemaDTO[]> => {
  const schemas = await db.seoSchema.findMany({
    where: { active: true },
  });

  return schemas.map((s) => ({
    id: s.id,
    type: s.type,
    payload: s.payload as Record<string, any>,
  }));
});
