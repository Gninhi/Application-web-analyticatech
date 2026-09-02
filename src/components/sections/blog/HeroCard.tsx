"use client";

import { type CSSProperties } from "react";
import { ArrowUpRight, Clock, Newspaper, User } from "lucide-react";
import { type BlogPostDTO, type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { BorderRotate } from "@/components/ui/animated-gradient-border";
import { formatPostDate } from "@/lib/utils/date";
import { tint, getCategoryAccent } from "@/lib/utils/colors";
import { ReportVisual } from "./ReportVisual";
import { CategoryPill } from "./CategoryPill";

export interface HeroCardProps {
  post: BlogPostDTO;
  index: number;
  total: number;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

/**
 * Carte à la une — hero pleine largeur, contenu à gauche, "couverture"
 * de rapport à droite (grille masquée, halo, balayage, numéro géant).
 */
export function HeroCard({
  post,
  index,
  total,
  onNavigateDetail,
}: HeroCardProps) {
  const { t, locale } = useI18n();
  const accent = getCategoryAccent(post.categoryKey, post.categoryLabel);
  const num = String(index + 1).padStart(2, "0");
  const borderColors = { primary: accent, secondary: tint(accent, 44), accent: tint(accent, 96) };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--mx", "-200px");
    el.style.setProperty("--my", "-200px");
  };

  return (
    <BorderRotate
      animationSpeed={9}
      borderRadius={30}
      borderWidth={1.5}
      gradientColors={borderColors}
      backgroundColor="var(--glass-card-bg)"
    >
      <button
        type="button"
        onClick={() => onNavigateDetail("blog-detail", post.slug)}
        aria-label={`${t("common.read")} : ${post.title}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative block w-full overflow-hidden rounded-[28px] text-left glass-card grain flex flex-col lg:grid lg:grid-cols-[1.05fr_1fr] focus-visible:outline-2 focus-visible:outline-[color:var(--ca)] focus-visible:outline-offset-2"
        style={{ "--ca": accent, "--mx": "-200px", "--my": "-200px" } as CSSProperties}
      >
        {/* Liseré supérieur — teinte de la catégorie */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}b3, transparent)` }}
          aria-hidden
        />

        {/* Spot lumineux suivant le curseur */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(480px circle at var(--mx) var(--my), color-mix(in srgb, var(--ca) 18%, transparent), transparent 70%)",
          }}
          aria-hidden
        />

        {/* Contenu */}
        <div className="relative z-20 flex flex-col justify-center gap-4 p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <CategoryPill accent={accent} label={post.categoryLabel} />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {t("blog.featured")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>{formatPostDate(post.date, locale)}</span>
            <span className="h-px w-4 bg-border" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3" style={{ color: accent }} aria-hidden />
              {post.readingTime}
            </span>
            <span className="h-px w-4 bg-border" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3 w-3" style={{ color: accent }} aria-hidden />
              {post.author}
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight leading-tight text-foreground transition-colors duration-300 group-hover:text-[var(--ca)] md:text-4xl">
            {post.title}
          </h2>

          <div
            className="h-px w-16"
            style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
            aria-hidden
          />

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {post.excerpt}
          </p>

          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-foreground transition-colors duration-300 group-hover:text-[var(--ca)]">
            {t("common.read")}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: accent }}
              aria-hidden
            />
          </span>
        </div>

        {/* Couverture du rapport */}
        <ReportVisual accent={accent} className="min-h-[260px] lg:min-h-full">
          <span
            className="absolute top-5 left-5 z-20 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: `color-mix(in srgb, ${accent} 65%, transparent)` }}
          >
            REPORT_{post.id.slice(0, 4).toUpperCase()}
          </span>
          <Newspaper
            className="absolute top-5 right-5 z-20 h-4 w-4"
            style={{ color: `color-mix(in srgb, ${accent} 35%, transparent)` }}
            aria-hidden
          />
          <div className="absolute bottom-5 left-5 z-20 flex max-w-[60%] flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="glass rounded-md px-2 py-1 font-mono text-[10px] text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
          <div className="absolute bottom-4 right-6 z-20 flex items-baseline gap-1.5">
            <span
              className="font-display text-7xl font-bold leading-none md:text-8xl"
              style={{ color: `color-mix(in srgb, ${accent} 30%, transparent)` }}
            >
              /{num}
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: `color-mix(in srgb, ${accent} 65%, transparent)` }}
            >
              /{String(total).padStart(2, "0")}
            </span>
          </div>
        </ReportVisual>
      </button>
    </BorderRotate>
  );
}
