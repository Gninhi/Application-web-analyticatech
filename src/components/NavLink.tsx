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
 * NavLink — bouton de navigation centralisé.
 *
 * Utilisé pour :
 *  - Liens navbar desktop (mono, uppercase, tracking-widest)
 *  - Liens footer (texte simple, slate-400)
 *
 * L'état `active` surligne le lien en orange brand.
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
        "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 rounded-md",
        variant === "navbar"
          ? "relative px-3.5 py-2 font-mono text-xs uppercase tracking-widest"
          : "text-sm text-slate-500 dark:text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
        active && variant === "navbar" && "text-[#F26D3D]",
        className
      )}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {children}
    </button>
  );
}
