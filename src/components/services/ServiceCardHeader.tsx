"use client";

interface ServiceCardHeaderProps {
  tagline: string;
  badge?: string;
  title: string;
  promise: string;
  accentColor?: string;
}

/**
 * ServiceCardHeader — éditorial bento : capsule meta + titre + promesse.
 * Le numéro de service et l'icône animée sont rendus en colonnes latérales
 * par ServiceCard (structure « flows » : id | contenu | icône).
 */
export function ServiceCardHeader({
  tagline,
  badge,
  title,
  promise,
  accentColor = "#F26D3D",
}: ServiceCardHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      {/* 1. Capsule meta façon bento + badge d'impact */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] font-bold backdrop-blur-sm"
          style={{
            borderColor: "var(--glass-card-border)",
            background: "var(--glass-card-bg)",
            color: accentColor,
          }}
        >
          {tagline}
        </span>

        {badge && (
          <span
            className="inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider font-bold"
            style={{
              borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`,
              background: `color-mix(in srgb, ${accentColor} 14%, transparent)`,
              color: accentColor,
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* 2. Titre orienté valeur */}
      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        {title}
      </h3>

      {/* 3. Promesse client claire */}
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
        {promise}
      </p>
    </header>
  );
}
