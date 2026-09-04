"use client";

import { useRef, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { Waypoints } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface OrbitNodeData {
  number: string;
  title: string;
  duration: string;
  icon: LucideIcon;
  color: string;
}

interface MethodOrbitProps {
  nodes: OrbitNodeData[];
  activeIndex: number;
  onSelect: (index: number) => void;
  centerLabel: string;
}

/**
 * MethodOrbit — Système orbital immersif des 4 phases méthodologiques.
 *
 * Architecture cinétique :
 * - Hub central vivant : pulsation thermique (glow orange #F26D3D) et ondes sonar concentriques.
 * - Piste orbitale rotative (64s) avec contre-rotation intégrale pour lisibilité parfaite.
 * - Faisceau d'énergie orienté (Hub ➔ Nœud actif) avec dégradé photonique et flux de paquets animé.
 * - Hiérarchie forte : nœud actif magnifié (halo 30px, scale 1.1x), nœuds inactifs en retrait feutré.
 * - Parallax discret de la grille matricielle de fond au survol de la souris.
 * - Parfaite adaptation aux thèmes Clair et Sombre via CSS variables et tokens sémantiques.
 */
export function MethodOrbit({ nodes, activeIndex, onSelect, centerLabel }: MethodOrbitProps) {
  const count = nodes.length;
  const activeNode = nodes[activeIndex] ?? nodes[0];
  const activeDeg = (360 / count) * activeIndex;

  // Parallax discret de la grille de fond sans re-render
  const gridRef = useRef<HTMLDivElement>(null);
  const stageRectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    stageRectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = stageRectRef.current;
    if (!rect || !gridRef.current) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gridRef.current.style.transform = `translate3d(${Math.round(x * 12)}px, ${Math.round(y * 12)}px, 0)`;
  };

  const handleMouseLeave = () => {
    stageRectRef.current = null;
    if (gridRef.current) {
      gridRef.current.style.transform = "translate3d(0, 0, 0)";
    }
  };

  return (
    <div
      className="orbit-stage relative mx-auto hidden aspect-square w-full max-w-[480px] select-none lg:block"
      role="tablist"
      aria-label={centerLabel}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Grille stellaire d'arrière-plan avec parallax subtil sous la souris */}
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-[-8%] rounded-full transition-transform duration-300 ease-out"
        aria-hidden
      >
        <svg
          className="h-full w-full opacity-35 dark:opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="orbit-dot-grid" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle
                cx="2"
                cy="2"
                r="1"
                className="fill-[#03318C] dark:fill-white/80"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#orbit-dot-grid)" />
        </svg>
      </div>

      {/* 2. Anneaux décoratifs concentriques */}
      <div className="orbit-ring orbit-ring--outer" aria-hidden />
      <div className="orbit-ring orbit-ring--inner" aria-hidden />

      {/* Repères cardinaux subtils sur l'anneau extérieur */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-0.5 bg-black/15 dark:bg-white/20" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-2 w-0.5 bg-black/15 dark:bg-white/20" />
        <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-0.5 bg-black/15 dark:bg-white/20" />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-0.5 bg-black/15 dark:bg-white/20" />
      </div>

      {/* 3. Halo thermique respirant (cycle 3.6s) */}
      <div
        className="orbit-hub-halo pointer-events-none absolute top-1/2 left-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        aria-hidden
      />

      {/* 4. Ondes sonar concentriques périodiques */}
      <div className="orbit-sonar-pulse" aria-hidden />
      <div className="orbit-sonar-pulse" style={{ animationDelay: "1.8s" }} aria-hidden />

      {/* 5. Hub central — identité cybernétique et statut vivant */}
      <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full text-center border backdrop-blur-xl transition-all duration-300 bg-white/90 dark:bg-[#06070B]/80 border-black/10 dark:border-white/15 shadow-[0_8px_30px_rgba(3,49,140,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.60)]">
          {/* Liseré de réflexion interne */}
          <div className="pointer-events-none absolute inset-1 rounded-full border border-white/80 dark:border-white/10" />

          <Waypoints className="h-5 w-5 text-[#F26D3D] transition-transform duration-500 hover:rotate-45" aria-hidden />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-slate-700 dark:text-slate-300">
            {centerLabel}
          </span>

          {/* Micro indicateur de statut actif */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F26D3D] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F26D3D]" />
            </span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-[#F26D3D] font-bold">
              SYS.LIVE
            </span>
          </div>
        </div>
      </div>

      {/* 6. Piste rotative porteuse du faisceau d'énergie et des 4 nœuds */}
      <div className="orbit-track">
        {/* Faisceau d'énergie photonique orienté vers le nœud actif */}
        {activeNode && (
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-y-1/2 origin-left transition-transform duration-500 ease-out"
            style={{
              width: "var(--orbit-r)",
              transform: `rotate(${activeDeg}deg)`,
            }}
            aria-hidden
          >
            {/* Ligne laser principale avec dégradé orienté */}
            <div
              className="relative h-[2px] w-full"
              style={{
                background: `linear-gradient(90deg, #F26D3D 0%, ${activeNode.color} 100%)`,
              }}
            >
              {/* Paquets d'énergie en défilement continu */}
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage: `repeating-linear-gradient(90deg, transparent 0, transparent 8px, #ffffff 8px, #ffffff 16px)`,
                  animation: "laser-stream 1.2s linear infinite",
                }}
              />

              {/* Halo néon diffus au-dessus du faisceau */}
              <div
                className="absolute inset-0 -top-[3px] h-[8px] blur-[3px] opacity-70"
                style={{
                  background: `linear-gradient(90deg, #F26D3D 0%, ${activeNode.color} 100%)`,
                }}
              />

              {/* Point de réfraction et d'impact à la jonction du nœud actif */}
              <div
                className="absolute -right-1 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full blur-[2px] animate-pulse"
                style={{
                  backgroundColor: activeNode.color,
                  boxShadow: `0 0 16px ${activeNode.color}`,
                }}
              />
            </div>
          </div>
        )}

        {/* Nœuds de phase orbitaux (01 à 04) */}
        {nodes.map((node, i) => {
          const deg = (360 / count) * i;
          const isActive = i === activeIndex;
          const NodeIcon = node.icon;

          return (
            <div
              key={node.number}
              className="orbit-node"
              style={{ "--node-deg": `${deg}deg` } as CSSProperties}
            >
              <div className="orbit-node-content">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${node.number} — ${node.title}`}
                  onClick={() => onSelect(i)}
                  onMouseEnter={() => onSelect(i)}
                  className={cn(
                    "group flex cursor-pointer flex-col items-center gap-1.5 outline-none",
                    "transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#F26D3D] rounded-2xl",
                    isActive
                      ? "scale-110 opacity-100 z-30"
                      : "scale-95 opacity-55 hover:opacity-95 hover:scale-100 z-10"
                  )}
                >
                  {/* Pastille icône circulaire glass */}
                  <span
                    className={cn(
                      "relative flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
                      isActive
                        ? "ring-2 ring-offset-2 ring-offset-[var(--bg)]"
                        : "shadow-sm"
                    )}
                    style={{
                      background: isActive
                        ? "color-mix(in srgb, var(--surface) 90%, transparent)"
                        : "var(--glass-card-bg)",
                      borderColor: isActive
                        ? node.color
                        : "var(--glass-card-border)",
                      boxShadow: isActive
                        ? `0 0 28px color-mix(in srgb, ${node.color} 50%, transparent), inset 0 1px 0 var(--glass-rim)`
                        : "inset 0 1px 0 var(--glass-rim-soft)",
                      color: node.color,
                      ["--tw-ring-color" as string]: node.color,
                    }}
                  >
                    <NodeIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden />

                    {/* Micro badge actif sur le nœud */}
                    {isActive && (
                      <span
                        className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--bg)] flex items-center justify-center animate-pulse"
                        style={{ backgroundColor: node.color }}
                        aria-hidden
                      />
                    )}
                  </span>

                  {/* Numéro + durée en mono avec fond adapté aux deux thèmes */}
                  <span
                    className={cn(
                      "flex flex-col items-center rounded-xl px-2.5 py-1 backdrop-blur-md transition-all duration-300 border",
                      isActive
                        ? "border-black/10 dark:border-white/20 shadow-md shadow-black/5 dark:shadow-black/30"
                        : "border-transparent"
                    )}
                    style={{
                      background: "color-mix(in srgb, var(--bg) 80%, transparent)",
                    }}
                  >
                    <span
                      className="font-mono text-[11px] font-bold tracking-widest transition-colors duration-200"
                      style={{ color: isActive ? node.color : "var(--fg-muted)" }}
                    >
                      {node.number}
                    </span>
                    <span
                      className="max-w-[120px] truncate font-mono text-[9px] uppercase tracking-wider font-semibold"
                      style={{ color: isActive ? "var(--fg)" : "var(--fg-muted)" }}
                      title={node.title}
                    >
                      {node.title}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
