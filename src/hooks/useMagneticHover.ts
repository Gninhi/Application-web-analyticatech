"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * useMagneticHover — effet "aimant" premium (inspiration awwwards).
 *
 * L'élément ciblé suit légèrement le curseur de la souris quand elle
 * s'approche, créant une sensation magnétique. Le déplacement est
 * limité (±maxShift px) et adouci par une transition CSS.
 *
 * Usage :
 *   const ref = useMagneticHover<HTMLDivElement>({ strength: 0.25 });
 *   <div ref={ref}>…</div>
 *
 * NOTE : l'effet est désactivé sur les écrans tactiles / petits viewports
 * pour préserver les performances et l'UX mobile.
 */
interface MagneticOptions {
  /** Force de l'aimant (0 = aucun, 1 = suit parfaitement). Défaut 0.25. */
  strength?: number;
  /** Déplacement maximal en px. Défaut 18. */
  maxShift?: number;
}

export function useMagneticHover<T extends HTMLElement = HTMLDivElement>(
  options: MagneticOptions = {}
) {
  const { strength = 0.25, maxShift = 18 } = options;
  const ref = useRef<T>(null);

  const handleMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      // Plus le curseur est proche, plus l'aimant est fort
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.max(rect.width, rect.height) / 2;
      const proximity = Math.max(0, 1 - dist / maxDist);
      const factor = strength * proximity;
      const shiftX = Math.max(-maxShift, Math.min(maxShift, dx * factor));
      const shiftY = Math.max(-maxShift, Math.min(maxShift, dy * factor));
      el.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0)`;
    },
    [strength, maxShift]
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0, 0, 0)";
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Désactive l'effet sur les appareils tactiles réels (pointer: coarse).
    // On utilise `pointer: coarse` plutôt que `hover: none` car les headless
    // browsers et certains environnements de test déclarent `hover: none`
    // tout en supportant `mousemove`.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    el.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.willChange = "transform";
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [handleMove, handleLeave]);

  return ref;
}
