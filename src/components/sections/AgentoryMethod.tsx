"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Map, Cpu, Rocket, BarChart3, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { MovingButton } from "@/components/interactive/MovingButton";
import { useI18n } from "@/lib/i18n/provider";

export interface MethodStep {
  number: string;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  result: string;
  deliverables: string[];
  icon: typeof Search;
  duration: string;
}

const STEP_ICONS = [Search, Map, Cpu, Rocket, BarChart3];

interface AgentoryMethodProps {
  onNavigateContact?: () => void;
}

export function AgentoryMethod({ onNavigateContact }: AgentoryMethodProps) {
  const { t } = useI18n();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const METHOD_STEPS: MethodStep[] = Array.from({ length: 5 }, (_, i) => {
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
      duration: t(`method.step${n}.duration`),
    };
  });
  const activeStep = METHOD_STEPS[activeStepIndex];

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

      {/* Barre de navigation des 5 étapes pas-à-pas (Tabs Agentory) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {METHOD_STEPS.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const StepIcon = step.icon;
          return (
            <button
              key={step.number}
              onClick={() => setActiveStepIndex(idx)}
              onMouseEnter={() => setActiveStepIndex(idx)}
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

              {/* Ligne active en bas */}
              {isActive && (
                <motion.div
                  layoutId="activeMethodTab"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#F26D3D] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Detail Card Principale Style Agentory */}
      <div className="relative overflow-hidden glass-card rounded-3xl p-6 md:p-10">
        {/* Halos ambiants assortis */}
        <div
          className="pointer-events-none absolute -top-28 -right-20 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(242,109,61,0.45) 0%, transparent 70%)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(43,109,224,0.45) 0%, transparent 70%)" }}
          aria-hidden
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.number}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-12 gap-8 items-center"
          >
            {/* Colonne gauche : Description & Phase */}
            <div className="lg:col-span-7">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#F26D3D] px-3 py-1 rounded-full bg-[#F26D3D]/10 inline-block mb-4 border border-[#F26D3D]/20">
                {activeStep.phase}
              </span>

              <h3 className="font-display text-2xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                0{activeStepIndex + 1}. {activeStep.title} — {activeStep.subtitle}
              </h3>

              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {activeStep.description}
              </p>

              {/* Pill de résultat explicite (Exigence Blueprint) */}
              <div className="p-4 rounded-2xl border border-[#4CAF50]/30 bg-[#4CAF50]/10 flex items-start gap-3 mb-6">
                <ShieldCheck className="h-5 w-5 text-[#4CAF50] shrink-0 mt-0.5" aria-hidden />
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#4CAF50] font-bold block">
                    {t("method.result")}
                  </span>
                  <span className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                    {activeStep.result}
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
                {activeStep.deliverables.map((deliv, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-800 dark:text-slate-200 font-medium">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F26D3D]/20 text-[#F26D3D] shrink-0">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>{t("method.duration")}</span>
                <span className="text-[#F26D3D] font-bold">{activeStep.duration}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
