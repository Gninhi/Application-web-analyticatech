import { cache } from "react";
import { db } from "@/lib/db/client";
import type { MetricDTO, Locale } from "@/types/content";

export const getMetrics = cache(async (locale: Locale = "fr"): Promise<MetricDTO[]> => {
  const raw = await db.metric.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return raw.map((m) => ({
    id: m.id,
    key: m.key,
    label: (locale === "en" && m.labelEn) ? m.labelEn : m.label,
    value: m.value,
    numericValue: m.numericValue,
    suffix: m.suffix,
    trend: m.trend,
    sparkline: Array.isArray(m.sparkline) ? (m.sparkline as number[]) : null,
    source: m.source,
    order: m.order,
  }));
});
