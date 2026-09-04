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
 * - Thème Sombre : Fond Orange de l'entreprise (#F26D3D) + Bordure serpent Bleu (#3B82F6 / #03318C)
 * - Thème Clair  : Fond Bleu de l'entreprise (#03318C) + Bordure serpent Orange (#F26D3D)
 * - Transitions fluides et support conditionnel exhaustif
 */
const buttonVariants = cva(
  "relative isolate inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium font-mono uppercase tracking-wider select-none overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26D3D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#03318C] text-white border border-[#03318C]/50 hover:bg-[#022873] shadow-sm hover:shadow-[0_0_24px_rgba(3,49,140,0.35)] dark:bg-[#F26D3D] dark:text-slate-950 dark:font-semibold dark:border-[#F26D3D]/50 dark:hover:bg-[#ff7b4b] dark:hover:shadow-[0_0_24px_rgba(242,109,61,0.35)] active:scale-[0.98]",
        primary:
          "bg-[#03318C] text-white border border-[#03318C]/50 hover:bg-[#022873] shadow-sm hover:shadow-[0_0_24px_rgba(3,49,140,0.35)] dark:bg-[#F26D3D] dark:text-slate-950 dark:font-semibold dark:border-[#F26D3D]/50 dark:hover:bg-[#ff7b4b] dark:hover:shadow-[0_0_24px_rgba(242,109,61,0.35)] active:scale-[0.98]",
        outline:
          "border border-[#03318C]/40 bg-background/80 backdrop-blur-xs text-[#03318C] hover:text-[#03318C] hover:border-[#03318C] hover:bg-[#03318C]/10 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:text-[#60A5FA] dark:hover:border-[#3B82F6]/50 dark:hover:bg-white/10 active:scale-[0.98]",
        secondary:
          "bg-[#03318C]/10 border border-[#03318C]/20 text-slate-900 hover:bg-[#03318C]/20 hover:text-[#03318C] dark:bg-white/10 dark:border-white/15 dark:text-slate-100 dark:hover:bg-white/15 dark:hover:text-white active:scale-[0.98]",
        ghost:
          "hover:bg-[#03318C]/10 hover:text-[#03318C] dark:hover:bg-white/10 dark:hover:text-[#60A5FA] active:scale-[0.98]",
        link: "text-[#03318C] dark:text-[#60A5FA] underline-offset-4 hover:underline normal-case tracking-normal font-sans",
        terminal:
          "font-mono border border-[#03318C]/40 bg-[#06070B] text-slate-100 hover:border-[#F26D3D] hover:text-[#F26D3D] dark:border-[#F26D3D]/40 dark:hover:border-[#3B82F6] dark:hover:text-[#3B82F6] active:scale-[0.98]",
        subtle:
          "bg-white/5 border border-[#03318C]/20 text-slate-200 hover:bg-white/10 dark:border-white/10 active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-5 py-2.5 text-sm",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        md: "h-10 px-5 py-2.5 text-sm",
        lg: "h-11 rounded-xl px-7 text-sm md:text-base",
        icon: "h-10 w-10 p-0 text-sm",
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
      showBorderAnimation ??
      (variant === "default" ||
        variant === "primary" ||
        variant === "outline" ||
        variant === "terminal");

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
