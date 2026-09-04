"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { SolutionsView } from "@/components/sections/SolutionsView";
import { SectionErrorBoundary } from "@/components/system/SectionErrorBoundary";

/** Route "/solutions" — vue Solutions protégée par Error Boundary. Navigation router-backed. */
export function SolutionsRoute() {
  const { handleNavigate, handleNavigateDetail } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="Catalogue Solutions">
      <SolutionsView onNavigate={handleNavigate} onNavigateDetail={handleNavigateDetail} />
    </SectionErrorBoundary>
  );
}