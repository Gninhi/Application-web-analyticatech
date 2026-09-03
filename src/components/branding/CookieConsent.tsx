"use client";

import { useState, useEffect } from "react";
import { Cookie, Check, X, Sliders, Shield, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

export const CONSENT_KEY = "at-cookie-consent";
export const CONSENT_VERSION = "2.0"; // Bump version 2.0 pour alignement strict CNIL 2026
export const CONSENT_VALIDITY_DAYS = 180; // 6 mois de validité conformément aux recommandations CNIL
export const CONSENT_MAX_AGE_MS = CONSENT_VALIDITY_DAYS * 24 * 60 * 60 * 1000;

export interface ConsentChoices {
  essential: true;
  analytics: boolean;
}

export interface ConsentProof {
  version: string;
  timestamp: number;
  expiresAt: number;
  choices: ConsentChoices;
}

/**
 * Lit la preuve de consentement stockée en localStorage et vérifie sa validité dans le temps.
 */
export function getStoredConsentProof(): ConsentProof | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;

    const data: ConsentProof = JSON.parse(stored);
    if (data.version !== CONSENT_VERSION) return null;

    // Règle CNIL : expiration stricte à 6 mois
    if (!data.expiresAt || Date.now() > data.expiresAt) {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }

    return data;
  } catch {
    // localStorage corrompu ou restreint (mode navigation privée)
    return null;
  }
}

/**
 * Indique si la mesure d'audience (PostHog EU) a reçu un consentement explicite et valide.
 */
export function isAnalyticsAllowed(): boolean {
  const proof = getStoredConsentProof();
  return proof?.choices?.analytics === true;
}

/**
 * Compatibilité ascendante avec l'ancien helper binaire.
 */
export function getStoredConsent(): "accepted" | "refused" | null {
  const proof = getStoredConsentProof();
  if (!proof) return null;
  return proof.choices.analytics ? "accepted" : "refused";
}

/**
 * CookieConsent — bandeau de consentement cookies conforme à la doctrine CNIL 2026
 * et sublimé selon le thème « Liquid Glass » d'Analyticatech.
 *
 * Exigences respectées :
 * - Symétrie visuelle stricte : « Tout accepter » et « Tout refuser » utilisent le composant officiel <Button />,
 *   avec les mêmes dimensions (h-10), la même typographie JetBrains Mono uppercase et un contraste WCAG AAA/AA.
 * - Aucune asymétrie de couleur déceptive (dark-pattern / nudge proscrit).
 * - Fermeture (croix) équivalente au refus explicite.
 * - Granularité par finalité (Traceurs essentiels vs Mesure d'audience PostHog EU).
 * - Durée de conservation limitée à 6 mois avec preuve horodatée.
 * - Réouverture permanente à tout moment via l'événement `at:open-cookie-preferences` déclenché depuis le footer.
 */
export function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<"summary" | "customize">("summary");
  const [analyticsEnabled, setAnalyticsEnabled] = useState(() => {
    const proof = getStoredConsentProof();
    return proof?.choices.analytics ?? false;
  });

  useEffect(() => {
    const proof = getStoredConsentProof();
    if (!proof) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  // Écouteur pour rouvrir les préférences depuis le footer ("Gérer mes cookies")
  useEffect(() => {
    const handleOpenPreferences = () => {
      const proof = getStoredConsentProof();
      setAnalyticsEnabled(proof?.choices?.analytics ?? false);
      setView("customize");
      setVisible(true);
    };

    window.addEventListener("at:open-cookie-preferences", handleOpenPreferences);
    return () => {
      window.removeEventListener("at:open-cookie-preferences", handleOpenPreferences);
    };
  }, []);

  const savePreferences = (choices: ConsentChoices) => {
    const now = Date.now();
    const proof: ConsentProof = {
      version: CONSENT_VERSION,
      timestamp: now,
      expiresAt: now + CONSENT_MAX_AGE_MS,
      choices,
    };

    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(proof));
    } catch {
      // localStorage indisponible (mode privé)
    }

    // Notification globale pour les services abonnés (PostHog client)
    window.dispatchEvent(
      new CustomEvent("at:consent-change", {
        detail: proof,
      })
    );

    setVisible(false);
    setView("summary");
  };

  const handleAcceptAll = () => {
    savePreferences({ essential: true, analytics: true });
  };

  const handleRefuseAll = () => {
    savePreferences({ essential: true, analytics: false });
  };

  const handleSaveCustom = () => {
    savePreferences({ essential: true, analytics: analyticsEnabled });
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg md:max-w-xl z-[90] transition-all duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-8 pointer-events-none"
      )}
      role="dialog"
      aria-label={t("cookie.title")}
      aria-modal="false"
      aria-live="polite"
      aria-hidden={!visible}
    >
      <div className="glass-card rounded-2xl border border-black/15 dark:border-white/15 p-5 md:p-6 shadow-2xl bg-white/95 dark:bg-[#011C40]/95 backdrop-blur-2xl">
        {/* En-tête avec Kicker technique // et icône dédiée */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 text-[#F26D3D] shadow-xs">
            <Cookie className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="flex-1 min-w-0">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-[#F26D3D] mb-0.5 font-semibold">
              {"// "}{view === "summary" ? "CONFIDENTIALITÉ & TRACEURS" : "PARAMÉTRAGE GRANULAIRE"}
            </span>
            <h2 className="font-display text-base md:text-lg font-bold text-slate-900 dark:text-slate-50 leading-tight">
              {t("cookie.title")}
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {t("cookie.desc")}
            </p>
          </div>
          {/* Fermeture par la croix = Refus explicite (Doctrine CNIL 2026) */}
          <button
            type="button"
            onClick={handleRefuseAll}
            aria-label={t("cookie.close")}
            tabIndex={visible ? 0 : -1}
            className="shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-lg border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {view === "summary" ? (
          /* ============================================================ */
          /* VUE 1 : NIVEAU SYNTHÉTIQUE AVEC PARITÉ VISUELLE STRICTE     */
          /* ============================================================ */
          <>
            <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
              {/* Tout accepter */}
              <Button
                onClick={handleAcceptAll}
                variant="primary"
                size="sm"
                borderRadius="0.75rem"
                tabIndex={visible ? 0 : -1}
                icon={<Check className="h-4 w-4" aria-hidden="true" />}
                className="flex-1 font-mono uppercase tracking-wider text-xs font-semibold h-10"
              >
                {t("cookie.accept")}
              </Button>

              {/* Tout refuser : Même dimension, même typographie, fond solide bleu nuit haute visibilité */}
              <Button
                onClick={handleRefuseAll}
                variant="secondary"
                size="sm"
                borderRadius="0.75rem"
                tabIndex={visible ? 0 : -1}
                icon={<X className="h-4 w-4" aria-hidden="true" />}
                className="flex-1 font-mono uppercase tracking-wider text-xs font-semibold h-10 bg-[#022859] hover:bg-[#022873] text-white border border-[#3B82F6]/30 dark:bg-[#022859] dark:hover:bg-[#022873] dark:text-white dark:border-white/20 shadow-xs"
              >
                {t("cookie.refuse")}
              </Button>
            </div>

            {/* Bouton Personnaliser */}
            <div className="mt-2.5">
              <Button
                onClick={() => setView("customize")}
                variant="outline"
                size="sm"
                borderRadius="0.75rem"
                tabIndex={visible ? 0 : -1}
                icon={<Sliders className="h-3.5 w-3.5 text-[#F26D3D]" aria-hidden="true" />}
                className="w-full font-mono uppercase tracking-wider text-xs h-9 text-slate-700 dark:text-slate-300 hover:text-[#F26D3D] dark:hover:text-[#F26D3D]"
              >
                {t("cookie.customize")}
              </Button>
            </div>
          </>
        ) : (
          /* ============================================================ */
          /* VUE 2 : NIVEAU GRANULAIRE (PARAMÉTRAGE PAR FINALITÉ)        */
          /* ============================================================ */
          <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-0.5">
            {/* Finalité 1 : Cookies techniques nécessaires */}
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-3.5 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span className="font-display text-xs font-bold text-slate-900 dark:text-slate-100">
                    {t("cookie.category.essential.title")}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider">
                  <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                  {t("cookie.category.essential.alwaysActive")}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                {t("cookie.category.essential.desc")}
              </p>
            </div>

            {/* Finalité 2 : Mesure d'audience & Télémétrie (PostHog EU) */}
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-3.5 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label
                  htmlFor="cookie-toggle-analytics"
                  className="font-display text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer select-none"
                >
                  {t("cookie.category.analytics.title")}
                </label>
                {/* Cyber-switch glissant accessible */}
                <button
                  id="cookie-toggle-analytics"
                  type="button"
                  role="switch"
                  aria-checked={analyticsEnabled}
                  onClick={() => setAnalyticsEnabled((prev) => !prev)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26D3D] focus-visible:ring-offset-2",
                    analyticsEnabled
                      ? "bg-[#F26D3D] shadow-[0_0_12px_rgba(242,109,61,0.45)]"
                      : "bg-slate-300 dark:bg-slate-700"
                  )}
                >
                  <span className="sr-only">{t("cookie.category.analytics.title")}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                      analyticsEnabled ? "translate-x-5" : "translate-x-0.5 mt-0.5"
                    )}
                  />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                {t("cookie.category.analytics.desc")}
              </p>
            </div>

            {/* Actions de la vue personnalisation */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                onClick={handleSaveCustom}
                variant="primary"
                size="sm"
                borderRadius="0.75rem"
                icon={<Check className="h-4 w-4" aria-hidden="true" />}
                className="flex-1 font-mono uppercase tracking-wider text-xs font-semibold h-10"
              >
                {t("cookie.save")}
              </Button>
              <Button
                onClick={() => setView("summary")}
                variant="outline"
                size="sm"
                borderRadius="0.75rem"
                icon={<ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />}
                className="font-mono uppercase tracking-wider text-xs h-10 text-slate-700 dark:text-slate-300"
              >
                {t("cookie.banner.back")}
              </Button>
            </div>
          </div>
        )}

        {/* Note de bas de carte avec conformité CNIL 2026 */}
        <div className="mt-3.5 pt-3 border-t border-black/10 dark:border-white/10">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-tight leading-relaxed">
            {t("cookie.rgpd")}
          </p>
        </div>
      </div>
    </div>
  );
}
