import { cache } from "react";
import type { LegalSectionDTO, Locale } from "@/types/content";
import { FALLBACK_LEGAL_SECTIONS_FR, FALLBACK_LEGAL_SECTIONS_EN } from "@/lib/content/fallbacks";

/**
 * Sections légales (confidentialité, mentions) : versionnées dans le code pour
 * que chaque révision soit relue et datée. La base n'est plus lue.
 */
export const getLegalSections = cache(
  async (locale: Locale = "fr", type?: "rgpd" | "legal"): Promise<LegalSectionDTO[]> => {
    const sections = locale === "en" ? FALLBACK_LEGAL_SECTIONS_EN : FALLBACK_LEGAL_SECTIONS_FR;
    return type ? sections.filter((s) => s.type === type) : sections;
  }
);
