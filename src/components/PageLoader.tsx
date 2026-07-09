"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu } from "lucide-react";

/**
 * PageLoader — intro cinématographique "→ 100%" inspiré Armory.
 *
 * Hydration-safe : état initial identique serveur/client.
 * La vérification sessionStorage se fait dans useEffect (post-hydration).
 *
 * Accessibilité :
 *  - `aria-busy="true"` pendant le chargement (pas de spam aria-live).
 *  - Annonce unique "System ready" à la fin via une live region séparée.
 */
export function PageLoader() {
  const [state, setState] = useState<{ progress: number; done: boolean }>({
    progress: 0,
    done: false,
  });
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Si déjà vu dans cette session → on saute le loader
    if (sessionStorage.getItem("at-loader-seen")) {
      const skipRaf = requestAnimationFrame(() => {
        setState({ progress: 100, done: true });
      });
      return () => cancelAnimationFrame(skipRaf);
    }

    let raf = 0;
    const start = performance.now();
    const duration = 1800;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      const value = Math.round(eased * 100);

      if (t < 1) {
        setState({ progress: value, done: false });
        raf = requestAnimationFrame(tick);
      } else {
        setState({ progress: 100, done: false });
        // Marque comme "vu" puis masque après un court délai
        const t1 = setTimeout(() => {
          setState({ progress: 100, done: true });
          sessionStorage.setItem("at-loader-seen", "1");
        }, 350);
        timersRef.current.push(t1);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const { progress, done } = state;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#011C40] grid-tech flex flex-col items-center justify-center"
          role="status"
          aria-busy={!done}
          aria-label="Chargement du site Analyticatech"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-12"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#F26D3D]/40 bg-[#F26D3D]/10">
              <Cpu className="h-6 w-6 text-[#F26D3D]" aria-hidden />
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-slate-100">
              Analytica<span className="text-[#F26D3D]">tech</span>
            </span>
          </motion.div>

          {/* Compteur géant */}
          <div
            className="font-display text-7xl md:text-9xl font-bold tracking-tight text-slate-50 tabular-nums"
            aria-hidden="true"
          >
            {String(progress).padStart(3, "0")}
            <span className="text-[#F26D3D]">%</span>
          </div>

          {/* Label étiré */}
          <p className="stretch-text text-[10px] md:text-xs text-slate-500 mt-4">
            Initialisation système
          </p>

          {/* Barre de progression fine */}
          <div className="mt-8 w-64 md:w-96 h-px bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-[#F26D3D]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Logs de chargement (visuel seulement, aria-hidden) */}
          <div className="mt-6 font-mono text-[10px] text-slate-600 h-4" aria-hidden="true">
            {progress < 30 && <span>› Mounting particle field…</span>}
            {progress >= 30 && progress < 60 && <span>› Calibrating neural mesh…</span>}
            {progress >= 60 && progress < 90 && <span>› Establishing secure channel…</span>}
            {progress >= 90 && <span className="text-[#4CAF50]">› System ready.</span>}
          </div>

          {/* Live region silencieuse : annonce unique à la fin pour les SR */}
          {progress >= 100 && (
            <span className="sr-only" role="status">
              Site Analyticatech chargé. Système prêt.
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
