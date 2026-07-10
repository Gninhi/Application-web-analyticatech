"use client";

import { cn } from "@/lib/utils";

interface SnakeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visuelle. Défaut : "primary". */
  variant?: "primary" | "outline" | "ghost";
  /** Taille. Défaut : "md". */
  size?: "sm" | "md" | "lg";
  /** Désactiver l'animation serpent (bordure statique). Défaut : false. */
  noSnake?: boolean;
  children: React.ReactNode;
}

const VARIANTS = {
  primary: "bg-[#F26D3D] text-white hover:bg-[#ff7a4a]",
  outline: "bg-[#F26D3D]/10 text-[#F26D3D] hover:bg-[#F26D3D] hover:text-white",
  ghost: "bg-transparent text-slate-100 hover:bg-white/10",
} as const;

const SIZES = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-sm",
} as const;

/**
 * SnakeButton — bouton premium avec bordure serpent animée.
 *
 * La bordure est un gradient conique qui tourne autour du bouton
 * (effet "serpent qui se mord la queue"). Au survol, l'accélération
 * augmente pour un feedback visuel dynamique.
 *
 * Utilise la classe CSS `.snake-border` (globals.css) + mask compositing.
 */
export function SnakeButton({
  variant = "primary",
  size = "md",
  noSnake = false,
  className,
  children,
  ...props
}: SnakeButtonProps) {
  return (
    <button
      className={cn(
        "snake-border inline-flex items-center justify-center gap-2 rounded-lg font-mono font-semibold uppercase tracking-wider transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        !noSnake && "snake-border",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
