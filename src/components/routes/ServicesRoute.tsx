"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { ServicesView } from "@/components/sections/ServicesView";
import { SectionErrorBoundary } from "@/components/system/SectionErrorBoundary";

/** Route "/services" — vue Services. Navigation router-backed. */
export function ServicesRoute() {
  const { handleNavigate, handleNavigateDetail } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="Expertises & Services">
      <ServicesView onNavigate={handleNavigate} onNavigateDetail={handleNavigateDetail} />
    </SectionErrorBoundary>
  );
}