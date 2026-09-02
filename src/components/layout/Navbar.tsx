"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { viewToPath, pathToView, getLocaleFromPath } from "@/lib/navigation/routes";
import { ScrambleText } from "@/components/interactive/ScrambleText";
import { Logo } from "@/components/branding/Logo";
import { ThemeToggle } from "@/components/branding/ThemeToggle";
import { LanguageToggle } from "@/components/branding/LanguageToggle";
import { GlassButton } from "@/components/interactive/GlassButton";
import { useScrollState } from "@/hooks/useScrollState";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { cn } from "@/lib/utils/cn";

/**
 * Navbar — Header capsule flottante en verre liquide inspiré du design "Cosmic Capsule".
 *
 * Structure :
 * - Gauche : Logo Analyticatech avec marque de précision
 * - Droite / Centre : Capsule en verre liquide unifiée avec liens de navigation,
 *   sélecteurs de langue / thème et bouton CTA pilule contrasté.
 * - 100% sans bouton hamburger parasite, fluide en thème clair et sombre.
 */
export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const activeView = pathToView(pathname);
  const { scrolled, hidden } = useScrollState();
  const { t } = useI18n();
  const { navItems } = useAppContent();
  const currentLocale = getLocaleFromPath(pathname);

  // Repli statique (mode offline ou DB injoignable)
  const STATIC_NAV: { key: ViewKey; label: string; hint: string }[] = [
    { key: "home", label: t("nav.home"), hint: "00" },
    { key: "services", label: t("nav.services"), hint: "01" },
    { key: "solutions", label: t("nav.solutions"), hint: "02" },
    { key: "blog", label: t("nav.blog"), hint: "03" },
    { key: "contact", label: t("nav.contact"), hint: "04" },
  ];

  const NAV_ITEMS =
    navItems.length > 0
      ? navItems.map((n) => ({ key: n.viewKey as ViewKey, label: n.label, hint: n.hint }))
      : STATIC_NAV;

  const handleCta = useCallback(() => {
    router.push(viewToPath("contact", undefined, currentLocale));
  }, [router, currentLocale]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-out",
        scrolled ? "py-2.5" : "py-4 md:py-6",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          {/* Logo Analyticatech */}
          <Link
            href={currentLocale === "en" ? "/en" : "/"}
            className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-[#F26D3D] shrink-0"
            aria-label={`${t("nav.home")} — AnalyticaTech`}
          >
            <Logo size={32} delay={0.2} />
            <span className="font-display text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Analytica<span className="text-[#F26D3D]">tech</span>
            </span>
          </Link>

          {/* Capsule Flottante Navigation & Actions (Design Liquid Glass Capsule) */}
          <nav
            aria-label="Navigation principale"
            className={cn(
              "relative flex items-center gap-1 sm:gap-1.5 rounded-full border p-1 sm:p-1.5 transition-all duration-300 backdrop-blur-2xl shadow-lg",
              scrolled
                ? "border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/70 shadow-black/10 dark:shadow-black/60"
                : "border-black/5 dark:border-white/[0.08] bg-white/70 dark:bg-slate-950/60 shadow-black/5 dark:shadow-black/40"
            )}
          >
            {/* Liseré supérieur lumineux */}
            <span
              className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent"
              aria-hidden="true"
            />

            {/* Liens de navigation */}
            <div className="flex items-center overflow-x-auto no-scrollbar py-0.5 px-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeView === item.key;
                const href = viewToPath(item.key, undefined, currentLocale);

                return (
                  <Link
                    key={item.key}
                    href={href}
                    className={cn(
                      "relative rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium tracking-tight transition-all duration-200 whitespace-nowrap",
                      isActive
                        ? "text-white bg-slate-900 dark:bg-white/15 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <ScrambleText text={item.label} />
                  </Link>
                );
              })}
            </div>

            {/* Séparateur subtil */}
            <span className="hidden sm:inline-block h-4 w-px bg-black/10 dark:bg-white/10 mx-1" aria-hidden="true" />

            {/* Toggles : Langue & Thème */}
            <div className="flex items-center gap-0.5">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            {/* Bouton CTA Pilule haute visibilité Liquid Glass */}
            <GlassButton
              onClick={handleCta}
              variant="primary"
              size="sm"
              borderRadius="9999px"
              className="ml-1 shrink-0"
            >
              <span>{t("nav.cta")}</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </GlassButton>
          </nav>
        </div>
      </div>
    </header>
  );
}