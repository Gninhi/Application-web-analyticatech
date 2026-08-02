"use client";

import { Button } from "@/components/ui/moving-border";
import { cn } from "@/lib/utils/cn";

interface MovingButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  /** Variante visuelle. Défaut : "primary". */
  variant?: "primary" | "outline" | "ghost" | "subtle";
  /** Taille. Défaut : "md". */
  size?: "sm" | "md" | "lg";
  /** Rayon de bordure. Défaut : "0.75rem" (équivalent de rounded-lg). */
  borderRadius?: string;
  /** Durée d'un tour de la bordure lumineuse en ms. Défaut : 3000. */
  duration?: number;
  children: React.ReactNode;
}

const VARIANTS = {
  primary:
    "bg-[#F26D3D] text-white hover:bg-[#ff7a4a] border-transparent",
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

/**
 * MovingButton — bouton premium centralisé avec bordure lumineuse animée.
 *
 * Remplace l'ancien SnakeButton : la bordure suit un point lumineux qui
 * parcourt le contour du bouton (orange → bleu, palette signature).
 *
 * Le span interne est `inline-flex items-center gap-2` pour garantir
 * que les icônes restent alignées horizontalement avec le texte,
 * peu importe le contenu passé en `children`.
 *
 * Utilisation :
 *   <MovingButton variant="primary" size="lg" onClick={...}>
 *     Explorer nos services <ArrowRight className="h-4 w-4" />
 *  </MovingButton>
 */
export function MovingButton({
  variant = "primary",
  size = "md",
  borderRadius = "0.75rem",
  duration = 3000,
  className,
  children,
  ...props
}: MovingButtonProps) {
  return (
    <Button
      borderRadius={borderRadius}
      duration={duration}
      className={cn(
        "font-mono font-semibold uppercase tracking-wider transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
     </span>
   </Button>
  );
}

export default MovingButton;
