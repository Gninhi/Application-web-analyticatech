"use client";

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export type RandomLetterSwapHandle = {
  trigger: () => void;
};

export type RandomLetterSwapProps = {
  /** Texte à animer */
  label: string;
  /** Direction de transition des lettres (true: descente, false: montée) */
  reverse?: boolean;
  /** Paramètres de transition (conservé pour compatibilité API) */
  transition?: { duration?: number; type?: string; [key: string]: unknown };
  /** Délai en secondes entre le déclenchement de chaque lettre */
  staggerDuration?: number;
  /** Classes CSS supplémentaires */
  className?: string;
  /** Callback optionnel au clic */
  onClick?: () => void;
};

/**
 * RandomLetterSwap — Micro-interaction de typographie high-tech.
 *
 * Au survol, chaque lettre effectue un saut aléatoire en cascade (spring physics).
 * - Accélération matérielle transform GPU (translate3d) pour une réactivité instantanée à 120 FPS.
 * - Double déclencheur : écoute native du survol direct ET déclenchement impératif via ref.
 * - Zéro CLS : dimensions strictement conservées.
 * - Accessible : texte intégral préservé pour les lecteurs d'écran (sr-only + aria-label).
 */
export const RandomLetterSwap = forwardRef<RandomLetterSwapHandle, RandomLetterSwapProps>(
  function RandomLetterSwap(
    {
      label,
      reverse = false,
      staggerDuration = 0.025,
      className,
      onClick,
      ...props
    },
    ref
  ) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const isAnimatingRef = useRef(false);
    const [letters] = useState(() => label.split(""));

    const triggerSwap = useCallback(() => {
      if (isAnimatingRef.current || !containerRef.current) return;
      isAnimatingRef.current = true;

      const el = containerRef.current;
      const len = label.length;

      // Ordre aléatoire de déclenchement des lettres
      const shuffled = Array.from({ length: len }, (_, i) => i).sort(
        () => Math.random() - 0.5
      );

      const staggerMs = Math.max(15, Math.round(staggerDuration * 1000));
      const animDuration = 450; // ms pour chaque lettre
      const yPrimary = reverse ? "100%" : "-100%";
      const ySecondaryStart = reverse ? "-100%" : "100%";

      shuffled.forEach((letterIdx, step) => {
        const delay = step * staggerMs;
        window.setTimeout(() => {
          if (!el) return;
          const primary = el.querySelector<HTMLElement>(`.rls-primary-${letterIdx}`);
          const secondary = el.querySelector<HTMLElement>(`.rls-secondary-${letterIdx}`);

          if (primary && secondary) {
            primary.style.transition = `transform ${animDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
            secondary.style.transition = `transform ${animDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

            primary.style.transform = `translate3d(0, ${yPrimary}, 0)`;
            secondary.style.transform = "translate3d(0, 0%, 0)";
          }
        }, delay);
      });

      // Réinitialisation transparente sans reflow visible
      const totalDuration = (len - 1) * staggerMs + animDuration + 60;

      window.setTimeout(() => {
        if (!el) {
          isAnimatingRef.current = false;
          return;
        }

        shuffled.forEach((letterIdx) => {
          const primary = el.querySelector<HTMLElement>(`.rls-primary-${letterIdx}`);
          const secondary = el.querySelector<HTMLElement>(`.rls-secondary-${letterIdx}`);

          if (primary && secondary) {
            primary.style.transition = "none";
            secondary.style.transition = "none";

            primary.style.transform = "translate3d(0, 0%, 0)";
            secondary.style.transform = `translate3d(0, ${ySecondaryStart}, 0)`;

            void primary.offsetHeight;

            primary.style.transition = "";
            secondary.style.transition = "";
          }
        });

        isAnimatingRef.current = false;
      }, totalDuration);
    }, [label, reverse, staggerDuration]);

    useImperativeHandle(ref, () => ({
      trigger: triggerSwap,
    }));

    return (
      <span
        ref={containerRef}
        aria-label={label}
        onMouseEnter={triggerSwap}
        onPointerEnter={triggerSwap}
        onClick={onClick}
        className={cn(
          "random-letter-swap relative inline-flex items-center justify-center overflow-hidden select-none cursor-pointer leading-none",
          className
        )}
        {...props}
      >
        <span className="sr-only">{label}</span>
        {letters.map((char, i) => (
          <span
            aria-hidden="true"
            key={`${char}-${i}`}
            className="relative inline-flex flex-col overflow-hidden leading-tight"
            style={{ width: char === " " ? "0.3em" : "auto" }}
          >
            {/* Lettre primaire (visible au repos) */}
            <span
              className={`rls-primary-${i} inline-block transform-gpu will-change-transform`}
              style={{ transform: "translate3d(0, 0%, 0)" }}
            >
              {char}
            </span>
            {/* Lettre secondaire (en attente hors champ) */}
            <span
              className={`rls-secondary-${i} absolute left-0 top-0 inline-block transform-gpu will-change-transform`}
              style={{
                transform: `translate3d(0, ${reverse ? "-100%" : "100%"}, 0)`,
              }}
            >
              {char}
            </span>
          </span>
        ))}
      </span>
    );
  }
);
