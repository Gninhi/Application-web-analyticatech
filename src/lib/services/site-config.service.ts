import { cache } from "react";
import { db } from "@/lib/db/client";
import { DEFAULT_SITE_CONFIG, isValidSocialUrl } from "@/lib/content/site";
import type { SiteConfigDTO, CompanyValueDTO, DeliveryStepDTO, ActivityLogDTO, Locale } from "@/types/content";
import {
  FALLBACK_MARQUEE_KEYWORDS_FR,
  FALLBACK_MARQUEE_KEYWORDS_EN,
  FALLBACK_ACTIVITY_LOGS_FR,
  FALLBACK_ACTIVITY_LOGS_EN,
  FALLBACK_COMPANY_VALUES_FR,
  FALLBACK_COMPANY_VALUES_EN,
  FALLBACK_DELIVERY_STEPS_FR,
  FALLBACK_DELIVERY_STEPS_EN,
} from "@/lib/content/fallbacks";

export const getSiteConfig = cache(async (): Promise<SiteConfigDTO> => {
  try {
    const config = await db.siteConfig.findUnique({
      where: { id: "singleton" },
    });

    const envLinkedin = process.env.SOCIAL_LINKEDIN_URL || process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL;
    const envTwitter = process.env.SOCIAL_TWITTER_URL || process.env.NEXT_PUBLIC_SOCIAL_TWITTER_URL;
    const envGithub = process.env.SOCIAL_GITHUB_URL || process.env.NEXT_PUBLIC_SOCIAL_GITHUB_URL;

    const rawLinkedin = envLinkedin || config?.socialLinkedin || DEFAULT_SITE_CONFIG.socialLinkedin;
    const rawTwitter = envTwitter || config?.socialTwitter || DEFAULT_SITE_CONFIG.socialTwitter;
    const rawGithub = envGithub || config?.socialGithub || DEFAULT_SITE_CONFIG.socialGithub;

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
      socialLinkedin: isValidSocialUrl(rawLinkedin) ? rawLinkedin : null,
      socialTwitter: isValidSocialUrl(rawTwitter) ? rawTwitter : null,
      socialGithub: isValidSocialUrl(rawGithub) ? rawGithub : null,
      geoLat: config?.geoLat ?? DEFAULT_SITE_CONFIG.geoLat,
      geoLng: config?.geoLng ?? DEFAULT_SITE_CONFIG.geoLng,
    };
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
});

export const getMarqueeKeywords = cache(async (locale: Locale = "fr"): Promise<string[]> => {
  const fallback = locale === "en" ? FALLBACK_MARQUEE_KEYWORDS_EN : FALLBACK_MARQUEE_KEYWORDS_FR;
  try {
    const keywords = await db.marqueeKeyword.findMany({
      where: { locale: locale, active: true },
      orderBy: { order: "asc" },
    });
    if (!keywords || keywords.length === 0) return fallback;
    return keywords.map((k) => k.keyword);
  } catch {
    return fallback;
  }
});

export const getActivityLogs = cache(async (locale: Locale = "fr"): Promise<ActivityLogDTO[]> => {
  const fallback = locale === "en" ? FALLBACK_ACTIVITY_LOGS_EN : FALLBACK_ACTIVITY_LOGS_FR;
  try {
    const logs = await db.activityLogEntry.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale: locale } },
      },
    });

    if (!logs || logs.length === 0) return fallback;

    return logs.map((l) => ({
      id: l.id,
      time: l.time,
      level: l.level as "info" | "ok" | "warn",
      event: l.translations[0]?.event || "",
    }));
  } catch {
    return fallback;
  }
});

export const getCompanyValues = cache(async (locale: Locale = "fr"): Promise<CompanyValueDTO[]> => {
  const fallback = locale === "en" ? FALLBACK_COMPANY_VALUES_EN : FALLBACK_COMPANY_VALUES_FR;
  try {
    const vals = await db.companyValue.findMany({
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale: locale } },
      },
    });

    if (!vals || vals.length === 0) return fallback;

    return vals.map((v) => ({
      id: v.id,
      iconKey: v.iconKey,
      title: v.translations[0]?.title || "",
      description: v.translations[0]?.description || "",
      order: v.order,
    }));
  } catch {
    return fallback;
  }
});

export const getDeliverySteps = cache(async (locale: Locale = "fr"): Promise<DeliveryStepDTO[]> => {
  const fallback = locale === "en" ? FALLBACK_DELIVERY_STEPS_EN : FALLBACK_DELIVERY_STEPS_FR;
  try {
    const steps = await db.deliveryStep.findMany({
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale: locale } },
      },
    });

    if (!steps || steps.length === 0) return fallback;

    return steps.map((s) => ({
      id: s.id,
      iconKey: s.iconKey,
      label: s.translations[0]?.label || "",
      description: s.translations[0]?.description || "",
      order: s.order,
    }));
  } catch {
    return fallback;
  }
});
