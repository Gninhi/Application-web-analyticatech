"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * SpotlightCard — carte avec effet de lueur (radial-gradient)
 * suivant le curseur de la souris. Composant "Monolith" signature.
 */
interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Couleur de la lueur (rgba). */
  glowColor?: string;
}

export function SpotlightCard({
  children,
  className,
  glowColor = "rgba(242, 109, 61, 0.18)",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "-200px");
    el.style.setProperty("--my", "-200px");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl glass-card transition-all duration-300",
        className
      )}
      style={
        {
          "--mx": "-200px",
          "--my": "-200px",
          "--glow": glowColor,
        } as React.CSSProperties
      }
    >
      {/* Lueur qui suit le curseur */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(380px circle at var(--mx) var(--my), var(--glow), transparent 60%)",
        }}
        aria-hidden
      />
      {/* Liseré supérieur animé au survol */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F26D3D]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
      {children}
    </div>
  );
}
