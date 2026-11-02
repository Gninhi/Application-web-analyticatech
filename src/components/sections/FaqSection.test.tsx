import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FaqSection } from "@/components/sections/FaqSection";
import { I18nProvider } from "@/lib/i18n/provider";
import frHome from "@/locales/fr/home.json";
import enHome from "@/locales/en/home.json";

function renderFaq(locale: "fr" | "en" = "fr") {
  const rawHtml = renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <FaqSection />
    </I18nProvider>
  );
  return rawHtml
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

describe("FaqSection — Rendu SSR & Accessibilité SEO", () => {
  it("vérifie la présence des réponses aux questions 1 à 5 dans le HTML initial en FR", () => {
    const html = renderFaq("fr");
    const dict = frHome as Record<string, string>;
    for (let i = 1; i <= 5; i++) {
      expect(html).toContain(dict[`home.faq.q${i}`]);
      expect(html).toContain(dict[`home.faq.a${i}`]);
    }
  });

  it("vérifie que les panneaux 2 à 5 sont visuellement fermés par défaut", () => {
    const html = renderFaq("fr");

    // Le panneau 0 est ouvert par défaut (height: auto, opacity: 1)
    expect(html).toContain('id="faq-panel-0"');
    expect(html).toContain('aria-controls="faq-panel-0"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('id="faq-panel-0" role="region" aria-labelledby="faq-trigger-0" class="overflow-hidden" style="height:auto;opacity:1"');

    // Les panneaux 1 à 4 sont fermés (height: 0px, opacity: 0) mais bien présents
    for (let i = 1; i < 5; i++) {
      expect(html).toContain(`id="faq-panel-${i}" role="region" aria-labelledby="faq-trigger-${i}" class="overflow-hidden" style="height:0px;opacity:0"`);
      expect(html).toContain(`id="faq-trigger-${i}" type="button" aria-expanded="false" aria-controls="faq-panel-${i}"`);
    }
  });

  it("vérifie la présence de toutes les réponses en EN dans le HTML initial", () => {
    const html = renderFaq("en");
    const dict = enHome as Record<string, string>;
    for (let i = 1; i <= 5; i++) {
      expect(html).toContain(dict[`home.faq.q${i}`]);
      expect(html).toContain(dict[`home.faq.a${i}`]);
    }
  });
});
