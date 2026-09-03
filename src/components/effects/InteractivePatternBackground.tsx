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
      // Interpolation fluide (easing)
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      if (glow) {
        glow.style.transform = `translate3d(${currentX - glowRadius}px, ${currentY - glowRadius}px, 0)`;
      }

      // Arrêt automatique dès que le halo a rejoint le curseur (libère le fil principal pour l'INP)
      const dist = Math.hypot(targetX - currentX, targetY - currentY);
      if (running && dist > 0.5) {
        animationFrameId = requestAnimationFrame(updatePosition);
      } else {
        running = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (running) cancelAnimationFrame(animationFrameId);
    };
  }, [glowRadius]);

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 -z-10 pointer-events-none overflow-hidden", className)}
      aria-hidden="true"
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

      {/* 4. Halo lumineux radial accéléré par le GPU (translate3d sans repaint CPU) */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 pointer-events-none transition-opacity duration-300 will-change-transform"
        style={{
          width: `${glowRadius * 2}px`,
          height: `${glowRadius * 2}px`,
          transform: "translate3d(-1000px, -1000px, 0)",
          background: `radial-gradient(circle, rgba(242, 109, 61, 0.20) 0%, var(--halo-blue) 42%, transparent 70%)`,
        }}
      />

      {/* 5. Voile pour assurer un contraste et une lisibilité parfaite des cartes */}
      <div className="absolute inset-0 theme-overlay" />
    </div>
  );
}
