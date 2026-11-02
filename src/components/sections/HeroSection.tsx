"use client";

import React from "react";
import { MoveRight, ArrowRight } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onNavigate: (view: ViewKey) => void;
}

/**
 * HeroSection — Ouverture conforme au design system Analyticatech.
 * Promesse unique de la charte : « L'IA, expliquée simplement ».
 * Pas d'ombre, pas de dégradé, pas de halo ; un filet orange comme signal.
 */
export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { t } = useI18n();

  return (
    <section className="relative pt-32 sm:pt-40 md:pt-44 pb-12 sm:pb-16">
      <SectionContainer className="relative z-10">
        <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
          {/* Étiquette */}
          <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[11px] sm:text-[12px] text-balance font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-[#B6C2D6]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F26D3D]" aria-hidden="true" />
            {t("home.badge")}
          </p>

          {/* Promesse */}
          <h1 className="font-display text-[40px] leading-[1.08] sm:text-[56px] md:text-[64px] md:leading-[66px] font-extrabold tracking-tight text-balance text-[#011C40] dark:text-white">
            {t("home.hero.title1")}
            <span className="block mx-auto max-w-[30ch] text-balance mt-3 font-display text-2xl sm:text-3xl md:text-[36px] md:leading-[42px] font-bold text-slate-600 dark:text-[#B6C2D6] tracking-normal">
              {t("home.hero.title2")}
            </span>
          </h1>

          {/* Filet de flux : trait plein + point orange (sans dégradé) */}
          <div className="mt-8 flex items-center gap-0 w-40" aria-hidden="true">
            <span className="h-[3px] flex-1 rounded-full bg-[#03318C] dark:bg-[#8DB0FF]" />
            <span className="h-[3px] w-10 rounded-full bg-[#F26D3D]" />
            <span className="ml-1 h-2.5 w-2.5 rounded-full bg-[#F26D3D]" />
          </div>

          <p className="mt-8 max-w-2xl text-[18px] leading-[28px] text-slate-600 dark:text-[#B6C2D6]">
            {t("home.hero.desc")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Button
              onClick={() => onNavigate("contact")}
              variant="primary"
              size="lg"
              data-cta="hero_evaluer_projet"
              icon={<MoveRight className="h-4 w-4" aria-hidden="true" />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              <span>{t("home.hero.cta1")}</span>
            </Button>
            <Button
              onClick={() => onNavigate("services")}
              variant="outline"
              size="lg"
              data-cta="hero_decouvrir_solutions"
              icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              <span>{t("home.hero.cta2")}</span>
            </Button>
          </div>

          {/* Repères vérifiables (aucun chiffre non démontré) */}
          <ul className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-sm text-slate-600 dark:text-[#B6C2D6]">
            <li>{t("home.hero.fact1")}</li>
            <li aria-hidden="true" className="hidden sm:inline text-slate-300 dark:text-[#25417A]">·</li>
            <li>{t("home.hero.fact2")}</li>
            <li aria-hidden="true" className="hidden sm:inline text-slate-300 dark:text-[#25417A]">·</li>
            <li>{t("home.hero.fact3")}</li>
          </ul>
        </div>
      </SectionContainer>
    </section>
  );
}
