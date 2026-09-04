import type { ViewKey } from "@/types/content";

/**
 * Modèle de données pour la vue de détail enrichie d'un article Insight.
 * Conçu pour maximiser la crédibilité technique perçue :
 * 1. Contexte métier concret (secteur, contraintes, enjeux).
 * 2. Problème documenté avec modes d'échec précis.
 * 3. Approche technique avec stack outillée, versions et pipeline d'architecture.
 * 4. Compromis & limites d'ingénierie assumés (anti-discours marketing).
 * 5. Résultats chiffrés rigoureux avec mentions de contextualisation.
 * 6. Maillage interne ("Pour aller plus loin") vers les services et solutions du site.
 */

export interface InsightContext {
  sector: string;
  sectorBadge: string;
  useCase: string;
  constraints: string;
  stakes: string;
  narrative: string;
}

export interface InsightProblemFailureMode {
  code: string; // Ex: "FAIL_01 // CHUNKING"
  title: string;
  description: string;
  impact: string;
}

export interface InsightProblem {
  heading: string;
  lead: string;
  failureModes: InsightProblemFailureMode[];
}

export interface TechStackItem {
  name: string;
  version?: string;
  role: string;
  category: "orchestration" | "evaluation" | "vector" | "model" | "data" | "infra" | "guardrails";
}

export interface ArchitectureStage {
  stageNumber: string; // Ex: "STAGE 01"
  title: string;
  description: string;
  keyPattern?: string;
  badge?: string;
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  caption?: string;
}

export interface InsightApproach {
  heading: string;
  lead: string;
  architectureTitle: string;
  architectureStages: ArchitectureStage[];
  techStack: TechStackItem[];
  codeSnippet?: CodeSnippet;
}

export interface TradeoffItem {
  title: string;
  tension: string; // Ex: "Latence P95 vs Fidélité documentaire"
  arbitrage: string; // Le choix opéré
  costOrDrawback: string; // Ce que l'on paie
  mitigation: string; // Comment l'impact est contenu
}

export interface InsightTradeoffs {
  heading: string;
  lead: string;
  disclaimer: string;
  tradeoffs: TradeoffItem[];
}

export interface MetricResultItem {
  label: string;
  value: string;
  change?: string;
  subtext: string;
  isIndicative: boolean; // Si true -> affiche le badge "À TITRE INDICATIF"
}

export interface InsightResults {
  heading: string;
  lead: string;
  metrics: MetricResultItem[];
  methodologyNote: string;
  observedBenefits: string[];
}

export interface RelatedResource {
  type: "service" | "solution";
  title: string;
  description: string;
  badge: string;
  href: string; // Ex: "/services/01" ou "/solutions/healthcare-nlp"
  targetViewKey: ViewKey;
  targetId: string; // Ex: "01" ou "healthcare-nlp"
}

export interface InsightDetailData {
  slug: string;
  aliases?: string[];
  readingTime: string;
  publishedDate: string;
  category: {
    key: string;
    label: string;
  };
  author: {
    name: string;
    role: string;
    avatarInitials?: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    tags: string[];
  };
  context: InsightContext;
  problem: InsightProblem;
  approach: InsightApproach;
  tradeoffs: InsightTradeoffs;
  results: InsightResults;
  relatedResources: RelatedResource[];
}
