import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ParticleTypography } from "@/components/interactive/ParticleTypography";
import { PageHeader } from "@/components/ui/PageHeader";

describe("ParticleTypography Component", () => {
  it("rend le titre principal en SSR pour l'accessibilité et le SEO", () => {
    const html = renderToStaticMarkup(
      <ParticleTypography
        title="DES SYSTÈMES"
        titleAccent="INTELLIGENTS"
        subtitle="pour des opérations plus simples."
      />
    );
    expect(html).toContain("DES SYSTÈMES");
    expect(html).toContain("INTELLIGENTS");
    expect(html).toContain("pour des opérations plus simples.");
    expect(html).toContain("<h1");
  });

  it("supporte les titres multi-lignes avec ligne d'accentuation", () => {
    const html = renderToStaticMarkup(
      <ParticleTypography
        title="Quatre expertises,"
        accent="sans zone grise entre elles"
      />
    );
    expect(html).toContain("Quatre expertises,");
    expect(html).toContain("sans zone grise entre elles");
  });

  it("supporte les balises sémantiques personnalisées (h2, h3, div)", () => {
    const html = renderToStaticMarkup(
      <ParticleTypography
        as="h2"
        title="Rapports techniques &amp;"
        accent="retours de terrain"
        align="center"
      />
    );
    expect(html).toContain("<h2");
  });

  it("s'intègre parfaitement dans PageHeader", () => {
    const html = renderToStaticMarkup(
      <PageHeader
        kicker="Services — Séquence d'Empilement"
        title="Quatre expertises,"
        accent="sans zone grise entre elles"
        description="Description du service"
      />
    );
    expect(html).toContain("Quatre expertises,");
    expect(html).toContain("sans zone grise entre elles");
    expect(html).toContain("Description du service");
  });
});

