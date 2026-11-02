import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NavbarActionToggle } from "@/components/branding/NavbarActionToggle";

describe("NavbarActionToggle — Bouton d'action mutualisé (DRY) avec faisceau serpent animé", () => {
  it("rend un bouton rond h-10 w-10 avec les styles du thème", () => {
    const html = renderToStaticMarkup(
      <NavbarActionToggle onClick={vi.fn()} aria-label="Action test" title="Action test">
        <span>Icon</span>
      </NavbarActionToggle>
    );

    expect(html).toContain("h-10 w-10");
    expect(html).toContain('aria-label="Action test"');
    expect(html).toContain('title="Action test"');
    expect(html).toContain("Icon");
  });

  it("n'affiche pas de faisceau animé par défaut (charte : pas d'effet lumineux)", () => {
    const html = renderToStaticMarkup(
      <NavbarActionToggle onClick={vi.fn()} aria-label="Action sobre">
        <span>Sobre</span>
      </NavbarActionToggle>
    );
    expect(html).not.toContain("aspect-square");
    expect(html).toContain("border-border");
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
