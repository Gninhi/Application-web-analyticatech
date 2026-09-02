import type { LucideIcon } from "lucide-react";
import { BrainCircuit, Workflow, Bot, BarChart3 } from "lucide-react";

export interface ServiceDetailData {
  index: string;
  slug: string;
  icon: LucideIcon;
  iconEmoji: string;
  accentColor: string;
  accentSoft: string;
  badge: string;
  eyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
  
  // 3 Preuves chiffrées
  proofMetrics: Array<{
    value: string;
    label: string;
    context: string;
    color?: string;
  }>;

  // 4 Problèmes résolus
  painPoints: Array<{
    title: string;
    description: string;
  }>;

  // 4 Livrables concrets
  deliverables: Array<{
    number: string;
    title: string;
    description: string;
    output: string;
  }>;

  // 4 Phases méthodologiques
  timeline: Array<{
    step: string;
    title: string;
    description: string;
    duration: string;
    deliverable: string;
  }>;

  // 3 Cas d'usage sectoriels
  sectorCases: Array<{
    sector: string;
    title: string;
    description: string;
    impact: string;
  }>;

  // Stack technique par clusters
  techStackGroups: Array<{
    category: string;
    technologies: string[];
  }>;

  // Étude de cas & Témoignage
  caseStudy: {
    quote: string;
    authorRole: string;
    authorCompany: string;
    metricValue: string;
    metricLabel: string;
  };

  // FAQ spécifique
  faqs: Array<{
    question: string;
    answer: string;
  }>;

  // Navigation vers le service suivant
  nextService: {
    index: string;
    title: string;
  };
}

export const SERVICES_DETAIL_REGISTRY: Record<string, ServiceDetailData> = {
  "01": {
    index: "01",
    slug: "raisonnement-rag",
    icon: BrainCircuit,
    iconEmoji: "🧠",
    accentColor: "#F26D3D",
    accentSoft: "rgba(242, 109, 61, 0.12)",
    badge: "PRODUCTION READY",
    eyebrow: "SERVICE 01 — LLM, RAG HAUTE PRÉCISION & GARDE-FOUS",
    heroTitle: "Intelligence Artificielle",
    heroAccent: "& Systèmes RAG",
    heroSubtitle:
      "Des architectures LLM qui passent l'épreuve de la production : retrieval hybride dense/sparse, reranking sémantique, évaluation continue et garde-fous de sécurité pour des décisions d'entreprise fiables.",
    proofMetrics: [
      {
        value: "320 ms",
        label: "LATENCE RAG P95",
        context: "Mesurée en production sur un corpus de 40M+ documents hétérogènes (PDF, SQL, scans OCR).",
        color: "#F26D3D",
      },
      {
        value: "94.2 %",
        label: "PRÉCISION DE RÉPONSE",
        context: "Score validé sur jeu d'évaluation métier continu (benchmarks Ragas & TruLens) avec revue experte.",
        color: "#33D6A6",
      },
      {
        value: "6 sem.",
        label: "DURÉE MOYENNE DU POC",
        context: "De la donnée brute non structurée au prototype déployé et validé par vos équipes métier.",
        color: "#4C82FF",
      },
    ],

    painPoints: [
      {
        title: "Des POCs de démo qui ne passent jamais à l'échelle",
        description: "Des prototypes séduisants en bac à sable qui s'effondrent face aux volumétries réelles, à la latence et aux contraintes de sécurité d'entreprise.",
      },
      {
        title: "Hallucinations et perte de confiance métier",
        description: "Des modèles qui inventent des réponses plausibles mais fausses sur vos contrats, politiques internes ou documentations techniques critiques.",
      },
      {
        title: "Dette technique et dérive non surveillée",
        description: "Des pipelines déployés sans observabilité ni métriques de dérive (drift), où les coûts d'inférence explosent sans justification de ROI.",
      },
      {
        title: "Risques de conformité et fuite de données (PII)",
        description: "L'absence de filtrage des données sensibles et de garde-fous stricts exposant votre organisation aux risques RGPD et d'injection de prompt.",
      },
    ],
    deliverables: [
      {
        number: "01",
        title: "Audit d'architecture & Cartographie des données",
        description: "Analyse exhaustive de vos corpus documentaires, identification des cas d'usage prioritaires et matrice d'évaluation de la valeur métier.",
        output: "Rapport d'architecture & Matrice de ROI chiffrée",
      },
      {
        number: "02",
        title: "Pipeline RAG Hybride & Chunking Sémantique",
        description: "Indexation multimodale combinant recherche vectorielle dense et lexicale BM25 avec reranking de haute précision pour éliminer le bruit.",
        output: "Pipeline d'ingestion & Vector Store optimisé",
      },
      {
        number: "03",
        title: "Plateforme Industrialisée & Garde-fous",
        description: "Déploiement conteneurisé avec cache sémantique, filtrage PII, validation des sorties et observabilité complète des coûts et de la latence.",
        output: "API sécurisée, CI/CD & Dashboard Langfuse",
      },
      {
        number: "04",
        title: "Transfert de compétences & Autonomie",
        description: "Formation de vos équipes d'ingénierie et data, documentation technique exhaustive et plan de maintenance pour garantir votre autonomie.",
        output: "Documentation complète & Ateliers de formation",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "Cadrage & Audit",
        description: "Audit des sources, définition des métriques de précision (Ragas) et choix d'architecture souveraine.",
        duration: "1–2 semaines",
        deliverable: "Spécification technique & Choix de modèles",
      },
      {
        step: "02",
        title: "Prototypage (POC)",
        description: "Développement du pipeline RAG sur données réelles et validation des résultats avec les référents métier.",
        duration: "4–6 semaines",
        deliverable: "Prototype fonctionnel & Rapport d'évaluation",
      },
      {
        step: "03",
        title: "Industrialisation",
        description: "Passage en production : intégration API, garde-fous de sécurité, observabilité et tests de charge.",
        duration: "6–8 semaines",
        deliverable: "Plateforme en production & Monitoring",
      },
      {
        step: "04",
        title: "Run & Évolution",
        description: "Supervision continue des performances, réindexation incrémentale et optimisation mensuelle des coûts.",
        duration: "Continu",
        deliverable: "Revues mensuelles & Mises à niveau",
      },
    ],
    sectorCases: [
      {
        sector: "BANQUE & ASSURANCE",
        title: "Instruction automatisée de dossiers sinistres",
        description: "RAG hybride sur contrats d'assurance, polices et jurisprudence interne permettant une synthèse instantanée avec citations vérifiables.",
        impact: "-65% de temps de traitement par dossier",
      },
      {
        sector: "SANTÉ & PHARMA",
        title: "Copilote de recherche clinique & protocoles",
        description: "Interrogation sémantique de millions de publications médicales et rapports d'essais cliniques avec traçabilité intégrale.",
        impact: "Précision de citation validée à 99.1%",
      },
      {
        sector: "INDUSTRIE & ÉNERGIE",
        title: "Assistant technique de maintenance de terrain",
        description: "Diagnostic guidé pour les techniciens sur manuels de machines complexes et historiques d'interventions.",
        impact: "+40% de résolution au premier passage",
      },
    ],
    techStackGroups: [
      {
        category: "ORCHESTRATION",
        technologies: ["LangChain", "LlamaIndex", "LangGraph", "LiteLLM"],
      },
      {
        category: "MODÈLES & INFERENCE",
        technologies: ["Mistral Large", "Claude 3.5 Sonnet", "OpenAI GPT-4o", "vLLM", "Ollama"],
      },
      {
        category: "VECTOR STORE & DATA",
        technologies: ["Pinecone", "Qdrant", "pgvector (PostgreSQL)", "Milvus"],
      },
      {
        category: "OBSERVABILITÉ & OPS",
        technologies: ["Langfuse", "Ragas", "TruLens", "Docker", "Kubernetes"],
      },
    ],
    caseStudy: {
      quote: "« Le POC RAG était opérationnel en 5 semaines. Aujourd'hui, notre moteur interne traite plus de 15 000 requêtes documentaires par jour avec une précision remarquable et sans aucun incident de sécurité. »",
      authorRole: "Directeur des Systèmes d'Information",
      authorCompany: "Groupe Financier International (850 collaborateurs)",
      metricValue: "-64%",
      metricLabel: "Temps moyen d'accès à l'information critique",
    },
    faqs: [
      {
        question: "Mes données d'entreprise restent-elles confidentielles et souveraines ?",
        answer: "Absolument. Nous privilégions des architectures déployables en cloud souverain certifié SecNumCloud (OVHcloud, Scaleway, Outscale) ou on-premise. Vos données ne sont jamais utilisées pour entraîner des modèles publics tiers.",
      },
      {
        question: "Comment garantissez-vous l'absence d'hallucinations dans les réponses ?",
        answer: "Nous mettons en place un RAG strict avec citations obligatoires au niveau du paragraphe, couplé à un système de score de confiance. Si la réponse n'est pas étayée à 100% par vos documents sources, le système s'abstient et remonte une alerte.",
      },
      {
        question: "Combien de temps faut-il pour obtenir un premier résultat mesurable ?",
        answer: "Un prototype fonctionnel (POC) est livré et testable par vos équipes métier en 4 à 6 semaines sur vos données réelles. L'industrialisation complète suit un plan itératif de 6 à 8 semaines sans effet tunnel.",
      },
      {
        question: "Comment le système s'intègre-t-il à notre SI existant ?",
        answer: "Par des APIs REST et GraphQL sécurisées, des connecteurs documentaires standards (SharePoint, Google Drive, Confluence, ERP, bases SQL) ou des intégrations directes dans vos outils métiers (Teams, Slack, CRM).",
      },
    ],
    nextService: {
      index: "02",
      title: "Automatisation & Workflows",
    },
  },

  "02": {
    index: "02",
    slug: "automatisation-workflows",
    icon: Workflow,
    iconEmoji: "⚙️",
    accentColor: "#38BDF8",
    accentSoft: "rgba(56, 189, 248, 0.12)",
    badge: "HAUTE RÉSILIENCE",
    eyebrow: "SERVICE 02 — WORKFLOWS & AUTOMATISATION CRITIQUE",
    heroTitle: "Automatisation",
    heroAccent: "& Workflows Métiers",
    heroSubtitle:
      "Orchestrez vos processus opérationnels de bout en bout : synchronisation multi-systèmes, traitement intelligent de documents et automatisation résiliente sans dépendance aux tâches manuelles.",
    proofMetrics: [
      {
        value: "8 500 h",
        label: "HEURES ÉCONOMISÉES / AN",
        context: "Moyenne constatée sur nos déploiements d'automatisation des flux administratifs et financiers.",
        color: "#38BDF8",
      },
      {
        value: "99.98 %",
        label: "FIABILITÉ D'EXÉCUTION",
        context: "Taux de réussite des jobs automatisés avec gestion des reprises sur erreur et idempotence.",
        color: "#33D6A6",
      },
      {
        value: "1 204",
        label: "PROCESSUS EN PRODUCTION",
        context: "Flux métiers critiques exécutés quotidiennement sans intervention humaine répétitive.",
        color: "#4C82FF",
      },
    ],

    painPoints: [
      {
        title: "Ressaisie manuelle et erreurs humaines coûteuses",
        description: "Vos collaborateurs perdent jusqu'à 35% de leur temps à copier-coller des données entre votre CRM, votre ERP, vos outils de facturation et Excel.",
      },
      {
        title: "Goulots d'étranglement et retards de traitement",
        description: "Des processus qui ralentissent dès que le volume augmente ou qu'une personne clé est absente, impactant directement vos clients.",
      },
      {
        title: "Scripts fragiles et échecs silencieux",
        description: "Des automatisations 'bricolées' qui tombent en panne sans alerte dès qu'une API externe ou un format de fichier est modifié.",
      },
      {
        title: "Manque d'auditabilité et de conformité",
        description: "L'impossibilité de savoir qui a fait quoi, quand et comment, créant des failles de sécurité et des non-conformités réglementaires.",
      },
    ],
    deliverables: [
      {
        number: "01",
        title: "Cartographie & Audit des processus",
        description: "Diagnostic approfondi des flux de travail existants, identification des goulets d'étranglement et matrice de priorité ROI.",
        output: "Schéma BPMN & Plan d'automatisation priorisé",
      },
      {
        number: "02",
        title: "Orchestration & Workflows résilients",
        description: "Développement d'automates robustes avec gestion native des erreurs, reprises sur incident, déduplication et idempotence.",
        output: "Workflows n8n/Temporal déployés & documentés",
      },
      {
        number: "03",
        title: "Connecteurs & Intégrations sur-mesure",
        description: "Connexion sécurisée de vos applications métiers, systèmes legacy et APIs tierces sans rupture opérationnelle.",
        output: "Connecteurs sécurisés & Webhooks monitorés",
      },
      {
        number: "04",
        title: "Console de supervision & Alerting",
        description: "Mise en place de dashboards de suivi d'exécution en temps réel et alertes intelligentes (Slack, Teams, Email) en cas d'anomalie.",
        output: "Console de monitoring & Procédures de run",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "Diagnostic & Cadrage",
        description: "Analyse des flux manuels, définition des règles de gestion et estimation des gains en temps/coûts.",
        duration: "1–2 semaines",
        deliverable: "Spécification fonctionnelle & Matrice de gains",
      },
      {
        step: "02",
        title: "Construction & Connecteurs",
        description: "Développement des workflows sous n8n/Temporal et création des connecteurs API sécurisés.",
        duration: "3–5 semaines",
        deliverable: "Workflows en environnement de staging",
      },
      {
        step: "03",
        title: "Recette & Sécurisation",
        description: "Tests de charge, simulation de pannes et validation par les équipes opérationnelles.",
        duration: "2–3 semaines",
        deliverable: "Rapport de recette & Validation go/no-go",
      },
      {
        step: "04",
        title: "Déploiement & Run",
        description: "Mise en production progressive, supervision active des jobs et optimisation continue.",
        duration: "Continu",
        deliverable: "Supervision 24/7 & Maintenance proactive",
      },
    ],
    sectorCases: [
      {
        sector: "E-COMMERCE & LOGISTIQUE",
        title: "Automatisation du cycle commande-livraison-facture",
        description: "Synchronisation temps réel entre marketplace, WMS (gestion d'entrepôt), transporteurs et logiciel comptable.",
        impact: "-75% de délai de traitement des commandes",
      },
      {
        sector: "SERVICES PROFESSIONNELS",
        title: "Onboarding client automatisé & KYC",
        description: "Collecte, vérification automatique des pièces d'identité et génération contractuelle sans saisie manuelle.",
        impact: "Cycle d'onboarding réduit de 5 jours à 15 minutes",
      },
      {
        sector: "COMPTABILITÉ & FINANCE",
        title: "Rapprochement bancaire & Traitement factures",
        description: "Extraction OCR intelligente, rapprochement automatique avec les bons de commande et génération des écritures.",
        impact: "8 000 factures traitées/mois à 99.4% sans intervention",
      },
    ],
    techStackGroups: [
      {
        category: "ORCHESTRATION & WORKFLOWS",
        technologies: ["n8n Enterprise", "Temporal.io", "Apache Airflow", "Make"],
      },
      {
        category: "LANGAGES & APIS",
        technologies: ["Python (FastAPI)", "TypeScript", "Node.js", "GraphQL"],
      },
      {
        category: "MESSAGING & QUEUES",
        technologies: ["RabbitMQ", "Redis Streams", "Apache Kafka", "AWS SQS"],
      },
      {
        category: "MONITORING & ALERTING",
        technologies: ["Prometheus", "Grafana", "Sentry", "Better Stack"],
      },
    ],
    caseStudy: {
      quote: "« Grâce à l'automatisation de nos flux logistiques, nous avons absorbé une croissance de volume de +45% sans recruter de personnel administratif supplémentaire. Le ROI a été atteint en moins de 4 mois. »",
      authorRole: "Directeur des Opérations (COO)",
      authorCompany: "Plateforme E-commerce & Logistique (200 collaborateurs)",
      metricValue: "-72%",
      metricLabel: "Temps de traitement des commandes et factures",
    },
    faqs: [
      {
        question: "Que se passe-t-il si une API externe tombe en panne ou modifie son format ?",
        answer: "Nos architectures intègrent des files d'attente (queues) persistantes et des politiques de retry automatique avec backoff exponentiel. En cas d'erreur persistante, les requêtes sont isolées en 'Dead Letter Queue' et une alerte est émise sans bloquer les autres flux.",
      },
      {
        question: "L'outil n8n peut-il être hébergé sur nos propres serveurs ?",
        answer: "Oui, nous déployons n8n en version conteneurisée sur votre propre infrastructure cloud ou sur vos serveurs on-premise, garantissant une isolation totale et le respect absolu de votre souveraineté.",
      },
      {
        question: "Comment gérez-vous les validations humaines obligatoires ?",
        answer: "Nous intégrons des étapes de validation 'Human-in-the-loop' interactives. Un responsable reçoit une notification (Slack, Teams, Email) avec boutons d'approbation en 1 clic pour valider les étapes critiques.",
      },
      {
        question: "Combien de temps dure un projet d'automatisation typique ?",
        answer: "Un premier lot de workflows prioritaires est opérationnel en 3 à 5 semaines. L'approche est modulaire : chaque processus livre de la valeur mesurable dès sa mise en production.",
      },
    ],
    nextService: {
      index: "03",
      title: "Orchestration Multi-Agents",
    },
  },

  "03": {
    index: "03",
    slug: "orchestration-multi-agents",
    icon: Bot,
    iconEmoji: "🤖",
    accentColor: "#10B981",
    accentSoft: "rgba(16, 185, 129, 0.12)",
    badge: "SYSTÈMES AGENTIQUES",
    eyebrow: "SERVICE 03 — AGENTS COGNITIFS & OUTILLAGE DYNAMIQUE",
    heroTitle: "Orchestration",
    heroAccent: "Multi-Agents",
    heroSubtitle:
      "Déployez des équipes d'agents IA autonomes capables de décomposer des problèmes complexes, de planifier leurs actions, d'utiliser des outils métiers dynamiques et de collaborer sous supervision humaine.",
    proofMetrics: [
      {
        value: "87 %",
        label: "AUTONOMIE D'EXÉCUTION",
        context: "Taux de tâches multi-étapes résolues de bout en bout sans intervention humaine intermédiaire.",
        color: "#10B981",
      },
      {
        value: "312",
        label: "AGENTS EN PRODUCTION",
        context: "Agents cognitifs spécialisés actifs sur des missions de support, d'analyse et d'ingénierie.",
        color: "#33D6A6",
      },
      {
        value: "4 sem.",
        label: "LIVRAISON DU COLLECTIF",
        context: "Mise en service d'un collectif d'agents interconnecté à vos outils métiers et APIs.",
        color: "#38BDF8",
      },
    ],

    painPoints: [
      {
        title: "Les limites des prompts simples sur les processus longs",
        description: "Un LLM standard perd le contexte, oublie des consignes ou produit des résultats incohérents sur des tâches nécessitant plus de 3 ou 4 étapes de raisonnement.",
      },
      {
        title: "Absence de mémoire persistante et d'apprentissage",
        description: "Vos assistants repartent de zéro à chaque session, sans conserver la mémoire des règles métiers, des préférences ou des retours précédents.",
      },
      {
        title: "Incapacité à agir directement sur vos outils",
        description: "Des IA qui savent uniquement 'répondre à du texte' mais qui ne peuvent pas interroger une base, créer un ticket, lancer un calcul ou mettre à jour un ERP.",
      },
      {
        title: "Perte de contrôle et risque de boucle infinie",
        description: "La crainte légitime de laisser des agents autonomes exécuter des actions incontrôlées sans garde-fous ni supervision humaine dans la boucle.",
      },
    ],
    deliverables: [
      {
        number: "01",
        title: "Matrice des Rôles & Architecture Cognitive",
        description: "Conception du collectif d'agents spécialisés (Planificateur, Chercheur, Rédacteur, Réviseur technique) avec contrats d'interface stricts.",
        output: "Graphe d'orchestration LangGraph & Spécification des rôles",
      },
      {
        number: "02",
        title: "Outillage Dynamique & Protocole MCP",
        description: "Connexion sécurisée des agents à vos outils et APIs métiers via le Model Context Protocol (MCP) et Function Calling avancé.",
        output: "Serveurs MCP d'entreprise & Connecteurs d'outils",
      },
      {
        number: "03",
        title: "Mémoire Partagée & Contexte Long-Terme",
        description: "Implémentation d'une mémoire hiérarchique (court terme en session, long terme sémantique) pour un contexte métier persistant.",
        output: "Couche de mémoire Redis / Qdrant & Gestion d'état",
      },
      {
        number: "04",
        title: "Garde-fous & Console de Supervision",
        description: "Mécanismes de Human-in-the-loop sur les actions sensibles, circuit-breakers budgétaires et tracing complet des étapes de pensée.",
        output: "Tableau de bord de tracing Langfuse & Politiques de contrôle",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "Modélisation des Rôles",
        description: "Définition des personas d'agents, des limites d'autonomie et des protocoles d'interaction.",
        duration: "1–2 semaines",
        deliverable: "Spécification de l'architecture agentique",
      },
      {
        step: "02",
        title: "Implémentation des Graphes",
        description: "Développement des nœuds décisionnels sous LangGraph et intégration des outils MCP.",
        duration: "3–4 semaines",
        deliverable: "Graphes d'agents fonctionnels en environnement test",
      },
      {
        step: "03",
        title: "Évaluation & Alignement",
        description: "Stress-tests, simulation d'erreurs, calibration des garde-fous et validation humaine.",
        duration: "2–3 semaines",
        deliverable: "Rapport d'évaluation & Benchmarks d'autonomie",
      },
      {
        step: "04",
        title: "Mise en Production & Run",
        description: "Déploiement avec tracing complet, optimisation des coûts de tokens et ajustement continu.",
        duration: "Continu",
        deliverable: "Supervision continue & Évolution des compétences",
      },
    ],
    sectorCases: [
      {
        sector: "TECH & LOGICIEL",
        title: "Collectif d'agents de support technique N2/N3",
        description: "Triage automatique, reproduction de bugs, analyse des logs serveurs et proposition de correctifs de code sous validation ingénieur.",
        impact: "80% des tickets techniques qualifiés en < 4 min",
      },
      {
        sector: "JURIDIQUE & AUDIT",
        title: "Équipe d'agents de revue contractuelle",
        description: "Relecture croisée des clauses sensibles, identification des non-conformités et proposition d'amendements selon vos standards.",
        impact: "Temps d'audit de conformité divisé par 4",
      },
      {
        sector: "VENTE B2B & OPERATIONS",
        title: "Agent de prospection & qualification stratégique",
        description: "Recherche d'informations d'entreprises, synthèse des signaux d'achat et préparation d'angles de contact hyper-personnalisés.",
        impact: "+35% de taux de conversion sur leads qualifiés",
      },
    ],
    techStackGroups: [
      {
        category: "FRAMEWORKS AGENTIQUES",
        technologies: ["LangGraph", "CrewAI", "AutoGen", "Semantic Kernel"],
      },
      {
        category: "PROTOCOLES & OUTILS",
        technologies: ["Model Context Protocol (MCP)", "Function Calling", "OpenAPI", "Custom Tooling"],
      },
      {
        category: "MÉMOIRE & ÉTAT",
        technologies: ["Redis", "Qdrant", "Mem0", "PostgreSQL"],
      },
      {
        category: "TRACING & SÉCURITÉ",
        technologies: ["Langfuse", "Phoenix Arize", "OpenTelemetry", "Guardrails AI"],
      },
    ],
    caseStudy: {
      quote: "« Notre collectif de 4 agents spécialisés prend en charge la pré-qualification et le diagnostic de l'ensemble de nos tickets techniques. Nos ingénieurs peuvent enfin se concentrer sur l'innovation produit. »",
      authorRole: "Vice-Président Engineering",
      authorCompany: "Éditeur de logiciel SaaS B2B (180 collaborateurs)",
      metricValue: "87%",
      metricLabel: "Taux de qualification autonome au premier passage",
    },
    faqs: [
      {
        question: "Comment s'assurer que les agents ne tombent pas dans des boucles infinies ?",
        answer: "Nous utilisons des graphes acycliques orientés (DAG) avec LangGraph, intégrant des seuils de récursion maximaux (max_iterations) et des circuit-breakers automatiques pour garantir l'arrêt déterministe.",
      },
      {
        question: "L'intervention humaine est-elle obligatoire ?",
        answer: "Elle est entièrement configurable. Nous recommandons un modèle 'Human-in-the-loop' sur toutes les actions irréversibles (envoi d'email externe, modification de base de données, transaction financière).",
      },
      {
        question: "Quels modèles de langage utilisez-vous pour les agents ?",
        answer: "Nous adoptons une stratégie multi-modèles (Multi-LLM routing) : des modèles compacts et économiques pour les sous-tâches simples de classification, et des modèles de raisonnement avancé (Claude 3.5 Sonnet, GPT-4o) pour la planification stratégique.",
      },
      {
        question: "Comment évaluez-vous la fiabilité d'un collectif d'agents ?",
        answer: "Grâce à des suites de tests unitaires et d'intégration basées sur des cas réels (evals), mesurant le taux de succès, le respect des consignes, la latence et la consommation de tokens à chaque modification de prompt ou d'outil.",
      },
    ],
    nextService: {
      index: "04",
      title: "Data & Décision Augmentée",
    },
  },

  "04": {
    index: "04",
    slug: "data-decision-augmentee",
    icon: BarChart3,
    iconEmoji: "📊",
    accentColor: "#A855F7",
    accentSoft: "rgba(168, 85, 247, 0.12)",
    badge: "BUSINESS INTELLIGENCE",
    eyebrow: "SERVICE 04 — ANALYTIQUE MODERNE & DÉCISIONNEL AUGMENTÉ",
    heroTitle: "Data & Décision",
    heroAccent: "Augmentée par l'IA",
    heroSubtitle:
      "Unifiez vos silos de données pour piloter votre entreprise en temps réel : modélisation sémantique dbt, entrepôt cloud haute performance, dashboards exécutifs et requêtes en langage naturel sur vos bases métiers.",
    proofMetrics: [
      {
        value: "+18.4 %",
        label: "GAIN DE MARGE MOYEN",
        context: "Obtenu grâce à l'identification instantanée des dérives de coûts et des opportunités d'arbitrage.",
        color: "#A855F7",
      },
      {
        value: "640",
        label: "DASHBOARDS GOUVERNÉS",
        context: "Tableaux de bord opérationnels et financiers déployés avec rafraîchissement temps réel.",
        color: "#33D6A6",
      },
      {
        value: "120+",
        label: "SOURCES UNIFIÉES",
        context: "Connecteurs de données intégrés dans un modèle sémantique unique sans doublon.",
        color: "#4C82FF",
      },
    ],
    painPoints: [
      {
        title: "Des silos de données et des chiffres contradictoires",
        description: "Chaque service produit ses propres rapports avec des définitions différentes, générant des réunions de direction stériles sur la validité des chiffres.",
      },
      {
        title: "Des temps de calcul et rafraîchissements interminables",
        description: "Des requêtes SQL lentes sur des bases de production saturées, empêchant d'avoir une vision claire et instantanée de votre activité.",
      },
      {
        title: "Dépendance permanente aux équipes techniques",
        description: "Les décideurs métier attendent plusieurs semaines pour obtenir un simple tableau de bord ou une extraction de données spécifique.",
      },
      {
        title: "Pilotage rétroactif au lieu d'être proactif",
        description: "Vous découvrez les problèmes de marge ou de trésorerie avec un mois de retard lors de la clôture comptable au lieu d'être alerté en temps réel.",
      },
    ],
    deliverables: [
      {
        number: "01",
        title: "Audit Data & Modélisation Sémantique dbt",
        description: "Définition d'un référentiel de données unique (Single Source of Truth) avec documentation des métriques métiers et lignage clair.",
        output: "Modèles dbt documentés & Schéma en étoile",
      },
      {
        number: "02",
        title: "Modern Data Stack & Cloud Data Warehouse",
        description: "Déploiement ou optimisation de votre entrepôt de données (Snowflake, BigQuery, PostgreSQL) avec partitionnement performant.",
        output: "Entrepôt de données scalable & Pipelines ETL/ELT",
      },
      {
        number: "03",
        title: "Dashboards Exécutifs & Alerting Prédictif",
        description: "Conception de tableaux de bord Power BI / Looker ergonomiques et percutants avec alertes automatiques sur anomalies de KPI.",
        output: "Dashboards Power BI / Looker & Alertes temps réel",
      },
      {
        number: "04",
        title: "Interface Text-to-SQL & BI Augmentée",
        description: "Déploiement d'un agent d'interrogation en langage naturel permettant à vos équipes de 'discuter avec leurs données' en toute sécurité.",
        output: "Copilote analytique conversationnel sécurisé",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "Audit & Cadrage Métier",
        description: "Inventaire des sources de données, définition des KPIs directeurs et choix d'architecture analytique.",
        duration: "1–2 semaines",
        deliverable: "Spécification du modèle de données & Gouvernance",
      },
      {
        step: "02",
        title: "Ingestion & Modélisation dbt",
        description: "Mise en place des pipelines d'ingestion automatisés et transformation des tables avec tests de qualité des données.",
        duration: "4–6 semaines",
        deliverable: "Entrepôt de données opérationnel & Tests automatisés",
      },
      {
        step: "03",
        title: "Visualisation & Tableaux de Bord",
        description: "Design des dashboards de direction et paramétrage des accès sécurisés par rôle (RBAC).",
        duration: "3–4 semaines",
        deliverable: "Rapports interactifs & Validation utilisateurs",
      },
      {
        step: "04",
        title: "Self-Service & Formation",
        description: "Accompagnement des équipes à l'autonomie, ateliers de prise en main et optimisation des coûts d'entrepôt.",
        duration: "Continu",
        deliverable: "Ateliers d'adoption & Optimisation FinOps",
      },
    ],
    sectorCases: [
      {
        sector: "RETAIL & DISTRIBUTION",
        title: "Pilotage unifié des marges et prévision des stocks",
        description: "Consolidation des ventes omnicanales, détection des ruptures de stock et ajustement dynamique des réassorts.",
        impact: "+14% de marge brute et -22% de surstock",
      },
      {
        sector: "SERVICES FINANCIERS",
        title: "Consolidation financière & Cash-flow en temps réel",
        description: "Tableau de bord de trésorerie multi-filiales actualisé chaque heure avec projection des flux de trésorerie à 90 jours.",
        impact: "Délai de clôture réduit de 12 jours à 2 jours",
      },
      {
        sector: "INDUSTRIE & FABRICATION",
        title: "Supervision du TRS et performance machine",
        description: "Analyse des arrêts de ligne, calcul du Taux de Rendement Synthétique en direct et maintenance prédictive.",
        impact: "-18% d'arrêts non planifiés",
      },
    ],
    techStackGroups: [
      {
        category: "DATA WAREHOUSE",
        technologies: ["Snowflake", "Google BigQuery", "PostgreSQL", "ClickHouse"],
      },
      {
        category: "TRANSFORMATION & ELT",
        technologies: ["dbt (Data Build Tool)", "Apache Spark", "Airbyte", "Fivetran"],
      },
      {
        category: "VISUALISATION & BI",
        technologies: ["Power BI", "Looker", "Apache Superset", "Metabase"],
      },
      {
        category: "IA ANALYTIQUE",
        technologies: ["Text-to-SQL", "LangChain SQL Agent", "DuckDB", "Python"],
      },
    ],
    caseStudy: {
      quote: "« Notre comité de direction dispose enfin d'un tableau de bord financier unifié et certifié chaque matin à 8h. Nous avons supprimé 10 jours de travail manuel de consolidation par mois. »",
      authorRole: "Directeur Administratif et Financier (DAF)",
      authorCompany: "Groupe ETI Retail & Distribution (520 collaborateurs)",
      metricValue: "-83%",
      metricLabel: "Délai de production du reporting exécutif mensuel",
    },
    faqs: [
      {
        question: "Pouvons-nous réutiliser nos licences Power BI ou Looker existantes ?",
        answer: "Tout à fait. Nous nous intégrons à votre outillage existant en optimisant vos modèles de données pour accélérer le rendu des rapports et réduire vos coûts de licence.",
      },
      {
        question: "Comment garantissez-vous l'exactitude des calculs et des chiffres ?",
        answer: "Grâce à dbt, toutes les règles métier et transformations sont versionnées dans Git et soumises à des tests d'intégrité automatisés à chaque rafraîchissement. Si une incohérence apparaît, les données corrompues ne sont pas publiées.",
      },
      {
        question: "Combien coûte l'hébergement d'un entrepôt de données cloud comme Snowflake ou BigQuery ?",
        answer: "Nous configurons des politiques FinOps strictes : auto-suspension des clusters inactifs, partitionnement et clustering optimisés pour que vos coûts mensuels restent maîtrisés et proportionnels à votre usage réel.",
      },
      {
        question: "Les utilisateurs non techniques peuvent-ils vraiment créer leurs propres rapports ?",
        answer: "Oui, la couche sémantique dbt simplifie la structure de données pour les rendre compréhensibles. Nous proposons également un assistant Text-to-SQL permettant de poser des questions en français courant pour générer instantanément un graphique.",
      },
    ],
    nextService: {
      index: "01",
      title: "Raisonnement & RAG",
    },
  },
};

export const SERVICES_DETAIL_REGISTRY_EN: Record<string, ServiceDetailData> = {
  "01": {
    index: "01",
    slug: "reasoning-rag",
    icon: BrainCircuit,
    iconEmoji: "🧠",
    accentColor: "#F26D3D",
    accentSoft: "rgba(242, 109, 61, 0.12)",
    badge: "PRODUCTION READY",
    eyebrow: "SERVICE 01 — LLM, HIGH-PRECISION RAG & GUARDRAILS",
    heroTitle: "Artificial Intelligence",
    heroAccent: "& RAG Systems",
    heroSubtitle:
      "Production-grade LLM architectures built for enterprise reliability: dense/sparse hybrid retrieval, semantic reranking, continuous evaluation, and security guardrails for dependable corporate decision-making.",
    proofMetrics: [
      {
        value: "320 ms",
        label: "P95 RAG LATENCY",
        context: "Measured in production on a corpus of 40M+ heterogeneous documents (PDFs, SQL databases, OCR scans).",
        color: "#F26D3D",
      },
      {
        value: "94.2 %",
        label: "RESPONSE ACCURACY",
        context: "Continuous business benchmark score (Ragas & TruLens) validated through domain expert review.",
        color: "#33D6A6",
      },
      {
        value: "6 wks",
        label: "AVERAGE POC DURATION",
        context: "From raw unstructured data to a deployed prototype validated by your business teams.",
        color: "#4C82FF",
      },
    ],

    painPoints: [
      {
        title: "Demo POCs that never scale to production",
        description: "Attractive sandbox prototypes that collapse when faced with real volume, latency constraints, and enterprise security requirements.",
      },
      {
        title: "Hallucinations and loss of stakeholder trust",
        description: "Models generating plausible but false answers across critical contracts, internal policies, or operational documentation.",
      },
      {
        title: "Technical debt and unmonitored model drift",
        description: "Pipelines deployed without observability or drift metrics, where inference costs surge without verifiable ROI.",
      },
      {
        title: "Compliance risks and sensitive data leaks (PII)",
        description: "Lack of PII filtering and strict guardrails exposing your organisation to GDPR breaches and prompt injection attacks.",
      },
    ],
    deliverables: [
      {
        number: "01",
        title: "Architecture Audit & Data Mapping",
        description: "Exhaustive analysis of your document corpus, prioritization of high-value use cases, and business ROI evaluation matrix.",
        output: "Architecture Audit Report & Prioritized Roadmap",
      },
      {
        number: "02",
        title: "Hybrid RAG Pipeline & Ingestion Engine",
        description: "High-performance chunking, multi-modal embedding, dense/sparse vector index (Qdrant/Pinecone), and cross-encoder reranking.",
        output: "Scalable Ingestion Pipeline & Production Vector DB",
      },
      {
        number: "03",
        title: "Security Guardrails & PII Anonymization",
        description: "Real-time sanitization of personal data (PII), prompt injection shields, and factual verification before LLM response generation.",
        output: "Guardrails Middleware & Compliance Report",
      },
      {
        number: "04",
        title: "Continuous Evaluation & Synthetic Benchmark",
        description: "Automated test suites (faithfulness, answer relevance, context recall) running on CI/CD to prevent regressions.",
        output: "Ragas/TruLens Dashboard & Automated CI/CD Evals",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "Audit & Framing",
        description: "Corpus analysis, definition of success metrics, and selection of models and vector infrastructure.",
        duration: "1–2 weeks",
        deliverable: "Architecture Blueprint & Business Benchmark",
      },
      {
        step: "02",
        title: "Prototyping & Hybrid Indexing",
        description: "Deployment of vector index, chunking optimization, and initial retrieval experiments.",
        duration: "2–3 weeks",
        deliverable: "Working RAG Prototype & Accuracy Report",
      },
      {
        step: "03",
        title: "Guardrails & Integration",
        description: "Integration of security filters, enterprise APIs, and user interface connection.",
        duration: "2–3 weeks",
        deliverable: "Hardened Pipeline in Staging Environment",
      },
      {
        step: "04",
        title: "Production & Monitoring",
        description: "Progressive deployment, token cost optimization, and real-time observability setup.",
        duration: "Ongoing",
        deliverable: "Production Release & Live Monitoring Console",
      },
    ],
    sectorCases: [
      {
        sector: "BANKING & FINANCE",
        title: "Financial Analysis & Compliance Assistant",
        description: "Instant analysis of thousands of annual reports (10-K, ESG, audit notes) with deterministic citation of sources.",
        impact: "70% reduction in financial research time",
      },
      {
        sector: "HEALTHCARE & PHARMA",
        title: "Clinical Protocol & Research Query Engine",
        description: "Semantic query engine across thousands of medical studies and clinical trial registries with zero hallucinations.",
        impact: "Search time cut from 4 hours to under 30 seconds",
      },
      {
        sector: "LEGAL & INSURANCE",
        title: "Automated Policy Comparison & Claims Review",
        description: "Automated clause matching across multi-party insurance contracts and regulatory compliance checking.",
        impact: "Claims processing accelerated by 4x",
      },
    ],
    techStackGroups: [
      {
        category: "LLM & ORCHESTRATION",
        technologies: ["LangGraph", "LangChain", "LlamaIndex", "vLLM", "Hugging Face"],
      },
      {
        category: "VECTOR DATABASES",
        technologies: ["Qdrant", "Pinecone", "pgvector (PostgreSQL)", "ChromaDB"],
      },
      {
        category: "EMBEDDINGS & RERANKERS",
        technologies: ["Cohere Rerank v3", "OpenAI text-embedding-3", "BGE-Large", "Voyage AI"],
      },
      {
        category: "EVALUATION & OBSERVABILITY",
        technologies: ["Ragas", "TruLens", "Langfuse", "OpenTelemetry", "Phoenix"],
      },
    ],
    caseStudy: {
      quote: "“Analyticatech’s RAG architecture enabled us to index 15 years of technical documentation with zero hallucination. Our support engineers save over 12 hours every week.”",
      authorRole: "Chief Technology Officer (CTO)",
      authorCompany: "European Fintech Leader (350+ staff)",
      metricValue: "94.2%",
      metricLabel: "Measured response accuracy on production queries",
    },
    faqs: [
      {
        question: "How do you guarantee our proprietary data is never used to train external models?",
        answer: "We only deploy zero-data-retention enterprise APIs or sovereign self-hosted open-weights models (Mistral, Llama) within your private VPC with strict encryption at rest and in transit.",
      },
      {
        question: "What is the difference between simple search and high-precision RAG?",
        answer: "Standard keyword search returns document links. Our RAG engine extracts dense semantic meaning, compares multiple candidate chunks, cross-checks facts with citations, and generates verified syntheses.",
      },
      {
        question: "How does the system integrate with our existing enterprise IT?",
        answer: "Through secured REST and GraphQL APIs, standard connectors (SharePoint, Google Drive, Confluence, SQL databases), and native integrations within your business workspaces (Teams, Slack, CRM).",
      },
    ],
    nextService: {
      index: "02",
      title: "Automation & Workflows",
    },
  },

  "02": {
    index: "02",
    slug: "automation-workflows",
    icon: Workflow,
    iconEmoji: "⚙️",
    accentColor: "#38BDF8",
    accentSoft: "rgba(56, 189, 248, 0.12)",
    badge: "HIGH RESILIENCE",
    eyebrow: "SERVICE 02 — MISSION-CRITICAL AUTOMATION & WORKFLOWS",
    heroTitle: "Enterprise Automation",
    heroAccent: "& Business Workflows",
    heroSubtitle:
      "Orchestrate your operational processes end-to-end: multi-system synchronization, intelligent document processing, and fault-tolerant automation without manual bottlenecks.",
    proofMetrics: [
      {
        value: "8,500 h",
        label: "HOURS SAVED / YEAR",
        context: "Average measured across our administrative and financial workflow deployments.",
        color: "#38BDF8",
      },
      {
        value: "99.98 %",
        label: "EXECUTION RELIABILITY",
        context: "Success rate across automated jobs with native idempotence and automated retry handling.",
        color: "#33D6A6",
      },
      {
        value: "1,204",
        label: "PROCESSES IN PRODUCTION",
        context: "Critical business workflows executing daily without repetitive human intervention.",
        color: "#4C82FF",
      },
    ],
    painPoints: [
      {
        title: "Manual data re-entry and costly human errors",
        description: "Teams spending up to 35% of their working hours copy-pasting data across CRM, ERP, invoicing software, and spreadsheets.",
      },
      {
        title: "Operational bottlenecks and processing delays",
        description: "Workflows slowing down whenever volumes surge or key personnel are out of office, directly impacting client satisfaction.",
      },
      {
        title: "Fragile scripts and silent failures",
        description: "Brittle custom scripts breaking without alerting whenever a third-party API or document schema changes.",
      },
      {
        title: "Lack of auditability and compliance trails",
        description: "Inability to track who performed what action, creating security risks and compliance vulnerabilities.",
      },
    ],
    deliverables: [
      {
        number: "01",
        title: "Process Audit & Value Mapping",
        description: "Comprehensive diagnostic of existing operational workflows, identification of bottlenecks, and prioritized ROI matrix.",
        output: "BPMN Process Diagrams & Prioritized Automation Plan",
      },
      {
        number: "02",
        title: "Resilient Workflow Orchestration",
        description: "Robust automation pipelines with native error handling, incident recovery, deduplication, and idempotence.",
        output: "Documented n8n/Temporal Workflows in Staging & Prod",
      },
      {
        number: "03",
        title: "Custom Enterprise Connectors",
        description: "Secure connectivity across your proprietary tools, legacy software, and third-party APIs.",
        output: "Hardened Connectors & Monitored Webhooks",
      },
      {
        number: "04",
        title: "Supervision Console & Smart Alerting",
        description: "Real-time execution dashboards and intelligent anomaly alerts (Slack, Teams, Email).",
        output: "Live Monitoring Console & Runbook Procedures",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "Diagnostic & Scoping",
        description: "Manual workflow mapping, business logic definition, and cost/time savings estimation.",
        duration: "1–2 weeks",
        deliverable: "Functional Specs & ROI Matrix",
      },
      {
        step: "02",
        title: "Build & Connector Setup",
        description: "Pipeline development under n8n/Temporal and creation of secure API connectors.",
        duration: "3–5 weeks",
        deliverable: "Staging Automated Workflows",
      },
      {
        step: "03",
        title: "UAT & Fault-Tolerance Testing",
        description: "Load testing, failure simulation, and end-user team validation.",
        duration: "2–3 weeks",
        deliverable: "Acceptance Report & Go/No-Go Validation",
      },
      {
        step: "04",
        title: "Deployment & Proactive Run",
        description: "Gradual production rollout, active job monitoring, and continuous pipeline optimization.",
        duration: "Ongoing",
        deliverable: "24/7 Monitoring & Proactive Maintenance",
      },
    ],
    sectorCases: [
      {
        sector: "E-COMMERCE & LOGISTICS",
        title: "Order-to-Cash End-to-End Automation",
        description: "Real-time synchronization between marketplaces, warehouse systems (WMS), carriers, and accounting.",
        impact: "-75% order processing lead time",
      },
      {
        sector: "PROFESSIONAL SERVICES",
        title: "Automated Client Onboarding & KYC",
        description: "Automated document gathering, ID verification, and contract generation without manual touchpoints.",
        impact: "Onboarding cycle reduced from 5 days to 15 minutes",
      },
      {
        sector: "ACCOUNTING & FINANCE",
        title: "Bank Reconciliation & Invoice Processing",
        description: "Intelligent OCR extraction, automatic matching with purchase orders, and ledger booking.",
        impact: "8,000 invoices/month processed at 99.4% touchless rate",
      },
    ],
    techStackGroups: [
      {
        category: "ORCHESTRATION & WORKFLOWS",
        technologies: ["n8n Enterprise", "Temporal.io", "Apache Airflow", "Make"],
      },
      {
        category: "LANGUAGES & APIS",
        technologies: ["Python (FastAPI)", "TypeScript", "Node.js", "GraphQL"],
      },
      {
        category: "MESSAGING & QUEUES",
        technologies: ["RabbitMQ", "Redis Streams", "Apache Kafka", "AWS SQS"],
      },
      {
        category: "MONITORING & ALERTING",
        technologies: ["Prometheus", "Grafana", "Sentry", "Better Stack"],
      },
    ],
    caseStudy: {
      quote: "“By automating our order and logistics pipelines, we absorbed a +45% volume growth without adding headcount. We achieved full ROI in under 4 months.”",
      authorRole: "Chief Operating Officer (COO)",
      authorCompany: "E-Commerce & Logistics Leader (200+ employees)",
      metricValue: "-72%",
      metricLabel: "Order and invoice processing turnaround time",
    },
    faqs: [
      {
        question: "What happens if a third-party API goes down or changes its format?",
        answer: "Our architectures integrate persistent queues and exponential backoff retry policies. Persistent errors route to a Dead Letter Queue and alert operators without stalling healthy workflows.",
      },
      {
        question: "Can n8n or Temporal be hosted on our private cloud or on-premise servers?",
        answer: "Yes, we deploy containerized architectures directly within your private cloud (AWS, Azure, GCP, Scaleway) or on-premise infrastructure with full data sovereign isolation.",
      },
      {
        question: "How do you handle required human sign-offs?",
        answer: "We embed interactive Human-in-the-Loop checkpoints. Designated managers receive instant notifications (Slack, Teams, Email) with one-click approval buttons.",
      },
    ],
    nextService: {
      index: "03",
      title: "Multi-Agent Orchestration",
    },
  },

  "03": {
    index: "03",
    slug: "multi-agent-orchestration",
    icon: Bot,
    iconEmoji: "🤖",
    accentColor: "#10B981",
    accentSoft: "rgba(16, 185, 129, 0.12)",
    badge: "AGENTIC SYSTEMS",
    eyebrow: "SERVICE 03 — COGNITIVE AGENTS & DYNAMIC TOOLING",
    heroTitle: "Multi-Agent",
    heroAccent: "Orchestration",
    heroSubtitle:
      "Deploy teams of autonomous AI agents capable of planning, reasoning, calling dynamic tools, and collaborating under human supervision to solve complex multi-step workflows.",
    proofMetrics: [
      {
        value: "87 %",
        label: "AUTONOMOUS COMPLETION",
        context: "Rate of complex multi-step tasks resolved end-to-end without intermediate manual correction.",
        color: "#10B981",
      },
      {
        value: "312",
        label: "AGENTS IN PRODUCTION",
        context: "Specialized cognitive agents actively assisting in engineering, support, and business analysis.",
        color: "#33D6A6",
      },
      {
        value: "4 wks",
        label: "AGENT FLEET DELIVERY",
        context: "From role modeling to operational agents connected to your corporate tools and APIs.",
        color: "#38BDF8",
      },
    ],

    painPoints: [
      {
        title: "Limits of single-prompt interactions on complex tasks",
        description: "Standard LLM prompts lose context, omit constraints, and yield inconsistent outputs on tasks requiring multi-step planning.",
      },
      {
        title: "Lack of persistent memory and domain learning",
        description: "Assistants starting from zero every session, forgetting business rules, past feedback, and team preferences.",
      },
      {
        title: "Inability to take concrete action in enterprise tools",
        description: "Models that can only generate text without the ability to query databases, file tickets, execute calculations, or trigger ERP updates.",
      },
      {
        title: "Loss of control and risk of runaway execution loops",
        description: "Legitimate concern over letting autonomous agents act without strict guardrails, budget limits, or human-in-the-loop oversight.",
      },
    ],
    deliverables: [
      {
        number: "01",
        title: "Role Matrix & Cognitive Architecture",
        description: "Design of specialized agent teams (Planner, Researcher, Drafter, Technical Reviewer) with explicit interface contracts.",
        output: "LangGraph Orchestration Graph & Role Specifications",
      },
      {
        number: "02",
        title: "Dynamic Tooling & Model Context Protocol (MCP)",
        description: "Secure connections between agents and enterprise APIs using MCP and advanced function calling.",
        output: "Enterprise MCP Servers & Custom Tool Connectors",
      },
      {
        number: "03",
        title: "Shared Memory & Long-Term Context",
        description: "Implementation of hierarchical memory (short-term session state, long-term semantic storage) for persistent business context.",
        output: "Redis / Qdrant Memory Layer & State Managers",
      },
      {
        number: "04",
        title: "Guardrails & Supervision Console",
        description: "Human-in-the-loop mechanisms for sensitive operations, budget circuit-breakers, and full reasoning step tracing.",
        output: "Langfuse Observability Dashboard & Policy Enforcers",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "Role Modeling & Scoping",
        description: "Defining agent personas, autonomy limits, and interaction protocols.",
        duration: "1–2 weeks",
        deliverable: "Agent Architecture Specifications",
      },
      {
        step: "02",
        title: "Graph Implementation",
        description: "Developing LangGraph decision nodes and integrating MCP tooling.",
        duration: "3–4 weeks",
        deliverable: "Functional Agent Graphs in Staging",
      },
      {
        step: "03",
        title: "Evaluation & Alignment",
        description: "Stress testing, failure simulations, guardrail calibration, and user validation.",
        duration: "2–3 weeks",
        deliverable: "Evaluation Benchmark & Autonomy Report",
      },
      {
        step: "04",
        title: "Production Rollout & Run",
        description: "Deployment with complete tracing, token optimization, and continuous skill refinement.",
        duration: "Ongoing",
        deliverable: "24/7 Supervision & Capability Evolution",
      },
    ],
    sectorCases: [
      {
        sector: "TECH & SAAS",
        title: "Tier 2/3 Technical Support Fleet",
        description: "Automated triage, bug reproduction, server log analysis, and code fix proposals under engineer validation.",
        impact: "80% of technical tickets qualified in < 4 minutes",
      },
      {
        sector: "LEGAL & AUDIT",
        title: "Contract Review & Analysis Collective",
        description: "Cross-reviewing clauses, detecting non-compliance, and drafting amendment suggestions based on company guidelines.",
        impact: "Audit turnaround time divided by 4",
      },
      {
        sector: "B2B SALES & OPS",
        title: "Strategic Prospecting & Lead Enrichment Agent",
        description: "Company research, buying signal synthesis, and preparation of hyper-tailored outreach briefs.",
        impact: "+35% conversion rate on qualified opportunities",
      },
    ],
    techStackGroups: [
      {
        category: "AGENT FRAMEWORKS",
        technologies: ["LangGraph", "CrewAI", "AutoGen", "Semantic Kernel"],
      },
      {
        category: "PROTOCOLS & TOOLING",
        technologies: ["Model Context Protocol (MCP)", "Function Calling", "OpenAPI", "Custom Tooling"],
      },
      {
        category: "MEMORY & STATE",
        technologies: ["Redis", "Qdrant", "Mem0", "PostgreSQL"],
      },
      {
        category: "TRACING & SECURITY",
        technologies: ["Langfuse", "Phoenix Arize", "OpenTelemetry", "Guardrails AI"],
      },
    ],
    caseStudy: {
      quote: "“Our team of 4 specialized agents handles the pre-qualification and root-cause analysis for all incoming technical tickets. Our senior engineers can finally focus on product innovation.”",
      authorRole: "VP of Engineering",
      authorCompany: "B2B SaaS Software Provider (180+ employees)",
      metricValue: "87%",
      metricLabel: "First-pass autonomous ticket qualification rate",
    },
    faqs: [
      {
        question: "How do you prevent agents from falling into infinite execution loops?",
        answer: "We use directed acyclic graphs (DAGs) in LangGraph with hard recursion limits (max_iterations) and automatic circuit-breakers ensuring deterministic completion.",
      },
      {
        question: "Is human validation mandatory?",
        answer: "It is completely configurable. We recommend a strict Human-in-the-Loop policy for irreversible actions (external emails, DB mutations, financial operations).",
      },
      {
        question: "What language models power the agent fleet?",
        answer: "We use dynamic multi-LLM routing: compact and cost-effective models for fast classification, paired with frontier reasoning models (Claude 3.5 Sonnet, GPT-4o) for high-level strategy.",
      },
    ],
    nextService: {
      index: "04",
      title: "Data & Augmented Decision",
    },
  },

  "04": {
    index: "04",
    slug: "data-augmented-decision",
    icon: BarChart3,
    iconEmoji: "📊",
    accentColor: "#A855F7",
    accentSoft: "rgba(168, 85, 247, 0.12)",
    badge: "BUSINESS INTELLIGENCE",
    eyebrow: "SERVICE 04 — MODERN ANALYTICS & AI-AUGMENTED DECISION MAKING",
    heroTitle: "Data & Augmented",
    heroAccent: "Decision-Making",
    heroSubtitle:
      "Unify disparate data silos to steer your organization in real time: dbt semantic modeling, cloud data warehousing, executive dashboards, and secure natural language queries over business data.",
    proofMetrics: [
      {
        value: "+18.4 %",
        label: "AVERAGE MARGIN GAIN",
        context: "Achieved through real-time detection of cost overruns and dynamic pricing arbitrage.",
        color: "#A855F7",
      },
      {
        value: "640",
        label: "GOVERNED DASHBOARDS",
        context: "Operational and financial dashboards deployed with real-time automated refresh.",
        color: "#33D6A6",
      },
      {
        value: "120+",
        label: "UNIFIED SOURCES",
        context: "Enterprise data connectors integrated into a single source of truth without duplicates.",
        color: "#4C82FF",
      },
    ],
    painPoints: [
      {
        title: "Isolated data silos and conflicting numbers",
        description: "Departments computing independent reports with conflicting definitions, leading to unproductive debates over metric validity.",
      },
      {
        title: "Sluggish queries and painful data refreshes",
        description: "Slow SQL queries overloading production databases, hindering instant operational visibility.",
      },
      {
        title: "Permanent dependence on technical teams",
        description: "Business stakeholders waiting weeks for simple dashboard edits or custom data extracts.",
      },
      {
        title: "Reactive steering instead of predictive action",
        description: "Discovering margin erosion or cash flow issues weeks after month-end close instead of receiving real-time alerts.",
      },
    ],
    deliverables: [
      {
        number: "01",
        title: "Data Audit & dbt Semantic Modeling",
        description: "Establishing a documented Single Source of Truth with business metrics definitions and full data lineage.",
        output: "Documented dbt Models & Star-Schema Data Marts",
      },
      {
        number: "02",
        title: "Modern Data Stack & Cloud Warehouse",
        description: "Deployment or tuning of your cloud data warehouse (Snowflake, BigQuery, PostgreSQL) with optimized partitioning.",
        output: "Scalable Data Warehouse & Automated ELT Pipelines",
      },
      {
        number: "03",
        title: "Executive Dashboards & Predictive Alerts",
        description: "High-impact Power BI / Looker dashboards with automated threshold anomaly notifications.",
        output: "Live Power BI / Looker Dashboards & Instant Alerts",
      },
      {
        number: "04",
        title: "Text-to-SQL & Augmented Analytics",
        description: "Secure natural-language copilots allowing teams to ask business questions and generate instant charts.",
        output: "Secure Conversational BI Copilot",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "Business Scoping & Audit",
        description: "Data source inventory, core KPI definition, and analytics architecture selection.",
        duration: "1–2 weeks",
        deliverable: "Data Governance & Architecture Roadmap",
      },
      {
        step: "02",
        title: "Ingestion & dbt Modeling",
        description: "Building automated data pipelines and transformation models with continuous data quality tests.",
        duration: "4–6 weeks",
        deliverable: "Operational Data Warehouse & Data Tests",
      },
      {
        step: "03",
        title: "Visualization & Dashboarding",
        description: "Designing executive dashboards with role-based access control (RBAC).",
        duration: "3–4 weeks",
        deliverable: "Interactive Dashboards & User Acceptance",
      },
      {
        step: "04",
        title: "Self-Service & Team Enablement",
        description: "Training teams for data autonomy, adoption workshops, and FinOps warehouse optimization.",
        duration: "Ongoing",
        deliverable: "Adoption Workshops & FinOps Tuning",
      },
    ],
    sectorCases: [
      {
        sector: "RETAIL & DISTRIBUTION",
        title: "Unified Margin Steering & Stock Forecasting",
        description: "Consolidating omnichannel sales, spotting stockout risks, and dynamically adjusting store replenishment.",
        impact: "+14% gross margin and -22% excess inventory",
      },
      {
        sector: "FINANCIAL SERVICES",
        title: "Real-Time Multi-Entity Cash Flow Consolidation",
        description: "Hourly cash flow dashboard with automated 90-day predictive liquidity projections.",
        impact: "Financial close timeline reduced from 12 to 2 days",
      },
      {
        sector: "MANUFACTURING & INDUSTRIAL",
        title: "OEE Monitoring & Machine Performance",
        description: "Real-time Overall Equipment Effectiveness tracking, line stoppage analysis, and predictive maintenance.",
        impact: "-18% unplanned machine downtime",
      },
    ],
    techStackGroups: [
      {
        category: "DATA WAREHOUSE",
        technologies: ["Snowflake", "Google BigQuery", "PostgreSQL", "ClickHouse"],
      },
      {
        category: "TRANSFORMATION & ELT",
        technologies: ["dbt (Data Build Tool)", "Apache Spark", "Airbyte", "Fivetran"],
      },
      {
        category: "VISUALIZATION & BI",
        technologies: ["Power BI", "Looker", "Apache Superset", "Metabase"],
      },
      {
        category: "AUGMENTED ANALYTICS",
        technologies: ["Text-to-SQL", "LangChain SQL Agent", "DuckDB", "Python"],
      },
    ],
    caseStudy: {
      quote: "“Our executive committee now relies on a single, certified financial dashboard every morning at 8:00 AM. We eliminated 10 days of manual spreadsheet consolidation each month.”",
      authorRole: "Chief Financial Officer (CFO)",
      authorCompany: "Retail & Distribution Group (520+ employees)",
      metricValue: "-83%",
      metricLabel: "Monthly executive financial reporting cycle time",
    },
    faqs: [
      {
        question: "Can we keep using our existing Power BI or Looker licenses?",
        answer: "Absolutely. We build directly upon your existing stack, optimizing underlying data models to accelerate render times and reduce licensing costs.",
      },
      {
        question: "How do you guarantee the accuracy of calculations and numbers?",
        answer: "Through dbt, all metric definitions and transformations are version-controlled in Git and verified by automated integrity tests before data publication.",
      },
      {
        question: "Can non-technical business users build their own reports?",
        answer: "Yes, our dbt semantic layer standardizes dimensions and metrics into plain business language, complemented by our Text-to-SQL copilot for natural query generation.",
      },
    ],
    nextService: {
      index: "01",
      title: "Reasoning & RAG",
    },
  },
};

/**
 * Récupère les données détaillées d'un service selon l'index et la locale active (FR ou EN).
 * Renvoie undefined si l'index n'existe pas dans le registre.
 */
export function getServiceDetailData(index: string, locale: string = "fr"): ServiceDetailData | undefined {
  const normalized = (index ?? "").trim().padStart(2, "0");
  const registry = locale === "en" ? SERVICES_DETAIL_REGISTRY_EN : SERVICES_DETAIL_REGISTRY;
  return registry[normalized];
}


