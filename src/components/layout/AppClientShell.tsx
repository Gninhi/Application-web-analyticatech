"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImmersiveBackground } from "@/components/effects/ImmersiveBackground";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { CookieConsent } from "@/components/branding/CookieConsent";
import { HomeView } from "@/components/sections/HomeView";
import { ServicesView } from "@/components/sections/ServicesView";
import { SolutionsView } from "@/components/sections/SolutionsView";
import { BlogView } from "@/components/sections/BlogView";
import { ContactView } from "@/components/sections/ContactView";
import { LegalView } from "@/components/sections/LegalView";
import { AboutView } from "@/components/sections/AboutView";
import { ServiceDetailView, SolutionDetailView, BlogDetailView } from "@/components/sections/DetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContentProvider } from "@/components/providers/ContentProvider";
import { I18nProvider } from "@/lib/i18n/provider";
import type { ViewKey } from "@/lib/i18n/data-fr";
import type { AppContentDTO } from "@/types/content";

interface AppClientShellProps {
  content: AppContentDTO;
}

export function AppClientShell({ content }: AppClientShellProps) {
  const [view, setView] = useState<ViewKey>("home");
  const [detailId, setDetailId] = useState<string>("");
  const [ready, setReady] = useState(false);

  /** Navigation vers une vue simple (sans détail). */
  const handleNavigate = useCallback((next: ViewKey) => {
    setView(next);
    setDetailId("");
    window.scrollTo(0, 0);
  }, []);

  /** Navigation vers une vue de détail avec ID. */
  const handleNavigateDetail = useCallback((next: ViewKey, id: string) => {
    setView(next);
    setDetailId(id);
    window.scrollTo(0, 0);
  }, []);

  // Marqueur de montée pour l'animation d'entrée
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Focus management + annonce SR au changement de vue
  useEffect(() => {
    document.getElementById("main-content")?.focus();
  }, [view, detailId]);

  return (
    <I18nProvider initialLocale={content.locale}>
      <ContentProvider content={content}>
        <JsonLd />
        <div className="relative min-h-screen flex flex-col">
          {/* Fond immersif Three.js (fixed, -z-10) */}
          <ImmersiveBackground />

          {/* Skip-link accessibilité */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-[#F26D3D] focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-white"
          >
            Aller au contenu principal
          </a>

          {/* Navbar globale */}
          <Navbar activeView={view} onNavigate={handleNavigate} />

          {/* Annonce SR du changement de vue */}
          <span className="sr-only" aria-live="polite">
            {view === "home" && "Page d'accueil"}
            {view === "services" && "Page Services"}
            {view === "solutions" && "Page Solutions"}
            {view === "blog" && "Page Insights"}
            {view === "contact" && "Page Contact"}
            {view === "rgpd" && "Politique de confidentialité"}
            {view === "legal" && "Mentions légales"}
            {view === "about" && "À propos"}
            {view === "service-detail" && "Détail du service"}
            {view === "solution-detail" && "Détail de la solution"}
            {view === "blog-detail" && "Article"}
          </span>

          {/* Contenu principal — transitions entre vues */}
          <main className="flex-1 relative outline-none" id="main-content" tabIndex={-1}>
            <AnimatePresence mode="wait">
              <motion.div
                key={view + detailId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: ready ? 1 : 0, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {view === "home" && <HomeView onNavigate={handleNavigate} />}
                {view === "services" && <ServicesView onNavigate={handleNavigate} onNavigateDetail={handleNavigateDetail} />}
                {view === "solutions" && <SolutionsView onNavigate={handleNavigate} onNavigateDetail={handleNavigateDetail} />}
                {view === "blog" && <BlogView onNavigateDetail={handleNavigateDetail} />}
                {view === "contact" && <ContactView />}
                {view === "rgpd" && <LegalView type="rgpd" onNavigate={handleNavigate} />}
                {view === "legal" && <LegalView type="legal" onNavigate={handleNavigate} />}
                {view === "about" && <AboutView onNavigate={handleNavigate} />}
                {view === "service-detail" && <ServiceDetailView serviceIndex={detailId} onNavigate={handleNavigate} />}
                {view === "solution-detail" && <SolutionDetailView solutionId={detailId} onNavigate={handleNavigate} />}
                {view === "blog-detail" && <BlogDetailView postId={detailId} onNavigate={handleNavigate} />}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer global (sticky bottom via flex-col + mt-auto) */}
          <Footer onNavigate={handleNavigate} />

          {/* Bouton retour-haut flottant */}
          <BackToTop />

          {/* Bandeau consentement cookies RGPD */}
          <CookieConsent />
        </div>
      </ContentProvider>
    </I18nProvider>
  );
}
