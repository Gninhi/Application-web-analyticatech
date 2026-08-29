"use client";

interface ServiceCardMetaProps {
  technologies: string[];
}

/**
 * ServiceCardMeta — stack technologique en pills glass compactes.
 * Les métriques sont rendues par ServiceCard dans le « stat strip »
 * bento (séparateur dashed + label/valeur) en pied de carte.
 */
export function ServiceCardMeta({ technologies }: ServiceCardMetaProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {technologies.map((tech) => (
        <span
          key={tech}
          className="rounded-md border px-2 py-1 font-mono text-[10px] text-slate-700 dark:text-slate-200 font-medium transition-colors"
          style={{
            borderColor: "var(--glass-card-border)",
            background: "var(--glass-card-bg)",
          }}
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
