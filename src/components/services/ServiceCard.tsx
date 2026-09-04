"use client";

import { useRef, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { ServiceCardHeader } from "./ServiceCardHeader";
import { ServiceCardMeta } from "./ServiceCardMeta";
import { ServiceCardAction } from "./ServiceCardAction";
import { ServiceAnimatedIcon, type ServiceIconVariant } from "./ServiceAnimatedIcon";

export interface ServiceCardData {
  id: string;
  serviceIndex: string;
  title: string;
  promise: string;
  tagline: string;
  badge?: string;
  iconVariant: ServiceIconVariant;
  technologies: string[];
  metrics: { label: string; value: string };
  secondaryMetric?: { label: string; value: string };
  accentColor?: string;
}

export type BentoVariant = "hero" | "counterpart" | "standard" | "wide";

interface ServiceCardProps {
  service: ServiceCardData;
  index: number;
  variant?: BentoVariant;
  actionLabel: string;
  onNavigateDetail: (serviceIndex: string) => void;
}

/**
 * ServiceCard — carte de service de la page d'accueil, structure « bento » :
 *   - Colonne ID mono (01) | entête éditoriale | chip icône animée CSS
 *   - Stack techno en pills compactes
 *   - Ligne CTA puis « stat strip » (séparateur dashed + label/valeur)
 * Fidèle au langage liquid glass du site : glass-card + grain, liseré
 * supérieur teinté à l'accent, glow radial suivant le curseur (200px),
 * watermark géant du numéro en arrière-plan.
 */
export function ServiceCard({
  service,
  index,
  variant: _variant = "standard",
  actionLabel,
  onNavigateDetail,
}: ServiceCardProps) {
  const accent = service.accentColor ?? "#F26D3D";
  const cardRef = useRef<HTMLDivElement>(null);
  const cardRectRef = useRef<DOMRect | null>(null);
  const goToDetail = () => onNavigateDetail(service.serviceIndex);

  // Glow radial fin suivant le curseur (pattern bento : rayon court, discret)
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    cardRectRef.current = e.currentTarget.getBoundingClientRect();
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = cardRectRef.current || el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    cardRectRef.current = null;
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "-200px");
    el.style.setProperty("--my", "-200px");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={goToDetail}
      className="group relative cursor-pointer h-full"
    >
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-full w-full glass-card grain rounded-[28px] overflow-hidden p-6 sm:p-7 flex flex-col justify-between gap-6 transition-all duration-300 group-hover:border-opacity-60"
        style={
          {
            "--sa": accent,
            "--mx": "-200px",
            "--my": "-200px",
            borderColor: "var(--glass-card-border)",
          } as CSSProperties
        }
      >
        {/* 1. Liseré supérieur — teinte du pilier */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}cc, transparent)`,
          }}
          aria-hidden
        />

        {/* 2. Watermark géant de fond — numéro du pilier */}
        <span
          className="pointer-events-none absolute -bottom-6 -right-3 z-0 select-none font-display text-[8rem] font-bold leading-none"
          style={{ color: `color-mix(in srgb, ${accent} 7%, transparent)` }}
          aria-hidden
        >
          {service.serviceIndex}
        </span>

        {/* 3. Glow radial suivant le curseur (discret, teinté accent) */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(200px circle at var(--mx) var(--my), color-mix(in srgb, var(--sa) 13%, transparent), transparent 68%)",
          }}
          aria-hidden
        />

        {/* 4. Corps bento : ID | entête éditoriale | chip icône animée
               (grille 2 colonnes sur mobile : ID + icône en ligne, entête dessous) */}
        <div className="relative z-20 grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-start gap-x-5 gap-y-4">
          <span
            className="col-start-1 row-start-1 font-mono text-sm font-bold tracking-widest opacity-70"
            style={{ color: accent }}
            aria-hidden
          >
            /{service.serviceIndex}
          </span>

          <div className="col-start-2 row-start-1 justify-self-end sm:col-start-3">
            <ServiceAnimatedIcon variant={service.iconVariant} accentColor={accent} />
          </div>

          <div className="col-span-2 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 min-w-0">
            <ServiceCardHeader
              tagline={service.tagline}
              badge={service.badge}
              title={service.title}
              promise={service.promise}
              accentColor={accent}
            />
          </div>
        </div>

        {/* 5. Stack technique en pills */}
        <div className="relative z-20">
          <ServiceCardMeta technologies={service.technologies} />
        </div>

        {/* 6. Ligne CTA vers la fiche détail */}
        <div className="relative z-20 mt-auto pt-1 flex items-center justify-between">
          <ServiceCardAction label={actionLabel} onClick={goToDetail} accentColor={accent} />
          <span
            className="font-mono text-[10px] transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            Fiche #{service.serviceIndex} ↗
          </span>
        </div>

        {/* 7. Stat strip bento : séparateur dashed + label mono / valeur accent */}
        <div
          className="relative z-20 flex items-end justify-between gap-6 border-t border-dashed pt-4"
          style={{ borderColor: "var(--glass-card-border)" }}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-bold">
              {service.metrics.label}
            </p>
            <p className="mt-1 font-display font-bold text-xl tracking-tight" style={{ color: accent }}>
              {service.metrics.value}
            </p>
          </div>

          {service.secondaryMetric && (
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-bold">
                {service.secondaryMetric.label}
              </p>
              <p className="mt-1 font-display font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">
                {service.secondaryMetric.value}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
