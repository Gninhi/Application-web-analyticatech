import { describe, expect, it } from "vitest";
import { formatPostDate } from "@/lib/utils/date";

describe("date utility - formatPostDate", () => {
  it("formate une date ISO valide en français", () => {
    const formatted = formatPostDate("2026-08-15T12:00:00.000Z", "fr");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("15");
  });

  it("formate une date ISO valide en anglais", () => {
    const formatted = formatPostDate("2026-08-15T12:00:00.000Z", "en");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("15");
    expect(formatted).toContain("Aug");
  });

  it("gère les chaînes vides et dates invalides sans planter", () => {
    expect(formatPostDate("")).toBe("");
    expect(formatPostDate("date-invalide")).toBe("date-invalide");
  });
});
