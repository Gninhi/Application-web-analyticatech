import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceByIndex, normalizeServiceIndex } from "@/lib/services/services.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { ServiceDetailRoute } from "@/components/routes/DetailRoutes";
import { getServiceDetailData } from "@/lib/content/services-detail-data";

export const revalidate = 86400; // 24h

export function generateStaticParams() {
  return [
    { index: "01" },
    { index: "02" },
    { index: "03" },
    { index: "04" },
  ];
}

interface Params {
  params: Promise<{ index: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { index } = await params;
  const normalizedIndex = normalizeServiceIndex(index);
  const locale = "fr";
  const service = await getServiceByIndex(normalizedIndex, locale);
  const detailData = getServiceDetailData(normalizedIndex, locale);

  if (!service && !detailData) {
    return { title: "Service introuvable — Analyticatech" };
  }

  const title = service?.title
    ? `${service.title} — Services | Analyticatech`
    : detailData
      ? `${detailData.heroTitle} ${detailData.heroAccent} — Services | Analyticatech`
      : "Service — Services | Analyticatech";

  const description = detailData
    ? detailData.heroSubtitle
    : service?.description ?? "Expertise et conseil en intelligence artificielle pour entreprises.";

  return buildPageMetadata({
    locale,
    path: `/services/${normalizedIndex}`,
    title,
    description,
  });

}

/** Route "/services/[index]" — détail d'un service (avec Schema.org JSON-LD pour le SEO). */
export default async function ServiceDetailPage({ params }: Params) {
  const { index } = await params;
  const normalizedIndex = normalizeServiceIndex(index);
  const locale = "fr";
  const service = await getServiceByIndex(normalizedIndex, locale);
  const detailData = getServiceDetailData(normalizedIndex, locale);


  if (!service && !detailData) {
    notFound();
  }

  // Schéma JSON-LD Service & FAQPage pour Google Search Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://analyticatech.fr/services/${normalizedIndex}#service`,
        name: detailData ? `${detailData.heroTitle} ${detailData.heroAccent}` : service?.title,
        description: detailData?.heroSubtitle ?? service?.description,
        provider: {
          "@type": "Organization",
          name: "Analyticatech",
          url: "https://analyticatech.fr",
        },
        serviceType: detailData?.eyebrow ?? "Conseil en Intelligence Artificielle",
        areaServed: "FR",
      },
      ...(detailData
        ? [
            {
              "@type": "FAQPage",
              "@id": `https://analyticatech.fr/services/${normalizedIndex}#faq`,
              mainEntity: detailData.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceDetailRoute index={normalizedIndex} />
    </>
  );
}