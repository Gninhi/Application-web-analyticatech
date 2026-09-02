export interface CategoryPillProps {
  accent: string;
  label: string;
}

/**
 * Pastille catégorie — pill glass avec glyphe losange accent
 */
export function CategoryPill({ accent, label }: CategoryPillProps) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] backdrop-blur-md"
      style={{
        borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
        background: `color-mix(in srgb, ${accent} 12%, transparent)`,
      }}
    >
      <span className="h-1 w-1 rotate-45" style={{ background: accent }} aria-hidden />
      <span style={{ color: accent }}>{label}</span>
    </span>
  );
}
