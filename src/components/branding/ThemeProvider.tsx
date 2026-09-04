"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * ThemeProvider — remplace next-themes pour permettre un CSP nonce-based
 * (le script inline de next-themes n'est pas nonçable).
 *
 * - La classe du thème est posée sur <html> AVANT le premier paint par le
 *   script inline noncé injecté dans RootLayout (anti-FOUC).
 * - Ce provider (client) n'a qu'à synchroniser l'état React avec ce qui a
 *   déjà été appliqué au DOM, et à persister le choix (localStorage "theme").
 * - Sync multi-onglets via l'événement "storage".
 */

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

/** Applique la classe du thème sur <html> (une seule classe à la fois). */
function applyThemeClass(t: Theme) {
  const c = document.documentElement.classList;
  c.remove("light", "dark");
  c.add(t);
}

/** Lit le thème persisté, en retombant sur le défaut. */
function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" ? "light" : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Init stable à DEFAULT_THEME pour garantir 100% de parité SSR/client
  // et éliminer l'erreur d'hydratation React #418.
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  // Synchronisation avec le stockage local après montage (non bloquant pour l'hydratation)
  useEffect(() => {
    const stored = readStoredTheme();
    if (stored !== DEFAULT_THEME) {
      requestAnimationFrame(() => setThemeState(stored));
    }
  }, []);

  // Sync DOM : pose la classe du thème au montage et à chaque changement
  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  // Sync inter-onglets : le setState est déclenché par un événement externe.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setThemeState(e.newValue === "light" ? "light" : DEFAULT_THEME);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // setTheme : applique la classe, persiste, et coupe transitoirement les
  // transitions CSS (parité avec disableTransitionOnChange de next-themes).
  const setTheme = useCallback((t: Theme) => {
    const style = document.createElement("style");
    style.textContent = "*{transition:none!important}";
    document.head.appendChild(style);

    applyThemeClass(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* stockage indisponible : le thème reste appliqué pour la session */
    }
    setThemeState(t);

    requestAnimationFrame(() => style.remove());
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}