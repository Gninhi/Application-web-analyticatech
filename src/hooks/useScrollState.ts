"use client";

import { useState, useEffect, useRef } from "react";
import { SCROLL_THRESHOLDS } from "@/lib/constants";

interface ScrollState {
  scrollY: number;
  scrolled: boolean;     // > glassEffect
  hidden: boolean;       // auto-hide (scroll down)
  atTop: boolean;        // scrollY < autoHide
}

/**
 * useScrollState — hook centralisé pour la gestion du scroll.
 *
 * Utilisé par :
 *  - Navbar (auto-hide + glass effect)
 *  - BackToTop (affichage après seuil)
 *
 * Throttle via requestAnimationFrame pour la performance.
 */
export function useScrollState(): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    scrolled: false,
    hidden: false,
    atTop: true,
  });
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        const scrolled = currentY > SCROLL_THRESHOLDS.glassEffect;
        const atTop = currentY < SCROLL_THRESHOLDS.autoHide;

        // Auto-hide : masque si on scroll vers le bas (après autoHide)
        let hidden = state.hidden;
        if (currentY > SCROLL_THRESHOLDS.autoHide && delta > SCROLL_THRESHOLDS.scrollDelta) {
          hidden = true;
        } else if (delta < -SCROLL_THRESHOLDS.scrollDelta || atTop) {
          hidden = false;
        }

        setState({ scrollY: currentY, scrolled, hidden, atTop });
        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [state.hidden]);

  return state;
}

/**
 * useScrollVisibility — hook simplifié pour afficher/masquer un élément
 * après un seuil de scroll (utilisé par BackToTop).
 */
export function useScrollVisibility(threshold: number = SCROLL_THRESHOLDS.backToTop) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > threshold);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return visible;
}
