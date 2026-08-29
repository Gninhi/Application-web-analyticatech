"use client";

import type { CSSProperties } from "react";

/** Variantes d'animation CSS-only des chips circulaires de services. */
export type ServiceIconVariant = "orbit" | "relay" | "wave" | "spark" | "loop";

interface ServiceAnimatedIconProps {
  variant: ServiceIconVariant;
  accentColor?: string;
}

/**
 * ServiceAnimatedIcon — chip circulaire animée purement en CSS (pas de JS,
 * zéro re-render). L'animation est définie dans globals.css (.svc-icon) et
 * colorée via --svc-stroke (accent du pilier). Gelée automatiquement sous
 * prefers-reduced-motion par la règle globale.
 */
export function ServiceAnimatedIcon({
  variant,
  accentColor = "#F26D3D",
}: ServiceAnimatedIconProps) {
  return (
    <span
      aria-hidden
      data-variant={variant}
      className="svc-icon h-14 w-14 shrink-0 border sm:h-16 sm:w-16 transition-transform duration-300 group-hover:scale-105"
      style={
        {
          "--svc-stroke": accentColor,
          borderColor: `color-mix(in srgb, ${accentColor} 35%, transparent)`,
          background: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
          boxShadow: `0 0 16px color-mix(in srgb, ${accentColor} 14%, transparent)`,
        } as CSSProperties
      }
    >
      <span />
    </span>
  );
}
