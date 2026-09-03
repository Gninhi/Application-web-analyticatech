import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { GlassButton } from "@/components/interactive/GlassButton";
import { MovingButton } from "@/components/interactive/MovingButton";
import { Button } from "@/components/ui/button";

describe("Unified Button & GlassButton system", () => {
  it("rend correctement un bouton primary avec la bordure animée", () => {
    const html = renderToStaticMarkup(
      <GlassButton variant="primary" size="lg">
        Lancer mon projet
      </GlassButton>
    );
    expect(html).toContain("bg-[#03318C]");
    expect(html).toContain("Lancer mon projet");
    expect(html).toContain("pointer-events-none");
    expect(html).toContain("aspect-square");
  });

  it("rend les variantes secondary, outline, ghost et subtle avec leurs styles respectifs", () => {
    const secondaryHtml = renderToStaticMarkup(
      <GlassButton variant="secondary">Nouveau</GlassButton>
    );
    expect(secondaryHtml).toContain("Nouveau");

    const outlineHtml = renderToStaticMarkup(
      <GlassButton variant="outline">Découvrir</GlassButton>
    );
    expect(outlineHtml).toContain("Découvrir");
    expect(outlineHtml).toContain("pointer-events-none");

    const ghostHtml = renderToStaticMarkup(
      <GlassButton variant="ghost">Retour</GlassButton>
    );
    expect(ghostHtml).toContain("Retour");

    const subtleHtml = renderToStaticMarkup(
      <GlassButton variant="subtle">Options</GlassButton>
    );
    expect(subtleHtml).toContain("Options");
  });

  it("supporte le rendu polymorphique Link lorsque href est fourni", () => {
    const html = renderToStaticMarkup(
      <GlassButton href="/contact" variant="primary">
        Nous contacter
      </GlassButton>
    );
    expect(html).toContain("<a");
    expect(html).toContain('href="/contact"');
    expect(html).toContain("Nous contacter");
  });

  it("supporte le mode iconOnly et dimensions personnalisées", () => {
    const html = renderToStaticMarkup(
      <GlassButton iconOnly className="h-10 w-10" aria-label="Action">
        <span>⚡</span>
      </GlassButton>
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
        Chiffrement...
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

  it("MovingButton et Button sont compatibles et unifiés", () => {
    const movingHtml = renderToStaticMarkup(
      <MovingButton variant="primary" size="md">
        Action Principale
      </MovingButton>
    );
    expect(movingHtml).toContain("Action Principale");
    expect(movingHtml).toContain("bg-[#03318C]");

    const buttonHtml = renderToStaticMarkup(
      <Button variant="secondary" size="sm">
        Standard Button
      </Button>
    );
    expect(buttonHtml).toContain("Standard Button");
  });
});
