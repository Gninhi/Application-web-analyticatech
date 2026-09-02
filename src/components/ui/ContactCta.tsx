"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ContactCtaProps {
  /** Question / invite affichée au-dessus du bouton. */
  question: string;
  /** Label du bouton d'appel à l'action. */
  cta: string;
  onNavigate: (view: "contact") => void;
  /** Taille du bouton (md pour les pages de contenu, lg par défaut). */
  size?: "md" | "lg";
  /** Applique la lueur néon au bouton (défaut: true). */
  glow?: boolean;
  /** Affiche la flèche ↗ dans le bouton (défaut: true). */
  withIcon?: boolean;
  /** Classes du conteneur. */
  className?: string;
  /** Délai d'animation (s). */
  delay?: number;
}

/**
 * ContactCta — encart d'appel à l'action récurrent (bas de page).
 *
 * Centralise le motif `glass-card … text-center` + question + bouton
 * "Contact". Les variantes (taille, lueur néon, flèche) sont pilotées
 * par props.
 */
export function ContactCta({
  question,
  cta,
  onNavigate,
  size = "lg",
  glow = true,
  withIcon = true,
  className,
  delay = 0.2,
}: ContactCtaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn("glass-card rounded-2xl p-6 md:p-8 text-center", className)}
    >
      <p className="text-slate-600 dark:text-slate-300 mb-4">{question}</p>
      <Button
        variant="primary"
        size={size}
        onClick={() => onNavigate("contact")}
        icon={withIcon ? <ArrowUpRight className="h-4 w-4" aria-hidden /> : undefined}
        iconPosition="right"
        className={glow ? "neon-glow" : undefined}
      >
        {cta}
      </Button>
    </motion.div>
  );
}