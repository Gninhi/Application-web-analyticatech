"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { cn } from "@/lib/utils/cn";

export interface ParticleTypographyProps {
  title: string;
  titleAccent?: string;
  accent?: string;
  subtitle?: string;
  className?: string;
  as?: ElementType;
  gradient?: boolean;
  align?: "left" | "center" | "right";
}

/**
 * ParticleTypography — Typographie éditoriale haute performance.
 *
 * Rendu textuel sémantique pur pour le SEO et l'accessibilité avec un halo
 * interactif fluide accéléré par le compositeur GPU (sans re-render React au déplacement de la souris).
 */
export function ParticleTypography({
  className,
  title,
  titleAccent,
  accent,
  subtitle,
  as: Component = "h1",
  gradient = false,
  align = "left",
}: ParticleTypographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    rectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = rectRef.current || el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "-300px");
    el.style.setProperty("--my", "-300px");
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full select-text block group/typography",
        align === "center" && "text-center",
        className
      )}
      style={{ "--mx": "-300px", "--my": "-300px" } as CSSProperties}
    >
      {/* Halo interactif subtil au survol du titre — compositeur GPU direct sans re-render React */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl opacity-0 group-hover/typography:opacity-40 dark:group-hover/typography:opacity-30 blur-2xl transition-opacity duration-300"
        style={{
          background: "radial-gradient(280px circle at var(--mx) var(--my), rgba(242, 109, 61, 0.22), transparent 80%)",
        }}
        aria-hidden="true"
      />

      <Component className="relative font-display font-bold tracking-tight leading-[1.05]">
        {/* Première ligne : Titre principal + mot-clé accentué */}
        <span
          className={cn(
            "block",
            gradient
              ? "text-shimmer"
              : "text-slate-900 dark:text-slate-100"
          )}
        >
          {title}
          {titleAccent && (
            <>
              {" "}
              <span className="text-[#F26D3D]">{titleAccent}</span>
            </>
          )}
        </span>

        {/* Ligne d'accentuation secondaire (si fournie) */}
        {accent && (
          <span className="block mt-1 md:mt-2 text-[#F26D3D]">
            {accent}
          </span>
        )}
      </Component>

      {/* Sous-titre explicatif avec espacement proportionnel */}
      {subtitle && (
        <p className="mt-4 md:mt-6 font-mono text-xs md:text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
