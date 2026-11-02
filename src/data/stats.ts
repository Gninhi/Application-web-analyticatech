/**
 * ==============================================================================
 * ANALYTICATECH — REPÈRES VÉRIFIABLES (source unique)
 * ==============================================================================
 * La charte impose de n'afficher que des chiffres et références réels et
 * vérifiables. Les anciennes statistiques (missions, coûts réduits, uptime,
 * satisfaction) n'étaient pas démontrables : elles ont été retirées.
 *
 * Ce fichier ne contient plus que des engagements et des faits contrôlables
 * par un prospect dès le premier échange. Pour ajouter un vrai chiffre plus
 * tard (ex. nombre de missions livrées), l'ajouter ici avec sa source.
 * ==============================================================================
 */

import type { Locale } from "@/types/content";

export interface KeyFact {
  /** Identifiant stable */
  key: "first_call" | "single_contact" | "compliance" | "locations";
  /** Valeur courte affichée en grand */
  valueFr: string;
  valueEn: string;
  /** Libellé explicatif */
  labelFr: string;
  labelEn: string;
}

export const KEY_FACTS: KeyFact[] = [
  {
    key: "first_call",
    valueFr: "20 min",
    valueEn: "20 min",
    labelFr: "Premier échange gratuit pour cadrer votre besoin",
    labelEn: "Free first call to scope your needs",
  },
  {
    key: "single_contact",
    valueFr: "1",
    valueEn: "1",
    labelFr: "Interlocuteur unique : le fondateur, du cadrage à la production",
    labelEn: "Single point of contact: the founder, from scoping to production",
  },
  {
    key: "compliance",
    valueFr: "AI Act",
    valueEn: "AI Act",
    labelFr: "Le règlement européen sur l'IA et le RGPD pris en compte dès la conception",
    labelEn: "The EU AI Act and GDPR taken into account from the design stage",
  },
  {
    key: "locations",
    valueFr: "France",
    valueEn: "France",
    labelFr: "Siège à Paris, interventions partout en France, à distance ou sur site",
    labelEn: "Head office in Paris, working across France, remotely or on site",
  },
];

/** Repères formatés pour l'affichage ({ v: valeur, l: libellé }). */
export function getKeyStats(locale: Locale = "fr") {
  const en = locale === "en";
  return KEY_FACTS.map((f) => ({
    key: f.key,
    v: en ? f.valueEn : f.valueFr,
    l: en ? f.labelEn : f.labelFr,
  }));
}
