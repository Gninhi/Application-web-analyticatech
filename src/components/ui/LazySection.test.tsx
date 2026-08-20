import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LazySection, SectionSkeleton } from "@/components/ui/LazySection";
import { AnimatedCounter } from "@/components/interactive/AnimatedCounter";

// Tests SSR (environment node) : on vérifie le markup produit par le premier
// rendu, c'est-à-dire ce que le visiteur voit avant toute hydration.

describe("LazySection", () => {
  it("rend le squelette au premier rendu (pas encore monté)", () => {
    const html = renderToStaticMarkup(
      <LazySection minHeight={520}>
        <p>contenu lourd</p>
      </LazySection>
    );
    expect(html).toContain("lazy-section-skeleton");
    expect(html).not.toContain("contenu lourd");
    expect(html).toContain('data-lazy-mounted="false"');
  });

  it("réserve la hauteur desktop et mobile via variables CSS", () => {
    const html = renderToStaticMarkup(<SectionSkeleton minHeight={760} mobileMinHeight={2100} />);
    expect(html).toContain("--sk-min:760px");
    expect(html).toContain("--sk-mobile:2100px");
  });

  it("masque le squelette aux technologies d'assistance (aria-hidden)", () => {
    const html = renderToStaticMarkup(<SectionSkeleton />);
    expect(html).toContain('aria-hidden="true"');
  });

  it("avec eager, monte le contenu immédiatement", () => {
    const html = renderToStaticMarkup(
      <LazySection eager>
        <p>contenu lourd</p>
      </LazySection>
    );
    expect(html).toContain("contenu lourd");
    expect(html).toContain('data-lazy-mounted="true"');
    expect(html).not.toContain("lazy-section-skeleton");
  });

  it("peut recevoir un placeholder personnalisé", () => {
    const html = renderToStaticMarkup(
      <LazySection placeholder={<div data-testid="custom">chargement…</div>}>
        <p>contenu</p>
      </LazySection>
    );
    expect(html).toContain("chargement…");
    expect(html).not.toContain("contenu");
  });
});

describe("AnimatedCounter", () => {
  it("affiche la valeur finale au premier rendu (pas de « 0 » visible)", () => {
    const html = renderToStaticMarkup(<AnimatedCounter value={42} />);
    expect(html).toContain(">42<");
    expect(html).not.toContain(">0<");
  });

  it("respecte préfixe, suffixe et décimales", () => {
    const html = renderToStaticMarkup(<AnimatedCounter value={1234.5} decimals={1} prefix="+" suffix=" %" />);
    // fr-FR utilise une espace insécable étroite (U+202F) comme séparateur de milliers.
    expect(html).toMatch(/\+1\s*234,5\s*%/);
  });

  it("utilise des chiffres tabulaires pour éviter le saut de largeur", () => {
    const html = renderToStaticMarkup(<AnimatedCounter value={1} />);
    expect(html).toContain("font-variant-numeric:tabular-nums");
  });
});