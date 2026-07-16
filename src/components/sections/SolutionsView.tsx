"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, Compass, Zap, ShieldCheck } from "lucide-react";
import { SOLUTIONS, type ViewKey } from "@/lib/data";
import { PixelRevealTitle } from "@/components/PixelRevealTitle";
import { SnakeButton } from "@/components/SnakeButton";

interface SolutionsViewProps {
  onNavigate: (view: ViewKey) => void;
}

/**
 * SolutionsView — catalogue interactif en scroll horizontal.
 *
 * Structure du scroll (3 phases restaurée) :
 *  1. STAGING (0% → 15%) : la section se met en place, la piste
 *     horizontale est immobile, la 1ère carte est centrée/staged.
 *  2. DRIFT   (15% → 85%): la piste horizontale translate de gauche
 *     à droite, révélant les cartes successives.
 *  3. RELEASE (85% → 100%): la piste est immobile sur la dernière
 *     carte, puis la section libère le scroll vertical.
 *
 * La hauteur totale = (nb cartes + 1) * 100vh donne assez d'amplitude
 * pour ces 3 phases sans précipitation.
 */
export function SolutionsView({ onNavigate }: SolutionsViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // x mappé sur la portion centrale [0.15, 0.85] → lead-in & lead-out
  // La piste part légèrement à droite pour "center" la 1ère carte au démarrage.
  const x = useTransform(scrollYProgress, [0.15, 0.85], ["8%", "-78%"]);
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
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-3">
              {"// Solutions — Dérive Latérale"}
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[#F26D3D] tracking-tight mb-4">
              <PixelRevealTitle
                text="Des solutions sectorielles,"
                as="span"
                className="block"
                delay={0.1}
              />
              <PixelRevealTitle
                text="en orbite"
                as="span"
                className="block text-neon"
                delay={0.45}
              />
            </h1>
            <p className="text-slate-400 dark:text-slate-300 leading-relaxed text-lg">
              Défilez verticalement : les cas d&apos;usage défilent horizontalement
              comme une séquence orbitale. Chaque solution est prête à être
              adaptée à votre contexte.
            </p>
          </motion.div>

          {/* Barre de progression horizontale (style cula) */}
          <motion.div
            style={{ opacity: driftActive }}
            className="mt-10 flex items-center gap-3"
          >
            <Compass className="h-4 w-4 text-[#F26D3D]" aria-hidden />
            <div className="relative h-px flex-1 bg-white/10 overflow-hidden">
              <motion.div
                style={{ width: progressWidth }}
                className="absolute inset-y-0 left-0 bg-[#F26D3D]"
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Séquence de Dérive
            </span>
          </motion.div>
        </div>
      </section>

      {/* === Piste horizontale pin === */}
      <section className="relative" style={{ height: totalHeight }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          {/* Indicateur de phase (subtil, en haut) */}
          <PhaseIndicator progress={scrollYProgress} />

          <motion.div
            style={{ x }}
            className="flex gap-6 md:gap-10 pl-[8vw] md:pl-[12vw] pr-10"
          >
            {SOLUTIONS.map((sol, i) => (
              <article
                key={sol.id}
                className="relative shrink-0 w-[78vw] sm:w-[64vw] md:w-[52vw] lg:w-[40vw] h-[68vh] glass-card rounded-3xl overflow-hidden flex flex-col"
                style={{ border: "1px solid rgba(255,255,255,0.18)" }}
              >
                {/* Visuel de fond avec dégradé sectoriel */}
                <div
                  className="relative h-40 md:h-48 overflow-hidden"
                  style={{
                    background:
                      i % 3 === 0
                        ? "linear-gradient(135deg, #022859 0%, #F26D3D33 100%)"
                        : i % 3 === 1
                        ? "linear-gradient(135deg, #011C40 0%, #4CAF5033 100%)"
                        : "linear-gradient(135deg, #022859 0%, #ffffff11 100%)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(242,109,61,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(242,109,61,0.2) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                    aria-hidden
                  />
                  <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#F26D3D] bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                      {sol.sector}
                    </span>
                    <span className="font-mono text-5xl font-bold text-white/10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-5">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#4CAF50]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
                      Déployé en production
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex-1 p-6 md:p-8 flex flex-col">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
                    {sol.title}
                  </h3>
                  <p className="text-sm text-slate-400 dark:text-slate-300 leading-relaxed mb-5 flex-1">
                    {sol.summary}
                  </p>

                  {/* Impact */}
                  <div className="rounded-xl border border-[#F26D3D]/25 bg-[#F26D3D]/5 p-3 mb-5">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                      Impact mesuré
                    </p>
                    <p className="font-display text-lg font-bold text-[#F26D3D]">
                      {sol.impact}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {sol.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/20 px-2 py-1 font-mono text-[10px] text-slate-400 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <SnakeButton
                    onClick={() => onNavigate("contact")}
                    variant="outline"
                    size="sm"
                    className="group self-start"
                  >
                    En savoir plus
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                  </SnakeButton>
                </div>
              </article>
            ))}

            {/* Carte finale CTA */}
            <article className="shrink-0 w-[78vw] sm:w-[64vw] md:w-[52vw] lg:w-[40vw] h-[68vh] rounded-3xl border border-dashed border-[#F26D3D]/40 flex flex-col items-center justify-center text-center p-8">
              <Zap className="h-10 w-10 text-[#F26D3D] mb-4" aria-hidden />
              <h3 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                Votre secteur n&apos;est pas listé ?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                Nous concevons des solutions sur-mesure. Expliquons-nous votre
                cas d&apos;usage en 30 minutes.
              </p>
              <SnakeButton
                onClick={() => onNavigate("contact")}
                variant="primary"
                size="lg"
                className="neon-glow"
              >
                Briefing express
                <ArrowRight className="h-4 w-4" aria-hidden />
              </SnakeButton>
            </article>
          </motion.div>
        </div>
      </section>

      {/* === Bandeau confiance === */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: ShieldCheck, t: "Souveraineté garantie", d: "Hébergement SecNumCloud, données chiffrées bout-en-bout, code audité." },
              { icon: Zap, t: "Time-to-value court", d: "Premier incrément en production sous 6 semaines, en moyenne." },
              { icon: Compass, t: "Accompagnement long", d: "Du discovery au run : une équipe dédiée, sans rotation intempestive." },
            ].map((f) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-2xl p-6"
              >
                <f.icon className="h-7 w-7 text-[#F26D3D] mb-3" aria-hidden />
                <h4 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 mb-1.5">
                  {f.t}
                </h4>
                <p className="text-sm text-slate-400 dark:text-slate-300 leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* === Indicateur de phase (lead-in / drift / lead-out) ===
 * Trois segments qui s'illuminent selon la position du scroll.
 */
function PhaseIndicator({ progress }: { progress: MotionValue<number> }) {
  const leadIn = useTransform(progress, [0, 0.15], [1, 0.3]);
  const drift = useTransform(progress, [0.15, 0.16, 0.84, 0.85], [0.3, 1, 1, 0.3]);
  const leadOut = useTransform(progress, [0.85, 1], [0.3, 1]);

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 pointer-events-none">
      <motion.span
        style={{ opacity: leadIn }}
        className="font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400"
      >
        Préparation
      </motion.span>
      <span className="h-px w-4 bg-white/20" aria-hidden />
      <motion.span
        style={{ opacity: drift }}
        className="font-mono text-[9px] uppercase tracking-widest text-[#F26D3D]"
      >
        Dérive
      </motion.span>
      <span className="h-px w-4 bg-white/20" aria-hidden />
      <motion.span
        style={{ opacity: leadOut }}
        className="font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400"
      >
        Libération
      </motion.span>
    </div>
  );
}
