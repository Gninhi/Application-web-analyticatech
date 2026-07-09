"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImmersiveBackground } from "@/components/ImmersiveBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HomeView } from "@/components/sections/HomeView";
import { ServicesView } from "@/components/sections/ServicesView";
import { SolutionsView } from "@/components/sections/SolutionsView";
import { BlogView } from "@/components/sections/BlogView";
import { ContactView } from "@/components/sections/ContactView";
import type { ViewKey } from "@/lib/data";

/**
 * Page racine d'Analyticatech — monolithe SPA.
 *
 * Accessibilité :
 *  - Skip-link "Aller au contenu" (WCAG 2.4.1).
 *  - Focus management : au changement de vue, le main reçoit le focus
 *    pour annoncer le changement aux lecteurs d'écran.
 *  - aria-live region pour annoncer le changement de vue.
 */
export default function Home() {
  const [view, setView] = useState<ViewKey>("home");
  const [ready, setReady] = useState(false);

  const handleNavigate = useCallback((next: ViewKey) => {
    setView(next);
    // Remontée en haut à chaque changement de vue
    window.scrollTo(0, 0);
  }, []);

  // Marqueur de montée pour l'animation d'entrée
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Focus management + annonce SR au changement de vue
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (main) {
      main.focus();
    }
  }, [view]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Skip-link accessibilité */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-[#F26D3D] focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-white"
      >
        Aller au contenu principal
      </a>

      {/* Fond immersif Three.js (fixed, -z-10) */}
      <ImmersiveBackground />

      {/* Navbar globale */}
      <Navbar activeView={view} onNavigate={handleNavigate} />

      {/* Annonce SR du changement de vue */}
      <span className="sr-only" aria-live="polite">
        {view === "home" && "Page d'accueil"}
        {view === "services" && "Page Services"}
        {view === "solutions" && "Page Solutions"}
        {view === "blog" && "Page Insights"}
        {view === "contact" && "Page Contact"}
      </span>

      {/* Contenu principal — transitions entre vues */}
      <main
        id="main-content"
        className="flex-1 relative outline-none"
        tabIndex={-1}
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
    </div>
  );
}
