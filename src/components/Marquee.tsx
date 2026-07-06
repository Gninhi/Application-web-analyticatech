"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  /** Icône séparateur entre items (défaut: point orange). */
  separator?: "dot" | "slash" | "arrow";
  /** Sens du défilement. */
  direction?: "left" | "right";
  /** Classes du texte. */
  className?: string;
  /** Vitesse (durée de l'animation en s, défaut 40). */
  speed?: number;
}

/**
 * Marquee — bandeau horizontal défilant infini.
 * Les items sont dupliqués pour une boucle sans coupure.
 * Pause au survol (via .marquee-container dans globals.css).
 */
export function Marquee({
  items,
  separator = "dot",
  direction = "left",
  className,
  speed = 40,
}: MarqueeProps) {
  // Duplication pour la boucle continue
  const doubled = [...items, ...items];

  const sep = {
    dot: <span className="text-[#F26D3D] text-xs">●</span>,
    slash: <span className="text-[#F26D3D]">/</span>,
    arrow: <span className="text-[#F26D3D]">→</span>,
  }[separator];

  const trackClass = direction === "left" ? "marquee-track" : "marquee-track-reverse";

  return (
    <div
      className={cn(
        "marquee-container relative overflow-hidden py-4 border-y border-white/10",
        className
      )}
    >
      <div
        className={trackClass}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-6 shrink-0">
            <span className="font-display text-2xl md:text-4xl font-bold tracking-tight text-slate-100/80">
              {item}
            </span>
            <span className="mx-2" aria-hidden>{sep}</span>
          </span>
        ))}
      </div>
      {/* Dégradés de fondu sur les bords */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#011C40] to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#011C40] to-transparent" aria-hidden />
    </div>
  );
}
