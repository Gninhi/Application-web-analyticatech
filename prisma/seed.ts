/* eslint-disable no-console */
import { db } from "@/lib/db/client";

async function seed() {
  console.log("🌱 Initialisation du seed complet Supabase...");

  // ============================================================
  // 1. SITE CONFIG & APP CONFIG
  // ============================================================
  await db.siteConfig.upsert({
    where: { id: "singleton" },
    update: {
      siteName: "Analyticatech",
      url: "https://analyticatech.fr",
      email: "contact@analyticatech.fr",
      phone: "+33 7 68 61 13 10",
      phoneHref: "tel:+33768611310",
      streetAddress: "60 rue François 1er",
      city: "Paris",
      postalCode: "75008",
      country: "France",
      countryCode: "FR",
      socialLinkedin: "https://www.linkedin.com",
      socialTwitter: "https://twitter.com",
      socialGithub: "https://github.com",
      geoLat: 48.8688,
      geoLng: 2.3314,
    },
    create: {
      id: "singleton",
      siteName: "Analyticatech",
      url: "https://analyticatech.fr",
      email: "contact@analyticatech.fr",
      phone: "+33 7 68 61 13 10",
      phoneHref: "tel:+33768611310",
      streetAddress: "60 rue François 1er",
      city: "Paris",
      postalCode: "75008",
      country: "France",
      countryCode: "FR",
      socialLinkedin: "https://www.linkedin.com",
      socialTwitter: "https://twitter.com",
      socialGithub: "https://github.com",
      geoLat: 48.8688,
      geoLng: 2.3314,
    },
  });
  console.log("✓ SiteConfig inséré");

  const appConfigs = [
    { key: "scroll_glass_effect_px", value: "16" },
    { key: "scroll_auto_hide_px", value: "120" },
    { key: "scroll_delta_px", value: "6" },
    { key: "scroll_back_to_top_px", value: "600" },
    { key: "anim_page_transition_ms", value: "350" },
    { key: "anim_theme_transition_ms", value: "300" },
    { key: "anim_marquee_slow_sec", value: "50" },
    { key: "anim_marquee_medium_sec", value: "35" },
    { key: "anim_marquee_fast_sec", value: "25" },
    { key: "anim_loader_ms", value: "1800" },
    { key: "rate_limit_contact_per_hr", value: "5" },
    { key: "rate_limit_contact_window_ms", value: "3600000" },
    { key: "max_body_size_bytes", value: "16384" },
    { key: "csrf_cookie_name", value: "__Host-at_csrf" },
    { key: "csrf_header_name", value: "x-csrf-token" },
    { key: "consent_storage_key", value: "at-cookie-consent" },
    { key: "consent_version", value: "1.0" },
    { key: "mail_from", value: "contact@analyticatech.fr" },
    { key: "mail_to", value: "leads@analyticatech.fr" },
    { key: "app_version", value: "2.4.1" },
  ] as const;

  for (const c of appConfigs) {
    await db.appConfig.upsert({
      where: { key: c.key },
      update: { value: c.value },
      create: { key: c.key, value: c.value },
    });
  }
  console.log("✓ AppConfig inséré");

  // ============================================================
  // 2. MÉTRIQUES ET LOGOS CLIENTS
  // ============================================================
  const metrics = [
    { key: "missions_delivered", label: "Missions livrées", labelEn: "Missions Delivered", value: "127+", numericValue: 127, suffix: "+", trend: 15.2, sparkline: [90, 95, 102, 110, 115, 120, 127], source: "static" as const, order: 1 },
    { key: "cost_reduction", label: "Coûts réduits", labelEn: "Costs Reduced", value: "38%", numericValue: 38, suffix: "%", trend: -5.4, sparkline: [15, 20, 28, 32, 35, 38], source: "static" as const, order: 2 },
    { key: "uptime_platform", label: "Uptime plateforme", labelEn: "Platform Uptime", value: "99.98%", numericValue: 99.98, suffix: "%", trend: 0.2, sparkline: [99.5, 99.7, 99.8, 99.9, 99.98], source: "static" as const, order: 3 },
    { key: "satisfaction_clevel", label: "Satisfaction C-Level", labelEn: "C-Level Satisfaction", value: "4.9/5", numericValue: 4.9, suffix: "/5", trend: 0.1, sparkline: [4.6, 4.7, 4.8, 4.9], source: "static" as const, order: 4 },
    { key: "processes_automated", label: "Processus automatisés", labelEn: "Automated Processes", value: "1 204", numericValue: 1204, suffix: "", trend: 8.4, sparkline: [12, 18, 24, 36, 48, 60, 68], source: "stream" as const, order: 5 },
    { key: "agents_production", label: "Agents IA en production", labelEn: "AI Agents in Production", value: "312", numericValue: 312, suffix: "", trend: 22.1, sparkline: [4, 10, 18, 28, 38, 50, 58], source: "stream" as const, order: 6 },
    { key: "dashboards_decisional", label: "Dashboards décisionnels", labelEn: "Decision Dashboards", value: "640", numericValue: 640, suffix: "", trend: 5.7, sparkline: [22, 30, 38, 46, 54, 60, 64], source: "stream" as const, order: 7 },
    { key: "hours_saved_monthly", label: "Heures économisées / mois", labelEn: "Hours Saved / Month", value: "8 500 h", numericValue: 8500, suffix: " h", trend: 12.0, sparkline: [1000, 3000, 5000, 7000, 8500], source: "static" as const, order: 8 },
  ];

  for (const m of metrics) {
    await db.metric.upsert({
      where: { key: m.key },
      update: m,
      create: m,
    });
  }
  console.log("✓ Métriques insérées");

  const clientLogos = [
    { name: "NOVA BANK", sector: "Finance", order: 1 },
    { name: "AXIOM CORP", sector: "Conseil", order: 2 },
    { name: "HELIOS GROUP", sector: "Énergie", order: 3 },
    { name: "MERIDIAN", sector: "Logistique", order: 4 },
    { name: "QUANTUM LABS", sector: "Recherche", order: 5 },
    { name: "ORBITAL SYS", sector: "Aéro", order: 6 },
    { name: "VERTEX FINANCE", sector: "Finance", order: 7 },
    { name: "ZENITH RETAIL", sector: "Retail", order: 8 },
    { name: "POLARIS AI", sector: "Tech", order: 9 },
    { name: "NORDIC DATA", sector: "Data", order: 10 },
    { name: "CIPHER LABS", sector: "Cybersécurité", order: 11 },
    { name: "ATLAS SYSTEMS", sector: "Industrie", order: 12 },
  ];

  for (const l of clientLogos) {
    await db.clientLogo.upsert({
      where: { name: l.name },
      update: l,
      create: l,
    });
  }
  console.log("✓ Logos clients insérés");

  // ============================================================
  // 3. SERVICES (bilingues FR & EN) — 4 piliers (02 Transformation supprimé)
  // ============================================================
  const servicesData = [
    {
      index: "01",
      iconKey: "BrainCircuit",
      bgImagePath: "/services/bg-01-ia.webp",
      meshOverlay: "radial-gradient(ellipse 70% 90% at 15% 20%, rgba(242,109,61,0.35), transparent 55%), radial-gradient(ellipse 60% 80% at 90% 90%, rgba(2,40,89,0.7), transparent 60%)",
      order: 1,
      fr: {
        title: "Raisonnement & RAG",
        tagline: "Audit de l'existant & priorisation ROI",
        description: "Audit de l'existant et priorisation des cas d'usage à plus fort ROI : nous identifions ensemble où l'IA crée le plus de valeur mesurable.",
        personaCeo: "Sur 10 POC IA, seulement 2 réussissent à échelle. Notre approche industrielle avec 5 piliers garantit votre succès: architecture robuste, données qualité, modèles évalués, sécurité intégrée, ROI mesuré. Engagement: POC 6 semaines, livrable et roadmap 12 mois.",
        personaArchitect: "Stack recommandée: LangGraph orchestration, Pinecone vector search, vLLM high-performance deployment. Patterns: RAG augmenté, agents avec mémoire à long terme, garde-fous de sécurité, évaluation continue toutes les 24h. Intégration: API REST + GraphQL, Docker/Kubernetes, monitoring Prometheus + Grafana.",
        personaOperational: "Durée POC: 6 semaines. Équipe: 2 architectes + 1 data scientist + 1 DevOps. Outils: LangChain framework, OpenAI API, Pinecone vector database, GitHub Actions CI/CD. Méthodologie: sprints 2 semaines, démos production, observabilité complète dès le départ.",
      },
      en: {
        title: "Reasoning & RAG",
        tagline: "Existing-state audit & ROI prioritization",
        description: "We audit your existing landscape and prioritize the use cases with the highest measurable ROI.",
        personaCeo: "Of 10 AI POCs, only 2 succeed at scale. Our industrial approach with 5 pillars guarantees your success: robust architecture, quality data, evaluated models, integrated security, measured ROI. Commitment: 6-week POC, deliverable and 12-month roadmap.",
        personaArchitect: "Recommended stack: LangGraph orchestration, Pinecone vector search, vLLM high-performance deployment. Patterns: RAG augmented, agents with long-term memory, security guardrails, continuous evaluation every 24h. Integration: REST + GraphQL APIs, Docker/Kubernetes deployment, Prometheus + Grafana monitoring.",
        personaOperational: "POC duration: 6 weeks. Team: 2 architects + 1 data scientist + 1 DevOps. Tools: LangChain framework, OpenAI API, Pinecone vector database, GitHub Actions CI/CD. Methodology: 2-week sprints, production demos, full observability from the start.",
      },
      technologies: ["LangChain", "LangGraph", "OpenAI", "Pinecone", "Hugging Face", "vLLM"],
      metrics: [
        { label: "Latence RAG", value: "320 ms" },
        { label: "Précision", value: "94.2 %" },
      ],
    },
    {
      index: "02",
      iconKey: "Workflow",
      bgImagePath: "/services/bg-03-auto.webp",
      meshOverlay: "radial-gradient(ellipse 70% 90% at 20% 85%, rgba(56,189,248,0.30), transparent 55%), radial-gradient(ellipse 60% 80% at 85% 15%, rgba(2,40,89,0.7), transparent 60%)",
      order: 2,
      fr: {
        title: "Automatisation & Workflows",
        tagline: "Workflows & orchestrations",
        description: "Automatisation de bout en bout des processus métier : intégration applicative, orchestration de workflows, RPA intelligent et élimination des tâches répétitives à forte valeur.",
        personaCeo: "Automatisation bout-en-bout = réduction de 40% des tâches répétitives + augmentation de 25% de la productivité équipe. Cas d'usage: RPA processus comptable, orchestration workflows marketing, élimination tasks manuelles à forte valeur. Engagement: POC 8 semaines, déploiement complet 3 mois.",
        personaArchitect: "Stack recommandée: n8n workflow automation, Temporal orchestration, Apache Airflow batch processing, Make integration. Patterns: event-driven workflows, RPA intelligent, API-first approach. Intégration: connecteurs métier, webhooks, systèmes légacys.",
        personaOperational: "Durée POC: 8 semaines. Équipe: 1 architecte + 1 data analyst + 1 développeur RPA. Outils: n8n, Zapier, Temporal, Python scripts. Méthodologie: cartographie processus, conception workflows, tests utilisateurs, déploiement progressif.",
      },
      en: {
        title: "Automation & Workflows",
        tagline: "Workflows & Orchestration",
        description: "End-to-end automation of business processes: application integration, workflow orchestration, intelligent RPA and elimination of high-value repetitive tasks.",
        personaCeo: "End-to-end automation = 40% reduction of repetitive tasks + 25% team productivity increase. Use cases: RPA accounting processes, marketing workflow orchestration, elimination of high-value manual tasks. Commitment: 8-week POC, full deployment 3 months.",
        personaArchitect: "Recommended stack: n8n workflow automation, Temporal orchestration, Apache Airflow batch processing, Make integration. Patterns: event-driven workflows, intelligent RPA, API-first approach. Integration: business connectors, webhooks, legacy system integration.",
        personaOperational: "POC duration: 8 weeks. Team: 1 architect + 1 data analyst + 1 RPA developer. Tools: n8n, Zapier, Temporal, Python scripts. Methodology: process mapping, workflow design, user testing, progressive deployment.",
      },
      technologies: ["n8n", "Zapier", "Temporal", "Apache Airflow", "Make", "Python"],
      metrics: [
        { label: "Processus auto", value: "1 204" },
        { label: "Heures / mois", value: "8 500 h" },
      ],
    },
    {
      index: "03",
      iconKey: "Bot",
      bgImagePath: "/services/bg-04-agents.webp",
      meshOverlay: "radial-gradient(ellipse 70% 90% at 85% 30%, rgba(16,185,129,0.28), transparent 55%), radial-gradient(ellipse 60% 80% at 10% 80%, rgba(2,40,89,0.7), transparent 60%)",
      order: 3,
      fr: {
        title: "Orchestration Multi-Agents",
        tagline: "Multi-agents & autonomie",
        description: "Architectures multi-agents capables de planifier, raisonner et agir : orchestration de rôles, mémoire long-terme, outillage dynamique et supervision humaine dans la boucle.",
        personaCeo: "Architectures multi-agents = coordination de 312 agents en production + autonomie 87% + réduction time-to-market de 60%. Patterns: rôle orchestration, mémoire long-terme, outillage dynamique, supervision humaine-en-boucle. Engagement: POC 2 mois, système complet 4 mois.",
        personaArchitect: "Stack recommandée: LangGraph orchestration, CrewAI multi-agent, AutoGen pattern, MCP protocol, Redis mémoire, Qdrant vector store. Patterns: rôle orchestration, mémoire à long-terme, outillage dynamique, supervision humaine-en-boucle. Intégration: API REST, événements Pub/Sub, stockage distribué.",
        personaOperational: "Durée POC: 2 mois. Équipe: 2 architectes + 1 chercheur IA + 1 DevOps. Outils: LangGraph, CrewAI, AutoGen, Redis, Qdrant. Méthodologie: conception rôles, tests d'autonomie, benchmark performances, déploiement progressif.",
      },
      en: {
        title: "Multi-Agent Orchestration",
        tagline: "Multi-Agent & Autonomy",
        description: "Multi-agent architectures capable of planning, reasoning and acting: role orchestration, long-term memory, dynamic tooling and human-in-the-loop oversight.",
        personaCeo: "Multi-agent architectures = 312 agents in production + 87% autonomy + 60% time-to-market reduction. Patterns: role orchestration, long-term memory, dynamic tooling, human-in-the-loop oversight. Commitment: 2-week POC, full system 4 months.",
        personaArchitect: "Recommended stack: LangGraph orchestration, CrewAI multi-agent, AutoGen pattern, MCP protocol, Redis memory, Qdrant vector store. Patterns: role orchestration, long-term memory, dynamic tooling, human-in-the-loop oversight. Integration: REST APIs, Pub/Sub events, distributed storage.",
        personaOperational: "POC duration: 2 months. Team: 2 architects + 1 AI researcher + 1 DevOps. Tools: LangGraph, CrewAI, AutoGen, Redis, Qdrant. Methodology: role design, autonomy testing, performance benchmarking, progressive deployment.",
      },
      technologies: ["LangGraph", "CrewAI", "AutoGen", "MCP", "Redis", "Qdrant"],
      metrics: [
        { label: "Agents déployés", value: "312" },
        { label: "Autonomie", value: "87 %" },
      ],
    },
    {
      index: "04",
      iconKey: "BarChart3",
      bgImagePath: "/services/bg-05-bi.webp",
      meshOverlay: "radial-gradient(ellipse 70% 90% at 25% 20%, rgba(168,85,247,0.28), transparent 55%), radial-gradient(ellipse 60% 80% at 80% 85%, rgba(2,40,89,0.7), transparent 60%)",
      order: 4,

      fr: {
        title: "Data & Décision Augmentée",
        tagline: "Data & décision augmentée",
        description: "Plateformes data end-to-end : ingestion, modélisation sémantique, dashboards exécutifs et alerting prédictif. La donnée devient un levier opérationnel quotidien.",
        personaCeo: "BI décisionnelle = 640 dashboards executives + 120+ sources de données unifiées + marges +14% en moyenne. Pattern: ingestion ETL, modèle sémantique dbt, alerting prédictif, self-service business. Engagement: projet 3 mois, adoption équipe 2 mois.",
        personaArchitect: "Stack recommandée: Power BI visualisation, dbt sémantique modélisation, Snowflake/cloud data warehouse, BigQuery, Looker exploration, Superset ad-hoc. Patterns: semantic layer, data modeling, dashboard governance, KPI tracking. Intégration: API REST, webhooks, data pipelines ETL.",
        personaOperational: "Durée projet: 3 mois. Équipe: 1 architecte + 1 data engineer + 1 analyste BI. Outils: Power BI, dbt, Snowflake, Git. Méthodologie: discovery workshops, modèle sémantique, tests utilisateurs, formation équipe.",
      },
      en: {
        title: "Data & Augmented Decision",
        tagline: "Data & Augmented Decision-Making",
        description: "End-to-end data platforms: ingestion, semantic modeling, executive dashboards and predictive alerting. Data becomes a daily operational lever.",
        personaCeo: "Executive BI = 640 executive dashboards + 120+ unified data sources + average +14% margins. Pattern: ETL ingestion, semantic dbt model, predictive alerting, self-service business. Commitment: 3-month project, 2-month team adoption.",
        personaArchitect: "Recommended stack: Power BI visualization, semantic dbt modeling, Snowflake/cloud data warehouse, BigQuery, Looker exploration, Superset ad-hoc. Patterns: semantic layer, data modeling, dashboard governance, KPI tracking. Integration: REST APIs, webhooks, ETL data pipelines.",
        personaOperational: "Project duration: 3 months. Team: 1 architect + 1 data engineer + 1 BI analyst. Tools: Power BI, dbt, Snowflake, Git. Methodology: discovery workshops, semantic modeling, user testing, team training.",
      },
      technologies: ["Power BI", "dbt", "Snowflake", "BigQuery", "Looker", "Superset"],
      metrics: [
        { label: "Dashboards", value: "640" },
        { label: "Sources data", value: "120+" },
      ],
    },
  ];

  for (const s of servicesData) {
    const service = await db.service.upsert({
      where: { index: s.index },
      update: {
        iconKey: s.iconKey,
        bgImagePath: s.bgImagePath,
        meshOverlay: s.meshOverlay,
        order: s.order,
      },
      create: {
        index: s.index,
        iconKey: s.iconKey,
        bgImagePath: s.bgImagePath,
        meshOverlay: s.meshOverlay,
        order: s.order,
      },
    });

    // Translations FR & EN
    await db.serviceTranslation.upsert({
      where: { serviceId_locale: { serviceId: service.id, locale: "fr" } },
      update: s.fr,
      create: { serviceId: service.id, locale: "fr", ...s.fr },
    });
    await db.serviceTranslation.upsert({
      where: { serviceId_locale: { serviceId: service.id, locale: "en" } },
      update: s.en,
      create: { serviceId: service.id, locale: "en", ...s.en },
    });

    // Technologies
    await db.serviceTechnology.deleteMany({ where: { serviceId: service.id } });
    for (let i = 0; i < s.technologies.length; i++) {
      await db.serviceTechnology.create({
        data: { serviceId: service.id, name: s.technologies[i], order: i + 1 },
      });
    }

    // Metrics
    await db.serviceMetric.deleteMany({ where: { serviceId: service.id } });
    for (let i = 0; i < s.metrics.length; i++) {
      await db.serviceMetric.create({
        data: { serviceId: service.id, label: s.metrics[i].label, value: s.metrics[i].value, order: i + 1 },
      });
    }
  }
  
  // Nettoyage : supprimer les services obsolètes (ex-02 Transformation, ex-05)
  await db.service.deleteMany({
    where: { index: { notIn: ["01", "02", "03", "04"] } },
  });
  
  console.log("✓ Services insérés");

  // ============================================================
  // 4. SOLUTIONS (use-cases sectoriels)
  // ============================================================
  const solutionsData = [
    {
      slug: "logistics-ai",
      sectorFr: "Logistique",
      sectorEn: "Logistics",
      impact: "-22% coûts · -41% ruptures",
      order: 1,
      tags: ["ML", "Optimisation", "Forecast"],
      fr: {
        title: "Optimisation logistique par l'IA",
        summary: "Ré-orchestration dynamique des tournées et prévision de la demande via modèles ML, réduisant les coûts transport de 22% et le taux de rupture de stock de 41%.",
      },
      en: {
        title: "AI-Driven Logistics Optimization",
        summary: "Dynamic re-orchestration of routes and demand forecasting via ML models, reducing transportation costs by 22% and stockout rates by 41%.",
      },
    },
    {
      slug: "finance-agent",
      sectorFr: "Finance",
      sectorEn: "Finance",
      impact: "100% coverage · 3s latency",
      order: 2,
      tags: ["Agents", "Compliance", "Temps réel"],
      fr: {
        title: "Agents de conformité réglementaire",
        summary: "Agents cognitifs surveillant 100% des transactions en temps réel, détectant les anomalies de conformité et générant les rapports régulateurs automatiquement.",
      },
      en: {
        title: "Regulatory Compliance Agents",
        summary: "Cognitive agents monitoring 100% of transactions in real time, detecting compliance anomalies and automatically generating regulatory reports.",
      },
    },
    {
      slug: "retail-bi",
      sectorFr: "Retail",
      sectorEn: "Retail",
      impact: "+14% marge · 640 dashboards",
      order: 3,
      tags: ["BI", "Pricing", "Omnicanal"],
      fr: {
        title: "BI prédictive omnicanal",
        summary: "Suite décisionnelle unifiée croisant ventes, stocks et signaux comportementaux pour piloter le pricing dynamique et le réassort multi-boutiques.",
      },
      en: {
        title: "Omnichannel Predictive BI",
        summary: "Unified decision-making suite cross-referencing sales, inventory and behavioral signals to drive dynamic pricing and multi-store replenishment.",
      },
    },
    {
      slug: "health-rag",
      sectorFr: "Santé",
      sectorEn: "Healthcare",
      impact: "100% souverain · sources tracées",
      order: 4,
      tags: ["RAG", "Souverain", "Santé"],
      fr: {
        title: "Assistant clinique RAG souverain",
        summary: "Assistant RAG hébergé en souveraineté, interrogeant les bases pharmacologiques et guidelines institutionnelles avec traçabilité complète des sources citées.",
      },
      en: {
        title: "Sovereign RAG Clinical Assistant",
        summary: "Sovereign-hosted RAG assistant querying pharmacological databases and institutional guidelines with full traceability of cited sources.",
      },
    },
    {
      slug: "industry-auto",
      sectorFr: "Industrie",
      sectorEn: "Industry",
      impact: "-31% MTTR · +18% OEE",
      order: 5,
      tags: ["IoT", "Jumeau numérique", "Prédictif"],
      fr: {
        title: "Jumeau numérique & maintenance prédictive",
        summary: "Jumeau numérique industriel alimentant des modèles de maintenance prédictive, anticipant les défaillances capteurs et planifiant les arrêts maintenance.",
      },
      en: {
        title: "Digital Twin & Predictive Maintenance",
        summary: "Industrial digital twin powering predictive maintenance models, anticipating sensor failures and scheduling maintenance downtime.",
      },
    },
    {
      slug: "public-data",
      sectorFr: "Public",
      sectorEn: "Public Sector",
      impact: "SecNumCloud · temps réel",
      order: 6,
      tags: ["Souverain", "SecNumCloud", "Open Data"],
      fr: {
        title: "Plateforme data souveraine secteur public",
        summary: "Entrepôt souverain conforme SecNumCloud pour le rapprochement de données administratives et la production d'indicateurs de politique publique en continu.",
      },
      en: {
        title: "Sovereign Data Platform for the Public Sector",
        summary: "SecNumCloud-compliant sovereign data warehouse for cross-referencing administrative data and continuously producing public policy indicators.",
      },
    },
  ];

  for (const sol of solutionsData) {
    const solution = await db.solution.upsert({
      where: { slug: sol.slug },
      update: { sector: sol.sectorFr, impact: sol.impact, order: sol.order },
      create: { slug: sol.slug, sector: sol.sectorFr, impact: sol.impact, order: sol.order },
    });

    await db.solutionTranslation.upsert({
      where: { solutionId_locale: { solutionId: solution.id, locale: "fr" } },
      update: sol.fr,
      create: { solutionId: solution.id, locale: "fr", ...sol.fr },
    });
    await db.solutionTranslation.upsert({
      where: { solutionId_locale: { solutionId: solution.id, locale: "en" } },
      update: sol.en,
      create: { solutionId: solution.id, locale: "en", ...sol.en },
    });

    await db.solutionTag.deleteMany({ where: { solutionId: solution.id } });
    for (const t of sol.tags) {
      await db.solutionTag.create({ data: { solutionId: solution.id, tag: t } });
    }
  }
  console.log("✓ Solutions insérées");

  // ============================================================
  // 5. BLOG CATEGORIES & POSTS
  // ============================================================
  const blogCatData = [
    { key: "IA", colorClass: "border-[#F26D3D] text-[#F26D3D]", order: 1, fr: "IA", en: "AI" },
    { key: "Automatisation", colorClass: "border-emerald-500 text-emerald-400", order: 2, fr: "Automatisation", en: "Automation" },
    { key: "BI", colorClass: "border-sky-500 text-sky-400", order: 3, fr: "BI", en: "BI" },
    { key: "Architecture", colorClass: "border-purple-500 text-purple-400", order: 4, fr: "Architecture", en: "Architecture" },
  ];

  const catMap = new Map<string, string>();
  for (const c of blogCatData) {
    const cat = await db.blogCategory.upsert({
      where: { key: c.key },
      update: { colorClass: c.colorClass, order: c.order },
      create: { key: c.key, colorClass: c.colorClass, order: c.order },
    });
    catMap.set(c.key, cat.id);

    await db.blogCategoryTranslation.upsert({
      where: { blogCategoryId_locale: { blogCategoryId: cat.id, locale: "fr" } },
      update: { label: c.fr },
      create: { blogCategoryId: cat.id, locale: "fr", label: c.fr },
    });
    await db.blogCategoryTranslation.upsert({
      where: { blogCategoryId_locale: { blogCategoryId: cat.id, locale: "en" } },
      update: { label: c.en },
      create: { blogCategoryId: cat.id, locale: "en", label: c.en },
    });
  }

  const postsData = [
    {
      slug: "agents-production-2025",
      categoryKey: "IA",
      date: new Date("2025-09-14"),
      readingTime: "11 min",
      author: "L. Marchand",
      tags: ["Agents", "LangGraph", "Production"],
      fr: {
        title: "Industrialiser les agents IA : du POC au système agentique en production",
        excerpt: "Pourquoi 80% des POC agents ne passent pas l'échelle et les 5 piliers d'architecture qui font la différence entre une démo et un système fiable.",
      },
      en: {
        title: "Industrializing AI Agents: From POC to Production-Grade Agentic Systems",
        excerpt: "Why 80% of agent POCs fail to scale, and the 5 architectural pillars that make the difference between a demo and a reliable system.",
      },
    },
    {
      slug: "rag-evaluation",
      categoryKey: "IA",
      date: new Date("2025-08-28"),
      readingTime: "9 min",
      author: "S. Benali",
      tags: ["RAG", "Évaluation", "LLM"],
      fr: {
        title: "Évaluer un système RAG : métriques, biais et garde-fous",
        excerpt: "Un cadre d'évaluation complet pour vos pipelines retrieval-augmented : faithfulness, answer relevance, context precision et stratégie de A/B testing.",
      },
      en: {
        title: "Evaluating a RAG System: Metrics, Biases and Guardrails",
        excerpt: "A comprehensive evaluation framework for your retrieval-augmented pipelines: faithfulness, answer relevance, context precision and A/B testing strategy.",
      },
    },
    {
      slug: "n8n-vs-temporal",
      categoryKey: "Automatisation",
      date: new Date("2025-08-12"),
      readingTime: "7 min",
      author: "T. Nguyen",
      tags: ["n8n", "Temporal", "Workflows"],
      fr: {
        title: "n8n vs Temporal : choisir son orchestrateur d'automatisation",
        excerpt: "Comparatif technique et retour terrain sur deux orchestrateurs aux philosophies opposées. Lequel choisir selon la criticité et le volume ?",
      },
      en: {
        title: "n8n vs Temporal: Choosing Your Automation Orchestrator",
        excerpt: "Technical comparison and field feedback on two orchestrators with opposing philosophies. Which to choose based on criticality and volume?",
      },
    },
    {
      slug: "semantic-layer-dbt",
      categoryKey: "BI",
      date: new Date("2025-07-30"),
      readingTime: "8 min",
      author: "C. Roth",
      tags: ["dbt", "Semantic", "Power BI"],
      fr: {
        title: "La couche sémantique : le chaînon manquant de votre BI",
        excerpt: "Comment dbt + une couche sémantique rigoureuse réconcilie le métier et la data, et met fin aux chiffres contradictoires entre dashboards.",
      },
      en: {
        title: "The Semantic Layer: The Missing Link in Your BI",
        excerpt: "How dbt + a rigorous semantic layer reconciles business and data, ending contradictory figures across dashboards.",
      },
    },
    {
      slug: "event-driven-agents",
      categoryKey: "Architecture",
      date: new Date("2025-07-15"),
      readingTime: "12 min",
      author: "L. Marchand",
      tags: ["Event-driven", "Kafka", "Agents"],
      fr: {
        title: "Architecture event-driven pour systèmes multi-agents",
        excerpt: "Les agents ne communiquent pas par appels synchrones. Découvrez le pattern event-driven qui rend vos flottes d'agents résilientes et observables.",
      },
      en: {
        title: "Event-Driven Architecture for Multi-Agent Systems",
        excerpt: "Agents don't communicate through synchronous calls. Discover the event-driven pattern that makes your agent fleets resilient and observable.",
      },
    },
    {
      slug: "finops-cloud-native",
      categoryKey: "Architecture",
      date: new Date("2025-06-29"),
      readingTime: "6 min",
      author: "T. Nguyen",
      tags: ["FinOps", "Kubernetes", "Cloud"],
      fr: {
        title: "FinOps cloud-native : réduire sa facture sans sacrifier l'uptime",
        excerpt: "38% d'économies en moyenne sur nos missions FinOps. Méthodologie, outils et gouvernance pour aligner coût et performance.",
      },
      en: {
        title: "Cloud-Native FinOps: Cutting the Bill Without Sacrificing Uptime",
        excerpt: "38% savings on average across our FinOps engagements. Methodology, tooling and governance to align cost and performance.",
      },
    },
  ];

  for (const p of postsData) {
    const categoryId = catMap.get(p.categoryKey);
    if (!categoryId) throw new Error(`Catégorie manquante pour le post "${p.slug}"`);
    const post = await db.blogPost.upsert({
      where: { slug: p.slug },
      update: {
        date: p.date,
        readingTime: p.readingTime,
        author: p.author,
        categoryId,
      },
      create: {
        slug: p.slug,
        date: p.date,
        readingTime: p.readingTime,
        author: p.author,
        categoryId,
      },
    });

    await db.blogPostTranslation.upsert({
      where: { blogPostId_locale: { blogPostId: post.id, locale: "fr" } },
      update: p.fr,
      create: { blogPostId: post.id, locale: "fr", ...p.fr },
    });
    await db.blogPostTranslation.upsert({
      where: { blogPostId_locale: { blogPostId: post.id, locale: "en" } },
      update: p.en,
      create: { blogPostId: post.id, locale: "en", ...p.en },
    });

    await db.blogPostTag.deleteMany({ where: { blogPostId: post.id } });
    for (const t of p.tags) {
      await db.blogPostTag.create({ data: { blogPostId: post.id, tag: t } });
    }
  }
  console.log("✓ Articles de blog insérés");

  // ============================================================
  // 6. CAPABILITIES (Home — section signature)
  // ============================================================
  const capData = [
    {
      key: "detection",
      order: 1,
      fr: {
        stretch: "Anomalie détectée. Signature vérifiée. Réponse déployée.",
        title: "Détection temps réel",
        description: "Surveillance continue de vos systèmes IA. Les dérives de modèle, hallucinations et anomalies de performance sont détectées et qualifiées en quelques secondes.",
      },
      en: {
        stretch: "Anomaly detected. Signature verified. Response deployed.",
        title: "Real-Time Detection",
        description: "Continuous monitoring of your AI systems. Model drift, hallucinations and performance anomalies are detected and qualified within seconds.",
      },
      features: [
        { fr: "Détection multi-menaces simultanée", en: "Simultaneous multi-threat detection" },
        { fr: "Monitoring 24/7 des LLM en production", en: "24/7 monitoring of production LLMs" },
        { fr: "Alerting configurable par criticité", en: "Configurable alerting by criticality" },
      ],
    },
    {
      key: "response",
      order: 2,
      fr: {
        stretch: "Un système voit. Tous savent. Le réseau répond.",
        title: "Coordination distribuée",
        description: "Vos agents IA fonctionnent en réseau. L'information circule instantanément entre nœuds, garantissant une réponse cohérente à l'échelle de l'organisation.",
      },
      en: {
        stretch: "One system sees. All know. The network responds.",
        title: "Distributed Coordination",
        description: "Your AI agents operate as a network. Information flows instantly between nodes, ensuring a coherent response at the scale of the organization.",
      },
      features: [
        { fr: "Coordination multi-agents temps réel", en: "Real-time multi-agent coordination" },
        { fr: "Intelligence partagée entre unités", en: "Shared intelligence across units" },
        { fr: "Awareness réseau instantané", en: "Instant network awareness" },
      ],
    },
    {
      key: "adaptation",
      order: 3,
      fr: {
        stretch: "Architecture auto-apprenante. Mises à jour régulières.",
        title: "Apprentissage continu",
        description: "Vos systèmes s'adaptent aux nouvelles menaces et aux nouveaux cas d'usage. Mises à jour de modèles, signatures, patterns — l'architecture reste ahead of the threat.",
      },
      en: {
        stretch: "Self-learning architecture. Regular updates.",
        title: "Continuous Learning",
        description: "Your systems adapt to new threats and new use cases. Model, signature and pattern updates — the architecture stays ahead of the threat.",
      },
      features: [
        { fr: "Logs système intelligibles et complets", en: "Intelligible and complete system logs" },
        { fr: "Déploiement cloud, on-prem ou edge", en: "Cloud, on-prem or edge deployment" },
        { fr: "Threat intelligence continue", en: "Continuous threat intelligence" },
      ],
    },
  ];

  for (const c of capData) {
    const cap = await db.capability.upsert({
      where: { key: c.key },
      update: { order: c.order },
      create: { key: c.key, order: c.order },
    });

    await db.capabilityTranslation.upsert({
      where: { capabilityId_locale: { capabilityId: cap.id, locale: "fr" } },
      update: c.fr,
      create: { capabilityId: cap.id, locale: "fr", ...c.fr },
    });
    await db.capabilityTranslation.upsert({
      where: { capabilityId_locale: { capabilityId: cap.id, locale: "en" } },
      update: c.en,
      create: { capabilityId: cap.id, locale: "en", ...c.en },
    });

    await db.capabilityFeature.deleteMany({ where: { capabilityId: cap.id } });
    for (let i = 0; i < c.features.length; i++) {
      await db.capabilityFeature.create({
        data: {
          capabilityId: cap.id,
          order: i + 1,
          textFr: c.features[i].fr,
          textEn: c.features[i].en,
        },
      });
    }
  }
  console.log("✓ Capacités insérées");

  // ============================================================
  // 7. TESTIMONIALS
  // ============================================================
  const testimonialsData = [
    {
      author: "K. Moreau",
      order: 1,
      fr: {
        quote: "Analyticatech a transformé notre centre de conformité. Les agents IA traitent désormais 100% des transactions en temps réel, là où 30% passaient auparavant.",
        role: "Directrice des Risques",
        company: "Banque Européenne",
      },
      en: {
        quote: "Analyticatech transformed our compliance center. AI agents now process 100% of transactions in real time, where only 30% were covered before.",
        role: "Chief Risk Officer",
        company: "European Bank",
      },
    },
    {
      author: "J. Favier",
      order: 2,
      fr: {
        quote: "Le passage à une architecture agentique event-driven a divisé notre time-to-market par trois. L'équipe maîtrise autant la hauteur de vue que l'exécution.",
        role: "CIO",
        company: "Groupe Logistique FR",
      },
      en: {
        quote: "Moving to an event-driven agentic architecture cut our time-to-market by a factor of three. The team masters both strategic vision and execution.",
        role: "CIO",
        company: "Logistics Group FR",
      },
    },
    {
      author: "N. Haddad",
      order: 3,
      fr: {
        quote: "Une plateforme data souveraine livrée en 4 mois, conforme SecNumCloud. Fini les chiffres contradictoires entre directions : une seule source de vérité.",
        role: "DSI Secteur Public",
        company: "Collectivité Territoriale",
      },
      en: {
        quote: "A sovereign data platform delivered in 4 months, SecNumCloud-compliant. No more contradictory figures across departments: a single source of truth.",
        role: "Public Sector CIO",
        company: "Local Authority",
      },
    },
  ];

  for (const t of testimonialsData) {
    const existing = await db.testimonial.findFirst({ where: { author: t.author } });
    const testimonial = existing
      ? await db.testimonial.update({ where: { id: existing.id }, data: { order: t.order } })
      : await db.testimonial.create({ data: { author: t.author, order: t.order } });

    await db.testimonialTranslation.upsert({
      where: { testimonialId_locale: { testimonialId: testimonial.id, locale: "fr" } },
      update: t.fr,
      create: { testimonialId: testimonial.id, locale: "fr", ...t.fr },
    });
    await db.testimonialTranslation.upsert({
      where: { testimonialId_locale: { testimonialId: testimonial.id, locale: "en" } },
      update: t.en,
      create: { testimonialId: testimonial.id, locale: "en", ...t.en },
    });
  }
  console.log("✓ Témoignages insérés");

  // ============================================================
  // 8. NAVIGATION (NavItem)
  // ============================================================
  const navData = [
    { viewKey: "home", order: 1, fr: { label: "Accueil", hint: "00 // ROOT" }, en: { label: "Home", hint: "00 // ROOT" } },
    { viewKey: "services", order: 2, fr: { label: "Services", hint: "01 // SERVICES" }, en: { label: "Services", hint: "01 // SERVICES" } },
    { viewKey: "solutions", order: 3, fr: { label: "Solutions", hint: "02 // SOLUTIONS" }, en: { label: "Solutions", hint: "02 // SOLUTIONS" } },
    { viewKey: "blog", order: 4, fr: { label: "Insights", hint: "03 // INSIGHTS" }, en: { label: "Insights", hint: "03 // INSIGHTS" } },
    { viewKey: "contact", order: 5, fr: { label: "Contact", hint: "04 // CONTACT" }, en: { label: "Contact", hint: "04 // CONTACT" } },
  ];

  for (const n of navData) {
    const item = await db.navItem.upsert({
      where: { viewKey: n.viewKey },
      update: { order: n.order },
      create: { viewKey: n.viewKey, order: n.order },
    });

    await db.navItemTranslation.upsert({
      where: { navItemId_locale: { navItemId: item.id, locale: "fr" } },
      update: n.fr,
      create: { navItemId: item.id, locale: "fr", ...n.fr },
    });
    await db.navItemTranslation.upsert({
      where: { navItemId_locale: { navItemId: item.id, locale: "en" } },
      update: n.en,
      create: { navItemId: item.id, locale: "en", ...n.en },
    });
  }
  console.log("✓ Navigation insérée");

  // ============================================================
  // 9. MARQUEE KEYWORDS
  // ============================================================
  const marqueeFr = ["IA", "Agents", "Automatisation", "Transformation", "BI", "RAG", "LLM", "Data", "Souveraineté", "Production"];
  const marqueeEn = ["AI", "Agents", "Automation", "Transformation", "BI", "RAG", "LLM", "Data", "Sovereignty", "Production"];

  for (let i = 0; i < marqueeFr.length; i++) {
    await db.marqueeKeyword.upsert({
      where: { locale_keyword: { locale: "fr", keyword: marqueeFr[i] } },
      update: { order: i + 1 },
      create: { locale: "fr", keyword: marqueeFr[i], order: i + 1 },
    });
  }
  for (let i = 0; i < marqueeEn.length; i++) {
    await db.marqueeKeyword.upsert({
      where: { locale_keyword: { locale: "en", keyword: marqueeEn[i] } },
      update: { order: i + 1 },
      create: { locale: "en", keyword: marqueeEn[i], order: i + 1 },
    });
  }
  console.log("✓ Marquee keywords insérés");

  // ============================================================
  // 10. ACTIVITY LOG ENTRIES
  // ============================================================
  const activityLogs = [
    {
      time: "14:02:11", level: "ok", order: 1,
      fr: "Agent[finance-04] — rapport conformité généré",
      en: "Agent[finance-04] — compliance report generated",
    },
    {
      time: "14:01:48", level: "info", order: 2,
      fr: "Workflow[logistics-routes] optimisé · -2.1% coût",
      en: "Workflow[logistics-routes] optimized · -2.1% cost",
    },
    {
      time: "14:01:22", level: "ok", order: 3,
      fr: "Pipeline[data-ingest] 1.2M lignes traitées",
      en: "Pipeline[data-ingest] 1.2M rows processed",
    },
    {
      time: "14:00:55", level: "warn", order: 4,
      fr: "Latence RAG spike détecté · auto-scale déclenché",
      en: "RAG latency spike detected · auto-scale triggered",
    },
    {
      time: "14:00:12", level: "info", order: 5,
      fr: "Dashboard[exec-cfo] rafraîchi · 640 KPIs",
      en: "Dashboard[exec-cfo] refreshed · 640 KPIs",
    },
    {
      time: "13:59:40", level: "ok", order: 6,
      fr: "Agent[support-02] ticket résolu · 1.2s",
      en: "Agent[support-02] ticket resolved · 1.2s",
    },
  ];

  await db.activityLogEntry.deleteMany({});
  for (const a of activityLogs) {
    const entry = await db.activityLogEntry.create({
      data: { time: a.time, level: a.level, order: a.order },
    });

    await db.activityLogEntryTranslation.create({
      data: { activityLogEntryId: entry.id, locale: "fr", event: a.fr },
    });
    await db.activityLogEntryTranslation.create({
      data: { activityLogEntryId: entry.id, locale: "en", event: a.en },
    });
  }
  console.log("✓ Logs d'activité insérés");

  // ============================================================
  // 11. COMPANY VALUES (About View)
  // ============================================================
  const companyValues = [
    {
      iconKey: "Target", order: 1,
      fr: { title: "Précision", description: "Chaque décision est fondée sur des données. Nous mesurons, validons et itérons — jamais d'à-peu-près." },
      en: { title: "Precision", description: "Every decision is data-driven. We measure, validate, and iterate — no guesswork." },
    },
    {
      iconKey: "Eye", order: 2,
      fr: { title: "Transparence", description: "Code auditable, logs intelligibles, métriques partagées. Vous savez toujours ce qui se passe dans vos systèmes." },
      en: { title: "Transparency", description: "Auditable code, clear logs, shared metrics. You always know what is happening inside your systems." },
    },
    {
      iconKey: "Heart", order: 3,
      fr: { title: "Engagement", description: "Une équipe dédiée, sans rotation. Nous portons vos objectifs comme les nôtres, du cadrage au run." },
      en: { title: "Commitment", description: "A dedicated team with no turnover. We treat your goals as our own, from framing to production run." },
    },
    {
      iconKey: "Users", order: 4,
      fr: { title: "Souveraineté", description: "Vos données restent les vôtres. Hébergement SecNumCloud, code ouvert, aucune dépendance fournisseur." },
      en: { title: "Sovereignty", description: "Your data stays yours. SecNumCloud hosting, open code, zero vendor lock-in." },
    },
  ];

  await db.companyValue.deleteMany({});
  for (const v of companyValues) {
    const val = await db.companyValue.create({
      data: { iconKey: v.iconKey, order: v.order },
    });

    await db.companyValueTranslation.create({
      data: { companyValueId: val.id, locale: "fr", ...v.fr },
    });
    await db.companyValueTranslation.create({
      data: { companyValueId: val.id, locale: "en", ...v.en },
    });
  }
  console.log("✓ Valeurs d'entreprise insérées");

  // ============================================================
  // 12. DELIVERY STEPS (Services View)
  // ============================================================
  const deliverySteps = [
    {
      iconKey: "Layers", order: 1,
      fr: { label: "01 · Discovery", description: "Atelier de cadrage, architecture cible, ROI projet" },
      en: { label: "01 · Discovery", description: "Scoping workshop, target architecture, project ROI" },
    },
    {
      iconKey: "Cpu", order: 2,
      fr: { label: "02 · Build", description: "Sprints de 2 semaines, démos en production, observabilité" },
      en: { label: "02 · Build", description: "2-week sprints, live production demos, observability" },
    },
    {
      iconKey: "ShieldCheck", order: 3,
      fr: { label: "03 · Hardening", description: "Audit sécurité, tests de charge, conformité RGPD" },
      en: { label: "03 · Hardening", description: "Security audit, load testing, GDPR compliance" },
    },
    {
      iconKey: "Workflow", order: 4,
      fr: { label: "04 · Run & Scale", description: "Supervision 24/7, finops, amélioration continue" },
      en: { label: "04 · Run & Scale", description: "24/7 monitoring, FinOps, continuous improvement" },
    },
  ];

  await db.deliveryStep.deleteMany({});
  for (const ds of deliverySteps) {
    const step = await db.deliveryStep.create({
      data: { iconKey: ds.iconKey, order: ds.order },
    });

    await db.deliveryStepTranslation.create({
      data: { deliveryStepId: step.id, locale: "fr", ...ds.fr },
    });
    await db.deliveryStepTranslation.create({
      data: { deliveryStepId: step.id, locale: "en", ...ds.en },
    });
  }
  console.log("✓ Étapes de livraison insérées");

  // ============================================================
  // 13. LEGAL SECTIONS (RGPD et Mentions légales)
  // ============================================================
  const rgpdSections = [
    {
      order: 1,
      fr: { heading: "1. Responsable du traitement", body: "Le responsable du traitement des données personnelles est Analyticatech, 60 rue François 1er, 75008 Paris. Contact : contact@analyticatech.fr." },
      en: { heading: "1. Data Controller", body: "The controller of personal data processing is Analyticatech, 60 rue François 1er, 75008 Paris. Contact: contact@analyticatech.fr." },
    },
    {
      order: 2,
      fr: { heading: "2. Données collectées", body: "Nous collectons uniquement les données nécessaires au traitement de votre demande de contact : nom, prénom, email professionnel, entreprise, sujet et message." },
      en: { heading: "2. Collected Data", body: "We only collect data strictly necessary to process your contact inquiry: first name, last name, business email, company, subject, and message." },
    },
    {
      order: 3,
      fr: { heading: "3. Finalité du traitement", body: "Vos données sont utilisées uniquement pour répondre à votre demande de contact et vous proposer nos services. Aucune utilisation commerciale tierce." },
      en: { heading: "3. Purpose of Processing", body: "Your data is used solely to respond to your inquiry and offer our consulting services. No commercial sharing with third parties." },
    },
    {
      order: 4,
      fr: { heading: "4. Base légale", body: "Le traitement est fondé sur votre consentement (Article 6(1)(a) du RGPD), exprimé lors de la soumission du formulaire de contact." },
      en: { heading: "4. Legal Basis", body: "Processing is based on your explicit consent (Article 6(1)(a) GDPR) granted when submitting the contact form." },
    },
    {
      order: 5,
      fr: { heading: "5. Durée de conservation", body: "Vos données sont conservées 90 jours après votre dernière interaction, puis supprimées définitivement." },
      en: { heading: "5. Retention Period", body: "Data is stored for 90 days following your last interaction, then permanently deleted." },
    },
  ];

  await db.legalSection.deleteMany({});

  for (const s of rgpdSections) {
    const sec = await db.legalSection.create({
      data: { type: "rgpd", order: s.order },
    });
    await db.legalSectionTranslation.create({
      data: { legalSectionId: sec.id, locale: "fr", ...s.fr },
    });
    await db.legalSectionTranslation.create({
      data: { legalSectionId: sec.id, locale: "en", ...s.en },
    });
  }

  const legalSections = [
    {
      order: 1,
      fr: { heading: "1. Éditeur du site", body: "Analyticatech\n60 rue François 1er, 75008 Paris\nEmail : contact@analyticatech.fr\nTéléphone : +33 7 68 61 13 10" },
      en: { heading: "1. Site Publisher", body: "Analyticatech\n60 rue François 1er, 75008 Paris\nEmail: contact@analyticatech.fr\nPhone: +33 7 68 61 13 10" },
    },
    {
      order: 2,
      fr: { heading: "2. Hébergement", body: "Le site est hébergé sur une infrastructure cloud conforme SecNumCloud, située en Union Européenne. Les données ne quittent jamais le territoire européen." },
      en: { heading: "2. Hosting", body: "The website is hosted on a SecNumCloud-compliant cloud infrastructure located within the European Union." },
    },
    {
      order: 3,
      fr: { heading: "3. Propriété intellectuelle", body: "L'ensemble des contenus présents sur ce site est la propriété exclusive d'Analyticatech. Toute reproduction sans autorisation est interdite." },
      en: { heading: "3. Intellectual Property", body: "All content on this site is the exclusive property of Analyticatech. Any unauthorized reproduction is strictly prohibited." },
    },
  ];

  for (const s of legalSections) {
    const sec = await db.legalSection.create({
      data: { type: "legal", order: s.order },
    });
    await db.legalSectionTranslation.create({
      data: { legalSectionId: sec.id, locale: "fr", ...s.fr },
    });
    await db.legalSectionTranslation.create({
      data: { legalSectionId: sec.id, locale: "en", ...s.en },
    });
  }
  console.log("✓ Sections légales et RGPD insérées");

  // ============================================================
  // 14. SEO METADATA & SCHEMAS
  // ============================================================
  const seoMeta = await db.seoMetadata.upsert({
    where: { id: "singleton" },
    update: {
      titleTemplate: "%s | Analyticatech",
      canonicalUrl: "https://analyticatech.fr",
      ogImageUrl: "https://analyticatech.fr/og-image.jpg",
      twitterCard: "summary_large_image",
      robotsIndex: true,
      robotsFollow: true,
    },
    create: {
      id: "singleton",
      titleTemplate: "%s | Analyticatech",
      canonicalUrl: "https://analyticatech.fr",
      ogImageUrl: "https://analyticatech.fr/og-image.jpg",
      twitterCard: "summary_large_image",
      robotsIndex: true,
      robotsFollow: true,
    },
  });

  await db.seoMetadataTranslation.upsert({
    where: { seoMetadataId_locale: { seoMetadataId: seoMeta.id, locale: "fr" } },
    update: {
      title: "Analyticatech — Architectures IA, Automatisation & Data d'Entreprise",
      description: "Cabinet de conseil et d'ingénierie spécialisé dans l'Intelligence Artificielle, les Systèmes Agentiques, l'Automatisation de Workflows et la Data Décisionnelle.",
      keywords: ["IA", "Agents IA", "LangChain", "RAG", "Data", "BI", "Automatisation", "n8n"],
      ogTitle: "Analyticatech — Architectures IA, Automatisation & Data d'Entreprise",
      ogDescription: "Cabinet de conseil et d'ingénierie IA, automatisation critique et architectures data pour entreprises.",
    },
    create: {
      seoMetadataId: seoMeta.id,
      locale: "fr",
      title: "Analyticatech — Architectures IA, Automatisation & Data d'Entreprise",
      description: "Cabinet de conseil et d'ingénierie spécialisé dans l'Intelligence Artificielle, les Systèmes Agentiques, l'Automatisation de Workflows et la Data Décisionnelle.",
      keywords: ["IA", "Agents IA", "LangChain", "RAG", "Data", "BI", "Automatisation", "n8n"],
      ogTitle: "Analyticatech — Architectures IA, Automatisation & Data d'Entreprise",
      ogDescription: "Cabinet de conseil et d'ingénierie IA, automatisation critique et architectures data pour entreprises.",
    },
  });


  await db.seoMetadataTranslation.upsert({
    where: { seoMetadataId_locale: { seoMetadataId: seoMeta.id, locale: "en" } },
    update: {
      title: "Analyticatech — AI Architecture & Digital Transformation",
      description: "Consulting & engineering firm specialized in Artificial Intelligence, Agentic Systems, and Critical Automation.",
      keywords: ["AI", "AI Agents", "LangChain", "RAG", "Digital Transformation", "BI", "Automation", "n8n"],
      ogTitle: "Analyticatech — AI Architecture & Agentic Systems",
      ogDescription: "AI consulting and engineering firm delivering high-performance automation and cloud-native architectures.",
    },
    create: {
      seoMetadataId: seoMeta.id,
      locale: "en",
      title: "Analyticatech — AI Architecture & Digital Transformation",
      description: "Consulting & engineering firm specialized in Artificial Intelligence, Agentic Systems, and Critical Automation.",
      keywords: ["AI", "AI Agents", "LangChain", "RAG", "Digital Transformation", "BI", "Automation", "n8n"],
      ogTitle: "Analyticatech — AI Architecture & Agentic Systems",
      ogDescription: "AI consulting and engineering firm delivering high-performance automation and cloud-native architectures.",
    },
  });

  // Schemas JSON-LD
  await db.seoSchema.upsert({
    where: { type: "organization" },
    update: {
      payload: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Analyticatech",
        url: "https://analyticatech.fr",
        logo: "https://analyticatech.fr/logo.svg",
        email: "contact@analyticatech.fr",
        telephone: "+33 7 68 61 13 10",
        address: {
          "@type": "PostalAddress",
          streetAddress: "60 rue François 1er",
          addressLocality: "Paris",
          postalCode: "75008",
          addressCountry: "FR",
        },
      },
    },
    create: {
      type: "organization",
      payload: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Analyticatech",
        url: "https://analyticatech.fr",
        logo: "https://analyticatech.fr/logo.svg",
        email: "contact@analyticatech.fr",
        telephone: "+33 7 68 61 13 10",
        address: {
          "@type": "PostalAddress",
          streetAddress: "60 rue François 1er",
          addressLocality: "Paris",
          postalCode: "75008",
          addressCountry: "FR",
        },
      },
    },
  });
  console.log("✓ SEO Metadata et Schemas insérés");

  // ============================================================
  // 15. BLOCKED EMAIL DOMAINS & SUSPICIOUS UA PATTERNS (Sécurité)
  // ============================================================
  const blockedDomains = [
    "guerrillamail.com",
    "tempmail.org",
    "10minutemail.com",
    "dispostable.com",
    "throwawaymail.com",
    "mailinator.com",
    "yopmail.com",
    "trashmail.com",
  ];

  for (const domain of blockedDomains) {
    await db.blockedEmailDomain.upsert({
      where: { domain },
      update: { active: true },
      create: { domain, reason: "Disposable email domain", active: true },
    });
  }

  const suspiciousPatterns = [
    { pattern: "sqlmap", category: "scanner" as const },
    { pattern: "nikto", category: "scanner" as const },
    { pattern: "nmap", category: "scanner" as const },
    { pattern: "gobuster", category: "scanner" as const },
    { pattern: "dirbuster", category: "scanner" as const },
    { pattern: "masscan", category: "scanner" as const },
    { pattern: "zgrab", category: "scanner" as const },
    { pattern: "python-requests", category: "bot" as const },
  ];

  for (const p of suspiciousPatterns) {
    await db.suspiciousUAPattern.upsert({
      where: { pattern: p.pattern },
      update: { category: p.category, active: true },
      create: { pattern: p.pattern, category: p.category, active: true },
    });
  }
  console.log("✓ Domaines bloqués & patterns de sécurité insérés");

  console.log("✅ SEED COMPLET TERMINÉ AVEC SUCCÈS !");
}

seed()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
