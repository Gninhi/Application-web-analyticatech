import { cache } from "react";
import { db } from "@/lib/db/client";
import type { TestimonialDTO, Locale } from "@/types/content";

export const getTestimonials = cache(async (locale: Locale = "fr"): Promise<TestimonialDTO[]> => {
  const raw = await db.testimonial.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale: locale as any } },
    },
  });

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
});
