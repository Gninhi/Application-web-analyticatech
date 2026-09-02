import { cache } from "react";
import { db } from "@/lib/db/client";
import type { SolutionDTO, Locale } from "@/types/content";
import { FALLBACK_SOLUTIONS_FR, FALLBACK_SOLUTIONS_EN } from "./safe";

const SECTOR_TRANSLATIONS_EN: Record<string, string> = {
  "Logistique": "Logistics",
  "Finance": "Finance",
  "Retail": "Retail",
  "Santé": "Healthcare",
  "Industrie": "Industry",
  "Énergie": "Energy",
  "Conseil": "Consulting",
  "Aéro": "Aerospace",
  "Cybersécurité": "Cybersecurity",
};

export const getSolutions = cache(async (locale: Locale = "fr"): Promise<SolutionDTO[]> => {
  try {
    const raw = await db.solution.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale: locale } },
        tags: true,
      },
    });

    if (!raw || raw.length === 0) {
      return locale === "en" ? FALLBACK_SOLUTIONS_EN : FALLBACK_SOLUTIONS_FR;
    }

    return raw.map((sol) => {
      const tr = sol.translations[0] || { title: "", summary: "" };
      const sector =
        locale === "en"
          ? SECTOR_TRANSLATIONS_EN[sol.sector] || sol.sector
          : sol.sector;

      return {
        id: sol.id,
        slug: sol.slug,
        sector,
        title: tr.title || sol.slug,
        summary: tr.summary,
        impact: sol.impact,
        tags: sol.tags.map((t) => t.tag),
        order: sol.order,
      };
    });
  } catch {
    return locale === "en" ? FALLBACK_SOLUTIONS_EN : FALLBACK_SOLUTIONS_FR;
  }
});

