import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FaqSection } from "@/components/sections/FaqSection";
import { I18nProvider } from "@/lib/i18n/provider";

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

    // Question 1
    expect(html).toContain("Combien de temps faut-il pour livrer un projet");
    expect(html).toContain("Cela dépend du périmètre");

    // Questions 2 à 5 — réponses attendues dans le premier rendu HTML pour le SEO
    expect(html).toContain("Comment garantissez-vous la sécurité");
    expect(html).toContain("Nous signons systématiquement un NDA");

    expect(html).toContain("Quels types d'entreprises accompagnez-vous");
    expect(html).toContain("Des PME aux grands groupes");

    expect(html).toContain("Proposez-vous des accompagnements");
    expect(html).toContain("Oui — de l'audit de maturité");

    expect(html).toContain("Comment se déroule un premier échange");
    expect(html).toContain("Un appel de cadrage gratuit de 30 minutes");
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

    expect(html).toContain("How long does it take to deliver an enterprise AI project");
    expect(html).toContain("It depends on the scope");

    expect(html).toContain("How do you guarantee enterprise data security");
    expect(html).toContain("We systematically execute a mutual NDA");

    expect(html).toContain("What types of enterprises do you partner with");
    expect(html).toContain("From high-growth scale-ups to Tier-1 enterprise groups");

    expect(html).toContain("Do you provide end-to-end digital transformation consulting");
    expect(html).toContain("Yes — from digital maturity auditing");

    expect(html).toContain("What happens during an initial discovery call");
    expect(html).toContain("A complimentary 30-minute scoping session");
  });
});
