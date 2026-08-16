"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { ActivityLogDTO } from "@/types/content";

interface ActivityFeedProps {
  logs: ActivityLogDTO[];
  /** Nombre max de lignes affichées. */
  limit?: number;
  className?: string;
}

/** Routes de couleur selon le niveau de log (mode clair/sombre). */
const LEVEL_LABEL: Record<ActivityLogDTO["level"], string> = {
  info: "INFO",
  ok: "OK",
  warn: "WARN",
};

const LEVEL_DOT: Record<ActivityLogDTO["level"], string> = {
  ok: "bg-emerald-500",
  info: "bg-sky-400",
  warn: "bg-amber-400",
};

const LEVEL_TEXT: Record<ActivityLogDTO["level"], string> = {
  ok: "text-emerald-600 dark:text-emerald-400",
  info: "text-sky-600 dark:text-sky-400",
  warn: "text-amber-600 dark:text-amber-500",
};

/**
 * ActivityFeed — console "terminal" qui révèle les logs d'activité en cascade.
 *
 * - Lignes mono espacées, dots de niveau, horodatage.
 * - Scanlines CSS + curseur clignotant (blink-cursor) en fin de flux.
 * - Animation par line (stagger), limite haute configurable.
 */
export function ActivityFeed({ logs, limit = 6, className }: ActivityFeedProps) {
  const items = logs.slice(0, limit);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10",
        "bg-slate-100/80 dark:bg-black/40 backdrop-blur-xl scanlines",
        className
      )}
    >
      {/* Rangée de la fenêtre type "terminal" */}
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#F26D3D]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          activity.log
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#F26D3D]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F26D3D] animate-pulse" aria-hidden />
          live
        </span>
      </div>

      <div className="flex flex-col gap-2.5 px-4 py-4 font-mono text-[11px] leading-relaxed">
        {items.map((entry, i) => (
          <motion.div
            key={entry.id || `${entry.time}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="flex items-baseline gap-2"
          >
            <span className="shrink-0 text-slate-600 dark:text-slate-400 tabular-nums">
              {entry.time}
            </span>
            <span
              className={cn("h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full", LEVEL_DOT[entry.level])}
              aria-hidden
            />
            <span className="shrink-0 font-bold text-[9px] tracking-widest text-slate-600 dark:text-slate-400">
              [{LEVEL_LABEL[entry.level]}]
            </span>
            <span className={cn("break-words", LEVEL_TEXT[entry.level])}>{entry.event}</span>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: items.length * 0.08 }}
          className="mt-1 text-slate-500 dark:text-slate-400 tabular-nums"
          aria-hidden
        >
          <span className="text-[#F26D3D] font-bold">▸</span> tail -f data/stream.log
          <span className="blink-cursor text-[#F26D3D]" />
        </motion.div>
      </div>
    </div>
  );
}