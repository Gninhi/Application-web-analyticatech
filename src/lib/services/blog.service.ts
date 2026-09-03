import { cache } from "react";
import { db } from "@/lib/db/client";
import { BLOG_CONFIG } from "@/lib/content/site";
import type { BlogPostDTO, BlogCategoryDTO, Locale } from "@/types/content";
import {
  FALLBACK_BLOG_CATEGORIES_FR,
  FALLBACK_BLOG_CATEGORIES_EN,
  FALLBACK_BLOG_POSTS_FR,
  FALLBACK_BLOG_POSTS_EN,
} from "@/lib/content/fallbacks";

const resolveAuthor = (author?: string | null): string => {
  if (BLOG_CONFIG.overrideAllAuthors) return BLOG_CONFIG.defaultAuthor;
  if (!author || author.trim() === "") return BLOG_CONFIG.defaultAuthor;
  const fictitious = [
    "l. marchand",
    "s. benali",
    "t. nguyen",
    "c. roth",
    "analyticatech lab",
    "lead architect",
    "data practice",
  ];
  if (fictitious.includes(author.trim().toLowerCase())) return BLOG_CONFIG.defaultAuthor;
  return author;
};

export const getBlogCategories = cache(async (locale: Locale = "fr"): Promise<BlogCategoryDTO[]> => {
  const fallback = locale === "en" ? FALLBACK_BLOG_CATEGORIES_EN : FALLBACK_BLOG_CATEGORIES_FR;
  try {
    const raw = await db.blogCategory.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale: locale } },
      },
    });

    if (!raw || raw.length === 0) return fallback;

    return raw.map((c) => ({
      id: c.id,
      key: c.key,
      label: c.translations[0]?.label || c.key,
      colorClass: c.colorClass,
      order: c.order,
    }));
  } catch {
    return fallback;
  }
});

export const getBlogPosts = cache(async (locale: Locale = "fr"): Promise<BlogPostDTO[]> => {
  const fallback = locale === "en" ? FALLBACK_BLOG_POSTS_EN : FALLBACK_BLOG_POSTS_FR;
  try {
    const raw = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      include: {
        category: {
          include: {
            translations: { where: { locale: locale } },
          },
        },
        translations: { where: { locale: locale } },
        tags: true,
      },
    });

    if (!raw || raw.length === 0) return fallback;

    return raw.map((p) => {
      const tr = p.translations[0] || { title: "", excerpt: "" };
      const catLabel = p.category?.translations?.[0]?.label || p.category?.key || "IA";
      return {
        id: p.id,
        slug: p.slug,
        title: tr.title,
        excerpt: tr.excerpt,
        categoryKey: p.category?.key || "ia",
        categoryLabel: catLabel,
        date: p.date.toISOString(),
        readingTime: p.readingTime,
        author: resolveAuthor(p.author),
        tags: p.tags.map((t) => t.tag),
      };
    });
  } catch {
    return fallback.map((p) => ({ ...p, author: resolveAuthor(p.author) }));
  }
});
