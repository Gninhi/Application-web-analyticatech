import { describe, expect, it } from "vitest";
import { normalizeServiceIndex, getServices, getServiceByIndex } from "./services.service";

describe("normalizeServiceIndex", () => {
  it("complète les chiffres uniques avec un zéro initial", () => {
    expect(normalizeServiceIndex("1")).toBe("01");
    expect(normalizeServiceIndex("2")).toBe("02");
    expect(normalizeServiceIndex("5")).toBe("05");
  });

  it("conserve les index déjà normalisés à deux chiffres", () => {
    expect(normalizeServiceIndex("01")).toBe("01");
    expect(normalizeServiceIndex("02")).toBe("02");
    expect(normalizeServiceIndex("05")).toBe("05");
  });

  it("nettoie les espaces autour", () => {
    expect(normalizeServiceIndex("  03  ")).toBe("03");
    expect(normalizeServiceIndex("  4 ")).toBe("04");
  });

  it("gère les chaînes non numériques sans altération", () => {
    expect(normalizeServiceIndex("ai")).toBe("ai");
    expect(normalizeServiceIndex("")).toBe("");
  });
});

describe("getServices fallback & resilience", () => {
  it("retourne les services par défaut en FR si la DB est vide ou inaccessible", async () => {
    const services = await getServices("fr");
    expect(services.length).toBeGreaterThanOrEqual(4);
    expect(services[0].index).toBe("01");
    expect(services[0].title).toBe("Raisonnement & RAG");
    expect(services[0].technologies).toContain("LangChain");
  });

  it("retourne les services par défaut en EN pour la locale anglaise", async () => {
    const services = await getServices("en");
    expect(services.length).toBeGreaterThanOrEqual(4);
    expect(services[0].index).toBe("01");
    expect(services[0].title).toBe("Reasoning & RAG");
  });
});

describe("getServiceByIndex", () => {
  it("retrouve un service par son index à deux chiffres", async () => {
    const service = await getServiceByIndex("01", "fr");
    expect(service).not.toBeNull();
    expect(service?.index).toBe("01");
    expect(service?.title).toBe("Raisonnement & RAG");
  });

  it("retrouve un service par son index à un seul chiffre", async () => {
    const service = await getServiceByIndex("2", "fr");
    expect(service).not.toBeNull();
    expect(service?.index).toBe("02");
    expect(service?.title).toBe("Automatisation & Workflows");
  });

  it("retrouve le service 04 (Data & Décision Augmentée)", async () => {
    const service = await getServiceByIndex("4", "fr");
    expect(service).not.toBeNull();
    expect(service?.index).toBe("04");
    expect(service?.title).toBe("Data & Décision Augmentée");
  });

  it("retourne null pour un index inexistant", async () => {
    const service = await getServiceByIndex("99", "fr");
    expect(service).toBeNull();
  });
});
