import { cache } from "react";
import type { CapabilityDTO, Locale } from "@/types/content";
import { FALLBACK_CAPABILITIES_FR, FALLBACK_CAPABILITIES_EN } from "@/lib/content/fallbacks";

/** Capacités : contenu versionné dans le code ; la base n'est plus lue. */
export const getCapabilities = cache(async (locale: Locale = "fr"): Promise<CapabilityDTO[]> =>
  locale === "en" ? FALLBACK_CAPABILITIES_EN : FALLBACK_CAPABILITIES_FR
);
