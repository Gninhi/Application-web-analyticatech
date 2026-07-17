"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import type { ViewKey } from "@/lib/data";
import { useI18n, useLocalizedData } from "@/lib/i18n";
import { SnakeButton } from "@/components/SnakeButton";
import { SERVICE_ICONS, getServiceBgImage, getServiceMeshOverlay } from "@/lib/services";

interface ServiceDetailViewProps {
  serviceIndex: string;
  onNavigate: (view: ViewKey) => void;
}

/**
 * ServiceDetailView — page de détail d'un service.
 * Accessible via ViewKey "service-detail" + serviceIndex.
 */
export function ServiceDetailView({ serviceIndex, onNavigate }: ServiceDetailViewProps) {
  const { t } = useI18n();
  const { SERVICES } = useLocalizedData();
  const service = SERVICES.find((s) => s.index === serviceIndex) ?? SERVICES[0];
  const IconComponent = SERVICE_ICONS[service.icon] ?? SERVICE_ICONS.BrainCircuit;
  const bgImage = getServiceBgImage(service.index);
  const meshOverlay = getServiceMeshOverlay(service.index);

  return (
    <div className="pt-28 md:pt-36 pb-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* Retour */}
        <SnakeButton
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("services")}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {`${t("common.back")} ${t("nav.services")}`}
        </SnakeButton>

        {/* Hero du service */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden glass-card mb-10"
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} aria-hidden />
          <div className="absolute inset-0" style={{ background: meshOverlay }} aria-hidden />
          <div className="absolute inset-0 bg-black/40" aria-hidden />

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 backdrop-blur-sm">
                <IconComponent className="h-8 w-8 text-[#F26D3D]" aria-hidden />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#F26D3D]">
                  Service {service.index} — {service.tagline}
                </p>
                <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
                  {service.title}
                </h1>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description détaillée */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card rounded-2xl p-6 md:p-8 mb-8"
        >
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            {t("common.presentation")}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg mb-6">
            {service.description}
          </p>

          <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#F26D3D] mb-3">
            {t("common.techStack")}
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {service.technologies.map((tech) => (
              <span key={tech} className="rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 px-2.5 py-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                {tech}
              </span>
            ))}
          </div>

          <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#F26D3D] mb-3">
            {t("common.metrics")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {service.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
                <p className="font-display text-2xl font-bold text-[#F26D3D]">{m.value}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 md:p-8 text-center"
        >
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Prêt à démarrer ce service pour votre organisation ?
          </p>
          <SnakeButton variant="primary" size="lg" onClick={() => onNavigate("contact")} className="neon-glow">
            {t("nav.cta")}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </SnakeButton>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * SolutionDetailView — page de détail d'une solution.
 */
interface SolutionDetailViewProps {
  solutionId: string;
  onNavigate: (view: ViewKey) => void;
}

export function SolutionDetailView({ solutionId, onNavigate }: SolutionDetailViewProps) {
  const { t } = useI18n();
  const { SOLUTIONS } = useLocalizedData();
  const solution = SOLUTIONS.find((s) => s.id === solutionId) ?? SOLUTIONS[0];

  return (
    <div className="pt-28 md:pt-36 pb-20">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <SnakeButton variant="ghost" size="sm" onClick={() => onNavigate("solutions")} className="mb-8">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {`${t("common.back")} ${t("nav.solutions")}`}
        </SnakeButton>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-8 md:p-12 mb-8"
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#F26D3D] mb-3">
            {solution.sector}
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-4">
            {solution.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg mb-6">
            {solution.summary}
          </p>

          <div className="rounded-xl border border-[#F26D3D]/25 bg-[#F26D3D]/5 p-4 mb-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
              {t("common.impact")}
            </p>
            <p className="font-display text-xl font-bold text-[#F26D3D]">{solution.impact}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {solution.tags.map((tag: string) => (
              <span key={tag} className="rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 px-2.5 py-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 md:p-8 text-center"
        >
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Cette solution correspond à votre besoin ?
          </p>
          <SnakeButton variant="primary" size="lg" onClick={() => onNavigate("contact")} className="neon-glow">
            {t("common.contact")}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </SnakeButton>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * BlogDetailView — page de détail d'un article.
 */
interface BlogDetailViewProps {
  postId: string;
  onNavigate: (view: ViewKey) => void;
}

export function BlogDetailView({ postId, onNavigate }: BlogDetailViewProps) {
  const { t } = useI18n();
  const { BLOG_POSTS } = useLocalizedData();
  const post = BLOG_POSTS.find((p) => p.id === postId) ?? BLOG_POSTS[0];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="pt-28 md:pt-36 pb-20">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <SnakeButton variant="ghost" size="sm" onClick={() => onNavigate("blog")} className="mb-8">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {`${t("common.back")} ${t("nav.blog")}`}
        </SnakeButton>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="rounded-full border border-[#F26D3D]/40 bg-[#F26D3D]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#F26D3D]">
                {post.category}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {formatDate(post.date)} · {post.readingTime}
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

          {/* Contenu (placeholder — l'article complet serait ici) */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              {t("common.context")}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {post.excerpt} Dans cet article, nous explorons en détail les enjeux techniques,
              les choix d'architecture et les leçons apprises sur le terrain. Notre objectif :
              fournir un cadre actionnable pour vos propres projets.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              {t("common.keyPoints")}
            </h2>
            <ul className="space-y-3 mb-6">
              {post.tags.map((tag: string) => (
                <li key={tag} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <Check className="h-5 w-5 text-[#4CAF50] shrink-0 mt-0.5" aria-hidden />
                  <span>Approche {tag} : méthodologie, outils et retour d'expérience</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span key={tag} className="rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 px-2.5 py-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="glass-card rounded-2xl p-6 md:p-8 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Cet article vous a intéressé ? Échangeons sur votre projet.
            </p>
            <SnakeButton variant="primary" size="lg" onClick={() => onNavigate("contact")} className="neon-glow">
              {t("common.contact")}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </SnakeButton>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
