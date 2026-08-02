import { cache } from "react";
import type { AppContentDTO, Locale } from "@/types/content";
import { getSiteConfig, getMarqueeKeywords, getActivityLogs, getCompanyValues, getDeliverySteps } from "./site-config.service";
import { getNavItems } from "./navigation.service";
import { getMetrics } from "./metrics.service";
import { getClientLogos } from "./clients.service";
import { getServices } from "./services.service";
import { getSolutions } from "./solutions.service";
import { getBlogCategories, getBlogPosts } from "./blog.service";
import { getCapabilities } from "./capabilities.service";
import { getTestimonials } from "./testimonials.service";
import { getLegalSections } from "./legal.service";
import { getSeoMetadata, getSeoSchemas } from "./seo.service";

/**
 * Service agrégateur principal.
 * Exécute tous les sous-services en parallèle via `Promise.all` et bénéficie
 * du cache `cache()` de React pour une performance maximale.
 */
export const getAppContent = cache(async (locale: Locale = "fr"): Promise<AppContentDTO> => {
  const [
    siteConfig,
    navItems,
    metrics,
    clientLogos,
    services,
    solutions,
    blogCategories,
    blogPosts,
    capabilities,
    testimonials,
    marqueeKeywords,
    activityLogs,
    companyValues,
    deliverySteps,
    rgpdSections,
    legalSections,
    seoMetadata,
    seoSchemas,
  ] = await Promise.all([
    getSiteConfig(),
    getNavItems(locale),
    getMetrics(locale),
    getClientLogos(),
    getServices(locale),
    getSolutions(locale),
    getBlogCategories(locale),
    getBlogPosts(locale),
    getCapabilities(locale),
    getTestimonials(locale),
    getMarqueeKeywords(locale),
    getActivityLogs(locale),
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
    metrics,
    clientLogos,
    services,
    solutions,
    blogCategories,
    blogPosts,
    capabilities,
    testimonials,
    marqueeKeywords,
    activityLogs,
    companyValues,
    deliverySteps,
    rgpdSections,
    legalSections,
    seoMetadata,
    seoSchemas,
  };
});
