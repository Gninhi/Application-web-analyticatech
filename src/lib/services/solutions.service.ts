import { cache } from "react";
import type { SolutionDTO, Locale } from "@/types/content";
import { FALLBACK_SOLUTIONS_FR, FALLBACK_SOLUTIONS_EN } from "@/lib/content/fallbacks";

/**
 * Solutions : projets réellement construits par Analyticatech puis pistes
 * assumées comme non construites (`fallbacks.ts`). La base n'est plus lue :
 * ses fiches sectorielles décrivaient des résultats clients non démontrés.
 */
export const getSolutions = cache(async (locale: Locale = "fr"): Promise<SolutionDTO[]> =>
  locale === "en" ? FALLBACK_SOLUTIONS_EN : FALLBACK_SOLUTIONS_FR
);
