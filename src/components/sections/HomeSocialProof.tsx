"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { Marquee } from "@/components/interactive/Marquee";
import { MovingButton } from "@/components/interactive/MovingButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { BorderRotate } from "@/components/ui/animated-gradient-border";

interface HomeSocialProofProps {
  onNavigate: (view: ViewKey) => void;
}

/**
 * HomeSocialProof — bloc "08 — INSIGHTS + preuve sociale" de l'accueil
 * (marquees mots-clés/clients, 3 cartes insights, témoignages).
 * Extraite dans un chunk séparé : les marquees et bordures animées
 * (BorderRotate) sont coûteux à l'hydration, inutiles au premier paint.
 */
export function HomeSocialProof({ onNavigate }: HomeSocialProofProps) {
  const { t } = useI18n();
  const {
    clientLogos: DB_CLIENTS,
    marqueeKeywords: MARQUEE_KEYWORDS,
    testimonials: TESTIMONIALS,
    blogPosts: BLOG_POSTS,
  } = useAppContent();

  // Clients affichés dans le signal de confiance
  const displayClients = DB_CLIENTS.length > 0 ? DB_CLIENTS : [];

  // Maximum 3 contenus d'insights (Blueprint 08)
  const homeInsights = BLOG_POSTS.slice(0, 3);

  return (
    <div className="space-y-24 md:space-y-32">
      {/* ============ BANDEAU DÉFILANT (MOTS-CLÉS SIGNATURE) ============ */}
      <Marquee
        items={MARQUEE_KEYWORDS}
        direction="right"
        speed={30}
        className="border-y border-black/10 dark:border-white/10 py-3"
        renderItem={(item) => (
          <span className="flex items-center gap-4 px-4">
            <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100/80">
              {item as string}
            </span>
            <span className="text-[#F26D3D] text-xs" aria-hidden>●</span>
          </span>
        )}
      />

      {/* ============ 08 — INSIGHTS (MAX 3 CARTES BLUEPRINT) ============ */}
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

          <div className="grid gap-6 md:grid-cols-3">
            {homeInsights.map((post, idx) => (
              <BorderRotate
                key={post.id}
                className="group cursor-pointer h-full"
                animationSpeed={8}
                borderRadius={26}
                borderWidth={2}
                gradientColors={{ primary: "#F26D3D", secondary: "#ffb26a", accent: "#03318C" }}
                backgroundColor="var(--glass-card-bg)"
              >
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onClick={() => onNavigate("blog")}
                  className="glass-card rounded-3xl p-6 h-full flex flex-col justify-between"
                >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#F26D3D]/10 text-[#F26D3D] font-bold">
                      {post.categoryLabel || post.categoryKey}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden />
                      {post.date}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 group-hover:text-[#F26D3D] transition-colors leading-snug mb-3">
                    {post.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>{t("home.insights.reading")} {post.readingTime}</span>
                  <span className="text-[#F26D3D] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                    {t("home.insights.read")} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.article>
              </BorderRotate>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ============ TÉMOIGNAGES CLIENTS ============ */}
      <section className="relative">
        <SectionContainer>
          <div className="mb-8">
            <Marquee
              items={displayClients}
              speed={30}
              className="py-3"
              renderItem={(item) => {
                const client = item as { name: string; sector: string };
                return (
                  <span className="group flex items-center gap-3 px-6">
                    <span className="font-display text-lg md:text-xl font-bold tracking-tight text-slate-800 dark:text-slate-300 group-hover:text-[#F26D3D] transition-colors whitespace-nowrap">
                      {client.name}
                    </span>
                    {client.sector && (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-[#F26D3D] transition-colors whitespace-nowrap">
                        {client.sector}
                      </span>
                    )}
                    <span className="text-[#F26D3D]/40 text-xs ml-2" aria-hidden>●</span>
                  </span>
                );
              }}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((tItem, i) => (
              <BorderRotate
                key={i}
                className="group h-full"
                animationMode="rotate-on-hover"
                animationSpeed={6}
                borderRadius={18}
                borderWidth={2}
                gradientColors={{ primary: "#F26D3D", secondary: "#ffb26a", accent: "#03318C" }}
                backgroundColor="var(--glass-card-bg)"
              >
                <motion.figure
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="glass-card rounded-2xl p-6 h-full flex flex-col justify-between"
                >
                <blockquote className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  &ldquo;{tItem.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-black/10 dark:border-white/10">
                  <p className="font-display font-bold text-slate-900 dark:text-slate-100">{tItem.author}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {tItem.role} · {tItem.company}
                  </p>
                </figcaption>
              </motion.figure>
              </BorderRotate>
            ))}
          </div>
        </SectionContainer>
      </section>
    </div>
  );
}