"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  ChevronDown,
  Sparkles,
  Quote,
  Building2,
  Clock,
  X,
} from "lucide-react";
import type { ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContentOptional } from "@/components/providers/ContentProvider";
import { MovingButton } from "@/components/interactive/MovingButton";
import { getServiceDetailData, SERVICES_DETAIL_REGISTRY } from "@/lib/content/services-detail-data";
import { cn } from "@/lib/utils/cn";
import { DetailNotFound } from "./DetailNotFound";

export interface ServiceDetailViewProps {
  serviceIndex: string;
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail?: (view: ViewKey, id: string) => void;
}

/**
 * ServiceDetailView — Vue détaillée enrichie, experte et orientée conversion.
 * Conçue selon la maquette d'architecture haute crédibilité :
 *  - Hero Panel avec métadonnées & proposition de valeur
 *  - Grille de 3 preuves chiffrées (benchmarks réels)
 *  - Section "Le Problème" (pain points métiers vécus)
 *  - Section "Ce que nous livrons" (4 livrables concrets)
 *  - Section "Méthodologie & Jalons" (timeline en 4 phases avec durées)
 *  - Section "Cas d'usage sectoriels" (3 applications métiers ciblées)
 *  - Section "Stack technique" (technologies de production par clusters)
 *  - Section "Étude de cas" (citation C-Level avec ROI mesuré)
 *  - Section "FAQ spécifique" (accordéon interactif levant les objections)
 *  - Section CTA & Navigation séquentielle vers le service suivant
 */
export function ServiceDetailView({ serviceIndex, onNavigate, onNavigateDetail }: ServiceDetailViewProps) {
  const { locale, t } = useI18n();
  const appContent = useAppContentOptional();
  const services = appContent?.services ?? [];
  const normalizedIndex = (serviceIndex ?? "").trim().padStart(2, "0");
  const service = services.find((s) => s.index === serviceIndex || s.index === normalizedIndex);
  const detailData =
    getServiceDetailData(normalizedIndex, locale) ??
    getServiceDetailData("01", locale) ??
    SERVICES_DETAIL_REGISTRY["01"];

  // État de l'accordéon FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  if (!service && !detailData) {
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

  const IconComp = detailData.icon || BrainCircuit;

  return (
    <div className="pt-28 md:pt-36 pb-24 text-slate-900 dark:text-slate-100 selection:bg-[#F26D3D]/30 selection:text-[#F26D3D]">
      <div className="mx-auto max-w-5xl px-4 md:px-6 space-y-16">
        {/* ================= BREADCRUMB / RETOUR ================= */}
        <div className="flex items-center justify-between">
          <MovingButton
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("services")}
            className="group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            <span>← {t("common.back")} {t("nav.services")}</span>
          </MovingButton>

          <span className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:inline-block">
            {detailData.eyebrow}
          </span>
        </div>

        {/* ================= 01 — HERO PANEL ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl border border-black/10 dark:border-white/10 p-8 sm:p-12 overflow-hidden glass-card bg-gradient-to-br from-orange-950/20 via-background to-background"
        >
          {/* Halo d'ambiance d'accent */}
          <div
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-25"
            style={{ backgroundColor: detailData.accentColor }}
            aria-hidden
          />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#F26D3D]/30 bg-[#F26D3D]/10 backdrop-blur-md shadow-lg shadow-[#F26D3D]/10">
                <IconComp className="h-7 w-7 text-[#F26D3D]" aria-hidden />
              </span>

              <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full border border-[#F26D3D]/40 bg-[#F26D3D]/10 text-[#F26D3D] tracking-wider uppercase">
                {detailData.badge}
              </span>
            </div>

            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F26D3D] mb-3">
              {detailData.eyebrow}
            </p>

            <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.08] text-slate-900 dark:text-white max-w-3xl">
              {detailData.heroTitle}{" "}
              <span className="text-shimmer">{detailData.heroAccent}</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {detailData.heroSubtitle}
            </p>
          </div>
        </motion.div>

        {/* ================= 02 — GRILLE DE PREUVES CHIFFRÉES ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {detailData.proofMetrics.map((pm, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 border border-black/10 dark:border-white/10 hover:border-[#F26D3D]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span
                  className="font-display font-bold text-3xl sm:text-4xl block mb-1"
                  style={{ color: pm.color || detailData.accentColor }}
                >
                  {pm.value}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block mb-3">
                  {pm.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-black/5 dark:border-white/5 pt-3">
                {pm.context}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ================= 03 — LE PROBLÈME MÉTIER ================= */}
        <section className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#F26D3D] font-bold block mb-2">
                {t("detail.service.problem.tag")}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                {t("detail.service.problem.title")}
              </h2>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t("detail.service.problem.desc")}
              </p>
            </div>

            <div className="lg:col-span-7 space-y-3.5">
              {detailData.painPoints.map((pp, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-xl p-5 border border-black/10 dark:border-white/10 flex items-start gap-4 hover:border-red-500/30 transition-all"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 mt-0.5">
                    <X className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      {pp.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 04 — CE QUE NOUS LIVRONS ================= */}
        <section className="pt-8 border-t border-black/10 dark:border-white/10">
          <div className="mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#F26D3D] font-bold block mb-2">
              {t("detail.service.deliverables.tag")}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t("detail.service.deliverables.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {detailData.deliverables.map((deliv, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 sm:p-7 border border-black/10 dark:border-white/10 hover:border-[#F26D3D]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#F26D3D] px-2.5 py-1 rounded-md bg-[#F26D3D]/10 inline-block mb-4">
                    {t("detail.service.deliverable.badge")} {deliv.number}
                  </span>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-[#F26D3D] transition-colors">
                    {deliv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {deliv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">{t("detail.service.deliverable.output")}</span>
                  <span className="text-[#F26D3D] font-medium text-right">{deliv.output}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 05 — MÉTHODOLOGIE & JALONS ================= */}
        <section className="pt-8 border-t border-black/10 dark:border-white/10">
          <div className="mb-10">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#F26D3D] font-bold block mb-2">
              {t("detail.service.method.tag")}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t("detail.service.method.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {detailData.timeline.map((step, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-5 border border-black/10 dark:border-white/10 flex flex-col justify-between relative group hover:border-[#F26D3D]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F26D3D]/40 bg-[#F26D3D]/10 font-mono text-xs font-bold text-[#F26D3D]">
                      {step.step}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden />
                      {step.duration}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/5 dark:border-white/5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="text-[#F26D3D] block font-semibold mb-0.5">{t("detail.service.method.milestone")}</span>
                  {step.deliverable}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 06 — CAS D'USAGE SECTORIELS ================= */}
        <section className="pt-8 border-t border-black/10 dark:border-white/10">
          <div className="mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#F26D3D] font-bold block mb-2">
              {t("detail.service.cases.tag")}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t("detail.service.cases.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {detailData.sectorCases.map((sc, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 border border-black/10 dark:border-white/10 hover:border-[#F26D3D]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-3.5 w-3.5 text-[#F26D3D]" aria-hidden />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                      {sc.sector}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2.5">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {sc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5">
                  <span className="text-xs font-mono font-bold text-[#33D6A6] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {sc.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 07 — STACK TECHNIQUE DE PRODUCTION ================= */}
        <section className="pt-8 border-t border-black/10 dark:border-white/10">
          <div className="mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#F26D3D] font-bold block mb-2">
              {t("detail.service.stack.tag")}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t("detail.service.stack.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {detailData.techStackGroups.map((group, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-5 border border-black/10 dark:border-white/10">
                <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-4 pb-2 border-b border-black/5 dark:border-white/5">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-700 dark:text-slate-300 hover:border-[#F26D3D]/40 hover:text-[#F26D3D] transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 08 — ÉTUDE DE CAS & TÉMOIGNAGE ================= */}
        <section className="pt-8 border-t border-black/10 dark:border-white/10">
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-black/10 dark:border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-r from-background via-surface-2 to-background">
            <div className="lg:col-span-8">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#F26D3D] font-bold block mb-3">
                {t("detail.service.caseStudy.tag")}
              </span>
              <Quote className="h-8 w-8 text-[#F26D3D]/40 mb-3" aria-hidden />
              <blockquote className="font-display text-lg sm:text-xl font-medium text-slate-900 dark:text-white leading-relaxed">
                {detailData.caseStudy.quote}
              </blockquote>
              <div className="mt-5 font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span className="text-slate-900 dark:text-slate-200 font-bold block">{detailData.caseStudy.authorRole}</span>
                {detailData.caseStudy.authorCompany}
              </div>
            </div>

            <div className="lg:col-span-4 lg:border-l lg:border-black/10 dark:lg:border-white/10 lg:pl-8 flex flex-col justify-center text-left lg:text-center">
              <span className="font-display text-4xl sm:text-5xl font-bold text-[#33D6A6] block mb-1">
                {detailData.caseStudy.metricValue}
              </span>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 leading-tight">
                {detailData.caseStudy.metricLabel}
              </span>
            </div>
          </div>
        </section>

        {/* ================= 09 — QUESTIONS FRÉQUENTES (ACCORDÉON) ================= */}
        <section className="pt-8 border-t border-black/10 dark:border-white/10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#F26D3D] font-bold block mb-2">
                {t("detail.service.faq.tag")}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {t("detail.service.faq.title")}
              </h2>
            </div>

            <div className="space-y-3">
              {detailData.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="glass-card rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:text-[#F26D3D] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-[#F26D3D] shrink-0 transition-transform duration-300",
                          isOpen && "rotate-180"
                        )}
                        aria-hidden
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-black/5 dark:border-white/5 pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 10 — CTA FINAL & SERVICE SUIVANT ================= */}
        <section className="pt-8 border-t border-black/10 dark:border-white/10">
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-black/10 dark:border-white/10 text-center relative overflow-hidden bg-gradient-to-b from-background via-surface-2 to-background">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mb-4">
                {t("detail.service.cta.title")}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                {t("detail.service.cta.desc")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <MovingButton
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate("contact")}
                  className="neon-glow group w-full sm:w-auto"
                >
                  <span>{t("detail.service.cta.button")}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </MovingButton>
              </div>

              {detailData.nextService && (
                <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateDetail) {
                        onNavigateDetail("service-detail", detailData.nextService.index);
                      } else {
                        onNavigate("services");
                      }
                    }}
                    className="font-mono text-xs text-slate-500 hover:text-[#F26D3D] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{t("detail.service.next")} {detailData.nextService.title}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
