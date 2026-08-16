"use client";

import { BrainCircuit, Cpu, Zap, Activity, CheckCircle2 } from "lucide-react";
import { InteractivePatternCard } from "@/components/interactive/InteractivePatternCard";

/**
 * HeroParallaxPatternShowcase — Vitrine interactive dans le Hero.
 * Remplace l'ancienne carte ASCII par un système parallaxe 3D avec motif de grille interactif.
 */
export function HeroParallaxPatternShowcase() {
  return (
    <InteractivePatternCard
      patternType="dots"
      badge="Système Vivant · Temps Réel"
      title="Noyau Cognitif & Operations IA"
      subtitle="Supervision continue des flux de données, modèles RAG et agents autonomes."
      glowColor="rgba(242, 109, 61, 0.28)"
      accentColor="#F26D3D"
      enableParallax={true}
      depth={16}
      className="w-full"
    >
      <div className="space-y-3.5 mt-2">
        {/* Nœud 1 : RAG Latency */}
        <div className="group/item flex items-center justify-between p-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md transition-colors hover:border-[#F26D3D]/50 hover:bg-black/10 dark:hover:bg-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#F26D3D]/10 text-[#F26D3D]">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pipeline RAG & Noyau
              </p>
              <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                Latence Vectorielle : <span className="text-[#F26D3D]">320 ms</span>
              </p>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
        </div>

        {/* Nœud 2 : Agents Routing */}
        <div className="group/item flex items-center justify-between p-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md transition-colors hover:border-[#022873]/50 hover:bg-black/10 dark:hover:bg-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Routage Multi-Agents
              </p>
              <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                Workflows Actifs : <span className="text-blue-400">124 agents</span>
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
            OK
          </span>
        </div>

        {/* Nœud 3 : High Availability */}
        <div className="group/item flex items-center justify-between p-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md transition-colors hover:border-purple-500/50 hover:bg-black/10 dark:hover:bg-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Disponibilité Système
              </p>
              <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                Uptime Opérationnel : <span className="text-purple-300">99.98 %</span>
              </p>
            </div>
          </div>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>
      </div>

      {/* Pied de carte avec invitation d'interaction */}
      <div className="mt-5 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <Activity className="h-3 w-3 text-[#F26D3D]" />
          Déplacez le curseur pour le parallaxe 3D
        </span>
        <span className="text-[#F26D3D]">Survol 3D ↗</span>
      </div>
    </InteractivePatternCard>
  );
}
