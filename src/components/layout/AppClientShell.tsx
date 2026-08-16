"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ImmersiveBackground } from "@/components/effects/ImmersiveBackground";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { CookieConsent } from "@/components/branding/CookieConsent";
import { HomeView } from "@/components/sections/HomeView";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContentProvider } from "@/components/providers/ContentProvider";
import { I18nProvider } from "@/lib/i18n/provider";
import type { ViewKey } from "@/types/content";
import type { AppContentDTO } from "@/types/content";

/* === Code splitting des vues ===
 * Les vues non-accueil sont chargées à la demande (next/dynamic) : leur JS
 * n'est ni parsé ni hydraté au chargement initial, ce qui réduit fortement
 * le Total Blocking Time. La vue accueil (initiale) reste statique. */
const ServicesView = dynamic(
  () => import("@/components/sections/ServicesView").then((m) => m.ServicesView),
  { loading: () => <ViewLoading /> }
);
const SolutionsView = dynamic(
  () => import("@/components/sections/SolutionsView").then((m) => m.SolutionsView),
  { loading: () => <ViewLoading /> }
);
const BlogView = dynamic(
  () => import("@/components/sections/BlogView").then((m) => m.BlogView),
  { loading: () => <ViewLoading /> }
);
const ContactView = dynamic(
  () => import("@/components/sections/ContactView").then((m) => m.ContactView),
  { loading: () => <ViewLoading /> }
);
const LegalView = dynamic(
  () => import("@/components/sections/LegalView").then((m) => m.LegalView),
  { loading: () => <ViewLoading /> }
);
const AboutView = dynamic(
  () => import("@/components/sections/AboutView").then((m) => m.AboutView),
  { loading: () => <ViewLoading /> }
);
const ServiceDetailView = dynamic(
  () => import("@/components/sections/DetailView").then((m) => m.ServiceDetailView),
  { loading: () => <ViewLoading /> }
);
const SolutionDetailView = dynamic(
  () => import("@/components/sections/DetailView").then((m) => m.SolutionDetailView),
  { loading: () => <ViewLoading /> }
);
const BlogDetailView = dynamic(
  () => import("@/components/sections/DetailView").then((m) => m.BlogDetailView),
  { loading: () => <ViewLoading /> }
);

/** Fallback léger pendant le chargement d'une vue à la demande. */
function ViewLoading() {
  return <div className="min-h-[60vh]" aria-hidden />;
}

interface AppClientShellProps {
  content: AppContentDTO;
}

export function AppClientShell({ content }: AppClientShellProps) {
  const [view, setView] = useState<ViewKey>("home");
  const [detailId, setDetailId] = useState<string>("");
  // `mounted` permet de rendre le premier montage immédiatement visible
  // (pas d'entrée animée qui retarde le premier paint utile) tout en
  // conservant les transitions animées entre vues.
  const [mounted, setMounted] = useState(false);

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

  // Marqueur de premier montage pour l'animation d'entrée des vues
  useEffect(() => {
    // Initialisé côté client uniquement (évite un premier rendu animé qui
    // retarde le premier paint) — pattern standard SSR/hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
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
          {/* Fond dégradé fixe (le canevas de particules « Studio Géométrique 3D » a été retiré) */}
          <ImmersiveBackground />

          {/* Skip-link accessibilité */}
          <a
            href="#main-content"
            className="sr-only leading-7 text-slate-900 dark:text-slate-100 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-[#C9470F] focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-white"
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
                initial={mounted ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {view === "home" && <HomeView onNavigate={handleNavigate} onNavigateDetail={handleNavigateDetail} />}
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