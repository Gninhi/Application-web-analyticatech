"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { MovingButton } from "@/components/interactive/MovingButton";
import { useI18n } from "@/lib/i18n/provider";

export interface PainPointItem {
  id: string;
  problem: string;
  solution: string;
  impact: string;
  sector: string;
}

const PAIN_POINT_IDS = ["p1", "p2", "p3", "p4", "p5"];

interface BusinessPainPointsProps {
  onNavigateContact?: () => void;
}

export function BusinessPainPointsSection({ onNavigateContact }: BusinessPainPointsProps) {
  const { t } = useI18n();
  const [activePainId, setActivePainId] = useState<string>("p1");
  const PAIN_POINTS: PainPointItem[] = PAIN_POINT_IDS.map((id) => ({
    id,
    problem: t(`painpoint.${id}.problem`),
    solution: t(`painpoint.${id}.solution`),
    impact: t(`painpoint.${id}.impact`),
    sector: t(`painpoint.${id}.sector`),
  }));

  return (
    <section className="relative py-12">
      {/* En-tête de section */}
      <div className="max-w-3xl mb-12">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] font-bold">
          {t("home.section.painpoints")}
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mt-2 tracking-tight">
          {t("home.section.painpoints.title")}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-4 text-base leading-relaxed">
          {t("home.section.painpoints.desc")}
        </p>
      </div>

      {/* Liste des peines et résolution */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Colonne Gauche : Liste des 5 peines du Blueprint */}
        <div className="lg:col-span-6 space-y-3">
          {PAIN_POINTS.map((item, idx) => {
            const isSelected = activePainId === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActivePainId(item.id)}
                whileHover={{ x: 4 }}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                  isSelected
                    ? "border-[#F26D3D] glass-strong shadow-md shadow-[#F26D3D]/10"
                    : "glass hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    isSelected ? "bg-[#C9470F] text-white" : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <AlertCircle className="h-4 w-4" aria-hidden />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("painpoint.observe")} #0{idx + 1} · {item.sector}
                    </span>
                  </div>
                  <p className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base leading-snug">
                    {item.problem}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Colonne Droite : Transformation & Solution AnalyticaTech */}
        {/* Grid-stack crossfade : tous les panneaux restent montés, empilés sur
            la même cellule ; seul l'opacité change (pas de remount → pas de
            saut de hauteur ni de redémarrage d'animation). Inactifs = inert
            (hors focus/tab) + pointer-events-none. */}
        <div className="lg:col-span-6 sticky top-28">
          <div className="grid">
            {PAIN_POINTS.map((item) => {
              const isSelected = activePainId === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial={false}
                  animate={{ opacity: isSelected ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  inert={!isSelected}
                  aria-hidden={!isSelected}
                  className="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[360px] col-start-1 row-start-1 pointer-events-none [&:not([inert])]:pointer-events-auto"
                >
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4CAF50]/10 border border-[#4CAF50]/30 font-mono text-[10px] uppercase text-[#4CAF50] font-bold mb-6">
                      <Zap className="h-3 w-3" aria-hidden />
                      <span>{t("painpoint.response")}</span>
                    </div>

                    <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                      {t("painpoint.solution")}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
                      {item.solution}
                    </p>

                    <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-[#4CAF50]" aria-hidden />
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase">{t("painpoint.impact")}</span>
                      </div>
                      <span className="font-display font-bold text-xl text-[#F26D3D]">
                        {item.impact}
                      </span>
                    </div>
                  </div>

                  {onNavigateContact && (
                    <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{t("painpoint.cta.hint")}</span>
                      <MovingButton
                        onClick={onNavigateContact}
                        variant="primary"
                        size="sm"
                        className="neon-glow"
                      >
                        {t("painpoint.cta")}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </MovingButton>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
