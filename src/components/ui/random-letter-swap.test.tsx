import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";

describe("RandomLetterSwap (Animation de typographie et accessibilité)", () => {
  it("rend le texte de manière accessible avec aria-label et sr-only", () => {
    const html = renderToStaticMarkup(<RandomLetterSwap label="Solutions" />);

    // Doit contenir le label complet dans aria-label
    expect(html).toContain('aria-label="Solutions"');
    // Doit contenir la balise sr-only pour les lecteurs d'écran
    expect(html).toContain('<span class="sr-only">Solutions</span>');
    // Doit contenir les lettres individuelles avec aria-hidden="true"
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("Solutions");
  });

  it("gère les espaces dans les labels composés sans altération", () => {
    const html = renderToStaticMarkup(
      <RandomLetterSwap label="À Propos" className="custom-test-class" />
    );

    expect(html).toContain('aria-label="À Propos"');
    expect(html).toContain('<span class="sr-only">À Propos</span>');
    expect(html).toContain("custom-test-class");
  });

  it("rend le composant avec des paramètres personnalisés sans erreur SSR", () => {
    const html = renderToStaticMarkup(
      <RandomLetterSwap
        label="Analyticatech"
        staggerDuration={0.03}
        reverse={true}
        className="font-mono text-sm"
      />
    );

    expect(html).toContain('aria-label="Analyticatech"');
    expect(html).toContain('<span class="sr-only">Analyticatech</span>');
    expect(html).toContain("font-mono text-sm");
  });
});
