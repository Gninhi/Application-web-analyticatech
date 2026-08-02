"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Check, X } from "lucide-react";
import { Button } from "@/components/ui/moving-border";

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
 * - Si accepté : autorise les cookies analytics (à brancher ultérieurement).
 */
export function CookieConsent() {
  // État initial identique serveur/client (false) → pas d'hydration mismatch.
  // Le vrai check se fait dans useEffect (post-hydration) via rAF différé.
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
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[80]"
          role="dialog"
          aria-label="Consentement aux cookies"
          aria-live="polite"
        >
          <div className="glass-card rounded-2xl border border-black/15 dark:border-white/15 shadow-2xl shadow-black/50 p-5 md:p-6">
            <div className="flex items-start gap-3 mb-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#F26D3D]/40 bg-[#F26D3D]/10">
                <Cookie className="h-5 w-5 text-[#F26D3D]" aria-hidden />
              </span>
              <div className="flex-1">
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50 mb-1">
                  Cookies &amp; confidentialité
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Nous utilisons des cookies essentiels au fonctionnement du site
                  (sécurité, session). Avec votre accord, nous utilisons aussi des
                  cookies d&apos;analyse pour améliorer l&apos;expérience. Vous
                  pouvez refuser sans impact sur la navigation.
                </p>
              </div>
              <Button
                onClick={() => saveChoice("refused")}
                aria-label="Fermer le bandeau (refuser)"
                borderRadius="0.5rem"
                duration={4000}
                className="shrink-0 h-8 w-8 flex items-center justify-center bg-white/10 dark:bg-white/5 backdrop-blur-md text-slate-500 hover:text-slate-400 dark:hover:text-slate-400 dark:text-slate-300 transition-colors"
              >
                <X className="h-4 w-4" aria-hidden />
             </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                onClick={() => saveChoice("accepted")}
                borderRadius="0.5rem"
                duration={2500}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F26D3D] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#ff7a4a] neon-glow"
              >
                <Check className="h-4 w-4" aria-hidden />
                Tout accepter
            </Button>
              <Button
                onClick={() => saveChoice("refused")}
                borderRadius="0.5rem"
                duration={3000}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#03318C]/8 dark:bg-white/5 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#03318C] dark:text-slate-300 transition hover:bg-[#03318C]/15 dark:hover:bg-white/15"
              >
                <X className="h-4 w-4" aria-hidden />
                Tout refuser
            </Button>
          </div>

            <p className="mt-3 text-[10px] text-slate-500 font-mono">
              Conforme RGPD · Données stockées localement · Aucune revente
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
