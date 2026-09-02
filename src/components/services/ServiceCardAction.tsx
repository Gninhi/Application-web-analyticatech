"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      variant="ghost"
      size="sm"
      icon={<ChevronRight className="h-4 w-4" aria-hidden />}
      iconPosition="right"
      className="group/btn self-start"
    >
      <span>{label}</span>
    </Button>
  );
}
