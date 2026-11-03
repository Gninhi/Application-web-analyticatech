import type { Locale } from "@/types/content";

import commonFr from "@/locales/fr/common.json";
import navFr from "@/locales/fr/nav.json";
import homeFr from "@/locales/fr/home.json";
import servicesFr from "@/locales/fr/services.json";
import servicesDetailFr from "@/locales/fr/services-detail.json";
import solutionsFr from "@/locales/fr/solutions.json";
import insightsFr from "@/locales/fr/insights.json";
import contactFr from "@/locales/fr/contact.json";
import aboutFr from "@/locales/fr/about.json";
import legalFr from "@/locales/fr/legal.json";
import footerFr from "@/locales/fr/footer.json";

import commonEn from "@/locales/en/common.json";
import navEn from "@/locales/en/nav.json";
import homeEn from "@/locales/en/home.json";
import servicesEn from "@/locales/en/services.json";
import servicesDetailEn from "@/locales/en/services-detail.json";
import solutionsEn from "@/locales/en/solutions.json";
import insightsEn from "@/locales/en/insights.json";
import contactEn from "@/locales/en/contact.json";
import aboutEn from "@/locales/en/about.json";
import legalEn from "@/locales/en/legal.json";
import footerEn from "@/locales/en/footer.json";

export type Dictionary = Record<string, string>;

const FR: Dictionary = {
  ...commonFr,
  ...navFr,
  ...homeFr,
  ...servicesFr,
  ...servicesDetailFr,
  ...solutionsFr,
  ...insightsFr,
  ...contactFr,
  ...aboutFr,
  ...legalFr,
  ...footerFr,
};

const EN: Dictionary = {
  ...commonEn,
  ...navEn,
  ...homeEn,
  ...servicesEn,
  ...servicesDetailEn,
  ...solutionsEn,
  ...insightsEn,
  ...contactEn,
  ...aboutEn,
  ...legalEn,
  ...footerEn,
};

/**
 * Dictionnaire complet d'une langue (repli sur le français pour une clé absente).
 *
 * Lu côté serveur (layout racine) puis transmis à `I18nProvider` : le bundle
 * client ne contient aucun fichier de traduction, et une page n'embarque que
 * la langue qu'elle affiche. Ne pas importer depuis un composant client.
 */
export function getDictionary(locale: Locale): Dictionary {
  return locale === "en" ? { ...FR, ...EN } : FR;
}
