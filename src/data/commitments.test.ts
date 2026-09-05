import { describe, expect, it } from "vitest";
import {
  SLA_COMMITMENTS,
  getSlaList,
  getSupportScheduleNotice,
  getResponseNotice,
} from "./commitments";

describe("commitments (Source unique de vérité des engagements et horaires)", () => {
  it("définit les 4 engagements majeurs avec des valeurs réalistes", () => {
    expect(SLA_COMMITMENTS.ack.valueFr).toBe("< 2h ouvrées");
    expect(SLA_COMMITMENTS.architect.valueFr).toBe("< 24h ouvrées");
    expect(SLA_COMMITMENTS.workshop.valueFr).toBe("< 5 jours");
    expect(SLA_COMMITMENTS.availability.valueFr).toBe("9h30 - 17h30 (lun-ven)");
  });

  it("définit la plage horaire 9h30 - 17h30 CET du lundi au vendredi", () => {
    expect(SLA_COMMITMENTS.schedule.hoursFr).toBe("9h30 - 17h30");
    expect(getSupportScheduleNotice("fr")).toContain("9h30 - 17h30 (CET)");
    expect(getSupportScheduleNotice("fr")).toContain("Du lundi au vendredi");
    expect(getSupportScheduleNotice("en")).toContain("9:30 AM - 5:30 PM (CET)");
    expect(getSupportScheduleNotice("en")).toContain("Monday to Friday");
  });

  it("fournit une liste complète et traduite pour getSlaList", () => {
    const frList = getSlaList("fr");
    expect(frList).toHaveLength(4);
    expect(frList[0].value).toBe("< 2h ouvrées");
    expect(frList[1].value).toBe("< 24h ouvrées");

    const enList = getSlaList("en");
    expect(enList).toHaveLength(4);
    expect(enList[0].value).toBe("< 2 business hours");
    expect(enList[1].value).toBe("< 24 business hours");
  });

  it("harmonise le message de réponse par email", () => {
    expect(getResponseNotice("fr")).toBe("Réponse sous 24h ouvrées (accusé sous 2h)");
    expect(getResponseNotice("en")).toBe("Response within 24 business hours (acknowledgment within 2h)");
  });
});
