"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { LegalView } from "@/components/sections/LegalView";
import { SectionErrorBoundary } from "@/components/system/SectionErrorBoundary";

/** Route "/confidentialite" — Politique de confidentialité (RGPD). */
export function LegalRgpdRoute() {
  const { handleNavigate } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="Politique de Confidentialité">
      <LegalView type="rgpd" onNavigate={handleNavigate} />
    </SectionErrorBoundary>
  );
}

/**
 * Route "/mentions-legales" — Mentions légales (article 6-III LCEN).
 * Même source que la confidentialité (`legalSections`, FR et EN) : une seule
 * version du texte à tenir à jour, traduite sur /en/mentions-legales.
 */
export function LegalMentionsRoute() {
  const { handleNavigate } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="Mentions Légales">
      <LegalView type="legal" onNavigate={handleNavigate} />
    </SectionErrorBoundary>
  );
}