"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";

/**
 * PageLoader — intro cinématographique "→ 100%" inspiré Armory.
 *
 * IMPORTANT (hydration) :
 *  - L'état initial est TOUJOURS { progress: 0, done: false } côté serveur
 *    ET côté client (premier rendu identique → pas de mismatch).
 *  - La vérification de sessionStorage se fait dans useEffect (post-hydration).
 *  - Si déjà vu dans la session, on saute le loader via un setState différé
 *    dans requestAnimationFrame (évite le setState synchrone en effect).
 */
export function PageLoader() {
  // État initial identique serveur/client → pas d'hydration mismatch
  const [state, setState] = useState<{ progress: number; done: boolean }>({
    progress: 0,
    done: false,
  });

  useEffect(() => {
    // Si déjà vu dans cette session → on saute le loader
    // (setState différé dans rAF pour éviter le setState synchrone en effect)
    if (sessionStorage.getItem("at-loader-seen")) {
      const skipRaf = requestAnimationFrame(() => {
        setState({ progress: 100, done: true });
      });
      return () => cancelAnimationFrame(skipRaf);
    }

    // Sinon, on lance l'animation du compteur 0 → 100
    let raf = 0;
    const start = performance.now();
    const duration = 1800; // ms

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easing easeOutQuart
      const eased = 1 - Math.pow(1 - t, 4);
      const value = Math.round(eased * 100);

      if (t < 1) {
        setState({ progress: value, done: false });
        raf = requestAnimationFrame(tick);
      } else {
        setState({ progress: 100, done: false });
        // Marque comme "vu" puis masque après un court délai
        setTimeout(() => {
          setState({ progress: 100, done: true });
          sessionStorage.setItem("at-loader-seen", "1");
        }, 350);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { progress, done } = state;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-background grid-tech flex flex-col items-center justify-center"
          role="status"
          aria-live="polite"
          aria-label="Chargement du site Analyticatech"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-12"
          >
            <Logo size={48} delay={0.3} />
            <span className="font-display text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-800 dark:text-slate-100">
              Analytica<span className="text-[#F26D3D]">tech</span>
            </span>
          </motion.div>

          {/* Compteur géant */}
          <div className="font-display text-7xl md:text-9xl font-bold tracking-tight text-slate-900 dark:text-slate-900 dark:text-slate-50 tabular-nums">
            {String(progress).padStart(3, "0")}
            <span className="text-[#F26D3D]">%</span>
          </div>

          {/* Label étiré */}
          <p className="stretch-text text-[10px] md:text-xs text-slate-500 dark:text-slate-500 dark:text-slate-400 mt-4">
            Initialisation système
          </p>

          {/* Barre de progression fine */}
          <div className="mt-8 w-64 md:w-96 h-px bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-[#F26D3D]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Logs de chargement (signature cyberpunk) */}
          <div className="mt-6 font-mono text-[10px] text-slate-500 h-4">
            {progress < 30 && <span>› Initialisation du champ de particules…</span>}
            {progress >= 30 && progress < 60 && <span>› Calibrage du maillage neuronal…</span>}
            {progress >= 60 && progress < 90 && <span>› Établissement du canal sécurisé…</span>}
            {progress >= 90 && <span className="text-[#4CAF50]">› Système prêt.</span>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
