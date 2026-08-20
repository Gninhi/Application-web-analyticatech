"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * LazySection — diffère le montage (et donc le chargement + l'hydration)
 * d'une section jusqu'à ce qu'elle approche du viewport, avec une marge
 * d'anticipation généreuse pour supprimer tout retard visible au scroll.
 *
 * V2 « révélation au montage » :
 *  - IntersectionObserver avec une marge ~1 viewport en avance ;
 *  - Préchargement idle au chargement : les sections situées dans les ~2,5
 *    hauteurs de viewport sous la ligne de flottaison sont montées pendant
 *    l'idle du navigateur (aucune latence au premier scroll rapide) ;
 *  - Le placeholder (SectionSkeleton) réserve la hauteur desktop + mobile
 *    pour éliminer le CLS ;
 *  - Une fois montée, une section n'est jamais démontée.
 */

const PRELOAD_MARGIN = 1000; // px sous le viewport (≈ 1 viewport en avance)
const IDLE_PRELOAD_VIEWPORTS = 2.5; // hauteurs de viewport préchargées à l'idle

interface LazySectionProps {
  children: ReactNode;
  /** Hauteur minimale réservée (desktop) pour éviter le CLS. */
  minHeight?: number;
  /** Hauteur minimale réservée sur mobile (≤ 639 px) ; défaut : minHeight. */
  mobileMinHeight?: number;
  /** Monte la section immédiatement, sans lazy-loading. */
  eager?: boolean;
  /** Placeholder personnalisé (défaut : SectionSkeleton). */
  placeholder?: ReactNode;
  className?: string;
}

/** Squelette de section : hauteur réservée desktop/mobile + tête de section. */
export function SectionSkeleton({
  minHeight = 640,
  mobileMinHeight = minHeight,
  className,
}: {
  minHeight?: number;
  mobileMinHeight?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "lazy-section-skeleton relative w-full overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5",
        className
      )}
      style={
        {
          "--sk-min": `${minHeight}px`,
          "--sk-mobile": `${mobileMinHeight}px`,
        } as CSSProperties
      }
    >
      {/* Tête de section fantôme : liseré mono + ligne titre + ligne de texte */}
      <div className="flex flex-col gap-3 p-6 md:p-10">
        <div className="h-2.5 w-24 rounded-full bg-gradient-to-r from-[#F26D3D]/30 to-[#F26D3D]/10" />
        <div className="h-5 w-3/5 max-w-xs animate-pulse rounded-full bg-slate-300/60 dark:bg-white/10" />
        <div className="h-3 w-2/5 max-w-[220px] animate-pulse rounded-full bg-slate-300/40 dark:bg-white/5" />
      </div>
    </div>
  );
}

export function LazySection({
  children,
  minHeight = 640,
  mobileMinHeight = minHeight,
  eager = false,
  placeholder,
  className,
}: LazySectionProps) {
  const [mounted, setMounted] = useState(eager);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mounted) return;
    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | null = null;
    let timer: number | null = null;
    let idleId: number | null = null;

    const mount = () => {
      setMounted(true);
    };

    // Préchargement idle : la section est déjà dans la portée → on la monte
    // pendant l'idle du navigateur, sans attendre le scroll de l'utilisateur.
    const scheduleIdle = () => {
      const preload = () => {
        if (mounted) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * IDLE_PRELOAD_VIEWPORTS) mount();
      };
      if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(preload, { timeout: 2000 });
      } else {
        timer = window.setTimeout(preload, 200);
      }
    };

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              mount();
              observer?.disconnect();
            }
          }
        },
        { rootMargin: `${PRELOAD_MARGIN}px 0px` }
      );
      observer.observe(el);
    } else {
      // Repli navigateurs très anciens : on monte la section directement.
      mount();
    }

    scheduleIdle();

    return () => {
      observer?.disconnect();
      if (timer != null) window.clearTimeout(timer);
      if (idleId != null && typeof window !== "undefined" && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [mounted, eager]);

  return (
    <div ref={ref} data-lazy-mounted={mounted} className={cn("relative", className)}>
      {mounted
        ? children
        : placeholder ?? <SectionSkeleton minHeight={minHeight} mobileMinHeight={mobileMinHeight} />}
    </div>
  );
}