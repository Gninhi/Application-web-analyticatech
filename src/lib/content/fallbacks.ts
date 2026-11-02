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

/** Métadonnées SEO (FR) — positionnement de la refonte, sans promesse invérifiable. */
export const FALLBACK_SEO_METADATA: SeoMetadataDTO = {
  title: "Analyticatech — L'IA, expliquée simplement, pour les PME et ETI",
  description:
    "Conseil en intelligence artificielle pour les dirigeants de PME et d'ETI : assistants qui répondent à partir de vos documents, automatisation des processus, agents IA sous contrôle humain et tableaux de bord de décision.",
  keywords: [
    "conseil IA PME",
    "consultant intelligence artificielle",
    "agents IA",
    "automatisation des processus",
    "RAG",
    "business intelligence",
  ],
  ogTitle: "Analyticatech — L'IA, expliquée simplement, pour les PME et ETI",
  ogDescription:
    "Agents IA, automatisation et données en production pour les PME et ETI, avec une décision humaine à chaque étape sensible.",
  ogImageUrl: null,
  canonicalUrl: "https://www.analyticatech.fr",
  twitterCard: "summary_large_image",
};

/** Métadonnées SEO (EN). */
export const FALLBACK_SEO_METADATA_EN: SeoMetadataDTO = {
  title: "Analyticatech — AI, explained simply, for SMEs and mid-sized companies",
  description:
    "Artificial intelligence consulting for SME and mid-market leaders: assistants that answer from your documents, process automation, AI agents under human control and decision dashboards.",
  keywords: [
    "AI consulting SME",
    "artificial intelligence consultant",
    "AI agents",
    "process automation",
    "RAG",
    "business intelligence",
  ],
  ogTitle: "Analyticatech — AI, explained simply, for SMEs and mid-sized companies",
  ogDescription:
    "AI agents, automation and data in production for SMEs and mid-sized companies, with a human decision at every sensitive step.",
  ogImageUrl: null,
  canonicalUrl: "https://www.analyticatech.fr/en",
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
    bgImagePath: "/services/bg-01-ia.webp",
    meshOverlay: "rgba(242, 109, 61, 0.15)",
    metrics: [],
    order: 1,
    persona: {
      ceo: "Vos équipes trouvent plus vite la bonne information dans vos documents, avec la source citée à chaque réponse et des données qui restent sous votre contrôle.",
      architect:
        "Pipeline modulaire : ingestion multi-formats, vectorisation dense/sparse (Qdrant), reranker cross-encoder et garde-fous qui bloquent les réponses non étayées par un document.",
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
    bgImagePath: "/services/bg-03-auto.webp",
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
    bgImagePath: "/services/bg-04-agents.webp",
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
    bgImagePath: "/services/bg-05-bi.webp",
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
    bgImagePath: "/services/bg-01-ia.webp",
    meshOverlay: "rgba(242, 109, 61, 0.15)",
    metrics: [],
    order: 1,
    persona: {
      ceo: "Your teams find the right information faster, with the source cited in every answer and data that stays under your control.",
      architect:
        "Modular pipeline: multi-format ingestion, dense/sparse vectorization (Qdrant), cross-encoder reranker, and guardrails that block answers not backed by a document.",
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
    bgImagePath: "/services/bg-03-auto.webp",
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
    bgImagePath: "/services/bg-04-agents.webp",
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
    bgImagePath: "/services/bg-05-bi.webp",
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

/**
 * Solutions FR (page /solutions) : d'abord les projets réellement construits
 * par Analyticatech, puis les pistes assumées comme non construites.
 * Détail de chaque fiche : `solutions-detail-data.ts`.
 */
export const FALLBACK_SOLUTIONS_FR: SolutionDTO[] = [
  {
    id: "sol-ciblioo",
    slug: "ciblioo",
    sector: "M&A · Transmission d'entreprises",
    title: "Ciblioo — du mandat à la liste de cibles documentée",
    summary: "Plateforme pour les cabinets de transmission et de M&A : constituer une liste d'entreprises cibles à partir d'un mandat, rapprocher les données des registres publics et rattacher chaque information à sa source, avec revue humaine.",
    impact: "Registres publics (DINUM, BODACC) · identité par SIREN · export avec preuves",
    impactLabel: "Ce que fait l'outil",
    statusBadge: "Projet en cours · En développement",
    statusType: "new",
    methodology: "Fondations en place ; parcours complet en construction, pilote prévu avec un cabinet. Non commercialisé.",
    tags: ["M&A", "Registres publics", "Traçabilité"],
    order: 1,
  },
  {
    id: "sol-contentops",
    slug: "contentops",
    sector: "Marketing · Contenu B2B",
    title: "ContentOps Harness — du contenu IA, validé avant publication",
    summary: "Système éditorial pour LinkedIn et X : de la veille aux brouillons, contrôle qualité, puis validation obligatoire d'un responsable avant toute publication, avec journal d'audit.",
    impact: "Brouillons par plateforme · validation humaine obligatoire · publication tracée",
    impactLabel: "Ce que fait l'outil",
    statusBadge: "Projet en cours · Prototype fonctionnel",
    statusType: "new",
    methodology: "Fonctionne de bout en bout en environnement de test. Code public sur GitHub.",
    tags: ["Agents IA", "Validation humaine", "LinkedIn"],
    order: 2,
  },
  {
    id: "sol-avie",
    slug: "avie",
    sector: "Veille · Stratégie produit",
    title: "AVIE — une veille qui distingue faits et suppositions",
    summary: "Moteur de veille sur sources ouvertes : chaque affirmation est reliée à ses preuves, les contradictions entre sources sont signalées, et la décision finale reste humaine.",
    impact: "Sources ouvertes · affirmations sourcées · contradictions signalées",
    impactLabel: "Ce que fait l'outil",
    statusBadge: "Projet en cours · Outil interne",
    statusType: "new",
    methodology: "Utilisé pour mes propres analyses ; non proposé comme produit. Code public sur GitHub.",
    tags: ["Veille", "Sources ouvertes", "Agents IA"],
    order: 3,
  },
  {
    id: "sol-retail-bi",
    slug: "retail-bi",
    sector: "Commerce · Pilotage",
    title: "Pilotage commercial : ventes, marges et stocks réunis",
    summary: "Un tableau de bord pour PME de commerce qui réunit ventes, marges et stocks par canal et par point de vente, avec des indicateurs définis une seule fois.",
    impact: "Indicateurs uniques · mise à jour automatique · vue par canal",
    impactLabel: "Ce qui est prévu",
    statusBadge: "Piste à construire",
    statusType: "methodology",
    methodology: "Idée de solution : rien n'est encore construit.",
    tags: ["Business intelligence", "PME", "Marges"],
    order: 4,
  },
  {
    id: "sol-logistics-ai",
    slug: "logistics-ai",
    sector: "Distribution · Approvisionnement",
    title: "Prévision de la demande et du réapprovisionnement",
    summary: "Prévoir les ventes à partir de l'historique pour proposer des quantités de commande, que l'acheteur valide ou corrige.",
    impact: "Prévision par référence · proposition de commande · décision de l'acheteur",
    impactLabel: "Ce qui est prévu",
    statusBadge: "Piste à construire",
    statusType: "methodology",
    methodology: "Idée de solution : rien n'est encore construit.",
    tags: ["Prévision", "Approvisionnement", "PME"],
    order: 5,
  },
  {
    id: "sol-veille-registres",
    slug: "veille-registres",
    sector: "Gestion des risques · PME",
    title: "Veille clients et fournisseurs par les annonces légales",
    summary: "Être alerté quand une annonce BODACC concerne un client ou un fournisseur : procédure collective, cession, changement de dirigeant.",
    impact: "Rapprochement par SIREN · lecture du BODACC · alertes",
    impactLabel: "Ce qui est prévu",
    statusBadge: "Piste à construire",
    statusType: "methodology",
    methodology: "Idée issue de Ciblioo, dont elle réutiliserait les connecteurs. Rien n'est encore construit.",
    tags: ["BODACC", "Alertes", "Gestion des risques"],
    order: 6,
  },
];

/** Solutions EN (page /en/solutions) — même ordre et mêmes slugs que la version FR. */
export const FALLBACK_SOLUTIONS_EN: SolutionDTO[] = [
  {
    id: "sol-ciblioo",
    slug: "ciblioo",
    sector: "M&A · Business transfers",
    title: "Ciblioo — from mandate to a documented target list",
    summary: "A platform for business-transfer and M&A firms: build a list of target companies from a mandate, match data from public registries and link every piece of information to its source, with human review.",
    impact: "Public registries (DINUM, BODACC) · SIREN identity · export with evidence",
    impactLabel: "What the tool does",
    statusBadge: "Ongoing project · In development",
    statusType: "new",
    methodology: "Foundations in place; full journey being built, pilot planned with a firm. Not commercially available.",
    tags: ["M&A", "Public registries", "Traceability"],
    order: 1,
  },
  {
    id: "sol-contentops",
    slug: "contentops",
    sector: "Marketing · B2B content",
    title: "ContentOps Harness — AI content, approved before publishing",
    summary: "An editorial system for LinkedIn and X: from monitoring to drafts, a quality check, then mandatory approval by a manager before anything is published, with an audit log.",
    impact: "Drafts per platform · mandatory human approval · traced publication",
    impactLabel: "What the tool does",
    statusBadge: "Ongoing project · Working prototype",
    statusType: "new",
    methodology: "Works end to end in a test environment. Public code on GitHub.",
    tags: ["AI agents", "Human approval", "LinkedIn"],
    order: 2,
  },
  {
    id: "sol-avie",
    slug: "avie",
    sector: "Monitoring · Product strategy",
    title: "AVIE — monitoring that separates facts from assumptions",
    summary: "An open-source monitoring engine: each claim is linked to its evidence, contradictions between sources are flagged, and the final decision stays human.",
    impact: "Open sources · sourced claims · flagged contradictions",
    impactLabel: "What the tool does",
    statusBadge: "Ongoing project · Internal tool",
    statusType: "new",
    methodology: "Used for my own analyses; not offered as a product. Public code on GitHub.",
    tags: ["Monitoring", "Open sources", "AI agents"],
    order: 3,
  },
  {
    id: "sol-retail-bi",
    slug: "retail-bi",
    sector: "Retail · Steering",
    title: "Sales steering: sales, margins and stock together",
    summary: "A dashboard for retail SMEs bringing together sales, margins and stock by channel and by store, with indicators defined once.",
    impact: "Single indicators · automatic updates · view by channel",
    impactLabel: "What is planned",
    statusBadge: "Idea to build",
    statusType: "methodology",
    methodology: "Solution idea: nothing has been built yet.",
    tags: ["Business intelligence", "SMEs", "Margins"],
    order: 4,
  },
  {
    id: "sol-logistics-ai",
    slug: "logistics-ai",
    sector: "Distribution · Purchasing",
    title: "Demand and reorder forecasting",
    summary: "Forecast sales from history to suggest order quantities, which the buyer approves or corrects.",
    impact: "Forecast per item · order proposal · buyer's decision",
    impactLabel: "What is planned",
    statusBadge: "Idea to build",
    statusType: "methodology",
    methodology: "Solution idea: nothing has been built yet.",
    tags: ["Forecasting", "Purchasing", "SMEs"],
    order: 5,
  },
  {
    id: "sol-veille-registres",
    slug: "veille-registres",
    sector: "Risk management · SMEs",
    title: "Customer and supplier monitoring through legal notices",
    summary: "Get alerted when a BODACC notice concerns a customer or supplier: insolvency proceedings, business sale, change of director.",
    impact: "SIREN matching · BODACC reading · alerts",
    impactLabel: "What is planned",
    statusBadge: "Idea to build",
    statusType: "methodology",
    methodology: "An idea that grew out of Ciblioo, whose connectors it would reuse. Nothing has been built yet.",
    tags: ["BODACC", "Alerts", "Risk management"],
    order: 6,
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

/** Mots-clés défilants FR : les quatre services, en termes simples. */
export const FALLBACK_MARQUEE_KEYWORDS_FR: string[] = [
  "ASSISTANTS SUR VOS DOCUMENTS",
  "AUTOMATISATION DES PROCESSUS",
  "AGENTS IA SOUS CONTRÔLE HUMAIN",
  "TABLEAUX DE BORD DE DIRECTION",
  "DONNÉES FIABLES ET TRACÉES",
  "RGPD ET AI ACT DÈS LA CONCEPTION",
];

/** Mots-clés défilants EN. */
export const FALLBACK_MARQUEE_KEYWORDS_EN: string[] = [
  "ASSISTANTS ON YOUR DOCUMENTS",
  "PROCESS AUTOMATION",
  "AI AGENTS UNDER HUMAN CONTROL",
  "MANAGEMENT DASHBOARDS",
  "RELIABLE, TRACEABLE DATA",
  "GDPR AND AI ACT BY DESIGN",
];

/** Engagements du fondateur (page À propos) — FR. */
export const FALLBACK_COMPANY_VALUES_FR: CompanyValueDTO[] = [
  {
    id: "val-1",
    iconKey: "Target",
    title: "Des résultats vérifiables",
    description: "Chaque système est évalué sur des indicateurs définis avec vous au cadrage. Je n'annonce un résultat qu'après l'avoir mesuré.",
    order: 1,
  },
  {
    id: "val-2",
    iconKey: "Eye",
    title: "Vos données restent les vôtres",
    description: "Je privilégie l'open source et un hébergement en Union européenne ou sur vos serveurs, choisis avec vous. Vos données ne servent pas à entraîner de modèles.",
    order: 2,
  },
  {
    id: "val-3",
    iconKey: "Heart",
    title: "La simplicité d'abord",
    description: "Je préfère une solution simple, documentée et maintenable à une architecture impressionnante que personne ne saura faire évoluer.",
    order: 3,
  },
  {
    id: "val-4",
    iconKey: "Users",
    title: "La décision reste humaine",
    description: "Les agents IA préparent le travail ; les décisions importantes restent validées par une personne de vos équipes.",
    order: 4,
  },
];

/** Engagements du fondateur (page À propos) — EN. */
export const FALLBACK_COMPANY_VALUES_EN: CompanyValueDTO[] = [
  {
    id: "val-1",
    iconKey: "Target",
    title: "Verifiable results",
    description: "Every system is evaluated against indicators agreed with you during scoping. I only state a result once it has been measured.",
    order: 1,
  },
  {
    id: "val-2",
    iconKey: "Eye",
    title: "Your data stays yours",
    description: "I favour open source and hosting in the European Union or on your own servers, chosen with you. Your data is not used to train models.",
    order: 2,
  },
  {
    id: "val-3",
    iconKey: "Heart",
    title: "Simplicity first",
    description: "I prefer a simple, documented, maintainable solution to an impressive architecture nobody will be able to evolve.",
    order: 3,
  },
  {
    id: "val-4",
    iconKey: "Users",
    title: "Decisions stay human",
    description: "AI agents prepare the work; important decisions are still validated by someone on your team.",
    order: 4,
  },
];

/** Étapes de la méthode — FR (durées alignées sur la section Méthode de l'accueil). */
export const FALLBACK_DELIVERY_STEPS_FR: DeliveryStepDTO[] = [
  {
    id: "step-1",
    iconKey: "Search",
    label: "01 · Cadrage",
    description: "Audit de l'existant (données, processus, outils) et priorisation des cas d'usage, en 1 à 2 semaines.",
    order: 1,
  },
  {
    id: "step-2",
    iconKey: "Cpu",
    label: "02 · Prototype sur vos données",
    description: "Un prototype fonctionnel testé dans vos conditions réelles, en 4 à 6 semaines, avec une décision documentée de poursuivre ou d'arrêter.",
    order: 2,
  },
  {
    id: "step-3",
    iconKey: "Zap",
    label: "03 · Mise en production",
    description: "Déploiement supervisé, avec garde-fous et déploiements automatisés, en 6 à 8 semaines selon le périmètre.",
    order: 3,
  },
  {
    id: "step-4",
    iconKey: "RefreshCw",
    label: "04 · Suivi et amélioration",
    description: "Supervision continue et améliorations planifiées chaque mois, décidées sur les mesures.",
    order: 4,
  },
];

/** Étapes de la méthode — EN. */
export const FALLBACK_DELIVERY_STEPS_EN: DeliveryStepDTO[] = [
  {
    id: "step-1",
    iconKey: "Search",
    label: "01 · Scoping",
    description: "Review of your current setup (data, processes, tools) and use-case prioritisation, in 1 to 2 weeks.",
    order: 1,
  },
  {
    id: "step-2",
    iconKey: "Cpu",
    label: "02 · Prototype on your data",
    description: "A working prototype tested in your real conditions, in 4 to 6 weeks, with a documented decision to continue or stop.",
    order: 2,
  },
  {
    id: "step-3",
    iconKey: "Zap",
    label: "03 · Going live",
    description: "Supervised deployment, with guardrails and automated releases, in 6 to 8 weeks depending on scope.",
    order: 3,
  },
  {
    id: "step-4",
    iconKey: "RefreshCw",
    label: "04 · Monitoring and improvement",
    description: "Continuous monitoring and improvements planned each month, decided on measurements.",
    order: 4,
  },
];

/** Catégories du blog par défaut FR. */
export const FALLBACK_BLOG_CATEGORIES_FR: BlogCategoryDTO[] = [
  { id: "cat-1", key: "ia", label: "Intelligence Artificielle", colorClass: "text-accent-ink", order: 1 },
  { id: "cat-2", key: "automation", label: "Automatisation", colorClass: "text-accent-ink", order: 2 },
  { id: "cat-3", key: "data", label: "Data & Décision", colorClass: "text-accent-ink", order: 3 },
  { id: "cat-4", key: "architecture", label: "Architecture", colorClass: "text-accent-ink", order: 4 },
];

/** Catégories du blog par défaut EN. */
export const FALLBACK_BLOG_CATEGORIES_EN: BlogCategoryDTO[] = [
  { id: "cat-1", key: "ia", label: "Artificial Intelligence", colorClass: "text-accent-ink", order: 1 },
  { id: "cat-2", key: "automation", label: "Automation", colorClass: "text-accent-ink", order: 2 },
  { id: "cat-3", key: "data", label: "Data & Decision", colorClass: "text-accent-ink", order: 3 },
  { id: "cat-4", key: "architecture", label: "Architecture", colorClass: "text-accent-ink", order: 4 },
];

/**
 * Articles FR. Guides de méthode illustrés par des scénarios types (jamais
 * présentés comme des missions). Date = révision du 2 novembre 2026, où les
 * chiffres non sourcés ont été retirés ; l'article FinOps, hors de l'offre,
 * a été dépublié (redirection 301 dans next.config.ts).
 */
const ARTICLE_REVISION_DATE = "2026-11-02T00:00:00.000Z";

export const FALLBACK_BLOG_POSTS_FR: BlogPostDTO[] = [
  {
    id: "post-4",
    slug: "agents-production-2025",
    title: "Industrialiser les agents IA : du prototype au système en production",
    excerpt: "Pourquoi beaucoup de prototypes d'agents ne passent pas en production, et les principes d'architecture qui séparent une démonstration d'un système fiable.",
    categoryKey: "ia",
    categoryLabel: "Intelligence Artificielle",
    date: ARTICLE_REVISION_DATE,
    readingTime: "11 min",
    author: "Martial GNINHI",
    tags: ["Agents", "LangGraph", "Production", "MCP", "Langfuse"],
  },
  {
    id: "post-1",
    slug: "evaluer-systeme-rag-production",
    title: "Évaluer un système RAG en production : métriques, biais et garde-fous",
    excerpt: "Comment dépasser les démonstrations et mettre en place une évaluation continue d'un assistant qui répond à partir de vos documents.",
    categoryKey: "ia",
    categoryLabel: "Intelligence Artificielle",
    date: ARTICLE_REVISION_DATE,
    readingTime: "6 min",
    author: "Martial GNINHI",
    tags: ["RAG", "LLM", "Évaluation", "Production"],
  },
  {
    id: "post-2",
    slug: "n8n-vs-temporal-orchestration",
    title: "n8n ou Temporal : choisir l'outil adapté à vos automatisations critiques",
    excerpt: "Deux philosophies d'automatisation comparées : un outil visuel rapide à mettre en place, et un moteur conçu pour les processus qui ne doivent jamais s'interrompre.",
    categoryKey: "automation",
    categoryLabel: "Automatisation",
    date: ARTICLE_REVISION_DATE,
    readingTime: "8 min",
    author: "Martial GNINHI",
    tags: ["n8n", "Temporal", "Orchestration", "Workflows"],
  },
  {
    id: "post-3",
    slug: "couche-semantique-dbt-bi",
    title: "La couche sémantique : définir vos indicateurs une seule fois",
    excerpt: "Pourquoi centraliser les règles de calcul de vos indicateurs avant de construire des tableaux de bord ou de laisser une IA interroger vos données.",
    categoryKey: "data",
    categoryLabel: "Data & Décision",
    date: ARTICLE_REVISION_DATE,
    readingTime: "5 min",
    author: "Martial GNINHI",
    tags: ["dbt", "BI", "Couche sémantique"],
  },
  {
    id: "post-5",
    slug: "event-driven-agents",
    title: "Faire communiquer plusieurs agents IA par événements",
    excerpt: "Pourquoi des agents qui s'échangent des messages par événements, plutôt que par appels directs, résistent mieux aux pannes et sont plus faciles à observer.",
    categoryKey: "architecture",
    categoryLabel: "Architecture",
    date: ARTICLE_REVISION_DATE,
    readingTime: "12 min",
    author: "Martial GNINHI",
    tags: ["Événements", "Kafka", "Multi-agents"],
  },
];

/** Articles EN — mêmes slugs et même ordre que la version FR. */
export const FALLBACK_BLOG_POSTS_EN: BlogPostDTO[] = [
  {
    id: "post-4",
    slug: "agents-production-2025",
    title: "Industrialising AI agents: from prototype to production system",
    excerpt: "Why many agent prototypes never reach production, and the architecture principles that separate a demo from a reliable system.",
    categoryKey: "ia",
    categoryLabel: "Artificial Intelligence",
    date: ARTICLE_REVISION_DATE,
    readingTime: "11 min",
    author: "Martial GNINHI",
    tags: ["Agents", "LangGraph", "Production", "MCP", "Langfuse"],
  },
  {
    id: "post-1",
    slug: "evaluer-systeme-rag-production",
    title: "Evaluating a RAG system in production: metrics, bias and guardrails",
    excerpt: "How to move beyond demos and set up continuous evaluation of an assistant that answers from your documents.",
    categoryKey: "ia",
    categoryLabel: "Artificial Intelligence",
    date: ARTICLE_REVISION_DATE,
    readingTime: "6 min",
    author: "Martial GNINHI",
    tags: ["RAG", "LLM", "Evaluation", "Production"],
  },
  {
    id: "post-2",
    slug: "n8n-vs-temporal-orchestration",
    title: "n8n or Temporal: choosing the right tool for critical automations",
    excerpt: "Two automation philosophies compared: a visual tool that is quick to set up, and an engine built for processes that must never stop.",
    categoryKey: "automation",
    categoryLabel: "Automation",
    date: ARTICLE_REVISION_DATE,
    readingTime: "8 min",
    author: "Martial GNINHI",
    tags: ["n8n", "Temporal", "Orchestration", "Workflows"],
  },
  {
    id: "post-3",
    slug: "couche-semantique-dbt-bi",
    title: "The semantic layer: define your indicators once",
    excerpt: "Why centralise the calculation rules of your indicators before building dashboards or letting AI query your data.",
    categoryKey: "data",
    categoryLabel: "Data & Decision",
    date: ARTICLE_REVISION_DATE,
    readingTime: "5 min",
    author: "Martial GNINHI",
    tags: ["dbt", "BI", "Semantic layer"],
  },
  {
    id: "post-5",
    slug: "event-driven-agents",
    title: "Connecting several AI agents through events",
    excerpt: "Why agents that exchange messages through events, rather than direct calls, cope better with failures and are easier to observe.",
    categoryKey: "architecture",
    categoryLabel: "Architecture",
    date: ARTICLE_REVISION_DATE,
    readingTime: "12 min",
    author: "Martial GNINHI",
    tags: ["Events", "Kafka", "Multi-agent"],
  },
];

/** Capacités techniques FR (sans indicateur chiffré). */
export const FALLBACK_CAPABILITIES_FR: CapabilityDTO[] = [
  {
    id: "cap-1",
    key: "rag",
    stretch: "01",
    title: "Assistants sur vos documents (RAG)",
    description: "Recherche dans vos documents, réponses qui citent leurs sources et garde-fous qui bloquent les réponses non étayées.",
    features: ["Indexation de vos documents", "Recherche vectorielle (Qdrant)", "Évaluation continue (Ragas)"],
    order: 1,
  },
  {
    id: "cap-2",
    key: "agents",
    stretch: "02",
    title: "Systèmes multi-agents",
    description: "Plusieurs agents IA qui se répartissent le travail, avec une trace de chaque étape et une validation humaine.",
    features: ["Protocole MCP", "Validation humaine aux étapes sensibles", "Traçage des étapes (Langfuse)"],
    order: 2,
  },
  {
    id: "cap-3",
    key: "automation",
    stretch: "03",
    title: "Automatisation des processus",
    description: "Des enchaînements entre vos outils qui reprennent proprement après un incident.",
    features: ["n8n et Temporal", "Connexion à vos logiciels par API", "Alertes en cas d'anomalie"],
    order: 3,
  },
  {
    id: "cap-4",
    key: "data",
    stretch: "04",
    title: "Données et tableaux de bord",
    description: "Des indicateurs définis une seule fois et des tableaux de bord lisibles par la direction.",
    features: ["Modélisation dbt", "Entrepôt de données (Snowflake, BigQuery)", "Tableaux de bord Power BI"],
    order: 4,
  },
];

/** Capacités techniques EN. */
export const FALLBACK_CAPABILITIES_EN: CapabilityDTO[] = [
  {
    id: "cap-1",
    key: "rag",
    stretch: "01",
    title: "Assistants on your documents (RAG)",
    description: "Search across your documents, answers that cite their sources and guardrails that block unsupported answers.",
    features: ["Indexing of your documents", "Vector search (Qdrant)", "Continuous evaluation (Ragas)"],
    order: 1,
  },
  {
    id: "cap-2",
    key: "agents",
    stretch: "02",
    title: "Multi-agent systems",
    description: "Several AI agents sharing the work, with a trace of every step and human validation.",
    features: ["MCP protocol", "Human validation at sensitive steps", "Step tracing (Langfuse)"],
    order: 2,
  },
  {
    id: "cap-3",
    key: "automation",
    stretch: "03",
    title: "Process automation",
    description: "Chains between your tools that recover cleanly after an incident.",
    features: ["n8n and Temporal", "API connections to your software", "Anomaly alerts"],
    order: 3,
  },
  {
    id: "cap-4",
    key: "data",
    stretch: "04",
    title: "Data and dashboards",
    description: "Indicators defined once and dashboards management can read.",
    features: ["dbt modelling", "Data warehouse (Snowflake, BigQuery)", "Power BI dashboards"],
    order: 4,
  },
];

/** Navigation par défaut FR. */
export const FALLBACK_NAV_ITEMS_FR: NavItemDTO[] = [
  { id: "nav-1", viewKey: "home", label: "Accueil", hint: "Vue d'ensemble", order: 1 },
  { id: "nav-2", viewKey: "services", label: "Services", hint: "4 services", order: 2 },
  { id: "nav-3", viewKey: "solutions", label: "Solutions", hint: "Projets", order: 3 },
  { id: "nav-4", viewKey: "blog", label: "Insights", hint: "Articles", order: 4 },
  { id: "nav-5", viewKey: "contact", label: "Contact", hint: "Échanger", order: 5 },
];

/** Navigation par défaut EN. */
export const FALLBACK_NAV_ITEMS_EN: NavItemDTO[] = [
  { id: "nav-1", viewKey: "home", label: "Home", hint: "Overview", order: 1 },
  { id: "nav-2", viewKey: "services", label: "Services", hint: "4 services", order: 2 },
  { id: "nav-3", viewKey: "solutions", label: "Solutions", hint: "Projects", order: 3 },
  { id: "nav-4", viewKey: "blog", label: "Insights", hint: "Articles", order: 4 },
  { id: "nav-5", viewKey: "contact", label: "Contact", hint: "Get in touch", order: 5 },
];

/**
 * Mentions légales (type "legal") et politique de confidentialité (type "rgpd") — FR.
 * Toute révision doit mettre à jour LEGAL_LAST_UPDATED (`src/lib/content/legal.ts`).
 */
export const FALLBACK_LEGAL_SECTIONS_FR: LegalSectionDTO[] = [
  {
    id: "leg-1",
    type: "legal",
    heading: "1. Éditeur du site",
    body: "Le site https://www.analyticatech.fr est édité par Analyticatech, société par actions simplifiée (SAS) au capital de 1 000,00 €.\nSiège social : 60 rue François 1er, 75008 Paris, France.\nImmatriculation : SIREN 984 609 198 — SIRET 984 609 198 00010 (RCS Paris).\nNuméro de TVA intracommunautaire : FR96984609198.\nDirecteur de la publication : Martial GNINHI, Président de la SAS.\nActivité : conseil en systèmes et logiciels informatiques (code NAF/APE 62.02A).",
    order: 1,
  },
  {
    id: "leg-2",
    type: "legal",
    heading: "2. Hébergement",
    body: "Site hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (https://vercel.com).\nLes demandes envoyées par le formulaire de contact sont enregistrées dans une base de données Supabase hébergée dans l'Union européenne (Francfort, Allemagne).\nLes données confiées dans le cadre d'une mission sont traitées dans l'environnement convenu par contrat avec chaque client.",
    order: 2,
  },
  {
    id: "leg-3",
    type: "legal",
    heading: "3. Propriété intellectuelle",
    body: "Les textes, visuels, logos et le code de ce site sont la propriété d'Analyticatech ou utilisés avec autorisation. Toute reproduction, totale ou partielle, sans accord écrit préalable est interdite (articles L. 111-1 et suivants du Code de la propriété intellectuelle). Les citations courtes avec mention de la source sont autorisées.\nLes moteurs de recherche et les assistants d'IA peuvent indexer et citer ce site ; sa réutilisation pour entraîner des modèles d'IA n'est pas autorisée sans accord écrit.\nLes marques citées (LangChain, n8n, Power BI, etc.) appartiennent à leurs propriétaires ; leur mention n'implique aucun partenariat.",
    order: 3,
  },
  {
    id: "leg-4",
    type: "legal",
    heading: "4. Contact",
    body: "E-mail : contact@analyticatech.fr — Téléphone : +33 7 68 61 13 10 — Adresse : 60 rue François 1er, 75008 Paris, France.\nJoignable du lundi au vendredi, de 9h30 à 17h30 (heure de Paris).",
    order: 4,
  },
  {
    id: "rgpd-1",
    type: "rgpd",
    heading: "1. Responsable du traitement",
    body: "Analyticatech SAS, 60 rue François 1er, 75008 Paris, représentée par Martial GNINHI, Président. Contact pour toute question sur vos données : contact@analyticatech.fr.\nAnalyticatech n'a pas désigné de délégué à la protection des données ; les demandes sont traitées directement par le Président.",
    order: 1,
  },
  {
    id: "rgpd-2",
    type: "rgpd",
    heading: "2. Données collectées et finalités",
    body: "Formulaire de contact : prénom, nom, e-mail professionnel, entreprise, sujet et message, pour répondre à votre demande et, le cas échéant, vous adresser une proposition.\nSécurité : une empreinte technique de votre connexion (adresse IP et navigateur, enregistrées uniquement sous forme hachée, donc non lisibles) sert à limiter les envois abusifs.\nMesure d'audience : uniquement si elle est activée et que vous l'acceptez (voir section 5).",
    order: 2,
  },
  {
    id: "rgpd-3",
    type: "rgpd",
    heading: "3. Bases légales",
    body: "Réponse à votre demande et proposition commerciale : mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).\nSuivi de la relation professionnelle et prévention des abus : intérêt légitime d'Analyticatech (article 6.1.f).\nMesure d'audience : votre consentement (article 6.1.a), retirable à tout moment.",
    order: 3,
  },
  {
    id: "rgpd-4",
    type: "rgpd",
    heading: "4. Destinataires et sous-traitants",
    body: "Vos données ne sont ni vendues ni louées. Elles sont accessibles au seul fondateur d'Analyticatech et aux prestataires techniques nécessaires :\n- Vercel Inc. (hébergement du site, États-Unis) ;\n- Supabase (base de données, hébergée dans l'Union européenne) ;\n- Resend (envoi de l'e-mail de notification de votre demande, États-Unis) ;\n- PostHog (mesure d'audience, serveurs dans l'Union européenne), uniquement si elle est activée et avec votre accord.\nLes transferts vers les États-Unis sont encadrés par le cadre de protection des données UE–États-Unis ou par les clauses contractuelles types de la Commission européenne.",
    order: 4,
  },
  {
    id: "rgpd-5",
    type: "rgpd",
    heading: "5. Cookies et traceurs",
    body: "Cookies nécessaires (toujours actifs) : jeton de sécurité contre la falsification de requêtes (24 heures), préférence de langue (1 an), mémorisation de votre choix de cookies.\nMesure d'audience PostHog : lorsqu'elle est activée, elle n'est déposée qu'après votre accord dans le bandeau, sans publicité ni revente, et votre choix reste modifiable via le lien « Gestion des cookies » en bas de page. Tant qu'aucune mesure d'audience n'est active, seuls les cookies nécessaires sont déposés et aucun bandeau n'est affiché.",
    order: 5,
  },
  {
    id: "rgpd-6",
    type: "rgpd",
    heading: "6. Durées de conservation",
    body: "Demandes de contact : 3 ans à compter du dernier échange, conformément aux recommandations de la CNIL pour les prospects, puis suppression.\nChoix de cookies : 13 mois maximum.\nJournaux techniques de sécurité : durée strictement nécessaire à la prévention des abus.",
    order: 6,
  },
  {
    id: "rgpd-7",
    type: "rgpd",
    heading: "7. Vos droits",
    body: "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition (y compris à la prospection) et de portabilité de vos données (articles 15 à 22 du RGPD). Écrivez à contact@analyticatech.fr ; une réponse vous est apportée sous un mois.\nVous pouvez introduire une réclamation auprès de la CNIL : https://www.cnil.fr ou 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.",
    order: 7,
  },
];

/** Mentions légales et politique de confidentialité — EN. */
export const FALLBACK_LEGAL_SECTIONS_EN: LegalSectionDTO[] = [
  {
    id: "leg-1",
    type: "legal",
    heading: "1. Publisher",
    body: "The website https://www.analyticatech.fr is published by Analyticatech, a French simplified joint-stock company (SAS) with share capital of €1,000.00.\nRegistered office: 60 rue François 1er, 75008 Paris, France.\nRegistration: SIREN 984 609 198 — SIRET 984 609 198 00010 (Paris Trade and Companies Register).\nVAT number: FR96984609198.\nPublishing director: Martial GNINHI, President.\nActivity: IT systems and software consulting (NAF/APE code 62.02A).",
    order: 1,
  },
  {
    id: "leg-2",
    type: "legal",
    heading: "2. Hosting",
    body: "Website hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States (https://vercel.com).\nRequests sent through the contact form are stored in a Supabase database hosted in the European Union (Frankfurt, Germany).\nData entrusted during an engagement is processed in the environment agreed by contract with each client.",
    order: 2,
  },
  {
    id: "leg-3",
    type: "legal",
    heading: "3. Intellectual property",
    body: "The text, visuals, logos and code of this site belong to Analyticatech or are used with permission. Any full or partial reproduction without prior written consent is prohibited (French Intellectual Property Code, articles L. 111-1 et seq.). Short quotations with the source cited are allowed.\nSearch engines and AI assistants may index and cite this site; reusing it to train AI models is not allowed without written consent.\nTrademarks mentioned (LangChain, n8n, Power BI, etc.) belong to their owners; mentioning them implies no partnership.",
    order: 3,
  },
  {
    id: "leg-4",
    type: "legal",
    heading: "4. Contact",
    body: "Email: contact@analyticatech.fr — Phone: +33 7 68 61 13 10 — Address: 60 rue François 1er, 75008 Paris, France.\nAvailable Monday to Friday, 9:30 AM to 5:30 PM (Paris time).",
    order: 4,
  },
  {
    id: "rgpd-1",
    type: "rgpd",
    heading: "1. Data controller",
    body: "Analyticatech SAS, 60 rue François 1er, 75008 Paris, represented by Martial GNINHI, President. Contact for any question about your data: contact@analyticatech.fr.\nAnalyticatech has not appointed a data protection officer; requests are handled directly by the President.",
    order: 1,
  },
  {
    id: "rgpd-2",
    type: "rgpd",
    heading: "2. Data collected and purposes",
    body: "Contact form: first name, last name, business email, company, subject and message, to answer your request and, where relevant, send you a proposal.\nSecurity: a technical fingerprint of your connection (IP address and browser, stored only in hashed, unreadable form) is used to limit abusive submissions.\nAudience measurement: only if it is enabled and you accept it (see section 5).",
    order: 2,
  },
  {
    id: "rgpd-3",
    type: "rgpd",
    heading: "3. Legal bases",
    body: "Answering your request and sending a proposal: pre-contractual steps taken at your request (GDPR article 6.1.b).\nManaging the business relationship and preventing abuse: Analyticatech's legitimate interest (article 6.1.f).\nAudience measurement: your consent (article 6.1.a), which you can withdraw at any time.",
    order: 3,
  },
  {
    id: "rgpd-4",
    type: "rgpd",
    heading: "4. Recipients and processors",
    body: "Your data is neither sold nor rented. Only Analyticatech's founder and the necessary technical providers can access it:\n- Vercel Inc. (website hosting, United States);\n- Supabase (database, hosted in the European Union);\n- Resend (sending the notification email for your request, United States);\n- PostHog (audience measurement, servers in the European Union), only if enabled and with your consent.\nTransfers to the United States are covered by the EU–US Data Privacy Framework or the European Commission's standard contractual clauses.",
    order: 4,
  },
  {
    id: "rgpd-5",
    type: "rgpd",
    heading: "5. Cookies and trackers",
    body: "Necessary cookies (always on): security token against request forgery (24 hours), language preference (1 year), storage of your cookie choice.\nPostHog audience measurement: when it is enabled, it is set only after your consent in the banner, with no advertising or resale, and you can change your choice through the “Cookie settings” link at the bottom of each page. While no audience measurement is active, only necessary cookies are set and no banner is shown.",
    order: 5,
  },
  {
    id: "rgpd-6",
    type: "rgpd",
    heading: "6. Retention periods",
    body: "Contact requests: 3 years from the last exchange, in line with CNIL recommendations for prospects, then deleted.\nCookie choice: 13 months maximum.\nTechnical security logs: only as long as needed to prevent abuse.",
    order: 6,
  },
  {
    id: "rgpd-7",
    type: "rgpd",
    heading: "7. Your rights",
    body: "You have the right to access, rectify, erase, restrict, object to (including to marketing) and port your data (GDPR articles 15 to 22). Write to contact@analyticatech.fr; you will receive an answer within one month.\nYou can lodge a complaint with the CNIL, the French data protection authority: https://www.cnil.fr or 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, France.",
    order: 7,
  },
];
