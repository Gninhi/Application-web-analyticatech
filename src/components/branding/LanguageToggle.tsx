"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/moving-border";

/**
 * LanguageToggle — bouton de bascule de langue (FR / EN).
 *
 * Hydration-safe : l'aria-label et le contenu ne dépendent de la locale
 * qu'après le montage (mounted=true). Avant, on utilise des valeurs
 * par défaut neutres pour garantir un rendu identique serveur/client.
 */
export function LanguageToggle() {
  const { locale, toggleLocale } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Valeurs neutres avant montage pour éviter le mismatch d'hydration
  const displayLocale = mounted ? locale : "fr";
  const ariaLabel = mounted
    ? displayLocale === "fr"
      ? "Switch to English"
      : "Passer en français"
    : "Change language";

  return (
    <Button
      onClick={toggleLocale}
      aria-label={ariaLabel}
      borderRadius="0.625rem"
      duration={4000}
      className="h-10 w-10 flex items-center justify-center bg-white/10 dark:bg-white/5 backdrop-blur-md text-slate-800 dark:text-slate-100 hover:text-[#F26D3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={displayLocale}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="font-mono text-xs font-bold uppercase tracking-wider text-[#F26D3D]"
          >
            {displayLocale === "fr" ? "FR" : "EN"}
        </motion.span>
      </AnimatePresence>
      )}
  </Button>
  );
}
