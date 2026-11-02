import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ServiceDetailView } from "@/components/sections/DetailView";
import { SERVICES_DETAIL_REGISTRY } from "@/lib/content/services-detail-data";
import { I18nProvider } from "@/lib/i18n/provider";

function renderWithI18n(ui: React.ReactElement) {
  const rawHtml = renderToStaticMarkup(<I18nProvider initialLocale="fr">{ui}</I18nProvider>);
  return rawHtml.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
}

describe("ServiceDetailView Component", () => {
  it("rend les données enrichies du Service 01 (Raisonnement & RAG) avec toutes ses sections", () => {
    const html = renderWithI18n(
      <ServiceDetailView
        serviceIndex="01"
        onNavigate={() => {}}
      />
    );

    // Titre & Hero
    expect(html).toContain("Intelligence Artificielle");
    expect(html).toContain("& Systèmes RAG");
    expect(html).toContain("SERVICE 01 — LLM, RAG HAUTE PRÉCISION & GARDE-FOUS");

    // Aucune preuve chiffrée non vérifiable
    expect(html).not.toContain("280 ms");
    expect(html).not.toContain("94.2 %");

    // Problèmes & Livrables
    expect(html).toContain("Ce que vos équipes vivent aujourd'hui");
    expect(html).toContain("Quatre livrables concrets, pas une boîte noire");
    expect(html).toContain("Audit d'architecture & Cartographie des données");

    // Timeline & Cas sectoriels
    expect(html).toContain("Quatre phases, des jalons vérifiables");
    expect(html).toContain("Scénarios types par secteur");
    expect(html).toContain("BANQUE & ASSURANCE");

    // Stack technique & Témoignage
    expect(html).toContain("Une stack de production, pas de prototypage");
    expect(html).toContain("LangChain");
    expect(html).toContain("Mistral Large");
    expect(html).not.toContain("-65%");
    expect(html).toContain("Indicateur suivi");

    // FAQ & CTA
    expect(html).toContain("Les questions posées avant de démarrer");
    expect(html).toContain("Mes données d'entreprise restent-elles confidentielles et souveraines ?");
    expect(html).toContain("Demander un cadrage express");
  });

  it("rend les données enrichies pour tous les index de services (01, 02, 03, 04)", () => {
    const indices = ["01", "02", "03", "04"];

    for (const index of indices) {
      const data = SERVICES_DETAIL_REGISTRY[index];
      const html = renderWithI18n(
        <ServiceDetailView
          serviceIndex={index}
          onNavigate={() => {}}
        />
      );

      expect(html).toContain(data.heroTitle);
      expect(html).toContain(data.badge);
      expect(html).not.toContain(data.caseStudy.quote);
      expect(html).toContain(data.deliverables[0].title);
      expect(html).toContain(data.timeline[0].title);
      expect(html).toContain(data.sectorCases[0].sector);
    }
  });

  it("gère l'index normalisé (ex: '1' -> '01') sans erreur", () => {
    const html = renderWithI18n(
      <ServiceDetailView
        serviceIndex="1"
        onNavigate={() => {}}
      />
    );
    expect(html).toContain("Intelligence Artificielle");
  });
});
