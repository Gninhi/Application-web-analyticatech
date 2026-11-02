import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ButtonBorder, AnimatedButtonBorder } from "@/components/ui/button-border";

describe("button-border component", () => {
  it("rend AnimatedButtonBorder avec les classes de masque et de bordure", () => {
    const html = renderToStaticMarkup(<AnimatedButtonBorder borderRadius={16} duration={4} beamWidth={20} />);
    expect(html).toContain("pointer-events-none");
    expect(html).toContain("absolute");
    expect(html).toContain("aspect-square");
  });

  it("rend ButtonBorder avec la bordure animée et les classes de variante", () => {
    const html = renderToStaticMarkup(
      <ButtonBorder variant="primary" size="sm" borderRadius={14}>
        <span>Bouton Test</span>
      </ButtonBorder>
    );
    expect(html).toContain("Bouton Test");
    expect(html).toContain("#F26D3D");
    expect(html).toContain("#3B82F6");
    expect(html).toContain("pointer-events-none");
  });
});
