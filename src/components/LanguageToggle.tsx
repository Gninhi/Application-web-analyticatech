"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * LanguageToggle — bouton de bascule de langue (FR / EN).
 *
 * Hydration-safe : ne rend le contenu qu'après le montage.
 * Animation Framer Motion sur le changement.
 */
export function LanguageToggle() {
  const { locale, toggleLocale } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <button
      onClick={toggleLocale}
      aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}
      className="flex h-10 w-10 items-center justify-center rounded-lg glass text-slate-800 dark:text-slate-100 hover:text-[#F26D3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={locale}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "font-mono text-xs font-bold uppercase tracking-wider",
              locale === "fr" ? "text-[#F26D3D]" : "text-[#F26D3D]"
            )}
          >
            {locale === "fr" ? "FR" : "EN"}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
}
