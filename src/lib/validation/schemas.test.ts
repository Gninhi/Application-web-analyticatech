import { describe, expect, it } from "vitest";
import { contactSchema } from "./schemas";

const validPayload = {
  prenom: "Jean",
  nom: "Dupont",
  email: "j.dupont@acme.fr",
  entreprise: "Acme Corp",
  sujet: "Demande de mission IA",
  message: "Bonjour, nous souhaiterions échanger sur un projet d'automatisation de nos processus métier.",
  consent: true,
};

describe("contactSchema", () => {
  it("accepte un payload valide et le normalise (trim)", () => {
    const result = contactSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.prenom).toBe("Jean");
    }
  });

  it("rejette un payload vide", () => {
    const result = contactSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("bloque les champs honeypot remplis", () => {
    const result = contactSchema.safeParse({ ...validPayload, companyUrl: "http://spam.example" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("honeypot"))).toBe(true);
    }
  });

  it("bloque les emails personnels (domaine jetable/gratuit)", () => {
    for (const email of ["test@gmail.com", "x@protonmail.com", "y@icloud.com"]) {
      const result = contactSchema.safeParse({ ...validPayload, email });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes("professionnel"))).toBe(true);
      }
    }
  });

  it("accepte un email professionnel avec majuscules", () => {
    const result = contactSchema.safeParse({ ...validPayload, email: "Jean@Acme.Fr" });
    expect(result.success).toBe(true);
  });

  it("rejette un email malformé", () => {
    const result = contactSchema.safeParse({ ...validPayload, email: "pas-un-email" });
    expect(result.success).toBe(false);
  });

  it("rejette prénom / nom trop courts", () => {
    const result = contactSchema.safeParse({ ...validPayload, prenom: "J", nom: "D" });
    expect(result.success).toBe(false);
  });

  it("rejette un message trop court (< 20 chars)", () => {
    const result = contactSchema.safeParse({ ...validPayload, message: "trop court" });
    expect(result.success).toBe(false);
  });

  it("rejette un sujet trop court (< 3 chars)", () => {
    const result = contactSchema.safeParse({ ...validPayload, sujet: "ab" });
    expect(result.success).toBe(false);
  });

  it("rejette le consentement RGPD non accepté", () => {
    const result = contactSchema.safeParse({ ...validPayload, consent: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("confidentialité"))).toBe(true);
    }
  });

  it("rejette les champs trop longs (limites max)", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      message: "x".repeat(2001),
      entreprise: "y".repeat(121),
    });
    expect(result.success).toBe(false);
  });
});
