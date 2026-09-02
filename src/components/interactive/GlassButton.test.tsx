import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { GlassButton } from "@/components/interactive/GlassButton";
import { MovingButton } from "@/components/interactive/MovingButton";
import { Button } from "@/components/ui/button";

describe("GlassButton component", () => {
  it("rend correctement un bouton liquid glass primary", () => {
    const html = renderToStaticMarkup(
      <GlassButton variant="primary" size="lg">
        Lancer mon projet
      </GlassButton>
    );
    expect(html).toContain("glass-button-wrap");
    expect(html).toContain("glass-btn-primary");
    expect(html).toContain("glass-button-shadow");
    expect(html).toContain("glass-button-sheen");
    expect(html).toContain("Lancer mon projet");
  });

  it("rend les variantes secondary, outline, ghost et subtle avec leurs classes respectives", () => {
    const secondaryHtml = renderToStaticMarkup(
      <GlassButton variant="secondary">Nouveau</GlassButton>
    );
    expect(secondaryHtml).toContain("glass-btn-secondary");

    const outlineHtml = renderToStaticMarkup(
      <GlassButton variant="outline">Découvrir</GlassButton>
    );
    expect(outlineHtml).toContain("glass-btn-outline");
    expect(outlineHtml).toContain("glass-shadow-outline");

    const ghostHtml = renderToStaticMarkup(
      <GlassButton variant="ghost">Retour</GlassButton>
    );
    expect(ghostHtml).toContain("glass-btn-ghost");

    const subtleHtml = renderToStaticMarkup(
      <GlassButton variant="subtle">Options</GlassButton>
    );
    expect(subtleHtml).toContain("glass-btn-subtle");
  });

  it("supporte le rendu polymorphique Link lorsque href est fourni", () => {
    const html = renderToStaticMarkup(
      <GlassButton href="/contact" variant="primary">
        Nous contacter
      </GlassButton>
    );
    expect(html).toContain("<a");
    expect(html).toContain('href="/contact"');
    expect(html).toContain("glass-btn-primary");
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

  it("MovingButton et Button sont compatibles et intègrent le système Liquid Glass", () => {
    const movingHtml = renderToStaticMarkup(
      <MovingButton variant="primary" size="md">
        Action Principale
      </MovingButton>
    );
    expect(movingHtml).toContain("glass-button-wrap");
    expect(movingHtml).toContain("glass-btn-primary");
    expect(movingHtml).toContain("Action Principale");

    const buttonHtml = renderToStaticMarkup(
      <Button variant="secondary" size="sm">
        Standard Button
      </Button>
    );
    expect(buttonHtml).toContain("glass-btn-secondary");
    expect(buttonHtml).toContain("Standard Button");
  });
});

