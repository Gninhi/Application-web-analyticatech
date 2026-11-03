import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AgentoryMethod, readingTimeMs } from "@/components/sections/AgentoryMethod";
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

    expect(html).toContain("06 — MÉTHODE");
    expect(html).toContain("Une démarche structurée, étape par étape");
    expect(html).toContain("01. Découverte & Cadrage");
    expect(html).toContain("02. Prototype en conditions réelles");
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

    expect(html).toContain("06 — METHOD");
    expect(html).toContain("A structured approach, step by step");
    expect(html).toContain("01. Discovery & Scoping");
    expect(html).toContain("Auto rotation");
    expect(html).toContain("Pause auto-rotation");
  });

  it("affiche le bouton CTA avec la fonction onNavigateContact", () => {
    const onNavigateContact = vi.fn();
    const html = renderMethod("fr", onNavigateContact);

    expect(html).toContain("Démarrer à cette étape");
  });

  it("accorde un temps de lecture proportionnel au texte, borné entre 9 et 15 s", () => {
    const base = { title: "Titre", subtitle: "Sous-titre", result: "Résultat", deliverables: ["a", "b", "c"] };
    const short = readingTimeMs({ ...base, description: "Court." });
    const long = readingTimeMs({ ...base, description: "mot ".repeat(60) });
    const huge = readingTimeMs({ ...base, description: "mot ".repeat(400) });
    expect(short).toBe(9000);
    expect(long).toBeGreaterThan(short);
    expect(long).toBeLessThan(15000);
    expect(huge).toBe(15000);
  });

  it("la jauge de lecture reprend où elle s'était arrêtée (pause sans remise à zéro)", () => {
    const html = renderMethod("fr");
    expect(html).toMatch(/method-progress-bar[^>]*animation-play-state:(running|paused)/);
    expect(html).not.toContain("animation-duration:9000ms;animation-play-state:paused;opacity");
  });
});
