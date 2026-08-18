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

/**
 * HeroSection — bloc d'ouverture de l'accueil.
 * Intègre un système de carte avec motif interactif et parallaxe 3D réactif au curseur.
 * Les animations d'entrée sont en CSS (transform only) pour rester visibles dès
 * le SSR et ne pas bloquer le thread principal.
 */
export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { t } = useI18n();

  return (
    <section className="relative pt-32 md:pt-44 pb-8">
      <SectionContainer>
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