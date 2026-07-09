"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * useMagneticHover — effet "aimant" premium (inspiration awwwards).
 *
 * L'élément ciblé suit légèrement le curseur de la souris quand elle
 * s'approche, créant une sensation magnétique.
 *
 * Optimisations (audit) :
 *  - Throttle par requestAnimationFrame (1 calcul par frame max).
 *  - Transition courte (180ms) pour un effet réactif.
 *  - Cleanup complet des styles au unmount.
 *  - Désactivé sur `pointer: coarse` (tactile réel).
 *
 * Usage :
 *   const ref = useMagneticHover<HTMLDivElement>({ strength: 0.18 });
 *   <div ref={ref}>…</div>
 */
interface MagneticOptions {
  /** Force de l'aimant (0 = aucun, 1 = suit parfaitement). Défaut 0.18. */
  strength?: number;
  /** Déplacement maximal en px. Défaut 12. */
  maxShift?: number;
}

export function useMagneticHover<T extends HTMLElement = HTMLDivElement>(
  options: MagneticOptions = {}
) {
  const { strength = 0.18, maxShift = 12 } = options;
  const ref = useRef<T>(null);
  // Flag de throttle rAF pour éviter les reflows excessifs
  const tickingRef = useRef(false);
  // Dernière position souris connue
  const mouseRef = useRef({ x: 0, y: 0 });

  const applyMagnet = useCallback(() => {
    tickingRef.current = false;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouseRef.current.x - cx;
    const dy = mouseRef.current.y - cy;
    // Plus le curseur est proche, plus l'aimant est fort
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.max(rect.width, rect.height) / 2;
    const proximity = Math.max(0, 1 - dist / maxDist);
    const factor = strength * proximity;
    const shiftX = Math.max(-maxShift, Math.min(maxShift, dx * factor));
    const shiftY = Math.max(-maxShift, Math.min(maxShift, dy * factor));
    el.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0)`;
  }, [strength, maxShift]);

  const handleMove = useCallback(
    (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(applyMagnet);
      }
    },
    [applyMagnet]
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0, 0, 0)";
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Désactive l'effet sur les appareils tactiles réels (pointer: coarse).
    if (window.matchMedia("(pointer: coarse)").matches) return;

    el.style.transition = "transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.willChange = "transform";
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      // Cleanup des styles posés
      el.style.transform = "";
      el.style.transition = "";
      el.style.willChange = "";
    };
  }, [handleMove, handleLeave]);

  return ref;
}
