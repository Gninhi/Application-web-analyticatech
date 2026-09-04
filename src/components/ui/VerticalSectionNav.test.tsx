import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { VerticalSectionNav, type VerticalNavItem } from "@/components/ui/VerticalSectionNav";

const sampleItems: VerticalNavItem[] = [
  { id: "intro", number: "01", title: "Introduction", subtitle: "Vue globale" },
  { id: "details", number: "02", title: "Détails techniques", subtitle: "Architecture" },
  { id: "conclusions", number: "03", title: "Conclusions", subtitle: "Résultats" },
];

describe("VerticalSectionNav", () => {
  it("rend le sommaire desktop avec tous les segments et numéros", () => {
    const html = renderToStaticMarkup(<VerticalSectionNav items={sampleItems} />);

    expect(html).toContain("SOMMAIRE //");
    expect(html).toContain("01");
    expect(html).toContain("Introduction");
    expect(html).toContain("Vue globale");

    expect(html).toContain("02");
    expect(html).toContain("Détails techniques");

    expect(html).toContain("03");
    expect(html).toContain("Conclusions");
  });

  it("rend le composant de navigation mobile sans casser le rendu statique", () => {
    const html = renderToStaticMarkup(
      <VerticalSectionNav items={sampleItems} accentColor="#F26D3D" />
    );

    // Bouton de menu mobile présent
    expect(html).toContain("Ouvrir le sommaire des sections");
    expect(html).toContain("01");
  });

  it("garantit une sémantique accessible avec des balises button et aria-current", () => {
    const html = renderToStaticMarkup(<VerticalSectionNav items={sampleItems} />);

    // Tous les items sont des boutons interactifs WAI-ARIA
    expect(html).toContain('<button type="button"');
    expect(html).toContain('aria-current="location"');
  });
});
