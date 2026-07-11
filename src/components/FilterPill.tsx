"use client";

import { cn } from "@/lib/utils";

interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** État actif (surligne le filtre). */
  active?: boolean;
  children: React.ReactNode;
}

/**
 * FilterPill — bouton filtre centralisé (style pill arrondie).
 *
 * Utilisé pour :
 *  - Filtres de catégories Blog (Tous, IA, Automatisation, BI, Architecture)
 *
 * L'état `active` remplit la pill en orange brand.
 */
export function FilterPill({
  active = false,
  className,
  children,
  ...props
}: FilterPillProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      className={cn(
        "rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all focus-visible:outline-2 focus-visible:outline-offset-2",
        active
          ? "border-[#F26D3D] bg-[#F26D3D] text-white"
          : "border-white/15 text-slate-400 hover:border-white/40 hover:text-slate-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
