"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { type ViewKey } from "@/lib/data";
import { ScrambleText } from "./ScrambleText";
import { SnakeButton } from "@/components/SnakeButton";
import { NavLink } from "@/components/NavLink";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useScrollState } from "@/hooks/useScrollState";
import { useI18n, useLocalizedData } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeView: ViewKey;
  onNavigate: (view: ViewKey) => void;
}

/**
 * Sélecteur d'éléments focusables dans un conteneur (pour le focus trap).
 */
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function Navbar({ activeView, onNavigate }: NavbarProps) {
  const { scrolled, hidden } = useScrollState();
  const { t } = useI18n();
  const { NAV_ITEMS } = useLocalizedData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  // Bloque le scroll body + focus trap + Escape quand le dialog mobile est ouvert
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus le premier élément focusable du dialog
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", handleTab);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleTab);
      document.removeEventListener("keydown", handleEscape);
      openerRef.current?.focus();
    };
  }, [mobileOpen]);

  const handleNav = useCallback(
    (view: ViewKey) => {
      onNavigate(view);
      setMobileOpen(false);
    },
    [onNavigate]
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-transform duration-300 ease-out",
          scrolled ? "py-2" : "py-4",
          hidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <nav
            className={cn(
              "flex items-center justify-between rounded-2xl px-4 md:px-6 transition-all duration-300",
              scrolled
                ? "glass-strong h-14 shadow-lg shadow-black/30"
                : "h-16 bg-transparent"
            )}
            aria-label="Navigation principale"
          >
            {/* Logo */}
            <button
              onClick={() => handleNav("home")}
              className="group flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 rounded-md"
              aria-label={t("nav.home")}
            >
              <Logo size={32} delay={0.2} />
              <span className="font-display text-base font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Analytica<span className="text-[#F26D3D]">tech</span>
              </span>
            </button>

            {/* Liens desktop — design premium avec pill hover */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.key}
                  active={activeView === item.key}
                  onClick={() => handleNav(item.key)}
                >
                  <ScrambleText text={item.label} />
                </NavLink>
              ))}
            </div>

            {/* Actions : Langue → Thème → CTA → Mobile */}
            <div className="flex items-center gap-2">
              {/* Bouton changement de langue (à gauche du bouton Devis) */}
              <LanguageToggle />

              {/* Bouton changement de thème */}
              <ThemeToggle />

              <SnakeButton
                onClick={() => handleNav("contact")}
                variant="primary"
                size="sm"
                className="hidden md:inline-flex neon-glow"
              >
                {t("nav.cta")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </SnakeButton>

              {/* Bouton hamburger mobile */}
              <button
                ref={openerRef}
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg glass text-slate-800 dark:text-slate-100"
                aria-label={t("nav.menu.open")}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ===== Command Panel Mobile plein écran ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] md:hidden bg-background/95 backdrop-blur-xl grid-military flex flex-col"
            ref={dialogRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation mobile"
          >
            {/* En-tête du panel */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#4CAF50] animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  {t("nav.menu.status")}
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg glass text-slate-800 dark:text-slate-100"
                aria-label={t("nav.menu.close")}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            {/* Liens surdimensionnés */}
            <nav className="flex-1 flex flex-col justify-center px-6 gap-2" aria-label="Menu mobile">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.key}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.05, duration: 0.3 }}
                  onClick={() => handleNav(item.key)}
                  className={cn(
                    "group flex items-baseline justify-between border-b border-black/10 dark:border-white/10 py-4 text-left transition-colors",
                    activeView === item.key ? "text-[#F26D3D]" : "text-slate-800 dark:text-slate-100"
                  )}
                  aria-current={activeView === item.key ? "page" : undefined}
                >
                  <span className="font-display text-3xl font-bold tracking-tight">
                    {item.label}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-[#F26D3D] transition-colors">
                    {item.hint}
                  </span>
                </motion.button>
              ))}
            </nav>

            {/* CTA bas de panel */}
            <div className="px-6 py-6 border-t border-black/10 dark:border-white/10">
              <SnakeButton
                onClick={() => handleNav("contact")}
                variant="primary"
                size="lg"
                className="w-full neon-glow"
              >
                {t("nav.cta")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </SnakeButton>
              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {t("nav.menu.footer")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
