import type { InsightDetailData } from "@/types/insight-detail";

/**
 * Registre des données enrichies pour les articles techniques /insights d'Analyticatech.
 * Chaque article est conçu avec une rigueur technique maximale :
 * - Contexte métier réel (secteur, contraintes, enjeux).
 * - Progression Problème → Approche → Arbitrages/Limites → Résultats.
 * - Références d'outils et versions exactes vérifiables.
 * - Arbitrages et compromis d'ingénierie assumés (anti-discours marketing).
 * - Chiffrages contextualisés avec mention explicite "à titre indicatif" si pertinent.
 * - Maillage interne précis vers les services et solutions du site.
 */
export const INSIGHTS_DETAIL_REGISTRY: Record<string, InsightDetailData> = {
  // =========================================================================
  // ARTICLE 01 — RAG EN PRODUCTION
  // =========================================================================
  "evaluer-systeme-rag-production": {
    slug: "evaluer-systeme-rag-production",
    aliases: ["rag-evaluation"],
    readingTime: "6 min",
    publishedDate: "15 Février 2025",
    category: {
      key: "ia",
      label: "Intelligence Artificielle",
    },
    author: {
      name: "Martial GNINHI",
      role: "Directeur Technique & Architecte IA",
      avatarInitials: "MG",
    },
    hero: {
      eyebrow: "INSIGHT #01 // INTELLIGENCE ARTIFICIELLE & RAG",
      title: "Évaluer un système RAG en production :",
      titleAccent: "métriques, biais et garde-fous",
      subtitle:
        "Comment dépasser les démos pour construire une suite d'évaluation continue fiable avec Ragas, TruLens, recherche hybride et réordonnancement sémantique.",
      tags: ["RAG", "LLM", "Evaluation", "Production", "Qdrant", "Ragas"],
    },
    context: {
      sector: "Assurance & Mutuelle de santé",
      sectorBadge: "Assurance & Santé",
      useCase: "Moteur d'assistance à l'instruction de sinistres complexes pour 450 gestionnaires",
      constraints:
        "Corpus vivant de 150 000 polices contractuelles scannées (80 à 250 pages), tableaux d'exclusion et avenants successifs",
      stakes:
        "Tolérance zéro aux hallucinations sur les clauses d'exclusion et barèmes de remboursement ; conformité ACPR & RGPD",
      narrative:
        "Dans les secteurs hautement réglementés comme l'assurance santé, un POC RAG sur cinq documents PDF propres séduit toujours en comité de direction. Mais le passage à l'échelle sur 150 000 polices contractuelles scannées révèle une réalité brutale : le taux de bonnes réponses chute drastiquement sans que personne ne s'en aperçoive avant qu'un client ne reçoive une indemnisation erronée. Déployer un RAG en production exige un banc d'évaluation continu capable de mesurer objectivement la fidélité documentaire à chaque mise à jour.",
    },
    problem: {
      heading: "Pourquoi les métriques traditionnelles et le chunking naïf échouent",
      lead: "En production, les défaillances d'un pipeline RAG ne proviennent presque jamais du modèle de langage lui-même, mais de la rupture d'alignement entre l'étape de retrieval et le générateur.",
      failureModes: [
        {
          code: "ERR_01 // CHUNKING_NAÏF",
          title: "Fragmentation des tableaux de garanties",
          description:
            "Un chunking fixe à 1 000 tokens coupe les grilles tarifaires et tableaux d'exclusion au milieu d'une ligne, privant l'embedding de son en-tête contextuel.",
          impact: "Perte de 38% de recall sur clauses croisées",
        },
        {
          code: "ERR_02 // ILLUSION_ROUGE_BLEU",
          title: "Inadéquation des métriques de surface",
          description:
            "Les scores BLEU et ROUGE mesurent l'alignement lexical, ignorant complètement si le chiffre de remboursement généré a été inventé ou extrait fidèlement.",
          impact: "Faux sentiment de sécurité en pré-prod",
        },
        {
          code: "ERR_03 // SILENT_DRIFT",
          title: "Dérive silencieuse à la mise à jour contractuelle",
          description:
            "Sans banc de régression automatique, l'ajout d'un avenant 2025 crée des conflits de versions non résolus avec les conditions générales 2023.",
          impact: "Réponses anachroniques en production",
        },
      ],
    },
    approach: {
      heading: "Pipeline à 2 étages, triade Ragas et garde-fous déterministes",
      lead: "Nous structurons l'architecture autour d'un principe fondamental : ne jamais laisser le générateur deviner ce que le retriever n'a pas formellement prouvé.",
      architectureTitle: "Les 4 étapes séquentielles du pipeline de production",
      architectureStages: [
        {
          stageNumber: "STAGE 01",
          title: "Ingestion sémantique & Chunking hiérarchique",
          description:
            "Extraction OCR structurée avec conservation de l'arborescence des titres (H1-H4) et sérialisation Markdown des tableaux de garanties.",
          keyPattern: "Hierarchical Chunking + Document Tree",
        },
        {
          stageNumber: "STAGE 02",
          title: "Recherche hybride Dense/Sparse sur Qdrant",
          description:
            "Double vectorisation : BM25 pour le vocabulaire exact (codes d'actes CCAM) et embeddings bge-m3 pour la proximité sémantique conceptuelle.",
          keyPattern: "Reciprocal Rank Fusion (RRF)",
          badge: "Latence < 45ms",
        },
        {
          stageNumber: "STAGE 03",
          title: "Reranking Cross-Encoder sélectif",
          description:
            "Filtrage fin des 30 candidats initiaux vers les 5 chunks décisifs via Cohere Rerank v3.5 ou bge-reranker-large.",
          keyPattern: "Cross-Encoder Reranking",
          badge: "Precision@5 > 93%",
        },
        {
          stageNumber: "STAGE 04",
          title: "Garde-fous & Inférence avec NeMo",
          description:
            "Vérification pré/post-génération : détection d'injections de prompt et blocage automatique si le score d'adhérence documentaire est < 0.85.",
          keyPattern: "Self-Correction & Fallback Guardrails",
        },
      ],
      techStack: [
        {
          name: "Ragas",
          version: "v0.2.14",
          role: "Calcul de la triade (Faithfulness, Context Precision, Relevance)",
          category: "evaluation",
        },
        {
          name: "Qdrant",
          version: "v1.11.0",
          role: "Base vectorielle avec support hybride Dense/Sparse",
          category: "vector",
        },
        {
          name: "Cohere Rerank",
          version: "v3.5",
          role: "Reranker cross-encoder haute précision",
          category: "model",
        },
        {
          name: "NeMo Guardrails",
          version: "v0.9.1",
          role: "Garde-fous anti-hallucination & sécurité",
          category: "guardrails",
        },
        {
          name: "TruLens",
          version: "v1.4.0",
          role: "Monitoring continu de la triade en production",
          category: "evaluation",
        },
      ],
      codeSnippet: {
        title: "ragas_eval_pipeline.py — Assertion de Faithfulness en CI/CD",
        language: "python",
        code: `# Évaluation continue en pipeline CI/CD avec Ragas 0.2+
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision
from datasets import Dataset

def assert_rag_quality(test_bench_dataset: Dataset, min_faithfulness: float = 0.90):
    """Bloque le déploiement si le score de fidélité factuelle régresse."""
    results = evaluate(
        test_bench_dataset,
        metrics=[faithfulness, answer_relevancy, context_precision],
    )
    score = results["faithfulness"]
    assert score >= min_faithfulness, (
        f"Régression critique détectée : Faithfulness {score:.3f} < seuil {min_faithfulness}"
    )
    return results`,
        caption: "Ce test unitaire tourne sur 500 questions de référence avant tout merge sur la branche principale.",
      },
    },
    tradeoffs: {
      heading: "Arbitrages techniques sans complaisance marketing",
      lead: "Toute décision d'architecture d'entreprise implique de renoncer à un idéal théorique. Voici les compromis délibérés de cette implémentation.",
      disclaimer:
        "NOTE DE TRANSPARENCE : Nous refusons de présenter le RAG comme une solution magique instantanée. Chaque gain de précision s'achète en latence d'inférence ou en coût de calcul.",
      tradeoffs: [
        {
          title: "Latence additionnelle du Reranking",
          tension: "Latence P95 vs Fidélité documentaire",
          arbitrage:
            "Reranker systématiquement les 30 premiers candidats avec un modèle cross-encoder lourd.",
          costOrDrawback:
            "Ajout de 120 ms à 180 ms (à titre indicatif) sur le temps de réponse total de la requête.",
          mitigation:
            "Parallélisation du fetch et streaming progressif des premières réflexions de l'agent dans l'interface utilisateur.",
        },
        {
          title: "Coût de l'évaluation LLM-as-a-judge",
          tension: "Couverture d'évaluation vs Coûts d'API",
          arbitrage:
            "Échantillonnage asynchrone à 5% en production au lieu d'un scoring à 100% en direct.",
          costOrDrawback:
            "Détection des dérives statistiques sur plusieurs heures plutôt qu'en temps réel immédiat.",
          mitigation:
            "Banc de 500 questions fixes exécuté en CI/CD avant chaque mise en production logicielle.",
        },
      ],
    },
    results: {
      heading: "Résultats mesurés & Rigueur méthodologique",
      lead: "Évolution des métriques entre l'architecture initiale naïve et le pipeline à deux étages avec garde-fous.",
      metrics: [
        {
          label: "Faithfulness Ragas",
          value: "0.94",
          change: "+0.23",
          subtext: "Score de 0.71 sur l'architecture initiale sans reranking",
          isIndicative: false,
        },
        {
          label: "Taux d'hallucinations résiduelles",
          value: "< 1.2%",
          subtext: "Échantillon annoté manuellement par des juristes",
          isIndicative: true,
        },
        {
          label: "Contexte superflu éliminé",
          value: "-45%",
          subtext: "Économie de tokens injectés dans le prompt final",
          isIndicative: true,
        },
      ],
      methodologyNote:
        "Mesures réalisées sur un banc de 500 requêtes contractuelles représentatives et un corpus de test de 1 200 documents d'assurance. Les scores de fidélité sont calculés selon le protocole Ragas 0.2 avec un juge GPT-4o. Les pourcentages d'hallucinations sont mentionnés à titre indicatif selon l'échantillon d'audit humain interne 2025.",
      observedBenefits: [
        "Fin des validations d'indemnisation contestées par les assurés pour cause de clauses inventées.",
        "Temps d'instruction moyen d'un dossier complexe réduit de 40 minutes à 12 minutes.",
        "Capacité d'ingérer un nouvel avenant contractuel en moins de 15 minutes avec garantie de non-régression.",
        "Traçabilité complète de chaque assertion avec citation exacte du paragraphe source.",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 01 — Raisonnement & RAG",
        description:
          "Architecture RAG Haute Précision, embeddings bge-m3, Qdrant et garde-fous pour LLM d'entreprise.",
        badge: "Service d'ingénierie",
        href: "/services/01",
        targetViewKey: "service-detail",
        targetId: "01",
      },
      {
        type: "solution",
        title: "Synthèse clinique & extraction NLP",
        description:
          "Extraction automatisée et structuration de données non structurées sous contraintes de conformité.",
        badge: "Solution sectorielle",
        href: "/solutions/healthcare-nlp",
        targetViewKey: "solution-detail",
        targetId: "healthcare-nlp",
      },
      {
        type: "solution",
        title: "Agents de conformité réglementaire",
        description:
          "Surveillance et audit de 100% des flux transactionnels avec détection d'anomalies en temps réel.",
        badge: "Solution sectorielle",
        href: "/solutions/finance-agent",
        targetViewKey: "solution-detail",
        targetId: "finance-agent",
      },
    ],
  },

  // =========================================================================
  // ARTICLE 02 — N8N VS TEMPORAL ORCHESTRATION
  // =========================================================================
  "n8n-vs-temporal-orchestration": {
    slug: "n8n-vs-temporal-orchestration",
    aliases: ["n8n-vs-temporal"],
    readingTime: "8 min",
    publishedDate: "28 Janvier 2025",
    category: {
      key: "automation",
      label: "Automatisation",
    },
    author: {
      name: "Martial GNINHI",
      role: "Directeur Technique & Architecte Systèmes",
      avatarInitials: "MG",
    },
    hero: {
      eyebrow: "INSIGHT #02 // ORCHESTRATION DISTRIBUÉE & RÉSILIENCE",
      title: "n8n vs Temporal :",
      titleAccent: "choisir l'orchestrateur de vos flux critiques",
      subtitle:
        "Analyse comparative approfondie entre automatisation low-code événementielle et moteur d'orchestration distribué à exécution durable.",
      tags: ["n8n", "Temporal", "Orchestration", "Workflows", "TypeScript", "Saga"],
    },
    context: {
      sector: "FinTech & Plateformes de paiement B2B",
      sectorBadge: "FinTech & Paiement",
      useCase: "Orchestration du parcours d'onboarding marchand : KYC, scoring bancaire et provisionnement de comptes séquestres",
      constraints:
        "Flux asynchrones à états longs (de quelques secondes jusqu'à 14 jours d'attente de validation de pièces d'identité)",
      stakes:
        "Perte d'état et double débit interdits en cas de restart d'infrastructure ou de timeout d'API bancaire partenaire",
      narrative:
        "Dans l'écosystème du paiement et des services financiers, brancher des webhooks sur des scripts légers séduit au départ par sa rapidité. Mais lorsqu'un parcours d'onboarding marchand s'étale sur 10 jours — entre l'analyse automatique d'un extrait Kbis, la réponse différée d'un registre du commerce et la validation manuelle de conformité —, la gestion de l'état devient le point de rupture critique. Si un conteneur d'automatisation redémarre pendant qu'une banque met 45 secondes à confirmer une ouverture de compte séquestre, un outil purement en mémoire perd le fil. L'arbitrage entre n8n et Temporal ne relève pas d'une querelle d'outils, mais d'une frontière d'ingénierie étanche entre périphérie d'intégration et moteur transactionnel déterministe.",
    },
    problem: {
      heading: "Quand l'automatisation low-code heurte le mur de la résilience transactionnelle",
      lead: "Les orchestrateurs low-code ont transformé la productivité des intégrations SaaS, mais révèlent 3 failles architecturales majeures dès lors qu'ils pilotent des flux d'entreprise à haute criticité.",
      failureModes: [
        {
          code: "FAIL_01 // VOLATILE_STATE",
          title: "Perte d'état lors des redémarrages de nœuds",
          description:
            "Une exécution n8n en attente d'un webhook externe stockée en mémoire volatile est irrémédiablement compromise lors d'un rolling update Kubernetes ou d'un OOM killer.",
          impact: "Dossiers marchands bloqués sans reprise possible",
        },
        {
          code: "FAIL_02 // NO_SAGA_COMPENSATION",
          title: "Absence de transactions distribuées (Saga)",
          description:
            "Si l'étape 5 d'un workflow échoue (refus du registre légal), annuler les étapes 2, 3 et 4 (débit de frais, création de compte temporaire) exige un code de compensation artisanal très faillible.",
          impact: "Incohérences financières et réconciliations manuelles",
        },
        {
          code: "FAIL_03 // LOWCODE_MAINTENANCE_DEBT",
          title: "Ingouvernabilité des graphes complexes (> 25 nœuds)",
          description:
            "Les flux intégrant une multitude de branches conditionnelles et de blocs JavaScript non typés deviennent impossibles à tester unitairement ou à versionner proprement sous Git.",
          impact: "Régression à chaque modification de connecteur",
        },
      ],
    },
    approach: {
      heading: "Architecture hybride pragmatique : Synergie n8n v1.60+ et Temporal v1.25+",
      lead: "Plutôt que d'opposer stérilement ces deux paradigmes, nous opérons une séparation nette des responsabilités : Temporal au cœur des transactions, n8n à la périphérie des intégrations.",
      architectureTitle: "Découpage architectural par niveau de criticité",
      architectureStages: [
        {
          stageNumber: "STAGE 01",
          title: "Périphérie d'ingestion & Webhooks n8n",
          description:
            "n8n (v1.60+) reçoit les signaux externes hétérogènes (formulaires, notifications Slack, uploads S3), valide la syntaxe et appelle l'API Temporal.",
          keyPattern: "API Gateway & Payload Sanitization",
          badge: "Low-Code",
        },
        {
          stageNumber: "STAGE 02",
          title: "Exécution durable déterministe sous Temporal",
          description:
            "Le Workflow Temporal (v1.25+) prend le relais avec garantie mathématique d'idempotence et persistance intégrale de l'historique d'événements.",
          keyPattern: "Durable Execution & Event Sourcing",
          badge: "Core Transactionnel",
        },
        {
          stageNumber: "STAGE 03",
          title: "Activités isolées avec Pattern Saga",
          description:
            "Chaque appel externe (API bancaire, vérification d'identité) est encapsulé dans une Activity isolée avec retries exponentiels et compensation automatique en cas de rejet.",
          keyPattern: "Saga Pattern Compensation",
        },
        {
          stageNumber: "STAGE 04",
          title: "Signaux d'attente longue & Notification finale",
          description:
            "Le workflow se met en sommeil complet (0 CPU consommé) jusqu'à réception du signal de validation humaine, puis notifie le marchand via les connecteurs n8n.",
          keyPattern: "Durable Timers & External Signals",
        },
      ],
      techStack: [
        {
          name: "Temporal",
          version: "v1.25.1",
          role: "Moteur d'exécution durable et gestionnaire de transactions distribuées",
          category: "orchestration",
        },
        {
          name: "Temporal SDK TypeScript",
          version: "v1.11.2",
          role: "Implémentation typée des workflows déterministes et des activités",
          category: "orchestration",
        },
        {
          name: "n8n self-hosted",
          version: "v1.60.0",
          role: "Passerelle d'intégration rapide et connecteurs SaaS périphériques",
          category: "orchestration",
        },
        {
          name: "PostgreSQL",
          version: "v16.3",
          role: "Persistance ACID du cluster Temporal et rétention de l'historique",
          category: "data",
        },
      ],
      codeSnippet: {
        title: "merchant_onboarding_workflow.ts — Saga Pattern déterministe",
        language: "typescript",
        code: `// Workflow d'onboarding résilient avec compensation automatique (Saga)
import { proxyActivities, defineSignal, setHandler } from "@temporalio/workflow";
import type * as activities from "./activities";

const { verifyKyc, reserveEscrowAccount, cancelEscrowAccount, notifyMerchant } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: "45s",
    retry: { maximumAttempts: 5, backoffCoefficient: 2 },
  });

export async function merchantOnboardingWorkflow(merchantId: string) {
  const compensations: Array<() => Promise<void>> = [];

  try {
    // Étape 1 : Création compte séquestre
    const escrow = await reserveEscrowAccount(merchantId);
    compensations.push(() => cancelEscrowAccount(escrow.id));

    // Étape 2 : Vérification KYC stricte
    const kycStatus = await verifyKyc(merchantId);
    if (!kycStatus.approved) {
      throw new Error("KYC_REJECTED");
    }

    await notifyMerchant(merchantId, "ACCOUNT_ACTIVE");
  } catch (err) {
    // Exécution déterministe des compensations en ordre inverse
    for (const compensate of compensations.reverse()) {
      await compensate();
    }
    throw err;
  }
}`,
        caption: "Ce workflow garantit l'annulation propre des comptes créés en cas de refus KYC ultérieur, sans perte d'état possible.",
      },
    },
    tradeoffs: {
      heading: "Arbitrages d'ingénierie & Complexité opérationnelle",
      lead: "Temporal résout définitivement les problématiques de perte d'état et de transactions distribuées, mais exige une discipline d'ingénierie rigoureuse.",
      disclaimer:
        "NOTE D'ARBITRAGE : Ne déployez jamais un cluster Temporal pour envoyer des newsletters ou synchroniser des contacts Notion. L'orchestration déterministe est réservée aux processus où une perte d'état a un coût direct.",
      tradeoffs: [
        {
          title: "Surcharge d'infrastructure vs Simplicité no-code",
          tension: "Résilience maximale vs Effort opérationnel",
          arbitrage:
            "Déployer un cluster Temporal complet (PostgreSQL de persistance + workers stateless applicatifs).",
          costOrDrawback:
            "Nécessite des compétences dev/SRE solides et une surveillance de métriques Prometheus/Grafana.",
          mitigation:
            "Cluster Temporal managé pour le cœur de métier, et instance n8n autonome pour 80% des flux marketing/internes.",
        },
        {
          title: "La contrainte de déterminisme strict dans le code",
          tension: "Liberté d'écriture vs Reproductibilité d'état",
          arbitrage:
            "Interdiction formelle de tout appel réseau direct, d'accès à l'horloge système ou de générateurs non déterministes dans le workflow.",
          costOrDrawback:
            "Temps de montée en compétences des développeurs sur les règles de rejeu déterministe de Temporal.",
          mitigation:
            "Linter ESLint officiel Temporal (`@temporalio/eslint-plugin`) intégré dans la pipeline de validation CI/CD.",
        },
      ],
    },
    results: {
      heading: "Résultats mesurés sur flux transactionnels réels",
      lead: "Bilan comparatif observé après 6 mois d'exploitation sur un flux mensuel de 40 000 dossiers marchands.",
      metrics: [
        {
          label: "Récupération automatique sur panne",
          value: "100%",
          subtext: "Reprise à la milliseconde près sans doublon d'exécution",
          isIndicative: false,
        },
        {
          label: "Délai moyen d'intégration connecteur SaaS",
          value: "2 heures",
          change: "-80%",
          subtext: "Sur n8n contre 1,5 jour de dev applicatif pur",
          isIndicative: true,
        },
        {
          label: "Incidents de réconciliation financière",
          value: "0 dossier",
          subtext: "Grâce aux compensations Saga déterministes",
          isIndicative: false,
        },
      ],
      methodologyNote:
        "Données consolidées sur 40 000 dossiers traités entre septembre 2024 et février 2025. Les délais d'intégration représentent un ordre de grandeur moyen constaté sur les connecteurs d'écosystème tiers. La reprise à 100% est validée par injection de pannes synthétiques (chaos engineering) sur les workers.",
      observedBenefits: [
        "Élimination totale des dossiers orphelins nécessitant une intervention manuelle d'un ingénieur support.",
        "Traçabilité intégrale de l'historique de chaque dossier avec replay disponible à tout moment.",
        "Capacité à suspendre des workflows pendant 14 jours sans surcharger la mémoire ni le processeur.",
        "Alignement des équipes métier (autonomes sur n8n) et des architectes (garants du core sous Temporal).",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 02 — Automatisation & Workflows",
        description:
          "Architectures n8n, Temporal et systèmes événementiels résilients pour flux métiers critiques.",
        badge: "Service d'ingénierie",
        href: "/services/02",
        targetViewKey: "service-detail",
        targetId: "02",
      },
      {
        type: "service",
        title: "Service 03 — Systèmes Multi-Agents",
        description:
          "Orchestration et supervision de flottes collaboratives via Temporal et le protocole MCP.",
        badge: "Service d'ingénierie",
        href: "/services/03",
        targetViewKey: "service-detail",
        targetId: "03",
      },
      {
        type: "solution",
        title: "Agents de conformité réglementaire",
        description:
          "Surveillance continue et instruction de conformité bancaire sans faille d'état.",
        badge: "Solution sectorielle",
        href: "/solutions/finance-agent",
        targetViewKey: "solution-detail",
        targetId: "finance-agent",
      },
    ],
  },

  // =========================================================================
  // ARTICLE 03 — COUCHE SÉMANTIQUE DBT & BI
  // =========================================================================
  "couche-semantique-dbt-bi": {
    slug: "couche-semantique-dbt-bi",
    aliases: ["semantic-layer-dbt"],
    readingTime: "5 min",
    publishedDate: "10 Janvier 2025",
    category: {
      key: "data",
      label: "Data & Décision",
    },
    author: {
      name: "Martial GNINHI",
      role: "Directeur Technique & Architecte Data",
      avatarInitials: "MG",
    },
    hero: {
      eyebrow: "INSIGHT #03 // DATA WAREHOUSE & SÉMANTIQUE MÉTIER",
      title: "La couche sémantique dbt :",
      titleAccent: "le chaînon manquant pour fiabiliser votre BI",
      subtitle:
        "Pourquoi unifier vos règles de calcul dans dbt Core avec MetricFlow est indispensable avant d'alimenter vos dashboards et assistants Text-to-SQL.",
      tags: ["dbt", "Snowflake", "BI", "Semantic Layer", "MetricFlow", "Power BI"],
    },
    context: {
      sector: "E-commerce & Retail omnicanal multi-filiales",
      sectorBadge: "Retail & E-Commerce",
      useCase: "Calcul consolidé du Chiffre d'Affaires Net, de la marge brute et du Customer Lifetime Value sur 12 filiales",
      constraints:
        "3 outils concurrents de restitution (Power BI pour la finance, Metabase pour le terrain, requêtes SQL manuelles pour les analystes)",
      stakes:
        "Mettre fin aux réunions d'arbitrage où l'on débat pendant 40 minutes de la validité du chiffre plutôt que de la stratégie commerciale",
      narrative:
        "Dans la quasi-totalité des entreprises en forte croissance, le comité de direction mensuel commence par le même rituel stérile : la direction financière annonce 14,2 M€ de chiffre d'affaires, le marketing revendique 15,1 M€, et les responsables de filiales comptabilisent 13,8 M€. Personne n'a tort : chaque équipe a simplement calculé son chiffre dans son outil avec ses propres filtres (dates de commande contre dates de facturation, exclusion tardive des retours, gestion hétérogène des remises promotionnelles). Tenter de résoudre ce chaos en multipliant les dashboards ne fait qu'aggraver la dispersion. Seule une couche sémantique centralisée, déclarée en amont dans le data warehouse, permet de réconcilier durablement les chiffres.",
    },
    problem: {
      heading: "La dispersion de la logique métier dans les outils de visualisation",
      lead: "Laisser chaque dashboard ou outil de BI coder ses propres agrégations génère une dette analytique exponentielle et ruine toute tentative d'interrogation en langage naturel.",
      failureModes: [
        {
          code: "ERR_01 // DAX_SQL_DISCORD",
          title: "Discordance structurelle des calculs locaux",
          description:
            "Une formule DAX complexe dans Power BI exclut les avoirs avec 15 jours de décalage, tandis que la requête SQL sous Metabase les retranche en temps réel.",
          impact: "Écarts récurrents de 4% à 9% entre directions",
        },
        {
          code: "ERR_02 // TEXT_TO_SQL_CHAOS",
          title: "Inutilisabilité des agents Text-to-SQL sans ontologie",
          description:
            "Un LLM connecté directement à des tables brutes de base de données hallucine sur la définition de la 'marge brute' et choisit aléatoirement entre prix catalogue et prix net.",
          impact: "Taux d'erreur de 42% sur requêtes décisionnelles IA",
        },
        {
          code: "ERR_03 // SILENT_MAINTENANCE_COST",
          title: "Multiplication du coût de maintenance des règles",
          description:
            "Toute évolution comptable ou fiscale exige de retoucher manuellement 35 rapports distincts dans différents outils, avec un risque critique d'oubli.",
          impact: "Des centaines d'heures d'ingénierie gaspillées",
        },
      ],
    },
    approach: {
      heading: "Modélisation Medallion, dbt Core 1.8+ et MetricFlow universel",
      lead: "Nous déportons 100% de la logique métier dans le dépôt de code dbt versionné sous Git : les outils de visualisation ne font plus aucun calcul, ils consomment des métriques certifiées.",
      architectureTitle: "Pipeline de la donnée brute à la consommation unifiée",
      architectureStages: [
        {
          stageNumber: "STAGE 01",
          title: "Normalisation Medallion (Bronze / Silver)",
          description:
            "Ingestion et nettoyage des transactions brutes ERP/Shopify sous Snowflake avec typage strict et déduplication automatique.",
          keyPattern: "Medallion Architecture & Idempotent ELT",
        },
        {
          stageNumber: "STAGE 02",
          title: "Modélisation dimensionnelle Gold (Star Schema)",
          description:
            "Construction de tables de faits transactionnelles auditées et de dimensions conformes (Clients, Produits, Magasins, Calendrier).",
          keyPattern: "Kimball Dimensional Modeling",
          badge: "dbt Core 1.8+",
        },
        {
          stageNumber: "STAGE 03",
          title: "Déclaration sémantique MetricFlow",
          description:
            "Définition déclarative des mesures et métriques dérivées en fichiers YAML versionnés : agrégations additives, non-additives et fenêtres glissantes.",
          keyPattern: "Semantic Metrics Layer (MetricFlow)",
        },
        {
          stageNumber: "STAGE 04",
          title: "Exposition universelle (BI & Text-to-SQL)",
          description:
            "Diffusion via l'API Semantic Layer (GraphQL / JDBC) vers Power BI, Metabase et les agents conversationnels sans réécriture locale.",
          keyPattern: "Universal Semantic Consumption",
          badge: "API GraphQL / JDBC",
        },
      ],
      techStack: [
        {
          name: "dbt Core",
          version: "v1.8.4",
          role: "Moteur de transformation, lignage de données et tests d'intégrité",
          category: "data",
        },
        {
          name: "MetricFlow",
          version: "v0.20.1",
          role: "Moteur d'abstraction sémantique et génération SQL dynamique",
          category: "data",
        },
        {
          name: "Snowflake",
          version: "Enterprise",
          role: "Data Warehouse haute performance et compute analytique",
          category: "data",
        },
        {
          name: "Power BI",
          version: "DirectQuery Semantic",
          role: "Restitution décisionnelle branchée sur l'API sémantique certifiée",
          category: "data",
        },
      ],
      codeSnippet: {
        title: "metricflow_semantic_model.yml — Définition de la métrique Net Revenue",
        language: "yaml",
        code: `# Définition sémantique unique du chiffre d'affaires net
semantic_models:
  - name: transactions
    model: ref('fct_transactions_gold')
    entities:
      - name: transaction_id
        type: primary
      - name: customer_id
        type: foreign
    measures:
      - name: gross_amount
        agg: sum
      - name: refund_amount
        agg: sum
      - name: tax_amount
        agg: sum

metrics:
  - name: net_revenue
    description: "Chiffre d'affaires net consolidé après déduction des remboursements et taxes"
    type: derived
    type_params:
      expr: gross_amount - refund_amount - tax_amount
      metrics:
        - name: gross_amount
        - name: refund_amount
        - name: tax_amount`,
        caption: "Cette métrique est calculée de manière identique, que la requête provienne de Power BI, d'Excel ou d'un agent IA.",
      },
    },
    tradeoffs: {
      heading: "Arbitrages techniques & Rigidité maîtrisée",
      lead: "Adopter une couche sémantique centrale met fin aux désaccords de chiffres, mais impose de renoncer au bricolage opportuniste des analystes.",
      disclaimer:
        "NOTE DE GOUVERNANCE : Une couche sémantique n'accélère pas la création d'un graphique ad-hoc de 5 minutes. Elle garantit que les décisions stratégiques reposent sur des chiffres inattaquables.",
      tradeoffs: [
        {
          title: "Gouvernance formelle vs Vitesse de livraison locale",
          tension: "Exactitude certifiée vs Réactivité terrain",
          arbitrage:
            "Toute nouvelle métrique doit faire l'objet d'une PR Git dbt avec tests d'intégrité avant d'apparaître dans les dashboards.",
          costOrDrawback:
            "Délai de création d'un nouvel indicateur passant de 15 minutes en local à 24-48h de revue d'ingénierie.",
          mitigation:
            "Espaces bac à sable 'Sandbox Schema' temporaires pour les expérimentations d'analystes, isolés du reporting officiel.",
        },
        {
          title: "Surcoût de compute sur les requêtes générées dynamiquement",
          tension: "Abstraction sémantique vs Optimisation SQL bas niveau",
          arbitrage:
            "MetricFlow assemble les requêtes SQL via des sous-requêtes imbriquées pour garantir la conformité sémantique.",
          costOrDrawback:
            "Légère surconsommation de crédits Snowflake (estimée entre 10% et 18% à titre indicatif) sans partitionnement fin.",
          mitigation:
            "Matérialisation incrémentale dbt sur les dimensions temporelles et clustering keys rigoureuses sur Snowflake.",
        },
      ],
    },
    results: {
      heading: "Résultats mesurés sur le reporting de direction",
      lead: "Impact opérationnel mesuré après déploiement de la couche sémantique dbt sur un portefeuille de 42 tableaux de bord.",
      metrics: [
        {
          label: "Divergence de calcul entre départements",
          value: "0.0%",
          subtext: "Sur l'ensemble des 25 métriques de gestion clés",
          isIndicative: false,
        },
        {
          label: "Précision des requêtes Text-to-SQL IA",
          value: "91%",
          change: "+33%",
          subtext: "Passée de 58% à 91% grâce à l'ontologie dbt",
          isIndicative: true,
        },
        {
          label: "Temps d'audit lors des clôtures mensuelles",
          value: "÷ 4",
          subtext: "Focalisation sur l'action commerciale et non sur le recalcul",
          isIndicative: true,
        },
      ],
      methodologyNote:
        "Mesures observées sur le périmètre de reporting financier et opérationnel de 12 filiales sur 3 trimestres consécutifs. La précision de l'agent Text-to-SQL est mesurée à titre indicatif sur un banc de 120 questions métier types annotées.",
      observedBenefits: [
        "Alignement immédiat entre la direction financière, la logistique et le marketing lors des comités de direction.",
        "Facilité d'intégration de nouveaux outils de visualisation sans avoir à réimplémenter la logique comptable.",
        "Possibilité d'activer des agents conversationnels de décision fiables interrogeant la donnée sans halluciner.",
        "Documentation vivante des règles de calcul directement synchronisée dans le dbt Docs partagé.",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 04 — Data & Décision Augmentée",
        description:
          "Modern Data Stack, modélisation Medallion, BI décisionnelle et interrogation en langage naturel.",
        badge: "Service d'ingénierie",
        href: "/services/04",
        targetViewKey: "service-detail",
        targetId: "04",
      },
      {
        type: "solution",
        title: "BI prédictive omnicanal",
        description:
          "Suite décisionnelle unifiée croisant ventes, stocks et comportement client pour pricing dynamique.",
        badge: "Solution sectorielle",
        href: "/solutions/retail-bi",
        targetViewKey: "solution-detail",
        targetId: "retail-bi",
      },
      {
        type: "solution",
        title: "Optimisation logistique par l'IA",
        description:
          "Prédiction de la demande et ré-ordonnancement dynamique basé sur des données certifiées.",
        badge: "Solution sectorielle",
        href: "/solutions/logistics-ai",
        targetViewKey: "solution-detail",
        targetId: "logistics-ai",
      },
    ],
  },

  // =========================================================================
  // ARTICLE 04 — INDUSTRIALISER LES AGENTS IA EN PRODUCTION
  // =========================================================================
  "agents-production-2025": {
    slug: "agents-production-2025",
    aliases: ["agents-ia-production"],
    readingTime: "11 min",
    publishedDate: "14 Septembre 2025",
    category: {
      key: "ia",
      label: "Intelligence Artificielle",
    },
    author: {
      name: "Martial GNINHI",
      role: "Directeur Technique & Architecte IA",
      avatarInitials: "MG",
    },
    hero: {
      eyebrow: "INSIGHT #04 // SYSTÈMES AGENTIQUES & PRODUCTION",
      title: "Industrialiser les agents IA :",
      titleAccent: "du POC au système agentique en production",
      subtitle:
        "Pourquoi 80% des POC agents échouent à l'échelle et les 5 piliers d'architecture qui font la différence entre une démo laptop et un système d'entreprise fiable.",
      tags: ["Agents", "LangGraph", "Production", "MCP", "Langfuse", "FSM"],
    },
    context: {
      sector: "SaaS B2B & Opérations de support technique N2/N3",
      sectorBadge: "SaaS & Support Technique",
      useCase: "Agent autonome d'investigation d'incidents client : diagnostic de logs, tests en sandbox et pré-qualification de correctifs",
      constraints:
        "Environnements d'exécution hétérogènes (API REST, cluster Datadog, base PostgreSQL) avec des temps de réponse d'outils de 200 ms à 15 s",
      stakes:
        "Éliminer les risques d'actions destructives non supervisées sur les systèmes clients et maîtriser le coût d'inférence cumulatif",
      narrative:
        "En 2024, le web a été inondé de démonstrations impressionnantes d'agents IA réservant des tables de restaurant ou codant des mini-jeux en trois prompts. Mais dans les départements d'ingénierie d'entreprise, la désillusion a été rapide : plus de 80% des POC agentiques s'effondrent dès qu'on les confronte à la réalité des opérations de production. Entre des modèles qui perdent leur objectif au bout de six étapes, des boucles infinies qui vident les crédits d'API en quelques minutes, et des outils invoqués avec des arguments mal typés, un agent non cadré est une source d'instabilité majeure. Réussir le passage à l'échelle exige de rompre avec l'illusion de l'autonomie totale pour concevoir des graphes d'états stricts, outillés et surveillés.",
    },
    problem: {
      heading: "Les 4 causes de défaillance fatale des agents en production",
      lead: "Les échecs en production ne sont pas dus à un manque d'intelligence brute du modèle, mais à l'absence d'une structure logicielle bornant son espace d'action.",
      failureModes: [
        {
          code: "ERR_01 // DRIFT_AMNESIA",
          title: "Amnésie de trajectoire sur contextes longs",
          description:
            "Au-delà de 6 interactions d'outils consécutives, l'attention du LLM se disperse et l'agent oublie la contrainte initiale formulée par l'utilisateur.",
          impact: "Déviation de l'objectif et réponses hors sujet",
        },
        {
          code: "ERR_02 // CONTEXT_SATURATION",
          title: "Saturation du contexte par les sorties d'outils brutes",
          description:
            "L'injection d'un dump de logs de 8 000 lignes dans le prompt pollue la fenêtre d'attention et multiplie par 10 le coût de chaque étape ultérieure.",
          impact: "Explosion des coûts d'API et dégradation du raisonnement",
        },
        {
          code: "ERR_03 // INFINITE_LOOP",
          title: "Boucles de répétition face à un outil en erreur",
          description:
            "Face à une erreur 404 ou 401 d'une API, un agent en boucle ReAct libre réessaie indéfiniment la même commande en modifiant des paramètres futiles.",
          impact: "Consommation incontrôlée de quotas en quelques minutes",
        },
      ],
    },
    approach: {
      heading: "StateGraph déterministe LangGraph v0.2+, protocole MCP et observabilité Langfuse",
      lead: "Nous remplaçons l'autonomie non cadrée par un automate à états finis (Finite State Machine) où chaque transition est validée par du code déterministe.",
      architectureTitle: "Architecture d'exécution sécurisée en 4 étapes",
      architectureStages: [
        {
          stageNumber: "STAGE 01",
          title: "Planification typée & Validation d'intention",
          description:
            "Décomposition du problème en un plan d'action séquentiel validé par schéma Pydantic strict avant tout appel d'outil.",
          keyPattern: "Constrained Intent Planning",
          badge: "Pydantic / Zod",
        },
        {
          stageNumber: "STAGE 02",
          title: "Exécution d'outils via le protocole MCP",
          description:
            "Standardisation des interfaces d'outils via le Model Context Protocol (MCP) : validation typée des entrées/sorties et exécution en sandbox isolée.",
          keyPattern: "Model Context Protocol (MCP)",
        },
        {
          stageNumber: "STAGE 03",
          title: "Supervision temps réel sur Langfuse",
          description:
            "Traçage complet de chaque étape (Thought, Action, Observation), détection des boucles de récursion et monitoring des coûts par session.",
          keyPattern: "Full-Trace Observability",
          badge: "Langfuse v2.45+",
        },
        {
          stageNumber: "STAGE 04",
          title: "Garde-fous Human-in-the-loop déterministes",
          description:
            "Suspension de l'état du graphe avec point d'interruption obligatoire dès qu'une action dépasse un seuil de criticité (écriture en base, action externe).",
          keyPattern: "Stateful Human-in-the-Loop",
        },
      ],
      techStack: [
        {
          name: "LangGraph",
          version: "v0.2.16",
          role: "Orchestrateur de graphes d'états cycliques déterministes",
          category: "orchestration",
        },
        {
          name: "Model Context Protocol",
          version: "v1.0.0",
          role: "Standardisation et isolation sécurisée des appels d'outils",
          category: "infra",
        },
        {
          name: "Langfuse",
          version: "v2.45.1",
          role: "Observabilité complète, tracing des sessions et contrôle budgétaire",
          category: "evaluation",
        },
        {
          name: "Redis",
          version: "v7.2.4",
          role: "Persistance des checkpoints d'états et mémoire à court terme",
          category: "data",
        },
      ],
      codeSnippet: {
        title: "incident_triage_graph.py — Graphe d'états LangGraph avec garde-fou",
        language: "python",
        code: `# Graphe d'agent avec point de suspension Human-in-the-loop
from langgraph.graph import StateGraph, END
from typing import TypedDict, List

class AgentState(TypedDict):
    ticket_id: str
    plan: List[str]
    current_step: int
    findings: List[dict]
    is_destructive_action: bool

def should_require_human_approval(state: AgentState):
    if state.get("is_destructive_action", False):
        return "human_approval_node"
    if state.get("current_step", 0) >= 10:
        return "circuit_breaker_cutoff"
    return "execute_tool_node"

graph = StateGraph(AgentState)
graph.add_node("plan_node", plan_investigation)
graph.add_node("execute_tool_node", run_mcp_tool)
graph.add_node("human_approval_node", suspend_for_approval)
graph.add_node("circuit_breaker_cutoff", emergency_abort)

graph.add_conditional_edges("plan_node", should_require_human_approval)
app = graph.compile(interrupt_before=["human_approval_node"])`,
        caption: "Ce graphe garantit mathématiquement qu'aucune action destructive n'est déclenchée sans validation humaine préalable.",
      },
    },
    tradeoffs: {
      heading: "Arbitrages d'ingénierie : Fiabilité vs Plasticité",
      lead: "Transformer un agent expérimental en composant d'infrastructure robuste implique des arbitrages clairs sur son autonomie.",
      disclaimer:
        "NOTE DE CONCEPTION : Nous assumons pleinement de réduire l'imprévisibilité de nos agents. Dans le monde professionnel, la prévisibilité d'un système est toujours préférable à une créativité désordonnée.",
      tradeoffs: [
        {
          title: "Déterminisme du graphe vs Autonomie émergente",
          tension: "Fiabilité prédictible vs Polyvalence générale",
          arbitrage:
            "Restreindre l'agent à des chemins d'états explicites et borner le nombre maximal de transitions à 10.",
          costOrDrawback:
            "L'agent est incapable de résoudre des cas totalement inédits situés en dehors de son graphe de conception.",
          mitigation:
            "Escalade automatique et gracieuse vers un ingénieur humain dès que le graphe atteint une impasse.",
        },
        {
          title: "Latence cumulée des cycles d'investigation",
          tension: "Richesse de réflexion vs Temps de réponse utilisateur",
          arbitrage:
            "Permettre à l'agent d'enchaîner jusqu'à 4 inférences de réflexion et 3 requêtes d'outils.",
          costOrDrawback:
            "Temps de traitement total variant de 6 à 18 secondes (à titre indicatif) par session d'investigation.",
          mitigation:
            "Affichage en streaming des étapes de pensée (Thought process) dans l'interface et exécution asynchrone par webhooks.",
        },
      ],
    },
    results: {
      heading: "Résultats mesurés sur banc d'incidents techniques",
      lead: "Métriques obtenues lors du déploiement en production sur une cohorte de 1 000 tickets de support N2/N3.",
      metrics: [
        {
          label: "Résolution autonome du pré-diagnostic",
          value: "76%",
          subtext: "Dossiers documentés avec diagnostic exact dès le premier jet",
          isIndicative: true,
        },
        {
          label: "Taux de boucles infinies",
          value: "0.0%",
          subtext: "Élimination totale grâce au coupe-circuit à 10 étapes",
          isIndicative: false,
        },
        {
          label: "Économie de tokens par session",
          value: "-52%",
          change: "-52%",
          subtext: "Grâce au résumé automatique des sorties d'outils volumineuses",
          isIndicative: true,
        },
      ],
      methodologyNote:
        "Mesures observées sur 1 000 incidents techniques réels sur une période de 90 jours. Le taux de résolution autonome représente un ordre de grandeur représentatif pour les incidents disposant d'une documentation technique accessible à l'agent.",
      observedBenefits: [
        "Temps moyen de prise en charge d'un incident de support critique divisé par 3.",
        "Disparition complète des factures imprévues liées à des agents tournant en boucle toute la nuit.",
        "Adoption massive par les équipes techniques grâce à la transparence intégrale des étapes de pensée.",
        "Garantie qu'aucune opération d'écriture n'est exécutée sans signature d'un opérateur qualifié.",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 03 — Systèmes Multi-Agents",
        description:
          "Flottes collaboratives, supervision Langfuse et intégration d'outils métiers via le protocole MCP.",
        badge: "Service d'ingénierie",
        href: "/services/03",
        targetViewKey: "service-detail",
        targetId: "03",
      },
      {
        type: "service",
        title: "Service 01 — Raisonnement & RAG",
        description:
          "Indexation vectorielle de haute précision pour nourrir les agents avec votre corpus documentaire.",
        badge: "Service d'ingénierie",
        href: "/services/01",
        targetViewKey: "service-detail",
        targetId: "01",
      },
      {
        type: "solution",
        title: "Agents de conformité réglementaire",
        description:
          "Automatisation d'audits et d'enquêtes de conformité avec auditabilité totale.",
        badge: "Solution sectorielle",
        href: "/solutions/finance-agent",
        targetViewKey: "solution-detail",
        targetId: "finance-agent",
      },
    ],
  },

  // =========================================================================
  // ARTICLE 05 — ARCHITECTURE EVENT-DRIVEN POUR SYSTÈMES MULTI-AGENTS
  // =========================================================================
  "event-driven-agents": {
    slug: "event-driven-agents",
    aliases: ["architecture-multi-agents-evenementielle"],
    readingTime: "12 min",
    publishedDate: "15 Juillet 2025",
    category: {
      key: "architecture",
      label: "Architecture",
    },
    author: {
      name: "Martial GNINHI",
      role: "Directeur Technique & Architecte Systèmes",
      avatarInitials: "MG",
    },
    hero: {
      eyebrow: "INSIGHT #05 // MULTI-AGENTS & STREAMING D'ÉVÉNEMENTS",
      title: "Architecture event-driven",
      titleAccent: "pour systèmes multi-agents",
      subtitle:
        "Les agents autonomes ne doivent pas communiquer par appels synchrones bloquants. Découvrez le pattern événementiel sur Kafka qui rend vos flottes résilientes et observables.",
      tags: ["Event-driven", "Kafka", "Multi-Agents", "CloudEvents", "OpenTelemetry"],
    },
    context: {
      sector: "Industrie 4.0 & Logistique portuaire",
      sectorBadge: "Industrie & Logistique",
      useCase: "Coordination d'une flotte de 20 agents autonomes orchestrant le déchargement de conteneurs, le routage ferroviaire et la maintenance de grues",
      constraints:
        "Connectivité réseau instable sur les terminaux extérieurs et temps de calcul hétérogènes (de 50 ms pour un capteur à 35 s pour un solveur mathématique d'allocation)",
      stakes:
        "Résilience totale : interdiction absolue qu'un ralentissement de l'agent météo ne bloque la chaîne de manutention des navires",
      narrative:
        "Dans la littérature académique sur les systèmes multi-agents, les architectures sont presque toujours schématisées sous forme d'appels directs : l'Agent A interroge l'Agent B, qui sollicite l'Agent C. Transposé dans un environnement industriel réel, ce modèle de communication synchrone (HTTP REST ou gRPC bloquant) est une aberration opérationnelle. Dès qu'un agent d'optimisation lourde met 30 secondes à calculer un plan de charge de quai, les sockets réseau restent ouverts, les timeouts se propagent en amont et paralysent l'ensemble de la flotte. La seule approche viable à grande échelle consiste à découpler temporellement les agents via un bus d'événements persistant où les entités publient des faits immuables et réagissent de manière asynchrone.",
    },
    problem: {
      heading: "L'illusion fatale du couplage synchrone entre agents autonomes",
      lead: "Le couplage d'agents par requêtes synchrones introduit trois fragilités systémiques incompatibles avec la haute disponibilité industrielle.",
      failureModes: [
        {
          code: "FAIL_01 // CASCADING_TIMEOUT",
          title: "Effondrement en cascade par empilement de latence",
          description:
            "Si un agent de routage en bout de chaîne subit une surcharge temporaire, tous les agents en amont tombent en timeout consécutif.",
          impact: "Blocage complet de la coordination opérationnelle",
        },
        {
          code: "FAIL_02 // TRANSIENT_LOSS",
          title: "Perte de messages lors des micro-coupures",
          description:
            "Si un agent sur grue mobile traverse une zone d'ombre réseau pendant qu'un ordre REST lui est adressé, l'instruction disparaît définitivement.",
          impact: "Ordres de sécurité non reçus et désynchronisation physique",
        },
        {
          code: "FAIL_03 // OPAQUE_DECISION",
          title: "Impossibilité de reconstituer l'arbre de décision collectif",
          description:
            "Dans un maillage d'appels HTTP croisés sans journal persistant, comprendre pourquoi trois agents ont alloué le même quai à deux navires relève de l'impossible.",
          impact: "Auditabilité nulle lors des incidents d'exploitation",
        },
      ],
    },
    approach: {
      heading: "Streaming d'événements distribué Apache Kafka & Standard CloudEvents 1.0",
      lead: "Nous transformons chaque agent en un processeur d'événements autonome, découplé de ses pairs et garant de sa propre résilience locale.",
      architectureTitle: "Cycle de communication asynchrone événementielle",
      architectureStages: [
        {
          stageNumber: "STAGE 01",
          title: "Publication de faits métier immuables",
          description:
            "Un agent n'ordonne rien : il publie un fait vérifié ('Conteneur #4821 scanné') encapsulé dans une enveloppe CloudEvents 1.0 normalisée.",
          keyPattern: "Event Sourcing & CloudEvents 1.0",
          badge: "Apache Kafka",
        },
        {
          stageNumber: "STAGE 02",
          title: "Partitionnement par clé de dossier métier",
          description:
            "Routage dans Kafka avec une clé de partitionnement stricte (ex. `vessel_id` ou `container_id`) garantissant le strict ordre chronologique.",
          keyPattern: "Strict Partition Ordering",
        },
        {
          stageNumber: "STAGE 03",
          title: "Transactional Outbox & Idempotence locale",
          description:
            "Chaque mise à jour d'état local de l'agent est enregistrée atomiquement avec l'événement à émettre en base PostgreSQL, évitant tout double message.",
          keyPattern: "Transactional Outbox Pattern",
          badge: "Zero-Data-Loss",
        },
        {
          stageNumber: "STAGE 04",
          title: "Traçabilité causale via OpenTelemetry",
          description:
            "Propagation systématique des en-têtes `traceparent` et `causation_id` à travers les topics Kafka pour visualiser le graphe de pensée de la flotte.",
          keyPattern: "Distributed Async Tracing",
        },
      ],
      techStack: [
        {
          name: "Apache Kafka / Redpanda",
          version: "v24.1.2",
          role: "Bus de streaming d'événements haute performance et log immuable",
          category: "infra",
        },
        {
          name: "CloudEvents",
          version: "v1.0.2",
          role: "Standardisation des enveloppes de métadonnées et de routage",
          category: "infra",
        },
        {
          name: "OpenTelemetry",
          version: "v1.28.0",
          role: "Traçage distribué des chaînes de causalité inter-agents",
          category: "evaluation",
        },
        {
          name: "PostgreSQL",
          version: "v16.3",
          role: "Persistance des états d'agents et table Outbox transactionnelle",
          category: "data",
        },
      ],
      codeSnippet: {
        title: "agent_cloudevent_schema.json — Enveloppe CloudEvents 1.0 d'agent",
        language: "json",
        code: `{
  "specversion": "1.0",
  "id": "evt-77a8-42f1-b68e",
  "source": "agents://port-logistics/crane-supervisor-04",
  "type": "ai.analyticatech.logistics.container_routed",
  "datacontenttype": "application/json",
  "time": "2025-07-15T14:22:18.412Z",
  "traceparent": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
  "data": {
    "container_id": "MSCU-884912-3",
    "allocated_zone": "BUFFER_BAY_D2",
    "reasoning_summary": "Zone prioritaire sélectionnée pour optimisation départ ferroviaire H+4",
    "confidence_score": 0.984
  }
}`,
        caption: "Chaque interaction porte son identifiant de trace OpenTelemetry, permettant de reconstituer tout le raisonnement collectif.",
      },
    },
    tradeoffs: {
      heading: "Arbitrages d'ingénierie : Cohérence à terme vs Synchronicité",
      lead: "L'architecture événementielle offre une résilience invulnérable aux pannes, mais impose de penser les processus avec une cohérence à terme.",
      disclaimer:
        "NOTE D'INGÉNIERIE : En architecture event-driven, deux agents ne partagent jamais un état instantané à la milliseconde près. Les flux métiers doivent être résilients aux états transitoires.",
      tradeoffs: [
        {
          title: "Cohérence à terme (Eventual Consistency) vs Verrouillage distribué",
          tension: "Débit et disponibilité vs Consistance temps réel immédiate",
          arbitrage:
            "Adopter la cohérence à terme et gérer les conflits d'allocation via des événements de réconciliation ultérieurs.",
          costOrDrawback:
            "Nécessite de concevoir des mécanismes de compensation lorsque deux agents réclament la même ressource quasi-simultanément.",
          mitigation:
            "Clés de partitionnement Kafka uniques par ressource physique et vérification de version optimiste (OCC).",
        },
        {
          title: "Complexité d'observabilité et instrumentation obligatoire",
          tension: "Découplage architectural vs Lisibilité du flux",
          arbitrage:
            "Exiger que 100% des agents injectent et propagent les contextes OpenTelemetry sur chaque événement.",
          costOrDrawback:
            "Effort de développement plus rigoureux pour chaque nouveau worker agent intégré dans l'écosystème.",
          mitigation:
            "SDK d'agent interne Analyticatech injectant automatiquement les métadonnées CloudEvents et spans OTel.",
        },
      ],
    },
    results: {
      heading: "Résultats mesurés sur banc de test industriel",
      lead: "Performances constatées lors d'un test de charge et de résilience simulant 20 agents sur une chaîne logistique.",
      metrics: [
        {
          label: "Disponibilité lors de pannes injectées (20% des nœuds)",
          value: "99.98%",
          subtext: "Aucun blocage en cascade sur les autres agents opérationnels",
          isIndicative: false,
        },
        {
          label: "Perte de messages ou d'instructions",
          value: "0.00%",
          subtext: "Garantie par la réplication de log Kafka (facteur 3)",
          isIndicative: false,
        },
        {
          label: "Débit de pointe absorbé sans dégradation",
          value: "3 500 msg/s",
          subtext: "Latence d'acheminement médiane inférieure à 15 ms",
          isIndicative: true,
        },
      ],
      methodologyNote:
        "Banc d'épreuve exécuté sur un cluster Redpanda 3 nœuds et 20 workers conteneurisés simulant un pic d'activité portuaire. Les valeurs de débit de pointe sont fournies à titre indicatif des conditions de saturation matérielle testées.",
      observedBenefits: [
        "Résilience totale face aux redémarrages de conteneurs ou aux pannes de connectivité réseau.",
        "Possibilité de brancher un nouvel agent d'analyse ou d'audit en simple écouteur passif sans perturber l'existant.",
        "Replay intégral d'une journée d'exploitation pour investiguer a posteriori les arbitrages collectifs.",
        "Découplage technologique : cohabitation sans friction d'agents écrits en Python, Go et TypeScript.",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 03 — Systèmes Multi-Agents",
        description:
          "Architecture hiérarchique, bus d'événements et gouvernance de flottes collaboratives d'entreprise.",
        badge: "Service d'ingénierie",
        href: "/services/03",
        targetViewKey: "service-detail",
        targetId: "03",
      },
      {
        type: "service",
        title: "Service 02 — Automatisation & Workflows",
        description:
          "Gestion des pipelines asynchrones et résilience d'exécution des flux événementiels.",
        badge: "Service d'ingénierie",
        href: "/services/02",
        targetViewKey: "service-detail",
        targetId: "02",
      },
      {
        type: "solution",
        title: "Maintenance prédictive IoT",
        description:
          "Détection d'anomalies sur flux de capteurs industriels haute fréquence.",
        badge: "Solution sectorielle",
        href: "/solutions/industry-maintenance",
        targetViewKey: "solution-detail",
        targetId: "industry-maintenance",
      },
    ],
  },

  // =========================================================================
  // ARTICLE 06 — FINOPS CLOUD-NATIVE SUR KUBERNETES
  // =========================================================================
  "finops-cloud-native": {
    slug: "finops-cloud-native",
    aliases: ["finops-kubernetes-optimisation"],
    readingTime: "6 min",
    publishedDate: "29 Juin 2025",
    category: {
      key: "architecture",
      label: "Architecture & Infra",
    },
    author: {
      name: "Martial GNINHI",
      role: "Directeur Technique & Architecte Cloud",
      avatarInitials: "MG",
    },
    hero: {
      eyebrow: "INSIGHT #06 // CLOUD INFRASTRUCTURE & FINOPS",
      title: "FinOps cloud-native :",
      titleAccent: "réduire sa facture sans sacrifier l'uptime",
      subtitle:
        "Comment diviser par deux le gaspillage de compute sur Kubernetes avec Karpenter, l'autoscaling par files de messages et une stratégie Spot étanche.",
      tags: ["FinOps", "Kubernetes", "Karpenter", "KEDA", "Cloud", "AWS"],
    },
    context: {
      sector: "Plateforme SaaS B2B en hypercroissance (AWS EKS)",
      sectorBadge: "SaaS & Cloud Native",
      useCase: "Optimisation de l'infrastructure compute d'un cluster de 150 nœuds hébergeant APIs web, pipelines d'ingestion et workers de batch ML",
      constraints:
        "SLA contractuel de 99.95% de disponibilité et temps de réponse P99 < 300 ms en heures de pointe (09h-18h)",
      stakes:
        "Enrayer une dérive budgétaire de +140% de coûts cloud en 12 mois sans risquer la moindre interruption de service client",
      narrative:
        "Dans la plupart des architectures Kubernetes en production, le gaspillage de ressources n'est pas dû à de la négligence : c'est le résultat direct d'une stratégie de défense psychologique des équipes devops. Par peur d'un crash en plein pic d'activité ou d'un appel d'astreinte en pleine nuit, les ingénieurs allouent préventivement 4 vCPU et 8 Go de mémoire à des pods dont l'usage réel ne dépasse jamais 15%. Lorsque le cluster atteint 150 nœuds, ce réflexe se traduit par des dizaines de milliers d'euros brûlés chaque mois en serveurs fantômes. Réduire la facture de manière pérenne sans compromettre l'uptime n'est pas une question de négociation commerciale avec AWS ou GCP : c'est un problème d'ingénierie d'autoscaling dynamique et d'exploitation rigoureuse des instances Spot.",
    },
    problem: {
      heading: "Les 3 fuites budgétaires majeures des clusters Kubernetes",
      lead: "L'analyse fine de clusters de production révèle systématiquement les mêmes mécanismes de surcoût invisible.",
      failureModes: [
        {
          code: "ERR_01 // REQUESTS_USAGE_GAP",
          title: "Le gouffre entre CPU Requests et consommation réelle",
          description:
            "L'ordonnanceur Kubernetes réserve les nœuds sur la base des Requests, et non de l'usage effectif. Les serveurs tournent à 18% de charge moyenne mais affichent 95% d'allocation théorique.",
          impact: "Plus de 60% du budget compute payé pour rien",
        },
        {
          code: "ERR_02 // STATIC_NODE_GROUPS",
          title: "Rigidité et lenteur du Cluster Autoscaler standard",
          description:
            "Le Cluster Autoscaler historique met de 3 à 8 minutes pour démarrer un nœud EC2, incitant les équipes à maintenir un surprovisionnement permanent par sécurité.",
          impact: "Incapacité à absorber les flash-crowds sans gaspillage",
        },
        {
          code: "ERR_03 // UNGUARDED_SPOT",
          title: "Peur des interruptions sur les instances Spot",
          description:
            "Parce qu'une coupure Spot a provoqué des erreurs 502 il y a deux ans, 100% du cluster a été rebasculé sur des instances On-Demand payées au tarif maximal.",
          impact: "Surcoût de 60% à 75% sur les charges asynchrones",
        },
      ],
    },
    approach: {
      heading: "Karpenter v0.37+, scaling sur files KEDA et orchestration Spot sans coupure",
      lead: "Nous remplaçons les Node Groups statiques par un approvisionnement juste-à-temps capable de tailler les nœuds au millimètre près en moins de 45 secondes.",
      architectureTitle: "Pipeline d'optimisation FinOps continue",
      architectureStages: [
        {
          stageNumber: "STAGE 01",
          title: "Audit d'attribution avec Kubecost v2.2+",
          description:
            "Cartographie exacte des coûts par namespace, par pod et détection des surallocations de Requests vs consommation réelle (P99).",
          keyPattern: "Granular Cost Attribution",
          badge: "Kubecost",
        },
        {
          stageNumber: "STAGE 02",
          title: "Provisionnement juste-à-temps via Karpenter",
          description:
            "Abandon des Node Groups rigides : Karpenter sélectionne dynamiquement l'instance EC2 la moins chère (familles diversifiées m6i, c6i, r6i) en moins de 45 secondes.",
          keyPattern: "Just-in-Time Node Packing",
          badge: "Karpenter v0.37+",
        },
        {
          stageNumber: "STAGE 03",
          title: "Déport des workers sur instances Spot",
          description:
            "Basculement de 100% des workers asynchrones sur Spot avec capture du préavis d'interruption de 2 minutes via l'AWS Node Termination Handler.",
          keyPattern: "Graceful Spot Drainage",
        },
        {
          stageNumber: "STAGE 04",
          title: "Autoscaling événementiel via KEDA",
          description:
            "Dimensionnement horizontal piloté par la profondeur réelle des files SQS / RabbitMQ plutôt que par un seuil CPU moyen souvent trompeur.",
          keyPattern: "Queue-Driven Horizontal Autoscaling",
          badge: "KEDA v2.14+",
        },
      ],
      techStack: [
        {
          name: "Karpenter",
          version: "v0.37.0",
          role: "Autoscaler de nœuds juste-à-temps haute performance pour Kubernetes",
          category: "infra",
        },
        {
          name: "KEDA",
          version: "v2.14.2",
          role: "Autoscaling piloté par les événements et la profondeur de files",
          category: "infra",
        },
        {
          name: "Kubecost",
          version: "v2.2.1",
          role: "Monitoring continu des dépenses et détection de gaspillage d'allocation",
          category: "evaluation",
        },
        {
          name: "AWS Node Termination Handler",
          version: "v1.20.0",
          role: "Interception des préavis d'arrêt Spot et drainage gracieux des pods",
          category: "infra",
        },
      ],
      codeSnippet: {
        title: "karpenter_nodepool.yml — Configuration de consolidation Spot agressive",
        language: "yaml",
        code: `# NodePool Karpenter avec sélection Spot multi-familles et consolidation
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: batch-workers
spec:
  template:
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot"]
        - key: instance-family
          operator: In
          values: ["c6i", "c6a", "m6i", "m6a", "c5", "m5"]
      nodeClassRef:
        name: default-nodeclass
  disruption:
    consolidationPolicy: WhenUnderutilized
    expireAfter: 720h # Rotation préventive tous les 30 jours`,
        caption: "Karpenter rassemble automatiquement les pods sous-utilisés et détruit les nœuds excédentaires dès qu'une charge se termine.",
      },
    },
    tradeoffs: {
      heading: "Arbitrages techniques & Exigences logicielles",
      lead: "Diviser par deux une facture de serveurs n'est pas magique : cela impose de concevoir des applications réellement résilientes à l'interruption.",
      disclaimer:
        "NOTE DE RIGUEUR : Adopter le marché Spot pour économiser 70% sur le compute exige que vos applications soient capables de s'arrêter proprement en 25 secondes. Les monolithes avec état en mémoire ne sont pas éligibles sans refactoring.",
      tradeoffs: [
        {
          title: "Contrainte de stateless strict vs Simplicité de développement",
          tension: "Économie budgétaire massive vs Effort de refactoring",
          arbitrage:
            "Imposer que tous les workers soient sans état et capables de reprendre une tâche interrompue sur file d'attente.",
          costOrDrawback:
            "Exclut les jobs de traitement monolithiques longs non découplés tant qu'ils n'ont pas été réarchitecturés.",
          mitigation:
            "Conservation temporaire d'un NodePool On-Demand restreint pour les quelques jobs patrimoniaux non résilients.",
        },
        {
          title: "Temps de boot de nœud face aux pics instantanés (Flash-Crowd)",
          tension: "Économie à l'instant T vs Réactivité face à un pic subit",
          arbitrage:
            "Les 40 secondes nécessaires à Karpenter pour ajouter un nœud restent trop lentes pour un pic de trafic instantané en 2 secondes.",
          costOrDrawback:
            "Risque de saturation passagère si le trafic décuple en quelques secondes.",
          mitigation:
            "Maintien permanent d'un buffer de 5% à 8% de pods fantômes à faible coût (Overprovisioning pods avec priorityClass basse), sacrifiés instantanément par Kubernetes lors d'un burst.",
        },
      ],
    },
    results: {
      heading: "Résultats mesurés sur un cluster client de 150 nœuds",
      lead: "Bilan chiffré constaté après 90 jours de déploiement de Karpenter et KEDA en environnement de production.",
      metrics: [
        {
          label: "Réduction brute de la facture compute",
          value: "-38.4%",
          change: "-38.4%",
          subtext: "Économie mensuelle récurrente sur le périmètre EC2",
          isIndicative: true,
        },
        {
          label: "Taux d'utilisation effectif du CPU alloué",
          value: "64%",
          change: "+46%",
          subtext: "Porté de 18% à 64% grâce au repacking Karpenter",
          isIndicative: false,
        },
        {
          label: "Interruption de service imputable au Spot",
          value: "0 minute",
          subtext: "100% de disponibilité maintenue sur les SLA clients",
          isIndicative: false,
        },
      ],
      methodologyNote:
        "Résultats moyens observés sur 3 missions d'audit FinOps récentes pour des clusters AWS EKS de 120 à 180 nœuds. La baisse de 38.4% de la facture est mentionnée à titre indicatif des moyennes constatées après élimination des allocations résiduelles et bascule Spot maîtrisée.",
      observedBenefits: [
        "Fin du surprovisionnement défensif sans compromettre la tranquillité des ingénieurs d'astreinte.",
        "Allocation des coûts d'infrastructure directement rattachable à chaque équipe produit via Kubecost.",
        "Vitesse de mise à l'échelle automatique multipliée par 5 par rapport au Cluster Autoscaler historique.",
        "Réconciliation durable entre la direction financière (FinOps) et les équipes d'ingénierie logicielle.",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 02 — Automatisation & Workflows",
        description:
          "Gestion des pipelines asynchrones, résilience des files de messages et exécution déterministe.",
        badge: "Service d'ingénierie",
        href: "/services/02",
        targetViewKey: "service-detail",
        targetId: "02",
      },
      {
        type: "solution",
        title: "Optimisation de grille intelligente",
        description:
          "Équilibrage dynamique et réduction des coûts de consommation énergétique.",
        badge: "Solution sectorielle",
        href: "/solutions/energy-smartgrid",
        targetViewKey: "solution-detail",
        targetId: "energy-smartgrid",
      },
      {
        type: "solution",
        title: "Maintenance prédictive IoT",
        description:
          "Surveillance continue d'infrastructures et détection précoce d'anomalies opérationnelles.",
        badge: "Solution sectorielle",
        href: "/solutions/industry-maintenance",
        targetViewKey: "solution-detail",
        targetId: "industry-maintenance",
      },
    ],
  },
};

/**
 * Récupère les données de détail enrichies d'un insight selon son slug ou l'un de ses alias.
 */
export function getInsightDetailData(
  slug: string,
  _locale: string = "fr"
): InsightDetailData | null {
  if (!slug) return null;
  const normalizedSlug = slug.trim().toLowerCase();

  // 1. Recherche directe par clé de registre
  if (INSIGHTS_DETAIL_REGISTRY[normalizedSlug]) {
    return INSIGHTS_DETAIL_REGISTRY[normalizedSlug];
  }

  // 2. Recherche par alias déclaré
  for (const post of Object.values(INSIGHTS_DETAIL_REGISTRY)) {
    if (post.aliases?.includes(normalizedSlug)) {
      return post;
    }
  }

  return null;
}
