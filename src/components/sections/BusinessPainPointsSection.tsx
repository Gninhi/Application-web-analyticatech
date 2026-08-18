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

/** Accent chromatique par peine — chaque rang a sa propre teinte. */
const PAIN_ACCENTS = ["#F26D3D", "#2B6DE0", "#8b5cf6", "#10b981", "#f59e0b"] as const;

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
            const accent = PAIN_ACCENTS[idx];
            return (
              <motion.button
                key={item.id}
                onClick={() => setActivePainId(item.id)}
                whileHover={{ x: 4 }}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 group relative overflow-hidden ${
                  isSelected
                    ? "glass-strong shadow-md"
                    : "glass hover:border-slate-400 dark:hover:border-slate-500"
                }`}
                style={isSelected ? { borderColor: `${accent}66` } : undefined}
              >
                {isSelected && (
                  <span
                    className="pointer-events-none absolute inset-y-0 left-0 w-1"
                    style={{ background: accent }}
                    aria-hidden
                  />
                )}
                <div
                  className="p-2 rounded-xl shrink-0 mt-0.5 transition-colors"
                  style={{
                    backgroundColor: isSelected ? accent : undefined,
                    color: isSelected ? "#fff" : undefined,
                  }}
                >
                  {isSelected ? (
                    <span className="flex h-4 w-4 items-center justify-center font-mono text-[10px] font-bold">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  ) : (
                    <AlertCircle className="h-4 w-4 text-slate-600 dark:text-slate-400" aria-hidden />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("painpoint.observe")} #0{idx + 1} · {item.sector}
                    </span>
                    {isSelected && (
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: accent }}>
                        {t("painpoint.response")}
                      </span>
                    )}
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
        <div className="lg:col-span-6 sticky top-28">
          {PAIN_POINTS.filter((p) => p.id === activePainId).map((active) => {
            const activeIdx = PAIN_POINTS.findIndex((p) => p.id === active.id);
            const accent = PAIN_ACCENTS[activeIdx];
            return (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[360px] relative overflow-hidden"
              >
                {/* Halo assorti */}
                <div
                  className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full opacity-20 blur-3xl"
                  style={{ background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)` }}
                  aria-hidden
                />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border font-mono text-[10px] uppercase font-bold mb-6" style={{ backgroundColor: `${accent}14`, borderColor: `${accent}30`, color: accent }}>
                    <Zap className="h-3 w-3" aria-hidden />
                    <span>{t("painpoint.response")}</span>
                  </div>

                  <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                    {t("painpoint.solution")}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
                    {active.solution}
                  </p>

                  <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#4CAF50]" aria-hidden />
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase">{t("painpoint.impact")}</span>
                    </div>
                    <span className="font-display font-bold text-xl" style={{ color: accent }}>
                      {active.impact}
                    </span>
                  </div>
                </div>

                {onNavigateContact && (
                  <div className="relative mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
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
    </section>
  );
}