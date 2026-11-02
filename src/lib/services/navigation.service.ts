import { cache } from "react";
import type { NavItemDTO, Locale } from "@/types/content";
import { FALLBACK_NAV_ITEMS_FR, FALLBACK_NAV_ITEMS_EN } from "@/lib/content/fallbacks";

/** Navigation : définie dans le code ; la base n'est plus lue. */
export const getNavItems = cache(async (locale: Locale = "fr"): Promise<NavItemDTO[]> =>
  locale === "en" ? FALLBACK_NAV_ITEMS_EN : FALLBACK_NAV_ITEMS_FR
);
