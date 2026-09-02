"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";

export interface ParticleTypographyProps {
  /** Classes CSS additionnelles pour le conteneur */
  className?: string;
  /** Ligne 1 du titre (ou texte principal) */
  title: string;
  /** Mot-clé accentué sur la même ligne (ex: "INTELLIGENTS" sur l'accueil) */
  titleAccent?: string;
  /** Ligne 2 accentuée (ex: "sans zone grise entre elles") */
  accent?: string;
  /** Sous-titre secondaire (rendu sous le titre) */
  subtitle?: string;
  /** Balise sémantique pour le SEO. Défaut : "h1" */
  as?: "h1" | "h2" | "h3" | "div";
  /** Applique le dégradé de marque sur la totalité de la première ligne */
  gradient?: boolean;
  /** Alignement horizontal */
  align?: "left" | "center";
}

/**
 * ParticleTypography — Typographie premium, fluide et interactive.
 *
 * - Rendu SSR & Client immédiat : aucun masquage (invisible) ni décalage de layout (CLS = 0).
 * - Effet de lueur et dégradé text-shimmer interactif réactif au survol du curseur.
 * - Accessibilité SEO maximale : balise sémantique h1/h2 native lisible par les moteurs de recherche.
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
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full select-text block group/typography",
        align === "center" && "text-center",
        className
      )}
    >
      {/* Halo interactif subtil au survol du titre */}
      {mousePos && (
        <div
          className="pointer-events-none absolute -inset-4 rounded-3xl opacity-40 dark:opacity-30 blur-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(242, 109, 61, 0.22), transparent 80%)`,
          }}
          aria-hidden="true"
        />
      )}

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
              <span className="text-shimmer font-bold inline-block transition-transform duration-300 group-hover/typography:scale-[1.01]">
                {titleAccent}
              </span>
            </>
          )}
        </span>

        {/* Deuxième ligne accentuée (si fournie) */}
        {accent && (
          <span className="block text-shimmer mt-1 font-bold">
            {accent}
          </span>
        )}
      </Component>

      {/* Sous-titre secondaire (si fourni) */}
      {subtitle && (
        <p
          className={cn(
            "mt-3 text-2xl sm:text-3xl md:text-4xl font-normal text-slate-600 dark:text-slate-300 leading-snug tracking-normal",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
