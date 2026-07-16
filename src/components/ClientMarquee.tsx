"use client";

import { motion } from "framer-motion";

interface ClientMarqueeProps {
  clients: { name: string; sector: string }[];
}

/**
 * ClientMarquee — défilement infini des logos clients (section "Ils nous confient").
 * Deux pistes en sens opposés pour un effet premium.
 * Pause au survol.
 */
export function ClientMarquee({ clients }: ClientMarqueeProps) {
  // Duplication pour la boucle continue
  const doubled = [...clients, ...clients];

  if (clients.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Piste 1 — gauche → droite */}
      <div className="marquee-container relative overflow-hidden">
        <div className="marquee-track">
          {doubled.map((client, i) => (
            <span
              key={`${client.name}-${i}`}
              className="group flex items-center gap-3 px-6 shrink-0"
            >
              <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-slate-300 group-hover:text-[#F26D3D] transition-colors whitespace-nowrap">
                {client.name}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-[#F26D3D] transition-colors whitespace-nowrap">
                {client.sector}
              </span>
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#011C40] to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#011C40] to-transparent" aria-hidden />
      </div>

      {/* Piste 2 — droite → gauche (sens inverse) */}
      {clients.length > 6 && (
        <div className="marquee-container relative overflow-hidden">
          <div className="marquee-track-reverse">
            {[...doubled].reverse().map((client, i) => (
              <span
                key={`${client.name}-rev-${i}`}
                className="group flex items-center gap-3 px-6 shrink-0"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-[#F26D3D] transition-colors whitespace-nowrap">
                  {client.sector}
                </span>
                <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-slate-300 group-hover:text-[#F26D3D] transition-colors whitespace-nowrap">
                  {client.name}
                </span>
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#011C40] to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#011C40] to-transparent" aria-hidden />
        </div>
      )}
    </div>
  );
}
