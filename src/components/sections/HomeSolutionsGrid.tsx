"use client";

import { motion } from "framer-motion";
import { ChevronRight, BrainCircuit, Network, Workflow, Bot, BarChart3 } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { SpotlightCard } from "@/components/interactive/SpotlightCard";
import { MovingButton } from "@/components/interactive/MovingButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconBox } from "@/components/ui/IconBox";
import { SectionContainer } from "@/components/ui/SectionContainer";
import {
  SolutionVisualAI,
  SolutionVisualTransformation,
  SolutionVisualAutomation,
  SolutionVisualAgentic,
  SolutionVisualBI,
} from "@/components/interactive/SolutionVisuals";

interface HomeSolutionsGridProps {
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

/** Accent chromatique par domaine — cohérent avec le bento de la DataConsole. */
type SolutionCard = {
  id: string;
  keywords: string[];
  matchOn: string[];
  title: string;
  promise: string;
  tagline: string;
  VisualComponent: React.ComponentType;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  technologies: string[];
  metrics: { label: string; value: string };
  accent: string;
  hero?: boolean;
};

/**
 * HomeSolutionsGrid — section "04 — LES SOLUTIONS" de l'accueil.
 * Bento grid asymétrique (grille 12 colonnes, lignes auto =) : la carte IA
 * occupe 7 colonnes × 2 rangées, Transformation & Systèmes Agentiques
 * s'empilent à droite, Automatisation & BI ferment le bandeau bas (6 + 6).
 * Extraite dans un chunk séparé (chargée à la demande) : les SolutionVisual
 * sont des SVG animés coûteux, inutiles au premier paint.
 */
export function HomeSolutionsGrid({ onNavigate, onNavigateDetail }: HomeSolutionsGridProps) {
  const { t } = useI18n();
  const { solutions: DB_SOLUTIONS } = useAppContent();

  // 5 Solutions Métier (Blueprint 04) — contenu crédible et produisible
  // (stacks open-source, résultats mesurables, conformes aux personae).
  const SOLUTION_CARDS: SolutionCard[] = [
    {
      id: "ai",
      keywords: ["RAG", "Soulevé"],
      matchOn: ["RAG", "Agent", "réglementaire"],
      title: t("home.solution.ai.title"),
      promise: t("home.solution.ai.promise"),
      tagline: t("home.solution.ai.tagline"),
      VisualComponent: SolutionVisualAI,
      icon: BrainCircuit,
      technologies: ["LangChain", "LangGraph", "OpenAI", "Pinecone", "vLLM"],
      metrics: { label: t("home.solution.ai.metric"), value: "320 ms" },
      accent: "#F26D3D",
      hero: true,
    },
    {
      id: "transformation",
      keywords: ["Transformation"],
      matchOn: ["Souverain", "souverain", "SecNumCloud"],
      title: t("home.solution.transformation.title"),
      promise: t("home.solution.transformation.promise"),
      tagline: t("home.solution.transformation.tagline"),
      VisualComponent: SolutionVisualTransformation,
      icon: Network,
      technologies: ["Kubernetes", "Terraform", "AWS", "Azure", "GitOps"],
      metrics: { label: t("home.solution.transformation.metric"), value: "99.98 %" },
      accent: "#2B6DE0",
    },
    {
      id: "agentic",
      keywords: ["Systèmes Agentiques"],
      matchOn: ["Agent", "conformité", "autonome"],
      title: t("home.solution.agentic.title"),
      promise: t("home.solution.agentic.promise"),
      tagline: t("home.solution.agentic.tagline"),
      VisualComponent: SolutionVisualAgentic,
      icon: Bot,
      technologies: ["LangGraph", "CrewAI", "MemGPT", "Pinecone", "Temporal"],
      metrics: { label: t("home.solution.agentic.metric"), value: "24/7" },
      accent: "#8b5cf6",
    },
    {
      id: "automation",
      keywords: ["Automatisation"],
      matchOn: ["prédictive", "Jumeau", "IoT", "Optimisation"],
      title: t("home.solution.automation.title"),
      promise: t("home.solution.automation.promise"),
      tagline: t("home.solution.automation.tagline"),
      VisualComponent: SolutionVisualAutomation,
      icon: Workflow,
      technologies: ["n8n", "Zapier", "Temporal", "Airflow", "Python"],
      metrics: { label: t("home.solution.automation.metric"), value: "-75 %" },
      accent: "#10b981",
    },
    {
      id: "bi",
      keywords: ["Business Intelligence"],
      matchOn: ["BI", "Pricing", "décisionnelle"],
      title: t("home.solution.bi.title"),
      promise: t("home.solution.bi.promise"),
      tagline: t("home.solution.bi.tagline"),
      VisualComponent: SolutionVisualBI,
      icon: BarChart3,
      technologies: ["Power BI", "dbt", "Snowflake", "BigQuery", "Looker"],
      metrics: { label: t("home.solution.bi.metric"), value: "640+" },
      accent: "#f59e0b",
    },
  ];

  // Résout le détail Solution correspondant à une carte Home via mots-clés
  // (titres, tags, secteur). Retourne null si aucun match → repli sur la page Solutions.
  const resolveSolutionDetail = (keywords: string[], matchOn: string[]): string | null => {
    const haystack = (sol: (typeof DB_SOLUTIONS)[number]) =>
      [sol.title, sol.sector, ...sol.tags].join(" ").toLowerCase();
    const terms = [...keywords, ...matchOn].map((k) => k.toLowerCase());
    const found = DB_SOLUTIONS.find((sol) => {
      const h = haystack(sol);
      return terms.some((term) => h.includes(term));
    });
    return found?.slug ?? null;
  };

  return (
    <section className="relative">
      <SectionContainer>
        <SectionHeading
          tag={t("home.section.solutions")}
          title={t("home.section.solutions.title")}
          description={t("home.section.solutions.desc")}
        />

        {/* Bento grid : 12 colonnes, lignes auto égales → les cartes s'emboîtent
            parfaitement (IA hero span 7×2, 2 cartes droites, bandeau bas 6+6). */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:auto-rows-fr lg:grid-cols-12 gap-6">
          {SOLUTION_CARDS.map((sol, i) => {
            const Icon = sol.icon;
            const Visual = sol.VisualComponent;
            const detailSlug = resolveSolutionDetail(sol.keywords, sol.matchOn);
            const goToDetail = () =>
              detailSlug
                ? onNavigateDetail("solution-detail", detailSlug)
                : onNavigate("solutions");

            const span = sol.hero
              ? "sm:col-span-2 lg:col-span-7 lg:row-span-2"
              : sol.id === "transformation" || sol.id === "agentic"
                ? "lg:col-span-5"
                : "lg:col-span-6";

            return (
              <motion.article
                key={sol.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={goToDetail}
                className={`group relative cursor-pointer ${span}`}
              >
                {/* Index mono style "works" */}
                <span className="absolute -top-3 left-5 z-10 rounded-lg bg-background px-2 py-0.5 font-mono text-[10px] italic tracking-widest text-[#F26D3D] border border-black/10 dark:border-white/10">
                  /{String(i + 1).padStart(2, "0")}
                </span>

                <SpotlightCard className="h-full overflow-hidden p-0 flex flex-col">
                  {/* Bandeau visuel cinématique avec zoom au survol */}
                  <div
                    className={`relative w-full overflow-hidden rounded-t-3xl border-b border-black/10 dark:border-white/10 [&>div]:transition-transform [&>div]:duration-500 [&>div]:group-hover:scale-105 ${
                      sol.hero ? "h-52 sm:h-60" : "h-36 sm:h-40"
                    }`}
                  >
                    <Visual />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 to-transparent pointer-events-none" aria-hidden />
                    {/* Icône premium */}
                    <div className="absolute top-4 right-4">
                      <IconBox icon={Icon} tone="primary" size="md" />
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-6 md:p-7">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs uppercase tracking-widest text-[#F26D3D] font-bold">
                        {sol.tagline}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#F26D3D]">
                        {t("home.solution.more")}
                      </span>
                    </div>

                    <h3
                      className={`font-display font-bold text-slate-900 dark:text-slate-50 mb-2 transition-colors group-hover:text-[#F26D3D] ${
                        sol.hero ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                      }`}
                    >
                      {sol.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-medium">
                      {sol.promise}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {sol.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 px-2 py-1 font-mono text-[10px] text-slate-600 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          {sol.metrics.label}
                        </p>
                        <p className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                          {sol.metrics.value}
                        </p>
                      </div>

                      <MovingButton
                        onClick={(e) => {
                          e.stopPropagation();
                          goToDetail();
                        }}
                        variant="ghost"
                        size="sm"
                        className="group"
                      >
                        {t("home.section.solutions.explore")}
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </MovingButton>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.article>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
}