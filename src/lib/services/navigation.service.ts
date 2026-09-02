import { cache } from "react";
import { db } from "@/lib/db/client";
import type { NavItemDTO, Locale } from "@/types/content";
import { FALLBACK_NAV_ITEMS_FR, FALLBACK_NAV_ITEMS_EN } from "@/lib/content/fallbacks";

export const getNavItems = cache(async (locale: Locale = "fr"): Promise<NavItemDTO[]> => {
  const fallback = locale === "en" ? FALLBACK_NAV_ITEMS_EN : FALLBACK_NAV_ITEMS_FR;
  try {
    const raw = await db.navItem.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale: locale } },
      },
    });

    if (!raw || raw.length === 0) return fallback;

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
  } catch {
    return fallback;
  }
});
