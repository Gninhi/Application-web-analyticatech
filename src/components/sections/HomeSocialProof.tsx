"use client";

import { m } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { formatPostDate } from "@/lib/utils/date";

interface HomeSocialProofProps {
  onNavigate: (view: ViewKey) => void;
}

/**
 * HomeSocialProof — Section "09 — INSIGHTS"
 *
 * Structure claire, compartimentée et hautement maintenable :
 *   1. Bloc Insights (1 article principal 7/12 + 2 articles secondaires 5/12)
 *   2. Ticker Boursier : Stack Technologique & Capacités IA (Défilement infini vers la gauche)
 */
export function HomeSocialProof({ onNavigate }: HomeSocialProofProps) {
  const { t, locale } = useI18n();
  const { blogPosts: BLOG_POSTS } = useAppContent();

  // Maximum 3 contenus d'insights éditoriaux
  const homeInsights = BLOG_POSTS.slice(0, 3);
  const featuredPost = homeInsights[0];
  const secondaryPosts = homeInsights.slice(1, 3);

  return (
    <section className="relative">
        <SectionContainer>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <SectionHeading
              tag={t("home.section.insights")}
              title={t("home.section.insights.title")}
              description={t("home.section.insights.desc")}
            />
            <Button
              onClick={() => onNavigate("blog")}
              variant="ghost"
              size="md"
              icon={<ArrowRight className="h-4 w-4" aria-hidden />}
              iconPosition="right"
              className="shrink-0"
            >
              {t("home.insights.all")}
            </Button>
          </div>

          {/* Grille éditoriale responsive */}
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            {/* Featured Post — grande carte */}
            {featuredPost && (
              <div className="lg:col-span-7 h-full">
                <m.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => onNavigate("blog")}
                  className="glass-strong rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-between group cursor-pointer border border-black/5 dark:border-white/10 hover:border-[#F26D3D]/40 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-600 dark:text-slate-400 mb-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#F26D3D]/10 text-accent-ink font-semibold border border-[#F26D3D]/20">
                        {featuredPost.categoryLabel || featuredPost.categoryKey}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-accent-ink" aria-hidden />
                        {formatPostDate(featuredPost.date, locale)}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-accent-ink transition-colors leading-snug mb-4">
                      {featuredPost.title}
                    </h3>

                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed mb-6 font-normal">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400">
                    <span>
                      {featuredPost.readingTime.includes("lecture") || featuredPost.readingTime.includes("read")
                        ? featuredPost.readingTime
                        : `${featuredPost.readingTime.replace(/\s*min.*/i, "")} ${t("common.read")}`}
                    </span>
                    <span className="text-accent-ink group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1.5 font-semibold">
                      {t("home.insights.read")} <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </m.article>
              </div>
            )}

            {/* Secondary Posts — 2 cartes secondaires */}
            <div className="lg:col-span-5 flex flex-col gap-6 h-full">
              {secondaryPosts.map((post, idx) => (
                <m.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (idx + 1) * 0.08 }}
                  onClick={() => onNavigate("blog")}
                  className="flex-1 glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between group cursor-pointer border border-black/5 dark:border-white/10 hover:border-[#F26D3D]/40 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-600 dark:text-slate-400 mb-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#F26D3D]/10 text-accent-ink font-semibold border border-[#F26D3D]/20">
                        {post.categoryLabel || post.categoryKey}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-accent-ink" aria-hidden />
                        {formatPostDate(post.date, locale)}
                      </span>
                    </div>

                    <h4 className="font-display text-base md:text-lg font-bold text-slate-900 dark:text-slate-50 group-hover:text-accent-ink transition-colors leading-snug mb-2.5">
                      {post.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed mb-4 font-normal">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
                    <span>
                      {post.readingTime.includes("lecture") || post.readingTime.includes("read")
                        ? post.readingTime
                        : `${post.readingTime.replace(/\s*min.*/i, "")} ${t("common.read")}`}
                    </span>
                    <span className="text-accent-ink group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1 font-semibold">
                      {t("home.insights.read")} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </m.article>
              ))}
            </div>
          </div>
        </SectionContainer>
      </section>
  );
}