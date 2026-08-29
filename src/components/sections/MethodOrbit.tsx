"use client";

import type { CSSProperties } from "react";
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
 * MethodOrbit — les phases de la méthode gravitent en orbite autour d'un hub
 * central (inspiré Radial Orbital Timeline / 21st.dev + pattern CyberCrest).
 *
 * Animation : 100% CSS. La piste (.orbit-track) tourne en continu (48s) et le
 * contenu de chaque nœud contre-tourne pour rester lisible. Pause au survol
 * ou au focus clavier. Reduced-motion : gelée par la règle globale.
 *
 * Chaque nœud : cercle glass avec icône + numéro mono, relié visuellement par
 * deux anneaux décoratifs. L'étape active est mise en exergue (bordure accent
 * + halo + scale).
 */
export function MethodOrbit({ nodes, activeIndex, onSelect, centerLabel }: MethodOrbitProps) {
  const count = nodes.length;

  return (
    <div
      className="orbit-stage relative mx-auto hidden aspect-square w-full max-w-[460px] select-none lg:block"
      role="tablist"
      aria-label={centerLabel}
    >
      {/* Anneaux décoratifs */}
      <div className="orbit-ring orbit-ring--outer" aria-hidden />
      <div className="orbit-ring orbit-ring--inner" aria-hidden />

      {/* Halo doux derrière le hub */}
      <div
        className="orbit-hub-halo pointer-events-none absolute top-1/2 left-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        aria-hidden
      />

      {/* Hub central — glass + liseré rim, identité du design system */}
      <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="glass-strong flex h-28 w-28 flex-col items-center justify-center gap-1.5 rounded-full text-center shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
          <Waypoints className="h-5 w-5 text-[#F26D3D]" aria-hidden />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            {centerLabel}
          </span>
        </div>
      </div>

      {/* Piste rotative porteuse des nœuds */}
      <div className="orbit-track">
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
                    "transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                  )}
                >
                  {/* Pastille icône */}
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
                      isActive ? "scale-110" : "group-hover:scale-105"
                    )}
                    style={{
                      background: "var(--glass-card-bg)",
                      borderColor: isActive
                        ? `color-mix(in srgb, ${node.color} 70%, transparent)`
                        : "var(--glass-card-border)",
                      boxShadow: isActive
                        ? `0 0 24px color-mix(in srgb, ${node.color} 35%, transparent), inset 0 1px 0 var(--glass-rim)`
                        : "inset 0 1px 0 var(--glass-rim-soft)",
                      color: node.color,
                    }}
                  >
                    <NodeIcon className="h-5 w-5" aria-hidden />
                  </span>

                  {/* Numéro + durée en mono */}
                  <span className="flex flex-col items-center rounded-xl px-2.5 py-1 backdrop-blur-sm"
                    style={{ background: "color-mix(in srgb, var(--bg) 55%, transparent)" }}
                  >
                    <span
                      className="font-mono text-[11px] font-bold tracking-widest"
                      style={{ color: isActive ? node.color : "var(--fg-muted)" }}
                    >
                      {node.number}
                    </span>
                    <span
                      className="max-w-[120px] truncate font-mono text-[9px] uppercase tracking-wider"
                      style={{ color: "var(--fg-muted)" }}
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
