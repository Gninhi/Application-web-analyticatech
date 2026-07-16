"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ThemeToggle — bouton de bascule entre thème clair et sombre.
 *
 * Utilise next-themes pour persister le choix (localStorage).
 * Animation Framer Motion sur l'icône (rotation + fondu).
 * Hydration-safe : ne rend l'icône qu'après le montage.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Évite le mismatch d'hydration : setState différé dans rAF
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const isDark = theme === "dark";

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
      className="flex h-10 w-10 items-center justify-center rounded-lg glass text-slate-100 dark:text-slate-100 hover:text-[#F26D3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-5 w-5" aria-hidden />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-5 w-5 text-slate-700" aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </button>
  );
}
