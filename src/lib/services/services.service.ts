import { cache } from "react";
import { db } from "@/lib/db/client";
import type { ServiceDTO, Locale } from "@/types/content";
import { FALLBACK_SERVICES_FR, FALLBACK_SERVICES_EN } from "./safe";

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

export const getServices = cache(async (locale: Locale = "fr"): Promise<ServiceDTO[]> => {
  try {
    const raw = await db.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale: locale } },
        metrics: { orderBy: { order: "asc" } },
        technologies: { orderBy: { order: "asc" } },
      },
    });

    if (!raw || raw.length === 0) {
      return locale === "en" ? FALLBACK_SERVICES_EN : FALLBACK_SERVICES_FR;
    }

    return raw.map((s) => {
      const tr = s.translations[0] || { title: "", tagline: "", description: "" };
      return {
        id: s.id,
        index: s.index,
        title: tr.title,
        tagline: tr.tagline,
        description: tr.description,
        technologies: s.technologies.map((t) => t.name),
        iconKey: s.iconKey,
        bgImagePath: s.bgImagePath,
        meshOverlay: s.meshOverlay,
        metrics: s.metrics.map((m) => ({ label: m.label, value: m.value })),
        order: s.order,
        persona: {
          ceo: (typeof tr.personaCeo === "string" ? tr.personaCeo : "") || "",
          architect: (typeof tr.personaArchitect === "string" ? tr.personaArchitect : "") || "",
          operational: (typeof tr.personaOperational === "string" ? tr.personaOperational : "") || "",
        },
      };
    });
  } catch {
    return locale === "en" ? FALLBACK_SERVICES_EN : FALLBACK_SERVICES_FR;
  }
});

/**
 * Recherche un service par son index normalisé (ex: "01", "1", "02").
 */
export const getServiceByIndex = cache(
  async (rawIndex: string, locale: Locale = "fr"): Promise<ServiceDTO | null> => {
    const normalized = normalizeServiceIndex(rawIndex);
    const services = await getServices(locale);
    return services.find((s) => s.index === normalized || s.id === rawIndex) ?? null;
  }
);

