"use client";

import { cn } from "@/lib/utils";

interface NavLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** État actif (surligne le lien). */
  active?: boolean;
  /** Variante : navbar (mono uppercase) ou footer (texte simple). */
  variant?: "navbar" | "footer";
  children: React.ReactNode;
}

/**
 * NavLink — bouton de navigation centralisé, design premium.
 *
 * Navbar : mono uppercase, tracking-widest, indicateur actif en pill
 * arrondie avec bg subtil. Au survol : texte orange + pill bg qui apparaît.
 * Footer : texte simple slate-400 → white au survol.
 */
export function NavLink({
  active = false,
  variant = "navbar",
  className,
  children,
  ...props
}: NavLinkProps) {
  return (
    <button
      className={cn(
        "relative transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 rounded-lg",
        variant === "navbar"
          ? "px-3.5 py-2 font-mono text-xs uppercase tracking-widest group"
          : "text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
        active && variant === "navbar" && "text-[#F26D3D]",
        !active && variant === "navbar" && "text-slate-500 dark:text-slate-300 hover:text-[#F26D3D]",
        className
      )}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {/* Background pill au survol / actif */}
      {variant === "navbar" && (
        <span
          className={cn(
            "absolute inset-0 rounded-lg transition-all duration-300",
            active
              ? "bg-[#F26D3D]/10 opacity-100"
              : "bg-white/5 dark:bg-white/5 opacity-0 group-hover:opacity-100"
          )}
          aria-hidden
        />
      )}
      {/* Contenu au-dessus du background */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
