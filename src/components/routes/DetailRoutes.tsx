"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import {
  ServiceDetailView,
  SolutionDetailView,
  BlogDetailView,
} from "@/components/sections/DetailView";
import { SectionErrorBoundary } from "@/components/system/SectionErrorBoundary";
import type { ServiceDetailData } from "@/lib/content/services-detail-data";
import type { SolutionDetailData } from "@/types/solution-detail";
import type { InsightDetailData } from "@/types/insight-detail";

/** Route "/services/[index]" — détail d'un service. */
export function ServiceDetailRoute({ index, detailData }: { index: string; detailData: ServiceDetailData }) {
  const { handleNavigate, handleNavigateDetail } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="Détail Service">
      <ServiceDetailView
        serviceIndex={index}
        detailData={detailData}
        onNavigate={handleNavigate}
        onNavigateDetail={handleNavigateDetail}
      />
    </SectionErrorBoundary>
  );
}

/** Route "/solutions/[slug]" — détail d'une solution. */
export function SolutionDetailRoute({ slug, detailData }: { slug: string; detailData: SolutionDetailData | null }) {
  const { handleNavigate, handleNavigateDetail } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="Détail Solution">
      <SolutionDetailView
        solutionSlug={slug}
        detailData={detailData}
        onNavigate={handleNavigate}
        onNavigateDetail={handleNavigateDetail}
      />
    </SectionErrorBoundary>
  );
}

/** Route "/insights/[slug]" — détail d'un article. */
export function PostDetailRoute({ slug, detailData }: { slug: string; detailData: InsightDetailData | null }) {
  const { handleNavigate, handleNavigateDetail } = useViewNavigation();
  return (
    <SectionErrorBoundary sectionName="Détail Article">
      <BlogDetailView
        postSlug={slug}
        detailData={detailData}
        onNavigate={handleNavigate}
        onNavigateDetail={handleNavigateDetail}
      />
    </SectionErrorBoundary>
  );
}