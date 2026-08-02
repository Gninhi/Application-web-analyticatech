"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useScrollVisibility } from "@/hooks/useScrollState";
import { Button } from "@/components/ui/moving-border";

/**
 * BackToTop — bouton flottant "retour vers le haut".
 *
 * Apparaît après un scroll de 600px (SCROLL_THRESHOLDS.backToTop).
 * Disparaît en animation quand l'utilisateur remonte en haut.
 * Smooth scroll natif du navigateur (respecte prefers-reduced-motion).
 *
 * Utilise le hook centralisé useScrollVisibility.
 *
 * Le bouton lui-même est rendu par le composant `Button` (bordure lumineuse
 * animée orange→bleu). Le wrapper `motion.div` ne sert plus qu'à porter
 * l'animation d'apparition (AnimatePresence).
 */
export function BackToTop() {
  const visible = useScrollVisibility();

  const scrollToTop = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Button
            onClick={scrollToTop}
            aria-label="Retour en haut de page"
            borderRadius="9999px"
            duration={2500}
            className="h-12 w-12 flex items-center justify-center bg-[#F26D3D] text-white shadow-lg shadow-black/40 transition hover:bg-[#ff7a4a] neon-glow focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <ArrowUp className="h-5 w-5" aria-hidden />
      </Button>
       </motion.div>
      )}
  </AnimatePresence>
  );
}
