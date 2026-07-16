"use client";

import { SERVICES } from "@/lib/data";
import { SERVICE_ICONS } from "@/lib/services";
import { ArrowUpRight } from "lucide-react";
import type { ViewKey } from "@/lib/data";

interface ServiceTickerProps {
  onNavigate: (view: ViewKey) => void;
}

/**
 * ServiceTicker — barre de défilement dynamique des services.
 * Les 5 services défilent horizontalement en boucle infinie.
 * Au survol : pause + clic possible pour aller vers Services.
 */
export function ServiceTicker({ onNavigate }: ServiceTickerProps) {
  // Duplication pour la boucle continue
  const doubled = [...SERVICES, ...SERVICES];

  return (
    <section
      aria-label="Nos services en défilement"
      className="relative border-y border-white/10 bg-[#011C40]/60 backdrop-blur-sm marquee-container"
    >
      <div className="marquee-track py-4">
        {doubled.map((service, i) => {
          const IconComponent = SERVICE_ICONS[service.icon] ?? SERVICE_ICONS.BrainCircuit;
          return (
            <button
              key={`${service.index}-${i}`}
              onClick={() => onNavigate("services")}
              className="group flex items-center gap-3 px-6 shrink-0 transition-colors hover:text-[#F26D3D] text-slate-200"
              aria-label={`Voir le service : ${service.title}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F26D3D]/30 bg-[#F26D3D]/10">
                <IconComponent className="h-4 w-4 text-[#F26D3D]" aria-hidden />
              </span>
              <span className="font-display text-lg md:text-xl font-bold tracking-tight whitespace-nowrap">
                {service.title}
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-[#F26D3D] transition-colors" aria-hidden />
              <span className="text-slate-600 mx-2" aria-hidden>|</span>
            </button>
          );
        })}
      </div>
      {/* Dégradés de fondu sur les bords */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#011C40] to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#011C40] to-transparent" aria-hidden />
    </section>
  );
}
