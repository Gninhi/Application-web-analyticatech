"use client";

import { type CSSProperties, useRef } from "react";
import {
  ArrowRight,
  BellRing,
  ChartColumn,
  Lightbulb,
  PackageSearch,
  PenLine,
  Radar,
  Target,
  type LucideIcon,
} from "lucide-react";
import { type SolutionDTO, type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { BorderRotate } from "@/components/ui/animated-gradient-border";
import { tint, getSolutionAccent } from "@/lib/utils/colors";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/utils/cn";

export interface SolutionCardProps {
  solution: SolutionDTO;
  index: number;
  total: number;
  onNavigateDetail: (view: ViewKey, id: string) => void;
  isVisible?: boolean;
}

/** Pictogramme propre à chaque projet : l'en-tête ne se ressemble plus d'une carte à l'autre. */
const SOLUTION_ICONS: Record<string, LucideIcon> = {
  ciblioo: Target,
  contentops: PenLine,
  avie: Radar,
  "retail-bi": ChartColumn,
  "logistics-ai": PackageSearch,
  "veille-registres": BellRing,
};

/** Étapes du parcours de l'outil, tirées du texte publié (« A · B · C »), sans rien inventer. */
export function solutionSteps(impact: string): string[] {
  return impact
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Carte solution — trois blocs lisibles :
 *  1. En-tête : pictogramme du projet et schéma de son parcours (« Ce que fait l'outil »).
 *  2. Titre et résumé.
 *  3. État du projet (statut + précision honnête), puis le bouton.
 * Un projet réel a un schéma en trait plein ; une piste à construire, en pointillés.
 * Aucune zone ne défile à l'intérieur de la carte : la molette fait toujours défiler la page.
 */
export function SolutionCard({ solution: sol, index, total, onNavigateDetail }: SolutionCardProps) {
  const { t } = useI18n();
  const accent = getSolutionAccent(sol.order);
  const isIdea = sol.statusType === "methodology";
  const steps = solutionSteps(sol.impact);
  const Icon = SOLUTION_ICONS[sol.slug] ?? Lightbulb;
  const num = String(index + 1).padStart(2, "0");
  const cardRectRef = useRef<DOMRect | null>(null);

  const borderColors = { primary: accent, secondary: tint(accent, 46), accent: tint(accent, 96) };

  // Halo suivant le curseur — rectangle mis en cache à l'entrée (pas de reflow au mouvement)
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    cardRectRef.current = e.currentTarget.getBoundingClientRect();
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = cardRectRef.current;
    if (!rect) return;
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    cardRectRef.current = null;
    e.currentTarget.style.setProperty("--mx", "-200px");
    e.currentTarget.style.setProperty("--my", "-200px");
  };

  const goToDetail = () => onNavigateDetail("solution-detail", sol.slug);

  return (
    <BorderRotate
      onClick={goToDetail}
      className={cn(
        "group shrink-0 w-[84vw] max-w-[340px] sm:w-[380px] sm:max-w-[380px] lg:w-[42vw] lg:max-w-[540px] h-[560px] sm:h-[580px] lg:h-[78svh] lg:max-h-[700px] snap-center cursor-pointer flex flex-col",
        isIdea && "opacity-95"
      )}
      animationMode="rotate-on-hover"
      animationSpeed={9}
      borderRadius={30}
      borderWidth={isIdea ? 1 : 2}
      gradientColors={borderColors}
      backgroundColor="var(--glass-card-bg)"
    >
      <article
        data-solution-card={isIdea ? "idea" : "project"}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative flex h-full w-full flex-col overflow-hidden rounded-[28px] glass-card grain",
          isIdea && "border-dashed"
        )}
        style={{ "--sa": accent, "--mx": "-200px", "--my": "-200px" } as CSSProperties}
      >
        {/* Halo suivant le curseur */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx) var(--my), color-mix(in srgb, var(--sa) 14%, transparent), transparent 70%)",
          }}
          aria-hidden
        />

        {/* 1 — En-tête : le parcours de l'outil */}
        <header
          className="relative z-20 shrink-0 border-b border-border/60 px-5 pt-5 pb-4 sm:px-6 sm:pt-6"
          style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${accent} 9%, transparent), transparent 75%)` }}
        >
          <div className="flex items-start justify-between gap-3">
            <IconBadge icon={Icon} size="lg" color={accent} />
            <span className="font-mono text-[11px] tracking-widest text-slate-600 dark:text-slate-400">
              {num} / {String(total).padStart(2, "0")}
            </span>
          </div>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
            {sol.impactLabel ?? t("common.impact")}
          </p>
          <ol className="mt-2.5 space-y-0" aria-label={sol.impactLabel ?? t("common.impact")}>
            {steps.map((step, i) => (
              <li key={step} className="relative flex items-start gap-3 pb-2.5 last:pb-0">
                {/* Liaison entre les étapes */}
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      "absolute left-[9px] top-5 bottom-0 w-0 border-l",
                      isIdea ? "border-dashed" : "border-solid"
                    )}
                    style={{ borderColor: `color-mix(in srgb, ${accent} 45%, transparent)` }}
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    "relative mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border font-mono text-[9px] text-accent-ink",
                    isIdea ? "border-dashed" : "border-solid"
                  )}
                  style={{
                    borderColor: `color-mix(in srgb, ${accent} 60%, transparent)`,
                    background: isIdea ? "transparent" : `color-mix(in srgb, ${accent} 12%, transparent)`,
                  }}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="block text-sm font-medium leading-snug text-foreground first-letter:uppercase">{step}</span>
              </li>
            ))}
          </ol>
        </header>

        {/* 2 — Titre et résumé */}
        <div className="relative z-20 flex min-h-0 flex-1 flex-col overflow-hidden px-5 pt-5 sm:px-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink">{sol.sector}</p>
          <h2 className="mb-2.5 font-display text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl lg:text-2xl line-clamp-3">
            {sol.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 lg:line-clamp-4">{sol.summary}</p>
        </div>

        {/* 3 — État du projet, puis action */}
        <footer className="relative z-20 shrink-0 space-y-3 px-5 pt-4 pb-5 sm:px-6 sm:pb-6">
          <div
            className={cn("rounded-xl border px-3.5 py-3", isIdea ? "border-dashed" : "border-solid")}
            style={{ borderColor: `color-mix(in srgb, ${accent} 28%, transparent)` }}
          >
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
              <span
                className={cn("h-1.5 w-1.5 shrink-0 rounded-full", isIdea ? "border border-current" : "bg-[#F26D3D]")}
                aria-hidden
              />
              {sol.statusBadge ?? t("solutions.detail.status.default")}
            </p>
            {sol.methodology && (
              <p className="mt-1.5 text-xs leading-snug text-muted-foreground line-clamp-2">{sol.methodology}</p>
            )}
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              goToDetail();
            }}
            variant="outline"
            size="md"
            icon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}
            iconPosition="right"
            className="w-full min-h-[44px]"
          >
            {t("solutions.card.cta")}
          </Button>
        </footer>
      </article>
    </BorderRotate>
  );
}
