import { cache } from "react";
import { db } from "@/lib/db/client";
import type { NavItemDTO, Locale } from "@/types/content";

export const getNavItems = cache(async (locale: Locale = "fr"): Promise<NavItemDTO[]> => {
  const raw = await db.navItem.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale: locale as any } },
    },
  });

  return raw.map((n) => {
    const tr = n.translations[0] || { label: n.viewKey, hint: "" };
    return {
      id: n.id,
      viewKey: n.viewKey,
      label: tr.label,
      hint: tr.hint,
      order: n.order,
    };
  });
});
