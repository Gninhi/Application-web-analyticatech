import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAppContent } from "@/lib/services/content.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { PostDetailRoute } from "@/components/routes/DetailRoutes";
import { getInsightDetailData, INSIGHTS_DETAIL_REGISTRY } from "@/lib/content/insights-detail-data";

export const revalidate = 3600; // 1h

export async function generateStaticParams() {
  const content = await getAppContent("en");
  const slugs = new Set<string>(content.blogPosts.map((p) => p.slug));
  Object.keys(INSIGHTS_DETAIL_REGISTRY).forEach((s) => slugs.add(s));
  return Array.from(slugs).map((slug) => ({ slug }));
}

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = await getAppContent("en");
  const detailData = getInsightDetailData(slug, "en");
  const post = content.blogPosts.find((p) => p.slug === slug || (detailData && p.slug === detailData.slug));

  if (!post && !detailData) {
    return { title: "Article not found — Analyticatech" };
  }

  const title = post?.title ?? detailData?.hero.title ?? "Insight";
  const description = post?.excerpt ?? detailData?.hero.subtitle ?? "";
  const resolvedSlug = detailData?.slug ?? post?.slug ?? slug;

  return buildPageMetadata({
    locale: "en",
    path: `/en/insights/${resolvedSlug}`,
    title: `${title} — Insight | Analyticatech`,
    description,
  });
}

/** Route "/en/insights/[slug]" — English Article detail view. */
export default async function PostDetailPageEn({ params }: Params) {
  const { slug } = await params;
  const content = await getAppContent("en");
  const detailData = getInsightDetailData(slug, "en");
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
    "@id": `https://analyticatech.fr/en/insights/${resolvedSlug}#article`,
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
    inLanguage: "en-US",
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
