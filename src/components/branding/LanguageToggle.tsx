"use client";

import { useTransition, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { getAlternatePath, getLocaleFromPath } from "@/lib/navigation/routes";
import { NavbarActionToggle } from "@/components/branding/NavbarActionToggle";
import type { Locale } from "@/types/content";

/**
 * Drapeaux vectoriels précis (FR / UK)
 * - Rendu SVG pur, ultra-léger, sans dépendance externe ni emoji OS
 * - Bords arrondis avec liseré subtil pour contraster sur fonds clairs/sombres
 */
function FlagFR() {
  return (
    <svg
      viewBox="0 0 24 16"
      className="h-3.5 w-5 block shrink-0"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="8" height="16" fill="#002654" />
      <rect x="8" y="0" width="8" height="16" fill="#FFFFFF" />
      <rect x="16" y="0" width="8" height="16" fill="#CE1126" />
    </svg>
  );
}

function FlagEN() {
  return (
    <svg
      viewBox="0 0 60 30"
      className="h-3.5 w-5 block shrink-0"
      preserveAspectRatio="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <clipPath id="at-uk-flag-clip">
        <path d="M0,0 L30,15 H0 Z M60,0 L30,15 V0 Z M60,30 L30,15 H60 Z M0,30 L30,15 V30 Z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        stroke="#C8102E"
        strokeWidth="4"
        clipPath="url(#at-uk-flag-clip)"
      />
      <path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

/**
 * LanguageToggle — Bouton compact de sélection de langue (format ThemeToggle).
 *
 * Conçu pour mobile et desktop :
 *  - Format carré standard 36x36px (h-9 w-9) strictement aligné sur le ThemeToggle.
 *  - Affiche le drapeau de la langue sélectionnée (FR 🇫🇷 ou EN 🇬🇧).
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
      <span className="relative inline-flex items-center justify-center overflow-hidden rounded-[2.5px] border border-black/15 dark:border-white/20 shadow-xs transition-transform duration-200 hover:scale-105 active:scale-95">
        {displayLocale === "fr" ? <FlagFR /> : <FlagEN />}
      </span>
    </NavbarActionToggle>
  );
}
