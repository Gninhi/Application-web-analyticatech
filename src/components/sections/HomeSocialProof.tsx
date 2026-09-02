"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Quote } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { StockTicker } from "@/components/interactive/StockTicker";
import { MovingButton } from "@/components/interactive/MovingButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { formatPostDate } from "@/lib/utils/date";

interface HomeSocialProofProps {
  onNavigate: (view: ViewKey) => void;
}

/**
 * HomeSocialProof — Section "09 — INSIGHTS & TÉMOIGNAGES"
 *
 * Structure claire, compartimentée et hautement maintenable :
 *   1. Bloc Insights (1 article principal 7/12 + 2 articles secondaires 5/12)
 *   2. Ticker Boursier 1 : Stack Technologique & Capacités IA (Défilement infini vers la gauche)
 *   3. Bloc Témoignages Clients (grille 3 colonnes stable avec citations isolées)
 *   4. Ticker Boursier 2 : Entreprises Partenaires & Déploiements (Défilement infini vers la droite)
 *
 * Les deux bandeaux utilisent le composant unifié `StockTicker` pour garantir une taille,
 * une hauteur, une vitesse et une fluidité 100% identiques et centralisées.
 */
export function HomeSocialProof({ onNavigate }: HomeSocialProofProps) {
  const { t, locale } = useI18n();
  const {
    clientLogos: DB_CLIENTS,
    marqueeKeywords: MARQUEE_KEYWORDS,
    testimonials: TESTIMONIALS,
    blogPosts: BLOG_POSTS,
  } = useAppContent();

  const displayClients = DB_CLIENTS.length > 0 ? DB_CLIENTS : [];

  // Maximum 3 contenus d'insights éditoriaux
  const homeInsights = BLOG_POSTS.slice(0, 3);
  const featuredPost = homeInsights[0];
  const secondaryPosts = homeInsights.slice(1, 3);

  return (
    <div className="space-y-16 md:space-y-24">
      {/* ============ 01 — INSIGHTS : Featured (7/12) + Secondary (5/12) ============ */}
      <section className="relative">
        <SectionContainer>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <SectionHeading
              tag={t("home.section.insights")}
              title={t("home.section.insights.title")}
              description={t("home.section.insights.desc")}
            />
            <MovingButton
              onClick={() => onNavigate("blog")}
              variant="ghost"
              size="md"
              className="shrink-0"
            >
              {t("home.insights.all")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </MovingButton>
          </div>

          {/* Grille éditoriale responsive */}
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            {/* Featured Post — grande carte */}
            {featuredPost && (
              <div className="lg:col-span-7 h-full">
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => onNavigate("blog")}
                  className="glass-strong rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-between group cursor-pointer border border-black/5 dark:border-white/10 hover:border-[#F26D3D]/40 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#F26D3D]/10 text-[#F26D3D] font-bold border border-[#F26D3D]/20">
                        {featuredPost.categoryLabel || featuredPost.categoryKey}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#F26D3D]" aria-hidden />
                        {formatPostDate(featuredPost.date, locale)}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-[#F26D3D] transition-colors leading-snug mb-4">
                      {featuredPost.title}
                    </h3>

                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed mb-6 font-normal">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400">
                    <span>
                      {t("home.insights.reading")} {featuredPost.readingTime}
                    </span>
                    <span className="text-[#F26D3D] group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1.5 font-bold">
                      {t("home.insights.read")} <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </motion.article>
              </div>
            )}

            {/* Secondary Posts — 2 cartes secondaires */}
            <div className="lg:col-span-5 flex flex-col gap-6 h-full">
              {secondaryPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (idx + 1) * 0.08 }}
                  onClick={() => onNavigate("blog")}
                  className="flex-1 glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between group cursor-pointer border border-black/5 dark:border-white/10 hover:border-[#F26D3D]/40 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#F26D3D]/10 text-[#F26D3D] font-bold border border-[#F26D3D]/20">
                        {post.categoryLabel || post.categoryKey}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-[#F26D3D]" aria-hidden />
                        {formatPostDate(post.date, locale)}
                      </span>
                    </div>

                    <h4 className="font-display text-base md:text-lg font-bold text-slate-900 dark:text-slate-50 group-hover:text-[#F26D3D] transition-colors leading-snug mb-2.5">
                      {post.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed mb-4 font-normal">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
                    <span>
                      {t("home.insights.reading")} {post.readingTime}
                    </span>
                    <span className="text-[#F26D3D] group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1 font-bold">
                      {t("home.insights.read")} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ============ 02 — BANDEAU TICKER 1 : TECH & CAPABILITIES (STYLE BOURSE) ============ */}
      <StockTicker
        type="tech"
        keywords={MARQUEE_KEYWORDS}
        direction="left"
        speed={70}
      />

      {/* ============ 03 — TÉMOIGNAGES CLIENTS & AVIS ============ */}
      <section className="relative">
        <SectionContainer>
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] font-bold">
              {t("home.section.testimonials")}
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2">
              {t("home.testimonials.title")}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {t("home.testimonials.desc")}
            </p>
          </div>

          {/* Grille responsive de cartes de témoignages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((tItem, i) => (
              <motion.figure
                key={tItem.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between h-full border border-black/5 dark:border-white/10 hover:border-[#F26D3D]/30 transition-all duration-300 group"
              >
                <div>
                  <Quote className="h-6 w-6 text-[#F26D3D]/40 mb-4 group-hover:text-[#F26D3D] transition-colors" aria-hidden />
                  <blockquote className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal mb-6">
                    &ldquo;{tItem.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="pt-4 border-t border-black/10 dark:border-white/10">
                  <p className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {tItem.author}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">
                    {tItem.role} · {tItem.company}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ============ 04 — BANDEAU TICKER 2 : CLIENTS & PARTENAIRES (STYLE BOURSE) ============ */}
      <StockTicker
        type="clients"
        clients={displayClients}
        direction="right"
        speed={80}
      />
    </div>
  );
}