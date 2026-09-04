"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface NavLinkProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** État actif (surligne le lien). */
  active?: boolean;
  /** Variante : navbar (mono uppercase) ou footer (texte simple). */
  variant?: "navbar" | "footer";
  /** Si fourni, rend un vrai lien (<Link>) : navigation route App Router. */
  href?: string;
  /** Callback optionnel (ex : fermeture du menu mobile). */
  onNavigate?: () => void;
  children: React.ReactNode;
}

/**
 * NavLink — élément de navigation centralisé, design premium.
 *
 * Polymorphique : avec `href` rend un <Link> (routes réelles, préfetch par
 * défaut, état actif via aria-current="page") ; sinon un <button> pour les
 * actions simples. Le reste du design est inchangé : pill active animée
 * (layoutId) sur navbar, texte simple sur footer.
 */
export function NavLink({
  active = false,
  variant = "navbar",
  href,
  onNavigate,
  className,
  children,
  ...props
}: NavLinkProps) {
  const classNameValue = cn(
    "relative inline-flex items-center min-h-8 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 rounded-lg",
    variant === "navbar"
      ? "px-3 py-1.5 font-sans text-[13px] font-medium tracking-tight group"
      : "text-sm text-slate-700 dark:text-slate-400 hover:text-[#03318C] dark:hover:text-white",
    active && variant === "navbar" && "text-[#03318C] dark:text-white font-semibold",
    !active && variant === "navbar" && "text-slate-600 dark:text-slate-300/80 hover:text-[#03318C] dark:hover:text-white",
    className
  );

  const content = (
    <>
      {/* Background pill : coulissante (layoutId) si active, fondu au survol sinon */}
      {variant === "navbar" &&
        (active ? (
          <motion.span
            layoutId="navbar-active-pill"
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#03318C]/12 via-[#03318C]/8 to-[#03318C]/12 dark:from-[#F26D3D]/18 dark:via-[#F26D3D]/10 dark:to-[#F26D3D]/18 border border-[#03318C]/25 dark:border-[#F26D3D]/35 shadow-[0_2px_10px_rgba(3,49,140,0.08)] dark:shadow-[0_0_14px_rgba(242,109,61,0.22)]"
            aria-hidden
          />
        ) : (
          <span
            className="absolute inset-0 rounded-lg bg-[#03318C]/[0.05] dark:bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-all duration-200"
            aria-hidden
          />
        ))}
      {/* Contenu au-dessus du background */}
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classNameValue}
        aria-current={active ? "page" : undefined}
        onClick={onNavigate}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classNameValue} aria-current={active ? "page" : undefined} onClick={onNavigate} {...props}>
      {content}
    </button>
  );
}