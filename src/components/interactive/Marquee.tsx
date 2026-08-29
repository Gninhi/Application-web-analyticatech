"use client";

import { cn } from "@/lib/utils/cn";

interface MarqueeProps {
  /** Items à afficher en boucle. Chaque item est rendu via `renderItem`. */
  items: unknown[];
  /** Fonction de rendu pour chaque item (reçoit l'item + l'index). */
  renderItem: (item: unknown, index: number) => React.ReactNode;
  /** Sens du défilement. Défaut : "left". */
  direction?: "left" | "right";
  /** Vitesse (durée de l'animation en s). Défaut : 40. */
  speed?: number;
  /** Classes additionnelles sur le conteneur. */
  className?: string;
  /** Afficher les dégradés de fondu sur les bords. Défaut : true. */
  fadeEdges?: boolean;
}

/**
 * Marquee — composant unifié de défilement horizontal infini.
 * Type "données boursières" : fluide, GPU-only, pause au survol.
 *
 * L'animation est définie en inline style pour garantir la priorité
 * sur Tailwind v4 (qui peut écraser les styles au niveau racine).
 */
export function Marquee({
  items,
  renderItem,
  direction = "left",
  speed = 40,
  className,
  fadeEdges = true,
}: MarqueeProps) {
  if (!items.length) return null;

  // Répétition 4x pour garantir un flux infini continu sur toutes largeurs d'écran
  const repeated = [...items, ...items, ...items, ...items];

  // Animation inline pour contourner les problèmes de priorité CSS Tailwind v4
  const animationName = direction === "left" ? "marquee" : "marquee-reverse";
  const trackStyle: React.CSSProperties = {
    display: "flex",
    width: "max-content",
    animationName,
    animationDuration: `${speed}s`,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    willChange: "transform",
  };

  return (
    <div
      className={cn("marquee-container relative overflow-hidden group select-none", className)}
    >
      <div className="marquee-track flex items-center" style={trackStyle}>
        {repeated.map((item, i) => (
          <div key={i} className="shrink-0">
            {renderItem(item, i)}
          </div>
        ))}
      </div>
      {fadeEdges && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" aria-hidden />
        </>
      )}
    </div>
  );
}
