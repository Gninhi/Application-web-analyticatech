"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Locale } from "@/types/content";

// Importations des namespaces modulaires français
import commonFr from "@/locales/fr/common.json";
import navFr from "@/locales/fr/nav.json";
import homeFr from "@/locales/fr/home.json";
import servicesFr from "@/locales/fr/services.json";
import servicesDetailFr from "@/locales/fr/services-detail.json";
import solutionsFr from "@/locales/fr/solutions.json";
import insightsFr from "@/locales/fr/insights.json";
import contactFr from "@/locales/fr/contact.json";
import aboutFr from "@/locales/fr/about.json";
import legalFr from "@/locales/fr/legal.json";
import footerFr from "@/locales/fr/footer.json";

// Importations des namespaces modulaires anglais
import commonEn from "@/locales/en/common.json";
import navEn from "@/locales/en/nav.json";
import homeEn from "@/locales/en/home.json";
import servicesEn from "@/locales/en/services.json";
import servicesDetailEn from "@/locales/en/services-detail.json";
import solutionsEn from "@/locales/en/solutions.json";
import insightsEn from "@/locales/en/insights.json";
import contactEn from "@/locales/en/contact.json";
import aboutEn from "@/locales/en/about.json";
import legalEn from "@/locales/en/legal.json";
import footerEn from "@/locales/en/footer.json";

export type { Locale };

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "at-locale";

/** Dictionnaires agrégés par langue */
const translations: Record<Locale, Record<string, string>> = {
  fr: {
    ...commonFr,
    ...navFr,
    ...homeFr,
    ...servicesFr,
    ...servicesDetailFr,
    ...solutionsFr,
    ...insightsFr,
    ...contactFr,
    ...aboutFr,
    ...legalFr,
    ...footerFr,
  },
  en: {
    ...commonEn,
    ...navEn,
    ...homeEn,
    ...servicesEn,
    ...servicesDetailEn,
    ...solutionsEn,
    ...insightsEn,
    ...contactEn,
    ...aboutEn,
    ...legalEn,
    ...footerEn,
  },
};

const defaultFallbackContext: I18nContextValue = {
  locale: "fr",
  setLocale: () => {},
  toggleLocale: () => {},
  t: (key: string, params?: Record<string, string | number>): string => {
    const value = translations.fr[key] ?? key;
    if (params) {
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
        value
      );
    }
    return value;
  },
};

/**
 * I18nProvider — fournisseur de contexte pour l'internationalisation modulaire.
 *
 * - Persiste le choix de langue dans localStorage et Cookie NEXT_LOCALE (1 an).
 * - Met à jour `lang` sur <html> pour l'accessibilité et le SEO.
 * - Expose `t(key, params)` avec détection de clé manquante explicite en développement.
 */
export function I18nProvider({
  children,
  initialLocale = "fr",
  locale: propLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
  locale?: Locale;
}) {
  const effectiveInitial = propLocale ?? initialLocale;
  const [locale, setLocaleState] = useState<Locale>(effectiveInitial);

  // Synchronise si la prop change (ex: navigation / tests)
  useEffect(() => {
    if (propLocale && propLocale !== locale) {
      const raf = requestAnimationFrame(() => {
        setLocaleState(propLocale);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [propLocale, locale]);

  // Initialise depuis localStorage uniquement si non spécifié explicitement
  useEffect(() => {
    if (propLocale) return;
    const raf = requestAnimationFrame(() => {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "fr" || stored === "en") {
        setLocaleState(stored);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [propLocale]);

  // Met à jour <html lang>, localStorage + Cookie quand la locale change
  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "fr" ? "en" : "fr"));
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[locale];
      let value = dict?.[key];

      if (value === undefined) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[i18n] ⚠️ Clé manquante pour la locale "${locale}": "${key}"`);
        }
        // Repli sur le français
        value = translations.fr[key];
      }

      // Si introuvable même en français
      if (value === undefined) {
        if (process.env.NODE_ENV === "development") {
          return `⚠️[${key}]`;
        }
        return key;
      }

      // Interpolation des variables simples : {name}, {count}, etc.
      if (params) {
        return Object.entries(params).reduce(
          (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
          value
        );
      }

      return value;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/** Hook pour accéder aux traductions et à la locale courante. */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  return ctx ?? defaultFallbackContext;
}
