import { cache } from "react";
import { db } from "@/lib/db/client";
import type { CapabilityDTO, Locale } from "@/types/content";

export const getCapabilities = cache(async (locale: Locale = "fr"): Promise<CapabilityDTO[]> => {
  const raw = await db.capability.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale: locale as any } },
      features: { orderBy: { order: "asc" } },
    },
  });

  return raw.map((c) => {
    const tr = c.translations[0] || { stretch: "", title: "", description: "" };
    return {
      id: c.id,
      key: c.key,
      stretch: tr.stretch,
      title: tr.title,
      description: tr.description,
      features: c.features.map((f) => (locale === "en" ? f.textEn : f.textFr)),
      order: c.order,
    };
  });
});
