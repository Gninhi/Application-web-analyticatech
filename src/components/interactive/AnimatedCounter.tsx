"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
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
 * AnimatedCounter — compte animé localisé qui se déclenche lorsqu'il entre
 * dans le viewport. V3 "Formatted Counter" :
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
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // Mode "reduced motion" : durée quasi nulle, résultat immédiat sans saut.
    const animDuration = reduceMotion ? 1 : duration;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / animDuration, 1);
      setDisplay(value * EASINGS[easing](t));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, easing, reduceMotion]);

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(display);

  return (
    <span
      ref={ref}
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