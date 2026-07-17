/**
 * English content data for the Analyticatech website.
 * Parallel source of truth to data.ts — same export names, same structure,
 * localized for an English-speaking consulting audience.
 *
 * Locale-agnostic types are imported from data.ts; language-specific unions
 * (BlogCategory) are redefined locally so English literal values type-check.
 */

import type {
  ViewKey,
  NavItem,
  Service,
  Solution,
  StreamMetric,
  Testimonial,
  Capability,
  HeroStat,
  BlogPost as BlogPostFR,
} from "./data";

// Re-export locale-agnostic types so consumers can import both data and types
// from this module as a single drop-in source.
export type {
  ViewKey,
  NavItem,
  Service,
  Solution,
  StreamMetric,
  Testimonial,
  Capability,
  HeroStat,
};

/* ============================================================
 * BLOG CATEGORY — English literal union (overrides data.ts)
 * ============================================================ */

export type BlogCategory = "AI" | "Automation" | "BI" | "Architecture";

// BlogPost reuses the French shape, but its `category` field is retyped to
// accept English values.
export type BlogPost = Omit<BlogPostFR, "category"> & { category: BlogCategory };

/* ============================================================
 * NAV ITEMS
 * ============================================================ */

export const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home", hint: "00 // ROOT" },
  { key: "services", label: "Services", hint: "01 // SERVICES" },
  { key: "solutions", label: "Solutions", hint: "02 // SOLUTIONS" },
  { key: "blog", label: "Insights", hint: "03 // INSIGHTS" },
  { key: "contact", label: "Contact", hint: "04 // CONTACT" },
];

/* ============================================================
 * SERVICES — "Monolith" cards
 * ============================================================ */

export const SERVICES: Service[] = [
  {
    index: "01",
    title: "Artificial Intelligence",
    tagline: "LLMs, RAG & Cognitive Agents",
    description:
      "Design and deployment of production-grade LLM architectures: retrieval-augmented generation, autonomous agents, continuous evaluation and safety guardrails. From POC to industrialization.",
    technologies: ["LangChain", "LangGraph", "OpenAI", "Pinecone", "Hugging Face", "vLLM"],
    icon: "BrainCircuit",
    metrics: [
      { label: "RAG Latency", value: "320 ms" },
      { label: "Accuracy", value: "94.2%" },
    ],
  },
  {
    index: "02",
    title: "Digital Transformation",
    tagline: "Modernization & Cloud-Native",
    description:
      "Audit, architecture overhaul and migration to cloud-native stacks. We rebuild your technical foundations for scalability, resilience and data sovereignty.",
    technologies: ["Kubernetes", "Terraform", "AWS", "Azure", "GitOps", "Microservices"],
    icon: "Network",
    metrics: [
      { label: "Uptime", value: "99.98%" },
      { label: "Cloud Cost", value: "-38%" },
    ],
  },
  {
    index: "03",
    title: "Automation",
    tagline: "Workflows & Orchestration",
    description:
      "End-to-end automation of business processes: application integration, workflow orchestration, intelligent RPA and elimination of high-value repetitive tasks.",
    technologies: ["n8n", "Zapier", "Temporal", "Apache Airflow", "Make", "Python"],
    icon: "Workflow",
    metrics: [
      { label: "Automated Processes", value: "1,204" },
      { label: "Hours / Month", value: "8,500 h" },
    ],
  },
  {
    index: "04",
    title: "Agentic Systems",
    tagline: "Multi-Agent & Autonomy",
    description:
      "Multi-agent architectures capable of planning, reasoning and acting: role orchestration, long-term memory, dynamic tooling and human-in-the-loop oversight.",
    technologies: ["LangGraph", "CrewAI", "AutoGen", "MCP", "Redis", "Qdrant"],
    icon: "Bot",
    metrics: [
      { label: "Deployed Agents", value: "312" },
      { label: "Autonomy", value: "87%" },
    ],
  },
  {
    index: "05",
    title: "Business Intelligence",
    tagline: "Data & Augmented Decision-Making",
    description:
      "End-to-end data platforms: ingestion, semantic modeling, executive dashboards and predictive alerting. Data becomes a daily operational lever.",
    technologies: ["Power BI", "dbt", "Snowflake", "BigQuery", "Looker", "Superset"],
    icon: "BarChart3",
    metrics: [
      { label: "Dashboards", value: "640" },
      { label: "Data Sources", value: "120+" },
    ],
  },
];

/* ============================================================
 * SOLUTIONS — catalogue (horizontal scroll)
 * ============================================================ */

export const SOLUTIONS: Solution[] = [
  {
    id: "logistics-ai",
    sector: "Logistics",
    title: "AI-Driven Logistics Optimization",
    summary:
      "Dynamic re-orchestration of routes and demand forecasting via ML models, reducing transportation costs by 22% and stockout rates by 41%.",
    impact: "-22% costs · -41% stockouts",
    tags: ["ML", "Optimisation", "Forecast"],
  },
  {
    id: "finance-agent",
    sector: "Finance",
    title: "Regulatory Compliance Agents",
    summary:
      "Cognitive agents monitoring 100% of transactions in real time, detecting compliance anomalies and automatically generating regulatory reports.",
    impact: "100% coverage · 3s latency",
    tags: ["Agents", "Compliance", "Temps réel"],
  },
  {
    id: "retail-bi",
    sector: "Retail",
    title: "Omnichannel Predictive BI",
    summary:
      "Unified decision-making suite cross-referencing sales, inventory and behavioral signals to drive dynamic pricing and multi-store replenishment.",
    impact: "+14% margin · 640 dashboards",
    tags: ["BI", "Pricing", "Omnicanal"],
  },
  {
    id: "health-rag",
    sector: "Healthcare",
    title: "Sovereign RAG Clinical Assistant",
    summary:
      "Sovereign-hosted RAG assistant querying pharmacological databases and institutional guidelines with full traceability of cited sources.",
    impact: "100% sovereign · traced sources",
    tags: ["RAG", "Souverain", "Santé"],
  },
  {
    id: "industry-auto",
    sector: "Industry",
    title: "Digital Twin & Predictive Maintenance",
    summary:
      "Industrial digital twin powering predictive maintenance models, anticipating sensor failures and scheduling maintenance downtime.",
    impact: "-31% MTTR · +18% OEE",
    tags: ["IoT", "Jumeau numérique", "Prédictif"],
  },
  {
    id: "public-data",
    sector: "Public Sector",
    title: "Sovereign Data Platform for the Public Sector",
    summary:
      "SecNumCloud-compliant sovereign data warehouse for cross-referencing administrative data and continuously producing public policy indicators.",
    impact: "SecNumCloud · real-time",
    tags: ["Souverain", "SecNumCloud", "Open Data"],
  },
];

/* ============================================================
 * BLOG / INSIGHTS
 * ============================================================ */

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "agents-production-2025",
    title: "Industrializing AI Agents: From POC to Production-Grade Agentic Systems",
    excerpt:
      "Why 80% of agent POCs fail to scale, and the 5 architectural pillars that make the difference between a demo and a reliable system.",
    category: "AI",
    date: "2025-09-14",
    readingTime: "11 min",
    author: "L. Marchand",
    tags: ["Agents", "LangGraph", "Production"],
  },
  {
    id: "rag-evaluation",
    title: "Evaluating a RAG System: Metrics, Biases and Guardrails",
    excerpt:
      "A comprehensive evaluation framework for your retrieval-augmented pipelines: faithfulness, answer relevance, context precision and A/B testing strategy.",
    category: "AI",
    date: "2025-08-28",
    readingTime: "9 min",
    author: "S. Benali",
    tags: ["RAG", "Évaluation", "LLM"],
  },
  {
    id: "n8n-vs-temporal",
    title: "n8n vs Temporal: Choosing Your Automation Orchestrator",
    excerpt:
      "Technical comparison and field feedback on two orchestrators with opposing philosophies. Which to choose based on criticality and volume?",
    category: "Automation",
    date: "2025-08-12",
    readingTime: "7 min",
    author: "T. Nguyen",
    tags: ["n8n", "Temporal", "Workflows"],
  },
  {
    id: "semantic-layer-dbt",
    title: "The Semantic Layer: The Missing Link in Your BI",
    excerpt:
      "How dbt + a rigorous semantic layer reconciles business and data, ending contradictory figures across dashboards.",
    category: "BI",
    date: "2025-07-30",
    readingTime: "8 min",
    author: "C. Roth",
    tags: ["dbt", "Semantic", "Power BI"],
  },
  {
    id: "event-driven-agents",
    title: "Event-Driven Architecture for Multi-Agent Systems",
    excerpt:
      "Agents don't communicate through synchronous calls. Discover the event-driven pattern that makes your agent fleets resilient and observable.",
    category: "Architecture",
    date: "2025-07-15",
    readingTime: "12 min",
    author: "L. Marchand",
    tags: ["Event-driven", "Kafka", "Agents"],
  },
  {
    id: "finops-cloud-native",
    title: "Cloud-Native FinOps: Cutting the Bill Without Sacrificing Uptime",
    excerpt:
      "38% savings on average across our FinOps engagements. Methodology, tooling and governance to align cost and performance.",
    category: "Architecture",
    date: "2025-06-29",
    readingTime: "6 min",
    author: "T. Nguyen",
    tags: ["FinOps", "Kubernetes", "Cloud"],
  },
];

export const BLOG_CATEGORIES: (BlogCategory | "All")[] = [
  "All",
  "AI",
  "Automation",
  "BI",
  "Architecture",
];

/* ============================================================
 * DATA STREAM — animated metrics on the home dashboard
 * ============================================================ */

export const STREAM_METRICS: StreamMetric[] = [
  {
    label: "Automated Processes",
    value: 1204,
    suffix: "",
    trend: 8.4,
    sparkline: [12, 18, 16, 24, 30, 28, 36, 42, 48, 52, 60, 68],
  },
  {
    label: "AI Agents in Production",
    value: 312,
    suffix: "",
    trend: 22.1,
    sparkline: [4, 8, 10, 14, 18, 22, 28, 34, 38, 44, 50, 58],
  },
  {
    label: "Decision Dashboards",
    value: 640,
    suffix: "",
    trend: 5.7,
    sparkline: [22, 28, 30, 34, 38, 42, 46, 50, 54, 58, 60, 64],
  },
  {
    label: "Platform Uptime",
    value: 99.98,
    suffix: "%",
    trend: 0.2,
    sparkline: [98, 99, 99, 99, 99.5, 99.7, 99.8, 99.9, 99.95, 99.97, 99.98, 99.98],
  },
];

export const ACTIVITY_LOG: { time: string; event: string; level: "info" | "ok" | "warn" }[] = [
  { time: "14:02:11", event: "Agent[finance-04] — compliance report generated", level: "ok" },
  { time: "14:01:48", event: "Workflow[logistics-routes] optimized · -2.1% cost", level: "info" },
  { time: "14:01:22", event: "Pipeline[data-ingest] 1.2M rows processed", level: "ok" },
  { time: "14:00:55", event: "RAG latency spike detected · auto-scale triggered", level: "warn" },
  { time: "14:00:12", event: "Dashboard[exec-cfo] refreshed · 640 KPIs", level: "info" },
  { time: "13:59:40", event: "Agent[support-02] ticket resolved · 1.2s", level: "ok" },
];

/* ============================================================
 * TESTIMONIALS / CLIENT LOGOS
 * ============================================================ */

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Analyticatech transformed our compliance center. AI agents now process 100% of transactions in real time, where only 30% were covered before.",
    author: "K. Moreau",
    role: "Chief Risk Officer",
    company: "European Bank",
  },
  {
    quote:
      "Moving to an event-driven agentic architecture cut our time-to-market by a factor of three. The team masters both strategic vision and execution.",
    author: "J. Favier",
    role: "CIO",
    company: "Logistics Group FR",
  },
  {
    quote:
      "A sovereign data platform delivered in 4 months, SecNumCloud-compliant. No more contradictory figures across departments: a single source of truth.",
    author: "N. Haddad",
    role: "Public Sector CIO",
    company: "Local Authority",
  },
];

export const CLIENT_LOGOS = [
  "NOVA BANK",
  "AXIOM CORP",
  "HELIOS GROUP",
  "MERIDIAN",
  "QUANTUM LABS",
  "ORBITAL SYS",
  "VERTEX FINANCE",
  "ZENITH RETAIL",
];

/* ============================================================
 * CAPABILITIES — signature "stretched text" section (Armory-inspired)
 * ============================================================ */

export const CAPABILITIES: Capability[] = [
  {
    id: "detection",
    stretch: "Anomaly detected. Signature verified. Response deployed.",
    title: "Real-Time Detection",
    description:
      "Continuous monitoring of your AI systems. Model drift, hallucinations and performance anomalies are detected and qualified within seconds.",
    features: [
      "Simultaneous multi-threat detection",
      "24/7 monitoring of production LLMs",
      "Configurable alerting by criticality",
    ],
  },
  {
    id: "response",
    stretch: "One system sees. All know. The network responds.",
    title: "Distributed Coordination",
    description:
      "Your AI agents operate as a network. Information flows instantly between nodes, ensuring a coherent response at the scale of the organization.",
    features: [
      "Real-time multi-agent coordination",
      "Shared intelligence across units",
      "Instant network awareness",
    ],
  },
  {
    id: "adaptation",
    stretch: "Self-learning architecture. Regular updates.",
    title: "Continuous Learning",
    description:
      "Your systems adapt to new threats and new use cases. Model, signature and pattern updates — the architecture stays ahead of the threat.",
    features: [
      "Intelligible and complete system logs",
      "Cloud, on-prem or edge deployment",
      "Continuous threat intelligence",
    ],
  },
];

/* ============================================================
 * MARQUEE — keywords of the scrolling banner
 * ============================================================ */

export const MARQUEE_KEYWORDS = [
  "AI",
  "Agents",
  "Automation",
  "Transformation",
  "BI",
  "RAG",
  "LLM",
  "Data",
  "Sovereignty",
  "Production",
];

/* ============================================================
 * HERO STATS — hero banner metrics (static fallback)
 * ============================================================ */

export const HERO_STATS: HeroStat[] = [
  { v: "127+", l: "Missions Delivered" },
  { v: "38%", l: "Costs Reduced" },
  { v: "99.98%", l: "Platform Uptime" },
  { v: "4.9/5", l: "C-Level Satisfaction" },
];
