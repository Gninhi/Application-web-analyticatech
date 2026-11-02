"use client";

import { ArrowRight } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
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
  services: { minHeight: 960, mobileMinHeight: 2100 },
  pains: { minHeight: 640, mobileMinHeight: 850 },
  graph: { minHeight: 520, mobileMinHeight: 800 },
  bento: { minHeight: 640, mobileMinHeight: 1300 },
  method: { minHeight: 930, mobileMinHeight: 1520 },
  demo: { minHeight: 640, mobileMinHeight: 850 },
  proof: { minHeight: 620, mobileMinHeight: 880 },
} as const;

import { HomeServicesGrid } from "@/components/sections/HomeServicesGrid";
import { BusinessPainPointsSection } from "@/components/sections/BusinessPainPointsSection";
import { LivingSystemGraph } from "@/components/interactive/LivingSystemGraph";
import { AgentoryMethod } from "@/components/sections/AgentoryMethod";
import { BeforeAfterDemo } from "@/components/sections/BeforeAfterDemo";
import { HomeSocialProof } from "@/components/sections/HomeSocialProof";
import { SectionErrorBoundary } from "@/components/system/SectionErrorBoundary";

import { getKeyStats } from "@/data/stats";

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
          <div className="rounded-2xl border border-border bg-[#F4F6FA] dark:bg-[#022859] p-8 md:p-10">
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

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayStats.map((s) => (
                <li key={s.key} className="rounded-lg border border-border bg-background p-5">
                  <p className="font-display text-[28px] leading-[34px] font-bold text-[#011C40] dark:text-white">
                    {s.v}
                  </p>
                  <span className="mt-3 block h-[3px] w-8 rounded-full bg-[#F26D3D]" aria-hidden="true" />
                  <p className="text-sm leading-[22px] text-slate-600 dark:text-[#B6C2D6] mt-3">
                    {s.l}
                  </p>
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

      {/* ============ 05 — SYSTÈME VIVANT ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection {...SECTION_SKELETONS.graph} eager>
            <SectionErrorBoundary sectionName="Système Vivant">
              <LivingSystemGraph />
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
          <div className="rounded-2xl bg-[#011C40] border border-[#25417A] p-8 md:p-14 text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#F26D3D] mb-4">
              {t("home.section.cta.tag")}
            </p>
            <h2 className="font-display text-[28px] leading-[34px] md:text-[48px] md:leading-[52px] font-bold text-white mb-4 tracking-tight">
              {t("home.section.cta.title")}
            </h2>
            <p className="max-w-2xl mx-auto text-[#B6C2D6] mb-8 text-base leading-[26px]">
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