"use client";

import { useState, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { ServiceCard, type ServiceCardData, type BentoVariant } from "@/components/services/ServiceCard";
import type { ServiceIconVariant } from "@/components/services/ServiceAnimatedIcon";

interface HomeServicesGridProps {
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

const SERVICE_CONFIGS: Record<
  string,
  { id: string; badge: string; iconVariant: ServiceIconVariant; accentColor: string; variant: BentoVariant }
> = {
  "01": { id: "ai", badge: "PRODUCTION READY", iconVariant: "orbit", accentColor: "#F26D3D", variant: "hero" },
  "02": { id: "automation", badge: "ORCHESTRATION", iconVariant: "wave", accentColor: "#38BDF8", variant: "counterpart" },
  "03": { id: "agents", badge: "AUTONOMIE & MCP", iconVariant: "spark", accentColor: "#10B981", variant: "counterpart" },
  "04": { id: "bi", badge: "DÉCISIONNEL", iconVariant: "loop", accentColor: "#A855F7", variant: "hero" },
};

/**
 * HomeServicesGrid — Section "NOS SERVICES" (The Cognitive Bento Matrix).
 * Agence les 4 piliers d'expertise dans une composition Bento Grid 12 colonnes haut de gamme
 * avec données 100% dynamiques issues de ContentProvider.
 */
export function HomeServicesGrid({ onNavigate: _onNavigate, onNavigateDetail }: HomeServicesGridProps) {
  const { t } = useI18n();
  const { services } = useAppContent();
  const [activeFocus, setActiveFocus] = useState<string | null>(null);

  // 4 Piliers d'expertise générés dynamiquement depuis les services
  const SERVICE_CARDS = useMemo<{ data: ServiceCardData; variant: BentoVariant }[]>(() => {
    return services.map((s, i) => {
      const cfg = SERVICE_CONFIGS[s.index] || {
        id: `service-${s.index}`,
        badge: "EXPERT",
        iconVariant: "orbit" as ServiceIconVariant,
        accentColor: "#F26D3D",
        variant: (i % 3 === 0 ? "hero" : "counterpart") as BentoVariant,
      };

      return {
        variant: cfg.variant,
        data: {
          id: cfg.id,
          serviceIndex: s.index,
          title: s.title,
          promise: s.description,
          tagline: s.tagline,
          badge: cfg.badge,
          iconVariant: cfg.iconVariant,
          accentColor: cfg.accentColor,
          technologies: s.technologies,
          metrics: s.metrics[0] ?? { label: "Performance", value: "99.9%" },
          secondaryMetric: s.metrics[1],
        },
      };
    });
  }, [services]);

  // Filtres d'onglets dynamiques issus des services
  const FOCUS_TABS = useMemo(() => {
    const allTab = { id: "all", label: t("home.section.services.all") || "Tous les piliers", index: "00", color: "#F26D3D" };
    const serviceTabs = services.map((s) => {
      const cfg = SERVICE_CONFIGS[s.index];
      return {
        id: cfg?.id || `service-${s.index}`,
        label: `${s.index} · ${s.title}`,
        index: s.index,
        color: cfg?.accentColor || "#F26D3D",
      };
    });
    return [allTab, ...serviceTabs];
  }, [services, t]);


  return (
    <section className="relative">
      <SectionContainer>
        <SectionHeading
          tag={t("home.section.services")}
          title={t("home.section.services.title")}
          description={t("home.section.services.desc")}
        />

        {/* Sélecteur de Focus Interactif — Style 21st.dev */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label={t("home.section.services")}>
          {FOCUS_TABS.map((tab) => {
            const isSelected = activeFocus === tab.id || (tab.id === "all" && activeFocus === null);
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveFocus(tab.id === "all" ? null : isSelected ? null : tab.id)}
                className="group relative inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2"
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
      </SectionContainer>
    </section>
  );
}
