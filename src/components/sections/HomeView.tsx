"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { MovingButton } from "@/components/interactive/MovingButton";
import { HeroSection } from "@/components/sections/HeroSection";
import { LazySection } from "@/components/ui/LazySection";

/* === Chargement à la demande des sections sous la ligne de flottaison ===
 * Chaque section lourde (SVG animés, boucles rAF, marquees, bordures
 * dégradées) est découpée en chunk séparé et montée uniquement lorsqu'elle
 * approche du viewport (LazySection). Résultat : le JS initial est beaucoup
 * plus petit, moins de parsing/hydration → Total Blocking Time réduit.
 *
 * Les chunks sont préchargés (fetch + parse) dès le montage de la page : au
 * scroll, le module est déjà en cache, la section se monte donc instantanément
 * — plus de skeleton visible ni de saut de mise en page lors d'un scroll rapide.
 */

const loadLivingSystemGraph = () =>
  import("@/components/interactive/LivingSystemGraph").then((m) => m.LivingSystemGraph);
const loadDataConsoleBento = () =>
  import("@/components/sections/DataConsoleBento").then((m) => m.DataConsoleBento);
const loadHomeSolutionsGrid = () =>
  import("@/components/sections/HomeSolutionsGrid").then((m) => m.HomeSolutionsGrid);
const loadBusinessPainPointsSection = () =>
  import("@/components/sections/BusinessPainPointsSection").then((m) => m.BusinessPainPointsSection);
const loadAgentoryMethod = () =>
  import("@/components/sections/AgentoryMethod").then((m) => m.AgentoryMethod);
const loadBeforeAfterDemo = () =>
  import("@/components/sections/BeforeAfterDemo").then((m) => m.BeforeAfterDemo);
const loadHomeSocialProof = () =>
  import("@/components/sections/HomeSocialProof").then((m) => m.HomeSocialProof);
const loadFaqSection = () =>
  import("@/components/sections/FaqSection").then((m) => m.FaqSection);

const LivingSystemGraph = dynamic(loadLivingSystemGraph, {
  loading: () => <SectionSkeleton minHeight={520} />,
});
const DataConsoleBento = dynamic(loadDataConsoleBento, {
  loading: () => <SectionSkeleton minHeight={640} />,
});
const HomeSolutionsGrid = dynamic(loadHomeSolutionsGrid, {
  loading: () => <SectionSkeleton minHeight={760} />,
});
const BusinessPainPointsSection = dynamic(loadBusinessPainPointsSection, {
  loading: () => <SectionSkeleton minHeight={640} />,
});
const AgentoryMethod = dynamic(loadAgentoryMethod, {
  loading: () => <SectionSkeleton minHeight={640} />,
});
const BeforeAfterDemo = dynamic(loadBeforeAfterDemo, {
  loading: () => <SectionSkeleton minHeight={640} />,
});
const HomeSocialProof = dynamic(loadHomeSocialProof, {
  loading: () => <SectionSkeleton minHeight={720} />,
});
const FaqSection = dynamic(loadFaqSection, {
  loading: () => <SectionSkeleton minHeight={640} />,
});

/** Squelette léger affiché pendant le chargement d'une section à la demande. */
function SectionSkeleton({ minHeight = 420 }: { minHeight?: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-3xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5"
      style={{ minHeight }}
      aria-hidden
    />
  );
}

interface HomeViewProps {
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

export function HomeView({ onNavigate, onNavigateDetail }: HomeViewProps) {
  const { t } = useI18n();
  const { metrics: DB_METRICS } = useAppContent();

  // Précharge les chunks des sections lazy dès le montage (fetch + parse) :
  // au scroll, le module est en cache → montage instantané, pas de skeleton.
  useEffect(() => {
    const preloads = [
      loadLivingSystemGraph(),
      loadDataConsoleBento(),
      loadHomeSolutionsGrid(),
      loadBusinessPainPointsSection(),
      loadAgentoryMethod(),
      loadBeforeAfterDemo(),
      loadHomeSocialProof(),
      loadFaqSection(),
    ];
    preloads.forEach((p) => p.catch(() => {}));
  }, []);

  // Metric stats affichées dans la section 03 Preuve rapide
  const displayStats = DB_METRICS.slice(0, 4).map((m) => ({ v: m.value, l: m.label }));

  return (
    <div className="space-y-24 md:space-y-32 pb-16">
      {/* ============ 01 — HERO (H1 blueprint + image ASCII pipeline) ============ */}
      <HeroSection onNavigate={onNavigate} />

      {/* ============ 02 — SYSTÈME VIVANT ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection minHeight={520}>
            <LivingSystemGraph />
          </LazySection>
        </div>
      </section>

      {/* ============ 03 — PREUVE RAPIDE (BENTO 12 COL) ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-10">
            {/* Halo ambiant */}
            <div
              className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full opacity-20 blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(242,109,61,0.45) 0%, transparent 70%)" }}
              aria-hidden
            />

            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10 dark:border-white/10">
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

            {/* Bento : tuile hero (5-col × 2 rows) à gauche + 2 tuiles droites
                + bandeau bas pleine largeur */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-12 lg:auto-rows-fr gap-4">
              {displayStats.map((s, i) => {
                const accent = ["#F26D3D", "#2B6DE0", "#8b5cf6", "#10b981"][i % 4];
                const isHero = i === 0;
                const isFull = i === 3;
                const span = isHero
                  ? "md:col-span-5 md:row-span-2 p-6 md:p-8"
                  : isFull
                    ? "md:col-span-12 p-5 md:p-6 md:flex md:items-center md:justify-between md:gap-6"
                    : "md:col-span-7 p-5";
                return (
                  <div
                    key={s.l}
                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${span}`}
                    style={{
                      backgroundColor: isHero ? "rgba(242,109,61,0.06)" : "rgba(255,255,255,0.5)",
                      borderColor: `${accent}22`,
                    }}
                  >
                    <div
                      className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `radial-gradient(circle, ${accent}1f 0%, transparent 70%)` }}
                      aria-hidden
                    />
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>
                        /{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="pointer-events-none h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent, opacity: 0.7 }} aria-hidden />
                    </div>
                    <p
                      className={`font-display font-bold text-[#F26D3D] tabular-nums transition-colors ${
                        isHero ? "mt-6 text-5xl md:text-6xl" : isFull ? "mt-3 text-3xl md:mt-0 md:text-4xl" : "mt-4 text-2xl md:text-3xl"
                      }`}
                    >
                      {s.v}
                    </p>
                    <p className={`font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 ${isHero ? "mt-3 max-w-[220px] leading-relaxed" : isFull ? "md:mt-0 md:text-right" : "mt-2"}`}>
                      {s.l}
                    </p>
                    <span
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-40 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
                      aria-hidden
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 03b — DATA CONSOLE BENTO ============ */}
      <LazySection minHeight={640}>
        <DataConsoleBento />
      </LazySection>

      {/* ============ 04 — LES SOLUTIONS ============ */}
      <LazySection minHeight={760}>
        <HomeSolutionsGrid onNavigate={onNavigate} onNavigateDetail={onNavigateDetail} />
      </LazySection>

      {/* ============ 05 — PROBLÈMES MÉTIERS ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection minHeight={640}>
            <BusinessPainPointsSection onNavigateContact={() => onNavigate("contact")} />
          </LazySection>
        </div>
      </section>

      {/* ============ 06 — MÉTHODE (STYLE FRAMER AGENTORY) ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection minHeight={640}>
            <AgentoryMethod onNavigateContact={() => onNavigate("contact")} />
          </LazySection>
        </div>
      </section>

      {/* ============ 07 — CAS / DÉMONSTRATION ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection minHeight={640}>
            <BeforeAfterDemo onNavigateContact={() => onNavigate("contact")} />
          </LazySection>
        </div>
      </section>

      {/* ============ 08 — INSIGHTS + TÉMOIGNAGES (MARQUEES INCLUS) ============ */}
      <LazySection minHeight={720}>
        <HomeSocialProof onNavigate={onNavigate} />
      </LazySection>

      {/* ============ 09 — FAQ (ACCORDÉON SERVICE) ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <LazySection minHeight={640}>
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
            {/* Grille technique de fond (écho au hero) */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full opacity-20 blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(43,109,224,0.45) 0%, transparent 70%)" }}
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