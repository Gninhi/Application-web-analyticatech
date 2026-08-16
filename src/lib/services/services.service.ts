import { cache } from "react";
import { db } from "@/lib/db/client";
import type { ServiceDTO, Locale } from "@/types/content";

export const getServices = cache(async (locale: Locale = "fr"): Promise<ServiceDTO[]> => {
  const raw = await db.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale: locale } },
      metrics: { orderBy: { order: "asc" } },
      technologies: { orderBy: { order: "asc" } },
    },
  });

  return raw.map((s) => {
    const tr = s.translations[0] || { title: "", tagline: "", description: "" };
    return {
      id: s.id,
      index: s.index,
      title: tr.title,
      tagline: tr.tagline,
      description: tr.description,
      technologies: s.technologies.map((t) => t.name),
      iconKey: s.iconKey,
      bgImagePath: s.bgImagePath,
      meshOverlay: s.meshOverlay,
      metrics: s.metrics.map((m) => ({ label: m.label, value: m.value })),
      order: s.order,
    };
  });
});
