"use client";

import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedButtonBorder } from "@/components/ui/button-border";

/**
 * Variantes officielles des boutons Analyticatech :
 * - Thème Sombre : Fond Orange de l'entreprise (#F26D3D) + Bordure serpent Bleu (#8DB0FF / #03318C)
 * - Thème Clair  : Fond Bleu de l'entreprise (#03318C) + Bordure serpent Orange (#F26D3D)
 * - Transitions fluides et support conditionnel exhaustif
 */
const buttonVariants = cva(
  "relative isolate inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[15px] font-semibold font-sans normal-case tracking-normal select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        // Bouton d'accent : fond orange, texte navy-900 (jamais blanc)
        default:
          "bg-[#F26D3D] text-[#011C40] border border-[#F26D3D] hover:bg-[#E35F31] hover:border-[#E35F31]",
        primary:
          "bg-[#F26D3D] text-[#011C40] border border-[#F26D3D] hover:bg-[#E35F31] hover:border-[#E35F31]",
        // Bouton secondaire : contour, texte de la couleur du thème
        outline:
          "border border-border bg-transparent text-foreground hover:border-foreground",
        secondary:
          "bg-foreground text-background border border-foreground hover:opacity-90",
        ghost:
          "bg-transparent text-foreground hover:bg-muted",
        link: "text-link underline-offset-4 hover:underline",
        terminal:
          "border border-border bg-transparent text-foreground hover:border-foreground",
        subtle:
          "bg-muted border border-border text-foreground hover:border-foreground",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-5 py-3",
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 py-3",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  iconOnly?: boolean;
  /** Active ou désactive le faisceau animé serpent sur la bordure */
  showBorderAnimation?: boolean;
  /** Rayon de courbure en pixels ou chaîne CSS */
  borderRadius?: number | string;
  /** Durée d'un tour de faisceau en secondes */
  duration?: number;
  /** Largeur du faisceau lumineux en px */
  beamWidth?: number;
  beamSize?: number;
  /** Dégradé lumineux personnalisé */
  gradientClassName?: string;
  beamGradient?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      href,
      icon,
      iconPosition = "left",
      loading = false,
      iconOnly = false,
      showBorderAnimation,
      borderRadius,
      duration = 4,
      beamWidth,
      beamSize = 24,
      gradientClassName,
      beamGradient,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedSize = iconOnly ? "icon" : size ?? "default";
    const isDisabled = disabled || loading;

    // Animation serpent activée par défaut sur les variantes avec bordure visible
    const shouldAnimateBorder =
      // Charte : pas de faisceau dégradé animé sur les boutons
      showBorderAnimation ?? false;

    const resolvedRadius =
      borderRadius ??
      (resolvedSize === "sm" ? 8 : resolvedSize === "lg" ? 14 : 12);

    const renderContent = () => (
      <>
        {shouldAnimateBorder && !isDisabled && (
          <AnimatedButtonBorder
            borderRadius={resolvedRadius}
            duration={duration}
            beamSize={beamWidth ?? beamSize}
            gradientClassName={gradientClassName}
            beamGradient={beamGradient}
          />
        )}
        {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
        {!loading && iconPosition === "left" && icon && <span className="inline-flex shrink-0">{icon}</span>}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        {!loading && iconPosition === "right" && icon && <span className="inline-flex shrink-0">{icon}</span>}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size: resolvedSize, className }))}
          aria-disabled={isDisabled}
          aria-busy={loading ? true : undefined}
        >
          {renderContent()}
        </Link>
      );
    }

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size: resolvedSize, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading ? true : undefined}
        {...props}
      >
        {renderContent()}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
