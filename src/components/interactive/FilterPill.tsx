"use client";

import { cn } from "@/lib/utils/cn";

interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** État actif (surligne le filtre). */
  active?: boolean;
  /** Couleur hex d'accent de la catégorie — affiche un glyphe losange. */
  dotColor?: string;
  children: React.ReactNode;
}

/**
 * FilterPill — bouton filtre centralisé (style pill arrondie).
 *
 * Utilisé pour :
 *  - Filtres de catégories Blog (Tous, IA, Automatisation, BI, Architecture)
 *
 * L'état `active` remplit la pill en orange brand. Un `dotColor` optionnel
 * ajoute un glyphe losange teinté (accent par catégorie).
 */
export function FilterPill({
  active = false,
  dotColor,
  className,
  children,
  ...props
}: FilterPillProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(
        "rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all focus-visible:outline-2 focus-visible:outline-offset-2 inline-flex items-center gap-2",
        active
          ? "border-[#C9470F] bg-[#C9470F] text-white"
          : "border-black/15 dark:border-white/15 text-slate-600 dark:text-slate-300 hover:border-black/40 dark:hover:border-white/40 hover:text-slate-900 dark:hover:text-white",
        className
      )}
      {...props}
    >
      {dotColor && (
        <span
          className={cn("h-1 w-1 rotate-45 transition-opacity", active ? "opacity-100" : "opacity-60")}
          style={{ background: dotColor }}
          aria-hidden
        />
      )}
      {children}
    </button>
  );
}
