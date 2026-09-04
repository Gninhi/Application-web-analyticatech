import type { ViewKey } from "@/types/content";

/**
 * Modèle de données pour la vue de détail enrichie d'une solution sectorielle.
 * Conçu avec une crédibilité technique maximale :
 * - "Le problème métier" : contexte sectoriel concret et frictions réelles.
 * - "L'approche" : architecture et méthodes solides au niveau DSI/CTO.
 * - "Ce qui a été mesuré" : reprise des métriques officielles du site avec cadre méthodologique transparent.
 * - "Limites et prérequis" : conditions d'application, volumétrie minimale et exclusions claires.
 * - Maillage interne : liens vers services d'ingénierie et insights R&D.
 */

export interface SolutionProblem {
  heading: string;
  contextNarrative: string;
  coreFrictions: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
}

export interface SolutionArchitectureStage {
  stageNumber: string;
  title: string;
  description: string;
  keyPattern?: string;
  badge?: string;
}

export interface SolutionApproach {
  heading: string;
  lead: string;
  stages: SolutionArchitectureStage[];
  integrationDetails: string;
}

export interface SolutionMetricItem {
  label: string;
  value: string;
  subtext: string;
}

export interface SolutionMetrics {
  heading: string;
  lead: string;
  items: SolutionMetricItem[];
  methodology: {
    sampleAndScope: string;
    period: string;
    measurementConditions: string;
    rigorDisclaimer: string;
  };
}

export interface SolutionLimitsAndPrerequisites {
  heading: string;
  lead: string;
  prerequisites: string[];
  applicabilityLimits: string[]; // où la solution ne s'applique PAS
  operationalConstraints: string[];
}

export interface SolutionRelatedResource {
  type: "service" | "insight" | "solution";
  title: string;
  description: string;
  badge: string;
  href: string;
  targetViewKey: ViewKey;
  targetId: string;
}

export interface SolutionDetailData {
  slug: string;
  sector: string;
  sectorBadge: string;
  statusBadge?: string;
  statusType?: "deployed" | "new" | "methodology";
  title: string;
  titleAccent: string;
  summary: string;
  tags: string[];
  problem: SolutionProblem;
  approach: SolutionApproach;
  metrics: SolutionMetrics;
  limitsAndPrerequisites: SolutionLimitsAndPrerequisites;
  relatedResources: SolutionRelatedResource[];
  cta: {
    question: string;
    buttonLabel: string;
  };
}
