"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Nombre de décimales affichées (avant formatage). */
  decimals?: number;
  /** Durée de l'animation en ms. */
  duration?: number;
  /** Dégré d'overflow du compteur (0 = aucun). */
  easing?: "easeOutExpo" | "easeOutCubic" | "linear";
  /** Locale pour le séparateur de milliers / virgule décimale. */
  locale?: string;
  /** Annonce les changements aux lecteurs d'écran (à activer uniquement hors tableaux). */
  ariaLive?: boolean;
  className?: string;
}

/** Courbes d'easing réutilisées par le compteur. */
const EASINGS: Record<NonNullable<AnimatedCounterProps["easing"]>, (t: number) => number> = {
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  linear: (t) => t,
};

/**
 * AnimatedCounter — compte animé localisé. V3 "Formatted Counter" :
 * - Affiche directement la valeur finale (SSR + premier rendu) : aucun « 0 »
 *   visible avant le déclenchement de l'animation.
 * - L'animation 0 → valeur démarre au montage (sections pré-montées hors
 *   écran par LazySection → le compte se termine avant l'arrivée du visiteur).
 * - Formatage via `Intl.NumberFormat` (locale, décimales, milliers).
 * - Chiffres tabulaires pour éviter le "jump" de largeur.
 * - Respecte `prefers-reduced-motion`.
 * Utilisé par le "Data Console" de la page d'accueil.
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1600,
  easing = "easeOutExpo",
  locale = "fr-FR",
  ariaLive = false,
  className,
}: AnimatedCounterProps) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const didAnimate = useRef(false);

  useEffect(() => {
    // Valeur changée après le montage (mise à jour CMS) → on y va directement
    // sans rejouer le compte depuis zéro. Délai d'une frame : aucune latence
    // perceptible, et pas de setState synchrone dans le corps de l'effet.
    if (didAnimate.current) {
      requestAnimationFrame(() => setDisplay(value));
      return;
    }
    didAnimate.current = true;
    if (reduceMotion) {
      requestAnimationFrame(() => setDisplay(value));
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setDisplay(value * EASINGS[easing](t));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, easing, reduceMotion]);

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(display);

  return (
    <span
      className={cn(className)}
      style={{ fontVariantNumeric: "tabular-nums" }}
      aria-live={ariaLive ? "polite" : undefined}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}