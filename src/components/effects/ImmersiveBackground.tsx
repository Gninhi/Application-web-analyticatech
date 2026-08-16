"use client";

import { InteractivePatternBackground } from "@/components/effects/InteractivePatternBackground";

/**
 * ImmersiveBackground — Fond interactif du site (Interactive Grid Background).
 * Rend le fond de page réactif au mouvement de la souris avec grille de points,
 * lignes techniques et halos lumineux animés.
 */
export function ImmersiveBackground() {
  return <InteractivePatternBackground gridSize={32} glowRadius={500} />;
}
