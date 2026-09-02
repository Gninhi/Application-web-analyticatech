"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { AnimatedButtonBorder } from "@/components/ui/button-border";
import { cn } from "@/lib/utils/cn";

/**
 * Variantes de style du bouton Liquid Glass & Terminal.
 * Assure une visibilité parfaite, une réfraction lumineuse et un toucher tactile
 * dans les deux thèmes (clair et sombre).
 */
const glassButtonVariants = cva(
  "glass-button relative isolate inline-flex w-full h-full items-center justify-center font-mono font-semibold uppercase tracking-wider select-none overflow-hidden transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        primary: "glass-btn-primary",
        secondary: "glass-btn-secondary",
        outline: "glass-btn-outline",
        ghost: "glass-btn-ghost",
        terminal: "glass-btn-terminal",
        subtle: "glass-btn-subtle",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        md: "text-sm",
        lg: "text-sm md:text-base",
        icon: "h-10 w-10 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

/**
 * Variantes de padding et typographie interne.
 */
const glassButtonTextVariants = cva(
  "glass-button-text relative z-10 inline-flex items-center justify-center gap-2 transition-transform duration-200 group-hover/glass:scale-[1.02]",
  {
    variants: {
      size: {
        default: "px-5 py-2.5",
        sm: "px-4 py-2",
        md: "px-5 py-2.5",
        lg: "px-6 py-3",
        icon: "flex h-10 w-10 items-center justify-center p-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "ref">,
    VariantProps<typeof glassButtonVariants> {
  /** Redirection URL : rend automatiquement un composant <Link> Next.js polymorphique */
  href?: string;
  /** Icône optionnelle intégrée */
  icon?: React.ReactNode;
  /** Position de l'icône ("left" ou "right"). Défaut : "left" */
  iconPosition?: "left" | "right";
  /** État de chargement : affiche un spinner animé et désactive l'interaction */
  loading?: boolean;
  /** Mode icône seule : dimensions carrées sans padding textuel */
  iconOnly?: boolean;
  /** Rayon de bordure (ex: "0.75rem", "9999px", "12px"). Défaut : "0.75rem" */
  borderRadius?: string;
  /** Active ou désactive le faisceau animé qui parcourt la bordure. Défaut : true pour primary/outline/terminal, false pour ghost */
  showBorderAnimation?: boolean;
  /** Durée d'un tour du faisceau en ms. Défaut : 3000 */
  duration?: number;
  /** Taille personnalisée du faisceau lumineux en px. Défaut : 24 */
  beamSize?: number;
  /** Dégradé personnalisé pour le faisceau lumineux */
  beamGradient?: string;
  /** Classe personnalisée pour le conteneur de texte intérieur */
  contentClassName?: string;
  /** Classe personnalisée pour l'élément interactif interne */
  buttonClassName?: string;
}

/** Convertit un rayon CSS ("0.75rem", "16px", "9999px") en pixels pour le SVG offset-path. */
function radiusToPx(radius: string): number {
  const n = parseFloat(radius);
  if (Number.isNaN(n)) return 12;
  if (radius.endsWith("rem")) return Math.round(n * 16);
  if (radius.endsWith("%") || n > 100) return 9999;
  return Math.round(n);
}

/**
 * GlassButton — Composant bouton Liquid Glass & Terminal unifié et polymorphique.
 *
 * Fonctionnalités clés :
 * 1. Liquid Glass : réfraction, halo spéculaire, ombre portée douce au repos.
 * 2. Survol dynamique : halo néon, specular sheen, élévation spring.
 * 3. Faisceau laser animé périphérique (AnimatedButtonBorder).
 * 4. Polymorphisme : support natif de `href` pour un rendu en Next.js `<Link>`.
 * 5. Gestion native des icônes (`icon`, `iconPosition`) et du spinner (`loading`).
 * 6. Respect strict de la palette Analyticatech (#F26D3D, Dark/Light bithème).
 */
const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      className,
      buttonClassName,
      contentClassName,
      children,
      variant = "primary",
      size = "default",
      href,
      icon,
      iconPosition = "left",
      loading = false,
      iconOnly = false,
      borderRadius = "0.75rem",
      showBorderAnimation,
      duration = 3000,
      beamSize = 24,
      beamGradient,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Normalisation de la taille
    const resolvedSize = iconOnly ? "icon" : size || "default";
    const isDisabled = disabled || loading;

    // Animation de bordure activée par défaut pour primary / outline / terminal
    const shouldAnimateBorder =
      showBorderAnimation ?? (variant === "primary" || variant === "outline" || variant === "terminal");

    const renderIcon = () => {
      if (loading) {
        return <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />;
      }
      if (icon) {
        return <span className="inline-flex shrink-0 items-center justify-center transition-transform duration-200 group-hover/glass:translate-x-0.5">{icon}</span>;
      }
      return null;
    };

    const innerContent = (
      <>
        {/* Faisceau laser qui parcourt la bordure */}
        {shouldAnimateBorder && !isDisabled && (
          <AnimatedButtonBorder
            borderRadius={radiusToPx(borderRadius)}
            duration={duration / 1000}
            beamSize={beamSize}
            beamGradient={beamGradient}
          />
        )}

        {/* Reflet liquide interne (shimmer spéculaire) */}
        <span className="glass-button-sheen pointer-events-none absolute inset-0 z-0" aria-hidden />

        {/* Contenu, icônes et texte */}
        <span
          className={cn(
            glassButtonTextVariants({ size: resolvedSize }),
            contentClassName
          )}
        >
          {iconPosition === "left" && renderIcon()}
          {children}
          {iconPosition === "right" && renderIcon()}
        </span>
      </>
    );

    const interactiveClasses = cn(
      glassButtonVariants({ variant, size: resolvedSize }),
      buttonClassName
    );

    return (
      <div
        className={cn(
          "glass-button-wrap group/glass relative inline-flex items-center justify-center isolate transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]",
          isDisabled && "opacity-60 cursor-not-allowed pointer-events-none",
          className
        )}
        style={{ borderRadius }}
      >
        {href ? (
          <Link
            href={href}
            className={interactiveClasses}
            style={{ borderRadius }}
            aria-disabled={isDisabled}
            aria-busy={loading ? true : undefined}
          >
            {innerContent}
          </Link>
        ) : (
          <button
            ref={ref}
            type={type}
            disabled={isDisabled}
            aria-busy={loading ? true : undefined}
            className={interactiveClasses}
            style={{ borderRadius }}
            {...props}
          >
            {innerContent}
          </button>
        )}

        {/* Ombre et halo diffus liquid glass en arrière-plan */}
        <div
          className={cn(
            "glass-button-shadow pointer-events-none absolute inset-0 -z-10 transition-all duration-300",
            variant === "primary" && "glass-shadow-primary",
            variant === "outline" && "glass-shadow-outline",
            variant === "terminal" && "glass-shadow-primary"
          )}
          style={{ borderRadius }}
          aria-hidden
        />
      </div>
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants, glassButtonTextVariants };


