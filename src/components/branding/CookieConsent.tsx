"use client";

import { useState, useEffect } from "react";
import { Cookie, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

const CONSENT_KEY = "at-cookie-consent";
const CONSENT_VERSION = "1.0"; // bump si la politique change → re-demande le consentement

type ConsentChoice = "accepted" | "refused";

interface ConsentData {
  choice: ConsentChoice;
  version: string;
  timestamp: number;
}

/**
 * Vérifie si le consentement a déjà été donné pour la version courante.
 * Pure function, pas de setState.
 */
function hasValidConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      const data: ConsentData = JSON.parse(stored);
      return data.version === CONSENT_VERSION;
    }
  } catch {
    // localStorage corrompu → on re-demande
  }
  return false;
}

/**
 * CookieConsent — bandeau de consentement cookies RGPD.
 *
 * - S'affiche une seule fois (localStorage) tant que la version est valide.
 * - Boutons "Tout accepter" / "Tout refuser".
 * - Si refusé : aucun cookie non-essentiel n'est posé.
 * - Si accepté : autorise les cookies analytics.
 *
 * Optimisé CSS pur (zéro runtime Framer Motion).
 */
export function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hasValidConsent()) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const saveChoice = (choice: ConsentChoice) => {
    const data: ConsentData = {
      choice,
      version: CONSENT_VERSION,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    } catch {
      // localStorage indisponible (mode privé) → on continue sans persister
    }
    setVisible(false);
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[80] transition-all duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      )}
      role="dialog"
      aria-label={t("cookie.title")}
      aria-live="polite"
      aria-hidden={!visible}
    >
      <div className="glass-card rounded-2xl border border-black/15 dark:border-white/15 p-5 md:p-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#F26D3D]/40 bg-[#F26D3D]/10">
            <Cookie className="h-5 w-5 text-[#F26D3D]" aria-hidden />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50 mb-1">
              {t("cookie.title")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t("cookie.desc")}
            </p>
          </div>
          <Button
            onClick={() => saveChoice("refused")}
            aria-label={t("cookie.close")}
            iconOnly
            borderRadius="0.5rem"
            duration={4000}
            tabIndex={visible ? 0 : -1}
            icon={<X className="h-4 w-4" aria-hidden />}
            className="shrink-0 h-8 w-8 bg-white/10 dark:bg-white/5 backdrop-blur-md text-slate-500 hover:text-slate-400 dark:hover:text-slate-400 dark:text-slate-300"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            onClick={() => saveChoice("accepted")}
            variant="primary"
            size="sm"
            borderRadius="0.5rem"
            duration={2500}
            tabIndex={visible ? 0 : -1}
            icon={<Check className="h-4 w-4" aria-hidden />}
            className="flex-1 neon-glow"
          >
            {t("cookie.accept")}
          </Button>
          <Button
            onClick={() => saveChoice("refused")}
            variant="ghost"
            size="sm"
            borderRadius="0.5rem"
            duration={3000}
            tabIndex={visible ? 0 : -1}
            icon={<X className="h-4 w-4" aria-hidden />}
            className="flex-1"
          >
            {t("cookie.refuse")}
          </Button>
        </div>

        <p className="mt-3 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
          {t("cookie.rgpd")}
        </p>
      </div>
    </div>
  );
}
