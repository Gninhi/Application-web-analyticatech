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
import { PixelRevealTitle } from "@/components/PixelRevealTitle";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  BrainCircuit,
  Network,
  Workflow,
  Bot,
  BarChart3,
};

/** Image de fond générée associée à chaque service. */
const BG_IMAGES: Record<string, string> = {
  "01": "/services/bg-01-ia.png",
  "02": "/services/bg-02-transfo.png",
  "03": "/services/bg-03-auto.png",
  "04": "/services/bg-04-agents.png",
  "05": "/services/bg-05-bi.png",
};

/** Dégradé mesh superposé à l'image pour cohérence brand. */
const MESH_OVERLAY: Record<string, string> = {
  "01": "radial-gradient(ellipse 70% 90% at 15% 20%, rgba(242,109,61,0.35), transparent 55%), radial-gradient(ellipse 60% 80% at 90% 90%, rgba(2,40,89,0.7), transparent 60%)",
  "02": "radial-gradient(ellipse 70% 90% at 85% 15%, rgba(76,175,80,0.22), transparent 55%), radial-gradient(ellipse 60% 80% at 10% 85%, rgba(2,40,89,0.7), transparent 60%)",
  "03": "radial-gradient(ellipse 70% 90% at 20% 85%, rgba(242,109,61,0.3), transparent 55%), radial-gradient(ellipse 60% 80% at 85% 15%, rgba(255,174,107,0.18), transparent 60%)",
  "04": "radial-gradient(ellipse 70% 90% at 85% 30%, rgba(56,189,248,0.22), transparent 55%), radial-gradient(ellipse 60% 80% at 10% 80%, rgba(2,40,89,0.7), transparent 60%)",
  "05": "radial-gradient(ellipse 70% 90% at 25% 20%, rgba(242,109,61,0.28), transparent 55%), radial-gradient(ellipse 60% 80% at 80% 85%, rgba(168,85,247,0.18), transparent 60%)",
};

interface ServicesViewProps {
  onNavigate: (view: ViewKey) => void;
}

/**
 * ServicesView — effet "Stacking Cards" premium :
 * - Chaque carte entre depuis le bas et vient se poser sur la précédente.
 * - Les cartes précédentes restent visibles en arrière-plan, décalées vers
 *   le haut avec un léger retrait d'échelle → espacement visible entre cards.
 * - Cartes agrandies (max-w-7xl, ~64vh), images de fond immersives.
 */
export function ServicesView({ onNavigate }: ServicesViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative">
      {/* === En-tête === */}
      <section className="pt-32 md:pt-40 pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-3">
              <span className="text-glass">{"// Services — Stacking Sequence"}</span>
            </p>
            <PixelRevealTitle
              text="Cinq couches d'expertise, empilées avec précision"
              as="h1"
              className="font-display text-4xl md:text-6xl font-bold text-[#F26D3D] tracking-tight mb-4"
              wordClassName="text-glass-orange-strong"
            />
            <p className="text-slate-300 leading-relaxed text-lg">
              <span className="text-glass">
                Chaque service est une couche de notre monolithe. Défilez pour
                voir l&apos;architecture se révéler progressivement — chaque carte
                vient se superposer à la précédente avec un espacement visible.
              </span>
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

      {/* === Conteneur des cartes empilées === */}
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

      {/* === Section "Méthode" === */}
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
                <span className="text-glass">{"// Méthode de delivery"}</span>
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-50 mb-4 tracking-tight">
                Du cadrage au run, sans rupture
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                <span className="text-glass">
                  Notre delivery suit un cycle itératif à 4 phases, chacune
                  livrant de la valeur observable. Aucun &ldquo;big bang&rdquo; :
                  chaque incrément est mis en production et monitoré.
                </span>
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

/* === Indicateur de progression textuel === */
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
 * Logique d'animation (espacement visible entre cards) :
 *  - La carte entre depuis le bas (y: 600 → 0) et devient opaque.
 *  - Quand la carte suivante entre, celle-ci monte (y: 0 → -stackOffset × k)
 *    et rétrécit légèrement (scale 1 → 1 - scaleStep × k).
 *  - Résultat : on voit le haut de chaque carte précédente "dépasser"
 *    au-dessus de la carte active, comme un éventail de cards espacées.
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
  const stackOffset = 56; // espacement vertical entre cards empilées (px)
  const scaleStep = 0.035; // retrait d'échelle par carte empilée derrière
  const N = total;

  // Plages du scroll dédiées à cette carte
  const enterStart = isFirst ? 0 : (index - 1) / N;
  const enterEnd = index / N;
  const nextEnterEnd = isLast ? 1 : (index + 1) / N;

  // --- Y : entre depuis le bas puis recule vers le haut ---
  const y = useTransform(
    progress,
    [0, enterStart, enterEnd, nextEnterEnd, 1],
    [
      isFirst ? 0 : 600,
      isFirst ? 0 : 600,
      0,
      isLast ? 0 : -stackOffset,
      isLast ? 0 : -stackOffset * (N - 1 - index),
    ]
  );

  // --- Opacity : 0 → 1 à l'entrée, reste 1 ensuite ---
  const opacity = useTransform(
    progress,
    [0, enterStart, enterEnd, nextEnterEnd, 1],
    [isFirst ? 1 : 0, isFirst ? 1 : 0, 1, 1, 1]
  );

  // --- Scale : 1 à l'entrée, rétrécit quand les suivantes arrivent ---
  const scale = useTransform(
    progress,
    [0, enterStart, enterEnd, nextEnterEnd, 1],
    [
      1,
      1,
      1,
      isLast ? 1 : 1 - scaleStep,
      isLast ? 1 : 1 - scaleStep * (N - 1 - index),
    ]
  );

  const bgImage = BG_IMAGES[service.index] ?? BG_IMAGES["01"];
  const meshOverlay = MESH_OVERLAY[service.index] ?? MESH_OVERLAY["01"];

  return (
    <motion.article
      style={{ y, opacity, scale, zIndex: index + 1 }}
      className="absolute inset-0 flex items-center justify-center px-3 md:px-6"
    >
      <div className="w-full max-w-7xl relative">
        {/* === Contour : border blanc + anneau orange extérieur === */}
        <div
          className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-black/70 grain"
          style={{ border: "1px solid rgba(255, 255, 255, 0.22)" }}
        >
          {/* Image de fond immersive (cover, adaptée à l'écran) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
            aria-hidden
          />
          {/* Mesh gradient overlay pour cohérence brand */}
          <div
            className="absolute inset-0"
            style={{ background: meshOverlay }}
            aria-hidden
          />
          {/* Voile sombre pour lisibilité */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(1,28,64,0.55) 0%, rgba(1,28,64,0.35) 50%, rgba(1,28,64,0.65) 100%)",
            }}
            aria-hidden
          />

          {/* Liseré lumineux supérieur (orange néon) */}
          <div
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#F26D3D]/70 to-transparent pointer-events-none z-20"
            aria-hidden
          />
          {/* Liseré inférieur */}
          <div
            className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-20"
            aria-hidden
          />

          {/* Watermark géant */}
          <div
            className="absolute -right-6 -top-16 md:-right-4 md:-top-20 font-display font-bold text-white/[0.04] select-none pointer-events-none text-[16rem] md:text-[22rem] leading-none"
            aria-hidden
          >
            {service.index}
          </div>

          {/* === Contenu : grid 2 colonnes, panneau glass à droite === */}
          <div className="relative z-10 grid md:grid-cols-5 min-h-[58vh] md:min-h-[62vh]">
            {/* Colonne gauche : visuel + identité */}
            <div className="md:col-span-2 p-8 md:p-12 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="font-mono text-5xl md:text-6xl font-bold text-[#F26D3D]/30">
                  {service.index}
                </span>
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 backdrop-blur-sm">
                  <Icon className="h-8 w-8 text-[#F26D3D]" aria-hidden />
                </span>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#F26D3D] mb-2">
                  <span className="text-glass">{service.tagline}</span>
                </p>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-50 tracking-tight">
                  <span className="text-glass-strong">{service.title}</span>
                </h2>
              </div>
            </div>

            {/* Colonne droite : panneau glass pour la lisibilité */}
            <div className="md:col-span-3 p-8 md:p-12 flex flex-col backdrop-blur-md bg-[#011C40]/55 md:border-l border-white/10">
              <p className="text-slate-200 leading-relaxed mb-6 text-base md:text-lg">
                {service.description}
              </p>

              <div className="mb-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3">
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
                  <div key={m.label} className="rounded-xl border border-white/10 bg-black/25 p-3">
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

        {/* Anneau orange extérieur (double ligne cyberpunk) */}
        <div
          className="absolute -inset-px rounded-[28px] border border-[#F26D3D]/25 pointer-events-none"
          aria-hidden
        />
      </div>
    </motion.article>
  );
}
