"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export interface VerticalNavItem {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
}

interface VerticalSectionNavProps {
  items: VerticalNavItem[];
  accentColor?: string;
  className?: string;
}

/**
 * Navigation verticale sticky pour pages de détail (Solutions & Insights).
 * Inspirée du pattern de jauge de scroll verticale (rail continu + progression animée) :
 * - Progression calculée dynamiquement pour chaque section
 * - Puce active avec halo d'accentuation
 * - Clic fluide (smooth scroll) avec décalage de header
 * - Format desktop en colonne latérale sticky et format mobile en tiroir compact
 */
export function VerticalSectionNav({
  items,
  accentColor = "#F26D3D",
  className,
}: VerticalSectionNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [segmentProgress, setSegmentProgress] = useState<Record<string, number>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Cache des positions géométriques des sections pour éliminer les reflows synchrones
  const cachedMetricsRef = useRef<{
    viewportHeight: number;
    docHeight: number;
    sections: { id: string; top: number; height: number }[];
  }>({
    viewportHeight: 0,
    docHeight: 0,
    sections: [],
  });

  const updateCachedMetrics = useCallback(() => {
    if (typeof window === "undefined") return;
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const sections = items.map((item) => {
      const el = document.getElementById(item.id);
      if (!el) return { id: item.id, top: 0, height: 0 };
      const rect = el.getBoundingClientRect();
      return {
        id: item.id,
        top: rect.top + scrollY,
        height: rect.height,
      };
    });
    cachedMetricsRef.current = { viewportHeight, docHeight, sections };
  }, [items]);

  const calculateProgress = useCallback(() => {
    if (typeof window === "undefined") return;

    let { viewportHeight, docHeight, sections } = cachedMetricsRef.current;
    if (viewportHeight === 0 || sections.length === 0) {
      updateCachedMetrics();
      ({ viewportHeight, docHeight, sections } = cachedMetricsRef.current);
    }

    const scrollY = window.scrollY;
    const triggerOffset = Math.min(220, viewportHeight * 0.3);

    const progressMap: Record<string, number> = {};
    let currentActive = items[0]?.id ?? "";

    sections.forEach((sec, index) => {
      if (sec.height <= 0) {
        progressMap[sec.id] = 0;
        return;
      }

      const relativeTop = sec.top - scrollY;

      // Calcul du pourcentage de lecture de cette section
      if (relativeTop > triggerOffset) {
        progressMap[sec.id] = 0;
      } else if (relativeTop + sec.height <= triggerOffset) {
        progressMap[sec.id] = 100;
      } else {
        const traversed = triggerOffset - relativeTop;
        const pct = Math.min(100, Math.max(0, Math.round((traversed / sec.height) * 100)));
        progressMap[sec.id] = pct;
        currentActive = sec.id;
      }

      if (relativeTop <= triggerOffset && (index === sections.length - 1 || (relativeTop + sec.height > triggerOffset))) {
        currentActive = sec.id;
      }
    });

    // Cas particulier : fin de page
    const scrollBottom = scrollY + viewportHeight;
    if (docHeight - scrollBottom < 80 && items.length > 0) {
      currentActive = items[items.length - 1].id;
      progressMap[currentActive] = 100;
    }

    setActiveId((prev) => (prev === currentActive ? prev : currentActive));
    setSegmentProgress((prev) => {
      const keysA = Object.keys(prev);
      const keysB = Object.keys(progressMap);
      if (keysA.length === keysB.length && keysB.every((k) => prev[k] === progressMap[k])) {
        return prev;
      }
      return progressMap;
    });
  }, [items, updateCachedMetrics]);

  useEffect(() => {
    updateCachedMetrics();

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(calculateProgress);
    };

    const handleResize = () => {
      updateCachedMetrics();
      handleScroll();
    };

    // Calcul initial différé via rAF pour respecter le lint react-hooks/set-state-in-effect
    const initTimer = requestAnimationFrame(() => {
      updateCachedMetrics();
      calculateProgress();
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(initTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateProgress, updateCachedMetrics]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const y = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({
      top: Math.max(0, y),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    setMobileOpen(false);
  };

  const activeIndex = items.findIndex((i) => i.id === activeId);
  const activeItem = items[activeIndex] ?? items[0];

  return (
    <>
      {/* ================= VERSION DESKTOP : RAIL VERTICAL STICKY ================= */}
      <nav
        aria-label="Sommaire vertical interactif"
        className={cn(
          "w-full select-none",
          className
        )}
      >
        <div className="flex flex-col space-y-1">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-4 px-2">
            SOMMAIRE //
          </p>

          {items.map((item, index) => {
            const isCurrent = activeId === item.id;
            const progress = segmentProgress[item.id] ?? 0;
            const isCompleted = progress >= 100;
            const isPassed = index < activeIndex;
            const isLast = index === items.length - 1;

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                aria-current={isCurrent ? "location" : undefined}
                className="group cursor-pointer flex flex-col w-full text-left relative py-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26D3D]/50 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  {/* Rail vertical avec jauge & puce */}
                  <div className="relative flex flex-col items-center shrink-0 w-6">
                    {/* Puce d'étape */}
                    <div
                      className={cn(
                        "relative z-10 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300",
                        isCurrent
                          ? "border-[#F26D3D] bg-[#F26D3D] shadow-sm shadow-[#F26D3D]/50 scale-110"
                          : isCompleted || isPassed
                          ? "border-[#F26D3D] bg-[#F26D3D]"
                          : "border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900"
                      )}
                      style={{
                        borderColor: isCurrent || isCompleted || isPassed ? accentColor : undefined,
                        backgroundColor: isCurrent || isCompleted || isPassed ? accentColor : undefined,
                      }}
                    >
                      {/* Micro dot central */}
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-transform",
                          isCurrent
                            ? "bg-white scale-100"
                            : isCompleted || isPassed
                            ? "bg-white/80 scale-75"
                            : "bg-slate-400/40 dark:bg-white/30 scale-50"
                        )}
                      />
                    </div>

                    {/* Rail vertical reliant à l'étape suivante */}
                    {!isLast && (
                      <div className="w-[2px] h-12 relative my-1 overflow-hidden bg-slate-200 dark:bg-white/10 rounded-full">
                        <div
                          className="w-full transition-all duration-150 ease-out"
                          style={{
                            height: `${isPassed ? 100 : progress}%`,
                            backgroundColor: accentColor,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Contenu textuel */}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={cn(
                          "font-mono text-[11px] font-bold tracking-wider transition-colors duration-200",
                          isCurrent
                            ? "text-[#F26D3D]"
                            : isCompleted || isPassed
                            ? "text-slate-700 dark:text-slate-300"
                            : "text-slate-400 dark:text-slate-600"
                        )}
                        style={{
                          color: isCurrent ? accentColor : undefined,
                        }}
                      >
                        {item.number}
                      </span>
                      <h4
                        className={cn(
                          "text-xs font-medium tracking-tight transition-colors duration-200 truncate",
                          isCurrent
                            ? "font-bold text-slate-900 dark:text-white"
                            : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                        )}
                      >
                        {item.title}
                      </h4>
                    </div>

                    {item.subtitle && (
                      <p
                        className={cn(
                          "text-[10px] font-mono tracking-tight mt-0.5 truncate transition-opacity duration-200",
                          isCurrent
                            ? "text-slate-600 dark:text-slate-400 opacity-100"
                            : "text-slate-400 dark:text-slate-500 opacity-60 group-hover:opacity-100"
                        )}
                      >
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ================= VERSION MOBILE / TABLETTE : PILULE FLOTTANTE DISCRÈTE ================= */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <div className="relative">
          {/* Menu déroulant compact */}
          {mobileOpen && (
            <div className="absolute bottom-14 right-0 w-64 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0A0D14]/95 backdrop-blur-xl p-3 shadow-2xl space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2 py-1">
                SECTIONS //
              </p>
              {items.map((item) => {
                const isCurrent = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-colors",
                      isCurrent
                        ? "bg-[#F26D3D]/10 text-[#F26D3D] font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    )}
                  >
                    <span className="truncate">
                      <span className="mr-2 text-slate-400 dark:text-slate-500 font-normal">
                        {item.number}.
                      </span>
                      {item.title}
                    </span>
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F26D3D] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Bouton pilule flottant */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/15 bg-white/90 dark:bg-[#06070B]/90 backdrop-blur-md px-3.5 py-2 shadow-lg shadow-black/10 text-xs font-mono text-slate-800 dark:text-slate-200 hover:border-[#F26D3D]/50 transition-all active:scale-95"
            aria-label="Ouvrir le sommaire des sections"
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: accentColor }}
            />
            <span className="font-bold text-[#F26D3D]">
              {activeItem?.number ?? "01"}
            </span>
            <span className="truncate max-w-[120px]">
              {activeItem?.title ?? "Sommaire"}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                mobileOpen && "rotate-180"
              )}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </>
  );
}
