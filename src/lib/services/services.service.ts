import { cache } from "react";
import type { ServiceDTO, Locale } from "@/types/content";
import { FALLBACK_SERVICES_FR, FALLBACK_SERVICES_EN } from "@/lib/content/fallbacks";

/**
 * Services : contenu éditorial versionné dans le code (`fallbacks.ts`), relu
 * selon la charte (sans chiffre non vérifiable). La base n'est plus lue.
 */

/**
 * Normalise un identifiant d'index de service (ex: "1" -> "01", "01" -> "01").
 */
export function normalizeServiceIndex(raw: string): string {
  const trimmed = (raw ?? "").trim();
  if (/^\d+$/.test(trimmed)) {
    return trimmed.padStart(2, "0");
  }
  return trimmed;
}

export const getServices = cache(async (locale: Locale = "fr"): Promise<ServiceDTO[]> =>
  locale === "en" ? FALLBACK_SERVICES_EN : FALLBACK_SERVICES_FR
);

export const getServiceByIndex = cache(
  async (rawIndex: string, locale: Locale = "fr"): Promise<ServiceDTO | null> => {
    const normalized = normalizeServiceIndex(rawIndex);
    const services = await getServices(locale);
    return services.find((s) => s.index === normalized || s.id === rawIndex) ?? null;
  }
);
