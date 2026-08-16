"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  tag: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
}

/**
 * SectionHeading — en-tête de section unifié (tag mono orange + titre display + description).
 * Évite la duplication de markup dans chaque vue.
 */
export function SectionHeading({
  tag,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignClass =
    align === "center"
      ? "text-center mx-auto"
      : align === "right"
        ? "text-right ml-auto"
        : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`max-w-3xl ${alignClass}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-3 font-bold">
        {tag}
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
          {description}
        </p>
      )}
    </motion.div>
  );
}