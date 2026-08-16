"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { cn } from "@/lib/utils/cn";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FAQ_COUNT = 5;

/**
 * FaqSection — accordéon FAQ inspiré des composants "accordion-service"
 * du marketplace Framer.
 *
 * Style : rangs numérotés (mono), séparateurs fins, verre liquide.
 * Micro-interactions : numéro/question qui passent à l'orange au survol,
 * icône "+" qui pivote de 45° à l'ouverture, déploiement animé en hauteur.
 * Un seul panneau ouvert à la fois (comportement "service").
 */
export function FaqSection() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  const items = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    q: t(`home.faq.q${i + 1}`),
    a: t(`home.faq.a${i + 1}`),
  }));

  return (
    <section className="relative">
      <SectionContainer>
        <SectionHeading
          tag={t("home.faq.tag")}
          title={t("home.faq.title")}
          description={t("home.faq.desc")}
        />

        <div className="mt-10 rounded-3xl glass-card p-4 md:p-8">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="border-b border-black/10 dark:border-white/10 last:border-b-0"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="group flex w-full items-center gap-4 md:gap-6 rounded-xl py-5 px-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <span
                      className={cn(
                        "font-mono text-xs font-bold transition-colors",
                        isOpen
                          ? "text-[#F26D3D]"
                          : "text-slate-500 dark:text-slate-400 group-hover:text-[#F26D3D]"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={cn(
                        "flex-1 font-display text-base md:text-lg font-bold tracking-tight transition-colors",
                        isOpen
                          ? "text-[#F26D3D]"
                          : "text-slate-900 dark:text-slate-50 group-hover:text-[#F26D3D]"
                      )}
                    >
                      {item.q}
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                        isOpen
                          ? "border-[#F26D3D]/40 bg-[#F26D3D]/10 text-[#F26D3D]"
                          : "border-black/10 dark:border-white/10 text-slate-500 dark:text-slate-400 group-hover:border-[#F26D3D]/40 group-hover:text-[#F26D3D]"
                      )}
                      aria-hidden
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={`faq-panel-${i}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-3xl pb-6 pl-11 md:pl-16 pr-2 text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-400">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
}