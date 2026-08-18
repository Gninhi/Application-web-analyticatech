import { cache } from "react";
import { db } from "@/lib/db/client";
import type { Prisma } from "@/generated/prisma/client";
import type { LegalSectionDTO, Locale } from "@/types/content";

export const getLegalSections = cache(async (locale: Locale = "fr", type?: "rgpd" | "legal"): Promise<LegalSectionDTO[]> => {
  const whereClause: Prisma.LegalSectionWhereInput = {};
  if (type) whereClause.type = type;

  const raw = await db.legalSection.findMany({
    where: whereClause,
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale: locale } },
    },
  });

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
});
