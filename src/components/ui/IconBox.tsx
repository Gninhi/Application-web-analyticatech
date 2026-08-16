"use client";

import { cn } from "@/lib/utils/cn";

export type IconBoxTone = "primary" | "blue" | "green" | "neutral";
export type IconBoxSize = "sm" | "md" | "lg";

interface IconBoxProps {
  /** Icône Lucide à afficher (déjà importée). */
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean | "true" | "false" }>;
  tone?: IconBoxTone;
  size?: IconBoxSize;
  /** Intitulé accessible si l'icône est porteuse de sens. */
  label?: string;
  className?: string;
  iconClassName?: string;
}

const TONE_STYLES: Record<IconBoxTone, string> = {
  primary:
    "border-[#F26D3D]/30 bg-gradient-to-br from-[#F26D3D]/20 via-[#F26D3D]/10 to-transparent text-[#F26D3D] shadow-[inset_0_1px_0_rgba(242,109,61,0.25),0_0_20px_-6px_rgba(242,109,61,0.5)]",
  blue: "border-[#2B6DE0]/30 bg-gradient-to-br from-[#03318C]/25 via-[#03318C]/10 to-transparent text-[#2B6DE0] dark:text-[#6FA8FF] shadow-[inset_0_1px_0_rgba(43,109,224,0.25),0_0_20px_-6px_rgba(43,109,224,0.45)]",
  green:
    "border-[#4CAF50]/30 bg-gradient-to-br from-[#4CAF50]/20 via-[#4CAF50]/10 to-transparent text-[#4CAF50] shadow-[inset_0_1px_0_rgba(76,175,80,0.25),0_0_20px_-6px_rgba(76,175,80,0.45)]",
  neutral:
    "border-black/10 dark:border-white/10 bg-gradient-to-br from-black/[0.06] dark:from-white/10 to-transparent text-slate-700 dark:text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
};

const SIZE_STYLES: Record<IconBoxSize, { box: string; icon: string }> = {
  sm: { box: "h-9 w-9 rounded-lg p-2", icon: "h-4 w-4" },
  md: { box: "h-11 w-11 rounded-xl p-2.5", icon: "h-5 w-5" },
  lg: { box: "h-14 w-14 rounded-2xl p-3.5", icon: "h-6 w-6" },
};

/**
 * IconBox — conteneur d'icône premium unifié (coin coupé + gradient + glow).
 * Garantit un rendu cohérent du système d'icônes sur tout le site.
 */
export function IconBox({
  icon: Icon,
  tone = "primary",
  size = "md",
  label,
  className,
  iconClassName,
}: IconBoxProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center border backdrop-blur-sm",
        "[clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]",
        "transition-transform duration-300 group-hover:scale-110",
        TONE_STYLES[tone],
        SIZE_STYLES[size].box,
        className,
      )}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Icon
        className={cn(SIZE_STYLES[size].icon, iconClassName)}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </span>
  );
}
