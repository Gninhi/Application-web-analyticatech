/**
 * Données de contenu du site Analyticatech.
 * Source de vérité unique pour les services, solutions, articles, etc.
 */

export type ViewKey = "home" | "services" | "solutions" | "blog" | "contact" | "rgpd" | "legal" | "about";

export interface NavItem {
  key: ViewKey;
  label: string;
  hint: string; // micro-label mono pour le command panel
}

export const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Accueil", hint: "00 // ROOT" },
  { key: "services", label: "Services", hint: "01 // SERVICES" },
  { key: "solutions", label: "Solutions", hint: "02 // SOLUTIONS" },
  { key: "blog", label: "Insights", hint: "03 // INSIGHTS" },
  { key: "contact", label: "Contact", hint: "04 // CONTACT" },
];

/* ============================================================
 * SERVICES — cartes "Monolith"
 * ============================================================ */

export interface Service {
  index: string;
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  icon: string; // nom lucide
  metrics: { label: string; value: string }[];
}

export const SERVICES: Service[] = [
  {
    index: "01",
    title: "Intelligence Artificielle",
    tagline: "LLM, RAG & Agents cognitifs",
    description:
      "Conception et déploiement d'architectures LLM en production : retrieval augmenté generation, agents autonomes, évaluation continue et garde-fous de sécurité. Du POC à l'industrialisation.",
    technologies: ["LangChain", "LangGraph", "OpenAI", "Pinecone", "Hugging Face", "vLLM"],
    icon: "BrainCircuit",
    metrics: [
      { label: "Latence RAG", value: "320 ms" },
      { label: "Précision", value: "94.2 %" },
    ],
  },
  {
    index: "02",
    title: "Transformation Digitale",
    tagline: "Modernisation & cloud-native",
    description:
      "Audit, refonte d'architecture et migration vers des stacks cloud-native. Nous reconstruisons vos fondations techniques pour la scalabilité, la résilience et la souveraineté des données.",
    technologies: ["Kubernetes", "Terraform", "AWS", "Azure", "GitOps", "Microservices"],
    icon: "Network",
    metrics: [
      { label: "Uptime", value: "99.98 %" },
      { label: "Coût cloud", value: "-38 %" },
    ],
  },
  {
    index: "03",
    title: "Automatisation",
    tagline: "Workflows & orchestrations",
    description:
      "Automatisation de bout en bout des processus métier : intégration applicative, orchestration de workflows, RPA intelligent et élimination des tâches répétitives à forte valeur.",
    technologies: ["n8n", "Zapier", "Temporal", "Apache Airflow", "Make", "Python"],
    icon: "Workflow",
    metrics: [
      { label: "Processus auto", value: "1 204" },
      { label: "Heures / mois", value: "8 500 h" },
    ],
  },
  {
    index: "04",
    title: "Systèmes Agentiques",
    tagline: "Multi-agents & autonomie",
    description:
      "Architectures multi-agents capables de planifier, raisonner et agir : orchestration de rôles, mémoire long-terme, outillage dynamique et supervision humaine dans la boucle.",
    technologies: ["LangGraph", "CrewAI", "AutoGen", "MCP", "Redis", "Qdrant"],
    icon: "Bot",
    metrics: [
      { label: "Agents déployés", value: "312" },
      { label: "Autonomie", value: "87 %" },
    ],
  },
  {
    index: "05",
    title: "Business Intelligence",
    tagline: "Data & décision augmentée",
    description:
      "Plateformes data end-to-end : ingestion, modélisation sémantique, dashboards exécutifs et alerting prédictif. La donnée devient un levier opérationnel quotidien.",
    technologies: ["Power BI", "dbt", "Snowflake", "BigQuery", "Looker", "Superset"],
    icon: "BarChart3",
    metrics: [
      { label: "Dashboards", value: "640" },
      { label: "Sources data", value: "120+" },
    ],
  },
];

/* ============================================================
 * SOLUTIONS — catalogue (scroll horizontal)
 * ============================================================ */

export interface Solution {
  id: string;
  sector: string;
  title: string;
  summary: string;
  impact: string;
  tags: string[];
}

export const SOLUTIONS: Solution[] = [
  {
    id: "logistics-ai",
    sector: "Logistique",
    title: "Optimisation logistique par l'IA",
    summary:
      "Ré-orchestration dynamique des tournées et prévision de la demande via modèles ML, réduisant les coûts transport de 22% et le taux de rupture de stock de 41%.",
    impact: "-22% coûts · -41% ruptures",
    tags: ["ML", "Optimisation", "Forecast"],
  },
  {
    id: "finance-agent",
    sector: "Finance",
    title: "Agents de conformité réglementaire",
    summary:
      "Agents cognitifs surveillant 100% des transactions en temps réel, détectant les anomalies de conformité et générant les rapports régulateurs automatiquement.",
    impact: "100% coverage · 3s latency",
    tags: ["Agents", "Compliance", "Temps réel"],
  },
  {
    id: "retail-bi",
    sector: "Retail",
    title: "BI prédictive omnicanal",
    summary:
      "Suite décisionnelle unifiée croisant ventes, stocks et signaux comportementaux pour piloter le pricing dynamique et le réassort multi-boutiques.",
    impact: "+14% marge · 640 dashboards",
    tags: ["BI", "Pricing", "Omnicanal"],
  },
  {
    id: "health-rag",
    sector: "Santé",
    title: "Assistant clinique RAG souverain",
    summary:
      "Assistant RAG hébergé en souveraineté, interrogeant les bases pharmacologiques et guidelines institutionnelles avec traçabilité complète des sources citées.",
    impact: "100% souverain · sources tracées",
    tags: ["RAG", "Souverain", "Santé"],
  },
  {
    id: "industry-auto",
    sector: "Industrie",
    title: "Jumeau numérique & maintenance prédictive",
    summary:
      "Jumeau numérique industriel alimentant des modèles de maintenance prédictive, anticipant les défaillances capteurs et planifiant les arrêts maintenance.",
    impact: "-31% MTTR · +18% OEE",
    tags: ["IoT", "Jumeau numérique", "Prédictif"],
  },
  {
    id: "public-data",
    sector: "Public",
    title: "Plateforme data souveraine secteur public",
    summary:
      "Entrepôt souverain conforme SecNumCloud pour le rapprochement de données administratives et la production d'indicateurs de politique publique en continu.",
    impact: "SecNumCloud · temps réel",
    tags: ["Souverain", "SecNumCloud", "Open Data"],
  },
];

/* ============================================================
 * BLOG / INSIGHTS
 * ============================================================ */

export type BlogCategory = "IA" | "Automatisation" | "BI" | "Architecture";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string; // ISO
  readingTime: string;
  author: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "agents-production-2025",
    title: "Industrialiser les agents IA : du POC au système agentique en production",
    excerpt:
      "Pourquoi 80% des POC agents ne passent pas l'échelle et les 5 piliers d'architecture qui font la différence entre une démo et un système fiable.",
    category: "IA",
    date: "2025-09-14",
    readingTime: "11 min",
    author: "L. Marchand",
    tags: ["Agents", "LangGraph", "Production"],
  },
  {
    id: "rag-evaluation",
    title: "Évaluer un système RAG : métriques, biais et garde-fous",
    excerpt:
      "Un cadre d'évaluation complet pour vos pipelines retrieval-augmented : faithfulness, answer relevance, context precision et stratégie de A/B testing.",
    category: "IA",
    date: "2025-08-28",
    readingTime: "9 min",
    author: "S. Benali",
    tags: ["RAG", "Évaluation", "LLM"],
  },
  {
    id: "n8n-vs-temporal",
    title: "n8n vs Temporal : choisir son orchestrateur d'automatisation",
    excerpt:
      "Comparatif technique et retour terrain sur deux orchestrateurs aux philosophies opposées. Lequel choisir selon la criticité et le volume ?",
    category: "Automatisation",
    date: "2025-08-12",
    readingTime: "7 min",
    author: "T. Nguyen",
    tags: ["n8n", "Temporal", "Workflows"],
  },
  {
    id: "semantic-layer-dbt",
    title: "La couche sémantique : le chaînon manquant de votre BI",
    excerpt:
      "Comment dbt + une couche sémantique rigoureuse réconcilie le métier et la data, et met fin aux chiffres contradictoires entre dashboards.",
    category: "BI",
    date: "2025-07-30",
    readingTime: "8 min",
    author: "C. Roth",
    tags: ["dbt", "Semantic", "Power BI"],
  },
  {
    id: "event-driven-agents",
    title: "Architecture event-driven pour systèmes multi-agents",
    excerpt:
      "Les agents ne communiquent pas par appels synchrones. Découvrez le pattern event-driven qui rend vos flottes d'agents résilientes et observables.",
    category: "Architecture",
    date: "2025-07-15",
    readingTime: "12 min",
    author: "L. Marchand",
    tags: ["Event-driven", "Kafka", "Agents"],
  },
  {
    id: "finops-cloud-native",
    title: "FinOps cloud-native : réduire sa facture sans sacrifier l'uptime",
    excerpt:
      "38% d'économies en moyenne sur nos missions FinOps. Méthodologie, outils et gouvernance pour aligner coût et performance.",
    category: "Architecture",
    date: "2025-06-29",
    readingTime: "6 min",
    author: "T. Nguyen",
    tags: ["FinOps", "Kubernetes", "Cloud"],
  },
];

export const BLOG_CATEGORIES: (BlogCategory | "Tous")[] = [
  "Tous",
  "IA",
  "Automatisation",
  "BI",
  "Architecture",
];

/* ============================================================
 * DATA STREAM — métriques animées du tableau de bord d'accueil
 * ============================================================ */

export interface StreamMetric {
  label: string;
  value: number;
  suffix: string;
  trend: number; // variation en %
  sparkline: number[];
}

export const STREAM_METRICS: StreamMetric[] = [
  {
    label: "Processus automatisés",
    value: 1204,
    suffix: "",
    trend: 8.4,
    sparkline: [12, 18, 16, 24, 30, 28, 36, 42, 48, 52, 60, 68],
  },
  {
    label: "Agents IA en production",
    value: 312,
    suffix: "",
    trend: 22.1,
    sparkline: [4, 8, 10, 14, 18, 22, 28, 34, 38, 44, 50, 58],
  },
  {
    label: "Dashboards décisionnels",
    value: 640,
    suffix: "",
    trend: 5.7,
    sparkline: [22, 28, 30, 34, 38, 42, 46, 50, 54, 58, 60, 64],
  },
  {
    label: "Uptime plateforme",
    value: 99.98,
    suffix: "%",
    trend: 0.2,
    sparkline: [98, 99, 99, 99, 99.5, 99.7, 99.8, 99.9, 99.95, 99.97, 99.98, 99.98],
  },
];

export const ACTIVITY_LOG: { time: string; event: string; level: "info" | "ok" | "warn" }[] = [
  { time: "14:02:11", event: "Agent[finance-04] — rapport conformité généré", level: "ok" },
  { time: "14:01:48", event: "Workflow[logistics-routes] optimisé · -2.1% coût", level: "info" },
  { time: "14:01:22", event: "Pipeline[data-ingest] 1.2M lignes traitées", level: "ok" },
  { time: "14:00:55", event: "Latence RAG spike détecté · auto-scale déclenché", level: "warn" },
  { time: "14:00:12", event: "Dashboard[exec-cfo] rafraîchi · 640 KPIs", level: "info" },
  { time: "13:59:40", event: "Agent[support-02] ticket résolu · 1.2s", level: "ok" },
];

/* ============================================================
 * TÉMOIGNAGES / LOGOS CLIENTS
 * ============================================================ */

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Analyticatech a transformé notre centre de conformité. Les agents IA traitent désormais 100% des transactions en temps réel, là où 30% passaient auparavant.",
    author: "K. Moreau",
    role: "Directrice des Risques",
    company: "Banque Européenne",
  },
  {
    quote:
      "Le passage à une architecture agentique event-driven a divisé notre time-to-market par trois. L'équipe maîtrise autant la hauteur de vue que l'exécution.",
    author: "J. Favier",
    role: "CIO",
    company: "Groupe Logistique FR",
  },
  {
    quote:
      "Une plateforme data souveraine livrée en 4 mois, conforme SecNumCloud. Fini les chiffres contradictoires entre directions : une seule source de vérité.",
    author: "N. Haddad",
    role: "DSI Secteur Public",
    company: "Collectivité Territoriale",
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
 * CAPABILITIES — section signature "stretched text" (inspiré Armory)
 * ============================================================ */

export interface Capability {
  id: string;
  stretch: string; // texte étiré signature
  title: string;
  description: string;
  features: string[];
}

export const CAPABILITIES: Capability[] = [
  {
    id: "detection",
    stretch: "Anomalie détectée. Signature vérifiée. Réponse déployée.",
    title: "Détection temps réel",
    description:
      "Surveillance continue de vos systèmes IA. Les dérives de modèle, hallucinations et anomalies de performance sont détectées et qualifiées en quelques secondes.",
    features: [
      "Détection multi-menaces simultanée",
      "Monitoring 24/7 des LLM en production",
      "Alerting configurable par criticité",
    ],
  },
  {
    id: "response",
    stretch: "Un système voit. Tous savent. Le réseau répond.",
    title: "Coordination distribuée",
    description:
      "Vos agents IA fonctionnent en réseau. L'information circule instantanément entre nœuds, garantissant une réponse cohérente à l'échelle de l'organisation.",
    features: [
      "Coordination multi-agents temps réel",
      "Intelligence partagée entre unités",
      "Awareness réseau instantané",
    ],
  },
  {
    id: "adaptation",
    stretch: "Architecture auto-apprenante. Mises à jour régulières.",
    title: "Apprentissage continu",
    description:
      "Vos systèmes s'adaptent aux nouvelles menaces et aux nouveaux cas d'usage. Mises à jour de modèles, signatures, patterns — l'architecture reste ahead of the threat.",
    features: [
      "Logs système intelligibles et complets",
      "Déploiement cloud, on-prem ou edge",
      "Threat intelligence continue",
    ],
  },
];

/* ============================================================
 * MARQUEE — mots-clés du bandeau défilant
 * ============================================================ */

export const MARQUEE_KEYWORDS = [
  "IA",
  "Agents",
  "Automatisation",
  "Transformation",
  "BI",
  "RAG",
  "LLM",
  "Data",
  "Souveraineté",
  "Production",
];

/* ============================================================
 * HERO STATS — métriques du bandeau hero (fallback statique)
 * ============================================================ */

export interface HeroStat {
  v: string;
  l: string;
}

export const HERO_STATS: HeroStat[] = [
  { v: "127+", l: "Missions livrées" },
  { v: "38%", l: "Coûts réduits" },
  { v: "99.98%", l: "Uptime plateforme" },
  { v: "4.9/5", l: "Satisfaction C-Level" },
];
