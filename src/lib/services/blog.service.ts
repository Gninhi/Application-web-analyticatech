import { cache } from "react";
import { BLOG_CONFIG } from "@/lib/content/site";
import type { BlogPostDTO, BlogCategoryDTO, Locale } from "@/types/content";
import {
  FALLBACK_BLOG_CATEGORIES_FR,
  FALLBACK_BLOG_CATEGORIES_EN,
  FALLBACK_BLOG_POSTS_FR,
  FALLBACK_BLOG_POSTS_EN,
} from "@/lib/content/fallbacks";

/**
 * Articles : contenu versionné dans le code. La base n'est plus lue (ses
 * extraits contenaient des chiffres non sourcés et des auteurs fictifs).
 */
const resolveAuthor = (author?: string | null): string => {
  if (BLOG_CONFIG.overrideAllAuthors || !author || author.trim() === "") {
    return BLOG_CONFIG.defaultAuthor;
  }
  return author;
};

export const getBlogCategories = cache(async (locale: Locale = "fr"): Promise<BlogCategoryDTO[]> =>
  locale === "en" ? FALLBACK_BLOG_CATEGORIES_EN : FALLBACK_BLOG_CATEGORIES_FR
);

export const getBlogPosts = cache(async (locale: Locale = "fr"): Promise<BlogPostDTO[]> => {
  const posts = locale === "en" ? FALLBACK_BLOG_POSTS_EN : FALLBACK_BLOG_POSTS_FR;
  return posts.map((p) => ({ ...p, author: resolveAuthor(p.author) }));
});
