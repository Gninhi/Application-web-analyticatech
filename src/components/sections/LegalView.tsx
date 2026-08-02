"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";
import type { ViewKey } from "@/lib/i18n/data-fr";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { MovingButton } from "@/components/interactive/MovingButton";

interface LegalViewProps {
  type: "rgpd" | "legal";
  onNavigate: (view: ViewKey) => void;
}

const TYPE_META = {
  rgpd: { icon: ShieldCheck },
  legal: { icon: FileText },
} as const;

/**
 * LegalView — vue légale réutilisable (RGPD ou Mentions légales).
 * Contenu structuré en sections, design premium cohérent avec le site.
 */
export function LegalView({ type, onNavigate }: LegalViewProps) {
  const { t } = useI18n();
  const { rgpdSections, legalSections } = useAppContent();

  const sections = type === "rgpd" ? rgpdSections : legalSections;
  const Icon = TYPE_META[type].icon;
  const title = type === "rgpd" ? t("legal.rgpd.title") : t("legal.legal.title");
  const subtitle = type === "rgpd" ? t("legal.rgpd.subtitle") : t("legal.legal.subtitle");

  return (
    <div className="pt-28 md:pt-36 pb-20">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        {/* Retour */}
        <MovingButton
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("home")}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("legal.back")}
        </MovingButton>

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#F26D3D]/40 bg-[#F26D3D]/10">
              <Icon className="h-6 w-6 text-[#F26D3D]" aria-hidden />
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D]">
                {subtitle}
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                {title}
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass-card rounded-2xl p-6 md:p-8"
            >
              <h2 className="font-display text-lg md:text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                {section.heading}
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </motion.section>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 glass-card rounded-2xl p-6 md:p-8 text-center"
        >
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            {t("legal.contact.question")}
          </p>
          <MovingButton
            variant="primary"
            size="md"
            onClick={() => onNavigate("contact")}
          >
            {t("legal.contact.cta")}
          </MovingButton>
        </motion.div>
      </div>
    </div>
  );
}
