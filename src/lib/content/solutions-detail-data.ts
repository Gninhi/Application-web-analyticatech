import type { SolutionDetailData } from "@/types/solution-detail";

/**
 * Registre des données enrichies pour les 6 solutions sectorielles d'Analyticatech.
 * Chaque fiche respecte scrupuleusement les exigences de crédibilité technique :
 * - Problème métier concret (frictions réelles, pas de généralités marketing).
 * - Approche architecturale solide (niveau DSI/CTO).
 * - Métriques officielles du site avec cadre méthodologique transparent.
 * - Limites d'applicabilité et prérequis rigoureux.
 * - Formulations neutres, professionnelles et fermées.
 * - Maillage interne précis vers les services et les insights R&D.
 */
export const SOLUTIONS_DETAIL_REGISTRY: Record<string, SolutionDetailData> = {
  // =========================================================================
  // SOLUTION 01 — LOGISTIQUE & SUPPLY CHAIN
  // =========================================================================
  "logistics-ai": {
    slug: "logistics-ai",
    sector: "Logistique",
    sectorBadge: "Logistique & Supply Chain",
    title: "Optimisation logistique par l'IA :",
    titleAccent: "Ré-ordonnancement dynamique & Prédiction de la demande",
    summary:
      "Ré-ordonnancement dynamique des tournées et prédiction de la demande via modèles ML, réduisant les coûts de transport de 22% et les ruptures de stock de 41%.",
    tags: ["ML", "Optimisation combinatoire", "Prédiction de demande", "VRPTW"],
    problem: {
      heading: "Quand la rigidité des plans statiques heurte les aléas quotidiens du terrain",
      contextNarrative:
        "Dans la majorité des réseaux de distribution, la planification des tournées reste figée la veille pour le lendemain (J-1), tandis que le dimensionnement des stocks repose sur des moyennes historiques glissantes dans le WMS. Dès que la journée d'exploitation démarre, ce modèle théorique s'effondre face aux imprévus réels : créneaux clients décalés, congestions routières soudaines, colis refusés ou avaries véhicules. Tenter de corriger ces écarts manuellement mobilise des dispatcheurs en permanence et produit des trajets sous-optimaux, pendant que les entrepôts oscillent entre surstockage coûteux et ruptures critiques.",
      coreFrictions: [
        {
          title: "Incapacité à recalculer les tournées en cours de journée",
          description:
            "Les TMS traditionnels gèrent des plannings rigides mais ne savent pas réajuster dynamiquement l'ordre des étapes lors d'un retard sans perturber l'ensemble des livraisons suivantes.",
          impact: "Surcoûts kilométriques et retards de livraison en chaîne",
        },
        {
          title: "Effet coup de fouet (Bullwhip effect) sur les stocks tampons",
          description:
            "Des prévisions déconnectées des signaux de vente immédiats provoquent des variations de commandes artificiellement amplifiées le long de la chaîne d'approvisionnement.",
          impact: "BFR immobilisé sur des références dormantes et ruptures sur les tops ventes",
        },
      ],
    },
    approach: {
      heading: "Double moteur d'optimisation combinatoire et d'inférence prédictive",
      lead: "Nous articulons la solution autour d'une architecture à deux étages couplée à un bus d'événements, interfaçable avec vos outils existants sans refonte lourde de votre SI.",
      stages: [
        {
          stageNumber: "STAGE 01",
          title: "Prédiction de la demande supervisée (Gradient Boosted ML)",
          description:
            "Modèles de séries temporelles entraînés sur l'historique de commandes, la saisonnalité, les opérations promotionnelles et les variables exogènes (calendrier, météo).",
          keyPattern: "Supervised Time-Series Forecasting",
          badge: "Prédiction SKU",
        },
        {
          stageNumber: "STAGE 02",
          title: "Optimisation de tournées avec fenêtres de temps (VRPTW)",
          description:
            "Formulation mathématique du problème de tournées avec contraintes strictes : créneaux horaires clients, capacités de charge volumétriques et compartiments de température.",
          keyPattern: "Vehicle Routing Problem with Time Windows (VRPTW)",
        },
        {
          stageNumber: "STAGE 03",
          title: "Ré-ordonnancement dynamique événementiel",
          description:
            "Recalcul automatique et continu des étapes restantes dès qu'un aléa avéré (retard > 20 min, annulation client) est remonté par la télématique ou l'application chauffeur.",
          keyPattern: "Event-Driven Dynamic Replanning",
          badge: "Temps Réel",
        },
        {
          stageNumber: "STAGE 04",
          title: "Intégration bidirectionnelle non disruptive",
          description:
            "Connecteurs API REST et webhooks synchronisant les ordres directement dans le TMS et le WMS existant de l'entreprise.",
          keyPattern: "Bi-directional SI Middleware",
        },
      ],
      integrationDetails:
        "La solution se connecte via des interfaces API standards et webhooks aux principaux TMS et WMS du marché ainsi qu'aux systèmes propriétaires, évitant tout remplacement d'outil de gestion de flotte en place.",
    },
    metrics: {
      heading: "Résultats mesurés & Rigueur méthodologique",
      lead: "Impact quantifié constaté sur les déploiements logistiques clients.",
      items: [
        {
          label: "Coûts de transport consolidés",
          value: "Jusqu'à -22%",
          subtext: "Économie kilométrique, carburant et réduction des heures supplémentaires",
        },
        {
          label: "Ruptures de stock en entrepôt",
          value: "-41%",
          subtext: "Diminution drastique sur les références à forte rotation (classes A et B)",
        },
      ],
      methodology: {
        sampleAndScope:
          "Flottes de transport régulières et plateformes logistiques multi-sites gérant plus de 150 points d'arrêt quotidiens.",
        period: "2024–2025",
        measurementConditions:
          "Mesure comparative avant/après sur périmètre d'activité comparable (volume de colis et saisonnalité identiques) évaluant le coût kilométrique et les ruptures sur références A/B.",
        rigorDisclaimer:
          "Résultats constatés sur les cas clients déployés, dépendant directement de la densité géographique des points de livraison et de la qualité du géocodage initial.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Limites d'applicabilité & Prérequis stricts",
      lead: "Pour garantir la réussite du déploiement, nous validons systématiquement ces critères avant tout engagement.",
      prerequisites: [
        "Disposer d'au moins 12 mois d'historique de commandes horodatées au niveau SKU pour calibrer les modèles prédictifs.",
        "Avoir un référentiel d'adresses clients géocodées avec un taux de fiabilité supérieur à 98%.",
        "Disposer d'une remontée de télématique embarquée ou d'une application mobile conducteur pour les signaux d'étape.",
      ],
      applicabilityLimits: [
        "Inadapté aux flottes artisanales de moins de 10 véhicules réguliers, où des solutions de routage grand public suffisent amplement.",
        "Non applicable aux activités de transport sans récurrence ni prédictibilité minimale (courses urgentes imprévisibles à 100%).",
      ],
      operationalConstraints: [
        "Respect obligatoire de la Réglementation Sociale Européenne (RSE) sur les temps de conduite et de repos des chauffeurs.",
        "Nécessite l'adhésion des équipes conducteurs via une ergonomie mobile évitant tout sentiment de surveillance intrusive.",
        "En cas de force majeure (coupure d'axe autoroutier complet, intempérie extrême), l'arbitrage humain du dispatcheur reste indispensable.",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 02 — Automatisation & Workflows",
        description:
          "Gestion des pipelines d'événements temps réel et intégration des webhooks télématiques.",
        badge: "Service d'ingénierie",
        href: "/services/02",
        targetViewKey: "service-detail",
        targetId: "02",
      },
      {
        type: "service",
        title: "Service 04 — Data & Décision Augmentée",
        description:
          "Modélisation analytique, consolidation des KPIs de transport et tableaux de bord de marge.",
        badge: "Service d'ingénierie",
        href: "/services/04",
        targetViewKey: "service-detail",
        targetId: "04",
      },
      {
        type: "insight",
        title: "Architecture event-driven pour systèmes temps réel",
        description:
          "Découplage asynchrone des flux critiques d'ingénierie sur bus de messages distribué.",
        badge: "Insight R&D",
        href: "/insights/event-driven-agents",
        targetViewKey: "blog-detail",
        targetId: "event-driven-agents",
      },
    ],
    cta: {
      question: "Vous souhaitez évaluer le gisement d'optimisation de vos tournées ou de vos stocks ?",
      buttonLabel: "Demander un cadrage logistique",
    },
  },

  // =========================================================================
  // SOLUTION 02 — FINANCE & CONFORMITÉ
  // =========================================================================
  "finance-agent": {
    slug: "finance-agent",
    sector: "Finance",
    sectorBadge: "Banque & FinTech",
    title: "Agents de conformité réglementaire :",
    titleAccent: "Surveillance temps réel & Détection des anomalies",
    summary:
      "Agents cognitifs surveillant 100% des transactions en temps réel, détectant les anomalies de conformité et générant les rapports régulateurs automatiquement.",
    tags: ["Agents", "Conformité", "Temps réel", "LCB-FT", "TRACFIN"],
    problem: {
      heading: "L'explosion des volumes transactionnels face aux exigences LCB-FT et DORA",
      contextNarrative:
        "Dans le secteur financier et les plateformes de paiement, le passage au virement instantané (SEPA Instant) et le durcissement réglementaire continu (directives LCB-FT, DORA, MIFID II) confrontent les directions de la conformité à un défi insurmontable. Les moteurs de règles traditionnels génèrent un taux de faux positifs astronomique (dépassant fréquemment 90%), obligeant des dizaines d'analystes à éplucher manuellement des alertes bénignes pendant que les schémas de fraude complexe et de blanchiment fractionné passent sous les radars.",
      coreFrictions: [
        {
          title: "Saturation des équipes par les faux positifs",
          description:
            "Les règles statiques par seuils génèrent des milliers d'alertes non pertinentes sur des clients légitimes, noyant les vrais signaux de blanchiment sous le bruit opérationnel.",
          impact: "Temps d'analyse moyen de 45 minutes par dossier et retards de traitement",
        },
        {
          title: "Délai incompressible entre détection et déclaration",
          description:
            "Reconstituer manuellement l'historique KYC, les liens capitalistiques et les flux financiers d'un compte suspect pour étayer une déclaration de soupçon prend plusieurs jours.",
          impact: "Risque d'amende réglementaire ACPR en cas de dépassement des délais légaux",
        },
      ],
    },
    approach: {
      heading: "Pipeline d'analyse cognitive à 2 niveaux et génération de dossiers d'audit",
      lead: "Nous combinons un moteur déterministe à basse latence pour le filtrage immédiat et des agents d'investigation autonomes orchestrés pour l'analyse approfondie.",
      stages: [
        {
          stageNumber: "STAGE 01",
          title: "Filtrage déterministe haute vitesse (< 100 ms)",
          description:
            "Contrôle immédiat des flux entrants contre les listes officielles de sanctions (OFAC, UE, gels des avoirs) et détection des dépassements stricts de seuils.",
          keyPattern: "Low-Latency Sanctions Screening",
          badge: "Latence < 100ms",
        },
        {
          stageNumber: "STAGE 02",
          title: "Investigation cognitive multi-agents (LangGraph & RAG)",
          description:
            "En cas d'anomalie suspecte, un agent autonome extrait l'historique KYC, analyse le comportement transactionnel sur 12 mois et consulte les registres légaux.",
          keyPattern: "Autonomous Compliance Investigation Agent",
        },
        {
          stageNumber: "STAGE 03",
          title: "Pré-rédaction assistée de déclarations de soupçon",
          description:
            "Génération d'un rapport de synthèse structuré prêt pour transmission TRACFIN / ACPR, documentant les faits, les preuves et les typologies d'infraction identifiées.",
          keyPattern: "Automated Regulatory Reporting",
          badge: "Audit Ready",
        },
        {
          stageNumber: "STAGE 04",
          title: "Supervision Human-in-the-loop déterministe",
          description:
            "Point de contrôle obligatoire : aucune déclaration externe n'est émise sans validation formelle et signature du Responsable de la Conformité (RCD).",
          keyPattern: "Human-in-the-Loop Gatekeeper",
        },
      ],
      integrationDetails:
        "Intégration directe sur les flux de paiement au format ISO 20022 et via connecteurs webhooks avec le Core Banking System de l'établissement sans impacter le chemin critique des autorisations.",
    },
    metrics: {
      heading: "Résultats mesurés sur flux de production bancaires",
      lead: "Métriques constatées sur des plateformes de paiement et établissements financiers sous supervision.",
      items: [
        {
          label: "Couverture d'audit transactionnel",
          value: "100%",
          subtext: "Chaque transaction est scorée en streaming sans échantillonnage",
        },
        {
          label: "Latence moyenne de traitement",
          value: "< 3s",
          subtext: "Délai global d'analyse et de scoring par les agents cognitifs",
        },
      ],
      methodology: {
        sampleAndScope:
          "Flux transactionnels en production (virements SEPA, prélèvements, paiements par carte) d'établissements financiers régulés.",
        period: "2024–2025",
        measurementConditions:
          "Mesures de performance observées sur flux réels en continu, évaluant le taux de couverture et la latence P95 de scoring.",
        rigorDisclaimer:
          "Le temps de latence est mesuré sur l'étape de scoring d'anomalie ; le délai d'investigation approfondie par agent reste soumis à la validation humaine finale de l'analyste.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Limites d'applicabilité & Prérequis stricts",
      lead: "La conformité financière n'admettant aucune approximation, les conditions d'exploitation suivantes sont obligatoires.",
      prerequisites: [
        "Disposer de flux d'événements transactionnels normalisés (format ISO 20022 ou schémas JSON stricts).",
        "Avoir une base de données de profils KYC clients à jour et accessible par API interne.",
        "Mettre en place un environnement sécurisé garantissant la non-exfiltration des données financières.",
      ],
      applicabilityLimits: [
        "Inopérant sur les systèmes purement batch nocturnes ne disposant d'aucune infrastructure d'ingestion temps réel.",
        "Ne se substitue pas à la responsabilité légale du Responsable Conformité (la décision finale de déclaration reste 100% humaine).",
      ],
      operationalConstraints: [
        "Respect strict des contraintes RGPD et d'explicabilité : chaque décision ou préconisation de l'agent doit être justifiée de façon déterministe.",
        "Obligation de maintenir à jour les listes de sanctions et règles typologiques en phase avec les publications officielles du régulateur.",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 01 — Raisonnement & RAG",
        description:
          "Indexation haute fidélité des corpus réglementaires et politiques de conformité internes.",
        badge: "Service d'ingénierie",
        href: "/services/01",
        targetViewKey: "service-detail",
        targetId: "01",
      },
      {
        type: "service",
        title: "Service 03 — Systèmes Multi-Agents",
        description:
          "Supervision, traçabilité pas à pas et contrôle des flottes d'agents d'investigation.",
        badge: "Service d'ingénierie",
        href: "/services/03",
        targetViewKey: "service-detail",
        targetId: "03",
      },
      {
        type: "insight",
        title: "Évaluer un système RAG en production",
        description:
          "Bancs d'évaluation, réduction des hallucinations et garde-fous pour secteurs régulés.",
        badge: "Insight R&D",
        href: "/insights/evaluer-systeme-rag-production",
        targetViewKey: "blog-detail",
        targetId: "evaluer-systeme-rag-production",
      },
    ],
    cta: {
      question: "Vous souhaitez moderniser votre dispositif de filtrage et d'audit LCB-FT ?",
      buttonLabel: "Consulter nos experts conformité",
    },
  },

  // =========================================================================
  // SOLUTION 03 — RETAIL & BI PRÉDICTIVE
  // =========================================================================
  "retail-bi": {
    slug: "retail-bi",
    sector: "Retail",
    sectorBadge: "Retail & E-Commerce",
    title: "BI prédictive omnicanal :",
    titleAccent: "Tarification dynamique & Pilotage unifié de la marge",
    summary:
      "Suite décisionnelle unifiée croisant ventes, stocks et signaux comportementaux pour piloter le pricing dynamique et le réassort multi-boutiques.",
    tags: ["BI", "Pricing", "Omnicanal", "dbt", "Snowflake"],
    problem: {
      heading: "La dispersion des données entre magasins physiques et plateformes e-commerce",
      contextNarrative:
        "Pour les enseignes de distribution opérant à la fois des réseaux de boutiques et des sites de vente en ligne, le pilotage de la rentabilité est devenu un casse-tête quotidien. Les données de caisse magasin (POS), les métriques d'acquisition web et les niveaux de stocks d'entrepôts sont cantonnés dans des silos technologiques distincts. Cette fragmentation empêche de mesurer l'élasticité-prix réelle des produits et conduit à des arbitrages paniqués en fin de saison, où des démarques massives détruisent la marge brute pour écouler des stocks mal positionnés.",
      coreFrictions: [
        {
          title: "Guerre des prix et marges érodées par les démarques",
          description:
            "Faute de détection précoce du ralentissement des ventes sur un produit, le prix n'est ajusté qu'en période de soldes avec des rabais destructeurs de valeur.",
          impact: "Érosion continue de 3 à 6 points de marge brute annuelle",
        },
        {
          title: "Chiffres discordants entre départements commerciaux",
          description:
            "Le contrôle de gestion calcule la marge nette avec les retours déduits, tandis que les responsables régionaux pilotent sur le chiffre d'affaires brut de caisse.",
          impact: "Arbitrages budgétaires retardés et litiges internes récurrents",
        },
      ],
    },
    approach: {
      heading: "Architecture Medallion unifiée et modèles d'élasticité-prix",
      lead: "Nous centralisons l'ensemble des flux transactionnels dans un entrepôt de données moderne gouverné par dbt, alimentant à la fois des dashboards certifiés et un moteur de pricing dynamique.",
      stages: [
        {
          stageNumber: "STAGE 01",
          title: "Ingestion omnicanal unifiée sur Snowflake",
          description:
            "Rapprochement en temps quasi-réel des flux de caisse physiques, des transactions e-commerce et des réceptions entrepôt en couche Bronze/Silver.",
          keyPattern: "Omnichannel Medallion Architecture",
        },
        {
          stageNumber: "STAGE 02",
          title: "Couche sémantique certifiée dbt Core",
          description:
            "Modélisation en étoile (Star Schema) et définition centralisée de la marge nette, du stock disponible et du taux d'écoulement.",
          keyPattern: "Single Source of Truth Metrics",
          badge: "dbt Core",
        },
        {
          stageNumber: "STAGE 03",
          title: "Modélisation de l'élasticité-prix par segment",
          description:
            "Algorithmes d'apprentissage statistique évaluant la sensibilité au prix selon le canal de vente, la zone géographique et la profondeur de stock restante.",
          keyPattern: "Price Elasticity Modeling",
        },
        {
          stageNumber: "STAGE 04",
          title: "Restitution décisionnelle & Pilotage d'actions",
          description:
            "Déploiement de tableaux de bord de gouvernance Power BI et émission automatique de recommandations de réassort pour les gestionnaires.",
          keyPattern: "Executive & Operational BI",
          badge: "Power BI DirectQuery",
        },
      ],
      integrationDetails:
        "Connecteurs directs avec les ERP retail majeurs, systèmes de caisse (POS) et plateformes e-commerce standards, assurant une synchronisation sans ressaisie de données.",
    },
    metrics: {
      heading: "Impact chiffré mesuré en conditions d'exploitation",
      lead: "Résultats constatés après déploiement sur des parcs de distribution multi-sites.",
      items: [
        {
          label: "Gain de marge brute moyenne",
          value: "+14%",
          subtext: "Amélioration constatée après rationalisation des remises et optimisation du réassort",
        },
        {
          label: "Tableaux de bord unifiés actifs",
          value: "42",
          subtext: "Outils de pilotage certifiés utilisés quotidiennement par le management",
        },
      ],
      methodology: {
        sampleAndScope:
          "Réseaux de distribution retail et enseignes omnicanales opérant des parcs de boutiques physiques et un canal e-commerce.",
        period: "2024–2025",
        measurementConditions:
          "Résultats mesurés sur les déploiements retail multi-sites, comparant l'évolution de la marge brute et du taux de rotation des stocks sur deux exercices.",
        rigorDisclaimer:
          "Les gains de marge dépendent de la discipline d'application des recommandations tarifaires et de la fraîcheur des données de stock fournies.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Limites d'applicabilité & Prérequis stricts",
      lead: "Une solution décisionnelle n'a de valeur que si les fondations de données sous-jacentes sont saines.",
      prerequisites: [
        "Disposer d'un référentiel article unifié (Master Data Management) partagé entre magasins et site web.",
        "Avoir un flux de remontée des stocks au moins quotidien pour chaque point de vente.",
        "Historique transactionnel d'au moins deux saisons complètes pour capter les cycles de vente.",
      ],
      applicabilityLimits: [
        "Non adapté aux commerces indépendants mono-boutique avec moins de 500 références actives.",
        "Inopérant dans les secteurs où les prix sont imposés par la loi (ex. librairie en France) ou régulés par conventions strictes.",
      ],
      operationalConstraints: [
        "Nécessite de définir des bornes de prix plancher impératives pour protéger le positionnement de marque.",
        "Implication requise des équipes d'acheteurs et chefs de rayon dans la phase de recette des métriques.",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 04 — Data & Décision Augmentée",
        description:
          "Modélisation Medallion sur Snowflake, BI décisionnelle et requêtes en langage naturel.",
        badge: "Service d'ingénierie",
        href: "/services/04",
        targetViewKey: "service-detail",
        targetId: "04",
      },
      {
        type: "solution",
        title: "Optimisation logistique par l'IA",
        description:
          "Ré-ordonnancement dynamique des tournées et prédiction de la demande.",
        badge: "Solution sectorielle",
        href: "/solutions/logistics-ai",
        targetViewKey: "solution-detail",
        targetId: "logistics-ai",
      },
      {
        type: "insight",
        title: "La couche sémantique dbt",
        description:
          "Mettre fin aux chiffres contradictoires entre dashboards et fiabiliser la BI.",
        badge: "Insight R&D",
        href: "/insights/couche-semantique-dbt-bi",
        targetViewKey: "blog-detail",
        targetId: "couche-semantique-dbt-bi",
      },
    ],
    cta: {
      question: "Vous souhaitez unifier vos données de vente et piloter votre marge au centime près ?",
      buttonLabel: "Échanger avec notre pôle Retail BI",
    },
  },

  // =========================================================================
  // SOLUTION 04 — SANTÉ & EXTRACTION NLP
  // =========================================================================
  "healthcare-nlp": {
    slug: "healthcare-nlp",
    sector: "Santé",
    sectorBadge: "Santé & Médical",
    title: "Synthèse clinique & extraction NLP :",
    titleAccent: "Structuration de comptes rendus & Dossiers patients",
    summary:
      "Extraction automatisée et structuration de données non structurées (comptes rendus, imagerie) accélérant le traitement des dossiers de 68%.",
    tags: ["NLP", "LLM", "Médical", "CIM-10", "HDS"],
    problem: {
      heading: "80% des données cliniques sont piégées dans du texte médical non structuré",
      contextNarrative:
        "Dans les établissements hospitaliers, cliniques et centres de recherche, la surcharge documentaire des praticiens est devenue l'un des premiers facteurs d'épuisement professionnel. Les antécédents, traitements, examens biologiques et résultats d'imagerie sont dispersés dans des comptes rendus d'hospitalisation au format PDF scanné, des courriers de confrères et des comptes rendus opératoires dictés. Reconstituer la trajectoire d'un patient complexe avant une réunion de concertation pluridisciplinaire (RCP) ou une admission exige un temps de lecture considérable, avec un risque permanent d'omission d'une contre-indication vitale.",
      coreFrictions: [
        {
          title: "Temps médical confisqué par la recherche documentaire",
          description:
            "Les médecins et secrétariats médicaux passent plusieurs heures par jour à chercher des informations critiques dans des liasses de documents disparates.",
          impact: "Allongement des délais de prise en charge et fatigue cognitive des soignants",
        },
        {
          title: "Risque d'oubli d'antécédents thérapeutiques majeurs",
          description:
            "Une allergie médicamenteuse ou une comorbidité mentionnée incidemment dans un courrier vieux de trois ans peut échapper à la lecture rapide d'un urgentiste.",
          impact: "Risque iatrogène et complications médicales évitables",
        },
      ],
    },
    approach: {
      heading: "Pipeline NLP biomédical souverain et alignement ontologique CIM-10",
      lead: "Nous déployons une suite de traitement automatique du langage naturel hébergée en environnement certifié HDS, assurant l'extraction exacte des entités cliniques sans jamais compromettre le secret médical.",
      stages: [
        {
          stageNumber: "STAGE 01",
          title: "Dé-identification et anonymisation conforme RGPD",
          description:
            "Suppression et pseudonymisation automatique des identifiants patients (nom, prénom, NIR, adresse) avant tout traitement algorithmique.",
          keyPattern: "Medical De-identification Pipeline",
          badge: "Conformité HDS",
        },
        {
          stageNumber: "STAGE 02",
          title: "Reconnaissance d'entités biomédicales (NER clinique)",
          description:
            "Extraction ciblée des diagnostics, posologies, symptômes, molécules et interventions avec résolution sur les référentiels officiels (CIM-10, SNOMED-CT).",
          keyPattern: "Biomedical Entity Recognition & Normalization",
        },
        {
          stageNumber: "STAGE 03",
          title: "Synthèse clinique & RAG haute fidélité",
          description:
            "Génération d'une fiche de synthèse chronologique du patient avec citation cliquable du document et du paragraphe source garantissant l'auditabilité.",
          keyPattern: "Grounded Clinical Summarization",
          badge: "Traçabilité 100%",
        },
        {
          stageNumber: "STAGE 04",
          title: "Interfaçage Dossier Patient Informatisé (DPI)",
          description:
            "Alimentation structurée du DPI de l'établissement via les standards d'interopérabilité en santé (HL7 / FHIR).",
          keyPattern: "HL7 / FHIR Interoperability",
        },
      ],
      integrationDetails:
        "Déploiement sur serveurs qualifiés Hébergeur de Données de Santé (HDS) en France, garantissant qu'aucune donnée de santé ne transite vers des tiers non certifiés.",
    },
    metrics: {
      heading: "Résultats mesurés en environnement hospitalier",
      lead: "Performances observées lors de bancs d'évaluation et de déploiements pilotes.",
      items: [
        {
          label: "Gain de temps sur le traitement des dossiers",
          value: "Jusqu'à 68%",
          subtext: "Accélération de la constitution de la fiche de synthèse patient",
        },
        {
          label: "Erreurs critiques d'omission constatées",
          value: "0 erreur",
          subtext: "Vérifié par double lecture médicale sur les cohortes de test",
        },
      ],
      methodology: {
        sampleAndScope:
          "Dossiers médicaux complexes pluridisciplinaires (notamment oncologie et médecine interne).",
        period: "2024–2025",
        measurementConditions:
          "Mesures issues des bancs d'évaluation et missions pilotes hospitalières, comparant le temps de préparation humaine avec et sans pré-structuration NLP.",
        rigorDisclaimer:
          "Le système opère en assistance exclusive : chaque synthèse générée doit être relue et validée par le praticien responsable.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Limites d'applicabilité & Prérequis stricts",
      lead: "Le secteur médical impose des garde-fous éthiques et techniques stricts que nous respectons intégralement.",
      prerequisites: [
        "Infrastructure d'hébergement impérativement certifiée HDS (Hébergeur de Données de Santé).",
        "Documents sources au format numérique natif ou scannés avec une résolution minimale (300 DPI pour OCR propre).",
        "Validation préalable par le Délégué à la Protection des Données (DPO) de l'établissement.",
      ],
      applicabilityLimits: [
        "Inopérant sur les manuscrits médicaux anciens illisibles sans retranscription manuelle préalable.",
        "Ne constitue en aucun cas un dispositif de diagnostic médical autonome sans supervision humaine.",
      ],
      operationalConstraints: [
        "La signature et la décision clinique finale restent de la responsabilité légale exclusive du médecin.",
        "Interdiction formelle d'utiliser des APIs d'inférence grand public non souveraines pour le traitement des dossiers.",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 01 — Raisonnement & RAG",
        description:
          "Pipelines de recherche vectorielle hybride et garde-fous anti-hallucination.",
        badge: "Service d'ingénierie",
        href: "/services/01",
        targetViewKey: "service-detail",
        targetId: "01",
      },
      {
        type: "insight",
        title: "Évaluer un système RAG en production",
        description:
          "Métriques de fidélité documentaire (Faithfulness) et protocoles d'évaluation continue.",
        badge: "Insight R&D",
        href: "/insights/evaluer-systeme-rag-production",
        targetViewKey: "blog-detail",
        targetId: "evaluer-systeme-rag-production",
      },
      {
        type: "solution",
        title: "Agents de conformité réglementaire",
        description:
          "Surveillance continue et traçabilité rigoureuse des données sensibles.",
        badge: "Solution sectorielle",
        href: "/solutions/finance-agent",
        targetViewKey: "solution-detail",
        targetId: "finance-agent",
      },
    ],
    cta: {
      question: "Vous souhaitez fluidifier l'accès à vos dossiers cliniques tout en respectant la souveraineté HDS ?",
      buttonLabel: "Échanger avec nos ingénieurs santé",
    },
  },

  // =========================================================================
  // SOLUTION 05 — INDUSTRIE & MAINTENANCE PRÉDICTIVE
  // =========================================================================
  "industry-maintenance": {
    slug: "industry-maintenance",
    sector: "Industrie",
    sectorBadge: "Industrie 4.0 & IoT",
    title: "Maintenance prédictive IoT :",
    titleAccent: "Détection précoce d'anomalies & Prolongation d'équipements",
    summary:
      "Détection précoce d'anomalies sur lignes de production réduisant les arrêts imprévus de 34% et prolongeant la durée de vie des équipements de 18 mois.",
    tags: ["IoT", "Séries temporelles", "Edge AI", "MQTT", "GMAO"],
    problem: {
      heading: "L'impasse entre maintenance curative coûteuse et maintenance préventive aveugle",
      contextNarrative:
        "Dans l'industrie manufacturière, lourde ou de transformation, les directeurs d'usine sont pris en étau entre deux maux. D'un côté, la maintenance curative subit des casses d'équipements imprévues (roulements de broche, moteurs de compresseurs, pompes haute pression) qui arrêtent des lignes entières à des coûts horaires vertigineux. De l'autre, la maintenance préventive calendaire remplace systématiquement des composants encore parfaitement sains selon des échéances théoriques, gaspillant du budget pièces et du temps d'arrêt planifié. Traiter les signaux faibles physiques en amont est la seule réponse viable.",
      coreFrictions: [
        {
          title: "Coût astronomique des arrêts non planifiés",
          description:
            "Une casse mécanique soudaine en pleine production entraîne des rebuts de matière première et bloque les équipes en aval pendant plusieurs heures.",
          impact: "Pertes directes de productivité et retards de livraison clients",
        },
        {
          title: "Surconsommation de pièces d'usure en maintenance aveugle",
          description:
            "Remplacer des composants par précaution à date fixe sans vérifier leur dégradation réelle alourdit inutilement le budget de maintenance annuel.",
          impact: "Hausse injustifiée du budget de pièces détachées et de maintenance",
        },
      ],
    },
    approach: {
      heading: "Traitement Edge-to-Cloud de télémétrie vibratoire et détection spectrale",
      lead: "Nous instrumentons vos machines critiques avec des capteurs IoT non invasifs et appliquons des algorithmes de détection d'anomalies sur séries temporelles haute fréquence.",
      stages: [
        {
          stageNumber: "STAGE 01",
          title: "Acquisition Edge haute fréquence (MQTT / OPC-UA)",
          description:
            "Collecte locale sur passerelles industrielles des signaux de vibration (accélérométrie), température de paliers et intensité électrique moteur.",
          keyPattern: "Edge IoT Ingestion",
          badge: "Haute Fréquence",
        },
        {
          stageNumber: "STAGE 02",
          title: "Analyse fréquentielle & Traitement du signal (FFT)",
          description:
            "Transformée de Fourier rapide (FFT) pour isoler les signatures harmoniques caractéristiques des défauts de roulements, désalignements et balourds.",
          keyPattern: "Fast Fourier Transform & Spectral Analysis",
        },
        {
          stageNumber: "STAGE 03",
          title: "Détection d'anomalies non supervisée & RUL",
          description:
            "Modèles d'auto-encodeurs détectant les écarts de comportement par rapport à la signature nominale et estimation de la durée de vie résiduelle (RUL).",
          keyPattern: "Unsupervised Anomaly Detection & RUL",
          badge: "Machine Learning",
        },
        {
          stageNumber: "STAGE 04",
          title: "Génération automatique d'ordres de travail GMAO",
          description:
            "Déclenchement anticipé d'une alerte contextualisée dans la GMAO de l'usine plusieurs semaines avant la rupture mécanique fatale.",
          keyPattern: "Automated CMMS Work Order Dispatch",
        },
      ],
      integrationDetails:
        "Compatibilité native avec les protocoles industriels d'atelier (Modbus, OPC-UA, MQTT, PROFINET) et connecteurs vers les principaux progiciels de GMAO du marché.",
    },
    metrics: {
      heading: "Impact économique mesuré sur lignes de production",
      lead: "Métriques constatées sur des parcs d'équipements industriels instrumentés.",
      items: [
        {
          label: "Réduction des arrêts imprévus",
          value: "Jusqu'à -34%",
          subtext: "Diminution nette des pannes critiques immobilisant les lignes",
        },
        {
          label: "Prolongation de vie des équipements",
          value: "+18 mois",
          subtext: "Extension de la durée de service avant révision lourde ou rebut",
        },
      ],
      methodology: {
        sampleAndScope:
          "Machines tournantes, moteurs électriques industriels et lignes de fabrication continues instrumentées.",
        period: "2024–2025",
        measurementConditions:
          "Résultats mesurés sur lignes de production industrielle instrumentées, comparant les indicateurs d'arrêt (MTBF / MTTR) sur deux années consécutives.",
        rigorDisclaimer:
          "L'efficacité des modèles dépend de la bonne disposition physique des capteurs et d'une période d'apprentissage initial de fonctionnement nominal.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Limites d'applicabilité & Prérequis stricts",
      lead: "Une solution de maintenance prédictive requiert une instrumentation rigoureuse et ne s'improvise pas.",
      prerequisites: [
        "Présence ou installation de capteurs physiques adaptés (ex. accéléromètres 10 kHz pour l'analyse vibratoire fine).",
        "Réseau local d'atelier stable permettant la transmission des données de passerelle vers le système d'analyse.",
        "Période d'apprentissage initial de 4 à 8 semaines en régime nominal pour calibrer la signature spectrale de référence.",
      ],
      applicabilityLimits: [
        "Inopérant sur les pannes purement aléatoires d'origine externe (choc accidentel cariste, micro-coupure réseau électrique).",
        "Non rentable sur les machines auxiliaires à faible coût de remplacement sans impact sur la chaîne de production.",
      ],
      operationalConstraints: [
        "Nécessite la collaboration des techniciens de maintenance d'atelier pour qualifier les premières alertes émises.",
        "Environnements industriels extrêmes (très haute température, poussières explosives ATEX) nécessitant des capteurs certifiés spécifiques.",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 02 — Automatisation & Workflows",
        description:
          "Pipelines d'orchestration résilients pour la circulation des événements industriels.",
        badge: "Service d'ingénierie",
        href: "/services/02",
        targetViewKey: "service-detail",
        targetId: "02",
      },
      {
        type: "service",
        title: "Service 03 — Systèmes Multi-Agents",
        description:
          "Coordination autonome entre agents de diagnostic d'atelier et systèmes de commande.",
        badge: "Service d'ingénierie",
        href: "/services/03",
        targetViewKey: "service-detail",
        targetId: "03",
      },
      {
        type: "insight",
        title: "Architecture event-driven pour systèmes temps réel",
        description:
          "Bus d'événements Kafka et résistance aux coupures réseau dans l'industrie.",
        badge: "Insight R&D",
        href: "/insights/event-driven-agents",
        targetViewKey: "blog-detail",
        targetId: "event-driven-agents",
      },
    ],
    cta: {
      question: "Vous souhaitez éliminer les arrêts de production imprévus sur votre parc machine ?",
      buttonLabel: "Cadrer un audit IoT industriel",
    },
  },

  // =========================================================================
  // SOLUTION 06 — ÉNERGIE & SMART GRID
  // =========================================================================
  "energy-smartgrid": {
    slug: "energy-smartgrid",
    sector: "Énergie",
    sectorBadge: "Smart Grid & Énergie",
    title: "Optimisation de grille intelligente :",
    titleAccent: "Équilibrage offre/demande & Arbitrage sur marchés spot",
    summary:
      "Équilibrage offre/demande en temps réel et arbitrage sur marchés spot par RL, générant 850 k€ d'économies annuelles.",
    tags: ["Reinforcement Learning", "Smart Grid", "Arbitrage", "EPEX SPOT"],
    problem: {
      heading: "La volatilité extrême des marchés de l'énergie et l'intermittence des renouvelables",
      contextNarrative:
        "L'intégration massive des sources d'énergie renouvelable (solaire photovoltaïque, éolien) a profondément déstabilisé le modèle économique des gestionnaires de réseaux et des gros consommateurs industriels. La production est devenue intermittente et météo-dépendante, tandis que les prix de l'électricité sur les marchés horaires (EPEX SPOT) oscillent brutalement, atteignant des pics tarifaires punitifs lors des tensions de réseau ou s'effondrant en prix négatifs. Les industriels et producteurs incapables d'ajuster dynamiquement leur consommation ou leur stockage subissent des factures d'approvisionnement démesurées.",
      coreFrictions: [
        {
          title: "Pénalités d'effacement et surcoûts lors des heures de pointe",
          description:
            "Consommer au prix fort lors des pointes de demande sans capacité d'effacement rapide pèse lourdement sur les marges d'exploitation.",
          impact: "Factures énergétiques volatiles et imprévisibles pour les sites industriels",
        },
        {
          title: "Sous-valorisation des actifs de flexibilité (batteries, effacement)",
          description:
            "Les parcs de stockage batterie ou les charges modulables sont souvent gérés par des règles fixes qui manquent les opportunités d'arbitrage horaire les plus lucratives.",
          impact: "Retour sur investissement des installations de stockage ralenti de plusieurs années",
        },
      ],
    },
    approach: {
      heading: "Optimisation combinatoire en temps réel et apprentissage par renforcement (RL)",
      lead: "Notre moteur d'arbitrage croise prévisions de production locale, cours de bourse de l'électricité et contraintes physiques des sites pour piloter automatiquement les transferts de charge.",
      stages: [
        {
          stageNumber: "STAGE 01",
          title: "Prévision météorologique & Profil de consommation",
          description:
            "Modélisation continue de la production solaire/éolienne attendue et de la demande incompressible du site à horizon 15 minutes, 24h et 72h.",
          keyPattern: "Multi-Horizon Energy Forecasting",
        },
        {
          stageNumber: "STAGE 02",
          title: "Ingestion des cours de marché spot (EPEX / Day-Ahead)",
          description:
            "Récupération en temps réel des signaux de prix, ordres de réserve primaire/secondaire et prévisions d'écart du gestionnaire de réseau (RTE).",
          keyPattern: "Spot Market Telemetry Ingestion",
          badge: "EPEX SPOT",
        },
        {
          stageNumber: "STAGE 03",
          title: "Arbitrage algorithmique par Apprentissage par Renforcement",
          description:
            "Optimisation continue déterminant le mix idéal : charge ou décharge batterie, effacement de processus industriels ou réinjection sur le réseau.",
          keyPattern: "Reinforcement Learning & Mixed-Integer Linear Programming",
          badge: "Optimisation RL",
        },
        {
          stageNumber: "STAGE 04",
          title: "Télécommande et pilotage automatique des équipements",
          description:
            "Envoi d'ordres automatisés vers les automates de gestion d'énergie (EMS) sur site avec temps de réponse inférieur à 15 minutes.",
          keyPattern: "Automated Energy Management System (EMS) Dispatch",
        },
      ],
      integrationDetails:
        "Interfaçage sécurisé avec les automates de contrôle énergétique (EMS) sur site et les passerelles API des courtiers en énergie et agrégateurs de flexibilité.",
    },
    metrics: {
      heading: "Gains économiques vérifiés en conditions réelles",
      lead: "Économies annuelles constatées sur des sites industriels et portefeuilles d'actifs énergétiques.",
      items: [
        {
          label: "Économies annuelles générées",
          value: "Jusqu'à 850 k€/an",
          subtext: "Gains consolidés sur l'effacement aux heures de pointe et arbitrages spot",
        },
        {
          label: "Disponibilité opérationnelle du système",
          value: "99.9%",
          subtext: "Maintien de la continuité d'alimentation des installations critiques",
        },
      ],
      methodology: {
        sampleAndScope:
          "Sites industriels électro-intensifs et portefeuilles d'actifs renouvelables raccordés au réseau haute tension.",
        period: "2024–2025",
        measurementConditions:
          "Modélisation et retours d'exploitation sur réseaux d'énergie, comparant le coût d'approvisionnement optimisé par rapport à un contrat d'achat statique de référence.",
        rigorDisclaimer:
          "Les économies dépendent directement de la puissance souscrite flexible et du niveau de volatilité des cours horaires de l'électricité.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Limites d'applicabilité & Prérequis stricts",
      lead: "L'arbitrage énergétique exige des caractéristiques d'installation précises pour être rentable.",
      prerequisites: [
        "Disposer d'une puissance modulable (capacité d'effacement ou de stockage batterie) d'au moins 500 kW.",
        "Avoir un contrat d'approvisionnement avec indexation horaire ou être adossé à un agrégateur de flexibilité de marché.",
        "Automates sur site capables de recevoir et d'exécuter des consignes télécommandées en moins de 15 minutes.",
      ],
      applicabilityLimits: [
        "Inadapté aux bâtiments tertiaires standards ou aux petites PME sans flexibilité de consommation.",
        "Non applicable aux sites industriels fonctionnant à charge continue 100% incompressible sans aucune tolérance de modulation.",
      ],
      operationalConstraints: [
        "Respect absolu des contraintes techniques des équipements (limitation des cycles de décharge pour préserver la durée de vie des batteries).",
        "Priorité absolue à la sécurité industrielle : aucun ordre d'effacement ne doit impacter les processus de sécurité de l'usine.",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 02 — Automatisation & Workflows",
        description:
          "Exécution résiliente des flux de commandes vers les automates de gestion d'énergie.",
        badge: "Service d'ingénierie",
        href: "/services/02",
        targetViewKey: "service-detail",
        targetId: "02",
      },
      {
        type: "solution",
        title: "Maintenance prédictive IoT",
        description:
          "Surveillance continue d'équipements et détection précoce d'anomalies opérationnelles.",
        badge: "Solution sectorielle",
        href: "/solutions/industry-maintenance",
        targetViewKey: "solution-detail",
        targetId: "industry-maintenance",
      },
      {
        type: "insight",
        title: "FinOps cloud-native",
        description:
          "Principes d'optimisation dynamique des coûts de compute et d'infrastructure.",
        badge: "Insight R&D",
        href: "/insights/finops-cloud-native",
        targetViewKey: "blog-detail",
        targetId: "finops-cloud-native",
      },
    ],
    cta: {
      question: "Vous souhaitez valoriser votre flexibilité énergétique et réduire vos factures d'électricité ?",
      buttonLabel: "Étudier votre potentiel d'arbitrage",
    },
  },

  /* -------------------------------------------------------------------------- */
  /* 07 — DEALSCOOP (M&A & PRIVATE EQUITY)                                      */
  /* -------------------------------------------------------------------------- */
  "dealscoop": {
    slug: "dealscoop",
    sector: "M&A & Private Equity",
    sectorBadge: "NOUVELLE OFFRE // M&A & PRIVATE EQUITY",
    statusBadge: "Nouvelle offre",
    statusType: "new",
    title: "Sourcing d'opportunités M&A :",
    titleAccent: "Détection & Scoring par l'IA",
    summary:
      "Moteur d'origination propriétaire transformant le flux continu de signaux d'affaires faibles et forts (gouvernance, recrutements clés, expansion, transmission) en cibles qualifiées et scorées selon votre thèse d'investissement, pour fonds de Private Equity, banques d'affaires et directions M&A.",
    tags: [
      "Origination",
      "Signaux d'affaires",
      "Scoring M&A",
      "Deal Flow",
      "Off-Market",
      "Private Equity",
    ],
    problem: {
      heading: "Le paradoxe du sourcing M&A : saturation des enchères vs opacité du marché caché",
      contextNarrative:
        "Dans un environnement d'investissement où les processus d'enchères intermédiés (banques d'affaires, mandats sell-side) subissent une inflation structurelle des multiples d'EBITDA et réduisent les marges de manœuvre, la génération de « deal flow propriétaire » (deals bilatéraux hors marché) est devenue le premier levier de création de valeur des fonds de Private Equity et des directions M&A. Cependant, identifier des PME/ETI matures et rentables avant qu'elles ne soient officiellement mises sur le marché exige un effort humain colossal : les équipes d'origination consacrent jusqu'à 70% de leur temps à croiser manuellement des annuaires statiques et des registres légaux tardifs, découvrant souvent les opportunités une fois le processus compétitif déjà engagé.",
      coreFrictions: [
        {
          title: "Dépendance au flux entrant intermédié (Inbound) & surenchère des multiples",
          description:
            "Participer exclusivement à des processus d'enchères organisés où 15 à 30 fonds surenchérissent sur l'EBITDA, comprimant le TRI cible et interdisant les discussions stratégiques bilatérales approfondies avec les fondateurs.",
          impact: "Valorisations d'entrée sous tension, rareté des opportunités exclusives et prime d'enchère systématique.",
        },
        {
          title: "Dispersion et latence des signaux faibles de transmission",
          description:
            "Les catalyseurs réels de cession (âge du dirigeant-fondateur sans relève familiale, recomposition actionnariale, transition managériale avec recrutement d'un DAF de transition, fin de cycle de détention LBO à 4-5 ans) sont disséminés entre les annonces légales (BODACC/INPI), la presse économique régionale et les réseaux professionnels.",
          impact: "Perte du temps d'avance stratégique : la cible est contactée trop tard, une fois le mandat de vente déjà signé.",
        },
        {
          title: "Approche outbound générique et chronophage pour les analystes",
          description:
            "Prise de contact « à froid » impersonnelle auprès de dirigeants d'entreprise sur-sollicités, faute d'une contextualisation précise du déclencheur business et d'une qualification préalable d'alignement avec la thèse d'investissement.",
          impact: "Taux de réponse des dirigeants inférieur à 5% et gaspillage de bande passante des équipes d'investissement.",
        },
      ],
    },
    approach: {
      heading: "Architecture Dealscoop : Ingestion multi-sources, extraction d'événements & scoring de thèse",
      lead: "Dealscoop implémente une chaîne d'origination automatisée qui capture, consolide et qualifie les signaux d'affaires en continu pour délivrer aux investisseurs des dossiers d'opportunités actionnables avec angle d'approche personnalisé.",
      stages: [
        {
          stageNumber: "01",
          title: "Ingestion multi-registres & capture d'événements légaux",
          description:
            "Indexation continue des flux légaux et administratifs (BODACC, greffes INPI, modifications statutaires, dépôts de comptes), complétée par la veille de la presse quotidienne régionale (PQR) et des plateformes de recrutement de profils stratégiques (C-level, directeurs de développement).",
          keyPattern: "Event-Driven ETL & Scraping résilient",
          badge: "Ingestion multi-sources",
        },
        {
          stageNumber: "02",
          title: "Normalisation & détection de signaux faibles pré-transactionnels",
          description:
            "Extraction d'entités nommées (NER) et chronologie d'événements : détection des variations d'actionnariat, dissociation des mandats président / DG, franchissement de seuils d'effectifs, ou projets d'extension d'usines / levée d'actifs industriels.",
          keyPattern: "Knowledge Graph d'entreprises & NLP",
          badge: "Signal Detection",
        },
        {
          stageNumber: "03",
          title: "Scoring d'alignement à double étage (Fit Thèse x Propension)",
          description:
            "Évaluation algorithmique pondérée : d'une part le Fit Thèse (secteurs NAF/métier cibles, seuils de CA/EBITDA, intensité capitalistique, géographie, potentiel de build-up), d'autre part la Propension Transactionnelle (conjonction de signaux indiquant une ouverture imminente du capital ou une transmission).",
          keyPattern: "Multi-Factor Scoring Matrix",
          badge: "Algorithme de scoring",
        },
        {
          stageNumber: "04",
          title: "Fiches d'origination & dossiers d'approche contextualisés",
          description:
            "Génération automatique de fiches de synthèse pour les analystes : cartographie de gouvernance, historique des événements déclencheurs, points d'accroche sur-mesure pour amorcer une prise de contact bilatérale de haute valeur avec le dirigeant.",
          keyPattern: "Automated Teaser & CRM Sync",
          badge: "Actionnabilité Deal Flow",
        },
      ],
      integrationDetails:
        "Interconnexion native avec les CRM Private Equity & M&A de place (DealFabric, Salesforce, HubSpot, Affinity) via webhooks et API REST sécurisées pour une injection directe des cibles qualifiées dans le pipeline sans ressaisie manuelle.",
    },
    metrics: {
      heading: "Cadre de qualification & engagements méthodologiques",
      lead: "Dealscoop étant une nouvelle offre, nous refusons formellement de publier des métriques de résultat commercial invérifiables (ex. faux taux de transformation ou fausses économies). Les indicateurs ci-dessous définissent nos engagements stricts de couverture technique, de traçabilité et d'intégrité de la veille.",
      items: [
        {
          label: "Couverture des sources légales",
          value: "100%",
          subtext:
            "Flux BODACC, greffes INPI et annonces légales françaises indexés sans échantillonnage ni latence.",
        },
        {
          label: "Traçabilité & Vérifiabilité",
          value: "100%",
          subtext:
            "Zéro hallucination : chaque signal détecté pointe vers un lien officiel daté et une source primaire vérifiable.",
        },
      ],
      methodology: {
        sampleAndScope:
          "Périmètre PME et ETI indépendantes françaises (chiffre d'affaires de 5 M€ à 150 M€) dans les secteurs industriels, B2B, tech et services.",
        period:
          "Phase de qualification pilote et calibrage d'algorithmes (2025–2026).",
        measurementConditions:
          "Backtesting méthodologique sur un échantillon de 500 opérations de transmission et d'ouverture de capital récentes pour étalonner la précocité de détection des signaux.",
        rigorDisclaimer:
          "La concrétisation d'un deal dépend souverainement de la relation bilatérale et de la négociation financière menée par l'investisseur. Dealscoop fournit l'amont stratégique et le gain de temps d'origination sans allégation de closing garantie.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Limites d'applicabilité & Prérequis de calibrage",
      lead: "Dealscoop est un outil d'origination ciblée pour thèses de Private Equity et M&A : il nécessite un cadre stratégique rigoureux et ne convient pas à tous les contextes d'affaires.",
      prerequisites: [
        "Thèse d'investissement formalisée : définition explicite des critères d'adéquation (chiffre d'affaires minimum, seuils de rentabilité, sous-secteurs d'intérêt, critères d'exclusion stricts, thèses de build-up).",
        "Ressources d'outbound dédiées : présence d'une équipe (chargés d'affaires, directeurs d'investissement, associés) en mesure de conduire les échanges directs avec les fondateurs ciblés.",
        "Outil de pipeline (CRM) opérationnel : pour historiser les interactions, qualifier les refus et éviter de démarcher des entreprises déjà sous mandat ou en portefeuille.",
      ],
      applicabilityLimits: [
        "TPE et micro-entreprises (< 3 M€ de CA) : informations légales parcellaires, comptes souvent confidentiels et faible empreinte publique limitant la détection algorithmique.",
        "Opérations « Distressed » / Restructuration judiciaire lourde : les procédures collectives requièrent une veille de tribunaux de commerce spécifique avec analyse de passif non couverte par Dealscoop.",
        "Sociétés cotées : l'approche bilatérale off-market n'est pas applicable aux marchés boursiers réglementés (obligations AMF, déclarations de franchissement de seuils obligatoires).",
      ],
      operationalConstraints: [
        "Délai légal de publication des comptes : les dépôts au greffe peuvent intervenir jusqu'à 7 mois après la clôture de l'exercice fiscal (compensé par les signaux faibles RH et de presse).",
        "Cloisonnement strict des thèses : isolation totale des configurations de recherche entre clients (les critères de thèse et cibles prioritaires d'un fonds ne sont jamais partagés avec un autre).",
      ],
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 01 — Raisonnement & Agents Cognitifs",
        description:
          "Pipelines RAG et modèles cognitifs pour l'extraction d'informations dans des documents financiers complexes.",
        badge: "Service d'ingénierie",
        href: "/services/01",
        targetViewKey: "service-detail",
        targetId: "01",
      },
      {
        type: "service",
        title: "Service 04 — Data & Décision Augmentée",
        description:
          "Entrepôts analytiques unifiés et modélisation sémantique pour le pilotage d'indicateurs de performance.",
        badge: "Service d'ingénierie",
        href: "/services/04",
        targetViewKey: "service-detail",
        targetId: "04",
      },
      {
        type: "insight",
        title: "Évaluer un système RAG en production",
        description:
          "Méthodes d'évaluation et garde-fous pour extraire des signaux fiables depuis des documents non structurés.",
        badge: "Insight R&D",
        href: "/insights/evaluer-systeme-rag-production",
        targetViewKey: "blog-detail",
        targetId: "evaluer-systeme-rag-production",
      },
    ],
    cta: {
      question: "Vous souhaitez structurer un moteur d'origination propriétaire aligné sur votre thèse d'investissement ?",
      buttonLabel: "Échanger sur votre thèse d'origination",
    },
  },
};

const SOLUTION_ALIASES: Record<string, string> = {
  "dealscoop-ma": "dealscoop",
  "ma-sourcing": "dealscoop",
  "private-equity-sourcing": "dealscoop",
  "sourcing-ma": "dealscoop",
};

/**
 * Récupère les données de détail enrichies d'une solution selon son slug.
 */
export function getSolutionDetailData(
  slug: string,
  _locale: string = "fr"
): SolutionDetailData | null {
  if (!slug) return null;
  const normalizedSlug = slug.trim().toLowerCase();
  const resolvedSlug = SOLUTION_ALIASES[normalizedSlug] ?? normalizedSlug;
  return SOLUTIONS_DETAIL_REGISTRY[resolvedSlug] ?? null;
}
