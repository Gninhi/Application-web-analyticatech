import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NavbarActionToggle } from "@/components/branding/NavbarActionToggle";

describe("NavbarActionToggle — Bouton d'action mutualisé (DRY) avec faisceau serpent animé", () => {
  it("rend un bouton compact h-9 w-9 avec les styles du thème", () => {
    const html = renderToStaticMarkup(
      <NavbarActionToggle onClick={vi.fn()} aria-label="Action test" title="Action test">
        <span>Icon</span>
      </NavbarActionToggle>
    );

    expect(html).toContain("h-9 w-9");
    expect(html).toContain('aria-label="Action test"');
    expect(html).toContain('title="Action test"');
    expect(html).toContain("Icon");
  });

  it("intègre le liseré lumineux serpent animé (AnimatedButtonBorder) par défaut", () => {
    const html = renderToStaticMarkup(
      <NavbarActionToggle onClick={vi.fn()} aria-label="Action serpent">
        <span>Beam</span>
      </NavbarActionToggle>
    );

    // Vérifie la présence du faisceau serpent (dégradé bi-thème Orange / Bleu)
    expect(html).toContain("#F26D3D");
    expect(html).toContain("#3B82F6");
    expect(html).toContain("pointer-events-none");
    expect(html).toContain("aspect-square");
  });

  it("permet de désactiver conditionnellement l'animation si besoin", () => {
    const html = renderToStaticMarkup(
      <NavbarActionToggle
        onClick={vi.fn()}
        aria-label="Sans animation"
        showBorderAnimation={false}
      >
        <span>Statique</span>
      </NavbarActionToggle>
    );

    expect(html).not.toContain("aspect-square");
  });
});
