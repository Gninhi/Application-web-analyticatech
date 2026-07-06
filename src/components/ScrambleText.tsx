"use client";

import { useRef, useState } from "react";

/**
 * ScrambleText — effet de "déchiffrement" cyberpunk au survol.
 * Les caractères passent par des symboles aléatoires avant de se stabiliser.
 */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/\\";

interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: "span" | "button" | "a";
  onClick?: () => void;
  ariaLabel?: string;
}

export function ScrambleText({
  text,
  className,
  as = "span",
  onClick,
  ariaLabel,
}: ScrambleTextProps) {
  // `scrambled` vaut null au repos => on rend `text` directement (toujours synchronisé).
  // Pendant l'animation, il contient la chaîne en cours de déchiffrement.
  const [scrambled, setScrambled] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const frameRef = useRef(0);

  const scramble = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    frameRef.current = 0;
    const target = text;

    const tick = () => {
      const progress = frameRef.current / (target.length * 1.6);
      const revealed = Math.floor(progress * target.length);

      const next = target
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < revealed) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setScrambled(next);
      frameRef.current += 1;

      if (revealed < target.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Fin de l'animation : retour à l'état repos (rend `text`)
        setScrambled(null);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const Tag = as as React.ElementType;

  return (
    <Tag
      className={className}
      onMouseEnter={scramble}
      onClick={onClick}
      aria-label={ariaLabel ?? text}
      data-text={text}
    >
      {scrambled ?? text}
    </Tag>
  );
}
