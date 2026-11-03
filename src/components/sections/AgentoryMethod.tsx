"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FlaskConical,
  Factory,
  TrendingUp,
  Check,
  ArrowRight,
  ShieldCheck,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Orbit3DMethod } from "@/components/ui/orbit-3d-method";
import { SectionErrorBoundary } from "@/components/system/SectionErrorBoundary";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

export interface MethodStep {
  number: string;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  result: string;
  deliverables: string[];
  icon: typeof Search;
  color: string;
  duration: string;
}

/* 4 phases en orbite : icônes + couleurs d'accent alignées sur la palette
   de marque Analyticatech (Orange #F26D3D, Cyan #38BDF8, Violet #A855F7, Ambre #F59E0B) */
const STEP_ICONS = [Search, FlaskConical, Factory, TrendingUp] as const;
// Charte : un seul accent (orange) pour les repères graphiques
const STEP_COLORS = ["#F26D3D", "#F26D3D", "#F26D3D", "#F26D3D"] as const;

// Intervalle de lecture confortable : 9 secondes par phase
const STEP_DURATION_MS = 9000;

interface AgentoryMethodProps {
  onNavigateContact?: () => void;
}

export function AgentoryMethod({ onNavigateContact }: AgentoryMethodProps) {
  const { t } = useI18n();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isOrbitHovered, setIsOrbitHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Détection du respect des préférences d'accessibilité (motion réduite)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setPrefersReducedMotion(mediaQuery.matches);
    const timer = window.setTimeout(updateMotion, 0);
    mediaQuery.addEventListener("change", updateMotion);
    return () => {
      window.clearTimeout(timer);
      mediaQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  const METHOD_STEPS: MethodStep[] = [1, 2, 3, 4].map((n, i) => {
    return {
      number: `0${n}`,
      phase: t(`method.step${n}.phase`),
      title: t(`method.step${n}.title`),
      subtitle: t(`method.step${n}.subtitle`),
      description: t(`method.step${n}.desc`),
      result: t(`method.step${n}.result`),
      deliverables: [
        t(`method.step${n}.deliverable1`),
        t(`method.step${n}.deliverable2`),
        t(`method.step${n}.deliverable3`),
      ],
      icon: STEP_ICONS[i],
      color: STEP_COLORS[i],
      duration: t(`method.step${n}.duration`),
    };
  });

  // Détection de visibilité dans le viewport pour économiser les ressources
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "150px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Détection du masquage de l'onglet
  useEffect(() => {
    const handleVisibility = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility, { passive: true });
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const isAutoPlaying =
    isInView &&
    !isDocumentHidden &&
    !isPausedByUser &&
    !isCardHovered &&
    !isOrbitHovered &&
    !isTouched &&
    !prefersReducedMotion;

  // Rotation automatique cadencée à 9s (suspendue au touch, hover, pause ou reduced-motion)
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(() => {
      setActiveStepIndex((prev) => (prev + 1) % 4);
    }, STEP_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, activeStepIndex]);

  const handleSelectStep = useCallback((index: number) => {
    setActiveStepIndex(index);
    setIsPausedByUser(true);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouched(true);
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null && e.changedTouches[0]) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
          // Swipe gauche -> étape suivante
          setActiveStepIndex((prev) => (prev + 1) % 4);
        } else {
          // Swipe droite -> étape précédente
          setActiveStepIndex((prev) => (prev - 1 + 4) % 4);
        }
        setIsPausedByUser(true);
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section ref={sectionRef} className="relative py-12">
      {/* En-tête de section style Agentory */}
      <div className="max-w-3xl mb-12">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent-ink font-semibold">
          {t("home.section.method")}
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mt-2 tracking-tight leading-tight">
          {t("home.section.method.title")}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-4 text-base leading-relaxed">
          {t("home.section.method.desc")}
        </p>
      </div>

      <div className="grid items-center gap-10 lg:grid-cols-12">
        {/* === Visualisation 3D native CSS/GPU avec Hub Central & Orbites (desktop) === */}
        <div
          className="lg:col-span-5"
          onMouseEnter={() => setIsOrbitHovered(true)}
          onMouseLeave={() => setIsOrbitHovered(false)}
        >
          <SectionErrorBoundary sectionName="Visualisation 3D de la Méthode">
            <Orbit3DMethod
              nodes={METHOD_STEPS.map((s) => ({
                number: s.number,
                title: s.title,
                duration: s.duration,
                icon: s.icon,
                color: "var(--accent-ink)",
              }))}
              activeIndex={activeStepIndex}
              onSelect={handleSelectStep}
              centerLabel={t("home.section.method")}
            />
          </SectionErrorBoundary>
        </div>

        {/* === Stepper mobile/tablette (l'orbite est masquée sous lg) === */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:hidden"
          role="tablist"
          aria-label={t("home.section.method")}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
          onTouchStart={() => setIsTouched(true)}
        >
          {METHOD_STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            const StepIcon = step.icon;
            return (
              <button
                key={step.number}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectStep(idx)}
                className={`relative flex flex-col p-4 rounded-2xl border text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 overflow-hidden cursor-pointer ${
                  isActive
                    ? "border-[#F26D3D] glass-strong shadow-lg shadow-[#F26D3D]/10"
                    : "glass hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                {/* Jauge de progression de l'étape active sur mobile */}
                {isActive && isAutoPlaying && (
                  <span
                    key={`mob-${activeStepIndex}-${isAutoPlaying}`}
                    className="method-progress-bar absolute bottom-0 inset-x-0 h-1"
                    style={{
                      backgroundColor: step.color,
                      animationDuration: `${STEP_DURATION_MS}ms`,
                    }}
                  />
                )}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isActive ? "text-accent-ink" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {step.number}
                  </span>
                  <StepIcon
                    className={`h-4 w-4 ${
                      isActive ? "text-accent-ink" : "text-slate-500 dark:text-slate-400"
                    }`}
                    aria-hidden
                  />
                </div>
                <span className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                  {step.title}
                </span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {step.duration}
                </span>
              </button>
            );
          })}
        </div>

        {/* === Panneau de détail — crossfade grid-stack avec émanation spatiale (hauteur stable) === */}
        <div className="lg:col-span-7">
          <div
            className="relative overflow-hidden glass-card rounded-3xl p-6 md:p-10 grid"
            style={{ perspective: 1000, transformStyle: "preserve-3d" }}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => setIsCardHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Ligne de progression temporelle de lecture (9s par phase) */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-black/5 dark:bg-white/10 overflow-hidden z-20">
              {isAutoPlaying ? (
                <div
                  key={`desk-${activeStepIndex}-${isAutoPlaying}`}
                  className="method-progress-bar h-full rounded-full"
                  style={{
                    backgroundColor: METHOD_STEPS[activeStepIndex]?.color ?? "#F26D3D",
                    boxShadow: `0 0 10px ${METHOD_STEPS[activeStepIndex]?.color ?? "#F26D3D"}`,
                    animationDuration: `${STEP_DURATION_MS}ms`,
                  }}
                />
              ) : (
                <div
                  className="h-full w-full opacity-35 transition-colors"
                  style={{
                    backgroundColor: isPausedByUser
                      ? "#F26D3D"
                      : METHOD_STEPS[activeStepIndex]?.color ?? "#F26D3D",
                  }}
                />
              )}
            </div>
            {/* Lueur d'ambiance diffuse émanant du flux de la phase active */}
            <div
              className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full opacity-25 dark:opacity-20 transition-all duration-700 blur-3xl"
              style={{
                background: `radial-gradient(circle, ${METHOD_STEPS[activeStepIndex]?.color ?? "#F26D3D"}, transparent 70%)`,
              }}
              aria-hidden
            />

            {METHOD_STEPS.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <motion.div
                  key={step.number}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: isActive ? 0 : -14,
                    scale: isActive ? 1 : 0.98,
                    rotateY: isActive ? 0 : -3,
                    z: isActive ? 0 : 15,
                  }}
                  transition={{
                    duration: 0.38,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  inert={!isActive}
                  className={cn(
                    "col-start-1 row-start-1 grid lg:grid-cols-12 gap-8 items-center",
                    !isActive && "pointer-events-none"
                  )}
                  aria-hidden={!isActive}
                >
                  {/* Colonne gauche : Description & Phase */}
                  <div className="lg:col-span-7">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <span
                        className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full inline-block border"
                        style={{
                          color: "var(--accent-ink)",
                          background: `color-mix(in srgb, ${step.color} 10%, transparent)`,
                          borderColor: `color-mix(in srgb, ${step.color} 25%, transparent)`,
                        }}
                      >
                        {step.phase}
                      </span>

                      {/* Contrôle de lecture/pause de la rotation automatique */}
                      <button
                        type="button"
                        onClick={() => setIsPausedByUser((p) => !p)}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all border cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2",
                          isPausedByUser
                            ? "border-[#F26D3D]/40 bg-[#F26D3D]/10 text-accent-ink hover:bg-[#F26D3D]/20"
                            : "border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:border-black/20 dark:hover:border-white/30"
                        )}
                        title={isPausedByUser ? t("method.auto.play") : t("method.auto.pause")}
                        aria-label={isPausedByUser ? t("method.auto.play") : t("method.auto.pause")}
                      >
                        {isPausedByUser ? (
                          <>
                            <Play className="h-2.5 w-2.5 fill-current" aria-hidden />
                            <span>{t("method.auto.paused")}</span>
                          </>
                        ) : (
                          <>
                            <span className="relative flex h-2 w-2">
                              <span
                                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                style={{ backgroundColor: step.color }}
                              />
                              <span
                                className="relative inline-flex rounded-full h-2 w-2"
                                style={{ backgroundColor: step.color }}
                              />
                            </span>
                            <Pause className="h-2.5 w-2.5" aria-hidden />
                            <span className="hidden sm:inline">{t("method.auto.label")}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h3 className="font-display text-2xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                      {step.number}. {step.title}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                      {step.subtitle}
                    </p>

                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Pill de résultat explicite (Exigence Blueprint) */}
                    <div className="p-4 rounded-2xl border border-link/30 bg-link/10 flex items-start gap-3 mb-6">
                      <ShieldCheck className="h-5 w-5 text-link shrink-0 mt-0.5" aria-hidden />
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-link font-semibold block">
                          {t("method.result")}
                        </span>
                        <span className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                          {step.result}
                        </span>
                      </div>
                    </div>

                    {onNavigateContact && (
                      <Button
                        onClick={onNavigateContact}
                        variant="primary"
                        size="md"
                        icon={<ArrowRight className="h-4 w-4" aria-hidden />}
                        iconPosition="right"
                        className="neon-glow"
                      >
                        {t("method.cta")}
                      </Button>
                    )}
                  </div>

                  {/* Colonne droite : Liste des Livrables Clés */}
                  <div className="lg:col-span-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 backdrop-blur-md">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-300 block mb-4 border-b border-black/10 dark:border-white/10 pb-2">
                      {t("method.deliverables")}
                    </span>
                    <ul className="space-y-3">
                      {step.deliverables.map((deliv, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-800 dark:text-slate-200 font-medium">
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-full shrink-0"
                            style={{
                              background: `color-mix(in srgb, ${step.color} 20%, transparent)`,
                              color: "var(--accent-ink)",
                            }}
                          >
                            <Check className="h-3 w-3" aria-hidden />
                          </span>
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span>{t("method.duration")}</span>
                      <span className="font-semibold" style={{ color: step.color }}>
                        {step.duration}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
