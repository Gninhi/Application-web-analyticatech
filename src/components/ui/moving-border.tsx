"use client";

import React, { useRef, ElementType, Ref } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  children: React.ReactNode;
  /** Rayon de la bordure. Défaut : "1.75rem". */
  borderRadius?: string;
  /** Durée d'un tour complet de la bordure en ms. Défaut : 3000. */
  duration?: number;
  /** Classes additionnelles pour le conteneur extérieur. */
  containerClassName?: string;
  /** Classes pour la surface intérieure. */
  className?: string;
  /** Classes pour le dot lumineux qui parcourt la bordure. */
  borderClassName?: string;
  /** Élément HTML à rendre. Défaut : "button". */
  as?: ElementType;
}

/**
 * Button — bouton premium avec bordure lumineuse animée (style Aceternity UI).
 *
 * La bordure est un chemin SVG que parcourt en continu un point lumineux
 * radial (orange → bleu signature Analyticatech). À l'arrêt, une bordure
 * statique orange discrète reste visible pour la lisibilité.
 *
 * Palette appliquée :
 *   - Dot lumineux : dégradé radial `#F26D3D` (orange) → transparent.
 *   - Bordure de base : `#F26D3D` à 35 % d'opacité.
 *
 * Composant polymorphe : on peut rendre un `<button>`, un `<a>`, etc.
 * via la prop `as`. Le `ref` est correctement transféré vers l'élément rendu.
 *
 * Réduction de mouvement : la durée du dot est nulle si l'utilisateur a
 * activé `prefers-reduced-motion` (géré dans le CSS global).
 */
export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    borderRadius = "1.75rem",
    children,
    as,
    containerClassName,
    borderClassName,
    duration = 3000,
    className,
    ...rest
  },
  ref
) {
  const Element = (as ?? "button") as React.ComponentType<React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>>;
  const innerRadius = `calc(${borderRadius} - 4px)`;

  return (
    <Element
      {...rest}
      ref={ref as Ref<HTMLElement>}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden bg-transparent p-[2px] text-sm antialiased",
        containerClassName
      )}
      style={{ borderRadius }}
    >
      {/* Bordure animée (SVG + dot lumineux orange→bleu) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ borderRadius: innerRadius }}
      >
        <MovingBorder duration={duration} rx={borderRadius} ry={borderRadius}>
          <div
            className={cn(
              "h-20 w-20 opacity-90",
              "[background:radial-gradient(circle_at_center,#F26D3D_25%,rgba(242,109,61,0.55)_45%,rgba(3,49,140,0.35)_65%,transparent_75%)]",
              borderClassName
            )}
          />
     </MovingBorder>
   </div>

      {/* Surface intérieure du bouton (visible au-dessus de la bordure) */}
      <div
        className={cn(
          "relative z-10 inline-flex items-center justify-center w-full h-full",
          className
        )}
        style={{ borderRadius: innerRadius }}
      >
        {children}
   </div>
 </Element>
  );
});

interface MovingBorderRawProps {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
}

/**
 * MovingBorder — sous-composant bas-niveau qui anime un dot le long
 * d'un chemin SVG arrondi. Exporté pour permettre des usages avancés
 * (badges, cartes, séparateurs…).
 *
 * Voir : https://ui.aceternity.com/components/moving-border
 */
export function MovingBorder({
  children,
  duration = 3000,
  rx = "30%",
  ry = "30%",
}: MovingBorderRawProps) {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    if (length > 0) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x ?? 0
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y ?? 0
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
      >
        {/* Bordure statique (orange 35 % opacité) — toujours visible */}
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          stroke="#F26D3D"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        {/* Chemin invisible servant de trajectoire au dot */}
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
   </svg>

      <motion.div
        style={{ transform }}
        className="absolute h-20 w-20 pointer-events-none"
      >
        {children}
   </motion.div>
    </>
  );
}

export default Button;
