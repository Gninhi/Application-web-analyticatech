"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FlaskConical, Factory, TrendingUp, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { MovingButton } from "@/components/interactive/MovingButton";
import { MethodOrbit } from "@/components/sections/MethodOrbit";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

export interface MethodStep {
  number: string;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  result: string;
  deliverables: string[];
  icon: typeof Search;
  color: string;
  duration: string;
}

/* 4 phases en orbite : icônes + couleurs d'accent alignées sur la palette
   des piliers (le vert #43A047 disparaît avec le service 02 — la palette est
   rééquilibrée : orange marque / bleu agents / violet data / ambre). */
const STEP_ICONS = [Search, FlaskConical, Factory, TrendingUp];
const STEP_COLORS = ["#F26D3D", "#38BDF8", "#A855F7", "#F59E0B"];

interface AgentoryMethodProps {
  onNavigateContact?: () => void;
}

export function AgentoryMethod({ onNavigateContact }: AgentoryMethodProps) {
  const { t } = useI18n();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const METHOD_STEPS: MethodStep[] = Array.from({ length: 4 }, (_, i) => {
    const n = i + 1;
    return {
      number: `0${n}`,
      phase: t(`method.step${n}.phase`),
      title: t(`method.step${n}.title`),
      subtitle: t(`method.step${n}.subtitle`),
      description: t(`method.step${n}.desc`),
      result: t(`method.step${n}.result`),
      deliverables: [
        t(`method.step${n}.deliverable1`),
        t(`method.step${n}.deliverable2`),
        t(`method.step${n}.deliverable3`),
      ],
      icon: STEP_ICONS[i],
      color: STEP_COLORS[i],
      duration: t(`method.step${n}.duration`),
    };
  });

  return (
    <section className="relative py-12">
      {/* En-tête de section style Agentory */}
      <div className="max-w-3xl mb-12">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] font-bold">
          {t("home.section.method")}
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mt-2 tracking-tight leading-tight">
          {t("home.section.method.title")}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-4 text-base leading-relaxed">
          {t("home.section.method.desc")}
        </p>
      </div>

      <div className="grid items-center gap-10 lg:grid-cols-12">
        {/* === Orbite (desktop) : les 4 phases gravitent autour du hub === */}
        <div className="lg:col-span-5">
          <MethodOrbit
            nodes={METHOD_STEPS.map((s) => ({
              number: s.number,
              title: s.title,
              duration: s.duration,
              icon: s.icon,
              color: s.color,
            }))}
            activeIndex={activeStepIndex}
            onSelect={setActiveStepIndex}
            centerLabel={t("home.section.method")}
          />
        </div>

        {/* === Stepper mobile/tablette (l'orbite est masquée sous lg) === */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:hidden">
          {METHOD_STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            const StepIcon = step.icon;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStepIndex(idx)}
                className={`relative flex flex-col p-4 rounded-2xl border text-left transition-all duration-300 ${
                  isActive
                    ? "border-[#F26D3D] glass-strong shadow-lg shadow-[#F26D3D]/10"
                    : "glass hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isActive ? "text-[#F26D3D]" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {step.number}
                  </span>
                  <StepIcon
                    className={`h-4 w-4 ${
                      isActive ? "text-[#F26D3D]" : "text-slate-500 dark:text-slate-400"
                    }`}
                    aria-hidden
                  />
                </div>
                <span className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                  {step.title}
                </span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {step.duration}
                </span>
              </button>
            );
          })}
        </div>

        {/* === Panneau de détail — crossfade grid-stack (hauteur stable) === */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden glass-card rounded-3xl p-6 md:p-10 grid">
            {METHOD_STEPS.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <motion.div
                  key={step.number}
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  inert={!isActive}
                  className={cn(
                    "col-start-1 row-start-1 grid lg:grid-cols-12 gap-8 items-center",
                    !isActive && "pointer-events-none"
                  )}
                  aria-hidden={!isActive}
                >
                  {/* Colonne gauche : Description & Phase */}
                  <div className="lg:col-span-7">
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4 border"
                      style={{
                        color: step.color,
                        background: `color-mix(in srgb, ${step.color} 10%, transparent)`,
                        borderColor: `color-mix(in srgb, ${step.color} 25%, transparent)`,
                      }}
                    >
                      {step.phase}
                    </span>

                    <h3 className="font-display text-2xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                      {step.number}. {step.title}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                      {step.subtitle}
                    </p>

                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Pill de résultat explicite (Exigence Blueprint) */}
                    <div className="p-4 rounded-2xl border border-[#4CAF50]/30 bg-[#4CAF50]/10 flex items-start gap-3 mb-6">
                      <ShieldCheck className="h-5 w-5 text-[#4CAF50] shrink-0 mt-0.5" aria-hidden />
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#4CAF50] font-bold block">
                          {t("method.result")}
                        </span>
                        <span className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                          {step.result}
                        </span>
                      </div>
                    </div>

                    {onNavigateContact && (
                      <MovingButton
                        onClick={onNavigateContact}
                        variant="primary"
                        size="md"
                        className="neon-glow"
                      >
                        {t("method.cta")}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </MovingButton>
                    )}
                  </div>

                  {/* Colonne droite : Liste des Livrables Clés */}
                  <div className="lg:col-span-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 backdrop-blur-md">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-300 block mb-4 border-b border-black/10 dark:border-white/10 pb-2">
                      {t("method.deliverables")}
                    </span>
                    <ul className="space-y-3">
                      {step.deliverables.map((deliv, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-800 dark:text-slate-200 font-medium">
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-full shrink-0"
                            style={{
                              background: `color-mix(in srgb, ${step.color} 20%, transparent)`,
                              color: step.color,
                            }}
                          >
                            <Check className="h-3 w-3" aria-hidden />
                          </span>
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span>{t("method.duration")}</span>
                      <span className="font-bold" style={{ color: step.color }}>
                        {step.duration}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
