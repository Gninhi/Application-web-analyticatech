"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import {
  BrainCircuit,
  Network,
  Workflow,
  Bot,
  BarChart3,
  ArrowUpRight,
  Cpu,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { SERVICES, type Service, type ViewKey } from "@/lib/data";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  BrainCircuit,
  Network,
  Workflow,
  Bot,
  BarChart3,
};

interface ServicesViewProps {
  onNavigate: (view: ViewKey) => void;
}

/**
 * ServicesView — effet "Stacking Cards" :
 * - La 1ère carte est visible dès le départ.
 * - Au scroll, chaque carte suivante entre depuis le bas et vient se
 *   superposer à la précédente (qui rétrécit légèrement + perd en opacité).
 * - Chaque carte possède un contour fin (border + ring) tout autour.
 */
export function ServicesView({ onNavigate }: ServicesViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative">
      {/* En-tête */}
      <section className="pt-32 md:pt-40 pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-3">
              {"// Services — Stacking Sequence"}
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-slate-50 tracking-tight mb-4">
              Cinq couches d&apos;expertise,
              <br />
              <span className="text-gradient-accent">empilées avec précision</span>
            </h1>
            <p className="text-slate-400 leading-relaxed text-lg">
              Chaque service est une couche de notre monolithe. Défilez pour voir
              l&apos;architecture se révéler progressivement — chaque carte vient
              se superposer à la précédente.
            </p>

            {/* Indicateur de progression du scroll */}
            <div className="mt-8 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Scroll stack
              </span>
              <div className="relative h-px w-40 bg-white/10 overflow-hidden">
                <motion.div
                  style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                  className="absolute inset-0 bg-[#F26D3D]"
                />
              </div>
              <ScrollProgress value={scrollYProgress} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conteneur des cartes empilées.
          Hauteur = nb cartes * 90vh => laisse le temps de défiler. */}
      <section
        className="relative"
        style={{ height: `${SERVICES.length * 90}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {SERVICES.map((service, i) => (
            <StackCard
              key={service.index}
              service={service}
              index={i}
              total={SERVICES.length}
              progress={scrollYProgress}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* Section "Méthode" */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-3">
                {"// Méthode de delivery"}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-50 mb-4 tracking-tight">
                Du cadrage au run, sans rupture
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Notre delivery suit un cycle itératif à 4 phases, chacune livrant
                de la valeur observable. Aucun &ldquo;big bang&rdquo; : chaque incrément
                est mis en production et monitoré.
              </p>
              <button
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#F26D3D] px-5 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#ff7a4a] neon-glow"
              >
                Cadrer votre mission
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              {[
                { icon: Layers, t: "01 · Discovery", d: "Atelier de cadrage, architecture cible, ROI projet" },
                { icon: Cpu, t: "02 · Build", d: "Sprints de 2 semaines, démos en production, observabilité" },
                { icon: ShieldCheck, t: "03 · Hardening", d: "Audit sécurité, tests de charge, conformité RGPD" },
                { icon: Workflow, t: "04 · Run & Scale", d: "Supervision 24/7, finops, amélioration continue" },
              ].map((step) => (
                <div
                  key={step.t}
                  className="flex items-start gap-4 rounded-xl glass p-4 hover:border-[#F26D3D]/30 transition-colors"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#F26D3D]/30 bg-[#F26D3D]/10">
                    <step.icon className="h-5 w-5 text-[#F26D3D]" aria-hidden />
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-slate-200">
                      {step.t}
                    </p>
                    <p className="text-sm text-slate-400 mt-0.5">{step.d}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* === Indicateur de progression textuel (00 → 05) === */
function ScrollProgress({ value }: { value: MotionValue<number> }) {
  const idx = useTransform(value, (v) =>
    String(Math.min(SERVICES.length, Math.floor(v * SERVICES.length) + 1)).padStart(2, "0")
  );
  return (
    <motion.span className="font-mono text-[10px] uppercase tracking-widest text-[#F26D3D]">
      <motion.span>{idx}</motion.span>
      <span className="text-slate-600"> / {String(SERVICES.length).padStart(2, "0")}</span>
    </motion.span>
  );
}

/* === Carte empilée individuelle ===
 *
 * Logique d'animation :
 *  - Carte 0 : visible dès le départ (y=0, opacity=1). Rétrécit quand la carte 1 entre.
 *  - Carte i (i>0) : cachée au départ (y=+480px, opacity=0). Entre depuis le bas
 *    sur la plage [(i-1)/total, i/total], pendant que la carte i-1 rétrécit.
 *  - Toutes les cartes (sauf la dernière) rétrécissent sur [i/total, (i+1)/total]
 *    quand la carte suivante arrive par-dessus.
 *
 * Les hooks useTransform sont toujours appelés exactement 3 fois par render
 * (règle des hooks respectée). Les plages/valeurs s'adaptent selon isFirst/isLast.
 */

interface StackCardProps {
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
  onNavigate: (view: ViewKey) => void;
}

function StackCard({ service, index, total, progress, onNavigate }: StackCardProps) {
  const Icon = ICONS[service.icon] ?? BrainCircuit;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Plages d'animation de cette carte
  const enterStart = isFirst ? 0 : (index - 1) / total;
  const enterEnd = index / total; // = début du recul
  const shrinkEnd = isLast ? 1 : (index + 1) / total;

  // --- Y : la carte entre depuis le bas (480px) vers sa position (0) ---
  // Carte 0 : toujours à 0 (déjà en place).
  // Autres : 480px avant enterEnd, 0 à partir de enterEnd.
  const y = useTransform(
    progress,
    [0, enterStart, enterEnd, 1],
    [isFirst ? 0 : 480, isFirst ? 0 : 480, 0, 0]
  );

  // --- Opacity : 0 → 1 pendant l'entrée (carte 0 : toujours 1) ---
  const opacity = useTransform(
    progress,
    [0, enterStart, enterEnd, 1],
    [isFirst ? 1 : 0, isFirst ? 1 : 0, 1, 1]
  );

  // --- Scale : 1 → 0.88 pendant le recul (carte suivante qui arrive) ---
  // La dernière carte ne rétrécit jamais.
  const scale = useTransform(
    progress,
    [0, enterEnd, shrinkEnd, 1],
    [1, 1, isLast ? 1 : 0.88, isLast ? 1 : 0.88]
  );

  return (
    <motion.article
      style={{ y, opacity, scale, zIndex: index + 1 }}
      className="absolute inset-0 flex items-center justify-center px-4 md:px-10"
      // Accessibilité : masquer les cartes non visibles pour les lecteurs d'écran
      aria-hidden={!isFirst && index > 0 ? undefined : undefined}
    >
      <div className="w-full max-w-6xl relative">
        {/* === Contour fin : border blanc via inline style (surcharge glass-strong)
               + anneau orange extérieur + liserés lumineux haut/bas === */}
        <div
          className="relative glass-strong rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
          style={{ border: "1px solid rgba(255, 255, 255, 0.22)" }}
        >
          {/* Liseré lumineux supérieur (orange néon) */}
          <div
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#F26D3D]/70 to-transparent pointer-events-none z-10"
            aria-hidden
          />
          {/* Liseré lumineux inférieur */}
          <div
            className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10"
            aria-hidden
          />

          <div className="grid md:grid-cols-5">
            {/* Colonne visuelle */}
            <div className="relative md:col-span-2 bg-gradient-to-br from-[#022859] to-[#011C40] p-8 md:p-10 flex flex-col justify-between min-h-[300px]">
              <div className="flex items-start justify-between">
                <span className="font-mono text-5xl md:text-6xl font-bold text-white/10">
                  {service.index}
                </span>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#F26D3D]/40 bg-[#F26D3D]/10">
                  <Icon className="h-7 w-7 text-[#F26D3D]" aria-hidden />
                </span>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#F26D3D] mb-2">
                  {service.tagline}
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-50 tracking-tight">
                  {service.title}
                </h2>
              </div>
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(242,109,61,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(242,109,61,0.15) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
                aria-hidden
              />
            </div>

            {/* Colonne contenu */}
            <div className="md:col-span-3 p-8 md:p-10 flex flex-col">
              <p className="text-slate-300 leading-relaxed mb-6">{service.description}</p>

              <div className="mb-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-3">
                  Stack technologique
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[11px] text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {service.metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="font-display text-2xl font-bold text-[#F26D3D]">{m.value}</p>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500 mt-0.5">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate("contact")}
                className="mt-auto group inline-flex items-center gap-2 self-start rounded-lg border border-[#F26D3D]/40 bg-[#F26D3D]/10 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#F26D3D] transition hover:bg-[#F26D3D] hover:text-white"
              >
                Démarrer ce service
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        {/* === Contour extérieur additionnel (double ligne cyberpunk) === */}
        <div
          className="absolute -inset-px rounded-3xl border border-[#F26D3D]/25 pointer-events-none"
          aria-hidden
        />
      </div>
    </motion.article>
  );
}
