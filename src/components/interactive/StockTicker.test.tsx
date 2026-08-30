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
    expect(html).toContain("▲ 320ms");
    expect(html).toContain("[AGNT-02]");
    expect(html).toContain("Agents");
    expect(html).toContain("[RAG-06]");
    expect(html).toContain("RAG");
    expect(html).toContain("stock-ticker-track-left");
    expect(html).toContain("pointer-events-none absolute inset-y-0 left-0");
  });

  it("rend le bandeau clients avec les codes boursiers et badges sectoriels", () => {
    const html = renderToStaticMarkup(
      <StockTicker
        type="clients"
        clients={[
          { name: "NovaFinance", sector: "FINTECH" },
          { name: "Helios Energy", sector: "ÉNERGIE" },
        ]}
      />
    );

    expect(html).toContain("[NOVA]");
    expect(html).toContain("NovaFinance");
    expect(html).toContain("FINTECH");
    expect(html).toContain("[HELI]");
    expect(html).toContain("Helios Energy");
    expect(html).toContain("PROD ACTIVE");
    expect(html).toContain("stock-ticker-track-right");
  });

  it("applique les variables d'animation CSS et la double piste symétrique", () => {
    const html = renderToStaticMarkup(<StockTicker type="tech" speed={30} />);

    expect(html).toContain("--ticker-duration:30s");
    expect(html).toContain("stock-ticker-container");
    expect(html).toContain("stock-ticker-track-left");
  });
});
