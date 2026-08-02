"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

/**
 * ImmersiveBackground — système de particules Three.js en arrière-plan.
 * Rendu fixed, z-index -1, derrière tout le contenu.
 *
 * Le fond s'adapte au thème via les variables CSS (--fade-from, --overlay-bg).
 * - Thème sombre : fond bleu foncé #011C40 + particules blanches
 * - Thème clair : fond gris clair #f5f7fa + particules bleu foncé
 */
const ParticleField = dynamic(() => import("./ParticleField").then((m) => m.ParticleField), {
  ssr: false,
  loading: () => null,
});

export function ImmersiveBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
      role="presentation"
    >
      {/* Dégradé radial de fond (s'adapte au thème via CSS) */}
      <div
        className="absolute inset-0 theme-bg-gradient"
      />
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>
      {/* Voile subtil pour la lisibilité du texte (s'adapte au thème) */}
      <div className="absolute inset-0 theme-overlay" />
    </div>
  );
}
