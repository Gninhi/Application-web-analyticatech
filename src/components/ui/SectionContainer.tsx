import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface SectionContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Largeur max du conteneur (mappée à max-w-*). */
  maxWidth?: "7xl" | "6xl" | "5xl" | "4xl" | "3xl" | "2xl";
  as?: ElementType;
}

const MAX_WIDTH: Record<NonNullable<SectionContainerProps["maxWidth"]>, string> = {
  "7xl": "max-w-7xl",
  "6xl": "max-w-6xl",
  "5xl": "max-w-5xl",
  "4xl": "max-w-4xl",
  "3xl": "max-w-3xl",
  "2xl": "max-w-2xl",
};

/**
 * SectionContainer — conteneur de section centralisé.
 *
 * Remplace le motif répété `mx-auto max-w-7xl px-4 md:px-6` (et variantes
 * de largeur) pour garantir un gabarit d'alignement identique sur tout le
 * site. Les classes supplémentaires passées en `className` sont fusionnées
 * (twMerge) après les classes de base.
 */
export function SectionContainer({
  as: Tag = "div",
  maxWidth = "7xl",
  className,
  ...props
}: SectionContainerProps) {
  return <Tag className={cn("mx-auto px-4 md:px-6", MAX_WIDTH[maxWidth], className)} {...props} />;
}