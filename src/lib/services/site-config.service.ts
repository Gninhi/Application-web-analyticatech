import { cache } from "react";
import { db } from "@/lib/db/client";
import { DEFAULT_SITE_CONFIG } from "@/lib/content/site";
import type { SiteConfigDTO, CompanyValueDTO, DeliveryStepDTO, ActivityLogDTO, Locale } from "@/types/content";

export const getSiteConfig = cache(async (): Promise<SiteConfigDTO> => {
  const config = await db.siteConfig.findUnique({
    where: { id: "singleton" },
  });

  return {
    siteName: config?.siteName || DEFAULT_SITE_CONFIG.siteName,
    url: config?.url || DEFAULT_SITE_CONFIG.url,
    email: config?.email || DEFAULT_SITE_CONFIG.email,
    phone: config?.phone || DEFAULT_SITE_CONFIG.phone,
    phoneHref: config?.phoneHref || DEFAULT_SITE_CONFIG.phoneHref,
    streetAddress: config?.streetAddress || DEFAULT_SITE_CONFIG.streetAddress,
    city: config?.city || DEFAULT_SITE_CONFIG.city,
    postalCode: config?.postalCode || DEFAULT_SITE_CONFIG.postalCode,
    country: config?.country || DEFAULT_SITE_CONFIG.country,
    countryCode: config?.countryCode || DEFAULT_SITE_CONFIG.countryCode,
    socialLinkedin: config?.socialLinkedin || DEFAULT_SITE_CONFIG.socialLinkedin,
    socialTwitter: config?.socialTwitter || DEFAULT_SITE_CONFIG.socialTwitter,
    socialGithub: config?.socialGithub || DEFAULT_SITE_CONFIG.socialGithub,
    geoLat: config?.geoLat ?? DEFAULT_SITE_CONFIG.geoLat,
    geoLng: config?.geoLng ?? DEFAULT_SITE_CONFIG.geoLng,
  };
});

export const getMarqueeKeywords = cache(async (locale: Locale = "fr"): Promise<string[]> => {
  const keywords = await db.marqueeKeyword.findMany({
    where: { locale: locale, active: true },
    orderBy: { order: "asc" },
  });
  return keywords.map((k) => k.keyword);
});

export const getActivityLogs = cache(async (locale: Locale = "fr"): Promise<ActivityLogDTO[]> => {
  const logs = await db.activityLogEntry.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale: locale } },
    },
  });

  return logs.map((l) => ({
    id: l.id,
    time: l.time,
    level: l.level as "info" | "ok" | "warn",
    event: l.translations[0]?.event || "",
  }));
});

export const getCompanyValues = cache(async (locale: Locale = "fr"): Promise<CompanyValueDTO[]> => {
  const vals = await db.companyValue.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale: locale } },
    },
  });

  return vals.map((v) => ({
    id: v.id,
    iconKey: v.iconKey,
    title: v.translations[0]?.title || "",
    description: v.translations[0]?.description || "",
    order: v.order,
  }));
});

export const getDeliverySteps = cache(async (locale: Locale = "fr"): Promise<DeliveryStepDTO[]> => {
  const steps = await db.deliveryStep.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale: locale } },
    },
  });

  return steps.map((s) => ({
    id: s.id,
    iconKey: s.iconKey,
    label: s.translations[0]?.label || "",
    description: s.translations[0]?.description || "",
    order: s.order,
  }));
});
