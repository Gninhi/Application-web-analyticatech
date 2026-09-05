"use client";

import { type CSSProperties, useRef } from "react";
import { ArrowUpRight, Clock, Hash, User } from "lucide-react";
import { type BlogPostDTO, type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { BorderRotate } from "@/components/ui/animated-gradient-border";
import { formatPostDate } from "@/lib/utils/date";
import { tint, getCategoryAccent } from "@/lib/utils/colors";
import { ReportVisual } from "./ReportVisual";
import { CategoryPill } from "./CategoryPill";

export interface ReportCardProps {
  post: BlogPostDTO;
  index: number;
  total: number;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

/**
 * Carte rapport — grille premium alignée sur les cartes Solutions :
 * en-tête image (grille masquée + halo + balayage), numéro HUD, pastille
 * catégorie, métadonnées, titre, tags glass, pied "lire".
 */
export function ReportCard({
  post,
  index,
  total,
  onNavigateDetail,
}: ReportCardProps) {
  const { t, locale } = useI18n();
  const accent = getCategoryAccent(post.categoryKey, post.categoryLabel);
  const num = String(index + 1).padStart(2, "0");
  const borderColors = { primary: accent, secondary: tint(accent, 44), accent: tint(accent, 96) };

  const cardRectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    cardRectRef.current = e.currentTarget.getBoundingClientRect();
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = cardRectRef.current;
    if (!rect) return;
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    cardRectRef.current = null;
    const el = e.currentTarget;
    el.style.setProperty("--mx", "-200px");
    el.style.setProperty("--my", "-200px");
  };

  return (
    <BorderRotate
      className="h-full"
      animationMode="rotate-on-hover"
      animationSpeed={6}
      borderRadius={26}
      borderWidth={1}
      gradientColors={borderColors}
      backgroundColor="var(--glass-card-bg)"
    >
      <button
        type="button"
        onClick={() => onNavigateDetail("blog-detail", post.slug)}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-[25px] text-left glass-card grain focus-visible:outline-2 focus-visible:outline-[color:var(--ca)] focus-visible:outline-offset-2"
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

        {/* En-tête image */}
        <ReportVisual accent={accent} className="h-40 shrink-0 md:h-44">
          <div className="absolute top-4 left-5 right-5 z-20 flex items-start justify-between">
            <CategoryPill accent={accent} label={post.categoryLabel} />
            <div className="flex items-baseline gap-1.5">
              <span
                className="font-display text-4xl font-bold leading-none"
                style={{ color: `color-mix(in srgb, ${accent} 35%, transparent)` }}
              >
                /{num}
              </span>
              <span
                className="font-mono text-[10px]"
                style={{ color: `color-mix(in srgb, ${accent} 65%, transparent)` }}
              >
                /{String(total).padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="absolute bottom-4 left-5 right-5 z-20 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3" style={{ color: accent }} aria-hidden />
              {post.readingTime.includes("lecture") || post.readingTime.includes("read")
                ? post.readingTime
                : `${post.readingTime.replace(/\s*min.*/i, "")} ${t("common.read")}`}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3 w-3" style={{ color: accent }} aria-hidden />
              {post.author}
            </span>
          </div>
        </ReportVisual>

        {/* Liseré de séparation en-tête / contenu */}
        <div
          className="relative z-20 h-px shrink-0"
          style={{
            background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent} 28%, transparent), transparent)`,
          }}
          aria-hidden
        />

        {/* Corps */}
        <div className="relative z-20 flex min-h-0 flex-1 flex-col p-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {formatPostDate(post.date, locale)}
          </p>
          <h3 className="mb-2 font-display text-lg font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-[var(--ca)]">
            {post.title}
          </h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="glass inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors duration-300 hover:border-accent/30"
              >
                <Hash className="h-2.5 w-2.5" aria-hidden />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-end border-t border-border pt-3">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors duration-300 group-hover:text-[var(--ca)]">
              {t("common.readArticle")}
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: accent }}
                aria-hidden
              />
            </span>
          </div>
        </div>
      </button>
    </BorderRotate>
  );
}
