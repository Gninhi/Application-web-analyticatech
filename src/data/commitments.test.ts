import { describe, expect, it } from "vitest";
import {
  SLA_COMMITMENTS,
  getSlaList,
  getSupportScheduleNotice,
  getResponseNotice,
} from "./commitments";

describe("commitments (Source unique de vérité des engagements et horaires)", () => {
  it("définit les 4 engagements tenables par le fondateur", () => {
    expect(SLA_COMMITMENTS.reply.valueFr).toBe("Sous 2 jours ouvrés");
    expect(SLA_COMMITMENTS.firstCall.valueFr).toBe("20 minutes, gratuit");
    expect(SLA_COMMITMENTS.proposal.valueFr).toBe("Sous 5 jours ouvrés après l'échange");
    expect(SLA_COMMITMENTS.availability.valueFr).toBe("9h30 – 17h30, du lundi au vendredi");
  });

  it("exprime l'horaire en heure de Paris (pas « CET », faux l'été)", () => {
    expect(getSupportScheduleNotice("fr")).toBe("Du lundi au vendredi, 9h30 – 17h30 (heure de Paris)");
    expect(getSupportScheduleNotice("en")).toBe("Monday to Friday, 9:30 AM – 5:30 PM (Paris time)");
    expect(getSupportScheduleNotice("fr")).not.toContain("CET");
  });

  it("fournit une liste complète et traduite pour getSlaList", () => {
    const frList = getSlaList("fr");
    expect(frList.map((i) => i.key)).toEqual(["reply", "firstCall", "proposal", "availability"]);
    expect(frList[0].value).toBe("Sous 2 jours ouvrés");

    const enList = getSlaList("en");
    expect(enList).toHaveLength(4);
    expect(enList[1].value).toBe("20 minutes, free");
  });

  it("ne promet aucun « architecte » ni délai en heures", () => {
    const all = JSON.stringify(SLA_COMMITMENTS);
    expect(all).not.toMatch(/architect/i);
    expect(all).not.toMatch(/< ?\d+ ?h/);
    expect(getResponseNotice("fr")).toBe("Réponse personnelle du fondateur sous 2 jours ouvrés");
  });
});
