"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { ImmersiveBackground } from "@/components/effects/ImmersiveBackground";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContentProvider } from "@/components/providers/ContentProvider";
import { I18nProvider, useI18n } from "@/lib/i18n/provider";
import { pathToView } from "@/lib/navigation/routes";
import type { AppContentDTO } from "@/types/content";

const BackToTop = dynamic(
  () => import("@/components/layout/BackToTop").then((m) => m.BackToTop),
  { ssr: false }
);
const CookieConsent = dynamic(
  () => import("@/components/branding/CookieConsent").then((m) => m.CookieConsent),
  { ssr: false }
);
const Toaster = dynamic(
  () => import("@/components/ui/toaster").then((m) => m.Toaster),
  { ssr: false }
);

interface SiteShellProps {
  content: AppContentDTO;
  children: React.ReactNode;
}

function SiteShellInner({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const view = pathToView(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const firstMount = useRef(true);
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    const applyFocus = () => {
      const el = document.getElementById("main-content");
      if (el) {
        el.focus({ preventScroll: true });
      }
    };
    applyFocus();
    const rafId = requestAnimationFrame(applyFocus);
    const timerId = setTimeout(applyFocus, 100);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [pathname]);





  return (
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

      {/* Annonce SR du changement de route (traduite) */}
      <span className="sr-only" aria-live="polite">
        {t(`view.${view}`)}
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

      {/* Footer global */}
      <Footer />

      {/* Bouton retour-haut flottant */}
      <BackToTop />

      {/* Bandeau consentement cookies RGPD */}
      <CookieConsent />

      {/* Notifications toast */}
      <Toaster />
    </div>
  );
}

/**
 * SiteShell — enveloppe globale partagée par toutes les routes.
 */
export function SiteShell({ content, children }: SiteShellProps) {
  return (
    <MotionConfig reducedMotion="user">
      <I18nProvider initialLocale={content.locale}>
        <ContentProvider content={content}>
          <JsonLd />
          <SiteShellInner>{children}</SiteShellInner>
        </ContentProvider>
      </I18nProvider>
    </MotionConfig>
  );
}
