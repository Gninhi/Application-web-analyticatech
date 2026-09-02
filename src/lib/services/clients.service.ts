import { cache } from "react";
import { db } from "@/lib/db/client";
import type { ClientLogoDTO } from "@/types/content";
import { FALLBACK_CLIENT_LOGOS } from "@/lib/content/fallbacks";

export const getClientLogos = cache(async (): Promise<ClientLogoDTO[]> => {
  try {
    const raw = await db.clientLogo.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });

    if (!raw || raw.length === 0) return FALLBACK_CLIENT_LOGOS;

    return raw.map((c) => ({
      id: c.id,
      name: c.name,
      sector: c.sector,
      logoUrl: c.logoUrl,
      websiteUrl: c.websiteUrl,
      order: c.order,
    }));
  } catch {
    return FALLBACK_CLIENT_LOGOS;
  }
});
