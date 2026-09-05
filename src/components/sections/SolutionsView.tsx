"use client";

import { useEffect, useRef, useCallback } from "react";
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
 * Optimisations Scroll & Compositeur GPU :
 *  1. Hauteur virtuelle de pinSectionRef strictement synchronisée en pixels avec maxDrift :
 *     -> Zéro saut ou à-coup au dépinage (point de sortie calculé à l'identique de l'animation).
 *  2. Scroll listener passif { passive: true } throttlé par requestAnimationFrame
 *     -> Une seule lecture de window.scrollY par frame, zéro re-render React au scroll.
 *  3. Dérive horizontale appliquée en transform3d direct sur le compositeur GPU
 *     -> Zéro recalcul de reflow/layout dans la boucle d'animation.
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
    leadIn: 100,
    leadOut: 150,
    totalScrollDistance: 1,
    pinHeight: 1000,
  });
  const rafIdRef = useRef<number | null>(null);

  // Motion values pour les indicateurs sans re-render React
  const scrollYProgress = useMotionValue(0);
  const progressWidth = useTransform(scrollYProgress, [0.04, 0.94], ["0%", "100%"]);
  const driftActive = useTransform(
    scrollYProgress,
    [0.03, 0.05, 0.93, 0.95],
    [0.3, 1, 1, 0.3]
  );

  // Mise à jour de la dérive sur le compositeur GPU (Zéro re-render React)
  const updateScrollPosition = useCallback(() => {
    rafIdRef.current = null;
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
   * CONTRAINTE ARCHITECTURALE CRITIQUE (Anti-Régression Saut de Fin de Page) :
   * La hauteur de ce conteneur virtuel (pinSectionRef) DOIT IMPÉRATIVEMENT rester
   * strictement synchronisée en pixels avec l'amplitude de dérive réelle :
   *   pinHeight = vh + leadIn + maxDrift + leadOut
   * Ne JAMAIS utiliser une hauteur en vh arbitraire décorrélée de maxDrift (ex: (SOLUTIONS.length + 1) * 100vh),
   * car tout décalage entre la fin de l'animation horizontale et la hauteur du conteneur
   * génère une zone morte figée et un décrochage jerk violent au dépinage (résolu le 05/09/2026).
   */
  const measureGeometry = useCallback(() => {
    const pinSection = pinSectionRef.current;
    const track = trackRef.current;
    if (!pinSection || !track) return;

    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const rect = pinSection.getBoundingClientRect();
    const top = rect.top + window.scrollY;

    // Dérive horizontale exacte : la dernière carte arrive exactement au bord droit (marge pr-[6vw] préservée)
    const trackWidth = track.scrollWidth;
    const maxDrift = Math.max(0, trackWidth - vw);

    // Lead-in : temporisation douce (~15% vh) pour appréhender la première carte
    const leadIn = Math.round(vh * 0.15);
    // Lead-out : temporisation de confort (~20% vh) pour lire la carte finale et interagir avec le CTA
    const leadOut = Math.round(vh * 0.20);

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
            <Compass className="h-4 w-4 text-[#F26D3D]" aria-hidden />
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

      {/* === Piste horizontale pinée === */}
      <section id="solutions-pinned-showcase" ref={pinSectionRef} className="relative" style={{ minHeight: "160vh" }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          {/* Indicateur de phase */}
          <PhaseIndicator progress={scrollYProgress} />

          <div
            id="solutions-scroll-track"
            ref={trackRef}
            style={{ willChange: "transform" }}
            className="flex gap-5 md:gap-8 pl-[6vw] md:pl-[8vw] pr-[6vw]"
          >
            {SOLUTIONS.map((sol, i) => (
              <div key={sol.id} className="shrink-0">
                <SolutionCard
                  solution={sol}
                  index={i}
                  total={SOLUTIONS.length}
                  onNavigateDetail={onNavigateDetail}
                />
              </div>
            ))}

            {/* Carte finale CTA */}
            <article className="relative shrink-0 w-[82vw] sm:w-[68vw] md:w-[54vw] lg:w-[42vw] h-[78vh] rounded-[28px] border-2 border-dashed border-[#F26D3D]/50 bg-[#F26D3D]/5 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 md:p-12 overflow-hidden">
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(242,109,61,0.25), transparent 60%)",
                }}
                aria-hidden
              />
              <span className="relative h-16 w-16 rounded-2xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 flex items-center justify-center mb-5">
                <Sparkles className="h-8 w-8 text-[#F26D3D]" aria-hidden />
              </span>
              <h3 className="relative font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                {t("solutions.final.title")}
              </h3>
              <p className="relative text-slate-500 dark:text-slate-400 mb-8 max-w-md text-base leading-relaxed">
                {t("solutions.final.desc")}
              </p>
              <Button
                onClick={() => onNavigate("contact")}
                variant="primary"
                size="lg"
                icon={<ArrowRight className="h-4 w-4" aria-hidden />}
                iconPosition="right"
                className="relative neon-glow"
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
                <f.icon className="h-7 w-7 text-[#F26D3D] mb-3" aria-hidden />
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