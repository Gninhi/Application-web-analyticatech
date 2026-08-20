"use client";

import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { MovingButton } from "@/components/interactive/MovingButton";
import { HeroSection } from "@/components/sections/HeroSection";
import { LazySection, SectionSkeleton } from "@/components/ui/LazySection";

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
  graph: { minHeight: 520, mobileMinHeight: 800 },
  bento: { minHeight: 640, mobileMinHeight: 1300 },
  solutions: { minHeight: 760, mobileMinHeight: 2100 },
  pains: { minHeight: 640, mobileMinHeight: 850 },
  method: { minHeight: 640, mobileMinHeight: 1050 },
  demo: { minHeight: 640, mobileMinHeight: 850 },
  proof: { minHeight: 720, mobileMinHeight: 1800 },
  faq: { minHeight: 640, mobileMinHeight: 850 },
} as const;

const LivingSystemGraph = dynamic(
  () => import("@/components/interactive/LivingSystemGraph").then((m) => m.LivingSystemGraph),
  { loading: () => <SectionSkeleton {...SECTION_SKELETONS.graph} /> }
);
const DataConsoleBento = dynamic(
  () => import("@/components/sections/DataConsoleBento").then((m) => m.DataConsoleBento),
  { loading: () => <SectionSkeleton {...SECTION_SKELETONS.bento} /> }
);
const HomeSolutionsGrid = dynamic(
  () => import("@/components/sections/HomeSolutionsGrid").then((m) => m.HomeSolutionsGrid),
  { loading: () => <SectionSkeleton {...SECTION_SKELETONS.solutions} /> }
);
const BusinessPainPointsSection = dynamic(
  () => import("@/components/sections/BusinessPainPointsSection").then((m) => m.BusinessPainPointsSection),
  { loading: () => <SectionSkeleton {...SECTION_SKELETONS.pains} /> }
);
const AgentoryMethod = dynamic(
  () => import("@/components/sections/AgentoryMethod").then((m) => m.AgentoryMethod),
  { loading: () => <SectionSkeleton {...SECTION_SKELETONS.method} /> }
);
const BeforeAfterDemo = dynamic(
  () => import("@/components/sections/BeforeAfterDemo").then((m) => m.BeforeAfterDemo),
  { loading: () => <SectionSkeleton {...SECTION_SKELETONS.demo} /> }
);
const HomeSocialProof = dynamic(
  () => import("@/components/sections/HomeSocialProof").then((m) => m.HomeSocialProof),
  { loading: () => <SectionSkeleton {...SECTION_SKELETONS.proof} /> }
);
const FaqSection = dynamic(
  () => import("@/components/sections/FaqSection").then((m) => m.FaqSection),
  { loading: () => <SectionSkeleton {...SECTION_SKELETONS.faq} /> }
);

interface HomeViewProps {
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

export function HomeView({ onNavigate, onNavigateDetail }: HomeViewProps) {
  const { t } = useI18n();
  const { metrics: DB_METRICS } = useAppContent();

  // Metric stats affichées dans la section 03 Preuve rapide
  const displayStats = DB_METRICS.slice(0, 4).map((m) => ({ v: m.value, l: m.label }));

  return (
    <div className="space-y-24 md:space-y-32 pb-16">
      {/* ============ 01 — HERO (H1 blueprint + image ASCII pipeline) ============ */}
      <HeroSection onNavigate={onNavigate} />

      {/* ============ 02 — SYSTÈME VIVANT ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection {...SECTION_SKELETONS.graph}>
            <LivingSystemGraph />
          </LazySection>
        </div>
      </section>

      {/* ============ 03 — PREUVE RAPIDE ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="glass-card rounded-3xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/10 dark:border-white/10">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] font-bold">
                  {t("home.section.proof")}
                </span>
                <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                  {t("home.proof.heading")}
                </h3>
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-full border border-black/5 dark:border-white/10">
                {t("home.section.proof.tagline")}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayStats.map((s) => (
                <div key={s.l} className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <p className="font-display text-3xl md:text-4xl font-bold text-[#F26D3D]">{s.v}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-2">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 03b — DATA CONSOLE BENTO ============ */}
      <LazySection {...SECTION_SKELETONS.bento}>
        <DataConsoleBento />
      </LazySection>

      {/* ============ 04 — LES SOLUTIONS ============ */}
      <LazySection {...SECTION_SKELETONS.solutions}>
        <HomeSolutionsGrid onNavigate={onNavigate} onNavigateDetail={onNavigateDetail} />
      </LazySection>

      {/* ============ 05 — PROBLÈMES MÉTIERS ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection {...SECTION_SKELETONS.pains}>
            <BusinessPainPointsSection onNavigateContact={() => onNavigate("contact")} />
          </LazySection>
        </div>
      </section>

      {/* ============ 06 — MÉTHODE (STYLE FRAMER AGENTORY) ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection {...SECTION_SKELETONS.method}>
            <AgentoryMethod onNavigateContact={() => onNavigate("contact")} />
          </LazySection>
        </div>
      </section>

      {/* ============ 07 — CAS / DÉMONSTRATION ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection {...SECTION_SKELETONS.demo}>
            <BeforeAfterDemo onNavigateContact={() => onNavigate("contact")} />
          </LazySection>
        </div>
      </section>

      {/* ============ 08 — INSIGHTS + TÉMOIGNAGES (MARQUEES INCLUS) ============ */}
      <LazySection {...SECTION_SKELETONS.proof}>
        <HomeSocialProof onNavigate={onNavigate} />
      </LazySection>

      {/* ============ 09 — FAQ (ACCORDÉON SERVICE) ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection {...SECTION_SKELETONS.faq}>
            <FaqSection />
          </LazySection>
        </div>
      </section>

      {/* ============ 10 — CTA FINAL (EXIGENCE BLUEPRINT) ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-14 text-center">
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(242,109,61,0.25), transparent 60%)",
              }}
              aria-hidden
            />
            <p className="relative font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-4 font-bold">
              {t("home.section.cta.tag")}
            </p>
            <h2 className="relative font-display text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
              {t("home.section.cta.title")}
            </h2>
            <p className="relative max-w-2xl mx-auto text-slate-700 dark:text-slate-300 mb-8 text-base leading-relaxed">
              {t("home.section.cta.desc")}
            </p>
            <MovingButton
              onClick={() => onNavigate("contact")}
              variant="primary"
              size="lg"
              className="relative neon-glow"
            >
              {t("home.section.cta.button")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </MovingButton>
          </div>
        </div>
      </section>
    </div>
  );
}