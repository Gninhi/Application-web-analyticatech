"use client";

import { ChevronRight } from "lucide-react";
import { MovingButton } from "@/components/interactive/MovingButton";

interface ServiceCardActionProps {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  accentColor?: string;
}

/**
 * ServiceCardAction — Bouton d'action interactif avec micro-animation d'exploration.
 */
export function ServiceCardAction({ label, onClick }: ServiceCardActionProps) {
  return (
    <MovingButton
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      variant="ghost"
      size="sm"
      className="group/btn self-start"
    >
      <span>{label}</span>
      <ChevronRight
        className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5"
        aria-hidden
      />
    </MovingButton>
  );
}
