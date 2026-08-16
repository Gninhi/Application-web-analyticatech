"use client";

import { useId } from "react";
import { cn } from "@/lib/utils/cn";

interface SparklineProps {
  /** Série de valeurs à tracer (min 2 points). */
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  className?: string;
  /** Texte alternatif accessible. */
  label?: string;
}

/**
 * Sparkline — micro-graphique SVG en courbe, sans dépendance chart.
 *
 * Utilisé dans les cartes métriques et le tableau de bord "Data Console".
 * - Normalise les valeurs sur le viewBox (gère les séries plates).
 * - Zone dégradée sous la courbe (colour brand).
 * - `<vector-effect="non-scaling-stroke">` pour une épaisseur stable.
 */
export function Sparkline({
  data,
  width = 132,
  height = 40,
  stroke = "#F26D3D",
  fill = "#F26D3D",
  strokeWidth = 2,
  className,
  label = "Évolution",
}: SparklineProps) {
  const gradientId = useId();

  if (!data || data.length < 2) return null;

  const pad = 3;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = (width - pad * 2) / (data.length - 1);

  const points = data.map((d, i) => ({
    x: pad + i * stepX,
    y: height - pad - ((d - min) / range) * (height - pad * 2),
  }));

  const line = points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  const areaPath = `M ${points[0].x} ${height - pad} L ${points
    .map((p) => `${p.x} ${p.y}`)
    .join(" L ")} L ${points[points.length - 1].x} ${height - pad} Z`;
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("block w-full", className)}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.28" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={last.x}
        cy={last.y}
        r={2.5}
        fill={stroke}
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={0.75}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}