"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";
import type { ViewKey } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { SnakeButton } from "@/components/SnakeButton";
import { CONTACT_INFO, SITE_CONFIG } from "@/lib/constants";

interface LegalViewProps {
  type: "rgpd" | "legal";
  onNavigate: (view: ViewKey) => void;
}

const LEGAL_CONTENT = {
  rgpd: {
    icon: ShieldCheck,
    title: "Politique de Confidentialité",
    subtitle: "RGPD — Protection des données personnelles",
    sections: [
      {
        h: "1. Responsable du traitement",
        p: `Le responsable du traitement des données personnelles est ${SITE_CONFIG.name}, ${CONTACT_INFO.address}. Pour toute question relative à vos données, contactez-nous à ${CONTACT_INFO.email}.`,
      },
      {
        h: "2. Données collectées",
        p: "Nous collectons uniquement les données nécessaires au traitement de votre demande de contact : nom, prénom, email professionnel, entreprise, sujet et message. Aucune donnée sensible n'est collectée.",
      },
      {
        h: "3. Finalité du traitement",
        p: "Vos données sont utilisées uniquement pour répondre à votre demande de contact et vous proposer nos services. Aucune utilisation commerciale tierce n'est faite.",
      },
      {
        h: "4. Base légale",
        p: "Le traitement est fondé sur votre consentement (Article 6(1)(a) du RGPD), exprimé lors de la soumission du formulaire de contact.",
      },
      {
        h: "5. Durée de conservation",
        p: "Vos données sont conservées 90 jours après votre dernière interaction, puis supprimées définitivement. Si une relation contractuelle s'établit, les données sont conservées pour la durée de la relation + 5 ans (obligations légales).",
      },
      {
        h: "6. Destinataires",
        p: "Vos données sont accessibles uniquement aux architectes Solution d'Analyticatech. Aucune revente, aucun partage avec des tiers.",
      },
      {
        h: "7. Sécurité",
        p: "Toutes les transmissions sont chiffrées (TLS 1.3). Les données au repos sont chiffrées (AES-256). Notre infrastructure est conforme ISO 27001 et SecNumCloud.",
      },
      {
        h: "8. Vos droits",
        p: "Conformément au RGPD, vous disposez des droits suivants : accès, rectification, effacement, limitation, portabilité, opposition. Pour exercer ces droits, écrivez à " + CONTACT_INFO.email + ". Vous pouvez également déposer une réclamation auprès de la CNIL.",
      },
      {
        h: "9. Cookies",
        p: "Nous utilisons uniquement des cookies essentiels au fonctionnement du site (sécurité CSRF, session). Aucun cookie de tracking ou publicitaire sans votre consentement explicite.",
      },
    ],
  },
  legal: {
    icon: FileText,
    title: "Mentions Légales",
    subtitle: "Informations légales et éditeur du site",
    sections: [
      {
        h: "1. Éditeur du site",
        p: `${SITE_CONFIG.name}\n${CONTACT_INFO.address}\nEmail : ${CONTACT_INFO.email}\nTéléphone : ${CONTACT_INFO.phone}`,
      },
      {
        h: "2. Directeur de la publication",
        p: `Le directeur de la publication est le représentant légal de ${SITE_CONFIG.name}.`,
      },
      {
        h: "3. Hébergement",
        p: "Le site est hébergé sur une infrastructure cloud conforme SecNumCloud, située en Union Européenne. Les données ne quittent jamais le territoire européen.",
      },
      {
        h: "4. Propriété intellectuelle",
        p: `L'ensemble des contenus présents sur ce site (textes, logos, images, design) est la propriété exclusive de ${SITE_CONFIG.name}, sauf mention contraire. Toute reproduction, représentation, modification, publication, adaptation, totale ou partielle, des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.`,
      },
      {
        h: "5. Responsabilité",
        p: `${SITE_CONFIG.name} s'efforce de fournir des informations exactes et à jour. Cependant, ${SITE_CONFIG.name} ne pourra être tenu responsable des erreurs, d'une absence de disponibilité des fonctionnalités, ou de la présence de virus sur son site.`,
      },
      {
        h: "6. Liens hypertextes",
        p: "Le site peut contenir des liens vers d'autres sites. Analyticatech n'a pas la possibilité de vérifier le contenu de ces sites et n'assumera aucune responsabilité de ce fait.",
      },
      {
        h: "7. Droit applicable",
        p: "Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.",
      },
    ],
  },
} as const;

/**
 * LegalView — vue légale réutilisable (RGPD ou Mentions légales).
 * Contenu structuré en sections, design premium cohérent avec le site.
 */
export function LegalView({ type, onNavigate }: LegalViewProps) {
  const { t } = useI18n();
  const content = LEGAL_CONTENT[type];
  const Icon = content.icon;
  const title = type === "rgpd" ? t("legal.rgpd.title") : t("legal.legal.title");
  const subtitle = type === "rgpd" ? t("legal.rgpd.subtitle") : t("legal.legal.subtitle");

  return (
    <div className="pt-28 md:pt-36 pb-20">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        {/* Retour */}
        <SnakeButton
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("home")}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("legal.back")}
        </SnakeButton>

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
          {content.sections.map((section, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass-card rounded-2xl p-6 md:p-8"
            >
              <h2 className="font-display text-lg md:text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                {section.h}
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {section.p}
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
          <SnakeButton
            variant="primary"
            size="md"
            onClick={() => onNavigate("contact")}
          >
            {t("legal.contact.cta")}
          </SnakeButton>
        </motion.div>
      </div>
    </div>
  );
}
