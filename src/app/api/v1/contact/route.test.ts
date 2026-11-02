import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/**
 * POST /api/v1/contact — parcours réel de la route, dépendances externes
 * simulées (base, e-mail, télémétrie). Aucune demande n'est envoyée.
 */

const { createRequest, sendMail, captureEvent, afterTasks } = vi.hoisted(() => ({
  createRequest: vi.fn(),
  sendMail: vi.fn(),
  captureEvent: vi.fn(),
  afterTasks: [] as Array<() => unknown>,
}));

vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  // `after()` n'existe qu'au sein d'une requête Next : on capture les tâches
  return { ...actual, after: (task: () => unknown) => void afterTasks.push(task) };
});
vi.mock("@/lib/db/client", () => ({
  db: {
    contactRequest: { create: createRequest },
    blockedEmailDomain: { findUnique: vi.fn().mockResolvedValue(null) },
    suspiciousUAPattern: { findMany: vi.fn().mockResolvedValue([]) },
  },
}));
vi.mock("@/lib/email/mailer", () => ({ sendContactNotification: sendMail }));
vi.mock("@/lib/posthog-server", () => ({ captureServerEvent: captureEvent }));

import { POST } from "./route";
import { _resetRateLimitBucketsForTest } from "@/lib/security/rate-limit";

const VALID_BODY = {
  prenom: "Camille",
  nom: "Martin",
  email: "camille.martin@entreprise-test.fr",
  entreprise: "Entreprise Test",
  sujet: "Assistant documentaire",
  message: "Nous souhaitons étudier un assistant qui répond à partir de nos procédures internes.",
  consent: true,
};

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost:3000/api/v1/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      origin: "http://localhost:3000",
      "user-agent": "Mozilla/5.0 (Macintosh) Chrome/130",
      cookie: "at-csrf=token-de-test-0123456789",
      "x-csrf-token": "token-de-test-0123456789",
      ...headers,
    },
  });
}

describe("POST /api/v1/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    afterTasks.length = 0;
    _resetRateLimitBucketsForTest();
    createRequest.mockResolvedValue({ id: "cr_1" });
  });

  it("confirme la demande seulement après l'avoir enregistrée, puis envoie l'e-mail", async () => {
    const res = await POST(makeRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.message).toContain("Je vous réponds personnellement");
    expect(json.message).not.toMatch(/architecte/i);
    expect(createRequest).toHaveBeenCalledTimes(1);

    // L'e-mail part via after(), jamais en « fire-and-forget »
    expect(sendMail).not.toHaveBeenCalled();
    await Promise.all(afterTasks.map((task) => task()));
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ email: VALID_BODY.email }));
  }, 10_000);

  it("ne simule pas de succès si l'enregistrement échoue", async () => {
    createRequest.mockRejectedValue(new Error("base indisponible"));
    const res = await POST(makeRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(afterTasks).toHaveLength(0);
  }, 10_000);

  it("n'envoie aucune télémétrie sans consentement (pas d'identifiant PostHog)", async () => {
    await POST(makeRequest(VALID_BODY));
    await Promise.all(afterTasks.map((task) => task()));
    expect(captureEvent).not.toHaveBeenCalled();
  }, 10_000);

  it("envoie la télémétrie anonyme quand le visiteur a consenti", async () => {
    await POST(makeRequest(VALID_BODY, { "x-posthog-id": "ph_123" }));
    await Promise.all(afterTasks.map((task) => task()));
    expect(captureEvent).toHaveBeenCalledWith(expect.objectContaining({ distinctId: "ph_123" }));
  }, 10_000);

  it("rejette une requête sans jeton CSRF", async () => {
    const res = await POST(makeRequest(VALID_BODY, { "x-csrf-token": "autre" }));
    expect(res.status).toBe(403);
    expect(createRequest).not.toHaveBeenCalled();
  });

  it("répond en anglais quand le formulaire est en anglais", async () => {
    const res = await POST(makeRequest(VALID_BODY, { "x-locale": "en" }));
    const json = await res.json();
    expect(json.message).toContain("I will reply to you personally");
  }, 10_000);

  it("renvoie les erreurs de validation sans rien enregistrer", async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, email: "pas-un-email" }));
    expect(res.status).toBe(422);
    expect(createRequest).not.toHaveBeenCalled();
  }, 10_000);
});
