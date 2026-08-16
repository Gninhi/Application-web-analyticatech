import { cache } from "react";
import { db } from "@/lib/db/client";
import type { BlogPostDTO, BlogCategoryDTO, Locale } from "@/types/content";

export const getBlogCategories = cache(async (locale: Locale = "fr"): Promise<BlogCategoryDTO[]> => {
  const raw = await db.blogCategory.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale: locale } },
    },
  });

  return raw.map((c) => ({
    id: c.id,
    key: c.key,
    label: c.translations[0]?.label || c.key,
    colorClass: c.colorClass,
    order: c.order,
  }));
});

export const getBlogPosts = cache(async (locale: Locale = "fr"): Promise<BlogPostDTO[]> => {
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

  return raw.map((p) => {
    const tr = p.translations[0] || { title: "", excerpt: "" };
    const catLabel = p.category.translations[0]?.label || p.category.key;
    return {
      id: p.id,
      slug: p.slug,
      title: tr.title,
      excerpt: tr.excerpt,
      categoryKey: p.category.key,
      categoryLabel: catLabel,
      date: p.date.toISOString(),
      readingTime: p.readingTime,
      author: p.author,
      tags: p.tags.map((t) => t.tag),
    };
  });
});
