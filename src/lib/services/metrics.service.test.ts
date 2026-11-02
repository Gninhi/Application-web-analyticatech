import { describe, expect, it } from "vitest";
import { FALLBACK_METRICS_FR, FALLBACK_METRICS_EN } from "@/lib/content/fallbacks";

describe("metrics fallbacks — charte (aucun chiffre non vérifiable)", () => {
  it("ne contient aucune métrique illustrative en FR ni en EN", () => {
    expect(FALLBACK_METRICS_FR).toEqual([]);
    expect(FALLBACK_METRICS_EN).toEqual([]);
  });
});
