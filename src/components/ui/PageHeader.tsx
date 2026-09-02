"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ParticleTypography } from "@/components/interactive/ParticleTypography";

interface PageHeaderProps {
  /** Kicker mono orange (rendu avec le préfixe "// " sauf en mode icône). */
  kicker?: string;
  /** Ligne 1 du titre (rendue en h1). */
  title: string;
  /** Ligne 2 du titre (optionnelle) — dégradé de marque animé (text-shimmer). */
  accent?: string;
  /** Sous-titre (optionnelle) — ligne secondaire plus petite, style accueil. */
  subtitle?: string;
  /** Description sous le titre. */
  description?: string;
  /** Icône dans une boîte (style Legal) : kicker + titre rendus à côté. */
  icon?: LucideIcon;
  /** Applique le dégradé animé au titre principal (titre sur une seule ligne). */
  gradient?: boolean;
  /** Alignement du bloc. */
  align?: "left" | "center";
  /** Taille du titre (md pour les pages de contenu, lg pour les pages principales). */
  size?: "md" | "lg";
  /** Classes du conteneur. */
  className?: string;
}

/**
 * PageHeader — en-tête de page centralisé, interactif et modulaire.
 *
 * Intègre ParticleTypography pour un effet de particules fluide au survol
 * sur les grands titres tout en conservant 100% de la fidélité typographique,
 * des couleurs et du référencement SEO (balise h1 sémantique).
 */
export function PageHeader({
  kicker,
  title,
  accent,
  subtitle,
  description,
  icon: Icon,
  gradient = false,
  align = "left",
  size = "lg",
  className,
}: PageHeaderProps) {
  const centered = align === "center";
  const sizeClass = size === "lg" ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl";

  return (
    <div className={cn(centered && "text-center", className)}>
      {Icon ? (
        <div className="flex items-center gap-3 mb-4 text-left">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 shrink-0">
            <Icon className="h-6 w-6 text-[#F26D3D]" aria-hidden />
          </span>
          <div>
            {kicker && (
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-1">
                {kicker}
              </p>
            )}
            <h1
              className={cn(
                "font-display font-bold tracking-tight leading-tight text-slate-900 dark:text-slate-50",
                sizeClass
              )}
            >
              {title}
            </h1>
          </div>
        </div>
      ) : (
        <>
          {kicker && (
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-3">
              {"// " + kicker}
            </p>
          )}
          <ParticleTypography
            title={title}
            accent={accent}
            subtitle={subtitle}
            gradient={gradient}
            align={align}
            as="h1"
            className={sizeClass}
          />
        </>
      )}

      {description && (
        <p
          className={cn(
            "mt-5 text-lg text-slate-500 dark:text-slate-300 leading-relaxed",
            centered && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}