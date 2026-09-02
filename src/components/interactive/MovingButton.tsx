"use client";

import { forwardRef } from "react";
import {
  GlassButton,
  type GlassButtonProps,
  glassButtonVariants,
  glassButtonTextVariants,
} from "@/components/interactive/GlassButton";

export type MovingButtonProps = GlassButtonProps;

/**
 * MovingButton — Bouton centralisé haute visibilité à technologie Liquid Glass & bordure animée.
 *
 * Tous les boutons du site (CTA, formulaire, basculeurs de thème/langue, navigation)
 * bénéficient automatiquement de la réfraction liquide, de la rim-light spéculaire,
 * de l'ombre de profondeur et du faisceau animé périphérique (AnimatedButtonBorder).
 */
export const MovingButton = forwardRef<HTMLButtonElement, MovingButtonProps>(
  function MovingButton(props, ref) {
    return <GlassButton ref={ref} {...props} />;
  }
);

export default MovingButton;
export { GlassButton, glassButtonVariants, glassButtonTextVariants };
