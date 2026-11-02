import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@/components/ui/button";

describe("Unified Button component (src/components/ui/button.tsx)", () => {
  it("rend correctement un bouton primary avec la bordure animée", () => {
    const html = renderToStaticMarkup(
      <Button variant="primary" size="lg">
        Lancer mon projet
      </Button>
    );
    expect(html).toContain("bg-[#03318C]");
    expect(html).toContain("Lancer mon projet");
    expect(html).toContain("pointer-events-none");
    expect(html).toContain("aspect-square");
  });

  it("rend les variantes secondary, outline, ghost et subtle avec leurs styles respectifs", () => {
    const secondaryHtml = renderToStaticMarkup(
      <Button variant="secondary">Nouveau</Button>
    );
    expect(secondaryHtml).toContain("Nouveau");

    const outlineHtml = renderToStaticMarkup(
      <Button variant="outline">Découvrir</Button>
    );
    expect(outlineHtml).toContain("Découvrir");
    expect(outlineHtml).toContain("pointer-events-none");

    const ghostHtml = renderToStaticMarkup(
      <Button variant="ghost">Retour</Button>
    );
    expect(ghostHtml).toContain("Retour");

    const subtleHtml = renderToStaticMarkup(
      <Button variant="subtle">Options</Button>
    );
    expect(subtleHtml).toContain("Options");
  });

  it("supporte le rendu polymorphique Link lorsque href est fourni", () => {
    const html = renderToStaticMarkup(
      <Button href="/contact" variant="primary">
        Nous contacter
      </Button>
    );
    expect(html).toContain("<a");
    expect(html).toContain('href="/contact"');
    expect(html).toContain("Nous contacter");
  });

  it("supporte le mode iconOnly et dimensions personnalisées", () => {
    const html = renderToStaticMarkup(
      <Button iconOnly className="h-10 w-10" aria-label="Action">
        <span>⚡</span>
      </Button>
    );
    expect(html).toContain("h-10 w-10");
    expect(html).toContain('aria-label="Action"');
  });

  it("supporte le variant terminal pour le style cyber/console", () => {
    const html = renderToStaticMarkup(
      <Button variant="terminal" size="lg">
        EXÉCUTER
      </Button>
    );
    expect(html).toContain("font-mono");
    expect(html).toContain("EXÉCUTER");
  });

  it("gère l'état loading avec un spinner et aria-busy", () => {
    const html = renderToStaticMarkup(
      <Button variant="terminal" size="lg" loading>
        Transmission...
      </Button>
    );
    expect(html).toContain("animate-spin");
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("disabled");
  });

  it("positionne les icônes à gauche ou à droite", () => {
    const leftHtml = renderToStaticMarkup(
      <Button icon={<span className="icon-test-left">👈</span>} iconPosition="left">
        Texte
      </Button>
    );
    expect(leftHtml).toContain("icon-test-left");

    const rightHtml = renderToStaticMarkup(
      <Button icon={<span className="icon-test-right">👉</span>} iconPosition="right">
        Texte
      </Button>
    );
    expect(rightHtml).toContain("icon-test-right");
  });
});
