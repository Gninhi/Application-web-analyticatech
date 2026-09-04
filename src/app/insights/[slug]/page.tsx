import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAppContent } from "@/lib/services/content.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { PostDetailRoute } from "@/components/routes/DetailRoutes";
import { getInsightDetailData, INSIGHTS_DETAIL_REGISTRY } from "@/lib/content/insights-detail-data";

export const revalidate = 3600; // 1h

export async function generateStaticParams() {
  const content = await getAppContent("fr");
  const slugs = new Set<string>(content.blogPosts.map((p) => p.slug));
  Object.keys(INSIGHTS_DETAIL_REGISTRY).forEach((s) => slugs.add(s));
  return Array.from(slugs).map((slug) => ({ slug }));
}

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = "fr";
  const content = await getAppContent(locale);
  const detailData = getInsightDetailData(slug, locale);
  const post = content.blogPosts.find((p) => p.slug === slug || (detailData && p.slug === detailData.slug));

  if (!post && !detailData) {
    return { title: "Article introuvable" };
  }

  const title = post?.title ?? detailData?.hero.title ?? "Insight";
  const description = post?.excerpt ?? detailData?.hero.subtitle ?? "";
  const resolvedSlug = detailData?.slug ?? post?.slug ?? slug;

  return buildPageMetadata({
    locale,
    path: `/insights/${resolvedSlug}`,
    title: `${title} — Insight`,
    description,
  });
}

/** Route "/insights/[slug]" — détail d'un article (résolu par slug ou alias). */
export default async function PostDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = "fr";
  const content = await getAppContent(locale);
  const detailData = getInsightDetailData(slug, locale);
  const post = content.blogPosts.find((p) => p.slug === slug || (detailData && p.slug === detailData.slug));

  if (!post && !detailData) {
    notFound();
  }

  const resolvedTitle = post?.title ?? detailData?.hero.title ?? "Insight";
  const resolvedExcerpt = post?.excerpt ?? detailData?.hero.subtitle ?? "";
  const resolvedDate = post?.date ?? detailData?.publishedDate ?? "2025-01-01";
  const resolvedAuthor = post?.author ?? detailData?.author.name ?? "Martial GNINHI";
  const resolvedTags = post?.tags ?? detailData?.hero.tags ?? [];
  const resolvedSlug = detailData?.slug ?? post?.slug ?? slug;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `https://analyticatech.fr/insights/${resolvedSlug}#article`,
    headline: resolvedTitle,
    description: resolvedExcerpt,
    datePublished: resolvedDate,
    author: {
      "@type": "Person",
      name: resolvedAuthor,
    },
    publisher: {
      "@type": "Organization",
      name: "Analyticatech",
      url: "https://analyticatech.fr",
    },
    inLanguage: "fr-FR",
    keywords: resolvedTags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostDetailRoute slug={resolvedSlug} />
    </>
  );
}