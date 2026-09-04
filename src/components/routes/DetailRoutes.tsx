"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import {
  ServiceDetailView,
  SolutionDetailView,
  BlogDetailView,
} from "@/components/sections/DetailView";
import { SectionErrorBoundary } from "@/components/system/SectionErrorBoundary";

/** Route "/services/[index]" — détail d'un service. */
export function ServiceDetailRoute({ index }: { index: string }) {
  const { handleNavigate, handleNavigateDetail } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="Détail Service">
      <ServiceDetailView
        serviceIndex={index}
        onNavigate={handleNavigate}
        onNavigateDetail={handleNavigateDetail}
      />
    </SectionErrorBoundary>
  );
}

/** Route "/solutions/[slug]" — détail d'une solution. */
export function SolutionDetailRoute({ slug }: { slug: string }) {
  const { handleNavigate, handleNavigateDetail } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="Détail Solution">
      <SolutionDetailView
        solutionSlug={slug}
        onNavigate={handleNavigate}
        onNavigateDetail={handleNavigateDetail}
      />
    </SectionErrorBoundary>
  );
}

/** Route "/insights/[slug]" — détail d'un article. */
export function PostDetailRoute({ slug }: { slug: string }) {
  const { handleNavigate, handleNavigateDetail } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="Détail Article">
      <BlogDetailView
        postSlug={slug}
        onNavigate={handleNavigate}
        onNavigateDetail={handleNavigateDetail}
      />
    </SectionErrorBoundary>
  );
}