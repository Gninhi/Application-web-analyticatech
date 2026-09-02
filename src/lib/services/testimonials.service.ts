import { cache } from "react";
import { db } from "@/lib/db/client";
import type { TestimonialDTO, Locale } from "@/types/content";
import { FALLBACK_TESTIMONIALS_FR, FALLBACK_TESTIMONIALS_EN } from "@/lib/content/fallbacks";

export const getTestimonials = cache(async (locale: Locale = "fr"): Promise<TestimonialDTO[]> => {
  const fallback = locale === "en" ? FALLBACK_TESTIMONIALS_EN : FALLBACK_TESTIMONIALS_FR;
  try {
    const raw = await db.testimonial.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale: locale } },
      },
    });

    if (!raw || raw.length === 0) return fallback;

    return raw.map((t) => {
      const tr = t.translations[0] || { quote: "", role: "", company: "" };
      return {
        id: t.id,
        author: t.author,
        role: tr.role,
        company: tr.company,
        quote: tr.quote,
        order: t.order,
      };
    });
  } catch {
    return fallback;
  }
});
