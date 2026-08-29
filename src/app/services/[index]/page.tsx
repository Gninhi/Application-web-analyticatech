import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getServiceByIndex } from "@/lib/services/services.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { ServiceDetailRoute } from "@/components/routes/DetailRoutes";
import type { Locale } from "@/types/content";

interface Params {
  params: Promise<{ index: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { index } = await params;
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  const service = await getServiceByIndex(index, locale);

  if (!service) {
    return { title: "Service introuvable" };
  }

  return buildPageMetadata({
    locale,
    path: `/services/${service.index}`,
    title: `${service.title} — Conseil en IA`,
    description: service.description,
  });
}

/** Route "/services/[index]" — détail d'un service (résolu par index normalisé). */
export default async function ServiceDetailPage({ params }: Params) {
  const { index } = await params;
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  const service = await getServiceByIndex(index, locale);

  if (!service) {
    notFound();
  }

  return <ServiceDetailRoute index={service.index} />;
}