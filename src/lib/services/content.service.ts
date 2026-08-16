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
import { safe, safeArray, FALLBACK_SITE_CONFIG, FALLBACK_SEO_METADATA } from "./safe";

/**
 * Service agrégateur principal.
 *
 * Chaque sous-service est enveloppé par `safe`/`safeArray` : en cas de défaillance
 * DB (injoignable, timeout), la section concernée reçoit un repli typé (objet par
 * défaut ou tableau vide) et le site continue de s'afficher en mode offline —
 * plus aucune requête échouée ne fait planter la page entière.
 * L'ensemble bénéficie du cache `cache()` de React pour la performance.
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
    safe("siteConfig", getSiteConfig(), FALLBACK_SITE_CONFIG),
    safeArray("navItems", getNavItems(locale)),
    safeArray("metrics", getMetrics(locale)),
    safeArray("clientLogos", getClientLogos()),
    safeArray("services", getServices(locale)),
    safeArray("solutions", getSolutions(locale)),
    safeArray("blogCategories", getBlogCategories(locale)),
    safeArray("blogPosts", getBlogPosts(locale)),
    safeArray("capabilities", getCapabilities(locale)),
    safeArray("testimonials", getTestimonials(locale)),
    safeArray("marqueeKeywords", getMarqueeKeywords(locale)),
    safeArray("activityLogs", getActivityLogs(locale)),
    safeArray("companyValues", getCompanyValues(locale)),
    safeArray("deliverySteps", getDeliverySteps(locale)),
    safeArray("rgpdSections", getLegalSections(locale, "rgpd")),
    safeArray("legalSections", getLegalSections(locale, "legal")),
    safe("seoMetadata", getSeoMetadata(locale), FALLBACK_SEO_METADATA),
    safeArray("seoSchemas", getSeoSchemas()),
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
