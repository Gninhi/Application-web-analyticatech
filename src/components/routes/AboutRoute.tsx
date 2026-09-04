"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { AboutView } from "@/components/sections/AboutView";
import { SectionErrorBoundary } from "@/components/system/SectionErrorBoundary";

/** Route "/a-propos" — vue À propos. Navigation router-backed. */
export function AboutRoute() {
  const { handleNavigate } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="À propos">
      <AboutView onNavigate={handleNavigate} />
    </SectionErrorBoundary>
  );
}