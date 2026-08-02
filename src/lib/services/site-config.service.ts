import { cache } from "react";
import { db } from "@/lib/db/client";
import type { SiteConfigDTO, CompanyValueDTO, DeliveryStepDTO, ActivityLogDTO, Locale } from "@/types/content";

export const getSiteConfig = cache(async (): Promise<SiteConfigDTO> => {
  const config = await db.siteConfig.findUnique({
    where: { id: "singleton" },
  });

  return {
    siteName: config?.siteName || "Analyticatech",
    url: config?.url || "https://analyticatech.fr",
    email: config?.email || "contact@analyticatech.fr",
    phone: config?.phone || "+33 1 84 80 00 00",
    phoneHref: config?.phoneHref || "tel:+33184800000",
    streetAddress: config?.streetAddress || "12 rue de la Paix",
    city: config?.city || "Paris",
    postalCode: config?.postalCode || "75002",
    country: config?.country || "France",
    countryCode: config?.countryCode || "FR",
    socialLinkedin: config?.socialLinkedin || "https://www.linkedin.com",
    socialTwitter: config?.socialTwitter || "https://twitter.com",
    socialGithub: config?.socialGithub || "https://github.com",
    geoLat: config?.geoLat ?? 48.8688,
    geoLng: config?.geoLng ?? 2.3314,
  };
});

export const getMarqueeKeywords = cache(async (locale: Locale = "fr"): Promise<string[]> => {
  const keywords = await db.marqueeKeyword.findMany({
    where: { locale: locale as any, active: true },
    orderBy: { order: "asc" },
  });
  return keywords.map((k) => k.keyword);
});

export const getActivityLogs = cache(async (locale: Locale = "fr"): Promise<ActivityLogDTO[]> => {
  const logs = await db.activityLogEntry.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale: locale as any } },
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
      translations: { where: { locale: locale as any } },
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
      translations: { where: { locale: locale as any } },
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
