"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Compass, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SolutionCard } from "./solutions/SolutionCard";
import { PhaseIndicator } from "./solutions/PhaseIndicator";

interface SolutionsViewProps {
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

interface SectionGeometry {
  top: number;
  maxDrift: number;
  leadIn: number;
  leadOut: number;
  totalScrollDistance: number;
  pinHeight: number;
}

/**
 * SolutionsView — catalogue interactif en dérive latérale ultra-fluide (60 FPS).
 *
 * Optimisations Responsive & Compositeur GPU :
 *  1. Desktop (>= 1024px) : Pinned scroll-driven rail avec synchronisation stricte en pixels
 *     (lead-in et lead-out < 80px pour libération immédiate sans zone morte).
 *  2. Mobile & Tablette (< 1024px) : Désactivation complète du pin vertical et
 *     remplacement par un carousel horizontal natif CSS scroll-snap avec indicateur X/7.
 */
export function SolutionsView({ onNavigate, onNavigateDetail }: SolutionsViewProps) {
  const { t } = useI18n();
  const { solutions: SOLUTIONS } = useAppContent();

  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const geometryRef = useRef<SectionGeometry>({
    top: 0,
    maxDrift: 0,
    leadIn: 80,
    leadOut: 60,
    totalScrollDistance: 1,
    pinHeight: 1000,
  });
  const rafIdRef = useRef<number | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  // Motion values pour les indicateurs sans re-render React
  const scrollYProgress = useMotionValue(0);
  const progressWidth = useTransform(scrollYProgress, [0.04, 0.94], ["0%", "100%"]);
  const driftActive = useTransform(
    scrollYProgress,
    [0.03, 0.05, 0.93, 0.95],
    [0.3, 1, 1, 0.3]
  );

  // Scroll horizontal tactile sur mobile (< 1024px)
  const handleMobileScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || window.innerWidth >= 1024) return;
    const scrollLeft = track.scrollLeft;
    const firstChild = track.firstElementChild as HTMLElement | null;
    const itemWidth = firstChild ? firstChild.offsetWidth + 16 : 320;
    const index = Math.round(scrollLeft / itemWidth);
    const totalItems = SOLUTIONS.length + 1;
    const clampedIndex = Math.max(0, Math.min(totalItems - 1, index));
    setMobileActiveIndex(clampedIndex);

    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll > 0) {
      scrollYProgress.set(Math.max(0, Math.min(1, scrollLeft / maxScroll)));
    }
  }, [SOLUTIONS.length, scrollYProgress]);

  // Mise à jour de la dérive sur le compositeur GPU (Desktop uniquement, Zéro re-render React)
  const updateScrollPosition = useCallback(() => {
    rafIdRef.current = null;
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;

    const { top, maxDrift, leadIn, totalScrollDistance } = geometryRef.current;
    if (totalScrollDistance <= 0) return;

    const currentScrollY = window.scrollY;
    const scrollOffset = currentScrollY - top;

    // Progression normalisée [0, 1] sur l'ensemble de la séquence pinnée
    const normProgress = Math.max(0, Math.min(1, scrollOffset / totalScrollDistance));
    scrollYProgress.set(normProgress);

    // Calcul de la dérive horizontale physique 1:1 sans discontinuité
    let currentX = 0;
    if (scrollOffset <= leadIn) {
      // Phase Découverte (lead-in) : la piste reste au point de départ
      currentX = 0;
    } else if (scrollOffset >= leadIn + maxDrift) {
      // Phase Libération (lead-out) : la piste est à son terme
      currentX = maxDrift;
    } else {
      // Phase Dérive : défilement physique 1:1 parfait (1px de scroll vertical = 1px de translation horizontale)
      currentX = scrollOffset - leadIn;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${currentX}px, 0, 0)`;
    }
  }, [scrollYProgress]);

  // Handler de scroll passif synchronisé avec le refresh rate de l'écran
  const onScroll = useCallback(() => {
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(updateScrollPosition);
    }
  }, [updateScrollPosition]);

  /**
   * Calcul géométrique dynamique :
   *  - Desktop (>= 1024px) : pinHeight dynamique basé sur scrollWidth réel.
   *    leadIn / leadOut minimisés (< 80px) pour libération immédiate sans zone morte.
   *  - Mobile (< 1024px) : réinitialisation en flux naturel auto sans blocage vertical.
   */
  const measureGeometry = useCallback(() => {
    const pinSection = pinSectionRef.current;
    const track = trackRef.current;
    if (!pinSection || !track) return;

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    if (!isDesktop) {
      pinSection.style.height = "auto";
      track.style.transform = "none";
      return;
    }

    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const rect = pinSection.getBoundingClientRect();
    const top = rect.top + window.scrollY;

    // Dérive horizontale exacte : la dernière carte arrive exactement au bord droit (marge pr-[6vw] préservée)
    const trackWidth = track.scrollWidth;
    const maxDrift = Math.max(0, trackWidth - vw);

    // Lead-in : temporisation douce (< 80px)
    const leadIn = Math.min(80, Math.round(vh * 0.10));
    // Lead-out : temporisation de confort (< 80px pour libérer immédiatement le scroll sans zone morte)
    const leadOut = Math.min(60, Math.round(vh * 0.06));

    const totalScrollDistance = leadIn + maxDrift + leadOut;
    const pinHeight = vh + totalScrollDistance;

    // Synchronisation directe sur le conteneur DOM pour éliminer toute divergence vh/px
    pinSection.style.height = `${pinHeight}px`;

    geometryRef.current = {
      top,
      maxDrift,
      leadIn,
      leadOut,
      totalScrollDistance,
      pinHeight,
    };
    updateScrollPosition();
  }, [updateScrollPosition]);

  useEffect(() => {
    measureGeometry();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureGeometry, { passive: true });
    window.addEventListener("orientationchange", measureGeometry, { passive: true });

    const mql = window.matchMedia("(min-width: 1024px)");
    const onMediaChange = () => measureGeometry();
    mql.addEventListener("change", onMediaChange);

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        measureGeometry();
      });
    }

    const ro = new ResizeObserver(() => {
      measureGeometry();
    });

    if (trackRef.current) ro.observe(trackRef.current);
    if (pinSectionRef.current) ro.observe(pinSectionRef.current);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureGeometry);
      window.removeEventListener("orientationchange", measureGeometry);
      mql.removeEventListener("change", onMediaChange);
      ro.disconnect();
    };
  }, [measureGeometry, onScroll]);

  return (
    <div ref={containerRef} className="relative">
      {/* === En-tête === */}
      <section className="pt-32 md:pt-40 pb-10">
        <SectionContainer>
          <PageHeader
            kicker={t("solutions.kicker")}
            title={t("solutions.title1")}
            accent={t("solutions.title2")}
            description={t("solutions.desc")}
            className="max-w-3xl"
          />

          {/* Barre de progression horizontale */}
          <motion.div
            style={{ opacity: driftActive }}
            className="mt-10 flex items-center gap-3"
          >
            <Compass className="h-4 w-4 text-accent-ink" aria-hidden />
            <div className="relative h-px flex-1 bg-black/10 dark:bg-white/10 overflow-hidden">
              <motion.div
                style={{ width: progressWidth }}
                className="absolute inset-y-0 left-0 bg-[#F26D3D]"
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("solutions.drift.label")}
            </span>
          </motion.div>
        </SectionContainer>
      </section>

      {/* === Piste des solutions (pin horizontal sur desktop, carousel scroll-snap sur mobile) === */}
      <section id="solutions-pinned-showcase" ref={pinSectionRef} className="relative min-h-auto lg:min-h-[100svh]">
        <div className="relative lg:sticky lg:top-0 lg:h-[100svh] flex flex-col justify-center overflow-visible lg:overflow-hidden">
          {/* Indicateur de phase desktop */}
          <PhaseIndicator progress={scrollYProgress} />

          {/* Indicateur de pagination mobile (< 1024px) */}
          <div className="flex lg:hidden items-center justify-between px-4 sm:px-6 mb-3" aria-label="Progression catalogue">
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="font-semibold text-accent-ink">
                {String(mobileActiveIndex + 1).padStart(2, "0")}
              </span>
              <span className="text-slate-400 dark:text-slate-600">/</span>
              <span className="text-slate-500 dark:text-slate-400">
                {String(SOLUTIONS.length + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center gap-1.5" aria-hidden>
              {Array.from({ length: SOLUTIONS.length + 1 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === mobileActiveIndex
                      ? "w-6 bg-[#F26D3D]"
                      : "w-1.5 bg-slate-300 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Défiler <ArrowRight className="h-3 w-3" aria-hidden />
            </span>
          </div>

          <div
            id="solutions-scroll-track"
            ref={trackRef}
            onScroll={handleMobileScroll}
            data-lenis-prevent="true"
            style={{ willChange: "transform" }}
            className="flex gap-4 lg:gap-8 overflow-x-auto snap-x snap-mandatory overscroll-x-contain py-4 lg:py-0 px-4 sm:px-6 lg:pl-[8vw] lg:pr-[6vw] lg:overflow-visible lg:snap-none lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {SOLUTIONS.map((sol, i) => (
              <div key={sol.id} className="shrink-0 snap-center h-[550px] sm:h-[570px] lg:h-[78svh] flex flex-col">
                <SolutionCard
                  solution={sol}
                  index={i}
                  total={SOLUTIONS.length}
                  onNavigateDetail={onNavigateDetail}
                />
              </div>
            ))}

            {/* Carte finale CTA */}
            <article className="relative shrink-0 snap-center w-[84vw] max-w-[340px] sm:w-[380px] sm:max-w-[380px] lg:w-[42vw] lg:max-w-[560px] h-[550px] sm:h-[570px] lg:h-[78svh] rounded-[28px] border-2 border-dashed border-[#F26D3D]/50 bg-[#F26D3D]/5 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 sm:p-8 lg:p-12 overflow-hidden">
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(242,109,61,0.25), transparent 60%)",
                }}
                aria-hidden
              />
              <span className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 flex items-center justify-center mb-4 sm:mb-5">
                <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-accent-ink" aria-hidden />
              </span>
              <h3 className="relative font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2 sm:mb-3">
                {t("solutions.final.title")}
              </h3>
              <p className="relative text-slate-500 dark:text-slate-400 mb-6 sm:mb-8 max-w-md text-sm sm:text-base leading-relaxed">
                {t("solutions.final.desc")}
              </p>
              <Button
                onClick={() => onNavigate("contact")}
                variant="primary"
                size="lg"
                icon={<ArrowRight className="h-4 w-4" aria-hidden />}
                iconPosition="right"
                className="relative neon-glow min-h-[44px]"
              >
                {t("solutions.final.cta")}
              </Button>
            </article>
          </div>
        </div>
      </section>

      {/* === Bandeau confiance === */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: ShieldCheck, t: t("solutions.confiance.sovereignty"), d: t("solutions.confiance.sovereignty.desc") },
              { icon: Zap, t: t("solutions.confiance.time"), d: t("solutions.confiance.time.desc") },
              { icon: Compass, t: t("solutions.confiance.long"), d: t("solutions.confiance.long.desc") },
            ].map((f) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="glass-card relative overflow-hidden rounded-2xl p-6 transition-colors duration-300 hover:border-accent/40"
              >
                <div
                  className="pointer-events-none absolute inset-x-3 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(242,109,61,0.8), transparent)",
                  }}
                  aria-hidden
                />
                <f.icon className="h-7 w-7 text-accent-ink mb-3" aria-hidden />
                <h4 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 mb-1.5">
                  {f.t}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}