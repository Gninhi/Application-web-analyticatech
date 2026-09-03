import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  CookieConsent,
  getStoredConsentProof,
  isAnalyticsAllowed,
  getStoredConsent,
  CONSENT_KEY,
  CONSENT_VERSION,
  CONSENT_MAX_AGE_MS,
  type ConsentProof,
} from "./CookieConsent";
import { I18nProvider } from "@/lib/i18n/provider";

describe("CookieConsent helpers & storage (CNIL 2026)", () => {
  let localStorageStore: Record<string, string> = {};

  beforeEach(() => {
    localStorageStore = {};
    const mockStorage = {
      getItem: (key: string) => localStorageStore[key] || null,
      setItem: (key: string, value: string) => {
        localStorageStore[key] = value;
      },
      removeItem: (key: string) => {
        delete localStorageStore[key];
      },
      clear: () => {
        localStorageStore = {};
      },
    };

    vi.stubGlobal("localStorage", mockStorage);
    vi.stubGlobal("window", {
      localStorage: mockStorage,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("retourne null si aucun consentement n'a été enregistré", () => {
    expect(getStoredConsentProof()).toBeNull();
    expect(isAnalyticsAllowed()).toBe(false);
    expect(getStoredConsent()).toBeNull();
  });

  it("retourne la preuve si elle est valide et date de moins de 6 mois", () => {
    const now = Date.now();
    const validProof: ConsentProof = {
      version: CONSENT_VERSION,
      timestamp: now,
      expiresAt: now + CONSENT_MAX_AGE_MS,
      choices: {
        essential: true,
        analytics: true,
      },
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(validProof));

    const proof = getStoredConsentProof();
    expect(proof).not.toBeNull();
    expect(proof?.choices.analytics).toBe(true);
    expect(isAnalyticsAllowed()).toBe(true);
    expect(getStoredConsent()).toBe("accepted");
  });

  it("invalide et supprime le consentement s'il a dépassé la durée maximale de 6 mois", () => {
    const pastTime = Date.now() - (CONSENT_MAX_AGE_MS + 1000); // Expiré
    const expiredProof: ConsentProof = {
      version: CONSENT_VERSION,
      timestamp: pastTime,
      expiresAt: pastTime + CONSENT_MAX_AGE_MS,
      choices: {
        essential: true,
        analytics: true,
      },
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(expiredProof));

    expect(getStoredConsentProof()).toBeNull();
    expect(isAnalyticsAllowed()).toBe(false);
    expect(localStorage.getItem(CONSENT_KEY)).toBeNull(); // Supprimé automatiquement
  });

  it("invalide le consentement si la version du bandeau a changé", () => {
    const now = Date.now();
    const oldVersionProof = {
      version: "1.0",
      timestamp: now,
      expiresAt: now + CONSENT_MAX_AGE_MS,
      choices: { essential: true, analytics: true },
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(oldVersionProof));

    expect(getStoredConsentProof()).toBeNull();
    expect(isAnalyticsAllowed()).toBe(false);
  });

  it("reflète fidèlement le refus de la mesure d'audience", () => {
    const now = Date.now();
    const refusedProof: ConsentProof = {
      version: CONSENT_VERSION,
      timestamp: now,
      expiresAt: now + CONSENT_MAX_AGE_MS,
      choices: {
        essential: true,
        analytics: false,
      },
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(refusedProof));

    expect(isAnalyticsAllowed()).toBe(false);
    expect(getStoredConsent()).toBe("refused");
  });
});

describe("CookieConsent component SSR markup", () => {
  it("rend le dialogue accessible et les boutons avec parité stricte", () => {
    const html = renderToStaticMarkup(
      <I18nProvider initialLocale="fr">
        <CookieConsent />
      </I18nProvider>
    );

    // Contient le dialogue et l'étiquette d'accessibilité
    expect(html).toContain('role="dialog"');
    // Contient les deux options principales
    expect(html).toContain("Tout accepter");
    expect(html).toContain("Tout refuser");
    // Contient l'option de personnalisation granulaire
    expect(html).toContain("Personnaliser");
  });
});
