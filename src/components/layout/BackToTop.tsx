"use client";

import { ArrowUp } from "lucide-react";
import { useScrollVisibility } from "@/hooks/useScrollState";
import { MovingButton } from "@/components/interactive/MovingButton";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils/cn";

/**
 * BackToTop — bouton flottant "retour vers le haut".
 *
 * Apparaît après un scroll de 600px (SCROLL_THRESHOLDS.backToTop).
 * Disparaît en animation CSS fluide quand l'utilisateur remonte en haut.
 * Smooth scroll natif du navigateur (respecte prefers-reduced-motion).
 *
 * Optimisé CSS pur (zéro runtime Framer Motion).
 */
export function BackToTop() {
  const visible = useScrollVisibility();
  const { t } = useI18n();

  const scrollToTop = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-40 transition-all duration-300 ease-out",
        visible
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-75 translate-y-4 pointer-events-none"
      )}
      aria-hidden={!visible}
    >
      <MovingButton
        onClick={scrollToTop}
        aria-label={t("common.backToTop")}
        iconOnly
        borderRadius="9999px"
        duration={2500}
        tabIndex={visible ? 0 : -1}
        className="h-12 w-12 bg-[#C9470F] text-white shadow-lg shadow-black/40 hover:bg-[#B63C0C] neon-glow focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <ArrowUp className="h-5 w-5" aria-hidden />
      </MovingButton>
    </div>
  );
}
