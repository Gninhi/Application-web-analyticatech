import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAppContent } from "@/lib/services/content.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { SolutionDetailRoute } from "@/components/routes/DetailRoutes";

export const revalidate = 86400; // 24h

export async function generateStaticParams() {
  const content = await getAppContent("fr");
  return content.solutions.map((s) => ({ slug: s.slug }));
}

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = "fr";
  const content = await getAppContent(locale);
  const solution = content.solutions.find((s) => s.slug === slug);

  if (!solution) {
    return { title: "Solution introuvable" };
  }

  return buildPageMetadata({
    locale,
    path: `/solutions/${slug}`,
    title: `${solution.title} — Solution sectorielle`,
    description: solution.summary,
  });
}

/** Route "/solutions/[slug]" — détail d'une solution (résolue par slug). */
export default async function SolutionDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = "fr";
  const content = await getAppContent(locale);
  const solution = content.solutions.find((s) => s.slug === slug);


  if (!solution) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://analyticatech.fr/solutions/${slug}#solution`,
    name: solution.title,
    description: solution.summary,
    serviceType: `Solution IA Sectorielle — ${solution.sector}`,
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
      <SolutionDetailRoute slug={slug} />
    </>
  );
}