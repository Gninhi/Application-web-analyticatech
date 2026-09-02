"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface ReportVisualProps {
  accent: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Couverture "rapport technique" — fond navy profond, grille technique
 * estompée sur les bords, halo accent doux, balayage lumineux lent.
 */
export function ReportVisual({ accent, className, children }: ReportVisualProps) {
  const reduceMotion = useReducedMotion();
  const gradient = `linear-gradient(135deg, #050a18 0%, #0a1328 55%, color-mix(in srgb, ${accent} 22%, #050a18) 130%)`;
  const grid = `linear-gradient(color-mix(in srgb, ${accent} 22%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, ${accent} 22%, transparent) 1px, transparent 1px)`;
  const gridMask = "radial-gradient(ellipse 85% 100% at 30% 0%, black 30%, transparent 92%)";
  const glow = `radial-gradient(300px circle at 84% 12%, color-mix(in srgb, ${accent} 26%, transparent), transparent 70%)`;

  return (
    <div className={cn("relative z-20 overflow-hidden", className)} style={{ background: gradient }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: grid,
          backgroundSize: "24px 24px",
          maskImage: gridMask,
          WebkitMaskImage: gridMask,
          opacity: 0.5,
        }}
        aria-hidden
      />
      <div className="absolute inset-0" style={{ background: glow }} aria-hidden />

      {!reduceMotion && (
        <motion.div
          initial={{ x: "-140%" }}
          animate={{ x: "140%" }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          className="pointer-events-none absolute inset-y-0 w-[45%]"
          style={{
            background: `linear-gradient(100deg, transparent, color-mix(in srgb, ${accent} 30%, transparent) 45%, transparent)`,
          }}
          aria-hidden
        />
      )}

      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
