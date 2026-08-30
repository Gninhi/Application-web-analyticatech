"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils/cn";

export interface MarqueeProps {
  /** Items à afficher en boucle. Chaque item est rendu via `renderItem`. */
  items: unknown[];
  /** Fonction de rendu pour chaque item (reçoit l'item + l'index). */
  renderItem: (item: unknown, index: number) => React.ReactNode;
  /** Sens du défilement. Défaut : "left". */
  direction?: "left" | "right";
  /** Vitesse (durée de l'animation en s pour un cycle complet). Défaut : 35. */
  speed?: number;
  /** Classes additionnelles sur le conteneur. */
  className?: string;
  /** Pause au survol du curseur. Défaut : true. */
  pauseOnHover?: boolean;
  /** Afficher les dégradés et masques de fondu progressif sur les bords gauche/droite. Défaut : true. */
  fadeEdges?: boolean;
  /** Largeur de l'estompage latéral (Tailwind class, ex: "w-24 md:w-36"). */
  fadeWidth?: string;
}

/**
 * Marquee — composant universel de défilement horizontal infini haute précision.
 * Style "Ticker Boursier / Trading Terminal" :
 *   - Boucle mathématiquement sans fin et sans rupture (2 moitiés symétriques clônées)
 *   - Rendu accéléré GPU (translate3d) pour une fluidité native 60/120fps
 *   - Double estompage gauche/droite (masque vectoriel CSS + dégradés de transition)
 *   - Pause fluide et accessible au survol
 */
export function Marquee({
  items,
  renderItem,
  direction = "left",
  speed = 35,
  className,
  pauseOnHover = true,
  fadeEdges = true,
  fadeWidth = "w-24 md:w-36",
}: MarqueeProps) {
  const rawId = useId();
  const scopeId = "mq-" + rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  if (!items || items.length === 0) return null;

  // Création de 2 moitiés identiques clônées (chacune répétée pour assurer une couverture plein écran)
  // afin de garantir que transform: -50% retombe au sous-pixel près sur la position d'origine
  const baseItems = items.length < 5 ? [...items, ...items] : items;
  const half1 = [...baseItems, ...baseItems];
  const half2 = [...baseItems, ...baseItems];
  const repeated = [...half1, ...half2];

  const animationClass = direction === "left" ? "animate-mq-left" : "animate-mq-right";

  const containerMaskStyle: React.CSSProperties = fadeEdges
    ? {
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }
    : {};

  return (
    <div
      className={cn(
        scopeId,
        "marquee-container relative overflow-hidden group select-none flex items-center",
        className
      )}
      style={containerMaskStyle}
    >
      <style>{`
        @keyframes ${scopeId}-scroll-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes ${scopeId}-scroll-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .${scopeId} .animate-mq-left {
          display: flex;
          width: max-content;
          animation: ${scopeId}-scroll-left ${speed}s linear infinite;
          will-change: transform;
        }
        .${scopeId} .animate-mq-right {
          display: flex;
          width: max-content;
          animation: ${scopeId}-scroll-right ${speed}s linear infinite;
          will-change: transform;
        }
        ${
          pauseOnHover
            ? `.${scopeId}:hover .animate-mq-left,
               .${scopeId}:hover .animate-mq-right {
                 animation-play-state: paused !important;
               }`
            : ""
        }
      `}</style>

      <div className={cn(animationClass, "flex items-center shrink-0")}>
        {repeated.map((item, i) => (
          <div key={i} className="shrink-0 flex items-center">
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {fadeEdges && (
        <>
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10",
              fadeWidth
            )}
            aria-hidden
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 bg-gradient-to-l from-background via-background/60 to-transparent z-10",
              fadeWidth
            )}
            aria-hidden
          />
        </>
      )}
    </div>
  );
}
