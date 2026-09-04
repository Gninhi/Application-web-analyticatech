"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactCta } from "@/components/ui/ContactCta";
import { DetailNotFound } from "./DetailNotFound";
import { getSolutionDetailData } from "@/lib/content/solutions-detail-data";
import { SolutionDetailTemplate } from "./SolutionDetailTemplate";

export interface SolutionDetailViewProps {
  solutionSlug: string;
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail?: (view: ViewKey, id: string) => void;
}

/**
 * SolutionDetailView — page de détail d'une solution sectorielle.
 * Résolue par slug (URL partageable), plus stable que l'UUID.
 * Rend le template enrichi haute crédibilité si les données sont disponibles,
 * sinon retombe élégamment sur le rendu standardisé.
 */
export function SolutionDetailView({
  solutionSlug,
  onNavigate,
  onNavigateDetail,
}: SolutionDetailViewProps) {
  const { t, locale } = useI18n();
  const { solutions } = useAppContent();
  const solution = solutions.find((s) => s.slug === solutionSlug);

  // Recherche de données enrichies dans le registre
  const detailData = getSolutionDetailData(solutionSlug, locale);

  if (detailData) {
    return (
      <SolutionDetailTemplate
        data={detailData}
        onNavigate={onNavigate}
        onNavigateDetail={onNavigateDetail}
      />
    );
  }

  if (!solution) {
    return (
      <div className="pt-28 md:pt-36 pb-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("solutions")}
            icon={<ArrowLeft className="h-4 w-4" aria-hidden />}
            className="mb-8"
          >
            {`${t("common.back")} ${t("nav.solutions")}`}
          </Button>
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("solutions")}
          icon={<ArrowLeft className="h-4 w-4" aria-hidden />}
          className="mb-8"
        >
          {`${t("common.back")} ${t("nav.solutions")}`}
        </Button>

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
            {solution.methodology && (
              <p className="mt-1.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                {solution.methodology}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {solution.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 px-2.5 py-1 font-mono text-[11px] text-slate-600 dark:text-slate-300"
              >
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
