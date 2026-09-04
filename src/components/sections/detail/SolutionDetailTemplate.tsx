"use client";

import { motion } from "framer-motion";
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

export interface SolutionDetailTemplateProps {
  data: SolutionDetailData;
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail?: (view: ViewKey, id: string) => void;
}

/**
 * Template de vue de détail enrichie pour les solutions sectorielles.
 * Bithématisme intégral (clair/sombre), structure d'ingénierie sans complaisance :
 * Contexte réel → Architecture DSI → Métriques & Méthodologie → Limites & Prérequis → Maillage.
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
      title: "Problème Métier",
      subtitle: "Frictions opérationnelles",
    },
    {
      id: "approche",
      number: "02",
      title: "Approche & Architecture",
      subtitle: "Pipeline & SI existant",
    },
    {
      id: "mesures",
      number: "03",
      title: data.statusType === "new" ? "Capacités & Méthode" : "Ce qui a été mesuré",
      subtitle: data.statusType === "new" ? "Cadre de qualification" : "Preuves & Méthodologie",
    },
    {
      id: "limites",
      number: "04",
      title: "Limites & Prérequis",
      subtitle: "Cadre d'application",
    },
    {
      id: "ressources",
      number: "05",
      title: "Services associés",
      subtitle: "Maillage interne",
    },
  ];

  return (
    <div className="pt-28 md:pt-36 pb-24 text-slate-900 dark:text-slate-100 selection:bg-[#F26D3D]/30 selection:text-[#F26D3D]">
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
            {data.statusType === "new" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                {data.statusBadge ?? "Nouvelle offre"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4CAF50]/30 bg-[#4CAF50]/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-[#4CAF50] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
                {data.statusBadge ?? "Déployé en production"}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F26D3D]/30 bg-[#F26D3D]/10 px-3.5 py-1 font-mono text-[11px] font-semibold tracking-wider text-[#F26D3D] uppercase">
              <Building2 className="h-3 w-3" aria-hidden />
              {data.sectorBadge}
            </span>
          </div>
        </div>

        {/* ================= HERO PANEL ================= */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
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
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F26D3D]">
              SOLUTION SECTORIELLE // {data.sector}
            </p>

            <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.12] text-slate-900 dark:text-white max-w-4xl">
              {data.title}{" "}
              {data.titleAccent && (
                <span className="text-[#F26D3D] dark:text-[#F26D3D] drop-shadow-sm">
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
                Périmètre :
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
        </motion.header>

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
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F26D3D]">
            01 // LE PROBLÈME MÉTIER CONCRET
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
                  <span className="inline-block rounded-md bg-[#F26D3D]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#F26D3D]">
                    Impact terrain : {friction.impact}
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
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F26D3D]">
            02 // L&apos;APPROCHE TECHNIQUE & ARCHITECTURALE
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
                  <span className="font-mono text-[11px] font-bold text-[#F26D3D] tracking-wider">
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
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      Pattern : <code className="text-slate-800 dark:text-slate-200 font-semibold">{stage.keyPattern}</code>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Intégration non-disruptive SI */}
          <div className="rounded-2xl border border-[#03318C]/20 dark:border-blue-500/20 bg-[#03318C]/5 dark:bg-blue-500/[0.03] p-5 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#03318C] dark:text-blue-400 uppercase tracking-wider">
              <Workflow className="h-4 w-4" aria-hidden />
              Intégration non disruptive avec votre SI existant
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {data.approach.integrationDetails}
            </p>
          </div>
        </section>

        {/* ================= 03 — CE QUI A ÉTÉ MESURÉ OU CAPACITÉS ================= */}
        <section
          id="mesures"
          aria-labelledby="heading-mesures"
          className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 glass-card bg-white/70 dark:bg-white/[0.02] shadow-sm space-y-6"
        >
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F26D3D]">
            {data.statusType === "new"
              ? "03 // CAPACITÉS OPÉRATIONNELLES & CADRE MÉTHODOLOGIQUE"
              : "03 // CE QUI A ÉTÉ MESURÉ · PREUVES & MÉTHODOLOGIE"}
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

          {/* Métriques officielles du site */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {data.metrics.items.map((metric, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <p className="font-display text-4xl sm:text-5xl font-bold text-[#F26D3D] my-2">
                    {metric.value}
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                  {metric.subtext}
                </p>
              </div>
            ))}
          </div>

          {/* Encadré méthodologique transparent */}
          <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-100/60 dark:bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <FileCheck2 className="h-4 w-4 text-[#F26D3D]" aria-hidden />
              {data.statusType === "new"
                ? "Cadre & Conditions de qualification"
                : "Cadre & Conditions de mesure vérifiées"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-slate-600 dark:text-slate-400 pt-1">
              <div>
                <span className="text-slate-900 dark:text-slate-200 font-semibold block mb-0.5">
                  Périmètre & Échantillon :
                </span>
                {data.metrics.methodology.sampleAndScope}
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-200 font-semibold block mb-0.5">
                  Période d&apos;observation :
                </span>
                {data.metrics.methodology.period}
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-200 font-semibold block mb-0.5">
                  Conditions de calcul :
                </span>
                {data.metrics.methodology.measurementConditions}
              </div>
            </div>

            <p className="pt-2 border-t border-slate-200/50 dark:border-white/5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Note de rigueur : {data.metrics.methodology.rigorDisclaimer}
            </p>
          </div>
        </section>

        {/* ================= 04 — LIMITES & PRÉREQUIS ================= */}
        <section
          id="limites"
          aria-labelledby="heading-limites"
          className="rounded-3xl border border-amber-500/30 bg-amber-500/[0.02] dark:bg-amber-500/[0.03] p-6 sm:p-10 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              04 // LIMITES D&apos;APPLICABILITÉ & PRÉREQUIS STRICTS
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
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden />
                Prérequis indispensables
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
              <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden />
                Où la solution ne s&apos;applique PAS
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
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
                Contraintes & Réglementation
              </span>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {data.limitsAndPrerequisites.operationalConstraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
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
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F26D3D]">
            05 // MAILLAGE & RESSOURCES ASSOCIÉES
          </span>

          <div>
            <h2
              id="heading-ressources"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
            >
              Services d&apos;ingénierie et retours d&apos;expérience liés
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              Découvrez les briques d&apos;architecture et analyses R&D associées à ce domaine sectoriel :
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
                    <span className="font-mono text-[10px] font-bold text-[#03318C] dark:text-blue-400 uppercase tracking-wider">
                      {res.badge}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#F26D3D] group-hover:translate-x-1 transition-all" aria-hidden />
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-[#F26D3D] transition-colors">
                    {res.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center gap-1 font-mono text-[11px] font-semibold text-[#F26D3D]">
                  <span>Explorer</span>
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
