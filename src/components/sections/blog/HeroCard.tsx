"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { type BlogPostDTO } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { BorderRotate } from "@/components/ui/animated-gradient-border";
import { formatPostDate } from "@/lib/utils/date";
import { tint, getCategoryAccent } from "@/lib/utils/colors";
import { viewToPath } from "@/lib/navigation/routes";
import { CategoryPill } from "./CategoryPill";
import { InsightCover } from "./InsightCover";
import { formatReadingTime } from "./reading-time";

export interface HeroCardProps {
  post: BlogPostDTO;
}

/**
 * Article à la une — grande carte en verre : texte à gauche (catégorie, titre,
 * résumé, date et temps de lecture), couverture propre à la catégorie à droite.
 * Lien réel vers l'article (clic du milieu, indexation).
 */
export function HeroCard({ post }: HeroCardProps) {
  const { t, locale } = useI18n();
  const accent = getCategoryAccent(post.categoryKey, post.categoryLabel);
  const borderColors = { primary: accent, secondary: tint(accent, 44), accent: tint(accent, 96) };

  return (
    <BorderRotate
      animationMode="rotate-on-hover"
      animationSpeed={9}
      borderRadius={30}
      borderWidth={1.5}
      gradientColors={borderColors}
      backgroundColor="var(--glass-card-bg)"
    >
      <Link
        href={viewToPath("blog-detail", post.slug, locale)}
        className="group relative grid overflow-hidden rounded-[28px] glass-card grain lg:grid-cols-[1.15fr_1fr] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-ink)]"
      >
        <div className="relative z-10 flex flex-col gap-5 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryPill accent={accent} label={post.categoryLabel} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
              {t("blog.featured")}
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
            {post.title}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">{post.excerpt}</p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-5">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400">
              <span>{formatPostDate(post.date, locale)}</span>
              <span className="h-px w-4 bg-border" aria-hidden />
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent-ink" aria-hidden />
                {formatReadingTime(post.readingTime, t("common.read"))}
              </span>
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent-ink">
              {t("common.readArticle")}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </span>
          </div>
        </div>

        <InsightCover
          categoryKey={post.categoryKey}
          categoryLabel={post.categoryLabel}
          className="min-h-[200px] border-t border-border/60 sm:min-h-[240px] lg:min-h-full lg:border-t-0 lg:border-l"
        />
      </Link>
    </BorderRotate>
  );
}
