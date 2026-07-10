"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImmersiveBackground } from "@/components/ImmersiveBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { CookieConsent } from "@/components/CookieConsent";
import { HomeView } from "@/components/sections/HomeView";
import { ServicesView } from "@/components/sections/ServicesView";
import { SolutionsView } from "@/components/sections/SolutionsView";
import { BlogView } from "@/components/sections/BlogView";
import { ContactView } from "@/components/sections/ContactView";
import type { ViewKey } from "@/lib/data";

/**
 * Page racine d'Analyticatech — monolithe SPA.
 * La navigation entre les "vues" s'opère par état client (route / unique),
 * avec transitions Framer Motion et remontée en haut de page à chaque switch.
 */
export default function Home() {
  const [view, setView] = useState<ViewKey>("home");
  const [ready, setReady] = useState(false);

  const handleNavigate = useCallback((next: ViewKey) => {
    setView(next);
    // Remontée instantanée en haut à chaque changement de vue
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Marqueur de montée pour l'animation d'entrée
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Fond immersif Three.js (fixed, -z-10) */}
      <ImmersiveBackground />

      {/* Navbar globale */}
      <Navbar activeView={view} onNavigate={handleNavigate} />

      {/* Contenu principal — transitions entre vues */}
      <main
        className="flex-1 relative"
        id="main-content"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: ready ? 1 : 0, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {view === "home" && <HomeView onNavigate={handleNavigate} />}
            {view === "services" && <ServicesView onNavigate={handleNavigate} />}
            {view === "solutions" && <SolutionsView onNavigate={handleNavigate} />}
            {view === "blog" && <BlogView />}
            {view === "contact" && <ContactView />}
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
  );
}
