import { cache } from "react";
import { db } from "@/lib/db/client";
import type { Prisma } from "@/generated/prisma/client";
import type { LegalSectionDTO, Locale } from "@/types/content";
import { FALLBACK_LEGAL_SECTIONS_FR, FALLBACK_LEGAL_SECTIONS_EN } from "@/lib/content/fallbacks";

export const getLegalSections = cache(async (locale: Locale = "fr", type?: "rgpd" | "legal"): Promise<LegalSectionDTO[]> => {
  const fallbackList = locale === "en" ? FALLBACK_LEGAL_SECTIONS_EN : FALLBACK_LEGAL_SECTIONS_FR;
  const filteredFallback = type ? fallbackList.filter((s) => s.type === type) : fallbackList;

  try {
    const whereClause: Prisma.LegalSectionWhereInput = {};
    if (type) whereClause.type = type;

    const raw = await db.legalSection.findMany({
      where: whereClause,
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale: locale } },
      },
    });

    if (!raw || raw.length === 0) return filteredFallback;

    return raw.map((s) => {
      const tr = s.translations[0] || { heading: "", body: "" };
      return {
        id: s.id,
        type: s.type,
        heading: tr.heading,
        body: tr.body,
        order: s.order,
      };
    });
  } catch {
    return filteredFallback;
  }
});
