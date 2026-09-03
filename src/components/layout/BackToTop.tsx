"use client";

import { ArrowUp } from "lucide-react";
import { useScrollProgress } from "@/hooks/useScrollState";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils/cn";

/**
 * BackToTop — Bouton flottant "retour en haut de page" repensé :
 *
 * 1. Anneau SVG de progression circulaire (0% à 100% calculé en temps réel via rAF).
 * 2. Design system cohérent (Cyber-Glass, accent #F26D3D, dark/light mode harmonieux).
 * 3. Micro-interaction : arrow translate-y au hover + tooltip pill avec pourcentage exact.
 * 4. Accessibilité WCAG : aria-label i18n, gestion du focus sur #main-content,
 *    respect de prefers-reduced-motion, et neutralisation du tabIndex hors écran.
 */
export function BackToTop() {
  const { progress, visible } = useScrollProgress();
  const { t } = useI18n();

  const scrollToTop = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "instant" : "smooth",
    });

    // Déplacement accessible du focus vers le conteneur principal
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus({ preventScroll: true });
    }
  };

  // Paramètres géométriques du cercle de progression
  const radius = 20;
  const circumference = 2 * Math.PI * radius; // ~125.66
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 transition-all duration-300 ease-out select-none",
        visible
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-75 translate-y-4 pointer-events-none"
      )}
      aria-hidden={!visible}
    >
      <div className="relative group flex items-center justify-center">
        {/* Tooltip flottant révélant le pourcentage de progression au hover */}
        <div
          role="tooltip"
          className="pointer-events-none absolute -top-10 right-0 hidden sm:flex items-center gap-1.5 whitespace-nowrap rounded-full border border-black/10 dark:border-white/15 bg-white/95 dark:bg-[#07090E]/95 backdrop-blur-md px-3 py-1 text-[11px] font-mono text-slate-700 dark:text-slate-200 opacity-0 -translate-y-1 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
        >
          <span className="font-bold text-[#F26D3D]">{progress}%</span>
          <span className="text-slate-400">·</span>
          <span>{t("common.backToTop")}</span>
        </div>

        {/* Bouton principal cliquable */}
        <button
          type="button"
          onClick={scrollToTop}
          tabIndex={visible ? 0 : -1}
          aria-label={`${t("common.backToTop")} (${progress}%)`}
          title={`${t("common.backToTop")} (${progress}%)`}
          className={cn(
            "relative flex h-12 w-12 items-center justify-center rounded-full cursor-pointer",
            "bg-white/90 dark:bg-[#07090E]/90 backdrop-blur-md",
            "border border-slate-200 dark:border-white/10",
            "shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
            "hover:border-[#F26D3D]/60 hover:shadow-[0_0_24px_rgba(242,109,61,0.35)]",
            "active:scale-90 transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26D3D] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#07090E]"
          )}
        >
          {/* Anneau SVG de progression circulaire */}
          <svg
            className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            {/* Piste d'arrière-plan */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="stroke-slate-300/40 dark:stroke-white/10"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Piste de progression active en orange de marque */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="stroke-[#F26D3D] transition-[stroke-dashoffset] duration-150 ease-out"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              fill="none"
            />
          </svg>

          {/* Icône de flèche avec micro-animation fluide vers le haut au survol */}
          <ArrowUp
            className="h-5 w-5 text-slate-700 dark:text-slate-200 group-hover:text-[#F26D3D] group-hover:-translate-y-0.5 transition-all duration-200"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
