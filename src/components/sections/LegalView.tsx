"use client";

import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";
import type { ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { Button } from "@/components/ui/button";
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("home")}
          icon={<ArrowLeft className="h-4 w-4" aria-hidden />}
          className="mb-8"
        >
          {t("legal.back")}
        </Button>

        {/* En-tête */}
        <div className="mb-10">
          <PageHeader icon={Icon} kicker={subtitle} title={title} size="md" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t("legal.lastUpdated")} {new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.id}
              className="glass-card rounded-2xl p-6 md:p-8"
            >
              <h2 className="font-display text-lg md:text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                {section.heading}
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </section>
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
