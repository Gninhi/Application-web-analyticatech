"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { type ViewKey } from "@/types/content";
import { viewToPath, pathToView, getLocaleFromPath } from "@/lib/navigation/routes";
import { RandomLetterSwap, type RandomLetterSwapHandle } from "@/components/ui/random-letter-swap";
import { Logo } from "@/components/branding/Logo";
import { ThemeToggle } from "@/components/branding/ThemeToggle";
import { LanguageToggle } from "@/components/branding/LanguageToggle";
import { ButtonBorder } from "@/components/ui/button-border";
import { useScrollState } from "@/hooks/useScrollState";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { cn } from "@/lib/utils/cn";

interface NavbarLinkItemProps {
  itemKey: ViewKey;
  label: string;
  href: string;
  isActive: boolean;
}

function NavbarLinkItem({ itemKey, label, href, isActive }: NavbarLinkItemProps) {
  const swapRef = React.useRef<RandomLetterSwapHandle>(null);

  const handleMouseEnter = useCallback(() => {
    swapRef.current?.trigger();
  }, []);

  return (
    <Link
      key={itemKey}
      href={href}
      onMouseEnter={handleMouseEnter}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-[13px] font-medium tracking-tight transition-colors duration-200 whitespace-nowrap group select-none",
        isActive
          ? "text-[#03318C] dark:text-white font-semibold"
          : "text-slate-600 dark:text-slate-300/80 hover:text-[#03318C] dark:hover:text-white"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Pilule active animée (Framer Motion layoutId) */}
      {isActive && (
        <motion.span
          layoutId="navbar-active-pill"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#03318C]/12 via-[#03318C]/8 to-[#03318C]/12 dark:from-[#F26D3D]/18 dark:via-[#F26D3D]/10 dark:to-[#F26D3D]/18 border border-[#03318C]/25 dark:border-[#F26D3D]/35 shadow-[0_2px_10px_rgba(3,49,140,0.08)] dark:shadow-[0_0_14px_rgba(242,109,61,0.22)]"
          aria-hidden="true"
        />
      )}

      {/* Fond satiné au survol sur liens inactifs */}
      {!isActive && (
        <span
          className="absolute inset-0 rounded-xl bg-[#03318C]/[0.05] dark:bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Contenu textuel interactif */}
      <span className="relative z-10 flex items-center gap-1.5">
        {isActive && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#03318C] dark:bg-[#F26D3D] shadow-[0_0_6px_rgba(3,49,140,0.5)] dark:shadow-[0_0_8px_#F26D3D] shrink-0"
            aria-hidden="true"
          />
        )}
        <RandomLetterSwap
          ref={swapRef}
          label={label}
          staggerDuration={0.02}
        />
      </span>
    </Link>
  );
}

/**
 * Navbar — Header capsule flottante en verre liquide inspiré du design "Cosmic Capsule".
 *
 * Structure & Identité :
 * - Gauche : Logo Analyticatech avec marque de précision
 * - Centre / Droite : Capsule unifiée en verre liquide haute précision :
 *   • Thème Sombre : fond noir obsidienne & bleu nuit avec liseré cuivre #F26D3D et pilule active lumineuse.
 *   • Thème Clair : fond blanc opalin satiné avec bordure et pilule bleu cobalt #03318C.
 *   • Au survol : effet `RandomLetterSwap` (cascade aléatoire spring des lettres sans CLS).
 *   • 100% accessible, zéro décalage de layout, transition active par layoutId Framer Motion.
 */
export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const activeView = pathToView(pathname);
  const { scrolled, hidden } = useScrollState();
  const { t } = useI18n();
  const { navItems } = useAppContent();
  const currentLocale = getLocaleFromPath(pathname);

  // Repli statique (mode offline ou DB injoignable)
  const STATIC_NAV: { key: ViewKey; label: string; hint: string }[] = [
    { key: "home", label: t("nav.home"), hint: "00" },
    { key: "services", label: t("nav.services"), hint: "01" },
    { key: "solutions", label: t("nav.solutions"), hint: "02" },
    { key: "blog", label: t("nav.blog"), hint: "03" },
    { key: "contact", label: t("nav.contact"), hint: "04" },
  ];

  const NAV_ITEMS =
    navItems.length > 0
      ? navItems.map((n) => ({ key: n.viewKey as ViewKey, label: n.label, hint: n.hint }))
      : STATIC_NAV;

  const handleCta = useCallback(() => {
    router.push(viewToPath("contact", undefined, currentLocale));
  }, [router, currentLocale]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-out",
        scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-5",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6">
        <div className="flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Logo Analyticatech */}
          <Link
            href={currentLocale === "en" ? "/en" : "/"}
            className="group flex items-center gap-2 rounded-xl px-1.5 py-1 sm:px-2 sm:py-1.5 transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-[#F26D3D] shrink-0"
            aria-label={`${t("nav.home")} — AnalyticaTech`}
          >
            <Logo size={28} delay={0.2} />
            <span className="font-display text-sm sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 hidden xs:inline-block">
              Analytica<span className="text-[#F26D3D]">tech</span>
            </span>
          </Link>

          {/* Capsule Flottante Navigation & Actions (Design Liquid Glass Capsule Premium) */}
          <nav
            aria-label="Navigation principale"
            className={cn(
              "relative flex items-center gap-0.5 sm:gap-1.5 rounded-2xl border p-1 sm:p-1.5 transition-all duration-300 backdrop-blur-2xl shadow-xl max-w-full overflow-hidden",
              scrolled
                ? "border-[#03318C]/20 dark:border-[#03318C]/40 bg-white/95 dark:bg-[#06070B]/90 shadow-[0_12px_40px_rgba(3,49,140,0.12)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.8),0_0_24px_rgba(3,49,140,0.22)]"
                : "border-[#03318C]/12 dark:border-white/10 bg-white/85 dark:bg-[#06070B]/80 shadow-[0_8px_32px_rgba(3,49,140,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_16px_rgba(3,49,140,0.12)]"
            )}
          >
            {/* Liseré supérieur lumineux spéculaire */}
            <span
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#03318C]/30 dark:via-[#F26D3D]/40 to-transparent"
              aria-hidden="true"
            />

            {/* Liens de navigation avec typographie harmonisée et RandomLetterSwap */}
            <div className="flex items-center overflow-x-auto no-scrollbar py-0.5 px-0.5 sm:px-1">
              {NAV_ITEMS.map((item) => (
                <NavbarLinkItem
                  key={item.key}
                  itemKey={item.key}
                  label={item.label}
                  href={viewToPath(item.key, undefined, currentLocale)}
                  isActive={activeView === item.key}
                />
              ))}
            </div>

            {/* Séparateur subtil */}
            <span className="hidden sm:inline-block h-4 w-px bg-[#03318C]/15 dark:bg-white/10 mx-1" aria-hidden="true" />

            {/* Toggles : Langue & Thème */}
            <div className="flex items-center gap-1">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            {/* Bouton CTA haute visibilité avec bordure animée pure */}
            <ButtonBorder
              onClick={handleCta}
              variant="outline"
              size="sm"
              borderRadius={12}
              duration={4}
              beamSize={24}
              data-cta="navbar_demander_audit"
              icon={<ArrowUpRight className="h-3.5 w-3.5 text-[#F26D3D]" aria-hidden="true" />}
              iconPosition="right"
              className="hidden sm:inline-flex ml-1 shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white hover:text-[#F26D3D] hover:border-[#F26D3D]/40"
            >
              <span>{t("nav.cta")}</span>
            </ButtonBorder>
          </nav>
        </div>
      </div>
    </header>
  );
}