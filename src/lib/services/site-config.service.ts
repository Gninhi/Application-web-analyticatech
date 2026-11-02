import { cache } from "react";
import { DEFAULT_SITE_CONFIG } from "@/lib/content/site";
import type { SiteConfigDTO, CompanyValueDTO, DeliveryStepDTO, Locale } from "@/types/content";
import {
  FALLBACK_MARQUEE_KEYWORDS_FR,
  FALLBACK_MARQUEE_KEYWORDS_EN,
  FALLBACK_COMPANY_VALUES_FR,
  FALLBACK_COMPANY_VALUES_EN,
  FALLBACK_DELIVERY_STEPS_FR,
  FALLBACK_DELIVERY_STEPS_EN,
} from "@/lib/content/fallbacks";

/**
 * Configuration du site et contenus de présentation : versionnés dans le code
 * (`site.ts`, `fallbacks.ts`). La base n'est plus lue : elle contenait des
 * liens sociaux génériques et des valeurs (« équipe dédiée ») contraires à la
 * réalité d'un cabinet fondé et dirigé par une seule personne.
 */
export const getSiteConfig = cache(async (): Promise<SiteConfigDTO> => DEFAULT_SITE_CONFIG);

export const getMarqueeKeywords = cache(async (locale: Locale = "fr"): Promise<string[]> =>
  locale === "en" ? FALLBACK_MARQUEE_KEYWORDS_EN : FALLBACK_MARQUEE_KEYWORDS_FR
);

export const getCompanyValues = cache(async (locale: Locale = "fr"): Promise<CompanyValueDTO[]> =>
  locale === "en" ? FALLBACK_COMPANY_VALUES_EN : FALLBACK_COMPANY_VALUES_FR
);

export const getDeliverySteps = cache(async (locale: Locale = "fr"): Promise<DeliveryStepDTO[]> =>
  locale === "en" ? FALLBACK_DELIVERY_STEPS_EN : FALLBACK_DELIVERY_STEPS_FR
);
