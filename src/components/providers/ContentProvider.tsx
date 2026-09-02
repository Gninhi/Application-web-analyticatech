"use client";

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";

import type { AppContentDTO, Locale } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { FALLBACK_SERVICES_EN, FALLBACK_SOLUTIONS_EN } from "@/lib/content/fallbacks";

const ContentContext = createContext<AppContentDTO | null>(null);



const ENGLISH_MARQUEE_KEYWORDS = [
  "RAG ARCHITECTURES",
  "MULTI-AGENT COLLECTIVES",
  "DBT & MODERN DATA STACK",
  "N8N & TEMPORAL WORKFLOWS",
  "ENTERPRISE AI GOVERNANCE",
  "LLM BENCHMARK & EVALS",
  "HIGH-PERFORMANCE DATA PLATFORMS",
];

const METRIC_TRANSLATIONS_EN: Record<string, string> = {
  "ANS D'EXPERTISE R&D": "YEARS OF R&D EXPERTISE",
  "DISPONIBILITÉ SYSTÈMES": "SYSTEM AVAILABILITY",
  "PRÉCISION RAG (BENCHMARKS)": "RAG ACCURACY (BENCHMARKS)",
  "RÉDUCTION TEMPS TRAITEMENT": "PROCESSING TIME REDUCTION",
  "PROJETS LIVRÉS EN PROD": "PROJECTS DELIVERED TO PROD",
  "ÉCONOMIES MOYENNES CONSTATÉES": "AVERAGE CLIENT SAVINGS",
};

/**
 * Crée un DTO d'appoint immédiat en anglais basé sur les constantes validées
 * afin d'éviter tout écran blanc ou décalage de layout pendant le fetch API.
 */
function deriveEnglishFallbackContent(baseContent: AppContentDTO): AppContentDTO {
  return {
    ...baseContent,
    locale: "en",
    services: FALLBACK_SERVICES_EN,
    solutions: FALLBACK_SOLUTIONS_EN,
    marqueeKeywords: ENGLISH_MARQUEE_KEYWORDS,
    metrics: baseContent.metrics.map((m) => ({
      ...m,
      label: METRIC_TRANSLATIONS_EN[m.label.toUpperCase()] || m.label,
    })),
  };
}

export function ContentProvider({
  content: initialContent,
  children,
}: {
  content: AppContentDTO;
  children: ReactNode;
}) {
  const { locale } = useI18n();

  // Cache mémoire par locale
  const [contentCache, setContentCache] = useState<Partial<Record<Locale, AppContentDTO>>>(() => ({
    [initialContent.locale]: initialContent,
    ...(initialContent.locale === "fr"
      ? { en: deriveEnglishFallbackContent(initialContent) }
      : { fr: initialContent }),
  }));

  const fetchedLocalesRef = useRef<Set<Locale>>(new Set([initialContent.locale]));
  const pendingFetchesRef = useRef<Map<Locale, Promise<AppContentDTO | null>>>(new Map());

  // Synchronisation asynchrone avec l'API de contenu Supabase lorsqu'on passe sur une langue non encore chargée
  useEffect(() => {
    let isCancelled = false;

    // Si la locale a déjà été chargée depuis l'API ou le SSR, aucun refetch
    if (fetchedLocalesRef.current.has(locale) && contentCache[locale]) {
      return;
    }

    async function fetchLocaleContent(): Promise<void> {
      try {
        let fetchPromise = pendingFetchesRef.current.get(locale);
        if (!fetchPromise) {
          fetchPromise = (async () => {
            const res = await fetch(`/api/v1/content?locale=${locale}`);
            if (!res.ok) return null;
            const json = await res.json();
            const data: AppContentDTO = json.data ?? json;
            return data && data.locale === locale ? data : null;
          })();
          pendingFetchesRef.current.set(locale, fetchPromise);
        }

        const data = await fetchPromise;
        pendingFetchesRef.current.delete(locale);

        if (!isCancelled && data) {
          fetchedLocalesRef.current.add(locale);
          setContentCache((prev) => ({
            ...prev,
            [locale]: data,
          }));
        }
      } catch {
        pendingFetchesRef.current.delete(locale);
        // En cas d'erreur réseau, le fallback local reste actif sans crash
      }
    }

    void fetchLocaleContent();

    return () => {
      isCancelled = true;
    };
  }, [locale, contentCache]);

  // Contenu actif : issu du cache complet, sinon fallback immédiat pour 0-latence
  const activeContent =
    contentCache[locale] ||
    (locale === "en" ? deriveEnglishFallbackContent(initialContent) : initialContent);

  return (
    <ContentContext.Provider value={activeContent}>
      {children}
    </ContentContext.Provider>
  );
}

/** Hook d'accès universel aux données dynamiques du site. */
export function useAppContent(): AppContentDTO {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useAppContent doit être utilisé au sein d'un ContentProvider");
  }
  return ctx;
}

/** Hook optionnel d'accès aux données sans lever d'exception si hors provider (ex: _not-found). */
export function useAppContentOptional(): AppContentDTO | null {
  return useContext(ContentContext);
}

