"use client";

import { cn } from "@/lib/utils/cn";

interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** État actif (surligne le filtre). */
  active?: boolean;
  /** Couleur hex d'accent de la catégorie — affiche un glyphe losange (variante pill). */
  dotColor?: string;
  /**
   * `pill` (défaut) : pilule autonome, mono capitales.
   * `segment` : segment d'un commutateur compact, casse normale, à placer dans `FilterSegmentGroup`.
   */
  variant?: "pill" | "segment";
  children: React.ReactNode;
}

/**
 * FilterPill — bouton filtre centralisé.
 *
 * Utilisé pour :
 *  - Filtres de catégories Blog (Tous, IA, Automatisation, BI, Architecture) — variante `pill`
 *  - Filtre des services de l'accueil — variante `segment` dans `FilterSegmentGroup`
 *
 * Variante `pill` : l'état `active` remplit la pill en orange brand ; un `dotColor`
 * optionnel ajoute un glyphe losange teinté.
 * Variante `segment` : l'actif ressort en verre dans la piste, marqué d'un point orange.
 */
export function FilterPill({
  active = false,
  dotColor,
  variant = "pill",
  className,
  children,
  ...props
}: FilterPillProps) {
  if (variant === "segment") {
    return (
      <button
        type="button"
        role="tab"
        aria-selected={active}
        className={cn(
          "inline-flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-[background-color,color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-ink)]",
          active
            ? "bg-white text-[#011C40] shadow-[0_1px_2px_rgba(3,49,140,0.12),0_0_0_1px_rgba(3,49,140,0.14)] dark:bg-white/[0.13] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_0_1px_rgba(255,255,255,0.1)]"
            : "text-slate-600 hover:text-[#011C40] dark:text-[#B6C2D6] dark:hover:text-white",
          className
        )}
        {...props}
      >
        {active && dotColor && <span className="h-1.5 w-1.5 rounded-full bg-[#F26D3D]" aria-hidden />}
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(
        "rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all focus-visible:outline-2 focus-visible:outline-offset-2 inline-flex items-center gap-2",
        active
          ? "border-[#E35F31] bg-[#E35F31] text-slate-950"
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

interface FilterSegmentGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Nom accessible de la liste d'onglets. */
  label: string;
  children: React.ReactNode;
}

/**
 * FilterSegmentGroup — piste de verre d'un commutateur segmenté (une seule ligne).
 * Sur écran étroit, la piste défile horizontalement au lieu de passer à la ligne.
 */
export function FilterSegmentGroup({ label, className, children, ...props }: FilterSegmentGroupProps) {
  return (
    <div className={cn("max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}>
      <div
        role="tablist"
        aria-label={label}
        className="inline-flex items-center gap-1 rounded-full border border-[rgba(3,49,140,0.12)] bg-white/70 p-1 shadow-[inset_0_1px_0_#fff] dark:border-white/12 dark:bg-white/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
