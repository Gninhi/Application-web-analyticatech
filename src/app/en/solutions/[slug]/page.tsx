import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAppContent } from "@/lib/services/content.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { SolutionDetailRoute } from "@/components/routes/DetailRoutes";

export const revalidate = 86400; // 24h

export async function generateStaticParams() {
  const content = await getAppContent("en");
  return content.solutions.map((s) => ({ slug: s.slug }));
}

interface Params {
  params: Promise<{ slug: string }>;
}


export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = await getAppContent("en");
  const solution = content.solutions.find((s) => s.slug === slug);

  if (!solution) {
    return { title: "Solution not found" };
  }

  return buildPageMetadata({
    locale: "en",
    path: `/en/solutions/${slug}`,
    title: `${solution.title} — Sector Solution`,
    description: solution.summary,
  });
}

/** Route "/en/solutions/[slug]" — English Solution detail view. */
export default async function SolutionDetailPageEn({ params }: Params) {
  const { slug } = await params;
  const content = await getAppContent("en");
  const solution = content.solutions.find((s) => s.slug === slug);

  if (!solution) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://analyticatech.fr/en/solutions/${slug}#solution`,
    name: solution.title,
    description: solution.summary,
    serviceType: `Sector AI Solution — ${solution.sector}`,
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
      <SolutionDetailRoute slug={slug} />
    </>
  );
}
