"use client";

import { type CSSProperties, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { type SolutionDTO, type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { BorderRotate } from "@/components/ui/animated-gradient-border";
import { tint, getSolutionAccent } from "@/lib/utils/colors";

export interface SolutionCardProps {
  solution: SolutionDTO;
  index: number;
  total: number;
  onNavigateDetail: (view: ViewKey, id: string) => void;
  isVisible?: boolean;
}

/**
 * Carte solution — grand format avec en-tête technique, impact sectoriel
 * et navigation vers la fiche détaillée.
 * Optimisée pour un scroll fluide 60fps :
 * - Gel des animations coûteuses (conic-gradient et balayage) quand hors-écran
 * - Cache du getBoundingClientRect sur mouseenter pour supprimer le layout thrashing
 */
export function SolutionCard({
  solution,
  index,
  total,
  onNavigateDetail,
  isVisible = true,
}: SolutionCardProps) {
  const { t } = useI18n();
  const sol = solution;
  const num = String(index + 1).padStart(2, "0");
  const accent = getSolutionAccent(sol.order);
  const cardRectRef = useRef<DOMRect | null>(null);

  // En-tête image — esthétique premium minimaliste
  const headerGradient = `linear-gradient(135deg, #050a18 0%, #0a1328 55%, color-mix(in srgb, ${accent} 22%, #050a18) 130%)`;
  const headerGrid = `linear-gradient(color-mix(in srgb, ${accent} 22%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, ${accent} 22%, transparent) 1px, transparent 1px)`;
  const headerGridMask = "radial-gradient(ellipse 85% 100% at 30% 0%, black 30%, transparent 92%)";
  const headerGlow = `radial-gradient(300px circle at 84% 12%, color-mix(in srgb, ${accent} 26%, transparent), transparent 70%)`;

  // Bordure animée déclinée sur l'accent du secteur
  const borderColors = {
    primary: accent,
    secondary: tint(accent, 46),
    accent: tint(accent, 96),
  };

  // Style accent des chips
  const chipStyle: CSSProperties = {
    borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
    background: `color-mix(in srgb, ${accent} 12%, transparent)`,
  };
  const impactStyle: CSSProperties = {
    borderColor: `color-mix(in srgb, ${accent} 18%, transparent)`,
    background: `linear-gradient(90deg, color-mix(in srgb, ${accent} 8%, transparent), transparent)`,
  };

  // Spot lumineux suivant le curseur — calcul optimisé sans forced reflow
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    cardRectRef.current = e.currentTarget.getBoundingClientRect();
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = cardRectRef.current;
    if (!rect) return;
    const el = e.currentTarget;
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    cardRectRef.current = null;
    const el = e.currentTarget;
    el.style.setProperty("--mx", "-200px");
    el.style.setProperty("--my", "-200px");
  };

  const goToDetail = () => onNavigateDetail("solution-detail", sol.slug);

  return (
    <BorderRotate
      onClick={goToDetail}
      className="group shrink-0 w-[84vw] max-w-[340px] sm:w-[380px] sm:max-w-[380px] lg:w-[42vw] lg:max-w-[560px] h-[550px] sm:h-[570px] lg:h-[78svh] snap-center cursor-pointer flex flex-col"
      animationMode="rotate-on-hover"
      animationSpeed={9}
      borderRadius={30}
      borderWidth={2}
      gradientColors={borderColors}
      backgroundColor="var(--glass-card-bg)"
    >
      <article
        onClick={goToDetail}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-full w-full glass-card grain rounded-[28px] overflow-hidden flex flex-col"
        style={{
          "--sa": accent,
          "--mx": "-200px",
          "--my": "-200px",
          contentVisibility: isVisible ? "visible" : "auto",
        } as CSSProperties}
      >
        {/* Liseré supérieur — teinte du secteur */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}b3, transparent)` }}
          aria-hidden
        />

        {/* Watermark géant — numéro de solution en bas */}
        <span
          className="pointer-events-none absolute -bottom-6 -right-4 z-0 select-none font-display text-[7rem] font-bold leading-none md:text-[9rem]"
          style={{ color: `color-mix(in srgb, ${accent} 9%, transparent)` }}
          aria-hidden
        >
          {num}
        </span>

        {/* Spot lumineux suivant le curseur */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(480px circle at var(--mx) var(--my), color-mix(in srgb, var(--sa) 18%, transparent), transparent 70%)",
          }}
          aria-hidden
        />

        {/* Visuel de fond — en-tête image premium minimaliste */}
        <div className="relative h-28 sm:h-32 lg:h-40 shrink-0 overflow-hidden" style={{ background: headerGradient }}>
          {/* Grille technique */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: headerGrid,
              backgroundSize: "24px 24px",
              maskImage: headerGridMask,
              WebkitMaskImage: headerGridMask,
              opacity: 0.5,
            }}
            aria-hidden
          />
          {/* Halo accent doux */}
          <div className="absolute inset-0" style={{ background: headerGlow }} aria-hidden />

          {/* Balayage lumineux (gelé si carte hors champ) */}
          {isVisible && (
            <motion.div
              initial={{ x: "-140%" }}
              animate={{ x: "140%" }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              className="pointer-events-none absolute inset-y-0 w-[45%]"
              style={{
                background: `linear-gradient(100deg, transparent, color-mix(in srgb, ${accent} 30%, transparent) 45%, transparent)`,
              }}
              aria-hidden
            />
          )}

          {/* Top row : pastille secteur + numéro fantôme */}
          <div className="absolute top-3 left-3.5 right-3.5 sm:top-3.5 sm:left-4 sm:right-4 z-20 flex items-start justify-between">
            <span
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border px-2.5 sm:px-3 py-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] backdrop-blur-md"
              style={chipStyle}
            >
              <span className="h-1 w-1 rotate-45" style={{ background: accent }} aria-hidden />
              <span style={{ color: accent }}>{sol.sector}</span>
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className="font-display text-3xl font-bold leading-none sm:text-4xl lg:text-5xl"
                style={{ color: `color-mix(in srgb, ${accent} 35%, transparent)` }}
              >
                /{num}
              </span>
              <span
                className="font-mono text-[9px] sm:text-[10px]"
                style={{ color: `color-mix(in srgb, ${accent} 65%, transparent)` }}
              >
                / {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Bottom row : statut déployé ou nouvelle offre + hover hint */}
          <div className="absolute bottom-2.5 left-3.5 right-3.5 sm:bottom-3 sm:left-4 sm:right-4 z-20 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F26D3D]" />
              {sol.statusBadge ?? "Cas d'usage type"}
            </span>
            <span
              className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ color: accent }}
            >
              {t("solutions.card.viewDetail")} ↗
            </span>
          </div>

          {/* Liseré de séparation en-tête / contenu */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent} 28%, transparent), transparent)`,
            }}
            aria-hidden
          />
        </div>

        {/* Contenu */}
        <div
          className="relative z-20 flex min-h-0 flex-1 flex-col overflow-hidden lg:overflow-y-auto lg:overscroll-contain p-4 sm:p-5 lg:p-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--glass-card-border)] [&::-webkit-scrollbar-track]:bg-transparent"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--glass-card-border) transparent" }}
        >
          <h2 className="font-display text-lg sm:text-xl lg:text-2xl font-bold tracking-tight mb-2 text-foreground transition-colors duration-300 group-hover:text-[var(--sa)] line-clamp-2">
            {sol.title}
          </h2>
          <div
            className="mb-2.5 sm:mb-3 h-px w-12"
            style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
            aria-hidden
          />
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4 flex-1 line-clamp-3 sm:line-clamp-4 lg:line-clamp-none">
            {sol.summary}
          </p>

          {/* Impact sectoriel ou Capacité & Méthode */}
          <div className="relative rounded-xl p-2.5 sm:p-3 lg:p-3.5 mb-3 sm:mb-4 flex items-start gap-2.5 sm:gap-3 overflow-hidden shrink-0" style={impactStyle}>
            <span className="absolute inset-y-2 left-0 w-0.5 rounded-full" style={{ background: accent }} aria-hidden />
            <span className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-lg border flex items-center justify-center mt-0.5" style={chipStyle}>
              <TrendingUp className="h-4 w-4 sm:h-4.5 sm:w-4.5" style={{ color: accent }} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">
                {sol.statusType === "new" ? (sol.impactLabel ?? "Capacité & Méthode") : t("common.impact")}
              </p>
              <p className="font-display text-xs sm:text-sm lg:text-base font-bold leading-snug line-clamp-2" style={{ color: accent }}>
                {sol.impact}
              </p>
              {sol.methodology && (
                <p className="mt-1 text-[10px] sm:text-[11px] leading-tight text-muted-foreground/80 font-mono line-clamp-2">
                  {sol.methodology}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4 shrink-0">
            {sol.tags.map((tag: string) => (
              <span
                key={tag}
                className="glass rounded-md px-1.5 sm:px-2 py-0.5 font-mono text-[9px] sm:text-[10px] text-muted-foreground transition-colors duration-300 hover:border-accent/30"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="border-t border-border/50 pt-2.5 sm:pt-3 mt-auto shrink-0">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateDetail("solution-detail", sol.slug);
              }}
              variant="outline"
              size="md"
              icon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}
              iconPosition="right"
              className="group/btn w-full min-h-[42px] sm:min-h-[44px]"
            >
              {t("solutions.card.cta")}
            </Button>
          </div>
        </div>
      </article>
    </BorderRotate>
  );
}
