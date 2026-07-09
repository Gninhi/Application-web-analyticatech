"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import {
  ArrowUpRight,
  Cpu,
  ShieldCheck,
  Layers,
  Workflow,
} from "lucide-react";
import { SERVICES, type Service, type ViewKey } from "@/lib/data";
import { PixelRevealTitle } from "@/components/PixelRevealTitle";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { getServiceBgImage, getServiceMeshOverlay, SERVICE_ICONS } from "@/lib/services";

interface ServicesViewProps {
  onNavigate: (view: ViewKey) => void;
}

/**
 * ServicesView — stacking cards "à la cula.tech".
 *
 * Principe (correctif du bug de transparence) :
 *  - Chaque carte est `position: sticky` avec `top: 0` (PAS d'éventail)
 *    et un fond opaque (`bg-[#011C40]`) → la carte suivante recouvre
 *    intégralement la précédente, aucun reste visible.
 *  - La carte active (au premier plan) reste à scale 1, opacity 1.
 *  - Les cartes précédentes (en arrière-plan) rétrécissent légèrement
 *    (scale 0.94) et s'assombrissent (opacity 0) → totalement masquées
 *    par la carte suivante qui a un fond opaque.
 *  - Effet "aimant" au survol via useMagneticHover.
 *  - Hauteur section = nb cartes * 100vh (1 viewport de scroll par carte).
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
                se superposent et se collent en haut — la précédente disparaît sous
                la suivante, révélation par révélation.
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
              {DELIVERY_STEPS.map((step) => (
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

const DELIVERY_STEPS = [
  { icon: Layers, t: "01 · Discovery", d: "Atelier de cadrage, architecture cible, ROI projet" },
  { icon: Cpu, t: "02 · Build", d: "Sprints de 2 semaines, démos en production, observabilité" },
  { icon: ShieldCheck, t: "03 · Hardening", d: "Audit sécurité, tests de charge, conformité RGPD" },
  { icon: Workflow, t: "04 · Run & Scale", d: "Supervision 24/7, finops, amélioration continue" },
] as const;

/* === Carte sticky empilée individuelle ===
 *
 * Correctif du bug de transparence :
 *  - `top: 0` (PAS d'éventail) + fond opaque sur la div sticky extérieure
 *    → la carte suivante recouvre intégralement la précédente.
 *  - La carte active (scale 1, opacity 1) reste visible au premier plan.
 *  - Les cartes précédentes passent à opacity 0 → invisibles, même si la
 *    carte suivante n'avait pas de fond, elles ne montreraient rien.
 *  - Double sécurité : fond opaque + opacity 0 des cartes précédentes.
 */
interface StickyStackCardProps {
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
  onNavigate: (view: ViewKey) => void;
}

function StickyStackCard({ service, index, total, progress, onNavigate }: StickyStackCardProps) {
  // Icône résolue via map statique (audit : pas de composant créé pendant le render)
  const IconComponent = SERVICE_ICONS[service.icon] ?? SERVICE_ICONS.BrainCircuit;
  const bgImage = getServiceBgImage(service.index);
  const meshOverlay = getServiceMeshOverlay(service.index);
  const magneticRef = useMagneticHover<HTMLDivElement>({ strength: 0.18, maxShift: 12 });

  // Plage de scroll dédiée à cette carte : [i/N, (i+1)/N]
  const start = index / total;
  const end = (index + 1) / total;
  const isLast = index === total - 1;

  // Pendant que la carte suivante arrive, celle-ci s'estompe totalement.
  // La dernière carte ne s'estompe jamais (reste au premier plan).
  // Opacity → 0 (pas 0.45) pour garantir l'invisibilité de la précédente.
  const scale = useTransform(progress, [start, end], [1, isLast ? 1 : 0.94]);
  const opacity = useTransform(progress, [start, end], [1, isLast ? 1 : 0]);

  return (
    <div
      className="sticky top-0 h-screen flex items-center justify-center px-3 md:px-6 bg-[#011C40]"
      style={{ zIndex: index + 1 }}
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
            <div className="absolute inset-0" style={{ background: meshOverlay }} aria-hidden />
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
                    <IconComponent className="h-8 w-8 text-[#F26D3D]" aria-hidden />
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
