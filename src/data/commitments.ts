/**
 * ==============================================================================
 * ANALYTICATECH — SOURCE UNIQUE DE VÉRITÉ DES ENGAGEMENTS ET DÉLAIS
 * ==============================================================================
 * Engagements tenables par un cabinet dirigé par son fondateur, qui répond
 * personnellement à chaque demande :
 * 1. Réponse personnelle (sous 2 jours ouvrés)
 * 2. Premier échange (20 minutes, gratuit)
 * 3. Proposition écrite (sous 5 jours ouvrés après l'échange)
 * 4. Disponibilité (9h30 – 17h30, du lundi au vendredi, heure de Paris)
 *
 * Ces valeurs alimentent la page /contact, les mentions légales, la réponse de
 * l'API de contact et le JSON-LD. Ne jamais écrire un délai ailleurs en dur.
 * ==============================================================================
 */

import type { Locale } from "@/lib/i18n/provider";

export interface CommitmentItem {
  id: string;
  key: "reply" | "firstCall" | "proposal" | "availability";
  labelFr: string;
  labelEn: string;
  valueFr: string;
  valueEn: string;
}

export interface SupportSchedule {
  hoursFr: string;
  hoursEn: string;
  daysFr: string;
  daysEn: string;
  timezoneFr: string;
  timezoneEn: string;
  fullFr: string;
  fullEn: string;
}

export interface CommitmentsConfig {
  /** 1. Réponse personnelle à une demande */
  reply: CommitmentItem;
  /** 2. Premier échange de cadrage */
  firstCall: CommitmentItem;
  /** 3. Proposition écrite après l'échange */
  proposal: CommitmentItem;
  /** 4. Plage de disponibilité */
  availability: CommitmentItem;
  /** Horaires d'ouverture / téléphone */
  schedule: SupportSchedule;
  /** Phrase d'engagement de réponse (mentions légales, formulaire) */
  responseNoticeFr: string;
  responseNoticeEn: string;
  /** Coordonnées directes */
  phone: string;
  email: string;
}

export const SLA_COMMITMENTS: CommitmentsConfig = {
  reply: {
    id: "commit-reply",
    key: "reply",
    labelFr: "Réponse personnelle",
    labelEn: "Personal reply",
    valueFr: "Sous 2 jours ouvrés",
    valueEn: "Within 2 business days",
  },
  firstCall: {
    id: "commit-first-call",
    key: "firstCall",
    labelFr: "Premier échange",
    labelEn: "First call",
    valueFr: "20 minutes, gratuit",
    valueEn: "20 minutes, free",
  },
  proposal: {
    id: "commit-proposal",
    key: "proposal",
    labelFr: "Proposition écrite",
    labelEn: "Written proposal",
    valueFr: "Sous 5 jours ouvrés après l'échange",
    valueEn: "Within 5 business days of the call",
  },
  availability: {
    id: "commit-availability",
    key: "availability",
    labelFr: "Disponibilité",
    labelEn: "Availability",
    valueFr: "9h30 – 17h30, du lundi au vendredi",
    valueEn: "9:30 AM – 5:30 PM, Monday to Friday",
  },
  schedule: {
    hoursFr: "9h30 – 17h30",
    hoursEn: "9:30 AM – 5:30 PM",
    daysFr: "Du lundi au vendredi",
    daysEn: "Monday to Friday",
    timezoneFr: "heure de Paris",
    timezoneEn: "Paris time",
    fullFr: "Du lundi au vendredi, 9h30 – 17h30 (heure de Paris)",
    fullEn: "Monday to Friday, 9:30 AM – 5:30 PM (Paris time)",
  },
  responseNoticeFr: "Réponse personnelle du fondateur sous 2 jours ouvrés",
  responseNoticeEn: "Personal reply from the founder within 2 business days",
  phone: "+33 7 68 61 13 10",
  email: "contact@analyticatech.fr",
};

export interface DisplayCommitmentItem {
  id: string;
  label: string;
  value: string;
  key: CommitmentItem["key"];
}

/**
 * Retourne la liste ordonnée des engagements pour la vue Contact.
 */
export function getSlaList(locale: Locale = "fr"): DisplayCommitmentItem[] {
  const isEn = locale === "en";
  const { reply, firstCall, proposal, availability } = SLA_COMMITMENTS;
  return [reply, firstCall, proposal, availability].map((item) => ({
    id: item.id,
    label: isEn ? item.labelEn : item.labelFr,
    value: isEn ? item.valueEn : item.valueFr,
    key: item.key,
  }));
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
