"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { type BlogPostDTO } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { formatPostDate } from "@/lib/utils/date";
import { viewToPath } from "@/lib/navigation/routes";
import { InsightCover } from "./InsightCover";
import { formatReadingTime } from "./reading-time";

export interface InsightRowProps {
  post: BlogPostDTO;
}

/**
 * Ligne d'article — liste éditoriale en verre : vignette de catégorie, catégorie et date,
 * titre, une phrase de résumé, temps de lecture et flèche. Se parcourt d'un coup d'œil.
 */
export function InsightRow({ post }: InsightRowProps) {
  const { t, locale } = useI18n();

  return (
    <Link
      href={viewToPath("blog-detail", post.slug, locale)}
      className="group relative grid grid-cols-[4.5rem_1fr] items-start gap-4 rounded-2xl glass-card p-4 transition-colors duration-300 hover:border-[color:color-mix(in_srgb,var(--accent-ink)_40%,transparent)] sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-6 sm:p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-ink)]"
    >
      <InsightCover
        categoryKey={post.categoryKey}
        categoryLabel={post.categoryLabel}
        compact
        className="aspect-square rounded-xl border border-border/60 sm:aspect-[4/3]"
      />

      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className="basis-full text-accent-ink sm:basis-auto">{post.categoryLabel}</span>
          <span className="hidden h-px w-3 bg-border sm:inline-block" aria-hidden />
          <span className="text-slate-600 dark:text-slate-400">{formatPostDate(post.date, locale)}</span>
          <span className="h-px w-3 bg-border" aria-hidden />
          <span className="text-slate-600 dark:text-slate-400">{formatReadingTime(post.readingTime, t("common.read"))}</span>
        </p>
        <h3 className="mt-1.5 font-display text-base font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-accent-ink sm:text-lg">
          {post.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">{post.excerpt}</p>
      </div>

      <ArrowUpRight
        className="hidden h-5 w-5 shrink-0 text-accent-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block"
        aria-hidden
      />
    </Link>
  );
}
