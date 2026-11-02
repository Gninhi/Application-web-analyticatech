"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type ViewKey } from "@/types/content";
import { viewToPath, pathToView, getLocaleFromPath } from "@/lib/navigation/routes";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { ThemeToggle } from "@/components/branding/ThemeToggle";
import { LanguageToggle } from "@/components/branding/LanguageToggle";
import { useScrollState } from "@/hooks/useScrollState";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { cn } from "@/lib/utils/cn";

interface NavbarLinkItemProps {
  itemKey: ViewKey;
  label: string;
  hint: string;
  href: string;
  isActive: boolean;
}

/**
 * Lien de navigation du design system : numéro discret + libellé.
 * Le lien actif reçoit une pilule pleine (surface du thème) avec un point orange.
 */
function NavbarLinkItem({ itemKey, label, hint, href, isActive }: NavbarLinkItemProps) {
  return (
    <Link
      key={itemKey}
      href={href}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[14px] font-medium whitespace-nowrap select-none transition-colors duration-150",
        isActive
          ? "text-[#011C40] dark:text-[#011C40]"
          : "text-slate-600 hover:text-[#011C40] dark:text-[#B6C2D6] dark:hover:text-white"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <motion.span
          layoutId="navbar-active-pill"
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
          className="absolute inset-0 rounded-full bg-white border border-[#D5DCE8] dark:border-white"
          aria-hidden="true"
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        <span
          className={cn(
            "text-[11px] font-semibold tabular-nums",
            isActive ? "text-[#03318C]" : "text-slate-400 dark:text-[#8DA0C0]"
          )}
          aria-hidden="true"
        >
          {hint}
        </span>
        <span>{label}</span>
        {isActive && (
          <span className="h-1.5 w-1.5 rounded-full bg-[#F26D3D] shrink-0" aria-hidden="true" />
        )}
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

  const NAV_ITEMS = (
    navItems.length > 0
      ? navItems.map((n) => ({ key: n.viewKey as ViewKey, label: n.label, hint: n.hint }))
      : STATIC_NAV
  ).map((item, i) => ({ ...item, hint: String(i + 1).padStart(2, "0") }));

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
          "fixed top-0 inset-x-0 z-50 border-b transition-[transform,background-color,border-color] duration-300 ease-out",
          scrolled
            ? "py-2.5 bg-background border-border"
            : "py-3.5 sm:py-4 bg-background/0 border-transparent",
          hidden && !isDrawerOpen ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            {/* Logotype officiel Analyticatech */}
            <Link
              href={currentLocale === "en" ? "/en" : "/"}
              className="group flex items-center rounded-lg py-1 shrink-0"
              aria-label={`${t("nav.home")} — Analyticatech`}
            >
              <BrandLogo height={30} priority alt="Analyticatech" />
            </Link>

            {/* Navigation desktop (≥ 1024px) : barre pilule du design system */}
            <nav
              aria-label={locale === "en" ? "Main navigation" : "Navigation principale"}
              className="hidden lg:flex items-center rounded-full border border-border bg-[#F4F6FA] dark:bg-[#022859] p-1 min-w-0"
            >
              <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
                {NAV_ITEMS.map((item) => (
                  <NavbarLinkItem
                    key={item.key}
                    itemKey={item.key}
                    label={item.label}
                    hint={item.hint}
                    href={viewToPath(item.key, undefined, currentLocale)}
                    isActive={activeView === item.key}
                  />
                ))}
              </div>
            </nav>

            {/* Préférences + CTA (≥ 1024px) */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <LanguageToggle />
              <ThemeToggle />
              <button
                type="button"
                onClick={handleCta}
                data-cta="navbar_demander_audit"
                className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-[#F26D3D] px-4 py-2.5 text-[14px] font-semibold text-[#011C40] hover:bg-[#E35F31] transition-colors cursor-pointer"
              >
                <span>{t("nav.cta")}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

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
              className="lg:hidden flex items-center justify-center min-w-[44px] min-h-[44px] h-11 w-11 rounded-lg border border-border bg-background text-foreground hover:border-foreground focus-visible:outline-2 focus-visible:outline-[#F26D3D] transition-colors cursor-pointer"
            >
              {isDrawerOpen ? (
                <X className="h-5 w-5 text-accent-ink" aria-hidden="true" />
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
            className="lg:hidden fixed inset-0 z-[100] flex flex-col justify-between bg-background text-slate-900 dark:text-[#F5F7FA] px-6 py-6 overflow-y-auto"
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
                <BrandLogo height={28} alt="Analyticatech" />
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                aria-label={locale === "en" ? "Close menu" : "Fermer le menu"}
                className="flex items-center justify-center min-w-[44px] min-h-[44px] h-11 w-11 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:text-accent-ink hover:border-[#F26D3D]/40 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F26D3D]"
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
                      ? "bg-muted text-foreground border border-border"
                      : "text-slate-800 dark:text-[#F5F7FA] hover:text-accent-ink dark:hover:text-accent-ink hover:bg-slate-200/50 dark:hover:bg-white/5"
                  )}
                  aria-current={activeView === item.key ? "page" : undefined}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "font-mono text-xs transition-colors",
                        activeView === item.key
                          ? "text-accent-ink/80"
                          : "text-slate-400 dark:text-slate-500 group-hover:text-accent-ink/70"
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
                        ? "text-accent-ink"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-accent-ink"
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
                className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#F26D3D] text-[#011C40] text-[15px] font-semibold flex items-center justify-center gap-2 hover:bg-[#E35F31] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26D3D]"
              >
                <span>{t("nav.cta")}</span>
                <ArrowUpRight className="h-4 w-4 text-[#011C40]" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}