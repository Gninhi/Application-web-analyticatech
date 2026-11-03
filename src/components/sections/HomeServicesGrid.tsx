"use client";

import { useState, useMemo } from "react";
import { m } from "framer-motion";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { FilterPill, FilterSegmentGroup } from "@/components/interactive/FilterPill";
import { ServiceCard, type ServiceCardData, type BentoVariant } from "@/components/services/ServiceCard";

interface HomeServicesGridProps {
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

const SERVICE_CONFIGS: Record<string, { id: string; variant: BentoVariant }> = {
  "01": { id: "ai", variant: "hero" },
  "02": { id: "automation", variant: "counterpart" },
  "03": { id: "agents", variant: "counterpart" },
  "04": { id: "bi", variant: "hero" },
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
          iconKey: s.iconKey,
          technologies: s.technologies,
        },
      };
    });
  }, [services]);

  // Onglets du commutateur : libellés courts (le titre complet reste sur la carte)
  const FOCUS_TABS = useMemo(() => {
    const allTab = { id: "all", label: t("home.section.services.all") };
    const serviceTabs = services.map((s) => {
      const shortKey = `home.section.services.short.${s.index}`;
      const short = t(shortKey);
      return {
        id: SERVICE_CONFIGS[s.index]?.id || `service-${s.index}`,
        label: short && short !== shortKey ? short : s.title,
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

        {/* Filtre : commutateur segmenté sur une ligne ; un segment affiche son seul service, « Tous » rétablit la grille */}
        <FilterSegmentGroup label={t("home.section.services")} className="mt-8">
          {FOCUS_TABS.map((tab) => {
            const isSelected = tab.id === "all" ? activeFocus === null : activeFocus === tab.id;
            return (
              <FilterPill
                key={tab.id}
                variant="segment"
                active={isSelected}
                aria-controls="home-services-panel"
                dotColor={tab.id === "all" ? undefined : "#F26D3D"}
                onClick={() => setActiveFocus(tab.id === "all" || isSelected ? null : tab.id)}
              >
                {tab.label}
              </FilterPill>
            );
          })}
        </FilterSegmentGroup>

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
                  total={SERVICE_CARDS.length}
                  variant={activeFocus !== null ? "hero" : variant}
                  actionLabel={t("home.section.services.explore")}
                  toolsLabel={t("home.section.services.tools")}
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
