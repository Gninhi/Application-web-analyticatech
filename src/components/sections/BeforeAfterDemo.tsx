"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { ArrowRight, XCircle, CheckCircle2, AlertOctagon, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

interface BeforeAfterDemoProps {
  onNavigateContact?: () => void;
}

export function BeforeAfterDemo({ onNavigateContact }: BeforeAfterDemoProps) {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<"before" | "after">("after");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX !== null && e.changedTouches[0]) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX > 40) {
        // Swipe droite -> bascule vers "before"
        setViewMode("before");
      } else if (deltaX < -40) {
        // Swipe gauche -> bascule vers "after"
        setViewMode("after");
      }
    }
    setTouchStartX(null);
  };

  return (
    <section className="relative py-8 sm:py-12">
      {/* En-tête de section */}
      <div className="max-w-3xl mb-8 sm:mb-12">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent-ink font-semibold">
          {t("home.section.demo")}
        </span>
        <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mt-2 tracking-tight">
          {t("home.section.demo.title")}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed">
          {t("home.section.demo.desc")}
        </p>
      </div>

      {/* Switcher Interactif Avant / Après — Style 21st.dev responsive */}
      <div
        className="flex items-center justify-between mb-6 sm:mb-8 p-1 sm:p-1.5 rounded-2xl sm:rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 max-w-md mx-auto backdrop-blur-md shadow-lg shadow-black/5"
        role="tablist"
        aria-label={t("home.section.demo.title")}
      >
        <button
          type="button"
          role="tab"
          aria-selected={viewMode === "before"}
          onClick={() => setViewMode("before")}
          className={`flex-1 min-h-[44px] py-2 px-2.5 sm:px-4 rounded-xl sm:rounded-full font-mono text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-center leading-snug cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${
            viewMode === "before"
              ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 shadow-md shadow-red-500/10"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <AlertOctagon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{t("demo.before.switch")}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={viewMode === "after"}
          onClick={() => setViewMode("after")}
          className={`flex-1 min-h-[44px] py-2 px-2.5 sm:px-4 rounded-xl sm:rounded-full font-mono text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-center leading-snug cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${
            viewMode === "after"
              ? "bg-link/15 text-link border border-link/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{t("demo.after.switch")}</span>
        </button>
      </div>

      {/* Vue Comparative.
        Crossfade "grid-stack" : les vues Avant/Après sont empilées dans la
        même cellule (hauteur = max des vues → zéro saut de mise en page). */}
      <div
        className="relative overflow-hidden glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 grid border border-black/10 dark:border-white/10 shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {(["before", "after"] as const).map((mode) => {
          const isActive = viewMode === mode;
          return (
            <m.div
              key={mode}
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              inert={!isActive}
              className={cn(
                "col-start-1 row-start-1 grid lg:grid-cols-12 gap-6 lg:gap-8 items-start lg:items-center",
                !isActive && "pointer-events-none"
              )}
              aria-hidden={!isActive}
            >
              {mode === "before" ? (
                <>
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-red-500 bg-red-500/10 px-2.5 sm:px-3 py-1 rounded-full border border-red-500/20 mb-3 sm:mb-4">
                      <AlertOctagon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span>{t("demo.before.label")}</span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2.5 sm:mb-3 leading-snug">
                      {t("demo.before.title")}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-6">
                      {t("demo.before.desc")}
                    </p>

                    <div className="space-y-2.5 sm:space-y-3">
                      {[
                        t("demo.before.point1"),
                        t("demo.before.point2"),
                        t("demo.before.point3"),
                        t("demo.before.point4"),
                      ].map((point, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">
                          <div className="p-0.5 sm:p-1 rounded-full bg-red-500/10 shrink-0">
                            <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" aria-hidden />
                          </div>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 w-full rounded-xl sm:rounded-2xl border border-red-500/20 bg-red-500/5 p-4 sm:p-6 backdrop-blur-md text-center">
                    <span className="font-mono text-[10px] sm:text-xs uppercase text-slate-600 dark:text-slate-400 block mb-1.5 sm:mb-2">{t("demo.before.score")}</span>
                    <div className="font-display text-3xl sm:text-4xl font-bold text-red-500 my-1.5 sm:my-2">{t("demo.before.verdict")}</div>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t("demo.before.verdict.desc")}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-link bg-link/10 px-2.5 sm:px-3 py-1 rounded-full border border-link/20 mb-3 sm:mb-4">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span>{t("demo.after.label")}</span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2.5 sm:mb-3 leading-snug">
                      {t("demo.after.title")}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-6">
                      {t("demo.after.desc")}
                    </p>

                    <div className="space-y-2.5 sm:space-y-3">
                      {[
                        t("demo.after.point1"),
                        t("demo.after.point2"),
                        t("demo.after.point3"),
                        t("demo.after.point4"),
                      ].map((point, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-link font-medium">
                          <div className="p-0.5 sm:p-1 rounded-full bg-link/10 shrink-0">
                            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-link" aria-hidden />
                          </div>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA sur Desktop : reste en bas de la colonne de gauche */}
                    {onNavigateContact && (
                      <div className="mt-8 hidden lg:block">
                        <Button
                          onClick={onNavigateContact}
                          variant="primary"
                          size="md"
                          icon={<ArrowRight className="h-4 w-4" aria-hidden />}
                          iconPosition="right"
                          className="neon-glow"
                        >
                          {t("demo.after.cta")}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Metrics d'impact */}
                  <div className="lg:col-span-5 w-full flex flex-col">
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
                      <div className="rounded-xl sm:rounded-2xl border border-link/30 bg-link/10 p-3 sm:p-4 lg:p-5 text-center transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-center">
                        <span className="font-mono text-[9px] sm:text-[10px] uppercase text-link font-semibold block leading-tight">{t("demo.after.m1.label")}</span>
                        <span className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1 block">{t("demo.after.m1.value")}</span>
                      </div>
                      <div className="rounded-xl sm:rounded-2xl border border-[#F26D3D]/30 bg-[#F26D3D]/10 p-3 sm:p-4 lg:p-5 text-center transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-center">
                        <span className="font-mono text-[9px] sm:text-[10px] uppercase text-accent-ink font-semibold block leading-tight">{t("demo.after.m2.label")}</span>
                        <span className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1 block">{t("demo.after.m2.value")}</span>
                      </div>
                      <div className="col-span-2 rounded-xl sm:rounded-2xl border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/5 p-3.5 sm:p-5 text-center transition-transform duration-300 hover:scale-[1.01]">
                        <div className="inline-flex items-center gap-1.5 mb-1">
                          <TrendingUp className="h-3.5 w-3.5 text-accent-ink shrink-0" aria-hidden />
                          <span className="font-mono text-[9px] sm:text-[10px] uppercase text-slate-600 dark:text-slate-400">{t("demo.after.m3.label")}</span>
                        </div>
                        <span className="font-display text-3xl sm:text-4xl font-bold text-accent-ink block">{t("demo.after.m3.value")}</span>
                        <span className="font-mono text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 sm:mt-1 block">{t("demo.after.m3.sub")}</span>
                      </div>
                    </div>

                    {/* CTA sur Mobile : repositionné après les métriques, centré et pleine largeur */}
                    {onNavigateContact && (
                      <div className="mt-5 sm:mt-6 block lg:hidden w-full">
                        <Button
                          onClick={onNavigateContact}
                          variant="primary"
                          size="md"
                          icon={<ArrowRight className="h-4 w-4 shrink-0" aria-hidden />}
                          iconPosition="right"
                          className="neon-glow w-full justify-center min-h-[44px] py-3 px-4 text-xs font-mono uppercase tracking-wider text-center"
                        >
                          <span className="truncate">{t("demo.after.cta")}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </m.div>
          );
        })}
      </div>
    </section>
  );
}
