import { cn } from "@/lib/utils/cn";

export type InsightMotif = "network" | "flow" | "curves" | "blocks";

/** Motif de couverture selon la catégorie : chaque thème a sa propre image, sans photo ni chiffre. */
export function motifForCategory(key: string, label = ""): InsightMotif {
  const k = `${key} ${label}`.toLowerCase();
  if (/automat|workflow/.test(k)) return "flow";
  if (/data|décision|decision|\bbi\b/.test(k)) return "curves";
  if (/architect/.test(k)) return "blocks";
  return "network";
}

export interface InsightCoverProps {
  categoryKey: string;
  categoryLabel?: string;
  className?: string;
  /** Variante compacte (vignette de liste) : trait un peu plus épais, moins de détails. */
  compact?: boolean;
}

/**
 * Couverture d'article — verre teinté d'accent et motif au trait fin propre à la catégorie :
 * réseau de nœuds (IA), flux (automatisation), courbes sans valeurs (data), blocs empilés (architecture).
 * Purement décorative, statique (aucune animation en boucle), SSR-stable.
 */
export function InsightCover({ categoryKey, categoryLabel, className, compact = false }: InsightCoverProps) {
  const motif = motifForCategory(categoryKey, categoryLabel);
  const stroke = compact ? 1.6 : 1.2;

  return (
    <div
      data-motif={motif}
      className={cn("relative overflow-hidden text-accent-ink", className)}
      style={{
        background:
          "radial-gradient(120% 90% at 85% 10%, color-mix(in srgb, var(--accent-ink) 16%, transparent), transparent 65%), linear-gradient(160deg, color-mix(in srgb, var(--accent-ink) 7%, transparent), transparent 80%)",
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 240 160"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {motif === "network" && (
          <g>
            <g opacity={0.45}>
              <path d="M40 112 L92 64 L150 92 L196 44" />
              <path d="M92 64 L118 28 M150 92 L176 132 M92 64 L64 34 M150 92 L118 128" />
              {!compact && <path d="M196 44 L222 82 M40 112 L22 70" />}
            </g>
            {[
              [40, 112, 5],
              [92, 64, 8],
              [150, 92, 6],
              [196, 44, 9],
              [118, 28, 3.5],
              [176, 132, 3.5],
              [64, 34, 3],
              [118, 128, 3],
            ].map(([cx, cy, r]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="var(--glass-card-bg)" />
            ))}
            <circle cx={196} cy={44} r={16} opacity={0.25} />
          </g>
        )}

        {motif === "flow" && (
          <g>
            <g opacity={0.45}>
              <path d="M18 80 H66 M108 80 C128 80 128 44 150 44 H170 M108 80 C128 80 128 116 150 116 H170" />
              <path d="M58 74 L66 80 L58 86 M162 38 L170 44 L162 50 M162 110 L170 116 L162 122" />
            </g>
            <rect x={66} y={62} width={42} height={36} rx={10} fill="var(--glass-card-bg)" />
            <rect x={170} y={30} width={50} height={28} rx={8} fill="var(--glass-card-bg)" />
            <rect x={170} y={102} width={50} height={28} rx={8} fill="var(--glass-card-bg)" strokeDasharray="4 4" />
            <circle cx={87} cy={80} r={5} />
          </g>
        )}

        {motif === "curves" && (
          <g>
            <g opacity={0.25}>
              {[40, 72, 104, 136].map((y) => (
                <path key={y} d={`M16 ${y} H224`} strokeDasharray="2 6" />
              ))}
            </g>
            <path d="M16 120 C56 116 70 70 104 76 C138 82 150 40 190 38 C206 37 216 30 224 26" />
            <path d="M16 136 C60 132 86 108 118 112 C150 116 176 84 224 80" opacity={0.45} />
            <circle cx={104} cy={76} r={4} fill="var(--glass-card-bg)" />
            <circle cx={190} cy={38} r={5} fill="var(--glass-card-bg)" />
          </g>
        )}

        {motif === "blocks" && (
          <g>
            <rect x={60} y={104} width={120} height={28} rx={7} fill="var(--glass-card-bg)" />
            <rect x={76} y={68} width={88} height={28} rx={7} fill="var(--glass-card-bg)" />
            <rect x={92} y={32} width={56} height={28} rx={7} fill="var(--glass-card-bg)" />
            <g opacity={0.45}>
              <path d="M120 60 V68 M120 96 V104" />
              {!compact && <path d="M28 118 H52 M188 118 H212 M28 82 H68 M172 82 H212" strokeDasharray="3 5" />}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
