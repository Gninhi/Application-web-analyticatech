"use client";

import { ArrowRight, Clock, MapPin, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/ui/IconBadge";
import { HeroSection } from "@/components/sections/HeroSection";
import { LazySection } from "@/components/ui/LazySection";

/* === Chargement à la demande des sections sous la ligne de flottaison ===
 * Chaque section lourde (SVG animés, boucles rAF, marquees, bordures
 * dégradées) est découpée en chunk séparé et montée uniquement lorsqu'elle
 * approche du viewport (LazySection). Résultat : le JS initial est beaucoup
 * plus petit, moins de parsing/hydration → Total Blocking Time réduit. */

/* Hauteurs réservées par section pendant le chargement (squelette) :
 * desktop (minHeight) et mobile ≤ 639px (mobileMinHeight). Un même squelette
 * sert à la fois au placeholder de LazySection et au fallback `loading` des
 * chunks dynamiques → aucune variation de hauteur entre les deux phases. */
const SECTION_SKELETONS = {
  services: { minHeight: 1100, mobileMinHeight: 2050 },
  pains: { minHeight: 640, mobileMinHeight: 850 },
  graph: { minHeight: 900, mobileMinHeight: 1700 },
  bento: { minHeight: 640, mobileMinHeight: 1300 },
  method: { minHeight: 930, mobileMinHeight: 1520 },
  demo: { minHeight: 640, mobileMinHeight: 850 },
  proof: { minHeight: 620, mobileMinHeight: 880 },
} as const;

import { HomeServicesGrid } from "@/components/sections/HomeServicesGrid";
import { BusinessPainPointsSection } from "@/components/sections/BusinessPainPointsSection";
import { AiRunTrace } from "@/components/interactive/AiRunTrace";
import { AgentoryMethod } from "@/components/sections/AgentoryMethod";
import { BeforeAfterDemo } from "@/components/sections/BeforeAfterDemo";
import { HomeSocialProof } from "@/components/sections/HomeSocialProof";
import { SectionErrorBoundary } from "@/components/system/SectionErrorBoundary";

import { getKeyStats, type KeyFact } from "@/data/stats";

/** Pictogramme de chaque engagement (section 02). */
const FACT_ICONS: Record<KeyFact["key"], LucideIcon> = {
  first_call: Clock,
  single_contact: UserRound,
  compliance: ShieldCheck,
  locations: MapPin,
};

interface HomeViewProps {
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

export function HomeView({ onNavigate, onNavigateDetail }: HomeViewProps) {
  const { t, locale } = useI18n();

  // Statistiques clés centralisées (Source unique de vérité : src/data/stats.ts)
  const displayStats = getKeyStats(locale);

  return (
    <div className="space-y-24 md:space-y-32 pb-16">
      {/* ============ 01 — HERO (H1 blueprint + image ASCII pipeline) ============ */}
      <HeroSection onNavigate={onNavigate} />

      {/* ============ 02 — ENGAGEMENTS VÉRIFIABLES ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-2xl glass-card border border-border p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-ink">
                  {t("home.section.proof")}
                </p>
                <h2 className="font-display text-[28px] leading-[34px] font-bold text-[#011C40] dark:text-white mt-2">
                  {t("home.proof.heading")}
                </h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-[#B6C2D6] md:text-right max-w-sm">
                {t("home.section.proof.tagline")}
              </p>
            </div>

            {/* Colonnes séparées par des filets : pas de sous-cartes, le verre reste continu */}
            <ul className="mt-8 grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
              {displayStats.map((s, i) => (
                <li
                  key={s.key}
                  className={`flex flex-col gap-3 sm:px-6 lg:px-7 ${
                    i % 2 === 0 ? "sm:pl-0" : "sm:border-l sm:border-border"
                  } ${i === 0 ? "lg:pl-0" : "lg:border-l lg:border-border lg:pl-7"} ${
                    i === displayStats.length - 1 ? "lg:pr-0" : ""
                  } ${i > 0 ? "border-t border-border pt-8 sm:border-t-0 sm:pt-0" : ""}`}
                >
                  <IconBadge icon={FACT_ICONS[s.key]} size="md" />
                  <p className="font-display text-[28px] leading-[34px] md:text-[36px] md:leading-[42px] font-bold tracking-tight text-[#011C40] dark:text-white">
                    {s.v}
                  </p>
                  <p className="text-sm leading-[22px] text-slate-600 dark:text-[#B6C2D6]">{s.l}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ 03 — LES SERVICES (BENTO COGNITIVE MATRIX) ============ */}
      <LazySection {...SECTION_SKELETONS.services} eager>
        <SectionErrorBoundary sectionName="Bento Services">
          <HomeServicesGrid onNavigate={onNavigate} onNavigateDetail={onNavigateDetail} />
        </SectionErrorBoundary>
      </LazySection>

      {/* ============ 04 — PROBLÈMES MÉTIERS ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection {...SECTION_SKELETONS.pains} eager>
            <SectionErrorBoundary sectionName="Problèmes Métiers">
              <BusinessPainPointsSection onNavigateContact={() => onNavigate("contact")} />
            </SectionErrorBoundary>
          </LazySection>
        </div>
      </section>

      {/* ============ 05 — DE LA DONNÉE À LA DÉCISION (trace d'une demande réelle) ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection {...SECTION_SKELETONS.graph} eager>
            <SectionErrorBoundary sectionName="De la donnée à la décision">
              <AiRunTrace />
            </SectionErrorBoundary>
          </LazySection>
        </div>
      </section>

      {/* ============ 07 — MÉTHODE (STYLE FRAMER AGENTORY) ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection {...SECTION_SKELETONS.method} eager>
            <SectionErrorBoundary sectionName="Méthode">
              <AgentoryMethod onNavigateContact={() => onNavigate("contact")} />
            </SectionErrorBoundary>
          </LazySection>
        </div>
      </section>

      {/* ============ 08 — CAS / DÉMONSTRATION AVANT-APRÈS ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection {...SECTION_SKELETONS.demo} eager>
            <SectionErrorBoundary sectionName="Démonstration Avant/Après">
              <BeforeAfterDemo onNavigateContact={() => onNavigate("contact")} />
            </SectionErrorBoundary>
          </LazySection>
        </div>
      </section>

      {/* ============ 09 — INSIGHTS (TECH TICKER INCLUS) ============ */}
      <LazySection {...SECTION_SKELETONS.proof} eager>
        <SectionErrorBoundary sectionName="Insights">
          <HomeSocialProof onNavigate={onNavigate} />
        </SectionErrorBoundary>
      </LazySection>


      {/* ============ 10 — PREMIER ÉCHANGE (bandeau Nuit) ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-2xl glass-card border border-border p-8 md:p-14 text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#F26D3D] mb-4">
              {t("home.section.cta.tag")}
            </p>
            <h2 className="font-display text-[28px] leading-[34px] md:text-[48px] md:leading-[52px] font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              {t("home.section.cta.title")}
            </h2>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-[#B6C2D6] mb-8 text-base leading-[26px]">
              {t("home.section.cta.desc")}
            </p>
            <Button
              onClick={() => onNavigate("contact")}
              variant="primary"
              size="lg"
              icon={<ArrowRight className="h-4 w-4" aria-hidden />}
              iconPosition="right"
            >
              {t("home.section.cta.button")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}