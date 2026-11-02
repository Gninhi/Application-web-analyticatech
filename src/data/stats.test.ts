import { describe, expect, it } from "vitest";
import { KEY_FACTS, getKeyStats } from "./stats";

describe("src/data/stats.ts — repères vérifiables", () => {
  it("expose 4 repères sans statistique non démontrée", () => {
    expect(KEY_FACTS).toHaveLength(4);
    const all = JSON.stringify(KEY_FACTS);
    for (const banned of ["48+", "4.9/5", "4,9/5", "35%", "99.9%", "3.5x"]) {
      expect(all).not.toContain(banned);
    }
  });

  it("retourne des libellés français et anglais", () => {
    const fr = getKeyStats("fr");
    const en = getKeyStats("en");
    expect(fr).toHaveLength(4);
    expect(en).toHaveLength(4);
    expect(fr[0].v).toBe("20 min");
    expect(fr[0].l).toContain("Premier échange");
    expect(en[0].l).toContain("first call");
  });
});
