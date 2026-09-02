import { describe, it, expect } from "vitest";
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

const allFr: Record<string, string> = {
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

const allEn: Record<string, string> = {
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

describe("i18n translation parity & completeness", () => {
  it("les dictionnaires FR et EN ont exactement les mêmes clés", () => {
    const frKeys = Object.keys(allFr).sort();
    const enKeys = Object.keys(allEn).sort();

    const inFrNotEn = frKeys.filter((k) => !(k in allEn));
    const inEnNotFr = enKeys.filter((k) => !(k in allFr));

    expect(inFrNotEn).toEqual([]);
    expect(inEnNotFr).toEqual([]);
    expect(frKeys.length).toBe(enKeys.length);
  });

  it("toutes les clés requises pour l'affichage sont définies et non vides en FR", () => {
    const requiredKeys = [
      "common.presentation",
      "common.techStack",
      "common.deployed",
      "common.impact",
      "common.read",
      "common.context",
      "common.keyPoints",
      "view.home",
      "view.services",
      "view.solutions",
      "view.blog",
      "view.contact",
      "services.persona.filter",
      "services.persona.filterCEO",
      "services.persona.filterArchitect",
      "services.persona.filterOps",
      "services.persona.selected",
    ];

    for (const key of requiredKeys) {
      expect(allFr[key], `Clé FR manquante: ${key}`).toBeDefined();
      expect(allFr[key].trim().length).toBeGreaterThan(0);
    }
  });

  it("toutes les clés requises pour l'affichage sont définies et non vides en EN", () => {
    const requiredKeys = [
      "common.presentation",
      "common.techStack",
      "common.deployed",
      "common.impact",
      "common.read",
      "common.context",
      "common.keyPoints",
      "view.home",
      "view.services",
      "view.solutions",
      "view.blog",
      "view.contact",
      "services.persona.filter",
      "services.persona.filterCEO",
      "services.persona.filterArchitect",
      "services.persona.filterOps",
      "services.persona.selected",
    ];

    for (const key of requiredKeys) {
      expect(allEn[key], `Clé EN manquante: ${key}`).toBeDefined();
      expect(allEn[key].trim().length).toBeGreaterThan(0);
    }
  });
});
