"use client";

import { useTransition, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { getAlternatePath, getLocaleFromPath } from "@/lib/navigation/routes";
import { Globe } from "lucide-react";
import type { Locale } from "@/types/content";

/**
 * LanguageToggle — Sélecteur de langue bilingue (FR / EN).
 *
 * Fonctionnalités :
 *  1. Navigation vers l'URL équivalente exacte dans l'autre langue (ex: /services/01 ⇄ /en/services/01).
 *  2. Mémorisation permanente du choix utilisateur dans le cookie NEXT_LOCALE (1 an) et localStorage.
 *  3. Synchronisation synchrone du contexte i18n et de l'attribut <html lang>.
 *  4. startTransition pour ne jamais bloquer le thread principal (INP < 16ms).
 */
export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { setLocale } = useI18n();
  const [, startTransition] = useTransition();

  // Détermine la locale active d'après l'URL (SSR-safe et déterministe)
  const displayLocale: Locale = getLocaleFromPath(pathname);
  const targetLocale: Locale = displayLocale === "fr" ? "en" : "fr";

  const handleToggle = useCallback(() => {
    const targetUrl = getAlternatePath(pathname, targetLocale);

    // Mémorisation explicite et durable (1 an)
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
    try {
      localStorage.setItem("at-locale", targetLocale);
    } catch {
      // Ignorer si localStorage est restreint
    }

    startTransition(() => {
      setLocale(targetLocale);
      document.documentElement.lang = targetLocale;
      router.push(targetUrl);
    });
  }, [pathname, targetLocale, router, setLocale, startTransition]);


  const actionLabel = displayLocale === "fr"
    ? "Passer en anglais (Switch to English)"
    : "Switch to French (Passer en français)";

  const ariaLabel = `${displayLocale.toUpperCase()} · ${actionLabel}`;

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={ariaLabel}
      title={actionLabel}
      className="group relative inline-flex h-9 items-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Globe className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors" aria-hidden />
      <span className="font-mono text-xs font-bold tracking-wider">
        {displayLocale.toUpperCase()}
      </span>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors font-mono">
        ⇄ {targetLocale.toUpperCase()}
      </span>
    </button>
  );
}
