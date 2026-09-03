"use client";

import { useState, useEffect, useRef } from "react";
import { SCROLL_THRESHOLDS } from "@/lib/content/site";

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

        setState((prev) => {
          let hidden = prev.hidden;
          if (currentY > SCROLL_THRESHOLDS.autoHide && delta > SCROLL_THRESHOLDS.scrollDelta) {
            hidden = true;
          } else if (delta < -SCROLL_THRESHOLDS.scrollDelta || atTop) {
            hidden = false;
          }

          if (prev.scrolled === scrolled && prev.hidden === hidden && prev.atTop === atTop) {
            return prev; // Bailout React : aucun re-render !
          }

          return { scrollY: currentY, scrolled, hidden, atTop };
        });

        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

/**
 * useScrollProgress — hook pour suivre la progression du scroll (0 à 100%)
 * et la visibilité au-delà d'un seuil.
 * Throttle via requestAnimationFrame avec bailout React pour éviter les re-renders inutiles.
 */
export function useScrollProgress(threshold: number = SCROLL_THRESHOLDS.backToTop) {
  const [data, setData] = useState<{ progress: number; visible: boolean }>({
    progress: 0,
    visible: false,
  });

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentProgress = totalHeight > 0
          ? Math.min(100, Math.max(0, Math.round((currentY / totalHeight) * 100)))
          : 0;
        const isVisible = currentY > threshold;

        setData((prev) => {
          if (prev.visible === isVisible && prev.progress === currentProgress) {
            return prev;
          }
          return { progress: currentProgress, visible: isVisible };
        });

        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [threshold]);

  return data;
}
