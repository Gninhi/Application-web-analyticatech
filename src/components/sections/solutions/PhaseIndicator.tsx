"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";

export interface PhaseIndicatorProps {
  progress: MotionValue<number>;
}

/**
 * Indicateur de phase (lead-in / drift / lead-out)
 */
export function PhaseIndicator({ progress }: PhaseIndicatorProps) {
  const { t } = useI18n();
  const leadIn = useTransform(progress, [0, 0.05], [1, 0.3]);
  const drift = useTransform(progress, [0.04, 0.06, 0.92, 0.94], [0.3, 1, 1, 0.3]);
  const leadOut = useTransform(progress, [0.93, 1], [0.3, 1]);

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 pointer-events-none">
      <motion.span
        style={{ opacity: leadIn }}
        className="font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400"
      >
        {t("solutions.phase.lead")}
      </motion.span>
      <span className="h-px w-4 bg-black/15 dark:bg-white/20" aria-hidden />
      <motion.span
        style={{ opacity: drift }}
        className="font-mono text-[9px] uppercase tracking-widest text-[#F26D3D]"
      >
        {t("solutions.phase.drift")}
      </motion.span>
      <span className="h-px w-4 bg-black/15 dark:bg-white/20" aria-hidden />
      <motion.span
        style={{ opacity: leadOut }}
        className="font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400"
      >
        {t("solutions.phase.release")}
      </motion.span>
    </div>
  );
}
