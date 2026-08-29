"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import type { ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { MovingButton } from "@/components/interactive/MovingButton";
import { SERVICE_ICONS, getServiceBgImage, getServiceMeshOverlay } from "@/lib/content/services";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactCta } from "@/components/ui/ContactCta";

interface ServiceDetailViewProps {
  serviceIndex: string;
  onNavigate: (view: ViewKey) => void;
}

/** Encart "introuvable" réutilisé par les trois vues de détail. */
function DetailNotFound({ label, title, message }: { label: string; title: string; message: string }) {
  return (
    <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
      <p className="font-mono text-[11px] uppercase tracking-widest text-[#F26D3D] mb-3">{label}</p>
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}

/**
 * ServiceDetailView — page de détail d'un service.
 * Accessible via ViewKey "service-detail" + serviceIndex.
 */
export function ServiceDetailView({ serviceIndex, onNavigate }: ServiceDetailViewProps) {
  const { t } = useI18n();
  const { services } = useAppContent();
  const normalizedIndex = (serviceIndex ?? "").trim().padStart(2, "0");
  const service = services.find((s) => s.index === serviceIndex || s.index === normalizedIndex);
  const [persona, setPersona] = useState<"ceo" | "architect" | "operational" | null>(null);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      try {
        const stored = localStorage.getItem("analyticatech-persona");
        if (stored === "ceo" || stored === "architect" || stored === "operational") {
          setPersona(stored);
        }
      } catch {
        // Ignorer si indisponible
      }
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!service) {
    return (
      <div className="pt-28 md:pt-36 pb-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <MovingButton variant="ghost" size="sm" onClick={() => onNavigate("services")} className="mb-8">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {`${t("common.back")} ${t("nav.services")}`}
          </MovingButton>
          <DetailNotFound
            label={t("detail.noData")}
            title={t("detail.unavailable.title")}
            message={t("detail.service.unavailable")}
          />
        </div>
      </div>
    );
  }

  const IconComponent = SERVICE_ICONS[service.iconKey] ?? SERVICE_ICONS.BrainCircuit;
  const bgImage = service.bgImagePath ?? getServiceBgImage(service.index);
  const meshOverlay = service.meshOverlay ?? getServiceMeshOverlay(service.index);

  return (
    <div className="pt-28 md:pt-36 pb-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* Retour */}
        <MovingButton
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("services")}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {`${t("common.back")} ${t("nav.services")}`}
        </MovingButton>

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
                  {t("detail.service.label")} {service.index} — {service.tagline}
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

          {persona && service.persona && service.persona[persona] && (
            <div className="mt-6 glass-card rounded-2xl p-5 mb-6">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#F26D3D] mb-3">
                {t("detail.persona.title")} ({t(`services.persona.${persona}-label`)})
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                {service.persona[persona]}
              </p>
            </div>
          )}

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
        <ContactCta question={t("detail.service.cta")} cta={t("nav.cta")} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

/**
 * SolutionDetailView — page de détail d'une solution.
 * Résolue par slug (URL partageable), plus stable que l'UUID.
 */
interface SolutionDetailViewProps {
  solutionSlug: string;
  onNavigate: (view: ViewKey) => void;
}

export function SolutionDetailView({ solutionSlug, onNavigate }: SolutionDetailViewProps) {
  const { t } = useI18n();
  const { solutions } = useAppContent();
  const solution = solutions.find((s) => s.slug === solutionSlug);

  if (!solution) {
    return (
      <div className="pt-28 md:pt-36 pb-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <MovingButton variant="ghost" size="sm" onClick={() => onNavigate("solutions")} className="mb-8">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {`${t("common.back")} ${t("nav.solutions")}`}
          </MovingButton>
          <DetailNotFound
            label={t("detail.noData")}
            title={t("detail.unavailable.title")}
            message={t("detail.solution.unavailable")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-20">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <MovingButton variant="ghost" size="sm" onClick={() => onNavigate("solutions")} className="mb-8">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {`${t("common.back")} ${t("nav.solutions")}`}
        </MovingButton>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-8 md:p-12 mb-8"
        >
          <PageHeader
            kicker={solution.sector}
            title={solution.title}
            gradient
            description={solution.summary}
            size="md"
            className="mb-6"
          />

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

        <ContactCta question={t("detail.solution.cta")} cta={t("common.contact")} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

/**
 * BlogDetailView — page de détail d'un article.
 * Résolue par slug (URL partageable), plus stable que l'UUID.
 */
interface BlogDetailViewProps {
  postSlug: string;
  onNavigate: (view: ViewKey) => void;
}

export function BlogDetailView({ postSlug, onNavigate }: BlogDetailViewProps) {
  const { t, locale } = useI18n();
  const { blogPosts } = useAppContent();
  const post = blogPosts.find((p) => p.slug === postSlug);

  if (!post) {
    return (
      <div className="pt-28 md:pt-36 pb-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <MovingButton variant="ghost" size="sm" onClick={() => onNavigate("blog")} className="mb-8">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {`${t("common.back")} ${t("nav.blog")}`}
          </MovingButton>
          <DetailNotFound
            label={t("detail.noData")}
            title={t("detail.unavailable.title")}
            message={t("detail.article.unavailable")}
          />
        </div>
      </div>
    );
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="pt-28 md:pt-36 pb-20">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <MovingButton variant="ghost" size="sm" onClick={() => onNavigate("blog")} className="mb-8">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {`${t("common.back")} ${t("nav.blog")}`}
        </MovingButton>

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
              {post.excerpt} {t("detail.article.body")}
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              {t("common.keyPoints")}
            </h2>
            <ul className="space-y-3 mb-6">
              {post.tags.map((tag: string) => (
                <li key={tag} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <Check className="h-5 w-5 text-[#4CAF50] shrink-0 mt-0.5" aria-hidden />
                  <span>{locale === "fr" ? `Approche ${tag} : méthodologie, outils et retour d'expérience` : `${tag} approach: methodology, tools and field feedback`}</span>
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
          <ContactCta question={t("detail.article.cta")} cta={t("common.contact")} onNavigate={onNavigate} />
        </motion.article>
      </div>
    </div>
  );
}
