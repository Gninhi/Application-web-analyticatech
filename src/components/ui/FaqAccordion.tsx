"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  /** Préfixe des identifiants ARIA (unique par page). */
  idPrefix?: string;
  /** Index ouvert au départ (défaut : le premier ; `null` : tout fermé). */
  defaultOpen?: number | null;
  className?: string;
}

/**
 * FaqAccordion — accordéon de questions partagé (accueil, contact, fiches service).
 *
 * Rangs numérotés, un seul panneau ouvert à la fois, icône « + » qui pivote,
 * déploiement animé en hauteur. Accessible : bouton dans un titre, aria-expanded,
 * aria-controls et panneau role="region" relié à son bouton.
 */
export function FaqAccordion({ items, idPrefix = "faq", defaultOpen = 0, className }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
<div className={cn("rounded-3xl glass-card p-4 md:p-8", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="border-b border-black/10 dark:border-white/10 last:border-b-0"
          >
            <h3>
              <button
                id={`${idPrefix}-trigger-${i}`}
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-panel-${i}`}
                className="group flex w-full items-center gap-4 md:gap-6 rounded-xl py-5 px-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span
                  className={cn(
                    "font-mono text-xs font-semibold transition-colors",
                    isOpen
                      ? "text-accent-ink"
                      : "text-slate-600 dark:text-slate-400 group-hover:text-accent-ink"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className={cn(
                    "flex-1 font-display text-base md:text-lg font-bold tracking-tight transition-colors",
                    isOpen
                      ? "text-accent-ink"
                      : "text-slate-900 dark:text-slate-50 group-hover:text-accent-ink"
                  )}
                >
                  {item.question}
                </span>

                <m.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isOpen
                      ? "border-[#F26D3D]/40 bg-[#F26D3D]/10 text-accent-ink"
                      : "border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 group-hover:border-[#F26D3D]/40 group-hover:text-accent-ink"
                  )}
                  aria-hidden
                >
                  <Plus className="h-4 w-4" />
                </m.span>
              </button>
            </h3>

            <m.div
              id={`${idPrefix}-panel-${i}`}
              role="region"
              aria-labelledby={`${idPrefix}-trigger-${i}`}
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{ duration: 0.32, ease: EASE }}
              className="overflow-hidden"
            >
              <p className="max-w-3xl pb-6 pl-11 md:pl-16 pr-2 text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-400">
                {item.answer}
              </p>
            </m.div>
          </div>
        );
      })}
    </div>
  );
}
