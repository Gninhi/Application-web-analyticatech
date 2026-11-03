"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  Sparkles,
  Clock,
  Calendar,
  Building2,
  Workflow,
  Scale,
} from "lucide-react";
import type { ViewKey } from "@/types/content";
import type { InsightDetailData } from "@/types/insight-detail";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { ContactCta } from "@/components/ui/ContactCta";
import { VerticalSectionNav, type VerticalNavItem } from "@/components/ui/VerticalSectionNav";

/** Libellés fixes du gabarit (le contenu des articles vient du registre FR ou EN). */
const LABELS = {
  fr: {
    nav: [
      ["Contexte", "Scénario type"],
      ["Le problème", "Modes d'échec typiques"],
      ["Approche & outils", "Architecture cible"],
      ["Arbitrages & Limites", "Compromis assumés"],
      ["Ce qu'il faut mesurer", "Indicateurs et méthode"],
      ["Pour aller plus loin", "Projets et services liés"],
    ],
    contextEyebrow: "01 · Contexte : scénario type",
    sector: "Secteur & Contexte",
    constraints: "Contraintes d'exploitation",
    stakes: "Enjeu critique",
    scenarioNote:
      "Ce contexte est un scénario type, construit pour illustrer la méthode. Il ne décrit pas une mission client et ne contient aucun résultat client.",
    problemEyebrow: "02 · LE PROBLÈME EN PRODUCTION",
    approachEyebrow: "03 · APPROCHE & ARCHITECTURE",
    tools: "Outils et composants",
    pattern: "Pattern :",
    tradeoffsEyebrow: "04 · ARBITRAGES TECHNIQUES & LIMITES ASSUMÉES",
    arbitrage: "Arbitrage retenu :",
    cost: "Le coût assumé :",
    mitigation: "Atténuation prévue :",
    resultsEyebrow: "05 · INDICATEURS À MESURER",
    indicative: "À titre indicatif",
    protocol: "Protocole de mesure //",
    benefits: "Bénéfices attendus :",
    relatedEyebrow: "06 · POUR ALLER PLUS LOIN · SOLUTIONS & SERVICES",
    relatedTitle: "Prolonger cette architecture sur vos projets",
    relatedLead: "Les services et les projets liés à cette problématique :",
    explore: "Explorer",
    ctaQuestion: "Vous concevez ou auditez une architecture similaire ?",
    cta: "Échanger avec le fondateur",
  },
  en: {
    nav: [
      ["Context", "Typical scenario"],
      ["The problem", "Typical failure modes"],
      ["Approach & tools", "Target architecture"],
      ["Trade-offs & limits", "Accepted compromises"],
      ["What to measure", "Indicators and method"],
      ["Going further", "Related projects and services"],
    ],
    contextEyebrow: "01 · Context: typical scenario",
    sector: "Sector & context",
    constraints: "Operating constraints",
    stakes: "Critical stake",
    scenarioNote:
      "This context is a typical scenario built to illustrate the method. It does not describe a client engagement and contains no client results.",
    problemEyebrow: "02 · THE PROBLEM IN PRODUCTION",
    approachEyebrow: "03 · APPROACH & ARCHITECTURE",
    tools: "Tools and components",
    pattern: "Pattern:",
    tradeoffsEyebrow: "04 · TECHNICAL TRADE-OFFS & ACCEPTED LIMITS",
    arbitrage: "Chosen trade-off:",
    cost: "The accepted cost:",
    mitigation: "Planned mitigation:",
    resultsEyebrow: "05 · INDICATORS TO MEASURE",
    indicative: "Indicative",
    protocol: "Measurement protocol //",
    benefits: "Expected benefits:",
    relatedEyebrow: "06 · GOING FURTHER · SOLUTIONS & SERVICES",
    relatedTitle: "Extend this architecture to your projects",
    relatedLead: "Services and projects related to this topic:",
    explore: "Explore",
    ctaQuestion: "Are you designing or auditing a similar architecture?",
    cta: "Let's talk",
  },
} as const;

const NAV_IDS = ["contexte", "probleme", "approche", "compromis", "resultats", "aller-plus-loin"] as const;

export interface InsightDetailTemplateProps {
  data: InsightDetailData;
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail?: (view: ViewKey, id: string) => void;
}

/**
 * Template de vue de détail enrichie pour les articles d'Insights / R&D.
 * Conçu avec une rigueur technique maximale, adapté aux thèmes clair et sombre,
 * avec une progression sans complaisance marketing :
 * Contexte réel → Problème documenté → Approche & Stack → Arbitrages & Limites → Résultats mesurés → Maillage interne.
 */
export function InsightDetailTemplate({
  data,
  onNavigate,
  onNavigateDetail,
}: InsightDetailTemplateProps) {
  const { t, locale } = useI18n();

  const handleLinkClick = (resource: InsightDetailData["relatedResources"][0]) => {
    if (onNavigateDetail) {
      onNavigateDetail(resource.targetViewKey, resource.targetId);
    } else {
      onNavigate(resource.targetViewKey);
    }
  };

  const L = LABELS[locale === "en" ? "en" : "fr"];
  const navItems: VerticalNavItem[] = NAV_IDS.map((id, i) => ({
    id,
    number: String(i + 1).padStart(2, "0"),
    title: L.nav[i][0],
    subtitle: L.nav[i][1],
  }));

  return (
    <div className="pt-28 md:pt-36 pb-24 text-slate-900 dark:text-slate-100 selection:bg-[#F26D3D]/30 selection:text-accent-ink">
      <div className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-6 space-y-12">
        {/* ================= BREADCRUMB & RETOUR ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("blog")}
            icon={<ArrowLeft className="h-4 w-4" aria-hidden />}
            className="group"
          >
            <span>
              {t("common.back")} {t("nav.blog")}
            </span>
          </Button>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F26D3D]/30 bg-[#F26D3D]/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-accent-ink uppercase">
              <Sparkles className="h-3 w-3" aria-hidden />
              {data.category.label}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-xs text-slate-500 dark:text-slate-400">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {data.readingTime}
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
          {/* Halo d'ambiance d'accent */}
          <div
            className="absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-25 bg-[#F26D3D]"
            aria-hidden
          />

          <div className="relative z-10 space-y-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
              {data.hero.eyebrow}
            </p>

            <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.12] text-slate-900 dark:text-white max-w-4xl">
              {data.hero.title}{" "}
              <span className="text-accent-ink dark:text-accent-ink drop-shadow-sm">
                {data.hero.titleAccent}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {data.hero.subtitle}
            </p>

            {/* Auteur & Méta bar */}
            <div className="pt-4 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-[#F26D3D]/40 bg-[#F26D3D]/10 flex items-center justify-center font-mono text-xs font-semibold text-accent-ink">
                  {data.author.avatarInitials ?? data.author.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {data.author.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {data.author.role}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400 mr-2">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  {data.publishedDate}
                </span>
                {data.hero.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
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

        {/* ================= 01 — CONTEXTE MÉTIER CONCRET ================= */}
        <section
          id="contexte"
          aria-labelledby="heading-contexte"
          className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 glass-card bg-white/70 dark:bg-white/[0.02] shadow-sm space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
              {L.contextEyebrow}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-transparent px-3 py-1 font-mono text-[11px] font-semibold text-foreground uppercase">
              <Building2 className="h-3 w-3" aria-hidden />
              {data.context.sectorBadge}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02]">
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {L.sector}
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {data.context.sector}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02]">
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {L.constraints}
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {data.context.constraints}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02]">
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {L.stakes}
              </p>
              <p className="text-sm font-semibold text-accent-ink">
                {data.context.stakes}
              </p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-base pt-2">
            <p>{data.context.narrative}</p>
          </div>
          <p className="text-sm text-slate-600 dark:text-[#B6C2D6] border-l-2 border-[#F26D3D] pl-4">
            {L.scenarioNote}
          </p>
        </section>

        {/* ================= 02 — LE PROBLÈME EN PRODUCTION ================= */}
        <section
          id="probleme"
          aria-labelledby="heading-probleme"
          className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 glass-card bg-white/70 dark:bg-white/[0.02] shadow-sm space-y-6"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
            {L.problemEyebrow}
          </span>

          <div>
            <h2
              id="heading-probleme"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
            >
              {data.problem.heading}
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.problem.lead}
            </p>
          </div>

          {/* Grille des modes d'échec */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {data.problem.failureModes.map((failure) => (
              <div
                key={failure.code}
                className="rounded-2xl border border-red-500/20 dark:border-red-500/20 bg-red-500/[0.03] dark:bg-red-500/[0.02] p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="font-mono text-[10px] font-semibold text-red-600 dark:text-red-400 tracking-wider">
                    {failure.code}
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mt-1">
                    {failure.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {failure.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-red-500/15">
                  <span className="inline-block rounded-md bg-red-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-red-700 dark:text-red-300">
                    {failure.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 03 — APPROCHE TECHNIQUE & ARCHITECTURE ================= */}
        <section
          id="approche"
          aria-labelledby="heading-approche"
          className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 glass-card bg-white/70 dark:bg-white/[0.02] shadow-sm space-y-8"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
            {L.approachEyebrow}
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

          {/* Clusters de stack technique précise avec versions */}
          <div className="space-y-3">
            <p className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-accent-ink" aria-hidden />
              {L.tools}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {data.approach.techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-3.5 py-2 flex items-center gap-2"
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono">
                    {tech.name}
                  </span>
                  {tech.version && (
                    <span className="rounded bg-[#03318C]/10 dark:bg-[#03318C]/30 text-[#03318C] dark:text-blue-300 px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                      {tech.version}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    · {tech.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Étapes séquentielles du pipeline d'architecture */}
          <div className="space-y-4 pt-2">
            <p className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Workflow className="h-3.5 w-3.5 text-accent-ink" aria-hidden />
              {data.approach.architectureTitle}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.approach.architectureStages.map((stage) => (
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
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                        {L.pattern} <code className="font-code text-slate-800 dark:text-slate-200 font-semibold">{stage.keyPattern}</code>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Snippet de code ou blueprint architectural */}
          {data.approach.codeSnippet && (
            <div className="rounded-2xl border border-slate-800 dark:border-white/10 bg-background p-5 text-slate-200 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-link/80" />
                  <span className="ml-2 text-slate-300 font-medium">
                    {data.approach.codeSnippet.title}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase text-accent-ink bg-[#F26D3D]/10 px-2 py-0.5 rounded">
                  {data.approach.codeSnippet.language}
                </span>
              </div>
              <pre className="overflow-x-auto text-xs font-code leading-relaxed text-slate-300 py-2">
                <code>{data.approach.codeSnippet.code}</code>
              </pre>
              {data.approach.codeSnippet.caption && (
                <p className="mt-2 text-[11px] font-mono text-slate-400 border-t border-white/10 pt-2">
                  {data.approach.codeSnippet.caption}
                </p>
              )}
            </div>
          )}
        </section>

        {/* ================= 04 — ARBITRAGES TECHNIQUES & LIMITES ASSUMÉES ================= */}
        <section
          id="compromis"
          aria-labelledby="heading-compromis"
          className="rounded-3xl border border-[#F26D3D]/40 bg-transparent p-6 sm:p-10 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-accent-ink" aria-hidden />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
              {L.tradeoffsEyebrow}
            </span>
          </div>

          <div>
            <h2
              id="heading-compromis"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
            >
              {data.tradeoffs.heading}
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.tradeoffs.lead}
            </p>
          </div>

          {/* Alerte d'honnêteté d'ingénierie */}
          <div className="rounded-2xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 p-4 text-xs leading-relaxed text-foreground font-mono">
            {data.tradeoffs.disclaimer}
          </div>

          {/* Grille des arbitrages assumés */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {data.tradeoffs.tradeoffs.map((tradeoff, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/[0.02] p-5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-accent-ink" aria-hidden />
                  <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                    {tradeoff.tension}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {L.arbitrage}
                    </span>
                    <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                      {tradeoff.arbitrage}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] text-red-500 uppercase tracking-wider">
                      {L.cost}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                      {tradeoff.costOrDrawback}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/5">
                    <span className="font-mono text-[10px] text-link dark:text-link uppercase tracking-wider">
                      {L.mitigation}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                      {tradeoff.mitigation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 05 — RÉSULTATS & MÉTRIQUES VÉRIFIÉES ================= */}
        <section
          id="resultats"
          aria-labelledby="heading-resultats"
          className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 glass-card bg-white/70 dark:bg-white/[0.02] shadow-sm space-y-6"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
            {L.resultsEyebrow}
          </span>

          <div>
            <h2
              id="heading-resultats"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
            >
              {data.results.heading}
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.results.lead}
            </p>
          </div>

          {/* Grille des métriques rigoureuses */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {data.results.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {metric.label}
                    </span>
                    {metric.isIndicative && (
                      <span className="rounded bg-[#F26D3D]/10 text-accent-ink px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase">
                        {L.indicative}
                      </span>
                    )}
                  </div>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-accent-ink">
                    {metric.value}
                  </p>
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {metric.subtext}
                </p>
              </div>
            ))}
          </div>

          {/* Note méthodologique de rigueur */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.02] p-4 text-xs font-mono text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-900 dark:text-white uppercase mr-1">
              {L.protocol}
            </span>
            {data.results.methodologyNote}
          </div>

          {/* Gains qualitatifs observés */}
          <div className="space-y-2.5 pt-2">
            <p className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {L.benefits}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {data.results.observedBenefits.map((benefit, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-white/[0.01] p-3 rounded-xl border border-slate-200/50 dark:border-white/5"
                >
                  <CheckCircle2 className="h-4 w-4 text-link dark:text-link shrink-0 mt-0.5" aria-hidden />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= 06 — POUR ALLER PLUS LOIN (MAILLAGE INTERNE) ================= */}
        <section
          id="aller-plus-loin"
          aria-labelledby="heading-aller-plus-loin"
          className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 glass-card bg-white/70 dark:bg-white/[0.02] shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
              {L.relatedEyebrow}
            </span>
          </div>

          <div>
            <h2
              id="heading-aller-plus-loin"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
            >
              {L.relatedTitle}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              {L.relatedLead}
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
                  <span>{L.explore}</span>
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= CALL TO ACTION ================= */}
        <ContactCta
          question={L.ctaQuestion}
          cta={L.cta}
          onNavigate={onNavigate}
        />
          </div>
        </div>
      </div>
    </div>
  );
}
