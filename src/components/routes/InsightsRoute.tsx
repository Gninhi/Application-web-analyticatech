"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { BlogView } from "@/components/sections/BlogView";
import { SectionErrorBoundary } from "@/components/system/SectionErrorBoundary";

/** Route "/insights" — vue Insights (articles). Navigation router-backed. */
export function InsightsRoute() {
  const { handleNavigateDetail } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="Insights & Analyses">
      <BlogView onNavigateDetail={handleNavigateDetail} />
    </SectionErrorBoundary>
  );
}