"use client";

import { ArrowRight } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { MovingButton } from "@/components/interactive/MovingButton";
import { HeroParallaxPatternShowcase } from "@/components/interactive/HeroParallaxPatternShowcase";
import { SectionContainer } from "@/components/ui/SectionContainer";

interface HeroSectionProps {
  onNavigate: (view: ViewKey) => void;
}

const HERO_STATS = [
  { key: "m1", accent: "#F26D3D" },
  { key: "m2", accent: "#2B6DE0" },
  { key: "m3", accent: "#10b981" },
] as const;

/**
 * HeroSection — bloc d'ouverture de l'accueil.
 * Bento editorial : colonne texte (7) + vitrine parallaxe 3D (5), sur fond
 * d'orbes ambiantes et grille technique. Sous les CTA, un bandeau de 3 tuiles
 * de preuve (accents chromatiques) interpelle dès le premier écran.
 * Les animations d'entrée sont en CSS (transform only) pour rester visibles dès
 * le SSR et ne pas bloquer le thread principal.
 */
export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { t } = useI18n();

  return (
    <section className="relative pt-32 md:pt-44 pb-8 overflow-hidden">
      {/* Orbes ambiantes (halo orange + bleu) + grille technique de fond */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -top-40 -left-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(242,109,61,0.45) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(43,109,224,0.45) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <SectionContainer className="relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 mb-7 border border-black/10 dark:border-white/10 animate-rise-up-sm">
              <span className="h-2 w-2 rounded-full bg-[#F26D3D] animate-pulse" aria-hidden />
              <span className="text-[11px] uppercase tracking-[0.25em] text-slate-700 dark:text-slate-200 font-medium [font-family:ui-monospace,SFMono-Regular,Menlo,monospace]">
                {t("home.badge")}
              </span>
            </div>

            {/* H1 sémantique indexable exigé par le Blueprint — une phrase complète.
                Texte statique : toujours affiché en entier (pas d'effet de brouillage
                qui pouvait laisser le titre partiel ou brouillé). */}
            <h1 className="font-display font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
              <span className="block animate-rise-up anim-delay-150">
                <span className="text-slate-900 dark:text-slate-100">{t("home.hero.title1")} </span>
                <span className="text-shimmer">{t("home.hero.keyword")}</span>
              </span>
              <span className="mt-2 block text-2xl sm:text-3xl md:text-4xl font-medium text-slate-500 dark:text-slate-300 animate-rise-up anim-delay-450">
                {t("home.hero.title2")}
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-normal animate-rise-up anim-delay-500">
              {t("home.hero.desc")}
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-rise-up anim-delay-700">
              <MovingButton
                onClick={() => onNavigate("contact")}
                variant="primary"
                size="lg"
                className="group neon-glow"
              >
                {t("home.hero.cta1")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </MovingButton>
              <MovingButton
                onClick={() => onNavigate("solutions")}
                variant="ghost"
                size="lg"
              >
                {t("home.hero.cta2")}
              </MovingButton>
            </div>

            {/* Bandeau de preuve : 3 tuiles accentuées (mini-bento sous les CTA) */}
            <div className="mt-10 grid grid-cols-3 gap-3 md:gap-4 max-w-xl animate-rise-up anim-delay-900">
              {HERO_STATS.map((s) => (
                <div
                  key={s.key}
                  className="glass group relative overflow-hidden rounded-2xl p-3 md:p-4 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ borderColor: `${s.accent}33` }}
                >
                  <div
                    className="pointer-events-none absolute -top-6 -right-6 h-16 w-16 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `radial-gradient(circle, ${s.accent}26 0%, transparent 70%)` }}
                    aria-hidden
                  />
                  <p className="font-display text-xl md:text-2xl font-bold tabular-nums" style={{ color: s.accent }}>
                    {t(`home.hero.${s.key}.value`)}
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {t(`home.hero.${s.key}.label`)}
                  </p>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-40 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `linear-gradient(to right, transparent, ${s.accent}, transparent)` }} aria-hidden />
                </div>
              ))}
            </div>
          </div>

          {/* Carte avec motif interactif et système parallaxe 3D */}
          <div className="lg:col-span-5 animate-scale-in anim-delay-300">
            <HeroParallaxPatternShowcase />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}