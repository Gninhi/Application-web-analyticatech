"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Database, BrainCircuit, Workflow, BarChart3, ArrowRight, Activity, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
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

export function LivingSystemGraph() {
  const { locale } = useI18n();
  const [activeNodeId, setActiveNodeId] = useState<string>("intelligence");

  const isEn = locale === "en";


  const NODES: NodeItem[] = useMemo(
    () => [
      {
        id: "data",
        step: "01",
        title: isEn ? "Data" : "Données",
        subtitle: isEn ? "Collect & centralise" : "Collecter et centraliser",
        description: isEn
          ? "Your data is collected from the tools you already use (ERP management software, CRM customer database, spreadsheets, databases), then cleaned and kept under your control."
          : "Vos données sont collectées depuis les outils que vous utilisez déjà (ERP de gestion, CRM de suivi client, tableurs, bases de données), puis nettoyées et gardées sous votre contrôle.",
        icon: Database,
        metrics: isEn ? "Your existing tools" : "Vos outils existants",
        details: isEn
          ? ["Connectors to your software (APIs)", "Encryption in transit and at rest", "Hosting chosen with you (EU or your servers)"]
          : ["Connexion à vos logiciels (API)", "Chiffrement en transit et au repos", "Hébergement choisi avec vous (UE ou vos serveurs)"],
      },
      {
        id: "intelligence",
        step: "02",
        title: isEn ? "Intelligence" : "Intelligence",
        subtitle: isEn ? "Understanding & answering" : "Comprendre et répondre",
        description: isEn
          ? "A language model (LLM) answers from your own documents and cites its sources (RAG technique), with checks that limit made-up answers."
          : "Un modèle de langage (LLM) répond à partir de vos propres documents et cite ses sources (technique RAG), avec des contrôles qui limitent les réponses inventées.",
        icon: BrainCircuit,
        metrics: isEn ? "Sourced answers" : "Réponses sourcées",
        details: isEn
          ? ["Models hosted in France or Europe to fit your constraints", "Search across your internal documents", "Security guardrails and traceability"]
          : ["Modèles hébergés en France ou en Europe selon vos contraintes", "Recherche dans vos documents internes", "Garde-fous de sécurité et traçabilité"],
      },
      {
        id: "orchestration",
        step: "03",
        title: isEn ? "Orchestration" : "Orchestration",
        subtitle: isEn ? "Acting under control" : "Agir sous contrôle",
        description: isEn
          ? "AI agents carry out multi-step tasks, ask for human approval at sensitive steps and recover cleanly from errors."
          : "Des agents IA exécutent des tâches en plusieurs étapes, demandent une validation humaine aux étapes sensibles et reprennent proprement en cas d'erreur.",
        icon: Workflow,
        metrics: isEn ? "Human approval" : "Validation humaine",
        details: isEn
          ? ["Agents with defined roles", "Automated flows (n8n)", "Configurable human approval"]
          : ["Agents aux rôles définis", "Enchaînements automatisés (n8n)", "Validation humaine paramétrable"],
      },
      {
        id: "decision",
        step: "04",
        title: isEn ? "Decision" : "Décision",
        subtitle: isEn ? "Steering" : "Pilotage",
        description: isEn
          ? "Leadership dashboards, alerts when an indicator drifts, and regular measurement of return on investment (ROI)."
          : "Des tableaux de bord pour la direction, des alertes quand un indicateur dérive et une mesure régulière du retour sur investissement (ROI).",
        icon: BarChart3,
        metrics: isEn ? "Readable metrics" : "Indicateurs lisibles",
        details: isEn
          ? ["Indicators defined once (Power BI)", "Drift alerts", "Clear visual reporting"]
          : ["Indicateurs définis une seule fois (Power BI)", "Alertes sur dérive", "Restitutions visuelles claires"],
      },
    ],
    [isEn]
  );

  return (
    <div className="relative overflow-hidden glass-card rounded-3xl p-6 md:p-10 transition-all">
      {/* Halo lumineux d'arrière-plan */}
      {/* En-tête de section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-black/10 dark:border-white/10">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent-ink">
            {isEn ? "05 — FROM DATA TO DECISION" : "05 — DE LA DONNÉE À LA DÉCISION"}
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
            {isEn ? "How an AI system works in production" : "Comment fonctionne un système d'IA en production"}
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 dark:text-slate-300 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full self-start md:self-auto">
          <Activity className="h-3.5 w-3.5 text-accent-ink" aria-hidden="true" />
          <span className="hidden lg:inline">{isEn ? "Hover a step to read its definition" : "Survolez une étape pour lire sa définition"}</span>
          <span className="lg:hidden">{isEn ? "Tap a step to read its definition" : "Touchez une étape pour lire sa définition"}</span>
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
          <path
            d="M 125 60 L 375 60 L 625 60 L 875 60"
            fill="none"
            stroke="#F26D3D"
            strokeOpacity="0.5"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        </svg>

        {/* Grille des Nœuds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10" role="tablist" aria-label={isEn ? "System stages" : "Étapes du système"}>
          {NODES.map((node, index) => {
            const Icon = node.icon;
            const isActive = activeNodeId === node.id;
            return (
              <motion.button
                key={node.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveNodeId(node.id)}
                onTouchStart={() => setActiveNodeId(node.id)}
                onMouseEnter={() => setActiveNodeId(node.id)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex flex-col text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
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
                        ? "bg-[#E35F31] text-slate-950"
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
                        ? "bg-[#F26D3D]/20 text-accent-ink"
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
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-6 w-6 items-center justify-center rounded-full bg-slate-200 dark:bg-white/15 border border-black/10 dark:border-white/20 text-accent-ink">
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
        {/* Indication visuelle discrète réservée au mobile */}
        <p className="text-center font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-3 lg:hidden" aria-hidden="true">
          {isEn ? "Tap a node to inspect details" : "Touchez un nœud pour explorer"}
        </p>
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
                  <span className="font-mono text-xs text-accent-ink font-bold">
                    {isEn ? `Step ${node.step}` : `Étape ${node.step}`}
                  </span>
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
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent-ink shrink-0" aria-hidden />
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
