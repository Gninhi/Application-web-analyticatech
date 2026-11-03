"use client";

import { BlogView } from "@/components/sections/BlogView";
import { SectionErrorBoundary } from "@/components/system/SectionErrorBoundary";

/** Route "/insights" — vue Insights (articles). Les cartes sont de vrais liens vers les articles. */
export function InsightsRoute() {
  return (
    <SectionErrorBoundary sectionName="Insights & Analyses">
      <BlogView />
    </SectionErrorBoundary>
  );
}