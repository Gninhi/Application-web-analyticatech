"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

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
 * Navbar : mono uppercase, tracking-widest. La pill active est animée
 * (layoutId) : elle glisse d'un lien à l'autre à la navigation. Au survol
 * d'un lien inactif : pill blanche en fondu + texte orange (mouvement
 * conservé). Footer : texte simple slate-400 → white au survol.
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
        "relative inline-flex items-center min-h-8 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 rounded-lg",
        variant === "navbar"
          ? "px-3.5 py-2 font-mono text-xs uppercase tracking-widest group"
          : "text-sm text-slate-700 dark:text-slate-400 hover:text-[#03318C] dark:hover:text-white",
        active && variant === "navbar" && "text-[#F26D3D]",
        !active && variant === "navbar" && "text-slate-700 dark:text-slate-300 hover:text-[#03318C] dark:hover:text-[#F26D3D]",
        className
      )}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {/* Background pill : coulissante (layoutId) si active, fondu au survol sinon */}
      {variant === "navbar" &&
        (active ? (
          <motion.span
            layoutId="navbar-active-pill"
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
            className="absolute inset-0 rounded-lg bg-[#F26D3D]/10"
            aria-hidden
          />
        ) : (
          <span
            className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-hidden
          />
        ))}
      {/* Contenu au-dessus du background */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
