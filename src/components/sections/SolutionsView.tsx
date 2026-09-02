"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Compass, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { MovingButton } from "@/components/interactive/MovingButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SolutionCard } from "./solutions/SolutionCard";
import { PhaseIndicator } from "./solutions/PhaseIndicator";

interface SolutionsViewProps {
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

/**
 * SolutionsView — catalogue interactif en scroll horizontal.
 *
 * Structure du scroll (3 phases) :
 *  1. STAGING (0% → 15%) : la section se met en place, la piste
 *     horizontale est immobile, la 1ère carte est centrée/staged.
 *  2. DRIFT   (15% → 85%): la piste horizontale translate de gauche
 *     à droite, révélant les cartes successives.
 *  3. RELEASE (85% → 100%): la piste est immobile sur la dernière
 *     carte, puis la section libère le scroll vertical.
 */
export function SolutionsView({ onNavigate, onNavigateDetail }: SolutionsViewProps) {
  const { t } = useI18n();
  const { solutions: SOLUTIONS } = useAppContent();

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Décalage horizontal total (px) pour amener la dernière carte au bord droit.
  const [drift, setDrift] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const vw = window.innerWidth;
      const trackWidth = track.scrollWidth;
      const startPx = vw * 0.05;
      setDrift(Math.max(0, trackWidth - vw + vw * 0.04 + startPx));
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [SOLUTIONS.length]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // x mappé sur la portion centrale [0.15, 0.85] → lead-in & lead-out
  const x = useTransform(scrollYProgress, [0.15, 0.85], [0, -drift]);
  // Indicateur de progression (même plage que x)
  const progressWidth = useTransform(scrollYProgress, [0.15, 0.85], ["0%", "100%"]);
  // Opacité de la barre de progression (s'allume pendant le drift)
  const driftActive = useTransform(
    scrollYProgress,
    [0.14, 0.16, 0.84, 0.86],
    [0.3, 1, 1, 0.3]
  );

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

      {/* === Piste horizontale pin === */}
      <section className="relative" style={{ height: totalHeight }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          {/* Indicateur de phase */}
          <PhaseIndicator progress={scrollYProgress} />

          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-5 md:gap-8 pl-[6vw] md:pl-[8vw] pr-[6vw]"
          >
            {SOLUTIONS.map((sol, i) => (
              <SolutionCard
                key={sol.id}
                solution={sol}
                index={i}
                total={SOLUTIONS.length}
                onNavigateDetail={onNavigateDetail}
              />
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
              <MovingButton
                onClick={() => onNavigate("contact")}
                variant="primary"
                size="lg"
                className="relative neon-glow"
              >
                {t("solutions.final.cta")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </MovingButton>
            </article>
          </motion.div>
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