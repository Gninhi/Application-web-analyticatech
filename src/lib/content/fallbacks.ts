import type {
  SiteConfigDTO,
  SeoMetadataDTO,
  ServiceDTO,
  SolutionDTO,
  MetricDTO,
  ActivityLogDTO,
  TestimonialDTO,
  ClientLogoDTO,
  CompanyValueDTO,
  DeliveryStepDTO,
  BlogCategoryDTO,
  BlogPostDTO,
  CapabilityDTO,
  NavItemDTO,
  LegalSectionDTO,
} from "@/types/content";
import { DEFAULT_SITE_CONFIG } from "@/lib/content/site";
import { KEY_STATS_CONFIG } from "@/data/stats";

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
      "Nous concevons des architectures RAG avancées orchestrées sous LangGraph, associant recherche vectorielle hybride et réordonnancement sémantique. Chaque brique intègre des garde-fous anti-hallucination et une évaluation continue pour fiabiliser le raisonnement des modèles sur vos données d'entreprise.",
    technologies: ["LangChain", "LangGraph", "Qdrant", "Cohere Rerank", "Ragas", "vLLM"],
    iconKey: "brain",
    bgImagePath: "/images/services/rag.webp",
    meshOverlay: "rgba(242, 109, 61, 0.15)",
    metrics: [
      { label: "Précision RAG", value: "94.2%" },
      { label: "Latence P95", value: "280ms" },
    ],
    order: 1,
    persona: {
      ceo: "Réduisez de 65% le temps de recherche d'information critique et sécurisez vos données stratégiques avec des agents IA souverains.",
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
      "Nous déployons des couches fonctionnelles d'orchestration résilientes basées sur Temporal et n8n pour automatiser vos flux opérationnels critiques. L'architecture garantit l'idempotence native des transactions, une reprise automatique sur incident et une intégration standardisée via OpenAPI.",
    technologies: ["n8n", "Temporal", "Python", "RabbitMQ", "OpenAPI"],
    iconKey: "workflow",
    bgImagePath: "/images/services/workflow.webp",
    meshOverlay: "rgba(56, 189, 248, 0.15)",
    metrics: [
      { label: "Tâches auto.", value: "65%" },
      { label: "Gain temps", value: "45%" },
    ],
    order: 2,
    persona: {
      ceo: "Éliminez les tâches répétitives à faible valeur ajoutée et gagnez 45% de temps opérationnel sur vos flux administratifs.",
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
      "Nous structurons des architectures multi-agents distribuées via le protocole MCP et LangGraph pour résoudre des processus complexes par décomposition dynamique de tâches. Chaque brique agentique collabore à travers une mémoire partagée sous Redis et un traçage exhaustif des exécutions sous Langfuse.",
    technologies: ["CrewAI", "LangGraph", "MCP", "Redis", "Langfuse"],
    iconKey: "bot",
    bgImagePath: "/images/services/agents.webp",
    meshOverlay: "rgba(16, 185, 129, 0.15)",
    metrics: [
      { label: "Taux de résolution", value: "72%" },
      { label: "Agents déployés", value: "38" },
    ],
    order: 3,
    persona: {
      ceo: "Dotez vos équipes de 38 agents spécialisés autonomes capables de traiter des dossiers complexes avec contrôle humain.",
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
      "Nous unifions vos silos de données au sein d'une architecture Medallion sur Snowflake et BigQuery, modélisée et testée via dbt. Cette couche sémantique gouvernée alimente des tableaux de bord haute performance et des interfaces d'interrogation en langage naturel.",
    technologies: ["Snowflake", "BigQuery", "dbt", "Power BI", "DuckDB"],
    iconKey: "chart",
    bgImagePath: "/images/services/data.webp",
    meshOverlay: "rgba(168, 85, 247, 0.15)",
    metrics: [
      { label: "Gain de marge", value: "+18.4%" },
      { label: "Dashboards", value: "42" },
    ],
    order: 4,
    persona: {
      ceo: "Prenez des décisions éclairées grâce à 42 tableaux de bord gouvernés et une vision consolidée de vos indicateurs clés.",
      architect:
        "Architecture Medallion sur Snowflake/BigQuery : transformation dbt avec tests d'intégrité, couche sémantique unifiée et agents Text-to-SQL.",
      operational:
        "Projet type : 8 semaines. Équipe : 1 architecte + 1 data engineer + 1 analyste BI. Outils : Power BI, dbt, Snowflake, Git.",
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
      "We architect advanced RAG pipelines orchestrated with LangGraph, combining hybrid vector search and semantic reranking. Each functional layer incorporates anti-hallucination guardrails and continuous evaluation to ensure deterministic reasoning over enterprise data.",
    technologies: ["LangChain", "LangGraph", "Qdrant", "Cohere Rerank", "Ragas", "vLLM"],
    iconKey: "brain",
    bgImagePath: "/images/services/rag.webp",
    meshOverlay: "rgba(242, 109, 61, 0.15)",
    metrics: [
      { label: "RAG Accuracy", value: "94.2%" },
      { label: "P95 Latency", value: "280ms" },
    ],
    order: 1,
    persona: {
      ceo: "Cut critical knowledge retrieval time by 65% and secure your strategic data with sovereign AI agents.",
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
      "We deploy resilient orchestration layers powered by Temporal and n8n to automate mission-critical operational flows. The architecture guarantees transaction idempotency, automated failure recovery, and standardized integration via OpenAPI.",
    technologies: ["n8n", "Temporal", "Python", "RabbitMQ", "OpenAPI"],
    iconKey: "workflow",
    bgImagePath: "/images/services/workflow.webp",
    meshOverlay: "rgba(56, 189, 248, 0.15)",
    metrics: [
      { label: "Auto Tasks", value: "65%" },
      { label: "Time Saved", value: "45%" },
    ],
    order: 2,
    persona: {
      ceo: "Eliminate low-value repetitive tasks and save 45% operational time across administrative workflows.",
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
      "We structure distributed multi-agent architectures using the MCP protocol and LangGraph to resolve complex processes through dynamic task decomposition. Each agentic building block collaborates via shared Redis memory with comprehensive execution tracing in Langfuse.",
    technologies: ["CrewAI", "LangGraph", "MCP", "Redis", "Langfuse"],
    iconKey: "bot",
    bgImagePath: "/images/services/agents.webp",
    meshOverlay: "rgba(168, 85, 247, 0.15)",
    metrics: [
      { label: "Completion Rate", value: "72%" },
      { label: "Deployed Agents", value: "38" },
    ],
    order: 3,
    persona: {
      ceo: "Equip your teams with 38 autonomous expert assistants capable of handling multi-step tasks under human oversight.",
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
      "We consolidate data silos into a Medallion architecture on Snowflake and BigQuery, modeled and tested via dbt. This governed semantic layer powers high-performance executive dashboards and natural language query interfaces.",
    technologies: ["Snowflake", "BigQuery", "dbt", "Power BI", "DuckDB"],
    iconKey: "chart",
    bgImagePath: "/images/services/data.webp",
    meshOverlay: "rgba(16, 185, 129, 0.15)",
    metrics: [
      { label: "Margin Gain", value: "+18.4%" },
      { label: "Dashboards", value: "42" },
    ],
    order: 4,
    persona: {
      ceo: "Make confident decisions with 42 governed dashboards and real-time, consolidated KPI visibility.",
      architect:
        "Medallion architecture on Snowflake/BigQuery: dbt transformations with data integrity tests, unified semantic layer, and Text-to-SQL agents.",
      operational:
        "Typical duration: 8 weeks. Team: 1 architect + 1 data engineer + 1 BI analyst. Tools: Power BI, dbt, Snowflake, Git.",
    },
  },
];

/** Solutions par défaut FR (repli offline pour /solutions et /solutions/[slug]). */
export const FALLBACK_SOLUTIONS_FR: SolutionDTO[] = [
  {
    id: "sol-1",
    slug: "logistics-ai",
    sector: "Logistique",
    title: "Optimisation logistique par l'IA",
    summary: "Ré-ordonnancement dynamique des tournées et prédiction de la demande via modèles ML, réduisant les coûts de transport de 22% et les ruptures de stock de 41%.",
    impact: "Jusqu'à -22% de coûts de transport · -41% de ruptures",
    methodology: "Résultats mesurés sur les déploiements logistiques clients, 2024–2025.",
    tags: ["ML", "Optimisation", "Prédiction"],
    order: 1,
  },
  {
    id: "sol-2",
    slug: "finance-agent",
    sector: "Finance",
    title: "Agents de conformité réglementaire",
    summary: "Agents cognitifs surveillant 100% des transactions en temps réel, détectant les anomalies de conformité et générant les rapports régulateurs automatiquement.",
    impact: "100% de flux audités · latence moyenne < 3s",
    methodology: "Mesures de performance observées sur flux transactionnels en production, 2024–2025.",
    tags: ["Agents", "Conformité", "Temps réel"],
    order: 2,
  },
  {
    id: "sol-3",
    slug: "retail-bi",
    sector: "Retail",
    title: "BI prédictive omnicanal",
    summary: "Suite décisionnelle unifiée croisant ventes, stocks et signaux comportementaux pour piloter le pricing dynamique et le réassort multi-boutiques.",
    impact: "+14% de marge en moyenne · 42 dashboards actifs",
    methodology: "Résultats mesurés sur les déploiements retail multi-sites, 2024–2025.",
    tags: ["BI", "Pricing", "Omnicanal"],
    order: 3,
  },
  {
    id: "sol-4",
    slug: "healthcare-nlp",
    sector: "Santé",
    title: "Synthèse clinique & extraction NLP",
    summary: "Extraction automatisée et structuration de données non structurées (comptes rendus, imagerie) accélérant le traitement des dossiers de 68%.",
    impact: "Jusqu'à 68% de gain de temps · 0 erreur critique observée",
    methodology: "Mesures issues des bancs d'évaluation et missions pilotes hospitalières, 2024–2025.",
    tags: ["NLP", "LLM", "Médical"],
    order: 4,
  },
  {
    id: "sol-5",
    slug: "industry-maintenance",
    sector: "Industrie",
    title: "Maintenance prédictive IoT",
    summary: "Détection précoce d'anomalies sur lignes de production réduisant les arrêts imprévus de 34% et prolongeant la durée de vie des équipements de 18 mois.",
    impact: "Jusqu'à -34% d'arrêts imprévus · +18 mois durée de vie",
    methodology: "Résultats mesurés sur lignes de production industrielle instrumentées, 2024–2025.",
    tags: ["IoT", "Séries temporelles", "Edge AI"],
    order: 5,
  },
  {
    id: "sol-6",
    slug: "energy-smartgrid",
    sector: "Énergie",
    title: "Optimisation de grille intelligente",
    summary: "Équilibrage offre/demande en temps réel et arbitrage sur marchés spot par RL, générant 850 k€ d'économies annuelles.",
    impact: "Jusqu'à 850 k€/an économisés · 99.9% de disponibilité",
    methodology: "Modélisation et retours d'exploitation sur réseaux d'énergie, 2024–2025.",
    tags: ["Reinforcement Learning", "Smart Grid", "Arbitrage"],
    order: 6,
  },
];

/** Solutions par défaut EN (repli offline pour /en/solutions et /en/solutions/[slug]). */
export const FALLBACK_SOLUTIONS_EN: SolutionDTO[] = [
  {
    id: "sol-1",
    slug: "logistics-ai",
    sector: "Logistics",
    title: "AI-Driven Logistics Optimization",
    summary: "Dynamic re-orchestration of routes and demand forecasting via ML models, reducing transportation costs by 22% and stockout rates by 41%.",
    impact: "Up to -22% freight costs · up to -41% stockouts",
    methodology: "Observed results across client logistics deployments, 2024–2025.",
    tags: ["ML", "Optimization", "Forecast"],
    order: 1,
  },
  {
    id: "sol-2",
    slug: "finance-agent",
    sector: "Finance",
    title: "Regulatory Compliance Agents",
    summary: "Cognitive agents monitoring 100% of transactions in real time, detecting compliance anomalies and automatically generating regulatory reports.",
    impact: "100% transaction coverage · < 3s average latency",
    methodology: "Production metrics measured across real-time transaction streams, 2024–2025.",
    tags: ["Agents", "Compliance", "Real-time"],
    order: 2,
  },
  {
    id: "sol-3",
    slug: "retail-bi",
    sector: "Retail",
    title: "Omnichannel Predictive BI",
    summary: "Unified decision-making suite cross-referencing sales, inventory and behavioral signals to drive dynamic pricing and multi-store replenishment.",
    impact: "+14% average margin gain · 42 active dashboards",
    methodology: "Measured results across multi-site retail rollouts, 2024–2025.",
    tags: ["BI", "Pricing", "Omnichannel"],
    order: 3,
  },
  {
    id: "sol-4",
    slug: "healthcare-nlp",
    sector: "Healthcare",
    title: "Clinical Synthesis & NLP Extraction",
    summary: "Automated extraction and structuring of unstructured data (reports, imaging) accelerating case processing by 68%.",
    impact: "Up to 68% time saved · 0 critical errors recorded",
    methodology: "Evaluated across clinical test benches and pilot hospital engagements, 2024–2025.",
    tags: ["NLP", "LLM", "Healthcare"],
    order: 4,
  },
  {
    id: "sol-5",
    slug: "industry-maintenance",
    sector: "Industry",
    title: "IoT Predictive Maintenance",
    summary: "Early detection of anomalies on production lines reducing unexpected downtime by 34% and extending equipment lifespan by 18 months.",
    impact: "Up to -34% unplanned downtime · +18 months lifespan",
    methodology: "Measured on instrumented industrial manufacturing lines, 2024–2025.",
    tags: ["IoT", "Time Series", "Edge AI"],
    order: 5,
  },
  {
    id: "sol-6",
    slug: "energy-smartgrid",
    sector: "Energy",
    title: "Smart Grid Optimization",
    summary: "Real-time supply/demand balancing and spot market arbitrage via RL, generating €850k in annual savings.",
    impact: "Up to €850k/year saved · 99.9% platform availability",
    methodology: "Simulation and operational feedback across energy grid operations, 2024–2025.",
    tags: ["Reinforcement Learning", "Smart Grid", "Arbitrage"],
    order: 6,
  },
];

/** Métriques opérationnelles par défaut FR (Preuve rapide & Data Console Bento). */
export const FALLBACK_METRICS_FR: MetricDTO[] = [
  {
    id: "m-01",
    key: "missions_delivered",
    label: KEY_STATS_CONFIG.missions.labelFr,
    value: KEY_STATS_CONFIG.missions.value,
    numericValue: KEY_STATS_CONFIG.missions.numericValue,
    suffix: KEY_STATS_CONFIG.missions.suffix ?? "+",
    trend: 12.0,
    sparkline: [12, 18, 24, 32, 38, 44, KEY_STATS_CONFIG.missions.numericValue],
    source: "bento",
    order: 1,
  },
  {
    id: "m-02",
    key: "cost_reduction",
    label: KEY_STATS_CONFIG.costReduction.labelFr,
    value: KEY_STATS_CONFIG.costReduction.value,
    numericValue: KEY_STATS_CONFIG.costReduction.numericValue,
    suffix: KEY_STATS_CONFIG.costReduction.suffix ?? "%",
    trend: -35.0,
    sparkline: [60, 52, 45, 40, 38, 36, KEY_STATS_CONFIG.costReduction.numericValue],
    source: "bento",
    order: 2,
  },
  {
    id: "m-03",
    key: "uptime_platform",
    label: KEY_STATS_CONFIG.uptime.labelFr,
    value: KEY_STATS_CONFIG.uptime.value,
    numericValue: KEY_STATS_CONFIG.uptime.numericValue,
    suffix: KEY_STATS_CONFIG.uptime.suffix ?? "%",
    trend: 99.9,
    sparkline: [99.8, 99.85, 99.9, 99.9, 99.95, 99.9, KEY_STATS_CONFIG.uptime.numericValue],
    source: "bento",
    order: 3,
  },
  {
    id: "m-04",
    key: "satisfaction_rate",
    label: KEY_STATS_CONFIG.satisfaction.labelFr,
    value: KEY_STATS_CONFIG.satisfaction.value,
    numericValue: KEY_STATS_CONFIG.satisfaction.numericValue,
    suffix: KEY_STATS_CONFIG.satisfaction.suffix ?? "/5",
    trend: 4.9,
    sparkline: [4.6, 4.7, 4.8, 4.8, 4.9, 4.9, KEY_STATS_CONFIG.satisfaction.numericValue],
    source: "bento",
    order: 4,
  },
  {
    id: "m-05",
    key: "processes_automated",
    label: "Processus automatisés",
    value: "48",
    numericValue: 48,
    suffix: "",
    trend: 8.4,
    sparkline: [12, 18, 24, 32, 38, 44, 48],
    source: "stream",
    order: 5,
  },
  {
    id: "m-06",
    key: "agents_production",
    label: "Agents IA en production",
    value: "38",
    numericValue: 38,
    suffix: "",
    trend: 22.1,
    sparkline: [6, 12, 18, 24, 30, 35, 38],
    source: "stream",
    order: 6,
  },
  {
    id: "m-07",
    key: "dashboards_decisional",
    label: "Dashboards décisionnels",
    value: "42",
    numericValue: 42,
    suffix: "",
    trend: 14.2,
    sparkline: [10, 16, 22, 28, 34, 38, 42],
    source: "stream",
    order: 7,
  },
  {
    id: "m-08",
    key: "hours_saved_monthly",
    label: "Heures sauvées / mois",
    value: "420 h",
    numericValue: 420,
    suffix: " h",
    trend: 18.0,
    sparkline: [120, 180, 240, 310, 360, 400, 420],
    source: "stream",
    order: 8,
  },
];

/** Métriques opérationnelles par défaut EN. */
export const FALLBACK_METRICS_EN: MetricDTO[] = [
  {
    id: "m-01",
    key: "missions_delivered",
    label: KEY_STATS_CONFIG.missions.labelEn,
    value: KEY_STATS_CONFIG.missions.value,
    numericValue: KEY_STATS_CONFIG.missions.numericValue,
    suffix: KEY_STATS_CONFIG.missions.suffix ?? "+",
    trend: 12.0,
    sparkline: [12, 18, 24, 32, 38, 44, KEY_STATS_CONFIG.missions.numericValue],
    source: "bento",
    order: 1,
  },
  {
    id: "m-02",
    key: "cost_reduction",
    label: KEY_STATS_CONFIG.costReduction.labelEn,
    value: KEY_STATS_CONFIG.costReduction.value,
    numericValue: KEY_STATS_CONFIG.costReduction.numericValue,
    suffix: KEY_STATS_CONFIG.costReduction.suffix ?? "%",
    trend: -35.0,
    sparkline: [60, 52, 45, 40, 38, 36, KEY_STATS_CONFIG.costReduction.numericValue],
    source: "bento",
    order: 2,
  },
  {
    id: "m-03",
    key: "uptime_platform",
    label: KEY_STATS_CONFIG.uptime.labelEn,
    value: KEY_STATS_CONFIG.uptime.value,
    numericValue: KEY_STATS_CONFIG.uptime.numericValue,
    suffix: KEY_STATS_CONFIG.uptime.suffix ?? "%",
    trend: 99.9,
    sparkline: [99.8, 99.85, 99.9, 99.9, 99.95, 99.9, KEY_STATS_CONFIG.uptime.numericValue],
    source: "bento",
    order: 3,
  },
  {
    id: "m-04",
    key: "satisfaction_rate",
    label: KEY_STATS_CONFIG.satisfaction.labelEn,
    value: KEY_STATS_CONFIG.satisfaction.value,
    numericValue: KEY_STATS_CONFIG.satisfaction.numericValue,
    suffix: KEY_STATS_CONFIG.satisfaction.suffix ?? "/5",
    trend: 4.9,
    sparkline: [4.6, 4.7, 4.8, 4.8, 4.9, 4.9, KEY_STATS_CONFIG.satisfaction.numericValue],
    source: "bento",
    order: 4,
  },
  {
    id: "m-05",
    key: "processes_automated",
    label: "Automated Processes",
    value: "48",
    numericValue: 48,
    suffix: "",
    trend: 8.4,
    sparkline: [12, 18, 24, 32, 38, 44, 48],
    source: "stream",
    order: 5,
  },
  {
    id: "m-06",
    key: "agents_production",
    label: "Production AI Agents",
    value: "38",
    numericValue: 38,
    suffix: "",
    trend: 22.1,
    sparkline: [6, 12, 18, 24, 30, 35, 38],
    source: "stream",
    order: 6,
  },
  {
    id: "m-07",
    key: "dashboards_decisional",
    label: "Executive Dashboards",
    value: "42",
    numericValue: 42,
    suffix: "",
    trend: 14.2,
    sparkline: [10, 16, 22, 28, 34, 38, 42],
    source: "stream",
    order: 7,
  },
  {
    id: "m-08",
    key: "hours_saved_monthly",
    label: "Hours Saved / Month",
    value: "420 h",
    numericValue: 420,
    suffix: " h",
    trend: 18.0,
    sparkline: [120, 180, 240, 310, 360, 400, 420],
    source: "stream",
    order: 8,
  },
];

/** Logs d'activité temps réel par défaut FR (Console de télémétrie). */
export const FALLBACK_ACTIVITY_LOGS_FR: ActivityLogDTO[] = [
  { id: "log-1", time: "14:02:11", level: "ok", event: "Agent[finance-42] — rapport de conformité généré" },
  { id: "log-2", time: "14:01:48", level: "info", event: "Workflow[logistics-routes] optimisé · -22% coût" },
  { id: "log-3", time: "14:01:22", level: "ok", event: "Pipeline[data-ingest] 48k lignes traitées" },
  { id: "log-4", time: "14:00:55", level: "warn", event: "Latence RAG 280ms · spike maîtrisé" },
  { id: "log-5", time: "14:00:12", level: "info", event: "Dashboard[exec-cfo] rafraîchi · 42 KPIs" },
  { id: "log-6", time: "13:59:40", level: "ok", event: "Agent[support-38] ticket résolu · 1.2s" },
  { id: "log-7", time: "13:58:15", level: "ok", event: "Orchestrateur multi-agents : 38 agents synchronisés" },
];

/** Logs d'activité temps réel par défaut EN. */
export const FALLBACK_ACTIVITY_LOGS_EN: ActivityLogDTO[] = [
  { id: "log-1", time: "14:02:11", level: "ok", event: "Agent[finance-42] — compliance report generated" },
  { id: "log-2", time: "14:01:48", level: "info", event: "Workflow[logistics-routes] optimized · -22% cost" },
  { id: "log-3", time: "14:01:22", level: "ok", event: "Pipeline[data-ingest] 48k rows processed" },
  { id: "log-4", time: "14:00:55", level: "warn", event: "RAG Latency 280ms · spike mitigated" },
  { id: "log-5", time: "14:00:12", level: "info", event: "Dashboard[exec-cfo] refreshed · 42 KPIs" },
  { id: "log-6", time: "13:59:40", level: "ok", event: "Agent[support-38] ticket resolved · 1.2s" },
  { id: "log-7", time: "13:58:15", level: "ok", event: "Multi-agent orchestrator: 38 agents in sync" },
];

/** Témoignages clients par défaut FR. */
export const FALLBACK_TESTIMONIALS_FR: TestimonialDTO[] = [
  {
    id: "test-1",
    author: "Marc Dupont",
    role: "Directeur des Opérations",
    company: "Groupe Industriel",
    quote: "L'automatisation de nos 48 flux critiques a transformé notre quotidien avec 45% de gain de temps opérationnel.",
    order: 1,
  },
  {
    id: "test-2",
    author: "Claire Valette",
    role: "VP Engineering",
    company: "Fintech Leader",
    quote: "Leur architecture multi-agents nous a permis de déployer 38 agents cognitifs fiables et sous contrôle total.",
    order: 2,
  },
  {
    id: "test-3",
    author: "Alexandre Roy",
    role: "Chief Data Officer",
    company: "Retail Omnicanal",
    quote: "42 dashboards unifiés et des décisions instantanées. Une transformation moderne, structurée et durable.",
    order: 3,
  },
];

/** Témoignages clients par défaut EN. */
export const FALLBACK_TESTIMONIALS_EN: TestimonialDTO[] = [
  {
    id: "test-1",
    author: "Marc Dupont",
    role: "Chief Operating Officer",
    company: "Industrial Group",
    quote: "Automating our 48 critical workflows transformed our day-to-day operations with 45% time saved.",
    order: 1,
  },
  {
    id: "test-2",
    author: "Claire Valette",
    role: "VP Engineering",
    company: "Fintech Leader",
    quote: "Their multi-agent architecture enabled us to deploy 38 cognitive agents under complete human oversight.",
    order: 2,
  },
  {
    id: "test-3",
    author: "Alexandre Roy",
    role: "Chief Data Officer",
    company: "Omnichannel Retail",
    quote: "42 unified dashboards and instant decision-making. A modern, structured, and long-lasting transformation.",
    order: 3,
  },
];

/** Logos et références clients par défaut. */
export const FALLBACK_CLIENT_LOGOS: ClientLogoDTO[] = [
  { id: "cl-1", name: "NovaFinance", sector: "Fintech", logoUrl: null, websiteUrl: "https://novafinance.example.com", order: 1 },
  { id: "cl-2", name: "Axiom Conseil", sector: "Stratégie", logoUrl: null, websiteUrl: "https://axiom.example.com", order: 2 },
  { id: "cl-3", name: "Helios Energy", sector: "Énergie", logoUrl: null, websiteUrl: "https://helios.example.com", order: 3 },
  { id: "cl-4", name: "Vanguard Log", sector: "Logistique", logoUrl: null, websiteUrl: "https://vanguard.example.com", order: 4 },
  { id: "cl-5", name: "TheraHealth", sector: "Santé", logoUrl: null, websiteUrl: "https://therahealth.example.com", order: 5 },
  { id: "cl-6", name: "RetailPulse", sector: "Retail", logoUrl: null, websiteUrl: "https://retailpulse.example.com", order: 6 },
];

/** Mots-clés défilants Ticker FR. */
export const FALLBACK_MARQUEE_KEYWORDS_FR: string[] = [
  "ARCHITECTURES RAG",
  "COLLECTIFS MULTI-AGENTS",
  "DBT & MODERN DATA STACK",
  "WORKFLOWS TEMPORAL & N8N",
  "GOUVERNANCE IA ENTREPRISE",
  "ÉVALUATIONS CONTINUES LLM",
  "PLATEFORMES DATA HAUTE DISPONIBILITÉ",
];

/** Mots-clés défilants Ticker EN. */
export const FALLBACK_MARQUEE_KEYWORDS_EN: string[] = [
  "RAG ARCHITECTURES",
  "MULTI-AGENT COLLECTIVES",
  "DBT & MODERN DATA STACK",
  "N8N & TEMPORAL WORKFLOWS",
  "ENTERPRISE AI GOVERNANCE",
  "LLM BENCHMARK & EVALS",
  "HIGH-PERFORMANCE DATA PLATFORMS",
];

/** Valeurs de l'entreprise par défaut FR. */
export const FALLBACK_COMPANY_VALUES_FR: CompanyValueDTO[] = [
  {
    id: "val-1",
    iconKey: "Target",
    title: "Précision & Déterminisme",
    description: "Nous refusons l'IA approximative. Chaque système intègre des métriques de fiabilité strictes et des garde-fous auditables.",
    order: 1,
  },
  {
    id: "val-2",
    iconKey: "Eye",
    title: "Transparence & Souveraineté",
    description: "Vos données restent votre propriété exclusive. Nos déploiements privilégient l'open source et les clouds souverains.",
    order: 2,
  },
  {
    id: "val-3",
    iconKey: "Heart",
    title: "Pérennité & Simplicité",
    description: "Nous créons des architectures modulaires conçues pour évoluer sans accumulation de dette technique.",
    order: 3,
  },
  {
    id: "val-4",
    iconKey: "Users",
    title: "Contrôle Humain (HITL)",
    description: "L'autonomie n'est jamais un blanc-seing. Nos systèmes placent toujours vos experts aux commandes des décisions critiques.",
    order: 4,
  },
];

/** Valeurs de l'entreprise par défaut EN. */
export const FALLBACK_COMPANY_VALUES_EN: CompanyValueDTO[] = [
  {
    id: "val-1",
    iconKey: "Target",
    title: "Precision & Determinism",
    description: "We reject guesswork. Every AI deployment features strict reliability benchmarks and auditable safety guardrails.",
    order: 1,
  },
  {
    id: "val-2",
    iconKey: "Eye",
    title: "Transparency & Sovereignty",
    description: "Your corporate data stays exclusively yours. Our architectures favor open technologies and sovereign cloud providers.",
    order: 2,
  },
  {
    id: "val-3",
    iconKey: "Heart",
    title: "Sustainability & Simplicity",
    description: "We build modular platforms engineered to scale without creating architectural debt or lock-in.",
    order: 3,
  },
  {
    id: "val-4",
    iconKey: "Users",
    title: "Human-In-The-Loop",
    description: "Autonomy does not mean lack of oversight. Our systems keep your domain experts in command of high-stakes decisions.",
    order: 4,
  },
];

/** Étapes de la méthode de livraison FR. */
export const FALLBACK_DELIVERY_STEPS_FR: DeliveryStepDTO[] = [
  {
    id: "step-1",
    iconKey: "Search",
    label: "01 · Cadrage & Architecture",
    description: "Audit des sources, cartographie des flux et définition de l'architecture cible sécurisée sous 1 à 2 semaines.",
    order: 1,
  },
  {
    id: "step-2",
    iconKey: "Cpu",
    label: "02 · POC en Conditions Réelles",
    description: "Prototype fonctionnel sur vos données réelles, évalué sur banc de test précision et latence en 4 semaines.",
    order: 2,
  },
  {
    id: "step-3",
    iconKey: "Zap",
    label: "03 · Industrialisation & CI/CD",
    description: "Déploiement production avec garde-fous, observabilité temps réel et intégration continue en 6 à 8 semaines.",
    order: 3,
  },
  {
    id: "step-4",
    iconKey: "RefreshCw",
    label: "04 · Run & Amélioration Continue",
    description: "Supervision continue, détection de dérive des modèles et itérations mensuelles à forte valeur ajoutée.",
    order: 4,
  },
];

/** Étapes de la méthode de livraison EN. */
export const FALLBACK_DELIVERY_STEPS_EN: DeliveryStepDTO[] = [
  {
    id: "step-1",
    iconKey: "Search",
    label: "01 · Scoping & Architecture",
    description: "Data sources audit, workflow mapping, and target architecture validation within 1 to 2 weeks.",
    order: 1,
  },
  {
    id: "step-2",
    iconKey: "Cpu",
    label: "02 · Production Proof of Concept",
    description: "Working prototype on real corporate data evaluated against accuracy and latency benchmarks in 4 weeks.",
    order: 2,
  },
  {
    id: "step-3",
    iconKey: "Zap",
    label: "03 · Industrialization & CI/CD",
    description: "Production rollout with safety guardrails, real-time observability, and CI/CD pipelines in 6 to 8 weeks.",
    order: 3,
  },
  {
    id: "step-4",
    iconKey: "RefreshCw",
    label: "04 · Run & Continuous Improvement",
    description: "Continuous observability, drift detection, and high-impact monthly iterations without technical debt.",
    order: 4,
  },
];

/** Catégories du blog par défaut FR. */
export const FALLBACK_BLOG_CATEGORIES_FR: BlogCategoryDTO[] = [
  { id: "cat-1", key: "ia", label: "Intelligence Artificielle", colorClass: "text-[#F26D3D]", order: 1 },
  { id: "cat-2", key: "automation", label: "Automatisation", colorClass: "text-[#38BDF8]", order: 2 },
  { id: "cat-3", key: "data", label: "Data & Décision", colorClass: "text-[#A855F7]", order: 3 },
];

/** Catégories du blog par défaut EN. */
export const FALLBACK_BLOG_CATEGORIES_EN: BlogCategoryDTO[] = [
  { id: "cat-1", key: "ia", label: "Artificial Intelligence", colorClass: "text-[#F26D3D]", order: 1 },
  { id: "cat-2", key: "automation", label: "Automation", colorClass: "text-[#38BDF8]", order: 2 },
  { id: "cat-3", key: "data", label: "Data & Decision", colorClass: "text-[#A855F7]", order: 3 },
];

/** Articles de blog / insights par défaut FR. */
export const FALLBACK_BLOG_POSTS_FR: BlogPostDTO[] = [
  {
    id: "post-1",
    slug: "evaluer-systeme-rag-production",
    title: "Évaluer un système RAG en production : métriques, biais et garde-fous",
    excerpt: "Comment dépasser les démos pour construire une suite d'évaluation continue fiable avec Ragas, TruLens et réordonnancement sémantique.",
    categoryKey: "ia",
    categoryLabel: "Intelligence Artificielle",
    date: "2025-02-15T00:00:00.000Z",
    readingTime: "6 min",
    author: "Martial GNINHI",
    tags: ["RAG", "LLM", "Evaluation", "Production"],
  },
  {
    id: "post-2",
    slug: "n8n-vs-temporal-orchestration",
    title: "n8n vs Temporal : choisir l'orchestrateur adapté à vos flux critiques",
    excerpt: "Analyse comparative approfondie entre automatisation low-code événementielle et moteur d'orchestration distribué haute résilience.",
    categoryKey: "automation",
    categoryLabel: "Automatisation",
    date: "2025-01-28T00:00:00.000Z",
    readingTime: "8 min",
    author: "Martial GNINHI",
    tags: ["n8n", "Temporal", "Orchestration", "Workflows"],
  },
  {
    id: "post-3",
    slug: "couche-semantique-dbt-bi",
    title: "La couche sémantique dbt : le chaînon manquant pour fiabiliser votre BI",
    excerpt: "Pourquoi unifier vos règles de calcul dans dbt Core est indispensable avant d'alimenter vos dashboards et assistants Text-to-SQL.",
    categoryKey: "data",
    categoryLabel: "Data & Décision",
    date: "2025-01-10T00:00:00.000Z",
    readingTime: "5 min",
    author: "Martial GNINHI",
    tags: ["dbt", "Snowflake", "BI", "Semantic Layer"],
  },
];

/** Articles de blog / insights par défaut EN. */
export const FALLBACK_BLOG_POSTS_EN: BlogPostDTO[] = [
  {
    id: "post-1",
    slug: "evaluer-systeme-rag-production",
    title: "Evaluating RAG Systems in Production: Metrics, Bias & Guardrails",
    excerpt: "Moving beyond demos to build continuous evaluation test benches with Ragas, TruLens, and semantic reranking.",
    categoryKey: "ia",
    categoryLabel: "Artificial Intelligence",
    date: "2025-02-15T00:00:00.000Z",
    readingTime: "6 min",
    author: "Martial GNINHI",
    tags: ["RAG", "LLM", "Evaluation", "Production"],
  },
  {
    id: "post-2",
    slug: "n8n-vs-temporal-orchestration",
    title: "n8n vs Temporal: Selecting the Right Orchestrator for Critical Flows",
    excerpt: "In-depth comparison between event-driven low-code automation and fault-tolerant distributed orchestration engines.",
    categoryKey: "automation",
    categoryLabel: "Automation",
    date: "2025-01-28T00:00:00.000Z",
    readingTime: "8 min",
    author: "Martial GNINHI",
    tags: ["n8n", "Temporal", "Orchestration", "Workflows"],
  },
  {
    id: "post-3",
    slug: "couche-semantique-dbt-bi",
    title: "dbt Semantic Layer: The Missing Link for Reliable Enterprise BI",
    excerpt: "Why unifying calculation logic in dbt Core is required before powering executive dashboards and Text-to-SQL agents.",
    categoryKey: "data",
    categoryLabel: "Data & Decision",
    date: "2025-01-10T00:00:00.000Z",
    readingTime: "5 min",
    author: "Martial GNINHI",
    tags: ["dbt", "Snowflake", "BI", "Semantic Layer"],
  },
];

/** Capacités techniques par défaut FR. */
export const FALLBACK_CAPABILITIES_FR: CapabilityDTO[] = [
  {
    id: "cap-1",
    key: "rag",
    stretch: "01",
    title: "RAG Haute Précision",
    description: "Pipelines de recherche vectorielle hybride, reranking sémantique et garde-fous anti-hallucination.",
    features: ["Indexation multimodale", "Recherche vectorielle Qdrant", "Garde-fous Ragas & NeMo"],
    order: 1,
  },
  {
    id: "cap-2",
    key: "agents",
    stretch: "02",
    title: "Collectifs Multi-Agents",
    description: "Systèmes d'agents collaboratifs avec mémoire partagée Redis et traçage Langfuse.",
    features: ["Protocole MCP natif", "Supervision HITL", "Décomposition dynamique de tâches"],
    order: 2,
  },
  {
    id: "cap-3",
    key: "automation",
    stretch: "03",
    title: "Orchestration & Workflows",
    description: "Automatisation de processus métiers critiques avec idempotence et reprise automatique.",
    features: ["Pipelines n8n & Temporal", "Connecteurs API standardisés", "Monitoring Prometheus continu"],
    order: 3,
  },
  {
    id: "cap-4",
    key: "data",
    stretch: "04",
    title: "Data Platform & BI",
    description: "Couche sémantique gouvernée sous dbt et tableaux de bord temps réel haute performance.",
    features: ["Architecture Medallion Snowflake", "Modélisation dbt Core", "Dashboards exécutifs 42 KPIs"],
    order: 4,
  },
];

/** Capacités techniques par défaut EN. */
export const FALLBACK_CAPABILITIES_EN: CapabilityDTO[] = [
  {
    id: "cap-1",
    key: "rag",
    stretch: "01",
    title: "High-Precision RAG",
    description: "Hybrid vector retrieval pipelines, semantic reranking, and deterministic anti-hallucination guardrails.",
    features: ["Multimodal indexing", "Qdrant vector search", "Ragas & NeMo safety guardrails"],
    order: 1,
  },
  {
    id: "cap-2",
    key: "agents",
    stretch: "02",
    title: "Multi-Agent Collectives",
    description: "Collaborative agent architectures featuring shared Redis memory and comprehensive Langfuse tracing.",
    features: ["Native MCP protocol", "HITL governance gates", "Dynamic task decomposition"],
    order: 2,
  },
  {
    id: "cap-3",
    key: "automation",
    stretch: "03",
    title: "Orchestration & Workflows",
    description: "Critical business process automation with native idempotency and automated failure recovery.",
    features: ["Temporal & n8n engines", "Standardized API connectors", "Continuous Prometheus telemetry"],
    order: 3,
  },
  {
    id: "cap-4",
    key: "data",
    stretch: "04",
    title: "Data Platform & Decision BI",
    description: "Governed semantic layer modeled with dbt and high-performance real-time executive dashboards.",
    features: ["Snowflake Medallion architecture", "dbt Core semantic modeling", "42-KPI executive dashboards"],
    order: 4,
  },
];

/** Navigation par défaut FR. */
export const FALLBACK_NAV_ITEMS_FR: NavItemDTO[] = [
  { id: "nav-1", viewKey: "home", label: "Accueil", hint: "Vue d'ensemble", order: 1 },
  { id: "nav-2", viewKey: "services", label: "Services", hint: "4 expertises", order: 2 },
  { id: "nav-3", viewKey: "solutions", label: "Solutions", hint: "Cas d'usage", order: 3 },
  { id: "nav-4", viewKey: "blog", label: "Insights", hint: "Analyses", order: 4 },
  { id: "nav-5", viewKey: "contact", label: "Contact", hint: "Échanger", order: 5 },
];

/** Navigation par défaut EN. */
export const FALLBACK_NAV_ITEMS_EN: NavItemDTO[] = [
  { id: "nav-1", viewKey: "home", label: "Home", hint: "Overview", order: 1 },
  { id: "nav-2", viewKey: "services", label: "Services", hint: "4 Pillars", order: 2 },
  { id: "nav-3", viewKey: "solutions", label: "Solutions", hint: "Use Cases", order: 3 },
  { id: "nav-4", viewKey: "blog", label: "Insights", hint: "Articles", order: 4 },
  { id: "nav-5", viewKey: "contact", label: "Contact", hint: "Get in touch", order: 5 },
];

/** Mentions légales & RGPD par défaut FR. */
export const FALLBACK_LEGAL_SECTIONS_FR: LegalSectionDTO[] = [
  {
    id: "leg-1",
    type: "legal",
    heading: "1. Éditeur du site",
    body: "Le site https://analyticatech.fr est édité par la société Analyticatech, société par actions simplifiée (SAS) au capital de 1 000,00 €.\nSiège social réel : 60 rue François 1er, 75008 Paris, France.\nImmatriculation : SIREN 984 609 198 — SIRET 984 609 198 00010 (RCS Paris).\nNuméro de TVA intracommunautaire : FR96984609198.\nDirecteur de la publication : Martial GNINHI, en sa qualité de Président de la SAS.\nActivité exercée : Conseil en systèmes et logiciels informatiques (Code NAF/APE : 62.02A).",
    order: 1,
  },
  {
    id: "leg-2",
    type: "legal",
    heading: "2. Hébergeur du site web",
    body: "Hébergement du site internet vitrine : Hostinger (Hostinger International Ltd., 61 Lordou Vironos Street, 6023 Larnaca, Chypre — https://www.hostinger.fr/contact).\n\nDistinction essentielle avec les données clients : L'hébergement web susmentionné est dédié exclusivement à la diffusion publique du site vitrine. Il est strictement distinct et étanche des infrastructures cloud souveraines (SecNumCloud, VPC privés clients, ISO 27001) hébergeant et traitant les données clients dans le cadre de nos missions de conseil en intelligence artificielle et data, régies par des accords de traitement de données (DPA) et de confidentialité (NDA).",
    order: 2,
  },
  {
    id: "leg-3",
    type: "legal",
    heading: "3. Propriété intellectuelle",
    body: "L'ensemble des éléments constituant ce site (architecture, textes, articles, codes, composants graphiques, visualisations, marques et logos) est la propriété exclusive d'Analyticatech ou fait l'objet d'une autorisation d'exploitation. Toute reproduction, représentation, extraction ou diffusion, totale ou partielle, sans accord écrit préalable est interdite (articles L. 111-1 et suivants du Code de la Propriété Intellectuelle). Conformément à l'article L. 122-5-3 du CPI, Analyticatech s'oppose expressément à toute fouille automatisée de textes et de données (TDM) à des fins d'entraînement d'IA tierces.",
    order: 3,
  },
  {
    id: "leg-4",
    type: "legal",
    heading: "4. Contact",
    body: "Pour toute demande légale, information ou réclamation : Email : contact@analyticatech.fr | Téléphone : +33 7 68 61 13 10 | Adresse : 60 rue François 1er, 75008 Paris, France | Formulaire en ligne accessible sur la page /contact. Réponse sous 24 à 48 heures ouvrées.",
    order: 4,
  },
  {
    id: "rgpd-1",
    type: "rgpd",
    heading: "1. Collecte et finalité des données",
    body: "Les données recueillies via le formulaire de contact sont strictement limitées à la gestion des demandes commerciales et techniques. Aucune donnée n'est cédée ou vendue à des tiers.",
    order: 1,
  },
  {
    id: "rgpd-2",
    type: "rgpd",
    heading: "2. Vos droits",
    body: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en écrivant à contact@analyticatech.fr.",
    order: 2,
  },
];

/** Mentions légales & RGPD par défaut EN. */
export const FALLBACK_LEGAL_SECTIONS_EN: LegalSectionDTO[] = [
  {
    id: "leg-1",
    type: "legal",
    heading: "1. Site Publisher",
    body: "The website https://analyticatech.fr is published by Analyticatech, SAS with share capital of €1,000.00.\nRegistered office: 60 rue François 1er, 75008 Paris, France.\nRegistration: SIREN 984 609 198 — SIRET 984 609 198 00010 (RCS Paris).\nVAT Number: FR96984609198.\nPublishing Director: Martial GNINHI, as President.\nBusiness activity: Computer systems and software consulting (NAF/APE: 62.02A).",
    order: 1,
  },
  {
    id: "leg-2",
    type: "legal",
    heading: "2. Website Hosting Provider",
    body: "Showcase website hosting provider: Hostinger (Hostinger International Ltd., 61 Lordou Vironos Street, 6023 Larnaca, Cyprus — https://www.hostinger.fr/contact).\n\nKey distinction with client mission data: Public website hosting is strictly decoupled and isolated from sovereign enterprise cloud infrastructures (SecNumCloud, client VPCs, ISO 27001) hosting and processing client data for AI consulting engagements, governed by bespoke DPAs and NDAs.",
    order: 2,
  },
  {
    id: "leg-3",
    type: "legal",
    heading: "3. Intellectual Property",
    body: "All contents of this site (architecture, copy, codes, visuals, graphics, logos) are the exclusive property of Analyticatech. Any unauthorized reproduction, scraping or representation is prohibited under French Intellectual Property law. Analyticatech expressly opts out of text and data mining (TDM) for unauthorized AI training.",
    order: 3,
  },
  {
    id: "leg-4",
    type: "legal",
    heading: "4. Contact",
    body: "For any legal inquiries, corporate information or claims: Email: contact@analyticatech.fr | Phone: +33 7 68 61 13 10 | Address: 60 rue François 1er, 75008 Paris, France | Secure online form at /contact.",
    order: 4,
  },
  {
    id: "rgpd-1",
    type: "rgpd",
    heading: "1. Data Collection & Purpose",
    body: "Information collected via the contact form is strictly dedicated to answering your business and technical inquiries. No data is ever sold or transferred.",
    order: 1,
  },
  {
    id: "rgpd-2",
    type: "rgpd",
    heading: "2. Your Rights",
    body: "Under GDPR, you have the right to access, correct, or delete your personal data by contacting contact@analyticatech.fr.",
    order: 2,
  },
];
