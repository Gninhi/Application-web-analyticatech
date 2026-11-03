"use client";

import { createContext, useContext, useEffect, useCallback, useMemo, type ReactNode } from "react";
import type { Locale } from "@/types/content";

// Importations des namespaces modulaires français

// Importations des namespaces modulaires anglais

export type { Locale };

interface I18nContextValue {
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "at-locale";

/**
 * Dictionnaires de repli, enregistrés hors production (tests unitaires) quand un
 * composant est rendu sans dictionnaire explicite. En production, le layout
 * transmet toujours le dictionnaire de la page (`getDictionary`).
 */
const registeredDictionaries: Partial<Record<Locale, Record<string, string>>> = {};

export function registerDictionaries(dicts: Partial<Record<Locale, Record<string, string>>>): void {
  Object.assign(registeredDictionaries, dicts);
}

function interpolate(value: string, params?: Record<string, string | number>): string {
  if (!params) return value;
  return Object.entries(params).reduce(
    (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    value
  );
}

const defaultFallbackContext: I18nContextValue = {
  locale: "fr",
  t: (key, params) => interpolate(registeredDictionaries.fr?.[key] ?? key, params),
};

/**
 * I18nProvider — traductions de la page courante.
 *
 * La langue est fixée par l'URL (`/` ou `/en`) et le dictionnaire vient du
 * serveur : changer de langue recharge la page (voir LanguageToggle), si bien
 * qu'aucune autre langue n'est embarquée côté client.
 * - Met à jour `lang` sur <html>, le cookie NEXT_LOCALE (1 an) et localStorage.
 * - `t(key, params)` : interpolation `{name}`, clé affichée si absente.
 */
export function I18nProvider({
  children,
  initialLocale = "fr",
  locale: propLocale,
  dictionary,
}: {
  children: ReactNode;
  initialLocale?: Locale;
  locale?: Locale;
  /** Dictionnaire de la langue affichée (fourni par le layout). */
  dictionary?: Record<string, string>;
}) {
  const locale = propLocale ?? initialLocale;
  const dict = dictionary ?? registeredDictionaries[locale] ?? registeredDictionaries.fr;

  // Synchronise <html lang>, localStorage + cookie avec la langue affichée
  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }, [locale]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const value = dict?.[key];
      if (value === undefined) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[i18n] Clé manquante pour la locale "${locale}": "${key}"`);
          return `⚠️[${key}]`;
        }
        return key;
      }
      return interpolate(value, params);
    },
    [dict, locale]
  );

  const value = useMemo(() => ({ locale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Hook pour accéder aux traductions et à la locale courante. */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  return ctx ?? defaultFallbackContext;
}
