"use client";

import { m } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Building2,
  Workflow,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  FileCheck2,
} from "lucide-react";
import type { ViewKey } from "@/types/content";
import type { SolutionDetailData } from "@/types/solution-detail";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { ContactCta } from "@/components/ui/ContactCta";
import { VerticalSectionNav, type VerticalNavItem } from "@/components/ui/VerticalSectionNav";
import { IconBadge } from "@/components/ui/IconBadge";

export interface SolutionDetailTemplateProps {
  data: SolutionDetailData;
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail?: (view: ViewKey, id: string) => void;
}

/**
 * Template de vue de détail des solutions (projets en cours et pistes).
 * Bithématisme intégral (clair/sombre), libellés traduits (FR/EN) :
 * Problème → Fonctionnement → État du projet → Limites & Prérequis → Services liés.
 */
export function SolutionDetailTemplate({
  data,
  onNavigate,
  onNavigateDetail,
}: SolutionDetailTemplateProps) {
  const { t } = useI18n();

  const handleLinkClick = (resource: SolutionDetailData["relatedResources"][0]) => {
    if (onNavigateDetail) {
      onNavigateDetail(resource.targetViewKey, resource.targetId);
    } else {
      onNavigate(resource.targetViewKey);
    }
  };

  const navItems: VerticalNavItem[] = [
    {
      id: "probleme",
      number: "01",
      title: t("solutions.detail.nav.problem"),
      subtitle: t("solutions.detail.nav.problem.sub"),
    },
    {
      id: "approche",
      number: "02",
      title: t("solutions.detail.nav.approach"),
      subtitle: t("solutions.detail.nav.approach.sub"),
    },
    {
      id: "mesures",
      number: "03",
      title: t("solutions.detail.nav.status"),
      subtitle: t("solutions.detail.nav.status.sub"),
    },
    {
      id: "limites",
      number: "04",
      title: t("solutions.detail.nav.limits"),
      subtitle: t("solutions.detail.nav.limits.sub"),
    },
    {
      id: "ressources",
      number: "05",
      title: t("solutions.detail.nav.links"),
      subtitle: t("solutions.detail.nav.links.sub"),
    },
  ];

  return (
    <div className="pt-28 md:pt-36 pb-24 text-slate-900 dark:text-slate-100 selection:bg-[#F26D3D]/30 selection:text-accent-ink">
      <div className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-6 space-y-12">
        {/* ================= BREADCRUMB & RETOUR ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("solutions")}
            icon={<ArrowLeft className="h-4 w-4" aria-hidden />}
            className="group"
          >
            <span>
              {t("common.back")} {t("nav.solutions")}
            </span>
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-foreground uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F26D3D]" />
              {data.statusBadge ?? t("solutions.detail.status.default")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F26D3D]/30 bg-[#F26D3D]/10 px-3.5 py-1 font-mono text-[11px] font-semibold tracking-wider text-accent-ink uppercase">
              <Building2 className="h-3 w-3" aria-hidden />
              {data.sectorBadge}
            </span>
          </div>
        </div>

        {/* ================= HERO PANEL ================= */}
        <m.header
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl border border-slate-200/80 dark:border-white/10 p-8 sm:p-12 overflow-hidden glass-card bg-white/80 dark:bg-white/[0.02] shadow-xl shadow-slate-200/40 dark:shadow-none"
        >
          {/* Halo d'accentuation */}
          <div
            className="absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-25 bg-[#F26D3D]"
            aria-hidden
          />

          <div className="relative z-10 space-y-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
              {t("solutions.detail.eyebrow")}{" // "}{data.sector}
            </p>

            <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.12] text-slate-900 dark:text-white max-w-4xl">
              {data.title}{" "}
              {data.titleAccent && (
                <span className="text-accent-ink dark:text-accent-ink drop-shadow-sm">
                  {data.titleAccent}
                </span>
              )}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {data.summary}
            </p>

            {/* Tags sectoriels */}
            <div className="pt-4 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-2">
                {t("solutions.detail.scope")}
              </span>
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-700 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </m.header>

        {/* ================= CONTENU AVEC NAVIGATION VERTICALE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr] gap-8 xl:gap-12 items-start">
          {/* Sommaire vertical sticky desktop */}
          <aside className="hidden lg:block sticky top-28 self-start pt-2">
            <VerticalSectionNav items={navItems} />
          </aside>

          {/* Navigation mobile compacte (pilule flottante discrète, pas de bandeau collé en haut) */}
          <div className="lg:hidden">
            <VerticalSectionNav items={navItems} />
          </div>

          {/* Colonne des sections */}
          <div className="min-w-0 space-y-14">
            {/* ================= 01 — LE PROBLÈME MÉTIER ================= */}
            <section
              id="probleme"
              aria-labelledby="heading-probleme"
          className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 glass-card bg-white/70 dark:bg-white/[0.02] shadow-sm space-y-6"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
            {t("solutions.detail.section.problem")}
          </span>

          <div>
            <h2
              id="heading-probleme"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
            >
              {data.problem.heading}
            </h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed text-base">
              {data.problem.contextNarrative}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {data.problem.coreFrictions.map((friction, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] p-5 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#F26D3D]" />
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      {friction.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {friction.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-white/5">
                  <span className="inline-block rounded-md bg-[#F26D3D]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent-ink">
                    {t("solutions.detail.impact")} {friction.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 02 — L'APPROCHE & ARCHITECTURE ================= */}
        <section
          id="approche"
          aria-labelledby="heading-approche"
          className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 glass-card bg-white/70 dark:bg-white/[0.02] shadow-sm space-y-8"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
            {t("solutions.detail.section.approach")}
          </span>

          <div>
            <h2
              id="heading-approche"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
            >
              {data.approach.heading}
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.approach.lead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.approach.stages.map((stage) => (
              <div
                key={stage.stageNumber}
                className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/[0.01] p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold text-accent-ink tracking-wider">
                    {stage.stageNumber}
                  </span>
                  {stage.badge && (
                    <span className="rounded-full bg-slate-200/70 dark:bg-white/10 px-2 py-0.5 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                      {stage.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  {stage.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {stage.description}
                </p>

                {stage.keyPattern && (
                  <div className="pt-2 border-t border-slate-200/50 dark:border-white/5">
                    <span className="font-mono text-[10px] text-slate-600 dark:text-slate-400">
                      {t("solutions.detail.pattern")} <code className="font-code text-slate-800 dark:text-slate-200 font-semibold">{stage.keyPattern}</code>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Intégration non-disruptive SI */}
          <div className="rounded-2xl border border-[#03318C]/20 dark:border-blue-500/20 bg-[#03318C]/5 dark:bg-blue-500/[0.03] p-5 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#03318C] dark:text-blue-400 uppercase tracking-wider">
              <Workflow className="h-4 w-4" aria-hidden />
              {t("solutions.detail.integration")}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {data.approach.integrationDetails}
            </p>
          </div>
        </section>

        {/* ================= 03 — OÙ EN EST LE PROJET ================= */}
        <section
          id="mesures"
          aria-labelledby="heading-mesures"
          className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 glass-card bg-white/70 dark:bg-white/[0.02] shadow-sm space-y-6"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
            {t("solutions.detail.section.status")}
          </span>

          <div>
            <h2
              id="heading-mesures"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
            >
              {data.metrics.heading}
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.metrics.lead}
            </p>
          </div>

          {/* Statut et jalons du projet (aucune métrique de résultat non mesurée) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {data.metrics.items.map((metric, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <p className="font-display text-xl font-bold text-foreground my-2">
                    {metric.value}
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                  {metric.subtext}
                </p>
              </div>
            ))}
          </div>

          {/* Ce qu'il reste à prouver, et comment ce sera mesuré */}
          <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-100/60 dark:bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              <FileCheck2 className="h-4 w-4 text-accent-ink" aria-hidden />
              {t("solutions.detail.frame")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-slate-600 dark:text-slate-400 pt-1">
              <div>
                <span className="text-slate-900 dark:text-slate-200 font-semibold block mb-0.5">
                  {t("solutions.detail.frame.scope")}
                </span>
                {data.metrics.methodology.sampleAndScope}
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-200 font-semibold block mb-0.5">
                  {t("solutions.detail.frame.period")}
                </span>
                {data.metrics.methodology.period}
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-200 font-semibold block mb-0.5">
                  {t("solutions.detail.frame.measure")}
                </span>
                {data.metrics.methodology.measurementConditions}
              </div>
            </div>

            <p className="pt-2 border-t border-slate-200/50 dark:border-white/5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
              {t("solutions.detail.frame.transparency")} {data.metrics.methodology.rigorDisclaimer}
            </p>
          </div>
        </section>

        {/* ================= 04 — LIMITES & PRÉREQUIS ================= */}
        <section
          id="limites"
          aria-labelledby="heading-limites"
          className="rounded-3xl border border-[#F26D3D]/40 bg-transparent p-6 sm:p-10 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-2">
            <IconBadge icon={AlertOctagon} size="sm" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
              {t("solutions.detail.section.limits")}
            </span>
          </div>

          <div>
            <h2
              id="heading-limites"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
            >
              {data.limitsAndPrerequisites.heading}
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.limitsAndPrerequisites.lead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Prérequis */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/[0.02] p-5 space-y-3">
              <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-link dark:text-link" aria-hidden />
                {t("solutions.detail.prerequisites")}
              </span>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {data.limitsAndPrerequisites.prerequisites.map((req, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-slate-400">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Où ça ne s'applique PAS */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/[0.02] p-5 space-y-3">
              <span className="font-mono text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden />
                {t("solutions.detail.notApplicable")}
              </span>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {data.limitsAndPrerequisites.applicabilityLimits.map((limit, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-red-400">•</span>
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contraintes opérationnelles */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/[0.02] p-5 space-y-3">
              <span className="font-mono text-xs font-semibold text-accent-ink flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent-ink" aria-hidden />
                {t("solutions.detail.constraints")}
              </span>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {data.limitsAndPrerequisites.operationalConstraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-accent-ink">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ================= 05 — POUR ALLER PLUS LOIN ================= */}
        <section
          id="ressources"
          aria-labelledby="heading-ressources"
          className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 glass-card bg-white/70 dark:bg-white/[0.02] shadow-sm space-y-6"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
            {t("solutions.detail.section.links")}
          </span>

          <div>
            <h2
              id="heading-ressources"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
            >
              {t("solutions.detail.links.title")}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              {t("solutions.detail.links.desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {data.relatedResources.map((res) => (
              <Link
                key={res.href}
                href={res.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(res);
                }}
                className="group relative rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-white/[0.02] p-5 flex flex-col justify-between hover:border-[#F26D3D]/50 hover:shadow-lg hover:shadow-[#F26D3D]/5 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-semibold text-[#03318C] dark:text-blue-400 uppercase tracking-wider">
                      {res.badge}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-accent-ink group-hover:translate-x-1 transition-all" aria-hidden />
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-accent-ink transition-colors">
                    {res.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center gap-1 font-mono text-[11px] font-semibold text-accent-ink">
                  <span>{t("solutions.detail.explore")}</span>
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= CALL TO ACTION ================= */}
        <ContactCta
          question={data.cta.question}
          cta={data.cta.buttonLabel}
          onNavigate={onNavigate}
        />
          </div>
        </div>
      </div>
    </div>
  );
}
