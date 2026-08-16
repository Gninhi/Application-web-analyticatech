"use client";

import { useRef, useState, useId, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface InteractivePatternCardProps {
  children?: ReactNode;
  className?: string;
  patternType?: "dots" | "grid" | "cross";
  glowColor?: string;
  accentColor?: string;
  enableParallax?: boolean;
  depth?: number;
  badge?: string;
  title?: string;
  subtitle?: string;
}

/**
 * InteractivePatternCard — Composant de carte interactif avec motif réactif
 * et système de parallaxe 3D inspiré du composant Framer Interactive Pattern.
 */
export function InteractivePatternCard({
  children,
  className,
  patternType = "dots",
  glowColor = "rgba(242, 109, 61, 0.35)",
  accentColor = "#F26D3D",
  enableParallax = true,
  depth = 18,
  badge,
  title,
  subtitle,
}: InteractivePatternCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [, setIsHovered] = useState(false);
  const patternId = useId();

  // Position relative de la souris (-0.5 à +0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Ressorts ultra-fluides pour l'effet de tilt parallaxe
  const springConfig = { stiffness: 240, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [depth, -depth]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-depth, depth]), springConfig);

  // Décalage parallaxe inverse pour le motif de fond (-15px)
  const bgTranslateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [14, -14]), springConfig);
  const bgTranslateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);

  // Décalage parallaxe avant pour le contenu (+10px)
  const fgTranslateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const fgTranslateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x / rect.width - 0.5);
    mouseY.set(y / rect.height - 0.5);

    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    if (cardRef.current) {
      cardRef.current.style.setProperty("--mx", "-300px");
      cardRef.current.style.setProperty("--my", "-300px");
    }
  };

  return (
    <div className="perspective-1000 w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: enableParallax ? rotateX : 0,
          rotateY: enableParallax ? rotateY : 0,
          transformStyle: "preserve-3d",
          "--mx": "-300px",
          "--my": "-300px",
        } as React.CSSProperties}
        className={cn(
          "group relative overflow-hidden rounded-3xl glass-card p-6 md:p-8 transition-all duration-300",
          className
        )}
      >
        {/* ============ COUCHE ARRIÈRE-PLAN (Motif grille interactif) ============ */}
        <motion.div
          style={{
            x: enableParallax ? bgTranslateX : 0,
            y: enableParallax ? bgTranslateY : 0,
            translateZ: -15,
          }}
          className="pointer-events-none absolute inset-0 -m-6"
        >
          {/* Grille SVG réactive très visible */}
          <div className="absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-75">
            {patternType === "dots" && (
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`dot-pattern-${patternId}`} width="22" height="22" patternUnits="userSpaceOnUse">
                    <circle cx="2.5" cy="2.5" r="1.8" fill="rgba(242,109,61,0.4)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#dot-pattern-${patternId})`} />
              </svg>
            )}

            {patternType === "grid" && (
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`grid-pattern-${patternId}`} width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(242,109,61,0.3)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-pattern-${patternId})`} />
              </svg>
            )}

            {patternType === "cross" && (
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`cross-pattern-${patternId}`} width="26" height="26" patternUnits="userSpaceOnUse">
                    <path d="M 13 9 L 13 17 M 9 13 L 17 13" fill="none" stroke="rgba(242,109,61,0.4)" strokeWidth="1.2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#cross-pattern-${patternId})`} />
              </svg>
            )}
          </div>

          {/* Halo lumineux radial actif qui suit le curseur de la souris */}
          <div
            className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{
              background: `radial-gradient(350px circle at var(--mx) var(--my), ${glowColor}, transparent 65%)`,
            }}
            aria-hidden
          />

          {/* Halo d'accentuation fixe */}
          <div
            className="absolute -top-20 -right-20 h-56 w-56 rounded-full opacity-25 blur-3xl transition-transform duration-500 group-hover:scale-125"
            style={{ background: accentColor }}
            aria-hidden
          />
        </motion.div>

        {/* Liseré lumineux au survol */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F26D3D] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />

        {/* ============ COUCHE PREMIER PLAN (Contenu) ============ */}
        <motion.div
          style={{
            x: enableParallax ? fgTranslateX : 0,
            y: enableParallax ? fgTranslateY : 0,
            translateZ: 15,
          }}
          className="relative z-10 flex flex-col justify-between h-full"
        >
          {badge && (
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#F26D3D]/30 bg-[#F26D3D]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#F26D3D] font-bold backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F26D3D] animate-pulse" aria-hidden />
                {badge}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Parallax 3D
              </span>
            </div>
          )}

          {title && (
            <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              {title}
            </h3>
          )}

          {subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-6">
              {subtitle}
            </p>
          )}

          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
