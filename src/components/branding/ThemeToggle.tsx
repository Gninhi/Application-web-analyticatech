"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/branding/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { NavbarActionToggle } from "@/components/branding/NavbarActionToggle";
import { cn } from "@/lib/utils/cn";

/**
 * ThemeToggle — bouton de bascule entre thème clair et sombre.
 *
 * Utilise next-themes pour persister le choix (localStorage).
 * Animation CSS fluide (rotation + fondu) et bordure serpent animée (DRY).
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
    <NavbarActionToggle
      onClick={toggle}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center transition-all duration-300 ease-out",
          !mounted && "opacity-100 rotate-0",
          mounted && isDark && "opacity-100 rotate-0 scale-100",
          mounted && !isDark && "opacity-0 rotate-90 scale-50 absolute"
        )}
      >
        <Sun className="h-4 w-4" aria-hidden />
      </span>
      <span
        className={cn(
          "inline-flex items-center justify-center transition-all duration-300 ease-out",
          !mounted && "opacity-0 -rotate-90 scale-50 absolute",
          mounted && !isDark && "opacity-100 rotate-0 scale-100",
          mounted && isDark && "opacity-0 -rotate-90 scale-50 absolute"
        )}
      >
        <Moon className="h-4 w-4" aria-hidden />
      </span>
    </NavbarActionToggle>
  );
}
