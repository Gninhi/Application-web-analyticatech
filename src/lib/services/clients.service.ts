import { cache } from "react";
import { db } from "@/lib/db/client";
import type { ClientLogoDTO } from "@/types/content";

export const getClientLogos = cache(async (): Promise<ClientLogoDTO[]> => {
  const raw = await db.clientLogo.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return raw.map((c) => ({
    id: c.id,
    name: c.name,
    sector: c.sector,
    logoUrl: c.logoUrl,
    websiteUrl: c.websiteUrl,
    order: c.order,
  }));
});
