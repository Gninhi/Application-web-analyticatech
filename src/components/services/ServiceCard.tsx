"use client";

import { useRef, type CSSProperties } from "react";
import { m } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";
import { SERVICE_ICONS } from "@/lib/content/services";
import { ServiceCardHeader } from "./ServiceCardHeader";
import { ServiceCardMeta } from "./ServiceCardMeta";
import { ServiceCardAction } from "./ServiceCardAction";

export interface ServiceCardData {
  id: string;
  serviceIndex: string;
  title: string;
  promise: string;
  tagline: string;
  /** Clé d'icône du contenu (brain, workflow, bot, chart) → `SERVICE_ICONS`. */
  iconKey: string;
  technologies: string[];
}

export type BentoVariant = "hero" | "counterpart" | "standard" | "wide";

interface ServiceCardProps {
  service: ServiceCardData;
  index: number;
  total: number;
  variant?: BentoVariant;
  actionLabel: string;
  toolsLabel: string;
  onNavigateDetail: (serviceIndex: string) => void;
}

/**
 * ServiceCard — carte de service de la page d'accueil, en quatre blocs lisibles :
 *   1. Pastille d'icône du service (`IconBadge`, comme partout sur le site) et repère « 01 / 04 ».
 *   2. Accroche, titre et description.
 *   3. Outils sur une ligne.
 *   4. Lien vers la fiche détail.
 * Verre `glass-card` + grain, halo discret suivant le curseur.
 */
export function ServiceCard({
  service,
  index,
  total,
  variant: _variant = "standard",
  actionLabel,
  toolsLabel,
  onNavigateDetail,
}: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardRectRef = useRef<DOMRect | null>(null);
  const goToDetail = () => onNavigateDetail(service.serviceIndex);
  const Icon = SERVICE_ICONS[service.iconKey] ?? Lightbulb;

  // Halo radial suivant le curseur — rectangle mis en cache à l'entrée (pas de reflow au mouvement)
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    cardRectRef.current = e.currentTarget.getBoundingClientRect();
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    const rect = cardRectRef.current;
    if (!el || !rect) return;
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
    <m.article
      initial={false}
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
        className="relative h-full w-full glass-card grain rounded-[28px] overflow-hidden p-6 sm:p-7 flex flex-col gap-5"
        style={{ "--mx": "-200px", "--my": "-200px" } as CSSProperties}
      >
        {/* Halo suivant le curseur (discret, teinté accent) */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(240px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent-ink) 12%, transparent), transparent 68%)",
          }}
          aria-hidden
        />

        {/* 1. Pastille du service et repère */}
        <div className="relative z-20 flex items-center justify-between gap-4">
          <IconBadge icon={Icon} size="lg" />
          <span className="text-xs font-medium tracking-[0.08em] text-slate-600 dark:text-[#B6C2D6]">
            {service.serviceIndex} / {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* 2. Accroche, titre, description */}
        <div className="relative z-20">
          <ServiceCardHeader tagline={service.tagline} title={service.title} promise={service.promise} />
        </div>

        {/* 3. Outils */}
        <div className="relative z-20">
          <ServiceCardMeta label={toolsLabel} technologies={service.technologies} />
        </div>

        {/* 4. Lien vers la fiche détail */}
        <div className="relative z-20 mt-auto border-t border-border pt-3">
          <ServiceCardAction label={actionLabel} onClick={goToDetail} />
        </div>
      </div>
    </m.article>
  );
}
