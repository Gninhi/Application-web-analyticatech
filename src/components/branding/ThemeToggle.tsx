"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/branding/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { MovingButton } from "@/components/interactive/MovingButton";
import { cn } from "@/lib/utils/cn";

/**
 * ThemeToggle — bouton de bascule entre thème clair et sombre.
 *
 * Utilise next-themes pour persister le choix (localStorage).
 * Animation CSS fluide (rotation + fondu) sans Framer Motion.
 *
 * Hydration-safe : l'aria-label et l'icône ne dépendent du thème
 * qu'après le montage (mounted=true). Avant, on utilise des valeurs
 * par défaut neutres pour garantir un rendu identique serveur/client.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Évite le mismatch d'hydration : setState différé dans rAF
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // isDark n'est fiable qu'après le montage (theme est undefined en SSR)
  const isDark = mounted ? theme === "dark" : true; // défaut: dark (cohérent avec defaultTheme)

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // aria-label neutre avant montage pour éviter le mismatch
  const ariaLabel = mounted
    ? isDark
      ? "Activer le thème clair"
      : "Activer le thème sombre"
    : "Changer de thème";

  return (
    <MovingButton
      onClick={toggle}
      aria-label={ariaLabel}
      iconOnly
      borderRadius="0.625rem"
      duration={4000}
      className="h-10 w-10 bg-white/10 dark:bg-white/5 backdrop-blur-md text-slate-800 dark:text-slate-100 hover:text-[#F26D3D] relative overflow-hidden"
    >
      <span
        className={cn(
          "inline-flex items-center justify-center transition-all duration-300 ease-out",
          !mounted && "opacity-100 rotate-0",
          mounted && isDark && "opacity-100 rotate-0 scale-100",
          mounted && !isDark && "opacity-0 rotate-90 scale-50 absolute"
        )}
      >
        <Sun className="h-5 w-5" aria-hidden />
      </span>
      <span
        className={cn(
          "inline-flex items-center justify-center transition-all duration-300 ease-out",
          !mounted && "opacity-0 -rotate-90 scale-50 absolute",
          mounted && !isDark && "opacity-100 rotate-0 scale-100",
          mounted && isDark && "opacity-0 -rotate-90 scale-50 absolute"
        )}
      >
        <Moon className="h-5 w-5 text-slate-700" aria-hidden />
      </span>
    </MovingButton>
  );
}
