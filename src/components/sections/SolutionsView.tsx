"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Compass, Zap, ShieldCheck } from "lucide-react";
import { SOLUTIONS, type ViewKey } from "@/lib/data";
import { PixelRevealTitle } from "@/components/PixelRevealTitle";

interface SolutionsViewProps {
  onNavigate: (view: ViewKey) => void;
}

/**
 * SolutionsView — catalogue interactif en scroll horizontal.
 * Le défilement vertical pilote la translation horizontale d'une
 * piste de cartes "spatiale", comme un carrousel inertiel.
 */
export function SolutionsView({ onNavigate }: SolutionsViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // La piste horizontale se déplace de 0 à -(75% de sa largeur)
  // ajusté pour s'arrêter sur la dernière carte.
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-72%"]);
  // Indicateur de progression
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative">
      {/* En-tête */}
      <section className="pt-32 md:pt-40 pb-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-3">
              <span className="text-glass">{"// Solutions — Lateral Drift"}</span>
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[#F26D3D] tracking-tight mb-4">
              <PixelRevealTitle
                text="Des solutions sectorielles,"
                as="span"
                className="block"
                wordClassName="text-glass-orange"
                delay={0.1}
              />
              <PixelRevealTitle
                text="en orbite"
                as="span"
                className="block text-neon"
                wordClassName="text-glass-orange-strong"
                delay={0.45}
              />
            </h1>
            <p className="text-slate-300 leading-relaxed text-lg">
              <span className="text-glass">
                Défilez verticalement : les cas d&apos;usage défilent horizontalement
                comme une séquence orbitale. Chaque solution est prête à être
                adaptée à votre contexte.
              </span>
            </p>
          </motion.div>

          {/* Barre de progression horizontale */}
          <div className="mt-10 flex items-center gap-3">
            <Compass className="h-4 w-4 text-[#F26D3D]" aria-hidden />
            <div className="relative h-px flex-1 bg-white/10 overflow-hidden">
              <motion.div
                style={{ width: progressWidth }}
                className="absolute inset-y-0 left-0 bg-[#F26D3D]"
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Drift Sequence
            </span>
          </div>
        </div>
      </section>

      {/* Piste horizontale — hauteur = nb cartes * 80vh pour laisser le temps de défiler */}
      <section
        className="relative"
        style={{ height: `${SOLUTIONS.length * 80}vh` }}
      >
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div
            style={{ x }}
            className="flex gap-6 md:gap-8 pl-4 md:pl-10 pr-10"
          >
            {SOLUTIONS.map((sol, i) => (
              <article
                key={sol.id}
                className="relative shrink-0 w-[85vw] sm:w-[70vw] md:w-[58vw] lg:w-[44vw] h-[68vh] glass-strong rounded-3xl overflow-hidden flex flex-col"
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
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-50 mb-3 tracking-tight">
                    {sol.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-5 flex-1">
                    {sol.summary}
                  </p>

                  {/* Impact */}
                  <div className="rounded-xl border border-[#F26D3D]/25 bg-[#F26D3D]/5 p-3 mb-5">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1">
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
                        className="rounded-md border border-white/10 bg-black/20 px-2 py-1 font-mono text-[10px] text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onNavigate("contact")}
                    className="group inline-flex items-center gap-2 self-start rounded-lg border border-white/15 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-slate-100 transition hover:border-[#F26D3D] hover:text-[#F26D3D]"
                  >
                    En savoir plus
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                  </button>
                </div>
              </article>
            ))}

            {/* Carte finale CTA */}
            <article className="shrink-0 w-[85vw] sm:w-[70vw] md:w-[50vw] h-[68vh] rounded-3xl border border-dashed border-[#F26D3D]/40 flex flex-col items-center justify-center text-center p-8">
              <Zap className="h-10 w-10 text-[#F26D3D] mb-4" aria-hidden />
              <h3 className="font-display text-3xl font-bold text-slate-50 mb-3">
                Votre secteur n&apos;est pas listé ?
              </h3>
              <p className="text-slate-400 mb-6 max-w-sm">
                Nous concevons des solutions sur-mesure. Expliquons-nous votre
                cas d&apos;usage en 30 minutes.
              </p>
              <button
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#F26D3D] px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#ff7a4a] neon-glow"
              >
                Brifing express
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </article>
          </motion.div>
        </div>
      </section>

      {/* Bandeau confiance */}
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
                className="glass rounded-2xl p-6"
              >
                <f.icon className="h-7 w-7 text-[#F26D3D] mb-3" aria-hidden />
                <h4 className="font-display text-lg font-bold text-slate-50 mb-1.5">
                  {f.t}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
