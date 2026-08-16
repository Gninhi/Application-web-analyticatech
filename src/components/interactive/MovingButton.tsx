"use client";

import { forwardRef } from "react";
import { AnimatedButtonBorder } from "@/components/ui/button-border";
import { cn } from "@/lib/utils/cn";

interface MovingButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  /** Variante visuelle. Défaut : "primary". */
  variant?: "primary" | "outline" | "ghost" | "subtle";
  /** Taille. Défaut : "md". Ignorée quand `iconOnly` est vrai. */
  size?: "sm" | "md" | "lg";
  /**
   * Mode icône seule : supprime le padding horizontal/vertical.
   * Le bouton prend alors exactement les dimensions fournies via
   * `className` (ex. `h-10 w-10`), centrées par `inline-flex`.
   */
  iconOnly?: boolean;
  /** Rayon de bordure. Défaut : "0.75rem" (équivalent de rounded-lg). */
  borderRadius?: string;
  /** Durée d'un tour du faisceau en ms. Défaut : 3000. */
  duration?: number;
  children: React.ReactNode;
}

const VARIANTS = {
  primary:
    "bg-[#C9470F] text-white hover:bg-[#B63C0C] border-transparent",
  outline:
    "bg-[#F26D3D]/10 text-[#F26D3D] hover:bg-[#F26D3D] hover:text-white border-transparent",
  ghost:
    "bg-[#03318C]/8 text-[#03318C] dark:text-slate-100 hover:bg-[#03318C]/15 dark:hover:bg-white/15 border-transparent",
  subtle:
    "bg-[#03318C]/10 text-[#03318C] dark:text-slate-100 hover:bg-[#03318C]/20 dark:hover:bg-white/20 border-transparent",
} as const;

const SIZES = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
} as const;

/** Convertit un rayon CSS ("0.75rem", "16px") en pixels pour le offset-path. */
function radiusToPx(radius: string): number {
  const n = parseFloat(radius);
  if (Number.isNaN(n)) return 12;
  return radius.endsWith("rem") ? Math.round(n * 16) : Math.round(n);
}

/**
 * MovingButton — bouton premium centralisé à bordure animée.
 *
 * Composant unique pour tous les boutons du site (CTA, formulaire, icônes,
 * basculeurs…). Le faisceau dégradé (AnimatedButtonBorder) parcourt le
 * contour via offset-path. Les couleurs de fond/texte restent celles des
 * variantes (primary, outline, ghost, subtle) : seuls l'anneau et son
 * faisceau bougent.
 *
 * Utilisation :
 *   <MovingButton variant="primary" size="lg" onClick={...}>
 *     Explorer nos services <ArrowRight className="h-4 w-4" />
 *   </MovingButton>
 *
 *   <MovingButton iconOnly className="h-10 w-10" onClick={...}>
 *     <Menu className="h-5 w-5" />
 *   </MovingButton>
 */
export const MovingButton = forwardRef<HTMLButtonElement, MovingButtonProps>(
  function MovingButton(
    {
      variant = "primary",
      size = "md",
      iconOnly = false,
      borderRadius = "0.75rem",
      duration = 3000,
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-mono font-semibold uppercase tracking-wider transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent",
          !iconOnly && SIZES[size],
          VARIANTS[variant],
          className
        )}
        style={{ borderRadius }}
        {...props}
      >
        <AnimatedButtonBorder
          borderRadius={radiusToPx(borderRadius)}
          duration={duration / 1000}
        />
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

export default MovingButton;
