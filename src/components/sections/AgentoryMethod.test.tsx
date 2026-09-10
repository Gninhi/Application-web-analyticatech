import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AgentoryMethod } from "@/components/sections/AgentoryMethod";
import { I18nProvider } from "@/lib/i18n/provider";

function renderMethod(locale: "fr" | "en" = "fr", onNavigateContact?: () => void) {
  const html = renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <AgentoryMethod onNavigateContact={onNavigateContact} />
    </I18nProvider>
  );
  return html
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

describe("AgentoryMethod — Démarche Méthodologique & Rotation Dynamique", () => {
  it("rend la section avec son titre, sa description et les 4 phases méthodologiques", () => {
    const html = renderMethod("fr");

    expect(html).toContain("07 — MÉTHODE");
    expect(html).toContain("Une démarche structurée et rassurante");
    expect(html).toContain("01. Découverte & Cadrage");
    expect(html).toContain("02. POC en conditions réelles");
    expect(html).toContain("03. Industrialisation");
    expect(html).toContain("04. Run & amélioration continue");
  });

  it("intègre la jauge de défilement temporel et le bouton de pause/lecture du cycle", () => {
    const html = renderMethod("fr");

    // Présence de la jauge de défilement temporel
    expect(html).toContain("method-progress-bar");
    // Bouton de contrôle du cycle automatique
    expect(html).toContain("Défilement auto");
    expect(html).toContain("Mettre en pause le défilement automatique");
  });

  it("supporte la locale anglaise avec les libellés traduits", () => {
    const html = renderMethod("en");

    expect(html).toContain("07 — METHODOLOGY");
    expect(html).toContain("A structured, risk-mitigated approach");
    expect(html).toContain("01. Discovery & Scoping");
    expect(html).toContain("Auto rotation");
    expect(html).toContain("Pause auto-rotation");
  });

  it("affiche le bouton CTA avec la fonction onNavigateContact", () => {
    const onNavigateContact = vi.fn();
    const html = renderMethod("fr", onNavigateContact);

    expect(html).toContain("Démarrer à cette étape");
  });
});
