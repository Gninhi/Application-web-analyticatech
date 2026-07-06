"use client";

import { motion, useInView } from "framer-motion";
import { useRef, Fragment } from "react";
import { cn } from "@/lib/utils";

interface PixelRevealTitleProps {
  text: string;
  as?: "h1" | "h2" | "div" | "span";
  /** Classes appliquées au conteneur (typo, couleur). */
  className?: string;
  /** Classes appliquées à chaque mot (ex: text-gradient-accent). */
  wordClassName?: string;
  /** Classes du bloc pixel (couleur unie premium). Défaut: orange brand. */
  blockClassName?: string;
  /** Délai entre chaque mot (s). */
  stagger?: number;
  /** Délai initial (s). */
  delay?: number;
}

/**
 * PixelRevealTitle — titre premium avec effet d'apparition "bloc de pixel".
 *
 * Chaque mot est couvert par un bloc de couleur unie qui se rétracte
 * (scaleY 1 → 0, origin top) pour révéler le mot, qui glisse simultanément
 * du bas vers sa position (y 115% → 0). Le résultat est une entrée
 * cinématographique type Awwwards, mot après mot.
 */
export function PixelRevealTitle({
  text,
  as = "h1",
  className,
  wordClassName,
  blockClassName = "bg-[#F26D3D]",
  stagger = 0.09,
  delay = 0.1,
}: PixelRevealTitleProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const words = text.split(" ");
  const Tag = as;

  return (
    <Tag ref={ref} className={cn(className)} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            className="relative inline-block overflow-hidden align-bottom"
            style={{ paddingBottom: "0.2em", marginBottom: "-0.2em" }}
          >
            <motion.span
              className={cn("inline-block", wordClassName)}
              initial={{ y: "115%" }}
              animate={inView ? { y: 0 } : { y: "115%" }}
              transition={{
                duration: 0.75,
                delay: delay + i * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
            {/* Bloc pixel couleur unie qui se rétracte depuis le haut */}
            <motion.span
              aria-hidden
              className={cn("absolute inset-0 z-10", blockClassName)}
              initial={{ scaleY: 1 }}
              animate={inView ? { scaleY: 0 } : { scaleY: 1 }}
              transition={{
                duration: 0.5,
                delay: delay + i * stagger + 0.2,
                ease: [0.76, 0, 0.24, 1],
              }}
              style={{ transformOrigin: "top" }}
            />
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
