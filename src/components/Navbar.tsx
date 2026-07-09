"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Cpu } from "lucide-react";
import { NAV_ITEMS, type ViewKey } from "@/lib/data";
import { ScrambleText } from "./ScrambleText";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeView: ViewKey;
  onNavigate: (view: ViewKey) => void;
}

export function Navbar({ activeView, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  // Effet "sticky glass" qui s'active au scroll (throttle via rAF)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 16);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloque le scroll body quand le command panel mobile est ouvert
  // + Focus trap + Escape + restauration du focus sur fermeture (audit a11y)
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus le premier élément focusable du dialog
    const dialog = dialogRef.current;
    if (dialog) {
      const focusable = dialog.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }

    // Focus trap : Tab et Shift+Tab restent dans le dialog
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
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

    // Escape pour fermer
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleTab);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleTab);
      document.removeEventListener("keydown", handleEscape);
      // Restauration du focus sur le bouton qui a ouvert le dialog
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
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled ? "py-2" : "py-4"
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
              aria-label="Retour à l'accueil Analyticatech"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F26D3D]/40 bg-[#F26D3D]/10">
                <Cpu className="h-4 w-4 text-[#F26D3D]" aria-hidden />
              </span>
              <span className="font-display text-base font-bold tracking-tight text-slate-100">
                Analytica<span className="text-[#F26D3D]">tech</span>
              </span>
            </button>

            {/* Liens desktop */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.key)}
                  className={cn(
                    "relative px-3.5 py-2 font-mono text-xs uppercase tracking-widest transition-colors rounded-md",
                    activeView === item.key
                      ? "text-[#F26D3D]"
                      : "text-slate-300 hover:text-white"
                  )}
                  aria-current={activeView === item.key ? "page" : undefined}
                >
                  <ScrambleText text={item.label} />
                  {activeView === item.key && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-0.5 h-px bg-[#F26D3D]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* CTA desktop + bouton mobile */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav("contact")}
                className="hidden md:inline-flex items-center gap-2 rounded-lg bg-[#F26D3D] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#ff7a4a] neon-glow"
              >
                Demander un devis
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </button>

              {/* Bouton hamburger mobile */}
              <button
                ref={openerRef}
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg glass text-slate-100"
                aria-label="Ouvrir le menu de navigation"
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
            className="fixed inset-0 z-[60] md:hidden bg-[#011C40]/95 backdrop-blur-xl grid-military flex flex-col"
            ref={dialogRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation mobile"
          >
            {/* En-tête du panel */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#4CAF50] animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">
                  Command Panel // ACTIVE
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg glass text-slate-100"
                aria-label="Fermer le menu"
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
                    "group flex items-baseline justify-between border-b border-white/10 py-4 text-left transition-colors",
                    activeView === item.key ? "text-[#F26D3D]" : "text-slate-100"
                  )}
                  aria-current={activeView === item.key ? "page" : undefined}
                >
                  <span className="font-display text-3xl font-bold tracking-tight">
                    {item.label}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500 group-hover:text-[#F26D3D] transition-colors">
                    {item.hint}
                  </span>
                </motion.button>
              ))}
            </nav>

            {/* CTA bas de panel */}
            <div className="px-6 py-6 border-t border-white/10">
              <button
                onClick={() => handleNav("contact")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#F26D3D] px-5 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-white neon-glow"
              >
                Demander un devis
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600">
                Analyticatech — Secure Connection Established
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
