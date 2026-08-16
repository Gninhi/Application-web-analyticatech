"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ImmersiveBackground } from "@/components/effects/ImmersiveBackground";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { CookieConsent } from "@/components/branding/CookieConsent";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContentProvider } from "@/components/providers/ContentProvider";
import { I18nProvider } from "@/lib/i18n/provider";
import { pathToView } from "@/lib/navigation/routes";
import type { AppContentDTO, ViewKey } from "@/types/content";

const VIEW_LABELS: Partial<Record<ViewKey, string>> = {
  home: "Page d'accueil",
  services: "Page Services",
  solutions: "Page Solutions",
  blog: "Page Insights",
  contact: "Page Contact",
  rgpd: "Politique de confidentialité",
  legal: "Mentions légales",
  about: "À propos",
  "service-detail": "Détail du service",
  "solution-detail": "Détail de la solution",
  "blog-detail": "Article",
};

interface SiteShellProps {
  content: AppContentDTO;
  children: React.ReactNode;
}

/**
 * SiteShell — enveloppe globale partagée par toutes les routes.
 *
 * Remplace l'ancien shell SPA : plus de state de vue ; l'URL est la source de
 * vérité. Providers (contenu + i18n), JsonLd, fond immersif, skip-link,
 * navbar/footer et focus management restent centralisés ici, tandis que les
 * pages rendent leur contenu dans `<main>` (code splitting par route).
 */
export function SiteShell({ content, children }: SiteShellProps) {
  const pathname = usePathname();
  const view = pathToView(pathname);
  // `mounted` permet de rendre le premier montage immédiatement visible
  // (pas d'entrée animée qui retarde le premier paint utile) tout en
  // conservant les transitions animées entre routes.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Focus management : au changement de route, le focus est porté sur le
  // contenu principal (WCAG 2.4.3). Le premier rendu est exclu : focuser main
  // dès le chargement neutraliserait le skip-link (premier Tab = CTA du hero
  // au lieu d'« Aller au contenu »).
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.getElementById("main-content")?.focus();
  }, [pathname]);

  return (
    <I18nProvider initialLocale={content.locale}>
      <ContentProvider content={content}>
        <JsonLd />
        <div className="relative min-h-screen flex flex-col">
          {/* Fond dégradé fixe */}
          <ImmersiveBackground />

          {/* Skip-link accessibilité */}
          <a
            href="#main-content"
            className="sr-only leading-7 text-slate-900 dark:text-slate-100 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-[#C9470F] focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-white"
          >
            Aller au contenu principal
          </a>

          {/* Navbar globale */}
          <Navbar />

          {/* Annonce SR du changement de route */}
          <span className="sr-only" aria-live="polite">
            {VIEW_LABELS[view] ?? ""}
          </span>

          {/* Contenu principal — transitions entre routes */}
          <main className="flex-1 relative outline-none" id="main-content" tabIndex={-1}>
            <motion.div
              key={pathname}
              initial={mounted ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </main>

          {/* Footer global (sticky bottom via flex-col + mt-auto) */}
          <Footer />

          {/* Bouton retour-haut flottant */}
          <BackToTop />

          {/* Bandeau consentement cookies RGPD */}
          <CookieConsent />
        </div>
      </ContentProvider>
    </I18nProvider>
  );
}