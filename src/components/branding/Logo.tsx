import type { CSSProperties } from "react";

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
 * Optimisé CSS pur (zéro JS/Framer Motion) : tracé fluide GPU-accelerated.
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
    "M4 52 L18 4 L24 4 L44 52 M16 36 L32 36 M14 44 L34 44 M18 28 L30 28 M20 22 L28 22 M22 16 L26 16";

  const pathStyle: CSSProperties | undefined = animate
    ? {
        strokeDasharray: 260,
        strokeDashoffset: 0,
        animation: `logo-draw 1.6s ease-in-out ${delay}s both`,
      }
    : undefined;

  const dotStyle: CSSProperties | undefined = animate
    ? {
        animation: `logo-dot 0.3s ease-out ${delay + 1.4}s both`,
      }
    : undefined;

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
      <path
        d={path}
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={pathStyle}
      />
      {/* Point sommital (antenne de la Tour Eiffel) */}
      <circle
        cx="24"
        cy="3"
        r="1.5"
        fill={color}
        style={dotStyle}
      />
    </svg>
  );
}
