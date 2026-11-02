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
    tagline: "Un assistant qui répond à partir de vos propres documents",
    description:
      "Je conçois des assistants qui répondent à vos équipes en s'appuyant uniquement sur vos documents internes (contrats, procédures, fiches techniques). La technique utilisée s'appelle RAG (génération augmentée par recherche) : l'assistant retrouve d'abord les passages utiles, puis rédige une réponse qui cite ses sources, pour que chacun puisse vérifier.",
    technologies: ["LangChain", "LangGraph", "Qdrant", "Cohere Rerank", "Ragas", "vLLM"],
    iconKey: "brain",
    bgImagePath: "/images/services/rag.webp",
    meshOverlay: "rgba(242, 109, 61, 0.15)",
    metrics: [],
    order: 1,
    persona: {
      ceo: "Vos équipes trouvent plus vite la bonne information dans vos documents, avec la source citée à chaque réponse et des données qui restent sous votre contrôle.",
      architect:
        "Pipeline modulaire : ingestion multi-formats, vectorisation dense/sparse (Qdrant), reranker cross-encoder et garde-fous anti-hallucination.",
      operational:
        "Démarrage par un cadrage de 1 à 2 semaines, puis un prototype sur vos vrais documents. Interlocuteur unique : le fondateur.",
    },
  },
  {
    id: "srv-02",
    index: "02",
    title: "Automatisation & Workflows",
    tagline: "Moins de ressaisies, des processus qui s'enchaînent seuls",
    description:
      "J'automatise les tâches répétitives entre vos outils (messagerie, ERP, tableurs, CRM) avec des outils comme n8n, une plateforme qui relie vos logiciels entre eux. Chaque automatisation est documentée, surveillée et reprend proprement en cas d'incident.",
    technologies: ["n8n", "Temporal", "Python", "RabbitMQ", "OpenAPI"],
    iconKey: "workflow",
    bgImagePath: "/images/services/workflow.webp",
    meshOverlay: "rgba(56, 189, 248, 0.15)",
    metrics: [],
    order: 2,
    persona: {
      ceo: "Vos équipes passent moins de temps sur les ressaisies et les relances, et plus sur les tâches qui demandent leur jugement.",
      architect:
        "Orchestration événementielle basée sur Temporal et n8n : idempotence native, retry exponentiel et monitoring temps réel sous Prometheus.",
      operational:
        "Un flux à la fois, en cycles courts de 2 semaines : flux testé, documentation et alertes en cas d'anomalie.",
    },
  },
  {
    id: "srv-03",
    index: "03",
    title: "Orchestration Multi-Agents",
    tagline: "Plusieurs assistants spécialisés qui travaillent ensemble, sous contrôle humain",
    description:
      "Pour les processus complexes, je conçois des systèmes multi-agents : plusieurs programmes d'IA spécialisés (un agent = un programme qui enchaîne des tâches de façon autonome) qui se répartissent le travail. Chaque décision importante reste validée par une personne de vos équipes.",
    technologies: ["CrewAI", "LangGraph", "MCP", "Redis", "Langfuse"],
    iconKey: "bot",
    bgImagePath: "/images/services/agents.webp",
    meshOverlay: "rgba(16, 185, 129, 0.15)",
    metrics: [],
    order: 3,
    persona: {
      ceo: "Les dossiers complexes sont préparés automatiquement, et vos équipes gardent la décision finale.",
      architect:
        "Architecture hiérarchique et collaborative : protocole MCP, mémoire partagée Redis, traçage des étapes de pensée via Langfuse.",
      operational:
        "Un audit de l'existant ou un cadrage précède toute construction. J'ai par exemple mené un audit de 3 semaines sur une architecture multi-agents, qui a relevé 7 redondances de logique.",
    },
  },
  {
    id: "srv-04",
    index: "04",
    title: "Data & Décision Augmentée",
    tagline: "Des chiffres fiables pour décider, dans des tableaux de bord clairs",
    description:
      "Je rassemble vos données dispersées (ventes, finance, production) dans une base unique et fiable, puis je construis des tableaux de bord Power BI lisibles par la direction. Les indicateurs sont définis une seule fois, pour que chacun parle des mêmes chiffres.",
    technologies: ["Snowflake", "BigQuery", "dbt", "Power BI", "DuckDB"],
    iconKey: "chart",
    bgImagePath: "/images/services/data.webp",
    meshOverlay: "rgba(168, 85, 247, 0.15)",
    metrics: [],
    order: 4,
    persona: {
      ceo: "La direction dispose d'une vision consolidée et à jour de ses indicateurs clés, sans consolidation manuelle sous tableur.",
      architect:
        "Architecture Medallion sur Snowflake/BigQuery : transformation dbt avec tests d'intégrité, couche sémantique unifiée et agents Text-to-SQL.",
      operational:
        "Projet type : cadrage des indicateurs, connexion des sources, puis livraison des tableaux de bord par étapes. Outils : Power BI, SQL.",
    },
  },
];

/** Services par défaut EN (repli offline pour /en/services et /en/services/[index]) — 4 piliers. */
export const FALLBACK_SERVICES_EN: ServiceDTO[] = [
  {
    id: "srv-01",
    index: "01",
    title: "Reasoning & RAG",
    tagline: "An assistant that answers from your own documents",
    description:
      "I build assistants that answer your teams using only your internal documents (contracts, procedures, technical sheets). The technique is called RAG (retrieval-augmented generation): the assistant first finds the relevant passages, then writes an answer that cites its sources, so anyone can check.",
    technologies: ["LangChain", "LangGraph", "Qdrant", "Cohere Rerank", "Ragas", "vLLM"],
    iconKey: "brain",
    bgImagePath: "/images/services/rag.webp",
    meshOverlay: "rgba(242, 109, 61, 0.15)",
    metrics: [],
    order: 1,
    persona: {
      ceo: "Your teams find the right information faster, with the source cited in every answer and data that stays under your control.",
      architect:
        "Modular pipeline: multi-format ingestion, dense/sparse vectorization (Qdrant), cross-encoder reranker, and anti-hallucination guardrails.",
      operational:
        "Starts with a 1–2 week scoping phase, then a prototype on your real documents. Single point of contact: the founder.",
    },
  },
  {
    id: "srv-02",
    index: "02",
    title: "Automation & Workflows",
    tagline: "Less re-keying, processes that run on their own",
    description:
      "I automate repetitive tasks between your tools (email, ERP, spreadsheets, CRM) with tools such as n8n, a platform that connects your software together. Every automation is documented, monitored and recovers cleanly after an incident.",
    technologies: ["n8n", "Temporal", "Python", "RabbitMQ", "OpenAPI"],
    iconKey: "workflow",
    bgImagePath: "/images/services/workflow.webp",
    meshOverlay: "rgba(56, 189, 248, 0.15)",
    metrics: [],
    order: 2,
    persona: {
      ceo: "Your teams spend less time re-keying and chasing, and more on work that needs their judgement.",
      architect:
        "Event-driven orchestration using Temporal & n8n: native idempotence, exponential retry policies, and real-time Prometheus monitoring.",
      operational:
        "One workflow at a time, in short 2-week cycles: tested workflow, documentation and anomaly alerts.",
    },
  },
  {
    id: "srv-03",
    index: "03",
    title: "Multi-Agent Orchestration",
    tagline: "Several specialised assistants working together, under human control",
    description:
      "For complex processes, I design multi-agent systems: several specialised AI programs (an agent is a program that chains tasks autonomously) that share the work. Every important decision is still validated by someone on your team.",
    technologies: ["CrewAI", "LangGraph", "MCP", "Redis", "Langfuse"],
    iconKey: "bot",
    bgImagePath: "/images/services/agents.webp",
    meshOverlay: "rgba(168, 85, 247, 0.15)",
    metrics: [],
    order: 3,
    persona: {
      ceo: "Complex files are prepared automatically, and your teams keep the final decision.",
      architect:
        "Hierarchical and collaborative architecture: MCP protocol, Redis shared state, reasoning-step tracing via Langfuse.",
      operational:
        "An audit or scoping phase comes before any build. For example, I led a 3-week audit of a multi-agent architecture that found 7 logic redundancies.",
    },
  },
  {
    id: "srv-04",
    index: "04",
    title: "Data & Augmented Decision",
    tagline: "Reliable figures for decisions, in clear dashboards",
    description:
      "I bring your scattered data (sales, finance, production) into a single reliable base, then build Power BI dashboards that leadership can read. Indicators are defined once, so everyone talks about the same numbers.",
    technologies: ["Snowflake", "BigQuery", "dbt", "Power BI", "DuckDB"],
    iconKey: "chart",
    bgImagePath: "/images/services/data.webp",
    meshOverlay: "rgba(16, 185, 129, 0.15)",
    metrics: [],
    order: 4,
    persona: {
      ceo: "Leadership gets a consolidated, up-to-date view of its key indicators, without manual spreadsheet consolidation.",
      architect:
        "Medallion architecture on Snowflake/BigQuery: dbt transformations with data integrity tests, unified semantic layer, and Text-to-SQL agents.",
      operational:
        "Typical project: indicator scoping, source connection, then dashboards delivered in stages. Tools: Power BI, SQL.",
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
    summary: "Réorganisation des tournées et prévision de la demande par apprentissage automatique (des modèles qui apprennent à partir de vos historiques), pour réduire les coûts de transport et les ruptures de stock.",
    impact: "Coûts de transport · taux de rupture · délais de livraison",
    impactLabel: "Indicateurs mesurés",
    statusBadge: "Cas d’usage type",
    statusType: "methodology",
    methodology: "Scénario type : les indicateurs sont mesurés avant et après le déploiement, avec vous. Aucun résultat n’est annoncé avant d’avoir été mesuré.",
    tags: ["Apprentissage automatique", "Optimisation", "Prévision"],
    order: 1,
  },
  {
    id: "sol-2",
    slug: "finance-agent",
    sector: "Finance",
    title: "Agents de contrôle de conformité",
    summary: "Des agents IA qui contrôlent les transactions, signalent les anomalies de conformité et préparent les rapports réglementaires, avec validation humaine à chaque étape sensible.",
    impact: "Part des flux contrôlés · délai de détection · temps de préparation des rapports",
    impactLabel: "Indicateurs mesurés",
    statusBadge: "Cas d’usage type",
    statusType: "methodology",
    methodology: "Scénario type : les indicateurs sont mesurés avant et après le déploiement, avec vous. Aucun résultat n’est annoncé avant d’avoir été mesuré.",
    tags: ["Agents IA", "Conformité", "Contrôle"],
    order: 2,
  },
  {
    id: "sol-3",
    slug: "retail-bi",
    sector: "Retail",
    title: "Pilotage commercial multicanal",
    summary: "Des tableaux de bord qui croisent ventes, stocks et comportements d'achat pour piloter les prix et le réassort de plusieurs points de vente.",
    impact: "Marge par canal · rotation des stocks · délai de décision",
    impactLabel: "Indicateurs mesurés",
    statusBadge: "Cas d’usage type",
    statusType: "methodology",
    methodology: "Scénario type : les indicateurs sont mesurés avant et après le déploiement, avec vous. Aucun résultat n’est annoncé avant d’avoir été mesuré.",
    tags: ["Business intelligence", "Prix", "Multicanal"],
    order: 3,
  },
  {
    id: "sol-4",
    slug: "healthcare-nlp",
    sector: "Santé",
    title: "Synthèse de documents médicaux",
    summary: "Extraction et structuration automatiques d'informations issues de comptes rendus et de dossiers, grâce au traitement automatique du langage (NLP), avec relecture par un professionnel.",
    impact: "Temps de traitement d'un dossier · taux d'erreur · part relue",
    impactLabel: "Indicateurs mesurés",
    statusBadge: "Cas d’usage type",
    statusType: "methodology",
    methodology: "Scénario type : les indicateurs sont mesurés avant et après le déploiement, avec vous. Aucun résultat n’est annoncé avant d’avoir été mesuré.",
    tags: ["NLP", "Modèles de langage", "Santé"],
    order: 4,
  },
  {
    id: "sol-5",
    slug: "industry-maintenance",
    sector: "Industrie",
    title: "Maintenance prédictive",
    summary: "Détection précoce d'anomalies à partir des capteurs (IoT, objets connectés) des lignes de production, pour intervenir avant la panne.",
    impact: "Arrêts imprévus · durée de vie des équipements · coût de maintenance",
    impactLabel: "Indicateurs mesurés",
    statusBadge: "Cas d’usage type",
    statusType: "methodology",
    methodology: "Scénario type : les indicateurs sont mesurés avant et après le déploiement, avec vous. Aucun résultat n’est annoncé avant d’avoir été mesuré.",
    tags: ["IoT", "Séries temporelles", "Maintenance"],
    order: 5,
  },
  {
    id: "sol-6",
    slug: "energy-smartgrid",
    sector: "Énergie",
    title: "Équilibrage de réseau énergétique",
    summary: "Prévision de la consommation et de la production pour équilibrer un réseau en temps réel et optimiser les achats d'énergie.",
    impact: "Écart prévision / réel · coût d'achat · disponibilité",
    impactLabel: "Indicateurs mesurés",
    statusBadge: "Cas d’usage type",
    statusType: "methodology",
    methodology: "Scénario type : les indicateurs sont mesurés avant et après le déploiement, avec vous. Aucun résultat n’est annoncé avant d’avoir été mesuré.",
    tags: ["Prévision", "Réseaux intelligents", "Optimisation"],
    order: 6,
  },
  {
    id: "sol-7",
    slug: "dealscoop",
    sector: "M&A & Private Equity",
    title: "Repérage d'opportunités d'acquisition par l'IA",
    summary: "Détection continue de signaux d'affaires (gouvernance, recrutements clés, expansion, indices de transmission) et notation de leur adéquation avec vos critères d'investissement, pour constituer un flux d'opportunités hors marché.",
    impact: "Nombre de cibles qualifiées · adéquation aux critères · temps de qualification",
    impactLabel: "Indicateurs mesurés",
    statusBadge: "Cas d’usage type",
    statusType: "methodology",
    methodology: "Scénario type : les indicateurs sont mesurés avant et après le déploiement, avec vous. Aucun résultat n’est annoncé avant d’avoir été mesuré.",
    tags: ["Origination", "Signaux d'affaires", "Notation"],
    order: 7,
  },
];

/** Solutions par défaut EN (repli offline pour /en/solutions et /en/solutions/[slug]). */
export const FALLBACK_SOLUTIONS_EN: SolutionDTO[] = [
  {
    id: "sol-1",
    slug: "logistics-ai",
    sector: "Logistics",
    title: "AI-driven logistics optimisation",
    summary: "Route re-planning and demand forecasting with machine learning (models that learn from your history), to reduce transport costs and stock-outs.",
    impact: "Transport costs · stock-out rate · delivery times",
    impactLabel: "Indicators we measure",
    statusBadge: "Typical use case",
    statusType: "methodology",
    methodology: "Typical scenario: indicators are measured before and after deployment, with you. No result is stated before it has been measured.",
    tags: ["Machine learning", "Optimisation", "Forecasting"],
    order: 1,
  },
  {
    id: "sol-2",
    slug: "finance-agent",
    sector: "Finance",
    title: "Compliance control agents",
    summary: "AI agents that check transactions, flag compliance anomalies and prepare regulatory reports, with human approval at every sensitive step.",
    impact: "Share of flows checked · detection time · report preparation time",
    impactLabel: "Indicators we measure",
    statusBadge: "Typical use case",
    statusType: "methodology",
    methodology: "Typical scenario: indicators are measured before and after deployment, with you. No result is stated before it has been measured.",
    tags: ["AI agents", "Compliance", "Control"],
    order: 2,
  },
  {
    id: "sol-3",
    slug: "retail-bi",
    sector: "Retail",
    title: "Multichannel sales steering",
    summary: "Dashboards combining sales, stock and buying behaviour to steer pricing and replenishment across several stores.",
    impact: "Margin per channel · stock turnover · decision time",
    impactLabel: "Indicators we measure",
    statusBadge: "Typical use case",
    statusType: "methodology",
    methodology: "Typical scenario: indicators are measured before and after deployment, with you. No result is stated before it has been measured.",
    tags: ["Business intelligence", "Pricing", "Multichannel"],
    order: 3,
  },
  {
    id: "sol-4",
    slug: "healthcare-nlp",
    sector: "Healthcare",
    title: "Medical document synthesis",
    summary: "Automatic extraction and structuring of information from reports and records using natural language processing (NLP), reviewed by a professional.",
    impact: "Processing time per record · error rate · share reviewed",
    impactLabel: "Indicators we measure",
    statusBadge: "Typical use case",
    statusType: "methodology",
    methodology: "Typical scenario: indicators are measured before and after deployment, with you. No result is stated before it has been measured.",
    tags: ["NLP", "Language models", "Healthcare"],
    order: 4,
  },
  {
    id: "sol-5",
    slug: "industry-maintenance",
    sector: "Industry",
    title: "Predictive maintenance",
    summary: "Early anomaly detection from production-line sensors (IoT, connected devices), to act before a breakdown.",
    impact: "Unplanned downtime · equipment lifetime · maintenance cost",
    impactLabel: "Indicators we measure",
    statusBadge: "Typical use case",
    statusType: "methodology",
    methodology: "Typical scenario: indicators are measured before and after deployment, with you. No result is stated before it has been measured.",
    tags: ["IoT", "Time series", "Maintenance"],
    order: 5,
  },
  {
    id: "sol-6",
    slug: "energy-smartgrid",
    sector: "Energy",
    title: "Energy grid balancing",
    summary: "Consumption and production forecasting to balance a grid in real time and optimise energy purchasing.",
    impact: "Forecast vs actual gap · purchase cost · availability",
    impactLabel: "Indicators we measure",
    statusBadge: "Typical use case",
    statusType: "methodology",
    methodology: "Typical scenario: indicators are measured before and after deployment, with you. No result is stated before it has been measured.",
    tags: ["Forecasting", "Smart grids", "Optimisation"],
    order: 6,
  },
  {
    id: "sol-7",
    slug: "dealscoop",
    sector: "M&A & Private Equity",
    title: "AI-powered acquisition sourcing",
    summary: "Continuous detection of business signals (governance, key hires, expansion, succession clues) scored against your investment criteria, to build an off-market deal flow.",
    impact: "Qualified targets · fit with criteria · qualification time",
    impactLabel: "Indicators we measure",
    statusBadge: "Typical use case",
    statusType: "methodology",
    methodology: "Typical scenario: indicators are measured before and after deployment, with you. No result is stated before it has been measured.",
    tags: ["Origination", "Business signals", "Scoring"],
    order: 7,
  },
];

/** Aucune métrique affichée : la charte exclut les chiffres non vérifiables. */
export const FALLBACK_METRICS_FR: MetricDTO[] = [];

/** Métriques opérationnelles par défaut EN. */
export const FALLBACK_METRICS_EN: MetricDTO[] = [];

/** Logs d'activité temps réel par défaut FR (Console de télémétrie). */
export const FALLBACK_ACTIVITY_LOGS_FR: ActivityLogDTO[] = [];

/** Logs d'activité temps réel par défaut EN. */
export const FALLBACK_ACTIVITY_LOGS_EN: ActivityLogDTO[] = [];

/** Témoignages clients par défaut FR (purgés). */
export const FALLBACK_TESTIMONIALS_FR: TestimonialDTO[] = [];

/** Témoignages clients par défaut EN (purgés). */
export const FALLBACK_TESTIMONIALS_EN: TestimonialDTO[] = [];

/** Logos et références clients par défaut (purgés). */
export const FALLBACK_CLIENT_LOGOS: ClientLogoDTO[] = [];

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
  { id: "cat-1", key: "ia", label: "Intelligence Artificielle", colorClass: "text-accent-ink", order: 1 },
  { id: "cat-2", key: "automation", label: "Automatisation", colorClass: "text-accent-ink", order: 2 },
  { id: "cat-3", key: "data", label: "Data & Décision", colorClass: "text-accent-ink", order: 3 },
  { id: "cat-4", key: "architecture", label: "Architecture & Infra", colorClass: "text-accent-ink", order: 4 },
];

/** Catégories du blog par défaut EN. */
export const FALLBACK_BLOG_CATEGORIES_EN: BlogCategoryDTO[] = [
  { id: "cat-1", key: "ia", label: "Artificial Intelligence", colorClass: "text-accent-ink", order: 1 },
  { id: "cat-2", key: "automation", label: "Automation", colorClass: "text-accent-ink", order: 2 },
  { id: "cat-3", key: "data", label: "Data & Decision", colorClass: "text-accent-ink", order: 3 },
  { id: "cat-4", key: "architecture", label: "Architecture & Infra", colorClass: "text-accent-ink", order: 4 },
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
  {
    id: "post-4",
    slug: "agents-production-2025",
    title: "Industrialiser les agents IA : du POC au système agentique en production",
    excerpt: "Pourquoi tant de POC d'agents (prototypes) échouent à passer à l'échelle et les 5 piliers d'architecture qui font la différence entre une démo et un système d'entreprise fiable.",
    categoryKey: "ia",
    categoryLabel: "Intelligence Artificielle",
    date: "2025-09-14T00:00:00.000Z",
    readingTime: "11 min",
    author: "Martial GNINHI",
    tags: ["Agents", "LangGraph", "Production", "MCP", "Langfuse"],
  },
  {
    id: "post-5",
    slug: "event-driven-agents",
    title: "Architecture event-driven pour systèmes multi-agents",
    excerpt: "Les agents ne communiquent pas par appels synchrones. Découvrez le pattern event-driven sur Kafka qui rend vos flottes d'agents résilientes et observables.",
    categoryKey: "architecture",
    categoryLabel: "Architecture & Infra",
    date: "2025-07-15T00:00:00.000Z",
    readingTime: "12 min",
    author: "Martial GNINHI",
    tags: ["Event-driven", "Kafka", "Multi-Agents", "Microservices"],
  },
  {
    id: "post-6",
    slug: "finops-cloud-native",
    title: "FinOps cloud-native : réduire sa facture sans sacrifier l'uptime",
    excerpt: "Comment diviser par deux le gaspillage de compute sur Kubernetes avec Karpenter, l'autoscaling par files de messages et une stratégie Spot étanche.",
    categoryKey: "architecture",
    categoryLabel: "Architecture & Infra",
    date: "2025-06-29T00:00:00.000Z",
    readingTime: "6 min",
    author: "Martial GNINHI",
    tags: ["FinOps", "Kubernetes", "Karpenter", "Cloud", "AWS"],
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
  {
    id: "post-4",
    slug: "agents-production-2025",
    title: "Industrializing AI Agents: From POC to Production-Grade Agentic Systems",
    excerpt: "Why so many agent POCs (prototypes) fail to scale, and the 5 architectural pillars that make the difference between a demo and an enterprise-grade system.",
    categoryKey: "ia",
    categoryLabel: "Artificial Intelligence",
    date: "2025-09-14T00:00:00.000Z",
    readingTime: "11 min",
    author: "Martial GNINHI",
    tags: ["Agents", "LangGraph", "Production", "MCP", "Langfuse"],
  },
  {
    id: "post-5",
    slug: "event-driven-agents",
    title: "Event-Driven Architecture for Multi-Agent Systems",
    excerpt: "Agents don't communicate via synchronous HTTP calls. Discover the Kafka event-driven pattern ensuring autonomous fleets remain fault-tolerant.",
    categoryKey: "architecture",
    categoryLabel: "Architecture & Infra",
    date: "2025-07-15T00:00:00.000Z",
    readingTime: "12 min",
    author: "Martial GNINHI",
    tags: ["Event-driven", "Kafka", "Multi-Agents", "Microservices"],
  },
  {
    id: "post-6",
    slug: "finops-cloud-native",
    title: "Cloud-Native FinOps: Cutting Infrastructure Costs Without Sacrificing Uptime",
    excerpt: "How to halve Kubernetes compute waste with Karpenter, queue-based autoscaling, and zero-downtime spot instance strategies.",
    categoryKey: "architecture",
    categoryLabel: "Architecture & Infra",
    date: "2025-06-29T00:00:00.000Z",
    readingTime: "6 min",
    author: "Martial GNINHI",
    tags: ["FinOps", "Kubernetes", "Karpenter", "Cloud", "AWS"],
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
    body: "Le site https://analyticatech.fr est édité par la société Analyticatech, société par actions simplifiée (SAS) au capital de 1 000,00 €.\nSiège social réel : 60 rue François 1er, 75008 Paris, France.\nImmatriculation : SIREN 984 609 198 — SIRET 984 609 198 00010 (RCS Paris B 984 609 198).\nNuméro de TVA intracommunautaire : FR96984609198.\nDirecteur de la publication : Martial GNINHI, en sa qualité de Président de la SAS.\nActivité exercée : Conseil en systèmes et logiciels informatiques (Code NAF/APE : 62.02A).",
    order: 1,
  },
  {
    id: "leg-2",
    type: "legal",
    heading: "2. Hébergeur du site web",
    body: "Hébergement de l'infrastructure web de diffusion : Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA — https://vercel.com).\n\nDistinction essentielle avec les données clients : L'hébergement web public susmentionné est dédié exclusivement à la distribution et au rendu du site vitrine institutionnel. Il est strictement indépendant et étanche des infrastructures cloud souveraines (SecNumCloud, VPC privés clients, certifications ISO 27001) hébergeant et traitant les données clients dans le cadre de nos missions d'ingénierie d'agents IA et d'architecture data, régies par des accords spécifiques de traitement de données (DPA) et de stricte confidentialité (NDA).",
    order: 2,
  },
  {
    id: "leg-3",
    type: "legal",
    heading: "3. Propriété intellectuelle",
    body: "L'ensemble des éléments constituant ce site (architecture logicielle, textes, composants graphiques, visualisations, diagrammes, marques et logos) est la propriété exclusive d'Analyticatech ou fait l'objet d'une autorisation d'exploitation. Toute reproduction, représentation, extraction ou diffusion, totale ou partielle, sans accord écrit préalable est interdite (articles L. 111-1 et suivants du Code de la Propriété Intellectuelle). Conformément à l'article L. 122-5-3 du CPI, Analyticatech s'oppose expressément à toute fouille automatisée de textes et de données (TDM) à des fins d'entraînement d'IA tierces.",
    order: 3,
  },
  {
    id: "leg-4",
    type: "legal",
    heading: "4. Coordonnées & Engagements de service",
    body: "Pour toute demande institutionnelle, légale ou réclamation :\nEmail : contact@analyticatech.fr | Téléphone : +33 7 68 61 13 10 | Adresse : 60 rue François 1er, 75008 Paris, France.\nDisponibilité opérationnelle : du lundi au vendredi, 9h30 - 17h30 (CET).\nAccusé de réception des demandes sous 2h, réponse d'un architecte sous 24h ouvrées.",
    order: 4,
  },
  {
    id: "rgpd-1",
    type: "rgpd",
    heading: "1. Finalités du traitement & Bases légales",
    body: "Les données personnelles collectées via le formulaire de contact (nom, prénom, adresse email professionnelle, entreprise, objet et message) sont traitées pour répondre aux demandes de cadrage technique et de diagnostic architectural.\nBases légales (Art. 6 RGPD) :\n- Exécution de mesures précontractuelles (Art. 6.1.b) pour le traitement des demandes de devis et d'ateliers de cadrage.\n- Intérêt légitime (Art. 6.1.f) pour la gestion de la relation client professionnelle et la prévention des fraudes/attaques par déni de service.\n- Consentement explicite (Art. 6.1.a) pour le dépôt de traceurs de mesure d'audience optionnels.",
    order: 1,
  },
  {
    id: "rgpd-2",
    type: "rgpd",
    heading: "2. Mesure d'audience & Télémétrie (PostHog EU)",
    body: "Ce site utilise PostHog pour l'analyse d'audience technique, configuré avec un hébergement des données exclusivement situé dans l'Union Européenne (eu.i.posthog.com). Les adresses IP sont pseudonymisées dès leur réception. Aucun traceur analytics n'est activé avant votre acceptation explicite via le bandeau de consentement (option opt_out_capturing_by_default active). Vous pouvez révoquer ce consentement à tout moment.",
    order: 2,
  },
  {
    id: "rgpd-3",
    type: "rgpd",
    heading: "3. Sécurité des données & Durées de conservation",
    body: "Toutes les transmissions de données sont chiffrées de bout en chaîne par le protocole TLS 1.3 en transit, et stockées avec un chiffrement AES-256 au repos. Les formulaires sont protégés par un jeton CSRF cryptographique et un limiteur de débit anti-abus.\nDurées de conservation :\n- Demandes de contact commercial : 3 ans à compter du dernier échange.\n- Données de connexion et jetons CSRF : durée de la session de navigation.\n- Choix de consentement cookies : 13 mois maximum conformément aux recommandations de la CNIL.",
    order: 3,
  },
  {
    id: "rgpd-4",
    type: "rgpd",
    heading: "4. Droits des personnes concernées & Recours CNIL",
    body: "Conformément aux articles 15 à 22 du RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, d'opposition et de portabilité de vos données personnelles.\nPour exercer vos droits, contactez notre délégué par email : contact@analyticatech.fr ou par courrier à : Analyticatech SAS — Délégué à la Protection des Données, 60 rue François 1er, 75008 Paris.\nEn cas de contestation non résolue, vous disposez du droit d'introduire une réclamation auprès de l'autorité de contrôle compétente : la Commission Nationale de l'Informatique et des Libertés (CNIL) sur son site officiel (https://www.cnil.fr) ou par voie postale (3 Place de Fontenoy, 75007 Paris).",
    order: 4,
  },
];

/** Mentions légales & RGPD par défaut EN. */
export const FALLBACK_LEGAL_SECTIONS_EN: LegalSectionDTO[] = [
  {
    id: "leg-1",
    type: "legal",
    heading: "1. Site Publisher",
    body: "The website https://analyticatech.fr is published by Analyticatech, SAS with share capital of €1,000.00.\nRegistered office: 60 rue François 1er, 75008 Paris, France.\nRegistration: SIREN 984 609 198 — SIRET 984 609 198 00010 (RCS Paris B 984 609 198).\nVAT Number: FR96984609198.\nPublishing Director: Martial GNINHI, as President.\nBusiness activity: Computer systems and software consulting (NAF/APE: 62.02A).",
    order: 1,
  },
  {
    id: "leg-2",
    type: "legal",
    heading: "2. Website Hosting Provider",
    body: "Showcase website cloud infrastructure: Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA — https://vercel.com).\n\nKey distinction with client mission data: Public website hosting is strictly decoupled and isolated from sovereign enterprise cloud infrastructures (SecNumCloud, client VPCs, ISO 27001) hosting and processing client data for AI engineering and data consulting engagements, governed by bespoke DPAs and NDAs.",
    order: 2,
  },
  {
    id: "leg-3",
    type: "legal",
    heading: "3. Intellectual Property",
    body: "All contents of this site (software architecture, copy, codes, visuals, graphics, logos) are the exclusive property of Analyticatech. Any unauthorized reproduction, scraping or representation is prohibited under French Intellectual Property law. Analyticatech expressly opts out of text and data mining (TDM) for unauthorized AI training.",
    order: 3,
  },
  {
    id: "leg-4",
    type: "legal",
    heading: "4. Contact & Service Commitments",
    body: "For any legal inquiries, corporate information or claims:\nEmail: contact@analyticatech.fr | Phone: +33 7 68 61 13 10 | Address: 60 rue François 1er, 75008 Paris, France.\nOperational availability: Monday to Friday, 9:30 AM - 5:30 PM (CET).\nAutomated acknowledgement < 2h, architect reply < 24 business hours.",
    order: 4,
  },
  {
    id: "rgpd-1",
    type: "rgpd",
    heading: "1. Data Processing Purposes & Legal Grounds",
    body: "Personal data collected through the contact form (name, email, company, subject, and message) is processed to answer technical scoping and architectural diagnostic requests.\nLegal grounds (Art. 6 GDPR):\n- Pre-contractual steps (Art. 6.1.b) for quotes and scoping inquiries.\n- Legitimate interests (Art. 6.1.f) for business relationship management and DDoS prevention.\n- Explicit consent (Art. 6.1.a) for optional audience telemetry cookies.",
    order: 1,
  },
  {
    id: "rgpd-2",
    type: "rgpd",
    heading: "2. Telemetry & Analytics (PostHog EU)",
    body: "This site uses PostHog for technical telemetry, hosted exclusively within the European Union (eu.i.posthog.com). IP addresses are pseudonymized upon receipt. No analytics tracker runs before your explicit consent via the cookie banner (opt_out_capturing_by_default enabled).",
    order: 2,
  },
  {
    id: "rgpd-3",
    type: "rgpd",
    heading: "3. Data Security & Retention Periods",
    body: "All transmissions are encrypted via TLS 1.3 in transit and stored with AES-256 encryption at rest. Forms are protected by cryptographic CSRF tokens and rate limiting.\nRetention periods:\n- Contact requests: 3 years after the last exchange.\n- Technical cookies and session tokens: duration of the session.\n- Cookie consent status: 13 months maximum per CNIL guidelines.",
    order: 3,
  },
  {
    id: "rgpd-4",
    type: "rgpd",
    heading: "4. User Rights & Supervisory Authority (CNIL)",
    body: "Under GDPR Articles 15 to 22, you have the right to access, rectify, erase, restrict processing, and request portability of your data.\nTo exercise these rights, contact us at: contact@analyticatech.fr or by postal mail at: Analyticatech SAS — Data Protection, 60 rue François 1er, 75008 Paris, France.\nYou also have the right to lodge a complaint with the competent supervisory authority: CNIL (https://www.cnil.fr) or 3 Place de Fontenoy, 75007 Paris, France.",
    order: 4,
  },
];
