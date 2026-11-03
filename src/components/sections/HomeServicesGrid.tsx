"use client";

import { useState, useMemo } from "react";
import { m } from "framer-motion";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { FilterPill } from "@/components/interactive/FilterPill";
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
  "01": { id: "ai", badge: "ASSISTANT IA", iconVariant: "orbit", accentColor: "var(--accent-ink)", variant: "hero" },
  "02": { id: "automation", badge: "AUTOMATISATION", iconVariant: "wave", accentColor: "var(--accent-ink)", variant: "counterpart" },
  "03": { id: "agents", badge: "MULTI-AGENTS", iconVariant: "spark", accentColor: "var(--accent-ink)", variant: "counterpart" },
  "04": { id: "bi", badge: "DATA & BI", iconVariant: "loop", accentColor: "var(--accent-ink)", variant: "hero" },
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
        accentColor: "var(--accent-ink)",
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
        },
      };
    });
  }, [services]);

  // Filtres d'onglets dynamiques issus des services
  const FOCUS_TABS = useMemo(() => {
    const allTab = { id: "all", label: t("home.section.services.all") || "Tous les piliers", index: "00", color: "var(--accent-ink)" };
    const serviceTabs = services.map((s) => {
      const cfg = SERVICE_CONFIGS[s.index];
      return {
        id: cfg?.id || `service-${s.index}`,
        label: `${s.index} · ${s.title}`,
        index: s.index,
        color: cfg?.accentColor || "var(--accent-ink)",
      };
    });
    return [allTab, ...serviceTabs];
  }, [services, t]);

  // Position d'origine conservée : elle pilote l'animation d'entrée de la carte
  const visibleCards = SERVICE_CARDS.map((card, position) => ({ ...card, position })).filter(
    (card) => activeFocus === null || card.data.id === activeFocus
  );


  return (
    <section className="relative">
      <SectionContainer>
        <SectionHeading
          tag={t("home.section.services")}
          title={t("home.section.services.title")}
          description={t("home.section.services.desc")}
        />

        {/* Filtre : une pilule affiche son seul service, en pleine largeur ; « Tous » rétablit la grille */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label={t("home.section.services")}>
          {FOCUS_TABS.map((tab) => {
            const isSelected = tab.id === "all" ? activeFocus === null : activeFocus === tab.id;
            return (
              <FilterPill
                key={tab.id}
                active={isSelected}
                aria-controls="home-services-panel"
                dotColor={tab.id === "all" ? undefined : tab.color}
                onClick={() => setActiveFocus(tab.id === "all" || isSelected ? null : tab.id)}
              >
                {tab.label}
              </FilterPill>
            );
          })}
        </div>

        <div
          id="home-services-panel"
          role="tabpanel"
          aria-live="polite"
          className="mt-10 grid grid-cols-12 gap-6 items-stretch"
        >
          {visibleCards.map(({ data, variant, position }) => {
            const colSpanClass =
              activeFocus !== null
                ? "col-span-12"
                : variant === "hero"
                  ? "col-span-12 lg:col-span-7"
                  : "col-span-12 lg:col-span-5";

            return (
              <m.div
                key={`${data.id}-${activeFocus ?? "all"}`}
                initial={activeFocus === null ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`h-full ${colSpanClass}`}
              >
                <ServiceCard
                  service={data}
                  index={position}
                  variant={activeFocus !== null ? "hero" : variant}
                  actionLabel={t("home.section.services.explore")}
                  onNavigateDetail={(idx) => onNavigateDetail("service-detail", idx)}
                />
              </m.div>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
}
