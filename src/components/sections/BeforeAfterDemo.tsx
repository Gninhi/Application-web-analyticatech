"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, XCircle, CheckCircle2, AlertOctagon, Sparkles, TrendingUp } from "lucide-react";
import { MovingButton } from "@/components/interactive/MovingButton";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

interface BeforeAfterDemoProps {
  onNavigateContact?: () => void;
}

export function BeforeAfterDemo({ onNavigateContact }: BeforeAfterDemoProps) {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<"before" | "after">("after");

  return (
    <section className="relative py-12">
      {/* En-tête de section */}
      <div className="max-w-3xl mb-12">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] font-bold">
          {t("home.section.demo")}
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mt-2 tracking-tight">
          {t("home.section.demo.title")}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-4 text-base leading-relaxed">
          {t("home.section.demo.desc")}
        </p>
      </div>

      {/* Switcher Interactif Avant / Après — Style 21st.dev */}
      <div className="flex items-center justify-between mb-8 p-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 max-w-md mx-auto backdrop-blur-md shadow-lg shadow-black/5">
        <button
          type="button"
          onClick={() => setViewMode("before")}
          className={`flex-1 py-2.5 px-4 rounded-full font-mono text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            viewMode === "before"
              ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 shadow-md shadow-red-500/10"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <AlertOctagon className="h-3.5 w-3.5" aria-hidden />
          <span>{t("demo.before.switch")}</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode("after")}
          className={`flex-1 py-2.5 px-4 rounded-full font-mono text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            viewMode === "after"
              ? "bg-[#4CAF50]/15 text-[#4CAF50] border border-[#4CAF50]/30 shadow-md shadow-[#4CAF50]/10"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          <span>{t("demo.after.switch")}</span>
        </button>
      </div>

      {/* Vue Comparative.
        Crossfade "grid-stack" : les vues Avant/Après sont empilées dans la
        même cellule (hauteur = max des vues → zéro saut de mise en page). */}
      <div className="relative overflow-hidden glass-card rounded-3xl p-6 md:p-10 grid border border-black/10 dark:border-white/10 shadow-2xl">
        {(["before", "after"] as const).map((mode) => {
          const isActive = viewMode === mode;
          return (
            <motion.div
              key={mode}
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
              {mode === "before" ? (
                <>
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 mb-4">
                      <AlertOctagon className="h-3.5 w-3.5" aria-hidden />
                      <span>{t("demo.before.label")}</span>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                      {t("demo.before.title")}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                      {t("demo.before.desc")}
                    </p>

                    <div className="space-y-3">
                      {[
                        t("demo.before.point1"),
                        t("demo.before.point2"),
                        t("demo.before.point3"),
                        t("demo.before.point4"),
                      ].map((point, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-red-600 dark:text-red-400 font-medium">
                          <div className="p-1 rounded-full bg-red-500/10 shrink-0">
                            <XCircle className="h-4 w-4 text-red-500" aria-hidden />
                          </div>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-md text-center">
                    <span className="font-mono text-xs uppercase text-slate-500 dark:text-slate-400 block mb-2">{t("demo.before.score")}</span>
                    <div className="font-display text-4xl font-bold text-red-500 my-2">{t("demo.before.verdict")}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t("demo.before.verdict.desc")}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#4CAF50] bg-[#4CAF50]/10 px-3 py-1 rounded-full border border-[#4CAF50]/20 mb-4">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden />
                      <span>{t("demo.after.label")}</span>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                      {t("demo.after.title")}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                      {t("demo.after.desc")}
                    </p>

                    <div className="space-y-3">
                      {[
                        t("demo.after.point1"),
                        t("demo.after.point2"),
                        t("demo.after.point3"),
                        t("demo.after.point4"),
                      ].map((point, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-[#4CAF50] font-medium">
                          <div className="p-1 rounded-full bg-[#4CAF50]/10 shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-[#4CAF50]" aria-hidden />
                          </div>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>

                    {onNavigateContact && (
                      <div className="mt-8">
                        <MovingButton
                          onClick={onNavigateContact}
                          variant="primary"
                          size="md"
                          className="neon-glow"
                        >
                          {t("demo.after.cta")}
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </MovingButton>
                      </div>
                    )}
                  </div>

                  {/* Metrics d'impact */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-[#4CAF50]/30 bg-[#4CAF50]/10 p-5 text-center transition-transform duration-300 hover:scale-[1.02]">
                      <span className="font-mono text-[10px] uppercase text-[#4CAF50] font-bold block">{t("demo.after.m1.label")}</span>
                      <span className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1 block">{t("demo.after.m1.value")}</span>
                    </div>
                    <div className="rounded-2xl border border-[#F26D3D]/30 bg-[#F26D3D]/10 p-5 text-center transition-transform duration-300 hover:scale-[1.02]">
                      <span className="font-mono text-[10px] uppercase text-[#F26D3D] font-bold block">{t("demo.after.m2.label")}</span>
                      <span className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1 block">{t("demo.after.m2.value")}</span>
                    </div>
                    <div className="col-span-2 rounded-2xl border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/5 p-5 text-center transition-transform duration-300 hover:scale-[1.01]">
                      <div className="inline-flex items-center gap-1.5 mb-1">
                        <TrendingUp className="h-3.5 w-3.5 text-[#F26D3D]" aria-hidden />
                        <span className="font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400">{t("demo.after.m3.label")}</span>
                      </div>
                      <span className="font-display text-4xl font-bold text-[#F26D3D] block">{t("demo.after.m3.value")}</span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">{t("demo.after.m3.sub")}</span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
