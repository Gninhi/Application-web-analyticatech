import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const {
  mockInit,
  mockCapture,
  mockOptIn,
  mockOptOut,
  mockIdentify,
  mockReset,
  state,
} = vi.hoisted(() => ({
  mockInit: vi.fn(),
  mockCapture: vi.fn(),
  mockOptIn: vi.fn(),
  mockOptOut: vi.fn(),
  mockIdentify: vi.fn(),
  mockReset: vi.fn(),
  state: { hasOptedIn: false },
}));

vi.mock("posthog-js", () => {
  return {
    default: {
      init: mockInit,
      capture: mockCapture,
      opt_in_capturing: mockOptIn,
      opt_out_capturing: mockOptOut,
      has_opted_in_capturing: () => state.hasOptedIn,
      get_distinct_id: () => "ph_distinct_user_123",
      identify: mockIdentify,
      reset: mockReset,
    },
  };
});

// Mock de CookieConsent helper
vi.mock("@/components/branding/CookieConsent", () => ({
  getStoredConsent: vi.fn().mockReturnValue(null),
}));

import {
  initTelemetryClient,
  trackPageView,
  trackCtaClick,
  trackContactFormSubmitted,
  trackScrollDepth,
  trackClientException,
  identifyTelemetryUser,
  resetTelemetryUser,
  _resetClientForTesting,
} from "./instrumentation-client";

describe("instrumentation-client", () => {
  const originalWindow = (globalThis as unknown as { window?: unknown }).window;
  const originalDoc = (globalThis as unknown as { document?: unknown }).document;

  beforeEach(() => {
    vi.clearAllMocks();
    _resetClientForTesting();
    state.hasOptedIn = false;
    process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test_key";
    process.env.NEXT_PUBLIC_POSTHOG_HOST = "/_edge-relay";

    // Simule l'environnement navigateur dans le runner Node de Vitest
    (globalThis as unknown as { window: unknown }).window = {
      location: { href: "https://analyticatech.fr/solutions", pathname: "/solutions" },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    (globalThis as unknown as { document: unknown }).document = {
      title: "Solutions IA",
    };
  });

  afterEach(() => {
    (globalThis as unknown as { window?: unknown }).window = originalWindow;
    (globalThis as unknown as { document?: unknown }).document = originalDoc;
  });

  it("initialise PostHog avec opt_out_capturing_by_default: true et le reverse proxy", () => {
    initTelemetryClient();

    expect(mockInit).toHaveBeenCalledWith(
      "phc_test_key",
      expect.objectContaining({
        api_host: "/_edge-relay",
        ui_host: "https://eu.i.posthog.com",
        opt_out_capturing_by_default: true,
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: true,
        session_recording: expect.objectContaining({
          maskAllInputs: true,
          maskTextSelector: "*",
        }),
      })
    );
  });

  it("ne capture aucun événement si l'utilisateur n'a pas consenti (opt-out actif)", () => {
    initTelemetryClient();
    state.hasOptedIn = false;

    trackPageView("/services");
    trackCtaClick("hero_cta", "hero");
    trackContactFormSubmitted({ subject_length: 12, has_company: true });

    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("capture les événements lorsque l'utilisateur a consenti (opt-in actif)", () => {
    initTelemetryClient();
    state.hasOptedIn = true;

    trackPageView("/solutions", "Solutions IA");
    expect(mockCapture).toHaveBeenCalledWith(
      "$pageview",
      expect.objectContaining({
        pathname: "/solutions",
        title: "Solutions IA",
      })
    );

    trackCtaClick("demander_audit", "navbar", "/contact");
    expect(mockCapture).toHaveBeenCalledWith("cta_clicked", {
      cta_name: "demander_audit",
      location: "navbar",
      destination: "/contact",
    });

    trackScrollDepth(75, "/services");
    expect(mockCapture).toHaveBeenCalledWith("scroll_depth_reached", {
      depth_percent: 75,
      pathname: "/services",
    });
  });

  it("capture la soumission du formulaire de contact sans aucun contenu de message", () => {
    initTelemetryClient();
    state.hasOptedIn = true;

    trackContactFormSubmitted({
      subject_length: 25,
      has_company: true,
      reference: "AT-2026-TEST",
      locale: "fr",
    });

    expect(mockCapture).toHaveBeenCalledWith("contact_form_submitted", {
      subject_length: 25,
      has_company: true,
      reference: "AT-2026-TEST",
      locale: "fr",
      status: "success",
    });
  });

  it("capture les exceptions JavaScript avec le contexte sans données privées", () => {
    initTelemetryClient();
    state.hasOptedIn = true;

    const testError = new Error("Network timeout simulation");
    trackClientException(testError, { route: "/contact" });

    expect(mockCapture).toHaveBeenCalledWith(
      "$exception",
      expect.objectContaining({
        $exception_message: "Network timeout simulation",
        $exception_type: "Error",
        route: "/contact",
      })
    );
  });

  it("refuse catégoriquement d'utiliser une adresse email comme distinct_id", () => {
    initTelemetryClient();
    state.hasOptedIn = true;

    identifyTelemetryUser("john.doe@example.com", { role: "admin" });
    expect(mockIdentify).not.toHaveBeenCalled();

    identifyTelemetryUser("usr_hash_98a72b", { role: "admin" });
    expect(mockIdentify).toHaveBeenCalledWith("usr_hash_98a72b", { role: "admin" });
  });

  it("réinitialise l'utilisateur à la déconnexion", () => {
    initTelemetryClient();
    resetTelemetryUser();
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
