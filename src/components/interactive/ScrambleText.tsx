"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Jeu de caractères de brouillage. */
  scrambleChars?: string;
  /** Délai avant démarrage (s). */
  delay?: number;
  /** Durée totale du brouillage (s). */
  duration?: number;
}

const DEFAULT_CHARS = "!<>-_/[]{}—=+*^?#0123456789";

/**
 * ScrambleText — effet "Text Scramble" (marketplace Framer).
 * Les caractères se mélangent avant de se fixer sur le texte final.
 * Reste lisible (le texte final est rendu en sr-only pour les lecteurs
 * d'écran) et se désactive via prefers-reduced-motion.
 */
export function ScrambleText({
  text,
  className,
  scrambleChars = DEFAULT_CHARS,
  delay = 0.4,
  duration = 1.1,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pool = scrambleChars.split("");
    let frame = 0;
    let start: number | null = null;
    let lastUpdate = 0;

    const tick = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = (ts - start) / 1000 - delay;
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const done = progress >= 1;
      // Mise à jour visuelle limitée (~15 fps) : l'effet de brouillage est
      // visuellement identique, mais on évite ~100 re-renders React (le
      // main-thread reste libre → TBT réduit).
      // IMPORTANT : sur la dernière frame (done), on affiche TOUJOURS le texte
      // final même si <66 ms se sont écoulées, sinon le texte se fige tronqué.
      if (done || ts - lastUpdate >= 66) {
        lastUpdate = ts;
        const output = done
          ? text
          : text
              .split("")
              .map((char, i) => {
                if (char === " ") return " ";
                if (i < Math.floor(progress * text.length)) return char;
                return pool[Math.floor(Math.random() * pool.length)];
              })
              .join("");
        setDisplay(output);
      }
      if (!done) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, text, delay, duration, scrambleChars]);

  return (
    <span ref={ref} className={cn("relative inline-block whitespace-nowrap", className)}>
      {/* Spacer invisible : verrouille la largeur sur le texte final pour
          éviter tout reflow (CLS) quand les caractères brouillés changent
          de largeur. */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      {/* Texte brouillé superposé au spacer : n'impacte plus le layout. */}
      <span aria-hidden="true" className="absolute inset-y-0 left-0 flex items-center">
        {display}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
