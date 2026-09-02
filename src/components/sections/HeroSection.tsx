"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onNavigate: (view: ViewKey) => void;
}

/**
 * HeroSection — Bloc d'ouverture cinématique avec faisceau lumineux et rotateur de mots.
 *
 * Inspiré par l'esthétique spatiale de la capture et le système d'animation Framer Motion :
 * - Faisceau lumineux courbé incandescent (#F26D3D) réactif aux thèmes clair et sombre.
 * - Rotateur typographique de mots-clés dynamiques avec animation spring fluide.
 * - 100% centré, net, SSR-compatible sans aucun CLS.
 */
export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { t, locale } = useI18n();

  // Mots-clés en rotation dynamique selon la locale
  const rotatingWords = useMemo(
    () =>
      locale === "en"
        ? ["INTELLIGENT", "AUTONOMOUS", "RESILIENT", "DATA-DRIVEN", "SOVEREIGN"]
        : ["INTELLIGENTS", "AUTONOMES", "RÉSILIENTS", "DÉCISIONNELS", "SOUVERAINS"],
    [locale]
  );

  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [rotatingWords.length]);

  return (
    <section className="relative pt-32 sm:pt-40 md:pt-48 pb-16 sm:pb-24 overflow-hidden">
      {/* ============================================================ */}
      {/* 1. HALOS AMBIANTS & GRILLE COSMIQUE DE FOND                  */}
      {/* ============================================================ */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Halo ambiant supérieur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(242,109,61,0.18),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(242,109,61,0.25),transparent_70%)] blur-3xl opacity-90" />

        {/* Halo bleu nuit / cosmique */}
        <div className="absolute top-1/4 right-0 w-[600px] h-[500px] bg-[radial-gradient(circle,rgba(2,40,89,0.25),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(2,40,89,0.6),transparent_70%)] blur-3xl" />

        {/* Grille technique de fond très discrète */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)]" />
      </div>

      {/* ============================================================ */}
      {/* 2. CONTENU PRINCIPAL CENTRÉ                                 */}
      {/* ============================================================ */}
      <SectionContainer className="relative z-10">
        <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
          {/* Badge Supérieur Interactif Liquid Glass — Arrondi standardisé */}
          <Button
            onClick={() => onNavigate("services")}
            variant="secondary"
            size="sm"
            icon={<MoveRight className="h-3.5 w-3.5 text-[#F26D3D]" aria-hidden="true" />}
            iconPosition="right"
            className="mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#F26D3D] animate-pulse mr-1" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-medium">
              {t("home.badge")}
            </span>
          </Button>

          {/* Titre H1 avec Rotateur de Mots Fluide (Framer Motion) */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.08] flex flex-col items-center">
            {/* Ligne 1 : Titre fixe */}
            <span className="block">
              {locale === "en" ? "AI Architectures &" : "DES SYSTÈMES"}
            </span>

            {/* Ligne 2 : Mot dynamique en rotation fluide */}
            <span className="relative flex w-full justify-center overflow-hidden h-[1.18em] my-1 sm:my-2">
              <span className="invisible select-none" aria-hidden="true">
                {rotatingWords[0]}
              </span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -50, filter: "blur(6px)" }}
                  transition={{
                    type: "spring",
                    stiffness: 70,
                    damping: 14,
                    mass: 0.8,
                  }}
                  className="absolute font-display font-bold text-shimmer tracking-tight"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>

            {/* Ligne 3 : Sous-titre d'ancrage */}
            <span className="block font-medium text-2xl sm:text-3xl md:text-4xl text-slate-600 dark:text-slate-300 tracking-normal mt-1">
              {t("home.hero.title2")}
            </span>
          </h1>

          {/* Trait Lumineux Courbé Repositionné Sous le Titre (Conforme Capture) */}
          <div
            className="relative mt-2 sm:mt-3.5 flex justify-center w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] mx-auto pointer-events-none"
            aria-hidden="true"
          >
            <svg
              className="w-full h-4 sm:h-5 md:h-6 overflow-visible"
              viewBox="0 0 360 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="hero-underline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F26D3D" stopOpacity="0.15" />
                  <stop offset="20%" stopColor="#F26D3D" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#FFA066" stopOpacity="1" />
                  <stop offset="80%" stopColor="#F26D3D" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#F26D3D" stopOpacity="0.15" />
                </linearGradient>
                <filter id="hero-underline-glow" x="-20%" y="-100%" width="140%" height="300%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Halo diffus flou */}
              <path
                d="M 6 5 Q 180 18 354 5"
                stroke="url(#hero-underline-grad)"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.6"
                filter="url(#hero-underline-glow)"
              />

              {/* Faisceau / Trait central net et éclatant */}
              <path
                d="M 6 5 Q 180 18 354 5"
                stroke="url(#hero-underline-grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Paragraphe Descriptif */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {t("home.hero.desc")}
          </p>

          {/* Boutons d'Action (CTAs) Liquid Glass — Arrondis standardisés de l'application */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            {/* CTA 1 : Évaluer votre projet (Primaire) */}
            <Button
              onClick={() => onNavigate("contact")}
              variant="primary"
              size="lg"
              icon={<MoveRight className="h-4 w-4" aria-hidden="true" />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              <span>{t("home.hero.cta1")}</span>
            </Button>

            {/* CTA 2 : Découvrir nos solutions (Secondaire / Outline) */}
            <Button
              onClick={() => onNavigate("solutions")}
              variant="outline"
              size="lg"
              icon={<ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-400" aria-hidden="true" />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              <span>{t("home.hero.cta2")}</span>
            </Button>
          </div>

          {/* Barre de Réassurance / Métriques de Confiance */}
          <div className="mt-12 pt-6 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#F26D3D]" aria-hidden="true" />
              {locale === "en" ? "48+ deployed missions" : "48+ missions déployées"}
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
              {locale === "en" ? "99.9% availability" : "99.9% de disponibilité"}
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span>{locale === "en" ? "SecNumCloud Hosting" : "Hébergement SecNumCloud"}</span>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}