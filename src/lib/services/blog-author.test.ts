import { describe, expect, it } from "vitest";
import { getBlogPosts } from "@/lib/services/blog.service";
import { BLOG_CONFIG } from "@/lib/content/site";

describe("Blog Author Configuration & Harmonization", () => {
  it("BLOG_CONFIG expose un auteur par défaut configurable", () => {
    expect(BLOG_CONFIG.defaultAuthor).toBeDefined();
    expect(BLOG_CONFIG.defaultAuthor).toBe("Martial GNINHI");
  });

  it("getBlogPosts retourne l'auteur configuré pour tous les articles", async () => {
    const postsFr = await getBlogPosts("fr");
    expect(postsFr.length).toBeGreaterThan(0);

    for (const post of postsFr) {
      expect(post.author).toBe(BLOG_CONFIG.defaultAuthor);
      // Vérifie qu'aucun auteur fictif ne subsiste
      expect(post.author).not.toBe("L. Marchand");
      expect(post.author).not.toBe("S. Benali");
      expect(post.author).not.toBe("T. Nguyen");
      expect(post.author).not.toBe("C. Roth");
      expect(post.author).not.toBe("AnalyticaTech Lab");
    }

    const postsEn = await getBlogPosts("en");
    expect(postsEn.length).toBeGreaterThan(0);

    for (const post of postsEn) {
      expect(post.author).toBe(BLOG_CONFIG.defaultAuthor);
    }
  });
});
