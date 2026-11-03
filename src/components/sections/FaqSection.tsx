"use client";

import { useI18n } from "@/lib/i18n/provider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { cn } from "@/lib/utils/cn";

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
export interface FaqSectionProps {
  tag?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function FaqSection({
  tag,
  title,
  description,
  className,
}: FaqSectionProps = {}) {
  const { t } = useI18n();
  const items = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: t(`home.faq.q${i + 1}`),
    answer: t(`home.faq.a${i + 1}`),
  }));

  return (
    <section className={cn("relative", className)}>
      <SectionContainer>
        <SectionHeading
          tag={tag ?? t("home.faq.tag")}
          title={title ?? t("home.faq.title")}
          description={description ?? t("home.faq.desc")}
        />

        <FaqAccordion items={items} className="mt-10" />
      </SectionContainer>
    </section>
  );
}