"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  BarChart3,
  ShieldAlert,
  Server,
  BrainCircuit,
  CheckCircle2,
  ArrowRight,
  Zap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";

export interface PainPointItem {
  id: string;
  problem: string;
  solution: string;
  impact: string;
  sector: string;
  icon: LucideIcon;
  accentColor: string;
}

const PAIN_POINT_CONFIG: { id: string; icon: LucideIcon; accentColor: string }[] = [
  { id: "p1", icon: Layers, accentColor: "#F26D3D" },
  { id: "p2", icon: BarChart3, accentColor: "#A855F7" },
  { id: "p3", icon: ShieldAlert, accentColor: "#38BDF8" },
  { id: "p4", icon: Server, accentColor: "#F59E0B" },
  { id: "p5", icon: BrainCircuit, accentColor: "#10B981" },
];

interface BusinessPainPointsProps {
  onNavigateContact?: () => void;
}

export function BusinessPainPointsSection({ onNavigateContact }: BusinessPainPointsProps) {
  const { t } = useI18n();
  const [activePainId, setActivePainId] = useState<string>("p1");

  const PAIN_POINTS: PainPointItem[] = PAIN_POINT_CONFIG.map(({ id, icon, accentColor }) => ({
    id,
    problem: t(`painpoint.${id}.problem`),
    solution: t(`painpoint.${id}.solution`),
    impact: t(`painpoint.${id}.impact`),
    sector: t(`painpoint.${id}.sector`),
    icon,
    accentColor,
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
        {/* Colonne Gauche : Liste des 5 peines thématiques */}
        <div className="lg:col-span-6 space-y-3" role="tablist" aria-label={t("home.section.painpoints.title")}>
          {PAIN_POINTS.map((item, idx) => {
            const isSelected = activePainId === item.id;
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`${item.sector} : ${item.problem}`}
                onClick={() => setActivePainId(item.id)}
                whileHover={{ x: 4 }}
                className={`w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isSelected
                    ? "border-[#F26D3D] glass-strong shadow-lg shadow-[#F26D3D]/10"
                    : "glass hover:border-slate-400 dark:hover:border-slate-500"
                }`}
                style={{
                  borderColor: isSelected
                    ? `color-mix(in srgb, ${item.accentColor} 65%, transparent)`
                    : undefined,
                }}
              >
                {/* Icône thématique dynamique avec puce glowing */}
                <div
                  className="relative p-2.5 rounded-xl shrink-0 mt-0.5 transition-all duration-300 flex items-center justify-center"
                  style={{
                    backgroundColor: isSelected
                      ? `color-mix(in srgb, ${item.accentColor} 20%, transparent)`
                      : "var(--glass-card-bg)",
                    border: `1px solid ${
                      isSelected
                        ? `color-mix(in srgb, ${item.accentColor} 50%, transparent)`
                        : "var(--glass-card-border)"
                    }`,
                    color: isSelected ? item.accentColor : "var(--muted-foreground)",
                    boxShadow: isSelected
                      ? `0 0 12px color-mix(in srgb, ${item.accentColor} 30%, transparent)`
                      : "none",
                  }}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {isSelected && (
                    <span
                      className="absolute -top-1 -right-1 h-2 w-2 rounded-full animate-ping"
                      style={{ backgroundColor: item.accentColor }}
                      aria-hidden
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
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
        <div className="lg:col-span-6 sticky top-28">
          <div className="grid">
            {PAIN_POINTS.map((item) => {
              const isSelected = activePainId === item.id;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={false}
                  animate={{ opacity: isSelected ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  inert={!isSelected}
                  aria-hidden={!isSelected}
                  className="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[380px] col-start-1 row-start-1 pointer-events-none [&:not([inert])]:pointer-events-auto border"
                  style={{
                    borderColor: isSelected
                      ? `color-mix(in srgb, ${item.accentColor} 35%, transparent)`
                      : undefined,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4CAF50]/10 border border-[#4CAF50]/30 font-mono text-[10px] uppercase text-[#4CAF50] font-bold">
                        <Zap className="h-3 w-3" aria-hidden />
                        <span>{t("painpoint.response")}</span>
                      </div>
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase font-bold"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${item.accentColor} 15%, transparent)`,
                          color: item.accentColor,
                          border: `1px solid color-mix(in srgb, ${item.accentColor} 30%, transparent)`,
                        }}
                      >
                        <Sparkles className="h-3 w-3" aria-hidden />
                        <span>{item.sector}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="p-2 rounded-xl"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${item.accentColor} 18%, transparent)`,
                          color: item.accentColor,
                        }}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">
                        {t("painpoint.solution")}
                      </h3>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
                      {item.solution}
                    </p>

                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-[#4CAF50]" aria-hidden />
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {t("painpoint.impact")}
                        </span>
                      </div>
                      <span
                        className="font-display font-bold text-xl"
                        style={{ color: item.accentColor }}
                      >
                        {item.impact}
                      </span>
                    </div>
                  </div>

                  {onNavigateContact && (
                    <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {t("painpoint.cta.hint")}
                      </span>
                      <Button
                        onClick={onNavigateContact}
                        variant="primary"
                        size="sm"
                        icon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}
                        iconPosition="right"
                        className="neon-glow"
                      >
                        {t("painpoint.cta")}
                      </Button>
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
