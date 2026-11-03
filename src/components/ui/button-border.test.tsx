import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AnimatedButtonBorder } from "@/components/ui/button-border";

describe("button-border component", () => {
  it("rend AnimatedButtonBorder avec les classes de masque et de bordure", () => {
    const html = renderToStaticMarkup(<AnimatedButtonBorder borderRadius={16} duration={4} beamWidth={20} />);
    expect(html).toContain("pointer-events-none");
    expect(html).toContain("absolute");
    expect(html).toContain("aspect-square");
  });
});
