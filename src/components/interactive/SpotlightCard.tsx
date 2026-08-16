"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * SpotlightCard — Carte haut de gamme avec motif réactif (Interactive Pattern)
 * et système de parallaxe 3D réactif au survol de la souris.
 */
interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Couleur de la lueur (rgba). */
  glowColor?: string;
  /** Active l'inclinaison parallaxe 3D. (Défaut: true) */
  enableParallax?: boolean;
  /** Profondeur d'inclinaison 3D en degrés. (Défaut: 6) */
  tiltDepth?: number;
  /** Type de motif de fond réactif. (Défaut: "dots") */
  pattern?: "dots" | "grid" | "none";
}

export function SpotlightCard({
  children,
  className,
  glowColor = "rgba(242, 109, 61, 0.18)",
  enableParallax = true,
  tiltDepth = 6,
  pattern = "dots",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);

    if (enableParallax) {
      const normX = (x / rect.width - 0.5) * 2; // [-1, 1]
      const normY = (y / rect.height - 0.5) * 2; // [-1, 1]
      setTilt({
        rx: -normY * tiltDepth,
        ry: normX * tiltDepth,
      });
    }
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "-200px");
    el.style.setProperty("--my", "-200px");
    if (enableParallax) {
      setTilt({ rx: 0, ry: 0 });
    }
  };

  return (
    <div className="perspective-1000 w-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "group relative overflow-hidden rounded-2xl glass-card transition-transform duration-300 ease-out",
          className
        )}
        style={
          {
            "--mx": "-200px",
            "--my": "-200px",
            "--glow": glowColor,
            transform: enableParallax
              ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
              : "none",
            transformStyle: "preserve-3d",
          } as React.CSSProperties
        }
      >
        {/* Motif interactif réactif (Interactive Pattern Grid) */}
        {pattern !== "none" && (
          <div className="pointer-events-none absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-30">
            {pattern === "dots" ? (
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <pattern id="spotlight-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="currentColor" className="text-slate-400 dark:text-slate-400" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#spotlight-dots)" />
              </svg>
            ) : (
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <pattern id="spotlight-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-slate-400/40 dark:text-slate-600/40" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#spotlight-grid)" />
              </svg>
            )}
          </div>
        )}

        {/* Lueur radiale qui suit le curseur (Parallaxe + Glow) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(380px circle at var(--mx) var(--my), var(--glow), transparent 65%)",
          }}
          aria-hidden
        />

        {/* Liseré supérieur animé au survol */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F26D3D]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />

        {/* Contenu de la carte */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
