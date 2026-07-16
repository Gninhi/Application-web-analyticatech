"use client";

import { motion } from "framer-motion";

interface LogoProps {
  /** Taille du logo en px. Défaut : 36. */
  size?: number;
  /** Couleur du trait. Défaut : #F26D3D (orange brand). */
  color?: string;
  /** Anime le tracé au montage (effet "dessiné à la main"). Défaut : true. */
  animate?: boolean;
  /** Délai avant le début de l'animation (s). Défaut : 0. */
  delay?: number;
  className?: string;
}

/**
 * Logo Analyticatech — "A" stylisé en forme de Tour Eiffel.
 *
 * Design : le A est formé par la silhouette de la Tour Eiffel
 * (base élargie, étages, flèche sommitale). L'animation d'entrée
 * trace le chemin progressivement (stroke-dashoffset) comme si
 * le logo était dessiné à la main, pour évoquer le savoir-faire
 * artisanal et l'expertise sur-mesure du cabinet.
 */
export function Logo({
  size = 36,
  color = "#F26D3D",
  animate = true,
  delay = 0,
  className,
}: LogoProps) {
  // Le chemin unique trace la Tour Eiffel en "A" en un seul trait continu.
  // ViewBox 0 0 48 56 : largeur 48, hauteur 56 (ratio Tour Eiffel).
  const path =
    // Départ en bas à gauche, monte jusqu'au sommet, redescend à droite,
    // puis traverse horizontalement pour former la barre du A.
    "M4 52 L18 4 L24 4 L44 52 M16 36 L32 36 M14 44 L34 44 M18 28 L30 28 M20 22 L28 22 M22 16 L26 16";

  const drawVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.6, ease: "easeInOut", delay },
        opacity: { duration: 0.3, delay },
      },
    },
  };

  return (
    <svg
      width={size}
      height={size * (56 / 48)}
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Logo Analyticatech — A en forme de Tour Eiffel"
    >
      <motion.path
        d={path}
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={animate ? drawVariants : undefined}
        initial={animate ? "hidden" : undefined}
        animate={animate ? "visible" : undefined}
        // Si pas d'animation, on force pathLength à 1
        {...(!animate ? { pathLength: 1 } : {})}
      />
      {/* Point sommital (antenne de la Tour Eiffel) */}
      <motion.circle
        cx="24"
        cy="3"
        r="1.5"
        fill={color}
        initial={animate ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
        animate={animate ? { opacity: 1, scale: 1 } : undefined}
        transition={animate ? { delay: delay + 1.4, duration: 0.3 } : undefined}
      />
    </svg>
  );
}
