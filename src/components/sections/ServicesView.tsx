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
import { useMagneticHover } from "@/hooks/useMagneticHover";

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
 * ServicesView — stacking cards "à la cula.tech" (page About / Principles).
 *
 * Principe :
 *  - Chaque carte est `position: sticky` avec un `top` décalé (0, 28px, 56px…)
 *    pour révéler l'empilement en éventail en haut de l'écran.
 *  - Au scroll, la carte suivante arrive naturellement par-dessus et "écrase"
 *    les précédentes qui rétrécissent (scale) et s'assombrissent (opacity).
 *  - Effet "aimant" : au survol, la carte suit légèrement le curseur.
 *  - Pleine largeur (max-w-6xl), hauteur généreuse (~68vh).
 *
 * Le scroll global de la section pilote les animations scale/opacity :
 *  - La carte i est "active" pendant la plage [i/N, (i+1)/N].
 *  - Pendant cette plage, la carte i+1 arrive par-dessus et la carte i
 *    rétrécit (scale 1 → 0.92) et s'assombrit (opacity 1 → 0.45).
 */
export function ServicesView({ onNavigate }: ServicesViewProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <div className="relative">
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
                Chaque service est une couche de notre monolithe. Défilez : les cartes
                se superposent et se collent en haut comme des aimants — chacune révèle
                la précédente en arrière-plan.
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* === Piste de cartes sticky empilées ===
          Hauteur totale = nb cartes * 100vh (amplitude de scroll). */}
      <section
        ref={sectionRef}
        className="relative"
        style={{ height: `${SERVICES.length * 100}vh` }}
      >
        {SERVICES.map((service, i) => (
          <StickyStackCard
            key={service.index}
            service={service}
            index={i}
            total={SERVICES.length}
            progress={scrollYProgress}
            onNavigate={onNavigate}
          />
        ))}
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
                  Notre delivery suit un cycle itératif à 4 phases, chacune livrant
                  de la valeur observable. Aucun &ldquo;big bang&rdquo; : chaque incrément
                  est mis en production et monitoré.
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

/* === Carte sticky empilée individuelle ===
 *
 * Pattern cula :
 *  - position: sticky avec top décalé (i * 28px) → éventail visible en haut
 *  - Chaque carte occupe 100vh → amplitude de scroll d'1 viewport par carte
 *  - Au scroll, la carte suivante arrive par-dessus (z-index croissant)
 *  - Les cartes précédentes rétrécissent (scale) et s'assombrissent (opacity)
 *    pendant la plage de scroll [i/N, (i+1)/N] (carte suivante qui arrive).
 *  - Effet "aimant" au survol via useMagneticHover.
 */
interface StickyStackCardProps {
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
  onNavigate: (view: ViewKey) => void;
}

function StickyStackCard({ service, index, total, progress, onNavigate }: StickyStackCardProps) {
  const Icon = ICONS[service.icon] ?? BrainCircuit;

  // Plage de scroll dédiée à cette carte : [i/N, (i+1)/N]
  // Pendant cette plage, la carte suivante arrive par-dessus.
  const start = index / total;
  const end = (index + 1) / total;
  const isLast = index === total - 1;

  // Pendant que la carte suivante arrive, celle-ci rétrécit et s'assombrit.
  // La dernière carte ne rétrécit jamais.
  const scale = useTransform(progress, [start, end], [1, isLast ? 1 : 0.92]);
  const opacity = useTransform(progress, [start, end], [1, isLast ? 1 : 0.45]);

  // Effet aimant sur la carte
  const magneticRef = useMagneticHover<HTMLDivElement>({ strength: 0.18, maxShift: 12 });

  const bgImage = BG_IMAGES[service.index] ?? BG_IMAGES["01"];
  const meshOverlay = MESH_OVERLAY[service.index] ?? MESH_OVERLAY["01"];
  // Top décalé façon cula : chaque carte "colle" 28px plus bas que la précédente
  const stickyTop = `${index * 28}px`;

  return (
    <div
      className="sticky h-screen flex items-center justify-center px-3 md:px-6"
      style={{ top: stickyTop, zIndex: index + 1 }}
    >
      {/* motion.div gère scale + opacity (Framer Motion) */}
      <motion.div style={{ scale, opacity }} className="w-full max-w-6xl">
        {/* Wrapper intérieur pour l'effet magnétique (transform séparé) */}
        <div ref={magneticRef} className="relative">
          {/* === Contour : border blanc + anneau orange extérieur === */}
          <div
            className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-black/70 grain"
            style={{ border: "1px solid rgba(255, 255, 255, 0.22)" }}
          >
          {/* Image de fond immersive */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
            aria-hidden
          />
          {/* Mesh gradient overlay */}
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

          {/* Liserés lumineux */}
          <div
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#F26D3D]/70 to-transparent pointer-events-none z-20"
            aria-hidden
          />
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
          <div className="relative z-10 grid md:grid-cols-5 min-h-[64vh] md:min-h-[68vh]">
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

          {/* Anneau orange extérieur */}
          <div
            className="absolute -inset-px rounded-[28px] border border-[#F26D3D]/25 pointer-events-none"
            aria-hidden
          />
        </div>
      </motion.div>
    </div>
  );
}
