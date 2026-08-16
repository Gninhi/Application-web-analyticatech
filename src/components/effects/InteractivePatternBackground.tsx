"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InteractivePatternBackgroundProps {
  className?: string;
  gridSize?: number;
  dotSize?: number;
  glowRadius?: number;
}

/**
 * InteractivePatternBackground — Fond de page réactif avec grille de points interactive.
 * Inspired by Framer Interactive Pattern (Interactive Grid Background).
 *
 * Fonctionnalités :
 * - Suivi global du curseur de la souris (mouse tracking en temps réel).
 * - Halo lumineux radial orange / cyan survolant la grille de points.
 * - Grille technique fine ultra-définie et particules ambiantes.
 */
export function InteractivePatternBackground({
  className,
  gridSize = 36,
  glowRadius = 450,
}: InteractivePatternBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container || !glow) return;

    // Skip entirely on touch / coarse pointers : aucun survol possible.
    // Évite de maintenir une boucle requestAnimationFrame à 60fps inutile.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;

    let animationFrameId = 0;
    let running = false;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      // Démarre la boucle au premier mouvement uniquement.
      if (!running) {
        running = true;
        animationFrameId = requestAnimationFrame(updatePosition);
      }
    };

    const handleMouseLeave = () => {
      // Sortie du curseur : on arrête la boucle pour ne pas consommer
      // de main-thread quand l'utilisateur ne survole plus.
      if (running) {
        running = false;
        cancelAnimationFrame(animationFrameId);
      }
    };

    const updatePosition = () => {
      // Interpolation fluide (easing) pour un mouvement réactif et doux
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      container.style.setProperty("--mouse-x", `${currentX}px`);
      container.style.setProperty("--mouse-y", `${currentY}px`);

      // Continue tant que le curseur est présent dans la fenêtre.
      if (running) animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (running) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 -z-10 pointer-events-none overflow-hidden", className)}
      aria-hidden="true"
      style={
        {
          "--mouse-x": "-1000px",
          "--mouse-y": "-1000px",
        } as React.CSSProperties
      }
    >
      {/* 1. Dégradé de fond principal */}
      <div className="absolute inset-0 theme-bg-gradient" />

      {/* 2. Grille de points interactive réactive (Interactive Grid Background) */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-55 transition-opacity duration-500"
        style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, var(--accent) 1.5px, transparent 0)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* 3. Lignes de grille secondaires */}
      <div
        className="absolute inset-0 opacity-15 dark:opacity-25"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(242, 109, 61, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(242, 109, 61, 0.15) 1px, transparent 1px)`,
          backgroundSize: `${gridSize * 2}px ${gridSize * 2}px`,
        }}
      />

      {/* 4. Halo lumineux radial qui suit la souris en temps réel */}
      <div
        ref={glowRef}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(${glowRadius}px circle at var(--mouse-x) var(--mouse-y), rgba(242, 109, 61, 0.22), var(--halo-blue) 45%, transparent 75%)`,
        }}
      />

      {/* 5. Second halo de profondeur (bleu cyan réactif) */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(${glowRadius * 1.4}px circle at var(--mouse-x) var(--mouse-y), var(--halo-blue), transparent 70%)`,
        }}
      />

      {/* 6. Voile pour assurer un contraste et une lisibilité parfaite des cartes */}
      <div className="absolute inset-0 theme-overlay" />
    </div>
  );
}
