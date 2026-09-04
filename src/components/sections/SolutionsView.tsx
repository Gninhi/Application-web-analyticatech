"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  range: number;
  maxDrift: number;
}

/**
 * SolutionsView — catalogue interactif en dérive latérale ultra-fluide (60 FPS).
 *
 * Optimisations Scroll & Compositeur GPU :
 *  1. Mesures de géométrie (top, range, maxDrift) mises en cache via ResizeObserver
 *     -> STRICTEMENT AUCUNE lecture de layout (getBoundingClientRect, offsetHeight) pendant le scroll.
 *  2. Scroll listener passif { passive: true } throttlé par requestAnimationFrame
 *     -> Une seule lecture de window.scrollY par frame.
 *  3. Dérive horizontale appliquée en transform3d direct sur le compositeur GPU
 *     -> Zéro recalcul de reflow/layout dans la boucle d'animation.
 *  4. IntersectionObserver avec marge de 250px pour geler les cartes hors-champ
 *     -> Seules les cartes visibles ou immédiatement adjacentes calculent leurs effets.
 */
export function SolutionsView({ onNavigate, onNavigateDetail }: SolutionsViewProps) {
  const { t } = useI18n();
  const { solutions: SOLUTIONS } = useAppContent();

  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const geometryRef = useRef<SectionGeometry>({ top: 0, range: 1, maxDrift: 0 });
  const rafIdRef = useRef<number | null>(null);

  // État de visibilité par index de carte
  const [visibleMap, setVisibleMap] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  // Motion values pour les indicateurs sans re-render React
  const scrollYProgress = useMotionValue(0);
  const progressWidth = useTransform(scrollYProgress, [0.15, 0.85], ["0%", "100%"]);
  const driftActive = useTransform(
    scrollYProgress,
    [0.14, 0.16, 0.84, 0.86],
    [0.3, 1, 1, 0.3]
  );

  // Mise à jour de la dérive sur le compositeur GPU
  const updateScrollPosition = useCallback(() => {
    rafIdRef.current = null;
    const { top, range, maxDrift } = geometryRef.current;
    if (range <= 0) return;

    const currentScrollY = window.scrollY;
    const progress = Math.max(0, Math.min(1, (currentScrollY - top) / range));
    scrollYProgress.set(progress);

    // Mappage du drift sur l'intervalle [0.15, 0.85]
    let driftFraction = 0;
    if (progress <= 0.15) {
      driftFraction = 0;
    } else if (progress >= 0.85) {
      driftFraction = 1;
    } else {
      driftFraction = (progress - 0.15) / 0.7;
    }

    const currentX = driftFraction * maxDrift;
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

  // Calcul géométrique (uniquement sur resize ou changement de contenu)
  const measureGeometry = useCallback(() => {
    const pinSection = pinSectionRef.current;
    const track = trackRef.current;
    if (!pinSection || !track) return;

    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const rect = pinSection.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const pinHeight = pinSection.offsetHeight;
    const range = Math.max(1, pinHeight - vh);

    const trackWidth = track.scrollWidth;
    const startPx = vw * 0.05;
    const maxDrift = Math.max(0, trackWidth - vw + vw * 0.04 + startPx);

    geometryRef.current = { top, range, maxDrift };
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

  // IntersectionObserver pour geler l'activité des cartes hors du viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleMap((prev) => {
          let changed = false;
          const next = { ...prev };
          for (const entry of entries) {
            const idxStr = (entry.target as HTMLElement).dataset.cardIndex;
            if (idxStr !== undefined) {
              const idx = parseInt(idxStr, 10);
              if (next[idx] !== entry.isIntersecting) {
                next[idx] = entry.isIntersecting;
                changed = true;
              }
            }
          }
          return changed ? next : prev;
        });
      },
      {
        root: null,
        rootMargin: "0px 250px 0px 250px", // Pré-chauffe les cartes 250px avant l'entrée dans l'écran
        threshold: 0.01,
      }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [SOLUTIONS.length]);

  // Hauteur totale : lead-in + drift + lead-out
  const totalHeight = `${(SOLUTIONS.length + 1) * 100}vh`;

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
      <section ref={pinSectionRef} className="relative" style={{ height: totalHeight }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          {/* Indicateur de phase */}
          <PhaseIndicator progress={scrollYProgress} />

          <div
            ref={trackRef}
            style={{ willChange: "transform" }}
            className="flex gap-5 md:gap-8 pl-[6vw] md:pl-[8vw] pr-[6vw]"
          >
            {SOLUTIONS.map((sol, i) => (
              <div
                key={sol.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                data-card-index={i}
                className="shrink-0"
              >
                <SolutionCard
                  solution={sol}
                  index={i}
                  total={SOLUTIONS.length}
                  isVisible={visibleMap[i] ?? (i < 2)}
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