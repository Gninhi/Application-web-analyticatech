import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getAppContent } from "@/lib/services/content.service";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { PostDetailRoute } from "@/components/routes/DetailRoutes";
import type { Locale } from "@/types/content";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
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
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  const content = await getAppContent(locale);
  const post = content.blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <PostDetailRoute slug={slug} />;
}