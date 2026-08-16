"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface AnimatedButtonBorderProps {
  /** Rayon du chemin offset-path rect() round, en px. Défaut : 12. */
  borderRadius?: number;
  /** Durée d'un tour complet en secondes. Défaut : 5. */
  duration?: number;
  /** Largeur du faisceau lumineux en px. Défaut : 20. */
  beamSize?: number;
  className?: string;
}

/**
 * AnimatedButtonBorder — faisceau dégradé qui parcourt la bordure d'un bouton.
 *
 * Le faisceau suit un offset-path `rect()` arrondi ; un mask
 * (padding-box ∩ border-box) ne le révèle que sur l'anneau de bordure,
 * sans toucher au contenu. `pointer-events-none` : le clic et la couleur
 * du bouton ne sont jamais modifiés. À placer à l'intérieur d'un bouton
 * `relative` (c'est le cas de MovingButton).
 */
export function AnimatedButtonBorder({
  borderRadius = 12,
  duration = 5,
  beamSize = 20,
  className,
}: AnimatedButtonBorderProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "-inset-px pointer-events-none absolute rounded-[inherit] border-2 border-transparent",
        "[-webkit-mask-composite:source-in] [mask-composite:intersect]",
        "[mask-clip:padding-box,border-box]",
        "[mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        className
      )}
    >
      <motion.div
        className="absolute aspect-square"
        style={{
          width: beamSize,
          backgroundImage:
            "linear-gradient(90deg, transparent, #F26D3D, #03318C)",
          offsetPath: `rect(0 auto auto 0 round ${borderRadius}px)`,
        }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration, ease: "linear" }}
      />
    </div>
  );
}