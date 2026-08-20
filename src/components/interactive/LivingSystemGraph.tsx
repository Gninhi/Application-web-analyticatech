"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, BrainCircuit, Workflow, BarChart3, ArrowRight, Activity, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface NodeItem {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Database;
  metrics: string;
  details: string[];
}

const NODES: NodeItem[] = [
  {
    id: "data",
    step: "01",
    title: "Données",
    subtitle: "Ingestion & Centralisation",
    description: "Captation continue des flux bruts (ERP, CRM, logs, bases SQL/NoSQL) avec nettoyage et souveraineté.",
    icon: Database,
    metrics: "1.2M events/s",
    details: ["Connecteurs natifs REST/gRPC", "Chiffrement AES-256 bout en bout", "Conformité RGPD / SecNumCloud"],
  },
  {
    id: "intelligence",
    step: "02",
    title: "Intelligence",
    subtitle: "RAG & Noyau Cognitif",
    description: "Enrichissement vectoriel, modélisation RAG et raisonnement LLM à faible latence et zéro hallucination.",
    icon: BrainCircuit,
    metrics: "320 ms latence",
    details: ["Modèles hybrides (SaaS / Sovereign)", "Bases vectorielles distribuées", "Garde-fous de sécurité & auditability"],
  },
  {
    id: "orchestration",
    step: "03",
    title: "Orchestration",
    subtitle: "Workflows & Multi-Agents",
    description: "Exécution automatisée de tâches complexes avec gestion d'état, boucle d'approbation et reprise sur erreur.",
    icon: Workflow,
    metrics: "99.98% fiabilité",
    details: ["Agents autonomes en réseau", "Orchestration n8n / Temporal", "Human-in-the-loop configurable"],
  },
  {
    id: "decision",
    step: "04",
    title: "Décision",
    subtitle: "Pilotage & Impact Métier",
    description: "Dashboards exécutifs temps réel, déclenchement d'actions automatiques et mesure continue du ROI.",
    icon: BarChart3,
    metrics: "640 KPIs actifs",
    details: ["Couche sémantique dbt / PowerBI", "Alertes prédictives sur dérive", "Restitutions visuelles décisionnelles"],
  },
];

export function LivingSystemGraph() {
  const [activeNodeId, setActiveNodeId] = useState<string>("intelligence");

  return (
    <div className="relative overflow-hidden glass-card rounded-3xl p-6 md:p-10 transition-all">
      {/* Halo lumineux d'arrière-plan */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-20 transition-all duration-700 blur-3xl"
        style={{
          background: activeNodeId === "data"
            ? "radial-gradient(circle, #022873, transparent)"
            : activeNodeId === "intelligence"
            ? "radial-gradient(circle, #F26D3D, transparent)"
            : activeNodeId === "orchestration"
            ? "radial-gradient(circle, #022859, transparent)"
            : "radial-gradient(circle, #4CAF50, transparent)",
        }}
        aria-hidden
      />

      {/* En-tête de section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-black/10 dark:border-white/10">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D]">
            02 — SYSTÈME VIVANT
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
            De la donnée à la décision
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 dark:text-slate-300 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full self-start md:self-auto">
          <Activity className="h-3.5 w-3.5 text-[#F26D3D] animate-pulse" aria-hidden />
          <span>Flux actif · Survolez un nœud pour explorer</span>
        </div>
      </div>

      {/* Graphe Visuel des 4 Nœuds */}
      <div className="my-8 relative">
        {/* Lignes de connexion SVG */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none hidden md:block"
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#022873" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#F26D3D" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            d="M 125 60 L 375 60 L 625 60 L 875 60"
            fill="none"
            stroke="url(#flowGrad)"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        </svg>

        {/* Grille des Nœuds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {NODES.map((node, index) => {
            const Icon = node.icon;
            const isActive = activeNodeId === node.id;
            return (
              <motion.button
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                onMouseEnter={() => setActiveNodeId(node.id)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex flex-col text-left p-5 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? "border-[#F26D3D] glass-strong shadow-lg shadow-[#F26D3D]/10"
                    : "glass hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                {/* Badge numéro */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#C9470F] text-white"
                        : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {node.step}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-slate-300">
                    {node.metrics}
                  </span>
                </div>

                {/* Icône & Titre */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2.5 rounded-xl transition-colors ${
                      isActive
                        ? "bg-[#F26D3D]/20 text-[#F26D3D]"
                        : "bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900 dark:text-slate-50 text-base">
                      {node.title}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-300">
                      {node.subtitle}
                    </p>
                  </div>
                </div>

                {/* Indicateur de flux connecté */}
                {index < NODES.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-6 w-6 items-center justify-center rounded-full bg-slate-200 dark:bg-white/15 border border-black/10 dark:border-white/20 text-[#F26D3D]">
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Fiche de détail du nœud sélectionné.
          Crossfade "grid-stack" : tous les panneaux sont empilés dans la même
          cellule (hauteur = max des panneaux → zéro saut de mise en page) et
          seul celui actif est visible/interactif. */}
      <div className="mt-6 grid">
        {NODES.map((node) => {
          const isActive = node.id === activeNodeId;
          return (
            <motion.div
              key={node.id}
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              inert={!isActive}
              className={cn(
                "col-start-1 row-start-1 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 p-5 md:p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6",
                !isActive && "pointer-events-none"
              )}
              aria-hidden={!isActive}
            >
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs text-[#F26D3D] font-bold">Nœud {node.step}</span>
                  <span className="text-slate-300 dark:text-slate-300">•</span>
                  <span className="font-display font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {node.title} : {node.subtitle}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {node.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-black/10 dark:border-white/10 pt-4 md:pt-0 md:pl-6">
                {node.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F26D3D] shrink-0" aria-hidden />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
