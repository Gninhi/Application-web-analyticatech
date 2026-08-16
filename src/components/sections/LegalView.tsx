"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";
import type { ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { MovingButton } from "@/components/interactive/MovingButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactCta } from "@/components/ui/ContactCta";
import { SectionContainer } from "@/components/ui/SectionContainer";

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
  const { t, locale } = useI18n();
  const { rgpdSections, legalSections } = useAppContent();

  const sections = type === "rgpd" ? rgpdSections : legalSections;
  const Icon = TYPE_META[type].icon;
  const title = type === "rgpd" ? t("legal.rgpd.title") : t("legal.legal.title");
  const subtitle = type === "rgpd" ? t("legal.rgpd.subtitle") : t("legal.legal.subtitle");

  return (
    <div className="pt-28 md:pt-36 pb-20">
      <SectionContainer maxWidth="3xl">
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
        <div className="mb-10">
          <PageHeader icon={Icon} kicker={subtitle} title={title} size="md" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t("legal.lastUpdated")} {new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

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
        <ContactCta
          question={t("legal.contact.question")}
          cta={t("legal.contact.cta")}
          onNavigate={onNavigate}
          size="md"
          glow={false}
          withIcon={false}
          className="mt-10"
          delay={0.4}
        />
      </SectionContainer>
    </div>
  );
}
