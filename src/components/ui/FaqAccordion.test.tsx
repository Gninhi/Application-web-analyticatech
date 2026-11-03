import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

const items = [
  { question: "Première question ?", answer: "Première réponse." },
  { question: "Deuxième question ?", answer: "Deuxième réponse." },
];

describe("FaqAccordion", () => {
  it("relie chaque bouton à son panneau et n'ouvre que le premier", () => {
    const html = renderToStaticMarkup(<FaqAccordion items={items} idPrefix="t" />);
    expect(html.match(/<h3>/g)).toHaveLength(2);
    expect(html).toContain('id="t-trigger-0"');
    expect(html).toContain('aria-controls="t-panel-0"');
    expect(html).toContain('aria-labelledby="t-trigger-1"');
    expect(html.match(/aria-expanded="true"/g)).toHaveLength(1);
    expect(html).toContain("Deuxième réponse.");
  });

  it("peut démarrer entièrement fermé", () => {
    const html = renderToStaticMarkup(<FaqAccordion items={items} defaultOpen={null} />);
    expect(html).not.toContain('aria-expanded="true"');
  });
});
