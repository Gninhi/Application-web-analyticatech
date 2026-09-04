import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAppContent } from "@/lib/services/content.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { SolutionDetailRoute } from "@/components/routes/DetailRoutes";
import { getSolutionDetailData, SOLUTIONS_DETAIL_REGISTRY } from "@/lib/content/solutions-detail-data";

export const revalidate = 86400; // 24h

export async function generateStaticParams() {
  const content = await getAppContent("fr");
  const slugs = new Set<string>(content.solutions.map((s) => s.slug));
  Object.keys(SOLUTIONS_DETAIL_REGISTRY).forEach((s) => slugs.add(s));
  return Array.from(slugs).map((slug) => ({ slug }));
}

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = "fr";
  const content = await getAppContent(locale);
  const detailData = getSolutionDetailData(slug, locale);
  const solution = content.solutions.find((s) => s.slug === slug || (detailData && s.slug === detailData.slug));

  if (!solution && !detailData) {
    return { title: "Solution introuvable" };
  }

  const title = solution?.title ?? detailData?.title ?? "Solution sectorielle";
  const description = solution?.summary ?? detailData?.summary ?? "";
  const resolvedSlug = detailData?.slug ?? solution?.slug ?? slug;

  return buildPageMetadata({
    locale,
    path: `/solutions/${resolvedSlug}`,
    title: `${title} — Solution sectorielle`,
    description,
  });
}

/** Route "/solutions/[slug]" — détail d'une solution (résolue par slug ou alias). */
export default async function SolutionDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = "fr";
  const content = await getAppContent(locale);
  const detailData = getSolutionDetailData(slug, locale);
  const solution = content.solutions.find((s) => s.slug === slug || (detailData && s.slug === detailData.slug));

  if (!solution && !detailData) {
    notFound();
  }

  const resolvedTitle = solution?.title ?? detailData?.title ?? "Solution IA";
  const resolvedSummary = solution?.summary ?? detailData?.summary ?? "";
  const resolvedSector = solution?.sector ?? detailData?.sector ?? "Innovation";
  const resolvedSlug = detailData?.slug ?? solution?.slug ?? slug;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://analyticatech.fr/solutions/${resolvedSlug}#solution`,
    name: resolvedTitle,
    description: resolvedSummary,
    serviceType: `Solution IA Sectorielle — ${resolvedSector}`,
    provider: {
      "@type": "Organization",
      name: "Analyticatech",
      url: "https://analyticatech.fr",
    },
    areaServed: "FR",
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