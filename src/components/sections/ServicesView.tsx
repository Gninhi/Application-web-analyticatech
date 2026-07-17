"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Cpu,
  ShieldCheck,
  Layers,
  Workflow,
} from "lucide-react";
import { type Service, type ViewKey } from "@/lib/data";
import { useI18n, useLocalizedData } from "@/lib/i18n";
import { PixelRevealTitle } from "@/components/PixelRevealTitle";
import { SERVICE_ICONS, getServiceBgImage, getServiceMeshOverlay } from "@/lib/services";
import { SnakeButton } from "@/components/SnakeButton";

interface ServicesViewProps {
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

const DELIVERY_STEPS = [
  { icon: Layers, t: "01 · Discovery", d: "Atelier de cadrage, architecture cible, ROI projet" },
  { icon: Cpu, t: "02 · Build", d: "Sprints de 2 semaines, démos en production, observabilité" },
  { icon: ShieldCheck, t: "03 · Hardening", d: "Audit sécurité, tests de charge, conformité RGPD" },
  { icon: Workflow, t: "04 · Run & Scale", d: "Supervision 24/7, finops, amélioration continue" },
] as const;

/**
 * ServicesView — empilement sticky pur CSS inspiré cula.tech.
 *
 * Principe (simplicité = fluidité) :
 *  - Chaque carte est `position: sticky; top: 0` avec `height: 100vh`
 *    et un fond opaque (#011C40 + image de fond).
 *  - Les cartes se superposent naturellement via le scroll natif du
 *    navigateur — aucune transformation Framer Motion sur y/opacity/scale
 *    pendant l'empilement (c'est ce qui garantit la fluidité 60fps).
 *  - La carte suivante arrive par-dessus (z-index croissant) et recouvre
 *    intégralement la précédente grâce au fond opaque.
 *  - Un overlay sombre progressif sur les cartes précédentes (via
 *    useScroll global) ajoute de la profondeur sans casser la fluidité.
 *
 * Chaque carte occupe 100vh → amplitude totale = nb cartes * 100vh.
 */
export function ServicesView({ onNavigate, onNavigateDetail }: ServicesViewProps) {
  const { t } = useI18n();
  const { SERVICES } = useLocalizedData();

  // Scroll progress global pour l'overlay de profondeur (subtil, non-bloquant)
  const { scrollYProgress } = useScroll();

  return (
    <div className="relative">
      {/* === En-tête === */}
      <section className="pt-32 md:pt-40 pb-12 bg-background relative z-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-3">
              {"// Services — Séquence d'Empilement"}
            </p>
            <PixelRevealTitle
              text={t("services.title")}
              as="h1"
              className="font-display text-4xl md:text-6xl font-bold text-[#F26D3D] tracking-tight mb-4"
            />
            <p className="text-slate-400 dark:text-slate-300 leading-relaxed text-lg">
              {t("services.desc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* === Piste de cartes sticky empilées (pur CSS, pas de transforms) ===
          Chaque carte : position: sticky; top: 0; height: 100vh; fond opaque.
          Hauteur totale = nb cartes * 100vh (1 viewport de scroll par carte). */}
      <section className="relative">
        {SERVICES.map((service, i) => (
          <StickyServiceCard
            key={service.index}
            service={service}
            index={i}
            total={SERVICES.length}
            scrollProgress={scrollYProgress}
            onNavigate={onNavigate}
            onNavigateDetail={onNavigateDetail}
          />
        ))}
      </section>

      {/* === Section "Méthode" === */}
      <section className="py-24 md:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-3">
                {"// Méthode de livraison"}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
                {t("services.method.title")}
              </h2>
              <p className="text-slate-400 dark:text-slate-300 leading-relaxed mb-6">
                {t("services.method.desc")}
              </p>
              <SnakeButton
                onClick={() => onNavigate("contact")}
                variant="primary"
                size="md"
                className="neon-glow"
              >
                {t("services.method.cta")}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </SnakeButton>
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
                  className="flex items-start gap-4 rounded-xl glass-card p-4 hover:border-[#F26D3D]/30 transition-colors"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#F26D3D]/30 bg-[#F26D3D]/10">
                    <step.icon className="h-5 w-5 text-[#F26D3D]" aria-hidden />
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-slate-700 dark:text-slate-200">
                      {step.t}
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-300 mt-0.5">{step.d}</p>
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

/* === Carte sticky individuelle (pur CSS, fluide) ===
 *
 * Approche cula.tech :
 *  - position: sticky; top: 0 → la carte se "colle" en haut
 *  - height: 100vh → occupe tout le viewport
 *  - Fond opaque (image + mesh + voile) → recouvre intégralement la précédente
 *  - z-index croissant → la carte suivante passe au-dessus
 *  - Aucun transform sur y/opacity/scale pendant l'empilement → fluidité 60fps
 *
 * L'overlay de profondeur (useTransform) est appliqué sur un layer séparé
 * qui ne déclenche pas de repaint du contenu principal.
 */
interface StickyServiceCardProps {
  service: Service;
  index: number;
  total: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

function StickyServiceCard({ service, index, total, scrollProgress, onNavigate, onNavigateDetail }: StickyServiceCardProps) {
  const { t } = useI18n();
  const IconComponent = SERVICE_ICONS[service.icon] ?? SERVICE_ICONS.BrainCircuit;
  const bgImage = getServiceBgImage(service.index);
  const meshOverlay = getServiceMeshOverlay(service.index);

  // Overlay de profondeur : assombrit légèrement les cartes précédentes.
  // Plage de scroll dédiée à cette carte : [index/total, (index+1)/total]
  const start = index / total;
  const end = (index + 1) / total;
  const isLast = index === total - 1;
  // L'overlay passe de 0 (visible) à 0.6 (assombri) quand la carte suivante arrive
  const overlayOpacity = useTransform(
    scrollProgress,
    [start, end],
    [0, isLast ? 0 : 0.6]
  );

  return (
    <article
      className="sticky top-0 h-screen w-full flex items-center justify-center px-3 md:px-6 overflow-hidden"
      style={{ zIndex: index + 1, backgroundColor: "#011C40" }}
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
            "linear-gradient(135deg, rgba(1,28,64,0.65) 0%, rgba(1,28,64,0.4) 50%, rgba(1,28,64,0.75) 100%)",
        }}
        aria-hidden
      />

      {/* Overlay de profondeur (assombrit les cartes précédentes) */}
      {!isLast && (
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-[#011C40] pointer-events-none z-30"
          aria-hidden
        />
      )}

      {/* Contenu de la carte */}
      <div className="relative z-10 w-full max-w-6xl">
        <div
          className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-black/70 grain"
          style={{ border: "1px solid rgba(255, 255, 255, 0.22)" }}
        >
          {/* Liseré lumineux supérieur */}
          <div
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#F26D3D]/70 to-transparent pointer-events-none z-20"
            aria-hidden
          />

          {/* Watermark géant */}
          <div
            className="absolute -right-6 -top-16 md:-right-4 md:-top-20 font-display font-bold text-white/[0.04] select-none pointer-events-none text-[16rem] md:text-[22rem] leading-none"
            aria-hidden
          >
            {service.index}
          </div>

          {/* === Contenu : grid 2 colonnes === */}
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
                  {service.tagline}
                </p>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                  {service.title}
                </h2>
              </div>
            </div>

            {/* Colonne droite : panneau glass pour la lisibilité */}
            <div className="md:col-span-3 p-8 md:p-12 flex flex-col bg-[#011C40]/85 backdrop-blur-md md:border-l border-black/10 dark:border-white/10">
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-6 text-base md:text-lg">
                {service.description}
              </p>

              <div className="mb-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-300 mb-3">
                  {t("common.techStack")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-black/10 dark:border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[11px] text-slate-400 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {service.metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-black/10 dark:border-white/10 bg-black/25 p-3">
                    <p className="font-display text-2xl font-bold text-[#F26D3D]">{m.value}</p>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>

              <SnakeButton
                onClick={() => onNavigateDetail("service-detail", service.index)}
                variant="outline"
                size="sm"
                className="mt-auto group self-start"
              >
                {t("services.card.cta")}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </SnakeButton>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
