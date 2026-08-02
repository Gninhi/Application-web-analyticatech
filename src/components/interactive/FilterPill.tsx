"use client";

import { cn } from "@/lib/utils/cn";

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
          : "border-black/15 dark:border-white/15 text-slate-500 dark:text-slate-300 hover:border-black/40 dark:hover:border-white/40 hover:text-slate-700 dark:hover:text-slate-700 dark:text-slate-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
