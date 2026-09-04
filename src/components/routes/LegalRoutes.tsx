"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { LegalView } from "@/components/sections/LegalView";
import { MentionsLegalesView } from "@/components/sections/MentionsLegalesView";
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

/** Route "/mentions-legales" — Mentions légales conformes article 6-III LCEN. */
export function LegalMentionsRoute() {
  const { handleNavigate } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="Mentions Légales">
      <MentionsLegalesView onNavigate={handleNavigate} />
    </SectionErrorBoundary>
  );
}