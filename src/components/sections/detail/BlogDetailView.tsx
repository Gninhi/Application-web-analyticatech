"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import type { ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { Button } from "@/components/ui/button";
import { ContactCta } from "@/components/ui/ContactCta";
import { formatPostDate } from "@/lib/utils/date";
import { DetailNotFound } from "./DetailNotFound";

export interface BlogDetailViewProps {
  postSlug: string;
  onNavigate: (view: ViewKey) => void;
}

/**
 * BlogDetailView — page de détail d'un article ou rapport technique.
 * Résolue par slug (URL partageable), plus stable que l'UUID.
 */
export function BlogDetailView({ postSlug, onNavigate }: BlogDetailViewProps) {
  const { t, locale } = useI18n();
  const { blogPosts } = useAppContent();
  const post = blogPosts.find((p) => p.slug === postSlug);

  if (!post) {
    return (
      <div className="pt-28 md:pt-36 pb-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("blog")}
            icon={<ArrowLeft className="h-4 w-4" aria-hidden />}
            className="mb-8"
          >
            {`${t("common.back")} ${t("nav.blog")}`}
          </Button>
          <DetailNotFound
            label={t("detail.noData")}
            title={t("detail.unavailable.title")}
            message={t("detail.article.unavailable")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-20">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("blog")}
          icon={<ArrowLeft className="h-4 w-4" aria-hidden />}
          className="mb-8"
        >
          {`${t("common.back")} ${t("nav.blog")}`}
        </Button>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="rounded-full border border-[#F26D3D]/40 bg-[#F26D3D]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#F26D3D]">
                {post.categoryLabel}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {formatPostDate(post.date, locale)} ·{" "}
                {post.readingTime.includes("lecture") || post.readingTime.includes("read")
                  ? post.readingTime
                  : `${post.readingTime.replace(/\s*min.*/i, "")} ${t("common.read")}`}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {post.excerpt}
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Par {post.author}
            </p>
          </div>

          {/* Contenu */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              {t("common.context")}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {post.excerpt} {t("detail.article.body")}
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              {t("common.keyPoints")}
            </h2>
            <ul className="space-y-3 mb-6">
              {post.tags.map((tag: string) => (
                <li key={tag} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <Check className="h-5 w-5 text-[#4CAF50] shrink-0 mt-0.5" aria-hidden />
                  <span>
                    {locale === "fr"
                      ? `Approche ${tag} : méthodologie, outils et retour d'expérience`
                      : `${tag} approach: methodology, tools and field feedback`}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 px-2.5 py-1 font-mono text-[11px] text-slate-600 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <ContactCta question={t("detail.article.cta")} cta={t("common.contact")} onNavigate={onNavigate} />
        </motion.article>
      </div>
    </div>
  );
}
