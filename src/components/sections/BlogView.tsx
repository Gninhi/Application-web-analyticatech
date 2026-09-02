"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { FilterPill } from "@/components/interactive/FilterPill";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { getCategoryAccent } from "@/lib/utils/colors";
import { HeroCard } from "./blog/HeroCard";
import { ReportCard } from "./blog/ReportCard";

type Filter = string;

interface BlogViewProps {
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

/**
 * BlogView — Hub des rapports techniques, insights et analyses.
 * Orchestration modulaire :
 *  - En-tête de page standardisé
 *  - Barre d'onglets de filtrage par catégorie (accessible WAI-ARIA)
 *  - HeroCard (article à la une pleine largeur)
 *  - ReportCard (grille de rapports interactifs)
 */
export function BlogView({ onNavigateDetail }: BlogViewProps) {
  const { t } = useI18n();
  const { blogPosts: BLOG_POSTS, blogCategories: DB_CATEGORIES } = useAppContent();
  const [filter, setFilter] = useState<Filter>("all");
  const [, startTransition] = useTransition();

  const categories = useMemo(
    () => [
      { key: "all", label: t("blog.filter.all") },
      ...DB_CATEGORIES.map((c) => ({ key: c.key, label: c.label })),
    ],
    [DB_CATEGORIES, t]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.categoryKey === filter || p.categoryLabel === filter);
  }, [filter, BLOG_POSTS]);

  // Navigation clavier des onglets (WAI-ARIA tabs pattern)
  const handleTabKey = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, key: string) => {
      const idx = categories.findIndex((c) => c.key === key);
      if (idx === -1) return;
      let next: number;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          next = (idx + 1) % categories.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          next = (idx - 1 + categories.length) % categories.length;
          break;
        case "Home":
          e.preventDefault();
          next = 0;
          break;
        case "End":
          e.preventDefault();
          next = categories.length - 1;
          break;
        default:
          return;
      }
      const target = categories[next];
      startTransition(() => {
        setFilter(target.key);
      });
      requestAnimationFrame(() => {
        document.getElementById(`blog-tab-${target.key}`)?.focus();
      });
    },
    [categories, startTransition]
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="relative">
      {/* En-tête */}
      <section className="pt-32 md:pt-40 pb-10">
        <SectionContainer>
          <PageHeader
            kicker={t("blog.kicker")}
            title={t("blog.title1")}
            accent={t("blog.title2")}
            description={t("blog.desc")}
            className="max-w-3xl"
          />
        </SectionContainer>
      </section>

      {/* Filtres */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div
            className="flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label={t("blog.filter.aria")}
          >
            {categories.map((cat) => (
              <FilterPill
                key={cat.key}
                id={`blog-tab-${cat.key}`}
                active={filter === cat.key}
                aria-controls="blog-results"
                tabIndex={filter === cat.key ? 0 : -1}
                onClick={() => startTransition(() => setFilter(cat.key))}
                onKeyDown={(e) => handleTabKey(e, cat.key)}
                dotColor={cat.key === "all" ? undefined : getCategoryAccent(cat.key, cat.label)}
              >
                {cat.label}
              </FilterPill>
            ))}
            <span className="ml-auto font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {filtered.length} {filtered.length > 1 ? t("blog.filter.entries.other") : t("blog.filter.entries.one")}
            </span>
          </div>
        </div>
      </section>

      {/* Contenu filtré — panneau contrôlé par les onglets catégories */}
      <div role="tabpanel" id="blog-results" aria-labelledby={`blog-tab-${filter}`}>
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            {/* Article à la une — hero pleine largeur */}
            <AnimatePresence mode="wait">
              {featured && (
                <motion.div
                  key={featured.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <HeroCard
                    post={featured}
                    index={0}
                    total={filtered.length}
                    onNavigateDetail={onNavigateDetail}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grille d'articles */}
            {rest.length > 0 && (
              <motion.div layout className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {rest.map((post, i) => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      className="h-full"
                    >
                      <ReportCard
                        post={post}
                        index={i + 1}
                        total={filtered.length}
                        onNavigateDetail={onNavigateDetail}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="font-mono text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {t("blog.empty")}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}