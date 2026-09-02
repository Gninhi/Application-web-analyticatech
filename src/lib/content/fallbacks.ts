import type { SiteConfigDTO, SeoMetadataDTO, ServiceDTO, SolutionDTO } from "@/types/content";
import { DEFAULT_SITE_CONFIG } from "@/lib/content/site";

/** Config site de repli (source unique : `content/site.ts`). */
export const FALLBACK_SITE_CONFIG: SiteConfigDTO = DEFAULT_SITE_CONFIG;

/** Métadonnées SEO de repli (garantissent un `<head>` indexable même hors-ligne). */
export const FALLBACK_SEO_METADATA: SeoMetadataDTO = {
  title: "Analyticatech — Architectures IA, Automatisation & Data d'Entreprise",
  description:
    "Cabinet de conseil IA en France : architecture d'agents LLM, RAG, automatisation workflows et transformation digitale, sur plateforme souveraine.",
  keywords: [
    "cabinet conseil IA",
    "architecture LLM",
    "système RAG",
    "agents IA",
    "automatisation workflows",
    "SecNumCloud",
  ],
  ogTitle: "Analyticatech — Architectures IA, Automatisation & Data d'Entreprise",
  ogDescription:
    "Cabinet de conseil IA en France : architecture d'agents LLM, RAG, automatisation workflows et transformation digitale, sur plateforme souveraine.",
  ogImageUrl: null,
  canonicalUrl: "https://analyticatech.fr",
  twitterCard: "summary_large_image",
};

/** Services par défaut FR (repli offline complet pour /services et /services/[index]) — 4 piliers. */
export const FALLBACK_SERVICES_FR: ServiceDTO[] = [
  {
    id: "srv-01",
    index: "01",
    title: "Raisonnement & RAG",
    tagline: "Architecture d'agents LLM & RAG haute précision",
    description:
      "Conception et déploiement d'architectures RAG d'entreprise : recherche vectorielle hybride, réordonnancement sémantique, évaluation continue et garde-fous de sécurité.",
    technologies: ["LangChain", "LangGraph", "Qdrant", "Cohere Rerank", "Ragas", "vLLM"],
    iconKey: "brain",
    bgImagePath: "/images/services/rag.webp",
    meshOverlay: "rgba(242, 109, 61, 0.15)",
    metrics: [
      { label: "Précision RAG", value: "94.2%" },
      { label: "Latence P95", value: "320ms" },
    ],
    order: 1,
    persona: {
      ceo: "Réduisez de 70% le temps de recherche d'information critique et sécurisez vos données stratégiques avec des agents IA souverains.",
      architect:
        "Pipeline modulaire : ingestion multi-formats, vectorisation dense/sparse (Qdrant), reranker cross-encoder et garde-fous anti-hallucination.",
      operational:
        "Durée type : 6 semaines de l'audit à la production. Équipe : 1 Lead IA + 1 Data Engineer. Stack : Python, LangGraph, Docker.",
    },
  },
  {
    id: "srv-02",
    index: "02",
    title: "Automatisation & Workflows",
    tagline: "Orchestration de processus métiers & intégrations",
    description:
      "Automatisation de bout en bout de vos flux opérationnels : synchronisation multi-systèmes, traitement de documents par IA et orchestration résiliente.",
    technologies: ["n8n", "Temporal", "Python", "RabbitMQ", "OpenAPI"],
    iconKey: "workflow",
    bgImagePath: "/images/services/workflow.webp",
    meshOverlay: "rgba(56, 189, 248, 0.15)",
    metrics: [
      { label: "Heures sauvées / an", value: "8 500h" },
      { label: "Taux de succès", value: "99.98%" },
    ],
    order: 2,
    persona: {
      ceo: "Éliminez les tâches répétitives à faible valeur ajoutée et absorbez 3x plus de volume sans augmenter vos effectifs administratifs.",
      architect:
        "Orchestration événementielle basée sur Temporal et n8n : idempotence native, retry exponentiel et monitoring temps réel sous Prometheus.",
      operational:
        "Mise en œuvre : sprints de 2 semaines par flux. Livrables : connecteurs testés, documentation OpenAPI, alerting Slack/Teams.",
    },
  },
  {
    id: "srv-03",
    index: "03",
    title: "Orchestration Multi-Agents",
    tagline: "Collectifs d'agents autonomes & outils dynamiques",
    description:
      "Déploiement de collectifs d'agents capables de planifier, raisonner, appeler des outils et collaborer sous supervision humaine pour résoudre des tâches complexes.",
    technologies: ["CrewAI", "LangGraph", "MCP", "Redis", "Langfuse"],
    iconKey: "bot",
    bgImagePath: "/images/services/agents.webp",
    meshOverlay: "rgba(16, 185, 129, 0.15)",
    metrics: [
      { label: "Tâches résolues", value: "87%" },
      { label: "Agents en prod", value: "312" },
    ],
    order: 3,
    persona: {
      ceo: "Dotez vos équipes d'assistants experts autonomes capables de traiter des dossiers complexes de bout en bout avec contrôle humain.",
      architect:
        "Architecture hiérarchique et collaborative : protocole MCP, mémoire partagée Redis, traçage des étapes de pensée via Langfuse.",
      operational:
        "Déploiement en 4 étapes : modélisation des rôles, intégration des outils métiers, calibration des garde-fous, supervision continue.",
    },
  },
  {
    id: "srv-04",
    index: "04",
    title: "Data & Décision Augmentée",
    tagline: "Modern Data Stack, BI décisionnelle & requêtes NL",
    description:
      "Unification de vos silos de données : modélisation dbt, entrepôt cloud haute performance, tableaux de bord exécutifs et requêtes en langage naturel.",
    technologies: ["Snowflake", "BigQuery", "dbt", "Power BI", "DuckDB"],
    iconKey: "chart",
    bgImagePath: "/images/services/data.webp",
    meshOverlay: "rgba(168, 85, 247, 0.15)",
    metrics: [
      { label: "Gain de marge", value: "+18.4%" },
      { label: "Dashboards", value: "640" },
    ],
    order: 4,
    persona: {
      ceo: "Prenez des décisions éclairées grâce à une vision consolidée et temps réel de vos indicateurs clés, accessible en langage naturel.",
      architect:
        "Architecture Medallion sur Snowflake/BigQuery : transformation dbt avec tests d'intégrité, couche sémantique unifiée et agents Text-to-SQL.",
      operational:
        "Projet type : 3 mois. Équipe : 1 architecte + 1 data engineer + 1 analyste BI. Outils : Power BI, dbt, Snowflake, Git.",
    },
  },
];

/** Services par défaut EN (repli offline pour /en/services et /en/services/[index]) — 4 piliers. */
export const FALLBACK_SERVICES_EN: ServiceDTO[] = [
  {
    id: "srv-01",
    index: "01",
    title: "Reasoning & RAG",
    tagline: "High-Precision RAG & LLM Agent Architecture",
    description:
      "Design and deployment of enterprise RAG architectures: hybrid vector search, semantic reranking, continuous evaluation, and security guardrails.",
    technologies: ["LangChain", "LangGraph", "Qdrant", "Cohere Rerank", "Ragas", "vLLM"],
    iconKey: "brain",
    bgImagePath: "/images/services/rag.webp",
    meshOverlay: "rgba(242, 109, 61, 0.15)",
    metrics: [
      { label: "RAG Accuracy", value: "94.2%" },
      { label: "P95 Latency", value: "320ms" },
    ],
    order: 1,
    persona: {
      ceo: "Cut critical knowledge retrieval time by 70% and secure your strategic data with sovereign AI agents.",
      architect:
        "Modular pipeline: multi-format ingestion, dense/sparse vectorization (Qdrant), cross-encoder reranker, and anti-hallucination guardrails.",
      operational:
        "Typical timeline: 6 weeks from audit to production. Team: 1 AI Lead + 1 Data Engineer. Stack: Python, LangGraph, Docker.",
    },
  },

  {
    id: "srv-02",
    index: "02",
    title: "Automation & Workflows",
    tagline: "Business Process Orchestration & Integrations",
    description:
      "End-to-end automation of operational flows: multi-system synchronization, AI-powered document processing, and resilient orchestration.",
    technologies: ["n8n", "Temporal", "Python", "RabbitMQ", "OpenAPI"],
    iconKey: "workflow",
    bgImagePath: "/images/services/workflow.webp",
    meshOverlay: "rgba(56, 189, 248, 0.15)",
    metrics: [
      { label: "Hours Saved / Year", value: "8,500h" },
      { label: "Success Rate", value: "99.98%" },
    ],
    order: 2,
    persona: {
      ceo: "Eliminate low-value repetitive tasks and scale volume 3x without increasing administrative headcount.",
      architect:
        "Event-driven orchestration using Temporal & n8n: native idempotence, exponential retry policies, and real-time Prometheus monitoring.",
      operational:
        "Implementation: 2-week sprints per workflow. Deliverables: tested connectors, OpenAPI specs, Slack/Teams alerts.",
    },
  },
  {
    id: "srv-03",
    index: "03",
    title: "Multi-Agent Orchestration",
    tagline: "Autonomous Agent Collectives & Dynamic Tooling",
    description:
      "Deploy teams of autonomous AI agents capable of planning, reasoning, calling tools, and collaborating under human supervision for complex tasks.",
    technologies: ["CrewAI", "LangGraph", "MCP", "Redis", "Langfuse"],
    iconKey: "bot",
    bgImagePath: "/images/services/agents.webp",
    meshOverlay: "rgba(16, 185, 129, 0.15)",
    metrics: [
      { label: "Tasks Solved", value: "87%" },
      { label: "Agents in Prod", value: "312" },
    ],
    order: 3,

    persona: {
      ceo: "Equip your teams with autonomous expert assistants capable of handling end-to-end multi-step tasks under human oversight.",
      architect:
        "Hierarchical and collaborative architecture: MCP protocol, Redis shared state, reasoning-step tracing via Langfuse.",
      operational:
        "4-step delivery: role modeling, business tools integration, guardrails calibration, continuous supervision.",
    },
  },
  {
    id: "srv-04",
    index: "04",
    title: "Data & Augmented Decision",
    tagline: "Modern Data Stack, Decision BI & Natural Language Queries",
    description:
      "Unify disparate data silos: dbt modeling, high-performance cloud data warehouses, executive dashboards, and secure natural-language SQL queries.",
    technologies: ["Snowflake", "BigQuery", "dbt", "Power BI", "DuckDB"],
    iconKey: "chart",
    bgImagePath: "/images/services/data.webp",
    meshOverlay: "rgba(168, 85, 247, 0.15)",
    metrics: [
      { label: "Margin Gain", value: "+18.4%" },
      { label: "Dashboards", value: "640" },
    ],
    order: 4,
    persona: {
      ceo: "Make confident decisions with real-time, consolidated KPI dashboards accessible via plain English inquiries.",
      architect:
        "Medallion architecture on Snowflake/BigQuery: dbt transformations with data integrity tests, unified semantic layer, and Text-to-SQL agents.",
      operational:
        "Typical duration: 3 months. Team: 1 architect + 1 data engineer + 1 BI analyst. Tools: Power BI, dbt, Snowflake, Git.",
    },
  },
];

export const FALLBACK_SOLUTIONS_FR: SolutionDTO[] = [
  {
    id: "sol-1",
    slug: "logistics-ai",
    sector: "Logistique",
    title: "Optimisation logistique par l'IA",
    summary: "Ré-orchestration dynamique des tournées et prévision de la demande via modèles ML, réduisant les coûts transport de 22% et le taux de rupture de stock de 41%.",
    impact: "-22% coûts · -41% ruptures",
    tags: ["ML", "Optimisation", "Forecast"],
    order: 1,
  },
  {
    id: "sol-2",
    slug: "finance-agent",
    sector: "Finance",
    title: "Agents de conformité réglementaire",
    summary: "Agents cognitifs surveillant 100% des transactions en temps réel, détectant les anomalies de conformité et générant les rapports régulateurs automatiquement.",
    impact: "100% coverage · 3s latency",
    tags: ["Agents", "Compliance", "Temps réel"],
    order: 2,
  },
  {
    id: "sol-3",
    slug: "retail-bi",
    sector: "Retail",
    title: "BI prédictive omnicanal",
    summary: "Suite décisionnelle unifiée croisant ventes, stocks et signaux comportementaux pour piloter le pricing dynamique et le réassort multi-boutiques.",
    impact: "+14% marge · 640 dashboards",
    tags: ["BI", "Pricing", "Omnicanal"],
    order: 3,
  },
  {
    id: "sol-4",
    slug: "healthcare-nlp",
    sector: "Santé",
    title: "Synthèse clinique & extraction NLP",
    summary: "Extraction automatisée et structuration de données non structurées (comptes rendus, imagerie) accélérant le traitement des dossiers de 68%.",
    impact: "68% gain de temps · 0 erreur critique",
    tags: ["NLP", "LLM", "Médical"],
    order: 4,
  },
  {
    id: "sol-5",
    slug: "industry-maintenance",
    sector: "Industrie",
    title: "Maintenance prédictive IoT",
    summary: "Détection précoce d'anomalies sur lignes de production réduisant les arrêts imprévus de 34% et prolongeant la durée de vie des équipements de 18 mois.",
    impact: "-34% arrêts · +18 mois durée de vie",
    tags: ["IoT", "Séries temporelles", "Edge AI"],
    order: 5,
  },
  {
    id: "sol-6",
    slug: "energy-smartgrid",
    sector: "Énergie",
    title: "Optimisation de grille intelligente",
    summary: "Équilibrage offre/demande en temps réel et arbitrage sur marchés spot par RL, générant 850 k€ d'économies annuelles.",
    impact: "850 k€/an économisés · 99.98% disponibilité",
    tags: ["Reinforcement Learning", "Smart Grid", "Arbitrage"],
    order: 6,
  },
];

export const FALLBACK_SOLUTIONS_EN: SolutionDTO[] = [
  {
    id: "sol-1",
    slug: "logistics-ai",
    sector: "Logistics",
    title: "AI-Driven Logistics Optimization",
    summary: "Dynamic re-orchestration of routes and demand forecasting via ML models, reducing transportation costs by 22% and stockout rates by 41%.",
    impact: "-22% costs · -41% stockouts",
    tags: ["ML", "Optimization", "Forecast"],
    order: 1,
  },
  {
    id: "sol-2",
    slug: "finance-agent",
    sector: "Finance",
    title: "Regulatory Compliance Agents",
    summary: "Cognitive agents monitoring 100% of transactions in real time, detecting compliance anomalies and automatically generating regulatory reports.",
    impact: "100% coverage · 3s latency",
    tags: ["Agents", "Compliance", "Real-time"],
    order: 2,
  },
  {
    id: "sol-3",
    slug: "retail-bi",
    sector: "Retail",
    title: "Omnichannel Predictive BI",
    summary: "Unified decision-making suite cross-referencing sales, inventory and behavioral signals to drive dynamic pricing and multi-store replenishment.",
    impact: "+14% margin · 640 dashboards",
    tags: ["BI", "Pricing", "Omnichannel"],
    order: 3,
  },
  {
    id: "sol-4",
    slug: "healthcare-nlp",
    sector: "Healthcare",
    title: "Clinical Synthesis & NLP Extraction",
    summary: "Automated extraction and structuring of unstructured data (reports, imaging) accelerating case processing by 68%.",
    impact: "68% time saved · 0 critical errors",
    tags: ["NLP", "LLM", "Healthcare"],
    order: 4,
  },
  {
    id: "sol-5",
    slug: "industry-maintenance",
    sector: "Industry",
    title: "IoT Predictive Maintenance",
    summary: "Early detection of anomalies on production lines reducing unexpected downtime by 34% and extending equipment lifespan by 18 months.",
    impact: "-34% downtime · +18 months lifespan",
    tags: ["IoT", "Time Series", "Edge AI"],
    order: 5,
  },
  {
    id: "sol-6",
    slug: "energy-smartgrid",
    sector: "Energy",
    title: "Smart Grid Optimization",
    summary: "Real-time supply/demand balancing and spot market arbitrage via RL, generating €850k in annual savings.",
    impact: "€850k/year saved · 99.98% availability",
    tags: ["Reinforcement Learning", "Smart Grid", "Arbitrage"],
    order: 6,
  },
];
