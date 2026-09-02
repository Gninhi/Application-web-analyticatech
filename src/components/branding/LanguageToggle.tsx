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
      className="group relative inline-flex h-9 items-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.06] px-2.5 py-1 backdrop-blur-md transition-all duration-300 hover:border-[#F26D3D]/50 hover:bg-white/80 dark:hover:bg-white/[0.1] cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Globe className="h-3.5 w-3.5 text-slate-500 group-hover:text-[#F26D3D] transition-colors" aria-hidden />

      <div className="flex items-center gap-1 font-mono text-xs font-bold tracking-wider">
        <span
          className={`transition-colors duration-200 ${
            displayLocale === "fr"
              ? "text-[#F26D3D]"
              : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
          }`}
        >
          FR
        </span>
        <span className="text-slate-300 dark:text-slate-600 text-[10px]" aria-hidden>/</span>
        <span
          className={`transition-colors duration-200 ${
            displayLocale === "en"
              ? "text-[#F26D3D]"
              : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
          }`}
        >
          EN
        </span>
      </div>

      {/* Point lumineux actif */}
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#F26D3D] shadow-[0_0_8px_#F26D3D]"
        aria-hidden
      />
    </button>
  );
}
