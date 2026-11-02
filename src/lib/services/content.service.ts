import { cache } from "react";
import type { AppContentDTO, Locale } from "@/types/content";
import { getSiteConfig, getMarqueeKeywords, getCompanyValues, getDeliverySteps } from "./site-config.service";
import { getNavItems } from "./navigation.service";
import { getServices } from "./services.service";
import { getSolutions } from "./solutions.service";
import { getBlogCategories, getBlogPosts } from "./blog.service";
import { getCapabilities } from "./capabilities.service";
import { getLegalSections } from "./legal.service";
import { getSeoMetadata, getSeoSchemas } from "./seo.service";

/**
 * Service agrégateur principal.
 *
 * Tout le contenu éditorial est versionné dans le code (`src/lib/content/`) :
 * chaque texte publié est relu dans une revue de code et vérifié par
 * `content-charter.test.ts`. La base Supabase ne sert plus qu'aux demandes de
 * contact et aux listes de sécurité (domaines bloqués).
 *
 * Charte : aucun chiffre, logo client, témoignage ou flux d'activité qui ne
 * soit réel et vérifiable — ces blocs sont servis vides.
 */
export const getAppContent = cache(async (locale: Locale = "fr"): Promise<AppContentDTO> => {
  const [
    siteConfig,
    navItems,
    services,
    solutions,
    blogCategories,
    blogPosts,
    capabilities,
    marqueeKeywords,
    companyValues,
    deliverySteps,
    rgpdSections,
    legalSections,
    seoMetadata,
    seoSchemas,
  ] = await Promise.all([
    getSiteConfig(),
    getNavItems(locale),
    getServices(locale),
    getSolutions(locale),
    getBlogCategories(locale),
    getBlogPosts(locale),
    getCapabilities(locale),
    getMarqueeKeywords(locale),
    getCompanyValues(locale),
    getDeliverySteps(locale),
    getLegalSections(locale, "rgpd"),
    getLegalSections(locale, "legal"),
    getSeoMetadata(locale),
    getSeoSchemas(),
  ]);

  return {
    locale,
    siteConfig,
    navItems,
    metrics: [],
    clientLogos: [],
    services: services.map((svc) => ({ ...svc, metrics: [] })),
    solutions,
    blogCategories,
    blogPosts,
    capabilities,
    testimonials: [],
    marqueeKeywords,
    activityLogs: [],
    companyValues,
    deliverySteps,
    rgpdSections,
    legalSections,
    seoMetadata,
    seoSchemas,
  };
});
