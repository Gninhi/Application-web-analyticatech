"use client";

import { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { MovingButton } from "@/components/interactive/MovingButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { ServiceCard, type ServiceCardData, type BentoVariant } from "@/components/services/ServiceCard";

interface HomeServicesGridProps {
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

/**
 * HomeServicesGrid — Section "NOS SERVICES" (The Cognitive Bento Matrix).
 * Agence les 4 piliers d'expertise dans une composition Bento Grid 12 colonnes haut de gamme
 * avec sélecteur de focus interactif inspiré des meilleurs standards 21st.dev / Framer.
 */
export function HomeServicesGrid({ onNavigate, onNavigateDetail }: HomeServicesGridProps) {
  const { t } = useI18n();
  const [activeFocus, setActiveFocus] = useState<string | null>(null);

  // 4 Piliers d'expertise agencés en Bento Matrix 2x2 (7/5 + 5/7)
  const SERVICE_CARDS: { data: ServiceCardData; variant: BentoVariant }[] = [
    {
      variant: "hero",
      data: {
        id: "ai",
        serviceIndex: "01",
        title: t("home.solution.ai.title"),
        promise: t("home.solution.ai.promise"),
        tagline: t("home.solution.ai.tagline"),
        badge: "PRODUCTION READY",
        iconVariant: "orbit",
        accentColor: "#F26D3D",
        technologies: ["LangChain", "LangGraph", "OpenAI", "Pinecone", "vLLM"],
        metrics: { label: t("home.solution.ai.metric"), value: "320 ms" },
        secondaryMetric: { label: "Précision RAG", value: "94.2 %" },
      },
    },
    {
      variant: "counterpart",
      data: {
        id: "automation",
        serviceIndex: "02",
        title: t("home.solution.automation.title"),
        promise: t("home.solution.automation.promise"),
        tagline: t("home.solution.automation.tagline"),
        badge: "ORCHESTRATION",
        iconVariant: "wave",
        accentColor: "#F26D3D",
        technologies: ["n8n", "Zapier", "Temporal", "Airflow", "Python"],
        metrics: { label: t("home.solution.automation.metric"), value: "-75 %" },
        secondaryMetric: { label: "Heures sauvées", value: "8 500 h" },
      },
    },
    {
      variant: "counterpart",
      data: {
        id: "agents",
        serviceIndex: "03",
        title: t("home.solution.agents.title"),
        promise: t("home.solution.agents.promise"),
        tagline: t("home.solution.agents.tagline"),
        badge: "AUTONOMIE & MCP",
        iconVariant: "spark",
        accentColor: "#38BDF8",
        technologies: ["LangGraph", "CrewAI", "AutoGen", "MCP", "Redis", "Qdrant"],
        metrics: { label: t("home.solution.agents.metric"), value: "87 %" },
        secondaryMetric: { label: "Agents actifs", value: "312" },
      },
    },
    {
      variant: "hero",
      data: {
        id: "bi",
        serviceIndex: "04",
        title: t("home.solution.bi.title"),
        promise: t("home.solution.bi.promise"),
        tagline: t("home.solution.bi.tagline"),
        badge: "DÉCISIONNEL",
        iconVariant: "loop",
        accentColor: "#A855F7",
        technologies: ["Power BI", "dbt", "Snowflake", "BigQuery", "Looker"],
        metrics: { label: t("home.solution.bi.metric"), value: "640+" },
        secondaryMetric: { label: "Sources data", value: "120+" },
      },
    },
  ];

  // Filtres d'onglets rapides — 4 piliers
  const FOCUS_TABS = [
    { id: "all", label: "Tous les piliers", index: "00", color: "#F26D3D" },
    { id: "ai", label: "01 · Raisonnement & RAG", index: "01", color: "#F26D3D" },
    { id: "automation", label: "02 · Automatisation & Workflows", index: "02", color: "#F26D3D" },
    { id: "agents", label: "03 · Orchestration Multi-Agents", index: "03", color: "#38BDF8" },
    { id: "bi", label: "04 · Data & Décision Augmentée", index: "04", color: "#A855F7" },
  ];

  return (
    <section className="relative">
      <SectionContainer>
        <SectionHeading
          tag={t("home.section.services")}
          title={t("home.section.services.title")}
          description={t("home.section.services.desc")}
        />

        {/* Sélecteur de Focus Interactif — Style 21st.dev */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {FOCUS_TABS.map((tab) => {
            const isSelected = activeFocus === tab.id || (tab.id === "all" && activeFocus === null);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFocus(tab.id === "all" ? null : isSelected ? null : tab.id)}
                className="group relative inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer backdrop-blur-md"
                style={{
                  borderColor: isSelected
                    ? `color-mix(in srgb, ${tab.color} 60%, transparent)`
                    : "var(--glass-card-border)",
                  background: isSelected
                    ? `color-mix(in srgb, ${tab.color} 16%, transparent)`
                    : "var(--glass-card-bg)",
                  color: isSelected ? tab.color : "var(--muted-foreground)",
                  boxShadow: isSelected
                    ? `0 0 16px color-mix(in srgb, ${tab.color} 20%, transparent)`
                    : "none",
                }}
              >
                {tab.id === "all" ? (
                  <Sparkles className="h-3 w-3" aria-hidden />
                ) : (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: tab.color }}
                    aria-hidden
                  />
                )}
                <span className="font-bold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grille Bento 12 colonnes avec réactivité au focus et hauteurs unifiées */}
        <div className="mt-10 grid grid-cols-12 gap-6 items-stretch">
          {SERVICE_CARDS.map(({ data, variant }, i) => {
            const isDimmed = activeFocus !== null && activeFocus !== data.id;
            const isHighlighted = activeFocus === data.id;
            const colSpanClass =
              variant === "hero"
                ? "col-span-12 lg:col-span-7"
                : "col-span-12 lg:col-span-5";

            return (
              <div
                key={data.id}
                className={`h-full transition-all duration-500 ${isDimmed ? "opacity-35 scale-[0.98] blur-[0.5px]" : "opacity-100 scale-100"} ${isHighlighted ? "ring-2 ring-[#F26D3D] rounded-[28px] shadow-2xl" : ""} ${colSpanClass}`}
              >
                <ServiceCard
                  service={data}
                  index={i}
                  variant={variant}
                  actionLabel={t("home.section.services.explore")}
                  onNavigateDetail={(idx) => onNavigateDetail("service-detail", idx)}
                />
              </div>
            );
          })}
        </div>

        {/* CTA global vers le catalogue des services */}
        <div className="mt-14 text-center">
          <MovingButton
            onClick={() => onNavigate("services")}
            variant="outline"
            size="md"
            className="group"
          >
            {t("nav.services")} — {t("services.title1")} {t("services.title2")}
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </MovingButton>
        </div>
      </SectionContainer>
    </section>
  );
}
