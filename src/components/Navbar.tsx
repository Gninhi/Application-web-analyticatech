"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { NAV_ITEMS, type ViewKey } from "@/lib/data";
import { ScrambleText } from "./ScrambleText";
import { SnakeButton } from "@/components/SnakeButton";
import { NavLink } from "@/components/NavLink";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useScrollState } from "@/hooks/useScrollState";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeView: ViewKey;
  onNavigate: (view: ViewKey) => void;
}

export function Navbar({ activeView, onNavigate }: NavbarProps) {
  const { scrolled, hidden } = useScrollState();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Bloque le scroll body quand le command panel mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNav = (view: ViewKey) => {
    onNavigate(view);
    setMobileOpen(false);
  };

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
              aria-label="Retour à l'accueil Analyticatech"
            >
              <Logo size={32} delay={0.2} />
              <span className="font-display text-base font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Analytica<span className="text-[#F26D3D]">tech</span>
              </span>
            </button>

            {/* Liens desktop */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.key}
                  active={activeView === item.key}
                  onClick={() => handleNav(item.key)}
                  className={activeView === item.key ? "" : "text-slate-400 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}
                >
                  <ScrambleText text={item.label} />
                  {activeView === item.key && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-0.5 h-px bg-[#F26D3D]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </NavLink>
              ))}
            </div>

            {/* CTA desktop + bouton mobile */}
            <div className="flex items-center gap-2">
              {/* Bouton changement de thème */}
              <ThemeToggle />

              <SnakeButton
                onClick={() => handleNav("contact")}
                variant="primary"
                size="sm"
                className="hidden md:inline-flex neon-glow"
              >
                Demander un devis
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </SnakeButton>

              {/* Bouton hamburger mobile */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg glass text-slate-800 dark:text-slate-100"
                aria-label="Ouvrir le menu de navigation"
                aria-expanded={mobileOpen}
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
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation mobile"
          >
            {/* En-tête du panel */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#4CAF50] animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  Command Panel // ACTIVE
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg glass text-slate-800 dark:text-slate-100"
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
                Demander un devis
                <ArrowRight className="h-4 w-4" aria-hidden />
              </SnakeButton>
              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Analyticatech — Secure Connection Established
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
