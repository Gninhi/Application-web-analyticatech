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
  const service = await getServiceByIndex(normalizedIndex, "en");
  const detailData = getServiceDetailData(normalizedIndex, "en");

  if (!service && !detailData) {
    return { title: "Service not found — Analyticatech" };
  }

  const title = service?.title
    ? `${service.title} — Services | Analyticatech`
    : detailData
      ? `${detailData.heroTitle} ${detailData.heroAccent} — Services | Analyticatech`
      : "Service — Services | Analyticatech";

  const description = detailData
    ? detailData.heroSubtitle
    : service?.description ?? "Enterprise AI architecture, RAG systems and autonomous agent orchestration.";

  return buildPageMetadata({
    locale: "en",
    path: `/en/services/${normalizedIndex}`,
    title,
    description,
  });

}

/** Route "/en/services/[index]" — English Service detail view. */
export default async function ServiceDetailPageEn({ params }: Params) {
  const { index } = await params;
  const normalizedIndex = normalizeServiceIndex(index);
  const service = await getServiceByIndex(normalizedIndex, "en");
  const detailData = getServiceDetailData(normalizedIndex, "en");

  if (!service && !detailData) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://analyticatech.fr/en/services/${normalizedIndex}#service`,
        name: detailData ? `${detailData.heroTitle} ${detailData.heroAccent}` : service?.title,
        description: detailData?.heroSubtitle ?? service?.description,
        provider: {
          "@type": "Organization",
          name: "Analyticatech",
          url: "https://analyticatech.fr",
        },
        serviceType: detailData?.eyebrow ?? "AI & Autonomous Systems Consulting",
        areaServed: "Global",
      },
      ...(detailData
        ? [
            {
              "@type": "FAQPage",
              "@id": `https://analyticatech.fr/en/services/${normalizedIndex}#faq`,
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
