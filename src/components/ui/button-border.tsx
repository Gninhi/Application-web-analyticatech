"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface AnimatedButtonBorderProps {
  /** Rayon de courbure en pixels ou chaîne CSS pour l'offsetPath rect(). Défaut : 14 */
  borderRadius?: number | string;
  /** Durée d'un cycle complet en secondes. Défaut : 4 */
  duration?: number;
  /** Largeur du faisceau lumineux en px. Défaut : 24 */
  beamSize?: number;
  beamWidth?: number;
  /** Dégradé Tailwind / CSS du faisceau lumineux */
  gradientClassName?: string;
  beamGradient?: string;
  className?: string;
}

/**
 * AnimatedButtonBorder — Liseré lumineux dynamique serpent :
 * - Thème Sombre : Faisceau serpent Bleu (#3B82F6 / #60A5FA)
 * - Thème Clair  : Faisceau serpent Orange (#F26D3D)
 *
 * Utilise CSS offset-path rect() avec masque composite pour illuminer
 * uniquement le contour sans altérer l'intérieur ni les interactions utilisateur.
 */
export function AnimatedButtonBorder({
  borderRadius = 14,
  duration = 4,
  beamSize,
  beamWidth,
  gradientClassName,
  beamGradient,
  className,
}: AnimatedButtonBorderProps) {
  const width = beamWidth ?? beamSize ?? 24;
  const radiusVal =
    typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "-inset-px pointer-events-none absolute rounded-[inherit] border-2 border-transparent border-inset [mask-clip:padding-box,border-box]",
        "[-webkit-mask-composite:source-in] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        className
      )}
    >
      <motion.div
        className={cn(
          "absolute aspect-square bg-gradient-to-r",
          !beamGradient &&
            (gradientClassName ??
              "from-transparent via-[#F26D3D] to-[#F26D3D] dark:via-[#3B82F6] dark:to-[#3B82F6]")
        )}
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        style={{
          width,
          ...(beamGradient ? { backgroundImage: beamGradient } : {}),
          offsetPath: `rect(0 auto auto 0 round ${radiusVal})`,
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration,
          ease: "linear",
        }}
      />
    </div>
  );
}

export interface ButtonBorderProps extends ButtonProps {
  borderRadius?: number | string;
  duration?: number;
  beamWidth?: number;
  beamSize?: number;
  gradientClassName?: string;
  beamGradient?: string;
  borderClassName?: string;
  showAnimatedBorder?: boolean;
}

/**
 * ButtonBorder — Composant bouton officiel intégrant directement la bordure animée.
 */
export const ButtonBorder = React.forwardRef<HTMLButtonElement, ButtonBorderProps>(
  (
    {
      children,
      className,
      variant = "outline",
      borderRadius = 14,
      duration = 4,
      beamWidth,
      beamSize,
      gradientClassName,
      beamGradient,
      borderClassName: _borderClassName,
      showAnimatedBorder = true,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        borderRadius={borderRadius}
        duration={duration}
        beamWidth={beamWidth}
        beamSize={beamSize}
        gradientClassName={gradientClassName}
        beamGradient={beamGradient}
        showBorderAnimation={showAnimatedBorder}
        className={className}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
ButtonBorder.displayName = "ButtonBorder";