"use client";

interface ServiceCardHeaderProps {
  tagline: string;
  title: string;
  promise: string;
}

/**
 * ServiceCardHeader — accroche (phrase en couleur d'accent, casse normale),
 * titre orienté valeur et description du service, limitée à trois lignes.
 */
export function ServiceCardHeader({ tagline, title, promise }: ServiceCardHeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      <p className="text-sm font-semibold leading-snug text-accent-ink first-letter:uppercase">{tagline}</p>
      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">{promise}</p>
    </header>
  );
}
