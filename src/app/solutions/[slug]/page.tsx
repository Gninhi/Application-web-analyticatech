import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getAppContent } from "@/lib/services/content.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { SolutionDetailRoute } from "@/components/routes/DetailRoutes";
import type { Locale } from "@/types/content";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
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
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  const content = await getAppContent(locale);
  const solution = content.solutions.find((s) => s.slug === slug);

  if (!solution) {
    notFound();
  }

  return <SolutionDetailRoute slug={slug} />;
}