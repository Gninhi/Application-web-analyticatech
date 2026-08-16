import { cache } from "react";
import { db } from "@/lib/db/client";
import type { SolutionDTO, Locale } from "@/types/content";

export const getSolutions = cache(async (locale: Locale = "fr"): Promise<SolutionDTO[]> => {
  const raw = await db.solution.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale: locale } },
      tags: true,
    },
  });

  return raw.map((sol) => {
    const tr = sol.translations[0] || { title: "", summary: "" };
    return {
      id: sol.id,
      slug: sol.slug,
      sector: sol.sector,
      title: tr.title,
      summary: tr.summary,
      impact: sol.impact,
      tags: sol.tags.map((t) => t.tag),
      order: sol.order,
    };
  });
});
