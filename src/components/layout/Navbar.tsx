"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
          ? "text-[#F26D3D] dark:text-white font-semibold"
          : "text-slate-600 dark:text-slate-300/80 hover:text-[#F26D3D] dark:hover:text-white"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Pilule active animée (Framer Motion layoutId) */}
      {isActive && (
        <motion.span
          layoutId="navbar-active-pill"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#F26D3D]/12 via-[#F26D3D]/8 to-[#F26D3D]/12 dark:from-[#F26D3D]/18 dark:via-[#F26D3D]/10 dark:to-[#F26D3D]/18 border border-[#F26D3D]/30 dark:border-[#F26D3D]/35 shadow-[0_2px_10px_rgba(242,109,61,0.10)] dark:shadow-[0_0_14px_rgba(242,109,61,0.22)]"
          aria-hidden="true"
        />
      )}

      {/* Fond satiné au survol sur liens inactifs */}
      {!isActive && (
        <span
          className="absolute inset-0 rounded-xl bg-slate-100/70 dark:bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Contenu textuel interactif */}
      <span className="relative z-10 flex items-center gap-1.5">
        {isActive && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#F26D3D] shadow-[0_0_6px_rgba(242,109,61,0.5)] dark:shadow-[0_0_8px_#F26D3D] shrink-0"
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
 * Responsive (< 1024px) :
 * - Logo à gauche, bouton burger accessible à droite (cibles ≥ 44×44 px).
 * - Tiroir plein écran (drawer) adaptatif au thème (clair: fond satiné #F0F4F8 / sombre: #06070B).
 * - Focus piégé dans le panneau, fermeture sur clic de lien, Escape et changement de route.
 * - Verrouillage du scroll body (avec support Lenis éventuel).
 *
 * Desktop (≥ 1024px) :
 * - Capsule flottante liquide avec intégration dynamique des thèmes clair et sombre.
 */
export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const activeView = pathToView(pathname);
  const { scrolled, hidden } = useScrollState();
  const { t, locale } = useI18n();
  const { navItems } = useAppContent();
  const currentLocale = getLocaleFromPath(pathname);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const burgerButtonRef = useRef<HTMLButtonElement>(null);

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

  const closeMenu = useCallback(() => {
    setIsDrawerOpen(false);
    burgerButtonRef.current?.focus();
  }, []);

  // Fermeture automatique lors d'un changement de route
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsDrawerOpen(false);
    });
    return () => cancelAnimationFrame(handle);
  }, [pathname]);

  // Verrouillage du scroll du body et écoute de la touche Échap
  useEffect(() => {
    if (!isDrawerOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Support éventuel de Lenis si initialisé
    const win = window as unknown as { lenis?: { stop?: () => void; start?: () => void } };
    if (typeof win.lenis?.stop === "function") {
      win.lenis.stop();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      if (typeof win.lenis?.start === "function") {
        win.lenis.start();
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, closeMenu]);

  // Piégeage du focus dans le panneau mobile
  useEffect(() => {
    if (!isDrawerOpen || !drawerRef.current) return;

    const drawer = drawerRef.current;
    const focusableSelectors =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Focus initial sur le premier élément focusable
    const focusables = drawer.querySelectorAll<HTMLElement>(focusableSelectors);
    if (focusables.length > 0) {
      focusables[0]?.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const elements = drawer.querySelectorAll<HTMLElement>(focusableSelectors);
      if (elements.length === 0) return;

      const firstEl = elements[0];
      const lastEl = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    drawer.addEventListener("keydown", handleTabKey);
    return () => {
      drawer.removeEventListener("keydown", handleTabKey);
    };
  }, [isDrawerOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-out",
          scrolled
            ? "py-2 sm:py-2.5 bg-white/90 dark:bg-[#06070B]/90 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-b border-slate-200/80 dark:border-white/10 lg:border-b-0 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] lg:shadow-none"
            : "py-3 sm:py-5 bg-transparent",
          hidden && !isDrawerOpen ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="flex items-center justify-between gap-1.5 sm:gap-3">
            {/* Logo Analyticatech */}
            <Link
              href={currentLocale === "en" ? "/en" : "/"}
              className="group flex items-center gap-2 rounded-xl px-1.5 py-1 sm:px-2 sm:py-1.5 transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-[#F26D3D] shrink-0"
              aria-label={`${t("nav.home")} — AnalyticaTech`}
            >
              <Logo size={28} delay={0.2} />
              <span className="font-display text-sm sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 inline-block">
                Analytica<span className="text-[#F26D3D]">tech</span>
              </span>
            </Link>

            {/* Desktop Capsule (≥ 1024px) */}
            <nav
              aria-label="Navigation principale"
              className={cn(
                "hidden lg:flex relative items-center gap-1.5 rounded-2xl border p-1.5 transition-all duration-300 backdrop-blur-2xl shadow-xl max-w-full overflow-hidden",
                scrolled
                  ? "border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-[#06070B]/90 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.8),0_0_24px_rgba(242,109,61,0.08)]"
                  : "border-slate-200/70 dark:border-white/10 bg-white/85 dark:bg-[#06070B]/80 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_16px_rgba(242,109,61,0.05)]"
              )}
            >
              {/* Liseré supérieur lumineux spéculaire */}
              <span
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#F26D3D]/30 dark:via-[#F26D3D]/40 to-transparent"
                aria-hidden="true"
              />

              {/* Liens de navigation avec typographie harmonisée et RandomLetterSwap */}
              <div className="flex items-center overflow-x-auto no-scrollbar py-0.5 px-1">
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
              <span className="h-4 w-px bg-slate-200/80 dark:bg-white/10 mx-1" aria-hidden="true" />

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
                gradientClassName="from-transparent via-[#F26D3D] to-[#F26D3D] dark:via-[#F26D3D] dark:to-[#F26D3D]"
                data-cta="navbar_demander_audit"
                icon={<ArrowUpRight className="h-3.5 w-3.5 text-[#F26D3D]" aria-hidden="true" />}
                iconPosition="right"
                className="ml-1 shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white hover:text-[#F26D3D] hover:border-[#F26D3D]/40"
              >
                <span>{t("nav.cta")}</span>
              </ButtonBorder>
            </nav>

            {/* Bouton Burger Mobile / Tablette (< 1024px) */}
            <button
              ref={burgerButtonRef}
              type="button"
              id="burger-menu-button"
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={
                isDrawerOpen
                  ? locale === "en"
                    ? "Close menu"
                    : "Fermer le menu"
                  : locale === "en"
                  ? "Open menu"
                  : "Ouvrir le menu"
              }
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              className="lg:hidden flex items-center justify-center min-w-[44px] min-h-[44px] h-11 w-11 rounded-xl border border-slate-200/80 dark:border-white/15 bg-white/80 dark:bg-white/5 text-slate-800 dark:text-slate-100 backdrop-blur-xl shadow-sm dark:shadow-none hover:border-[#F26D3D]/50 focus-visible:outline-2 focus-visible:outline-[#F26D3D] transition-colors cursor-pointer"
            >
              {isDrawerOpen ? (
                <X className="h-5 w-5 text-[#F26D3D]" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Panneau Mobile / Tablette Plein Écran (Drawer) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            ref={drawerRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={locale === "en" ? "Navigation menu" : "Menu de navigation"}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="lg:hidden fixed inset-0 z-[100] flex flex-col justify-between bg-[#F0F4F8] dark:bg-[#06070B] text-slate-900 dark:text-[#F5F7FA] px-6 py-6 overflow-y-auto"
          >
            {/* Halo lumineux de fond doux aux couleurs du thème */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-30"
              style={{
                background: "radial-gradient(circle at 50% 0%, rgba(242,109,61,0.18), transparent 65%)",
              }}
              aria-hidden="true"
            />

            {/* Haut de panneau : Logo & Bouton Fermer */}
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
              <Link
                href={currentLocale === "en" ? "/en" : "/"}
                onClick={closeMenu}
                className="flex items-center gap-2"
                aria-label={`${t("nav.home")} — AnalyticaTech`}
              >
                <Logo size={28} />
                <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
                  Analytica<span className="text-[#F26D3D]">tech</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                aria-label={locale === "en" ? "Close menu" : "Fermer le menu"}
                className="flex items-center justify-center min-w-[44px] min-h-[44px] h-11 w-11 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:text-[#F26D3D] hover:border-[#F26D3D]/40 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F26D3D]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Corps du panneau : Liens de navigation */}
            <nav
              aria-label={locale === "en" ? "Mobile navigation" : "Navigation mobile"}
              className="relative z-10 flex flex-col gap-2.5 my-auto py-6"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  href={viewToPath(item.key, undefined, currentLocale)}
                  onClick={closeMenu}
                  className={cn(
                    "group flex items-center justify-between px-5 py-3.5 rounded-xl font-display text-lg font-semibold tracking-tight transition-all min-h-[48px]",
                    activeView === item.key
                      ? "bg-[#F26D3D]/10 dark:bg-[#F26D3D]/15 text-[#F26D3D] border border-[#F26D3D]/30 shadow-md shadow-[#F26D3D]/10"
                      : "text-slate-800 dark:text-[#F5F7FA] hover:text-[#F26D3D] dark:hover:text-[#F26D3D] hover:bg-slate-200/50 dark:hover:bg-white/5"
                  )}
                  aria-current={activeView === item.key ? "page" : undefined}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "font-mono text-xs transition-colors",
                        activeView === item.key
                          ? "text-[#F26D3D]/80"
                          : "text-slate-400 dark:text-slate-500 group-hover:text-[#F26D3D]/70"
                      )}
                    >
                      {item.hint}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  <ArrowUpRight
                    className={cn(
                      "h-4 w-4 transition-colors",
                      activeView === item.key
                        ? "text-[#F26D3D]"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-[#F26D3D]"
                    )}
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </nav>

            {/* Bas du panneau : Bascule FR/EN & Thème + CTA Orange */}
            <div className="relative z-10 space-y-4 pt-4 border-t border-slate-200/80 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {locale === "en" ? "Preferences" : "Préférences"}
                </span>
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>

              {/* CTA orange #F26D3D, texte #1A2332 */}
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  handleCta();
                }}
                data-cta="navbar_demander_audit_mobile"
                className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#F26D3D] text-[#1A2332] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#F26D3D]/25 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26D3D]"
              >
                <span>{t("nav.cta")}</span>
                <ArrowUpRight className="h-4 w-4 text-[#1A2332]" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}