/**
 * ==============================================================================
 * ⏱️ ANALYTICATECH — SOURCE UNIQUE DE VÉRITÉ DES ENGAGEMENTS ET DÉLAIS (SLA)
 * ==============================================================================
 * Ce fichier centralise l'ensemble des engagements de réactivité et plages horaires :
 * 1. Premier accusé de réception (< 2h ouvrées)
 * 2. Réponse détaillée d'un architecte (< 24h ouvrées)
 * 3. Proposition d'atelier de cadrage (< 5 jours ouvrés)
 * 4. Plage d'ouverture et de support téléphonique (9h30 - 17h30 CET, lun-ven)
 *
 * Ces valeurs alimentent directement et de manière synchronisée :
 * - La page /contact (Volet latéral « Engagements de réponse » & texte descriptif)
 * - La page /mentions-legales (Section 4 « Contact » — email et téléphone)
 * - Les schémas structurés JSON-LD (FAQPage, Organization)
 * ==============================================================================
 */

import type { Locale } from "@/lib/i18n/provider";

export interface SlaItem {
  id: string;
  key: "ack" | "architect" | "workshop" | "availability";
  labelFr: string;
  labelEn: string;
  valueFr: string;
  valueEn: string;
}

export interface SupportSchedule {
  hoursFr: string; // "9h30 - 17h30"
  hoursEn: string; // "9:30 AM - 5:30 PM"
  daysFr: string; // "Du lundi au vendredi"
  daysEn: string; // "Monday to Friday"
  timezone: string; // "CET"
  fullFr: string; // "Du lundi au vendredi, 9h30 - 17h30 (CET)"
  fullEn: string; // "Monday to Friday, 9:30 AM - 5:30 PM (CET)"
}

export interface SlaCommitmentsConfig {
  /** 1. Accusé de réception initial */
  ack: SlaItem;
  /** 2. Réponse technique par un architecte solution */
  architect: SlaItem;
  /** 3. Proposition d'un atelier de cadrage */
  workshop: SlaItem;
  /** 4. Plage de disponibilité standard */
  availability: SlaItem;
  /** Horaires d'ouverture / support téléphonique */
  schedule: SupportSchedule;
  /** Engagement de réponse synthétique pour les mentions légales et le formulaire */
  responseNoticeFr: string;
  responseNoticeEn: string;
  /** Coordonnées directes */
  phone: string;
  email: string;
}

export const SLA_COMMITMENTS: SlaCommitmentsConfig = {
  ack: {
    id: "sla-ack",
    key: "ack",
    labelFr: "Premier accusé de réception",
    labelEn: "First Acknowledgment",
    valueFr: "< 2h ouvrées",
    valueEn: "< 2 business hours",
  },
  architect: {
    id: "sla-architect",
    key: "architect",
    labelFr: "Réponse d'un architecte",
    labelEn: "Senior Architect Response",
    valueFr: "< 24h ouvrées",
    valueEn: "< 24 business hours",
  },
  workshop: {
    id: "sla-workshop",
    key: "workshop",
    labelFr: "Atelier de cadrage proposé",
    labelEn: "Scoping Workshop Proposed",
    valueFr: "< 5 jours",
    valueEn: "< 5 business days",
  },
  availability: {
    id: "sla-availability",
    key: "availability",
    labelFr: "Plage de disponibilité",
    labelEn: "Operating Hours & Support",
    valueFr: "9h30 - 17h30 (lun-ven)",
    valueEn: "9:30 AM - 5:30 PM (Mon-Fri)",
  },
  schedule: {
    hoursFr: "9h30 - 17h30",
    hoursEn: "9:30 AM - 5:30 PM",
    daysFr: "Du lundi au vendredi",
    daysEn: "Monday to Friday",
    timezone: "CET",
    fullFr: "Du lundi au vendredi, 9h30 - 17h30 (CET)",
    fullEn: "Monday to Friday, 9:30 AM - 5:30 PM (CET)",
  },
  responseNoticeFr: "Réponse sous 24h ouvrées (accusé sous 2h)",
  responseNoticeEn: "Response within 24 business hours (acknowledgment within 2h)",
  phone: "+33 7 68 61 13 10",
  email: "contact@analyticatech.fr",
};

export interface DisplaySlaItem {
  id: string;
  label: string;
  value: string;
  key: SlaItem["key"];
}

/**
 * Retourne la liste ordonnée des engagements de réponse pour la vue Contact.
 */
export function getSlaList(locale: Locale = "fr"): DisplaySlaItem[] {
  const isEn = locale === "en";
  return [
    {
      id: SLA_COMMITMENTS.ack.id,
      label: isEn ? SLA_COMMITMENTS.ack.labelEn : SLA_COMMITMENTS.ack.labelFr,
      value: isEn ? SLA_COMMITMENTS.ack.valueEn : SLA_COMMITMENTS.ack.valueFr,
      key: SLA_COMMITMENTS.ack.key,
    },
    {
      id: SLA_COMMITMENTS.architect.id,
      label: isEn ? SLA_COMMITMENTS.architect.labelEn : SLA_COMMITMENTS.architect.labelFr,
      value: isEn ? SLA_COMMITMENTS.architect.valueEn : SLA_COMMITMENTS.architect.valueFr,
      key: SLA_COMMITMENTS.architect.key,
    },
    {
      id: SLA_COMMITMENTS.workshop.id,
      label: isEn ? SLA_COMMITMENTS.workshop.labelEn : SLA_COMMITMENTS.workshop.labelFr,
      value: isEn ? SLA_COMMITMENTS.workshop.valueEn : SLA_COMMITMENTS.workshop.valueFr,
      key: SLA_COMMITMENTS.workshop.key,
    },
    {
      id: SLA_COMMITMENTS.availability.id,
      label: isEn ? SLA_COMMITMENTS.availability.labelEn : SLA_COMMITMENTS.availability.labelFr,
      value: isEn ? SLA_COMMITMENTS.availability.valueEn : SLA_COMMITMENTS.availability.valueFr,
      key: SLA_COMMITMENTS.availability.key,
    },
  ];
}

/**
 * Retourne la phrase de disponibilité téléphonique formatée selon la locale.
 */
export function getSupportScheduleNotice(locale: Locale = "fr"): string {
  return locale === "en" ? SLA_COMMITMENTS.schedule.fullEn : SLA_COMMITMENTS.schedule.fullFr;
}

/**
 * Retourne la phrase d'engagement de réponse par email formatée selon la locale.
 */
export function getResponseNotice(locale: Locale = "fr"): string {
  return locale === "en" ? SLA_COMMITMENTS.responseNoticeEn : SLA_COMMITMENTS.responseNoticeFr;
}
