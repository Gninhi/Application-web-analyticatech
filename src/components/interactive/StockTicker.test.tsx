import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StockTicker } from "@/components/interactive/StockTicker";

describe("StockTicker Component", () => {
  it("rend le bandeau tech avec les métadonnées boursières et les deltas", () => {
    const html = renderToStaticMarkup(
      <StockTicker type="tech" keywords={["IA", "Agents", "RAG"]} />
    );

    expect(html).toContain("[AI-01]");
    expect(html).toContain("IA");
    expect(html).toContain("▲ 280ms");
    expect(html).toContain("[AGNT-02]");
    expect(html).toContain("Agents");
    expect(html).toContain("[RAG-06]");
    expect(html).toContain("RAG");
    expect(html).toContain("stock-ticker-track-left");
    expect(html).toContain("pointer-events-none absolute inset-y-0 left-0");
  });

  it("rend le bandeau personnalisé en mode custom", () => {
    const html = renderToStaticMarkup(
      <StockTicker
        type="custom"
        direction="right"
        items={["Custom A", "Custom B"]}
        renderItem={(item: string) => <span>{item}</span>}
      />
    );

    expect(html).toContain("Custom A");
    expect(html).toContain("Custom B");
    expect(html).toContain("stock-ticker-track-right");
  });

  it("applique les variables d'animation CSS et la double piste symétrique", () => {
    const html = renderToStaticMarkup(<StockTicker type="tech" speed={30} />);

    expect(html).toContain("--ticker-duration:30s");
    expect(html).toContain("stock-ticker-container");
    expect(html).toContain("stock-ticker-track-left");
  });
});
