import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAppContent } from "@/lib/services/content.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { PostDetailRoute } from "@/components/routes/DetailRoutes";

export const revalidate = 3600; // 1h

export async function generateStaticParams() {
  const content = await getAppContent("en");
  return content.blogPosts.map((p) => ({ slug: p.slug }));
}

interface Params {
  params: Promise<{ slug: string }>;
}


export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = await getAppContent("en");
  const post = content.blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Article not found — Analyticatech" };
  }

  return buildPageMetadata({
    locale: "en",
    path: `/en/insights/${slug}`,
    title: `${post.title} — Insight | Analyticatech`,
    description: post.excerpt,
  });
}

/** Route "/en/insights/[slug]" — English Article detail view. */
export default async function PostDetailPageEn({ params }: Params) {
  const { slug } = await params;
  const content = await getAppContent("en");
  const post = content.blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `https://analyticatech.fr/en/insights/${slug}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Analyticatech",
      url: "https://analyticatech.fr",
    },
    inLanguage: "en-US",
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostDetailRoute slug={slug} />
    </>
  );
}
