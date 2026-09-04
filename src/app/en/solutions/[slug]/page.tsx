import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAppContent } from "@/lib/services/content.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { SolutionDetailRoute } from "@/components/routes/DetailRoutes";
import { getSolutionDetailData, SOLUTIONS_DETAIL_REGISTRY } from "@/lib/content/solutions-detail-data";

export const revalidate = 86400; // 24h

export async function generateStaticParams() {
  const content = await getAppContent("en");
  const slugs = new Set<string>(content.solutions.map((s) => s.slug));
  Object.keys(SOLUTIONS_DETAIL_REGISTRY).forEach((s) => slugs.add(s));
  return Array.from(slugs).map((slug) => ({ slug }));
}

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = await getAppContent("en");
  const detailData = getSolutionDetailData(slug, "en");
  const solution = content.solutions.find((s) => s.slug === slug || (detailData && s.slug === detailData.slug));

  if (!solution && !detailData) {
    return { title: "Solution not found" };
  }

  const title = solution?.title ?? detailData?.title ?? "Sector Solution";
  const description = solution?.summary ?? detailData?.summary ?? "";
  const resolvedSlug = detailData?.slug ?? solution?.slug ?? slug;

  return buildPageMetadata({
    locale: "en",
    path: `/en/solutions/${resolvedSlug}`,
    title: `${title} — Sector Solution`,
    description,
  });
}

/** Route "/en/solutions/[slug]" — English Solution detail view. */
export default async function SolutionDetailPageEn({ params }: Params) {
  const { slug } = await params;
  const content = await getAppContent("en");
  const detailData = getSolutionDetailData(slug, "en");
  const solution = content.solutions.find((s) => s.slug === slug || (detailData && s.slug === detailData.slug));

  if (!solution && !detailData) {
    notFound();
  }

  const resolvedTitle = solution?.title ?? detailData?.title ?? "AI Solution";
  const resolvedSummary = solution?.summary ?? detailData?.summary ?? "";
  const resolvedSector = solution?.sector ?? detailData?.sector ?? "Innovation";
  const resolvedSlug = detailData?.slug ?? solution?.slug ?? slug;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://analyticatech.fr/en/solutions/${resolvedSlug}#solution`,
    name: resolvedTitle,
    description: resolvedSummary,
    serviceType: `Sector AI Solution — ${resolvedSector}`,
    provider: {
      "@type": "Organization",
      name: "Analyticatech",
      url: "https://analyticatech.fr",
    },
    areaServed: "Global",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SolutionDetailRoute slug={resolvedSlug} />
    </>
  );
}
