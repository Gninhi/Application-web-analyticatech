import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAppContent } from "@/lib/services/content.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { PostDetailRoute } from "@/components/routes/DetailRoutes";

export const revalidate = 3600; // 1h

export async function generateStaticParams() {
  const content = await getAppContent("fr");
  return content.blogPosts.map((p) => ({ slug: p.slug }));
}

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = "fr";
  const content = await getAppContent(locale);
  const post = content.blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Article introuvable" };
  }

  return buildPageMetadata({
    locale,
    path: `/insights/${slug}`,
    title: `${post.title} — Insight`,
    description: post.excerpt,
  });
}

/** Route "/insights/[slug]" — détail d'un article (résolu par slug). */
export default async function PostDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = "fr";
  const content = await getAppContent(locale);
  const post = content.blogPosts.find((p) => p.slug === slug);


  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `https://analyticatech.fr/insights/${slug}#article`,
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
    inLanguage: "fr-FR",
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