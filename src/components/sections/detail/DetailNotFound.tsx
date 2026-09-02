export interface DetailNotFoundProps {
  label: string;
  title: string;
  message: string;
}

/**
 * Encart "introuvable" réutilisé par les trois vues de détail.
 */
export function DetailNotFound({ label, title, message }: DetailNotFoundProps) {
  return (
    <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
      <p className="font-mono text-[11px] uppercase tracking-widest text-[#F26D3D] mb-3">{label}</p>
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
