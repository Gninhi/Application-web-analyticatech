"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NavbarActionToggleProps
  extends Omit<ButtonProps, "variant" | "iconOnly" | "children"> {
  "aria-label": string;
  title?: string;
  children: React.ReactNode;
}

/**
 * NavbarActionToggle — Bouton d'action standardisé et mutualisé pour la Navbar.
 *
 * Centralisation DRY pour ThemeToggle et LanguageToggle :
 *  - Format compact 36x36px (h-9 w-9) optimisé mobile & desktop
 *  - Style 'secondary' avec fond satiné / glassmorphism
 *  - Liseré lumineux serpent animé (AnimatedButtonBorder) actif par défaut
 *    (faisceau orange #F26D3D en thème clair, bleu #3B82F6 en thème sombre)
 *  - 100% accessible (focus-visible, aria-label, title)
 */
export const NavbarActionToggle = React.forwardRef<
  HTMLButtonElement,
  NavbarActionToggleProps
>(
  (
    {
      className,
      children,
      borderRadius = 12,
      duration = 3.5,
      beamSize = 20,
      showBorderAnimation = true,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant="secondary"
        iconOnly
        borderRadius={borderRadius}
        duration={duration}
        beamSize={beamSize}
        showBorderAnimation={showBorderAnimation}
        className={cn(
          "h-9 w-9 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shrink-0 cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

NavbarActionToggle.displayName = "NavbarActionToggle";
