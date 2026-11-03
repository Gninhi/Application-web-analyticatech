import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type IconBadgeSize = "sm" | "md" | "lg" | "xl";
export type IconBadgeTone = "accent" | "link" | "danger" | "neutral";

/** Taille du pictogramme selon celle de la pastille. */
const GLYPH: Record<IconBadgeSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

interface IconBadgeProps {
  icon: LucideIcon;
  size?: IconBadgeSize;
  tone?: IconBadgeTone;
  className?: string;
  /** Libellé accessible ; sans libellé, la pastille est décorative. */
  label?: string;
  /** Couleur propre (accent d'une solution, d'un statut) ; remplace le ton. */
  color?: string;
}

/**
 * IconBadge — pastille d'icône commune à tout le site.
 *
 * Cercle, anneaux au trait fin,
 * voile d'accent et pictogramme au trait 1,5 px ; au survol (de la pastille ou
 * d'un parent `group`), l'anneau s'ouvre et un balayage fait un tour (CSS seul,
 * figé sous prefers-reduced-motion). Styles : `.icon-badge` dans globals.css.
 */
export function IconBadge({ icon: Icon, size = "md", tone = "accent", className, label, color }: IconBadgeProps) {
  return (
    <span
      className={cn("icon-badge", className)}
      data-size={size}
      data-tone={tone}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={color ? ({ "--badge-c": color } as CSSProperties) : undefined}
    >
      <Icon className={GLYPH[size]} aria-hidden />
    </span>
  );
}
