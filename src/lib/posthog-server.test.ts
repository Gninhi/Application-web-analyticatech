import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { mockCapture, mockShutdown } = vi.hoisted(() => ({
  mockCapture: vi.fn(),
  mockShutdown: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("posthog-node", () => {
  return {
    PostHog: class {
      capture = mockCapture;
      shutdown = mockShutdown;
    },
  };
});

import { captureServerEvent } from "./posthog-server";

describe("posthog-server (Serverless telemetry)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("ne fait rien si aucune clé API n'est définie", async () => {
    delete process.env.POSTHOG_API_KEY;
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;

    await captureServerEvent({
      distinctId: "user-123",
      event: "test_event",
    });

    expect(mockCapture).not.toHaveBeenCalled();
    expect(mockShutdown).not.toHaveBeenCalled();
  });

  it("rejette les distinct_id génériques 'anonymous'", async () => {
    process.env.POSTHOG_API_KEY = "test-key";

    await captureServerEvent({
      distinctId: "anonymous",
      event: "test_event",
    });

    expect(mockCapture).not.toHaveBeenCalled();
    expect(mockShutdown).not.toHaveBeenCalled();
  });

  it("rejette les distinct_id vides ou composés d'espaces", async () => {
    process.env.POSTHOG_API_KEY = "test-key";

    await captureServerEvent({
      distinctId: "   ",
      event: "test_event",
    });

    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("capture l'événement et appelle shutdown() pour garantir le flush en serverless", async () => {
    process.env.POSTHOG_API_KEY = "test-key";

    await captureServerEvent({
      distinctId: "sha256_fingerprint_abc",
      event: "contact_form_processed_server",
      properties: {
        reference: "AT-2026-XYZ",
        status: "success",
      },
    });

    expect(mockCapture).toHaveBeenCalledWith({
      distinctId: "sha256_fingerprint_abc",
      event: "contact_form_processed_server",
      properties: expect.objectContaining({
        reference: "AT-2026-XYZ",
        status: "success",
        $lib: "posthog-node-serverless",
      }),
    });
    expect(mockShutdown).toHaveBeenCalledTimes(1);
  });

  it("filtre systématiquement les données personnelles (PII) des propriétés", async () => {
    process.env.POSTHOG_API_KEY = "test-key";

    await captureServerEvent({
      distinctId: "session_456",
      event: "sensitive_event",
      properties: {
        email: "contact@example.com",
        name: "Jean Dupont",
        phone: "+33612345678",
        message: "Message privé",
        content: "Texte sensible",
        safe_counter: 42,
      },
    });

    expect(mockCapture).toHaveBeenCalledTimes(1);
    const capturedProps = mockCapture.mock.calls[0][0].properties;

    expect(capturedProps.email).toBeUndefined();
    expect(capturedProps.name).toBeUndefined();
    expect(capturedProps.phone).toBeUndefined();
    expect(capturedProps.message).toBeUndefined();
    expect(capturedProps.content).toBeUndefined();
    expect(capturedProps.safe_counter).toBe(42);
  });
});
