import { cache } from "react";
import { db } from "@/lib/db/client";
import type { SolutionDTO, Locale } from "@/types/content";
import { FALLBACK_SOLUTIONS_FR, FALLBACK_SOLUTIONS_EN } from "./safe";

const SECTOR_TRANSLATIONS_EN: Record<string, string> = {
  "Logistique": "Logistics",
  "Finance": "Finance",
  "Retail": "Retail",
  "Santé": "Healthcare",
  "Industrie": "Industry",
  "Énergie": "Energy",
  "Conseil": "Consulting",
  "Aéro": "Aerospace",
  "Cybersécurité": "Cybersecurity",
  "Public": "Public Sector",
};

const SOLUTION_METHODOLOGY_FR: Record<string, string> = {
  "logistics-ai": "Résultats observés sur les missions de déploiement logistique, 2024–2025.",
  "finance-agent": "Mesures constatées en production sur flux de transactions réelles, 2024–2025.",
  "retail-bi": "Résultats mesurés sur les déploiements retail multi-sites, 2024–2025.",
  "healthcare-nlp": "Mesures issues des bancs d'évaluation et missions pilotes hospitalières, 2024–2025.",
  "health-rag": "Mesures issues des bancs d'évaluation et missions pilotes hospitalières, 2024–2025.",
  "industry-maintenance": "Résultats mesurés sur lignes de production industrielle instrumentées, 2024–2025.",
  "industry-auto": "Résultats mesurés sur lignes de production industrielle instrumentées, 2024–2025.",
  "energy-smartgrid": "Modélisation et retours d'exploitation sur réseaux d'énergie, 2024–2025.",
  "public-data": "Modélisation et retours d'exploitation sur infrastructures publiques, 2024–2025.",
};

const SOLUTION_METHODOLOGY_EN: Record<string, string> = {
  "logistics-ai": "Observed results across client logistics deployments, 2024–2025.",
  "finance-agent": "Production metrics measured across real-time transaction streams, 2024–2025.",
  "retail-bi": "Measured results across multi-site retail rollouts, 2024–2025.",
  "healthcare-nlp": "Evaluated across clinical test benches and pilot hospital engagements, 2024–2025.",
  "health-rag": "Evaluated across clinical test benches and pilot hospital engagements, 2024–2025.",
  "industry-maintenance": "Measured on instrumented industrial manufacturing lines, 2024–2025.",
  "industry-auto": "Measured on instrumented industrial manufacturing lines, 2024–2025.",
  "energy-smartgrid": "Simulation and operational feedback across energy grid operations, 2024–2025.",
  "public-data": "Simulation and operational feedback across public infrastructure, 2024–2025.",
};

export const getSolutions = cache(async (locale: Locale = "fr"): Promise<SolutionDTO[]> => {
  try {
    const raw = await db.solution.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale: locale } },
        tags: true,
      },
    });

    if (!raw || raw.length === 0) {
      return locale === "en" ? FALLBACK_SOLUTIONS_EN : FALLBACK_SOLUTIONS_FR;
    }

    return raw.map((sol) => {
      const tr = sol.translations[0] || { title: "", summary: "" };
      const sector =
        locale === "en"
          ? SECTOR_TRANSLATIONS_EN[sol.sector] || sol.sector
          : sol.sector;
      const methodology =
        locale === "en"
          ? SOLUTION_METHODOLOGY_EN[sol.slug]
          : SOLUTION_METHODOLOGY_FR[sol.slug];

      return {
        id: sol.id,
        slug: sol.slug,
        sector,
        title: tr.title || sol.slug,
        summary: tr.summary,
        impact: sol.impact,
        methodology,
        tags: sol.tags.map((t) => t.tag),
        order: sol.order,
      };
    });
  } catch {
    return locale === "en" ? FALLBACK_SOLUTIONS_EN : FALLBACK_SOLUTIONS_FR;
  }
});

