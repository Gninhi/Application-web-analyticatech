"use client";

import { useI18n } from "@/lib/i18n/provider";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { ContactForm } from "./contact/ContactForm";
import { ContactSidePanel } from "./contact/ContactSidePanel";

/**
 * ContactView — Vue Contact & Devis Sécurisée.
 * Découpée de manière modulaire :
 *  - En-tête de page standardisé
 *  - Terminal de contact interactif avec validation Zod & anti-bot (ContactForm)
 *  - Panneau latéral avec canaux de communication & SLA (ContactSidePanel)
 */
export function ContactView() {
  const { t } = useI18n();

  return (
    <div className="relative">
      {/* En-tête */}
      <section className="pt-32 md:pt-40 pb-10">
        <SectionContainer>
          <PageHeader
            kicker={t("contact.kicker")}
            title={t("contact.title1")}
            accent={t("contact.title2")}
            description={t("contact.desc")}
            className="max-w-3xl"
          />
        </SectionContainer>
      </section>

      {/* Contenu principal */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 grid gap-8 lg:grid-cols-5">
          <ContactForm />
          <ContactSidePanel />
        </div>
      </section>
    </div>
  );
}
