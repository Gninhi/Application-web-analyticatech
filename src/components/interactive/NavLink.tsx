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
      ? "px-3.5 py-2 font-mono text-xs uppercase tracking-widest group"
      : "text-sm text-slate-700 dark:text-slate-400 hover:text-[#03318C] dark:hover:text-white",
    active && variant === "navbar" && "text-[#F26D3D]",
    !active && variant === "navbar" && "text-slate-700 dark:text-slate-300 hover:text-[#03318C] dark:hover:text-[#F26D3D]",
    className
  );

  const content = (
    <>
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