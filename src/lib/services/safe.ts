import "server-only";

import type { SiteConfigDTO, SeoMetadataDTO } from "@/types/content";
import { audit } from "@/lib/observability/audit";
import { DEFAULT_SITE_CONFIG } from "@/lib/content/site";

/**
 * Sûreté de fonctionnement côté serveur — mode offline.
 *
 * Enveloppe un appel de service Prisma/Supabase : si la promesse rejette
 * (base injoignable, timeout réseau, schéma non sourcé), l'incident est
 * journalisé en audit (WARN) et `fallback` est renvoyé au lieu de faire
 * échouer toute la page (`getAppContent` + `generateMetadata`).
 */
export async function safe<T>(label: string, promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    audit.warn("Content: fallback offline", {
      dataSource: label,
      error: err instanceof Error ? err.message : String(err),
    });
    return fallback;
  }
}

/** Variante d'appel sûre pour les collections : repli sur tableau vide typé. */
export function safeArray<T>(label: string, promise: Promise<T[]>): Promise<T[]> {
  return safe(label, promise, [] as T[]);
}

/** Config site de repli (source unique : `content/site.ts`). */
export const FALLBACK_SITE_CONFIG: SiteConfigDTO = DEFAULT_SITE_CONFIG;

/** Métadonnées SEO de repli (garantissent un `<head>` indexable même hors-ligne). */
export const FALLBACK_SEO_METADATA: SeoMetadataDTO = {
  title: "Analyticatech — Cabinet de conseil en IA, Agents & Automatisation",
  description:
    "Cabinet de conseil IA en France : architecture d'agents LLM, RAG, automatisation workflows et transformation digitale, sur plateforme souveraine.",
  keywords: [
    "cabinet conseil IA",
    "intelligence artificielle",
    "automatisation IA",
    "agents LLM",
    "LLM RAG",
  ],
  ogTitle: "Analyticatech — Consulting IA & Automatisation",
  ogDescription:
    "Cabinet de conseil IA en France : architecture d'agents LLM, RAG, automatisation workflows et transformation digitale, sur plateforme souveraine.",
  ogImageUrl: null,
  canonicalUrl: "https://analyticatech.fr",
  twitterCard: "summary_large_image",
};

/** Services par défaut (repli offline complet pour /services et /services/[index]) — 4 piliers. */
export const FALLBACK_SERVICES_FR = [
  {
    id: "srv-01",
    index: "01",
    title: "Raisonnement & RAG",
    tagline: "Audit de l'existant & priorisation ROI",
    description:
      "Audit de l'existant et priorisation des cas d'usage à plus fort ROI : nous identifions ensemble où l'IA crée le plus de valeur mesurable.",
    technologies: ["LangChain", "LangGraph", "OpenAI", "Pinecone", "Hugging Face", "vLLM"],
    iconKey: "BrainCircuit",
    bgImagePath: "/services/bg-01-ia.webp",
    meshOverlay:
      "radial-gradient(ellipse 70% 90% at 15% 20%, rgba(242,109,61,0.35), transparent 55%), radial-gradient(ellipse 60% 80% at 90% 90%, rgba(2,40,89,0.7), transparent 60%)",
    metrics: [
      { label: "Latence RAG", value: "320 ms" },
      { label: "Précision", value: "94.2 %" },
    ],
    order: 1,
    persona: {
      ceo: "Sur 10 POC IA, seulement 2 réussissent à échelle. Notre approche industrielle avec 5 piliers garantit votre succès : architecture robuste, données qualité, modèles évalués, sécurité intégrée, ROI mesuré. Engagement: POC 6 semaines, livrable et roadmap 12 mois.",
      architect:
        "Stack recommandée : LangGraph orchestration, Pinecone vector search, vLLM high-performance deployment. Patterns : RAG augmenté, agents avec mémoire à long terme, garde-fous de sécurité, évaluation continue toutes les 24h. Intégration: API REST + GraphQL, Docker/Kubernetes, monitoring Prometheus + Grafana.",
      operational:
        "Durée POC : 6 semaines. Équipe : 2 architectes + 1 data scientist + 1 DevOps. Outils : LangChain, OpenAI API, Pinecone, GitHub Actions CI/CD.",
    },
  },
  {
    id: "srv-02",
    index: "02",
    title: "Automatisation & Workflows",
    tagline: "Workflows & orchestrations",
    description:
      "Automatisation de bout en bout des processus métier : intégration applicative, orchestration de workflows, RPA intelligent et élimination des tâches répétitives à forte valeur.",
    technologies: ["n8n", "Zapier", "Temporal", "Apache Airflow", "Make", "Python"],
    iconKey: "Workflow",
    bgImagePath: "/services/bg-03-auto.webp",
    meshOverlay:
      "radial-gradient(ellipse 70% 90% at 20% 85%, rgba(242,109,61,0.3), transparent 55%), radial-gradient(ellipse 60% 80% at 85% 15%, rgba(255,174,107,0.18), transparent 60%)",
    metrics: [
      { label: "Processus auto", value: "1 204" },
      { label: "Heures / mois", value: "8 500 h" },
    ],
    order: 2,
    persona: {
      ceo: "Automatisation bout-en-bout = réduction de 40% des tâches répétitives + augmentation de 25% de la productivité équipe. Cas d'usage: RPA comptable, orchestration workflows marketing, élimination tasks manuelles à forte valeur. Engagement: POC 8 semaines, déploiement complet 3 mois.",
      architect:
        "Stack recommandée : n8n workflow automation, Temporal orchestration, Apache Airflow batch processing, Make integration. Patterns : event-driven workflows, RPA intelligent, API-first approach. Intégration: connecteurs métier, webhooks, systèmes légacys.",
      operational:
        "Durée POC : 8 semaines. Équipe : 1 architecte + 1 data analyst + 1 développeur RPA. Outils : n8n, Zapier, Temporal, Python scripts.",
    },
  },
  {
    id: "srv-03",
    index: "03",
    title: "Orchestration Multi-Agents",
    tagline: "Multi-agents & autonomie",
    description:
      "Architectures multi-agents capables de planifier, raisonner et agir : orchestration de rôles, mémoire long-terme, outillage dynamique et supervision humaine dans la boucle.",
    technologies: ["LangGraph", "CrewAI", "AutoGen", "MCP", "Redis", "Qdrant"],
    iconKey: "Bot",
    bgImagePath: "/services/bg-04-agents.webp",
    meshOverlay:
      "radial-gradient(ellipse 70% 90% at 85% 30%, rgba(56,189,248,0.22), transparent 55%), radial-gradient(ellipse 60% 80% at 10% 80%, rgba(2,40,89,0.7), transparent 60%)",
    metrics: [
      { label: "Agents déployés", value: "312" },
      { label: "Autonomie", value: "87 %" },
    ],
    order: 3,
    persona: {
      ceo: "Architectures multi-agents = coordination de 312 agents en production + autonomie 87% + réduction time-to-market de 60%. Engagement : POC 2 mois, système complet 4 mois.",
      architect:
        "Stack recommandée : LangGraph orchestration, CrewAI multi-agent, AutoGen pattern, MCP protocol, Redis mémoire, Qdrant vector store. Patterns : rôle orchestration, mémoire à long-terme, outillage dynamique, supervision humaine-en-boucle. Intégration: API REST, événements Pub/Sub, stockage distribué.",
      operational:
        "Durée POC : 2 mois. Équipe : 2 architectes + 1 chercheur IA + 1 DevOps. Outils : LangGraph, CrewAI, AutoGen, Redis, Qdrant.",
    },
  },
  {
    id: "srv-04",
    index: "04",
    title: "Data & Décision Augmentée",
    tagline: "Data & décision augmentée",
    description:
      "Plateformes data end-to-end : ingestion, modélisation sémantique, dashboards exécutifs et alerting prédictif. La donnée devient un levier opérationnel quotidien.",
    technologies: ["Power BI", "dbt", "Snowflake", "BigQuery", "Looker", "Superset"],
    iconKey: "BarChart3",
    bgImagePath: "/services/bg-05-bi.webp",
    meshOverlay:
      "radial-gradient(ellipse 70% 90% at 25% 20%, rgba(242,109,61,0.28), transparent 55%), radial-gradient(ellipse 60% 80% at 80% 85%, rgba(168,85,247,0.18), transparent 60%)",
    metrics: [
      { label: "Dashboards", value: "640" },
      { label: "Sources data", value: "120+" },
    ],
    order: 4,
    persona: {
      ceo: "BI décisionnelle = 640 dashboards executives + 120+ sources de données unifiées + marges +14% en moyenne. Engagement : projet 3 mois, adoption équipe 2 mois.",
      architect:
        "Stack recommandée : Power BI visualisation, dbt sémantique modélisation, Snowflake/cloud data warehouse, BigQuery, Looker exploration, Superset ad-hoc. Patterns : semantic layer, data modeling, dashboard governance, KPI tracking. Intégration: API REST, webhooks, data pipelines ETL.",
      operational:
        "Durée projet : 3 mois. Équipe : 1 architecte + 1 data engineer + 1 analyste BI. Outils : Power BI, dbt, Snowflake, Git.",
    },
  },
];

export const FALLBACK_SERVICES_EN = [
  {
    id: "srv-01",
    index: "01",
    title: "Reasoning & RAG",
    tagline: "Existing-state audit & ROI prioritization",
    description:
      "We audit your existing landscape and prioritize the use cases with the highest measurable ROI.",
    technologies: ["LangChain", "LangGraph", "OpenAI", "Pinecone", "Hugging Face", "vLLM"],
    iconKey: "BrainCircuit",
    bgImagePath: "/services/bg-01-ia.webp",
    meshOverlay:
      "radial-gradient(ellipse 70% 90% at 15% 20%, rgba(242,109,61,0.35), transparent 55%), radial-gradient(ellipse 60% 80% at 90% 90%, rgba(2,40,89,0.7), transparent 60%)",
    metrics: [
      { label: "RAG latency", value: "320 ms" },
      { label: "Precision", value: "94.2 %" },
    ],
    order: 1,
    persona: {
      ceo: "Of 10 AI POCs, only 2 succeed at scale. Our industrial approach with 5 pillars guarantees your success: robust architecture, quality data, evaluated models, integrated security, measured ROI. Commitment: 6-week POC, deliverable and 12-month roadmap.",
      architect:
        "Recommended stack: LangGraph orchestration, Pinecone vector search, vLLM high-performance deployment. Patterns: RAG augmented, agents with long-term memory, security guardrails, continuous evaluation every 24h. Integration: REST + GraphQL APIs, Docker/Kubernetes deployment, Prometheus + Grafana monitoring.",
      operational:
        "POC duration: 6 weeks. Team: 2 architects + 1 data scientist + 1 DevOps. Tools: LangChain, OpenAI API, Pinecone, GitHub Actions CI/CD.",
    },
  },
  {
    id: "srv-02",
    index: "02",
    title: "Automation & Workflows",
    tagline: "Workflows & Orchestration",
    description:
      "End-to-end automation of business processes: application integration, workflow orchestration, intelligent RPA and elimination of high-value repetitive tasks.",
    technologies: ["n8n", "Zapier", "Temporal", "Apache Airflow", "Make", "Python"],
    iconKey: "Workflow",
    bgImagePath: "/services/bg-03-auto.webp",
    meshOverlay:
      "radial-gradient(ellipse 70% 90% at 20% 85%, rgba(242,109,61,0.3), transparent 55%), radial-gradient(ellipse 60% 80% at 85% 15%, rgba(255,174,107,0.18), transparent 60%)",
    metrics: [
      { label: "Processes automated", value: "1,204" },
      { label: "Hours / month", value: "8,500 h" },
    ],
    order: 2,
    persona: {
      ceo: "End-to-end automation = 40% reduction of repetitive tasks + 25% team productivity increase. Use cases: RPA accounting processes, marketing workflow orchestration, elimination of high-value manual tasks. Commitment: 8-week POC, full deployment 3 months.",
      architect:
        "Recommended stack: n8n workflow automation, Temporal orchestration, Apache Airflow batch processing, Make integration. Patterns: event-driven workflows, intelligent RPA, API-first approach. Integration: business connectors, webhooks, legacy system integration.",
      operational:
        "POC duration: 8 weeks. Team: 1 architect + 1 data analyst + 1 RPA developer. Tools: n8n, Zapier, Temporal, Python scripts.",
    },
  },
  {
    id: "srv-03",
    index: "03",
    title: "Multi-Agent Orchestration",
    tagline: "Multi-Agent & Autonomy",
    description:
      "Multi-agent architectures capable of planning, reasoning and acting: role orchestration, long-term memory, dynamic tooling and human-in-the-loop oversight.",
    technologies: ["LangGraph", "CrewAI", "AutoGen", "MCP", "Redis", "Qdrant"],
    iconKey: "Bot",
    bgImagePath: "/services/bg-04-agents.webp",
    meshOverlay:
      "radial-gradient(ellipse 70% 90% at 85% 30%, rgba(56,189,248,0.22), transparent 55%), radial-gradient(ellipse 60% 80% at 10% 80%, rgba(2,40,89,0.7), transparent 60%)",
    metrics: [
      { label: "Agents deployed", value: "312" },
      { label: "Autonomy", value: "87 %" },
    ],
    order: 3,
    persona: {
      ceo: "Multi-agent architectures = 312 agents in production + 87% autonomy + 60% time-to-market reduction. Commitment: 2-week POC, full system 4 months.",
      architect:
        "Recommended stack: LangGraph orchestration, CrewAI multi-agent, AutoGen pattern, MCP protocol, Redis memory, Qdrant vector store. Patterns: role orchestration, long-term memory, dynamic tooling, human-in-the-loop oversight. Integration: REST APIs, Pub/Sub events, distributed storage.",
      operational:
        "POC duration: 2 months. Team: 2 architects + 1 AI researcher + 1 DevOps. Tools: LangGraph, CrewAI, AutoGen, Redis, Qdrant.",
    },
  },
  {
    id: "srv-04",
    index: "04",
    title: "Data & Augmented Decision",
    tagline: "Data & Augmented Decision-Making",
    description:
      "End-to-end data platforms: ingestion, semantic modeling, executive dashboards and predictive alerting. Data becomes a daily operational lever.",
    technologies: ["Power BI", "dbt", "Snowflake", "BigQuery", "Looker", "Superset"],
    iconKey: "BarChart3",
    bgImagePath: "/services/bg-05-bi.webp",
    meshOverlay:
      "radial-gradient(ellipse 70% 90% at 25% 20%, rgba(242,109,61,0.28), transparent 55%), radial-gradient(ellipse 60% 80% at 80% 85%, rgba(168,85,247,0.18), transparent 60%)",
    metrics: [
      { label: "Dashboards", value: "640" },
      { label: "Data sources", value: "120+" },
    ],
    order: 4,
    persona: {
      ceo: "Executive BI = 640 executive dashboards + 120+ unified data sources + average +14% margins. Commitment: 3-month project, 2-month team adoption.",
      architect:
        "Recommended stack: Power BI visualization, semantic dbt modeling, Snowflake/cloud data warehouse, BigQuery, Looker exploration, Superset ad-hoc. Patterns: semantic layer, data modeling, dashboard governance, KPI tracking. Integration: REST APIs, webhooks, ETL data pipelines.",
      operational:
        "Project duration: 3 months. Team: 1 architect + 1 data engineer + 1 BI analyst. Tools: Power BI, dbt, Snowflake, Git.",
    },
  },
];