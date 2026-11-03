"use client";

interface ServiceCardMetaProps {
  label: string;
  technologies: string[];
}

/**
 * ServiceCardMeta — outils du service sur une ligne de texte (« Outils · A · B · C »),
 * plutôt qu'une série de pastilles : même information, beaucoup moins de place.
 */
export function ServiceCardMeta({ label, technologies }: ServiceCardMetaProps) {
  if (technologies.length === 0) return null;
  return (
    <p className="text-[13px] leading-5 text-slate-600 dark:text-[#B6C2D6]">
      <span className="font-semibold text-slate-900 dark:text-slate-100">{label} · </span>
      {technologies.join(" · ")}
    </p>
  );
}
