"use client";

import { useTransition, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { getAlternatePath, getLocaleFromPath } from "@/lib/navigation/routes";
import { NavbarActionToggle } from "@/components/branding/NavbarActionToggle";
import type { Locale } from "@/types/content";

/**
 * LanguageToggle — Bouton compact de sélection de langue (format ThemeToggle).
 *
 * Conçu pour mobile et desktop :
 *  - Format carré standard 36x36px (h-9 w-9) strictement aligné sur le ThemeToggle.
 *  - Affiche le code de la langue sélectionnée (FR ou EN).
 *  - Bascule instantanée sans blocage du thread principal (startTransition).
 *  - Mémorisation dans cookie NEXT_LOCALE (1 an) et localStorage.
 */
export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { setLocale } = useI18n();
  const [, startTransition] = useTransition();

  const displayLocale: Locale = getLocaleFromPath(pathname);
  const targetLocale: Locale = displayLocale === "fr" ? "en" : "fr";

  const handleToggle = useCallback(() => {
    const targetUrl = getAlternatePath(pathname, targetLocale);

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

  const title =
    displayLocale === "fr"
      ? "Passer en anglais (Switch to English)"
      : "Switch to French (Passer en français)";

  const ariaLabel =
    displayLocale === "fr"
      ? "Langue actuelle : Français. Cliquer pour passer en anglais."
      : "Current language: English. Click to switch to French.";

  return (
    <NavbarActionToggle
      onClick={handleToggle}
      aria-label={ariaLabel}
      title={title}
    >
      <span className="text-[12px] font-semibold tracking-[0.08em]">
        {displayLocale === "fr" ? "FR" : "EN"}
      </span>
    </NavbarActionToggle>
  );
}
