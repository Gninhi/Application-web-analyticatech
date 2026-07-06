"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

/**
 * ImmersiveBackground — système de particules Three.js en arrière-plan.
 * Rendu fixed, z-index -1, derrière tout le contenu.
 *
 * Le Canvas lourd est chargé dynamiquement (ssr:false) pour ne pas
 * pénaliser le First Contentful Paint et éviter les erreurs SSR Three.js.
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
      {/* Dégradé radial de fond (complément des particules) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(2,40,89,0.6) 0%, rgba(1,28,64,1) 60%), #011C40",
        }}
      />
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>
      {/* Voile subtil pour la lisibilité du texte */}
      <div className="absolute inset-0 bg-[#011C40]/30" />
    </div>
  );
}
