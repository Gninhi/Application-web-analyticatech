import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";
import RandomLetterSwapNav from "@/components/ui/m-random-letter-swap-1";

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

  it("rend le composant de navigation m-random-letter-swap-1 sans erreur SSR", () => {
    const html = renderToStaticMarkup(<RandomLetterSwapNav />);

    expect(html).toContain("Home");
    expect(html).toContain("Work");
    expect(html).toContain("About");
    expect(html).toContain("Blog");
    expect(html).toContain("Contact");
  });
});
