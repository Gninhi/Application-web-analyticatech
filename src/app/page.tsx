import { cookies } from "next/headers";
import type { Metadata } from "next";
import { getAppContent } from "@/lib/services/content.service";
import { getSeoMetadata } from "@/lib/services/seo.service";
import { AppClientShell } from "@/components/layout/AppClientShell";
import type { Locale } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "fr";
  const seo = await getSeoMetadata(locale);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      url: seo.canonicalUrl,
      siteName: "Analyticatech",
      images: seo.ogImageUrl ? [{ url: seo.ogImageUrl }] : [],
      type: "website",
    },
    twitter: {
      card: seo.twitterCard as any,
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: seo.ogImageUrl ? [seo.ogImageUrl] : [],
    },
  };
}

/**
 * Server Component principal d'Analyticatech.
 * Récupère l'ensemble des données dynamiques depuis Supabase avec le cache React
 * et transmet le payload typé à la coquille client.
 */
export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "fr";
  const content = await getAppContent(locale);

  return <AppClientShell content={content} />;
}
