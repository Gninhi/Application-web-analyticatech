"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Waypoints, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface OrbitNodeData {
  number: string;
  title: string;
  duration: string;
  icon: LucideIcon;
  color: string;
}

export interface Orbit3DMethodProps {
  nodes: OrbitNodeData[];
  activeIndex: number;
  onSelect: (index: number) => void;
  centerLabel?: string;
  className?: string;
}

// Paramètres physiques des 4 orbites tridimensionnelles
interface OrbitConfig {
  radius: number;       // Rayon en pixels
  tiltX: number;        // Inclinaison orbitale X en degrés
  tiltY: number;        // Inclinaison orbitale Y en degrés
  period: number;       // Période de révolution en secondes
  initialPhase: number; // Phase angulaire de départ en radians
  eccentricity: number; // Variation képlérienne de vitesse
}

const ORBIT_CONFIGS: OrbitConfig[] = [
  { radius: 112, tiltX: 14, tiltY: -8, period: 20, initialPhase: 0, eccentricity: 0.12 },
  { radius: 158, tiltX: -16, tiltY: 14, period: 28, initialPhase: Math.PI / 2, eccentricity: 0.09 },
  { radius: 204, tiltX: 18, tiltY: -16, period: 38, initialPhase: Math.PI, eccentricity: 0.14 },
  { radius: 250, tiltX: -10, tiltY: 12, period: 48, initialPhase: (3 * Math.PI) / 2, eccentricity: 0.07 },
];

// Angles de la caméra gyroscopique globale en plongée
const SCENE_TILT_X = (58 * Math.PI) / 180;
const SCENE_TILT_Z = (-22 * Math.PI) / 180;
const MAX_DEPTH_REF = 250 * Math.sin(SCENE_TILT_X);

/**
 * Calcule la position 3D (x, y, z) d'un nœud dans l'espace gyroscopique.
 */
function calculate3DPoint(
  radius: number,
  angle: number,
  tiltXDeg: number,
  tiltYDeg: number
): [number, number, number] {
  const tiltX = (tiltXDeg * Math.PI) / 180;
  const tiltY = (tiltYDeg * Math.PI) / 180;

  // 1. Cercle de base dans le plan orbital XY
  const x0 = radius * Math.cos(angle);
  const y0 = radius * Math.sin(angle);
  const z0 = 0;

  // 2. Inclinaison propre de l'anneau orbital (X & Y)
  const cosTx = Math.cos(tiltX);
  const sinTx = Math.sin(tiltX);
  const x1 = x0;
  const y1 = y0 * cosTx - z0 * sinTx;
  const z1 = y0 * sinTx + z0 * cosTx;

  const cosTy = Math.cos(tiltY);
  const sinTy = Math.sin(tiltY);
  const x2 = x1 * cosTy + z1 * sinTy;
  const y2 = y1;
  const z2 = -x1 * sinTy + z1 * cosTy;

  // 3. Rotation globale du système autour de Z
  const cosSz = Math.cos(SCENE_TILT_Z);
  const sinSz = Math.sin(SCENE_TILT_Z);
  const x3 = x2 * cosSz - y2 * sinSz;
  const y3 = x2 * sinSz + y2 * cosSz;
  const z3 = z2;

  // 4. Inclinaison de plongée du système autour de X
  const cosSx = Math.cos(SCENE_TILT_X);
  const sinSx = Math.sin(SCENE_TILT_X);
  const x4 = x3;
  const y4 = y3 * cosSx - z3 * sinSx;
  const z4 = y3 * sinSx + z3 * cosSx;

  return [x4, y4, z4];
}

// Précompilation des vecteurs de projection 3D (Élimine 75% des appels trigo et 100% des allocations par frame)
interface CompiledOrbitConfig extends OrbitConfig {
  Ax: number;
  Ay: number;
  Az: number;
  Bx: number;
  By: number;
  Bz: number;
}

const COMPILED_ORBITS: CompiledOrbitConfig[] = ORBIT_CONFIGS.map((cfg) => {
  const [Ax, Ay, Az] = calculate3DPoint(1, 0, cfg.tiltX, cfg.tiltY);
  const [Bx, By, Bz] = calculate3DPoint(1, Math.PI / 2, cfg.tiltX, cfg.tiltY);
  return {
    ...cfg,
    Ax,
    Ay,
    Az,
    Bx,
    By,
    Bz,
  };
});

/**
 * Orbit3DMethod — Système orbital tridimensionnel haute performance avec Hub central et Capsules de Méthode.
 *
 * Design & Ergonomie :
 * - Capsules technologiques haute visibilité avec rétro-éclairage néon, halo volumétrique et pastille saturée à l'état actif.
 * - Dock de contrôle cybernétique ergonomique repensé avec retour tactile et indicateurs LED colorés.
 * - Cœur cybernétique épuré avec lueur thermique et emblème vectoriel Waypoints.
 * - Suppression des éléments superflus pour une lisibilité maximale.
 */
export function Orbit3DMethod({
  nodes,
  activeIndex,
  onSelect,
  centerLabel = "07 — Méthode",
  className,
}: Orbit3DMethodProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const beamPathRef = useRef<SVGPathElement>(null);
  const beamGlowRef = useRef<SVGPathElement>(null);

  // État cinétique des orbites
  const speedsRef = useRef<number[]>([1, 1, 1, 1]);
  const targetSpeedsRef = useRef<number[]>([1, 1, 1, 1]);
  const anglesRef = useRef<number[]>(
    ORBIT_CONFIGS.map((cfg) => cfg.initialPhase)
  );

  // Caches de mutation de styles DOM pour éliminer les écritures superflues
  const zIndexCache = useRef<number[]>([0, 0, 0, 0]);
  const opacityCache = useRef<number[]>([0, 0, 0, 0]);

  const [isClient, setIsClient] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeNode = nodes[activeIndex] ?? nodes[0];

  // Initialisation client
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsClient(true);
      setIsInView(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // IntersectionObserver pour pause douce hors champ écran (0% CPU au scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isClient) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "120px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [isClient]);

  // Page Visibility API : met immédiatement en pause l'animation si l'onglet est masqué
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsInView(false);
      } else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight + 120 && rect.bottom > -120;
        setIsInView(inView);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Ralentissement fluide au survol
  const handleNodeMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
    targetSpeedsRef.current[index] = 0.25; // Décélération confortable
  }, []);

  const handleNodeMouseLeave = useCallback((index: number) => {
    setHoveredIndex(null);
    targetSpeedsRef.current[index] = 1.0; // Reprise vitesse nominale
  }, []);

  // Boucle d'animation GPU continue haute performance
  useEffect(() => {
    if (!isInView) return;

    let animFrameId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const deltaSec = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      let activeNodePx = 0;
      let activeNodePy = 0;
      let hasActiveNode = false;

      for (let idx = 0; idx < COMPILED_ORBITS.length; idx++) {
        const cfg = COMPILED_ORBITS[idx];
        if (!cfg) continue;
        const nodeEl = nodeRefs.current[idx];
        if (!nodeEl) continue;

        // Inertie douce sur la vitesse
        const targetSpeed = targetSpeedsRef.current[idx] ?? 1;
        const currentSpeedVal = speedsRef.current[idx] ?? 1;
        speedsRef.current[idx] = currentSpeedVal + (targetSpeed - currentSpeedVal) * 0.08;
        const currentSpeed = speedsRef.current[idx] ?? 1;

        // Vitesse képlérienne
        const currentAngle = anglesRef.current[idx] ?? 0;
        const keplerFactor = 1.0 + cfg.eccentricity * Math.cos(currentAngle);
        const angularVelocity = ((2 * Math.PI) / cfg.period) * currentSpeed * keplerFactor;

        const nextAngle = (currentAngle + angularVelocity * deltaSec) % (2 * Math.PI);
        anglesRef.current[idx] = nextAngle;

        // Calcul 3D linéaire précompilé ultra-rapide
        const c = Math.cos(nextAngle);
        const s = Math.sin(nextAngle);
        const x = cfg.radius * (cfg.Ax * c + cfg.Bx * s);
        const y = cfg.radius * (cfg.Ay * c + cfg.By * s);
        const z = cfg.radius * (cfg.Az * c + cfg.Bz * s);

        if (idx === activeIndex) {
          activeNodePx = x;
          activeNodePy = y;
          hasActiveNode = true;
        }

        // Indices de profondeur 3D
        const normZ = z / MAX_DEPTH_REF;
        const scale = 1.0 + 0.12 * normZ;
        const opacity = Math.max(0.55, 0.78 + 0.22 * normZ);
        // Le nœud actif a une priorité de plan supérieure pour rester toujours bien visible
        const zIndex = idx === activeIndex ? 40 : (z > 0 ? 30 : 8);

        nodeEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;

        // Cache de mutation zIndex
        if (zIndexCache.current[idx] !== zIndex) {
          zIndexCache.current[idx] = zIndex;
          nodeEl.style.zIndex = String(zIndex);
        }

        // Cache de mutation opacité
        const lastOp = opacityCache.current[idx] ?? 0;
        if (Math.abs(lastOp - opacity) >= 0.015) {
          opacityCache.current[idx] = opacity;
          nodeEl.style.opacity = opacity.toFixed(2);
        }
      }

      // Faisceau d'énergie Hub ➔ Nœud actif (vectoriel matériel sans filtre CPU)
      if (beamPathRef.current && hasActiveNode) {
        const cx = 250;
        const cy = 250;
        const targetX = cx + activeNodePx;
        const targetY = cy + activeNodePy;
        const midX = (cx + targetX) * 0.5 + activeNodePy * 0.12;
        const midY = (cy + targetY) * 0.5 - activeNodePx * 0.12;
        const dStr = `M ${cx} ${cy} Q ${midX.toFixed(1)} ${midY.toFixed(1)}, ${targetX.toFixed(1)} ${targetY.toFixed(1)}`;
        beamPathRef.current.setAttribute("d", dStr);
        if (beamGlowRef.current) {
          beamGlowRef.current.setAttribute("d", dStr);
        }
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [isInView, activeIndex]);

  // Positions statiques initiales (SSR)
  const initialPositions = COMPILED_ORBITS.map((cfg, idx) => {
    const c = Math.cos(cfg.initialPhase);
    const s = Math.sin(cfg.initialPhase);
    const x = cfg.radius * (cfg.Ax * c + cfg.Bx * s);
    const y = cfg.radius * (cfg.Ay * c + cfg.By * s);
    const z = cfg.radius * (cfg.Az * c + cfg.Bz * s);
    const normZ = z / MAX_DEPTH_REF;
    const scale = 1.0 + 0.12 * normZ;
    const opacity = Math.max(0.55, 0.78 + 0.22 * normZ);
    const zIndex = idx === activeIndex ? 40 : (z > 0 ? 30 : 8);
    return { x, y, z, scale, opacity, zIndex };
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[500px] select-none flex items-center justify-center [contain:layout_style]",
        className
      )}
      role="region"
      aria-label={centerLabel}
    >
      {/* 1. Halo d'ambiance et nébuleuse diffuse */}
      <div
        className="pointer-events-none absolute inset-6 rounded-full opacity-40 dark:opacity-30 blur-3xl transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${activeNode.color} 0%, rgba(3, 49, 140, 0.2) 50%, transparent 75%)`,
        }}
        aria-hidden
      />

      {/* 2. Scène 3D avec perspective et préservation tridimensionnelle */}
      <div
        className="relative h-full w-full flex items-center justify-center pointer-events-auto"
        style={{
          perspective: 1200,
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* === A. Pistes orbitales 3D inclinées === */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${SCENE_TILT_X}rad) rotateZ(${SCENE_TILT_Z}rad)`,
          }}
          aria-hidden
        >
          {COMPILED_ORBITS.map((cfg, idx) => {
            const isOrbitActive = idx === activeIndex;
            return (
              <div
                key={idx}
                className={cn(
                  "absolute rounded-full border transition-all duration-700",
                  isOrbitActive
                    ? "border-[#F26D3D]/60 shadow-[0_0_20px_rgba(242,109,61,0.3)]"
                    : "border-black/10 dark:border-white/10"
                )}
                style={{
                  width: cfg.radius * 2,
                  height: cfg.radius * 2,
                  transform: `rotateX(${cfg.tiltX}deg) rotateY(${cfg.tiltY}deg)`,
                  background:
                    idx % 2 === 0
                      ? "radial-gradient(circle, transparent 70%, rgba(3, 49, 140, 0.03) 100%)"
                      : "transparent",
                }}
              >
                {/* Comète lumineuse filant le long de l'orbite — Accélérée GPU sur le compositeur */}
                <div
                  className="absolute inset-0 rounded-full animate-spin pointer-events-none"
                  style={{
                    animationDuration: `${cfg.period}s`,
                    animationTimingFunction: "linear",
                    border: "1.5px solid transparent",
                    borderTopColor: nodes[idx]?.color ?? "#F26D3D",
                    borderRightColor: `${nodes[idx]?.color ?? "#F26D3D"}40`,
                    opacity: isOrbitActive ? 0.85 : 0.25,
                    willChange: "transform",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* === B. Faisceau Laser Énergétique (Hub ➔ Nœud actif) === */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full z-12 overflow-visible"
          viewBox="0 0 500 500"
          aria-hidden
        >
          <defs>
            <linearGradient id="orbit-beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F26D3D" stopOpacity="0.9" />
              <stop offset="60%" stopColor={activeNode.color} stopOpacity="0.85" />
              <stop offset="100%" stopColor={activeNode.color} stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Lueur d'ambiance vectorielle (remplace le filtre feGaussianBlur coûteux) */}
          <path
            ref={beamGlowRef}
            d="M 250 250 Q 300 220, 360 250"
            fill="none"
            stroke={activeNode.color}
            strokeWidth="6"
            opacity="0.28"
            strokeLinecap="round"
          />
          {/* Faisceau central laser avec impulsion animée */}
          <path
            ref={beamPathRef}
            d="M 250 250 Q 300 220, 360 250"
            fill="none"
            stroke="url(#orbit-beam-grad)"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            className="animate-laser-stream"
          />
        </svg>

        {/* === C. Hub Central (Noyau Cybernétique X=0, Y=0, Z=10) === */}
        <div
          className="absolute z-15 flex flex-col items-center justify-center pointer-events-auto cursor-pointer"
          style={{
            transform: "translate3d(0, 0, 10px)",
          }}
          onClick={() => onSelect(0)}
        >
          {/* Ondes sonar concentriques du hub */}
          <span
            className="animate-ping absolute h-24 w-24 rounded-full opacity-20 pointer-events-none"
            style={{ backgroundColor: activeNode.color }}
            aria-hidden
          />
          <span
            className="absolute h-20 w-20 rounded-full opacity-35 blur-md transition-colors duration-500 pointer-events-none"
            style={{ backgroundColor: activeNode.color }}
            aria-hidden
          />

          {/* Cœur central du Hub façon Cyber Core */}
          <div className="relative z-20 flex size-16 md:size-18 items-center justify-center rounded-full border border-black/15 dark:border-white/20 bg-white/90 dark:bg-[#06070B]/90 shadow-xl backdrop-blur-md transition-transform duration-300 hover:scale-105">
            <div className="flex flex-col items-center justify-center text-center">
              <Waypoints className="h-5 w-5 text-[#F26D3D]" aria-hidden />
              <span className="font-mono text-[8px] font-bold text-slate-900 dark:text-slate-100 tracking-wider mt-0.5">
                MÉTHODE
              </span>
            </div>
          </div>
        </div>

        {/* === D. Les 4 Capsules de Méthode en Révolution 3D === */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          role="tablist"
          aria-label="Sélection des phases méthodologiques"
        >
          {nodes.map((node, idx) => {
            const isActive = idx === activeIndex;
            const isHovered = idx === hoveredIndex;
            const init = initialPositions[idx] ?? {
              x: 0,
              y: 0,
              z: 0,
              scale: 1,
              opacity: 1,
              zIndex: 20,
            };
            const Icon = node.icon;

            return (
              <div
                key={node.number}
                data-orbit-node={node.number}
                ref={(el) => {
                  nodeRefs.current[idx] = el;
                }}
                className="absolute flex items-center justify-center pointer-events-auto"
                style={{
                  transform: `translate3d(${init.x.toFixed(1)}px, ${init.y.toFixed(1)}px, ${init.z.toFixed(1)}px) scale(${init.scale.toFixed(3)})`,
                  opacity: init.opacity,
                  zIndex: init.zIndex,
                  willChange: "transform, opacity",
                }}
                onMouseEnter={() => handleNodeMouseEnter(idx)}
                onMouseLeave={() => handleNodeMouseLeave(idx)}
              >
                {/* Capsule Technologique Interactive Haute Visibilité */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${node.number} — ${node.title}`}
                  onClick={() => onSelect(idx)}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2",
                    "border backdrop-blur-xl",
                    isActive
                      ? "px-3.5 py-2 scale-110 shadow-2xl z-40 bg-white/95 dark:bg-[#06070B]/95 text-white"
                      : "px-2.5 py-1.5 hover:scale-105 opacity-85 hover:opacity-100 shadow-md bg-white/80 dark:bg-[#06070B]/80 hover:bg-white dark:hover:bg-[#06070B]",
                    isHovered && !isActive && "scale-105 opacity-100"
                  )}
                  style={{
                    borderColor: isActive ? node.color : "rgba(148, 163, 184, 0.25)",
                    boxShadow: isActive
                      ? `0 0 28px ${node.color}75, 0 0 55px ${node.color}35, inset 0 1px 1px rgba(255,255,255,0.6), inset 0 0 14px ${node.color}30`
                      : "0 4px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Lueur interne dynamique saturée de la capsule active */}
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-full pointer-events-none opacity-30 dark:opacity-40"
                      style={{
                        background: `radial-gradient(circle at 25% 50%, ${node.color} 0%, transparent 80%)`,
                      }}
                      aria-hidden
                    />
                  )}

                  {/* Reflet spéculaire supérieur */}
                  {isActive && (
                    <span
                      className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none"
                      aria-hidden
                    />
                  )}

                  {/* Halo d'activation pulsant externe */}
                  {isActive && (
                    <span
                      className="animate-ping absolute inset-0 rounded-full opacity-35 pointer-events-none"
                      style={{ backgroundColor: node.color }}
                      aria-hidden
                    />
                  )}

                  {/* Pastille circulaire avec icône — Pleine saturation éclatante sur l'active */}
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full transition-transform duration-200",
                      isActive
                        ? "size-8 shadow-md ring-2 ring-offset-1 ring-offset-white dark:ring-offset-black"
                        : "size-7 group-hover:scale-110"
                    )}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${node.color} 0%, color-mix(in srgb, ${node.color} 80%, #000) 100%)`
                        : `${node.color}20`,
                      color: isActive ? "#FFFFFF" : node.color,
                      boxShadow: isActive ? `0 0 16px ${node.color}80` : undefined,
                    }}
                  >
                    <Icon className={isActive ? "h-4 w-4" : "h-3.5 w-3.5"} aria-hidden />
                  </div>

                  {/* Numéro et intitulé de phase */}
                  <div className="flex items-center gap-2 pr-1.5">
                    {/* Badge numérique mono */}
                    <span
                      className={cn(
                        "font-mono font-bold tracking-tight rounded-md px-1.5 py-0.5 transition-colors",
                        isActive
                          ? "text-[10px] text-white shadow-xs"
                          : "text-[10px]"
                      )}
                      style={{
                        backgroundColor: isActive ? node.color : `${node.color}15`,
                        color: isActive ? "#FFFFFF" : node.color,
                      }}
                    >
                      {node.number}
                    </span>

                    {/* Libellé textuel */}
                    <span
                      className={cn(
                        "whitespace-nowrap tracking-tight transition-colors",
                        isActive
                          ? "text-[12px] font-bold text-slate-950 dark:text-white"
                          : "text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                      )}
                    >
                      {node.title}
                    </span>

                    {/* Point LED lumineux d'activation */}
                    {isActive && (
                      <span
                        className="size-1.5 rounded-full animate-pulse shadow-xs"
                        style={{ backgroundColor: node.color, boxShadow: `0 0 6px ${node.color}` }}
                        aria-hidden
                      />
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Dock Cybernétique Ergonomique de sélection sous l'orbite */}
      <div
        role="tablist"
        aria-label="Contrôles d'accès direct aux phases"
        className="absolute -bottom-2 sm:bottom-0 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-2xl border border-black/10 dark:border-white/15 bg-white/95 dark:bg-[#06070B]/95 p-1.5 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/50"
      >
        {nodes.map((node, idx) => {
          const isActive = idx === activeIndex;
          const Icon = node.icon;
          return (
            <button
              key={node.number}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${node.number} — ${node.title}`}
              onClick={() => onSelect(idx)}
              className={cn(
                "group relative flex h-8 items-center gap-2 rounded-xl px-3 font-mono text-[11px] font-bold uppercase transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2",
                isActive
                  ? "shadow-md text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5"
              )}
              style={{
                backgroundColor: isActive
                  ? `color-mix(in srgb, ${node.color} 18%, transparent)`
                  : "transparent",
                border: isActive
                  ? `1px solid ${node.color}`
                  : "1px solid transparent",
                boxShadow: isActive
                  ? `0 0 16px ${node.color}35, inset 0 1px 0 rgba(255,255,255,0.3)`
                  : undefined,
              }}
            >
              {/* Pastille ou puce avec icône */}
              <div
                className={cn(
                  "flex size-5 items-center justify-center rounded-lg transition-transform duration-200",
                  isActive ? "scale-110 shadow-xs" : "group-hover:scale-105"
                )}
                style={{
                  backgroundColor: isActive ? node.color : "rgba(148, 163, 184, 0.15)",
                  color: isActive ? "#FFFFFF" : "inherit",
                }}
              >
                <Icon className="h-3 w-3" aria-hidden />
              </div>

              {/* Numéro de la méthode */}
              <span style={{ color: isActive ? node.color : "inherit" }}>
                {node.number}
              </span>

              {/* Point LED lumineux d'activation */}
              {isActive && (
                <span
                  className="flex h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: node.color }}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
