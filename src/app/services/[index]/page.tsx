import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getAppContent } from "@/lib/services/content.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { ServiceDetailRoute } from "@/components/routes/DetailRoutes";
import type { Locale } from "@/types/content";

interface Params {
  params: Promise<{ index: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { index } = await params;
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  const content = await getAppContent(locale);
  const service = content.services.find((s) => s.index === index);

  if (!service) {
    return { title: "Service introuvable" };
  }

  return buildPageMetadata({
    locale,
    path: `/services/${index}`,
    title: `${service.title} — Conseil en IA`,
    description: service.description,
  });
}

/** Route "/services/[index]" — détail d'un service (résolu par index). */
export default async function ServiceDetailPage({ params }: Params) {
  const { index } = await params;
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  const content = await getAppContent(locale);
  const service = content.services.find((s) => s.index === index);

  if (!service) {
    notFound();
  }

  return <ServiceDetailRoute index={index} />;
}