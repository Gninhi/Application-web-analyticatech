import type { SolutionDetailData } from "@/types/solution-detail";

/**
 * Registre des fiches détaillées de la page Solutions.
 *
 * Charte de contenu (voir AGENTS.md) :
 * - « Projets en cours » : produits réellement construits par Analyticatech,
 *   décrits d'après leur dépôt de code. Statut exact, aucune métrique de
 *   résultat tant qu'elle n'a pas été mesurée sur un usage réel.
 * - « Pistes à construire » : idées assumées comme telles, jamais présentées
 *   comme des réalisations.
 * - Aucun nom de client, aucun chiffre d'impact, aucune certification.
 */

const SERVICE_LINKS_FR = {
  rag: {
    type: "service" as const,
    title: "Raisonnement & RAG",
    description: "Des assistants qui répondent à partir de vos documents, en citant leurs sources.",
    badge: "Service 01",
    href: "/services/01",
    targetViewKey: "service-detail" as const,
    targetId: "01",
  },
  automation: {
    type: "service" as const,
    title: "Automatisation & Workflows",
    description: "Relier vos outils et supprimer les ressaisies, avec des étapes de validation.",
    badge: "Service 02",
    href: "/services/02",
    targetViewKey: "service-detail" as const,
    targetId: "02",
  },
  agents: {
    type: "service" as const,
    title: "Orchestration Multi-Agents",
    description: "Plusieurs programmes d'IA qui se répartissent le travail, sous contrôle humain.",
    badge: "Service 03",
    href: "/services/03",
    targetViewKey: "service-detail" as const,
    targetId: "03",
  },
  data: {
    type: "service" as const,
    title: "Data & Décision Augmentée",
    description: "Des indicateurs définis une fois et des tableaux de bord pour la direction.",
    badge: "Service 04",
    href: "/services/04",
    targetViewKey: "service-detail" as const,
    targetId: "04",
  },
};

const SERVICE_LINKS_EN = {
  rag: {
    ...SERVICE_LINKS_FR.rag,
    title: "Reasoning & RAG",
    description: "Assistants that answer from your documents and cite their sources.",
    href: "/en/services/01",
  },
  automation: {
    ...SERVICE_LINKS_FR.automation,
    title: "Automation & Workflows",
    description: "Connect your tools and remove re-keying, with approval steps.",
    href: "/en/services/02",
  },
  agents: {
    ...SERVICE_LINKS_FR.agents,
    title: "Multi-Agent Orchestration",
    description: "Several AI programs sharing the work, under human control.",
    href: "/en/services/03",
  },
  data: {
    ...SERVICE_LINKS_FR.data,
    title: "Data & Augmented Decision",
    description: "Indicators defined once and dashboards for management.",
    href: "/en/services/04",
  },
};

const SOLUTIONS_DETAIL_FR: Record<string, SolutionDetailData> = {
  // =========================================================================
  // PROJET — CIBLIOO (sourcing M&A, dépôt privé Gninhi/Ciblioo)
  // =========================================================================
  ciblioo: {
    slug: "ciblioo",
    sector: "M&A · Transmission d'entreprises",
    sectorBadge: "Projet en cours",
    statusBadge: "En développement",
    statusType: "new",
    title: "Ciblioo :",
    titleAccent: "du brief de mandat à une liste de cibles documentée",
    summary:
      "Une plateforme pour les cabinets de conseil en transmission et en M&A : à partir d'un mandat d'achat ou de vente, elle constitue une liste d'entreprises cibles, rapproche les données des registres publics et rattache chaque information à sa source. Le chargé d'affaires garde la décision finale sur chaque entreprise retenue.",
    tags: ["M&A", "Registres publics", "Traçabilité des sources", "Revue humaine"],
    problem: {
      heading: "Vérifier une liste de cibles prend plus de temps que de la constituer",
      contextNarrative:
        "Un cabinet qui travaille sur un mandat doit remettre à son client une liste d'entreprises justifiée. La difficulté n'est pas de trouver des noms : c'est de vérifier l'identité de chaque société, de rassembler les informations utiles depuis plusieurs sources et de pouvoir montrer d'où vient chaque donnée. Fait à la main dans des tableurs, ce travail prend plusieurs jours et laisse passer des erreurs gênantes devant le client.",
      coreFrictions: [
        {
          title: "Identités incertaines",
          description:
            "Une même entreprise apparaît sous plusieurs noms ou plusieurs établissements ; les doublons et les confusions de société se glissent dans la liste.",
          impact: "Risque de présenter au client une mauvaise entreprise.",
        },
        {
          title: "Sources dispersées",
          description:
            "Les informations utiles sont réparties entre l'annuaire des entreprises, les annonces légales (BODACC) et d'autres bases, chacune avec son format.",
          impact: "Collecte longue et difficile à reproduire.",
        },
        {
          title: "Preuves introuvables",
          description:
            "Quand le client demande pourquoi une entreprise a été retenue, il faut retrouver la source de chaque chiffre après coup.",
          impact: "Justification fragile de la sélection.",
        },
        {
          title: "Automatisations maison fragiles",
          description:
            "Les enchaînements construits avec des outils d'automatisation génériques produisent des doublons et des données sans source rattachée.",
          impact: "Temps passé à corriger plutôt qu'à analyser.",
        },
      ],
    },
    approach: {
      heading: "Chaque valeur affichée ouvre sa preuve, ou est marquée inconnue",
      lead:
        "Ciblioo organise le travail par dossier de mandat et par lot d'entreprises. Le principe de conception : aucune donnée n'est affichée sans sa source, sa date et l'extrait d'où elle provient.",
      stages: [
        {
          stageNumber: "01",
          title: "Dossier de mandat",
          description:
            "Le brief du client (secteur, taille, zone géographique, critères) est enregistré et versionné : on sait à tout moment sur quels critères la liste a été construite.",
          badge: "Cadrage",
        },
        {
          stageNumber: "02",
          title: "Import et rapprochement d'identité",
          description:
            "Les entreprises importées sont normalisées et rattachées à leur numéro SIREN ; les cas ambigus sont mis de côté pour vérification au lieu d'être devinés.",
          badge: "Identité",
        },
        {
          stageNumber: "03",
          title: "Collecte depuis les registres publics",
          description:
            "Les connecteurs vers l'API Recherche d'entreprises (DINUM) et les annonces légales du BODACC sont branchés ; d'autres sources seront ajoutées selon les besoins constatés.",
          badge: "Sources",
        },
        {
          stageNumber: "04",
          title: "Revue humaine et export",
          description:
            "Le chargé d'affaires valide ou écarte chaque entreprise ; la liste exportée conserve, pour chaque donnée, la source et la date de consultation.",
          badge: "Décision",
        },
      ],
      integrationDetails:
        "Application web multi-espaces : les données de chaque cabinet sont isolées de celles des autres. La liste finale s'exporte pour être reprise dans les outils habituels du cabinet.",
    },
    metrics: {
      heading: "Où en est le projet",
      lead:
        "Ciblioo est en développement. Les fondations (isolation des données, connecteurs, navigation) sont en place ; le parcours complet « du brief à la liste exportée » est en cours de construction.",
      items: [
        {
          label: "Statut",
          value: "En développement",
          subtext: "Non commercialisé à ce jour.",
        },
        {
          label: "Déjà en place",
          value: "Fondations techniques",
          subtext: "Isolation des données par cabinet, connecteurs DINUM et BODACC, sécurité de base.",
        },
        {
          label: "Prochaine étape",
          value: "Parcours complet par lot",
          subtext: "Import, rapprochement, collecte, revue et export avec preuves.",
        },
        {
          label: "Ensuite",
          value: "Pilote avec un cabinet",
          subtext: "Un premier pilote est prévu avec un cabinet de conseil en transmission.",
        },
      ],
      methodology: {
        sampleAndScope:
          "Cabinets de conseil en transmission et M&A sur le segment des PME et ETI françaises.",
        period: "Pilote après la livraison du parcours complet ; aucune date annoncée.",
        measurementConditions:
          "Pendant le pilote : temps nécessaire pour constituer et vérifier un lot, et nombre d'erreurs d'identité, mesurés avant et avec l'outil.",
        rigorDisclaimer:
          "Aucun gain de temps n'est annoncé tant qu'il n'a pas été mesuré pendant le pilote.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Ce que Ciblioo fait, et ce qu'il ne promet pas",
      lead: "Le périmètre est volontairement étroit pour rester vérifiable.",
      prerequisites: [
        "Un mandat avec des critères de sélection explicites.",
        "Des entreprises immatriculées en France, identifiables par leur SIREN.",
        "Un chargé d'affaires disponible pour la revue des cas ambigus.",
      ],
      applicabilityLimits: [
        "Ne prédit pas quelles entreprises « vont se vendre » : aucune donnée fiable ne permet de le promettre honnêtement.",
        "N'envoie aucun message de prospection automatiquement.",
        "Ne couvre pas, à ce stade, les entreprises étrangères.",
      ],
      operationalConstraints: [
        "Respect des conditions d'utilisation de chaque source publique.",
        "Traitement des données des dirigeants conforme au RGPD.",
        "Données d'un cabinet jamais visibles par un autre.",
      ],
    },
    relatedResources: [SERVICE_LINKS_FR.data, SERVICE_LINKS_FR.automation, SERVICE_LINKS_FR.agents],
    cta: {
      question: "Vous travaillez en transmission ou en M&A et ce problème vous parle ?",
      buttonLabel: "Échanger sur Ciblioo",
    },
  },

  // =========================================================================
  // PROJET — CONTENTOPS HARNESS (dépôt public Gninhi/Content-builder)
  // =========================================================================
  contentops: {
    slug: "contentops",
    sector: "Marketing · Contenu B2B",
    sectorBadge: "Projet en cours",
    statusBadge: "Prototype fonctionnel",
    statusType: "new",
    title: "ContentOps Harness :",
    titleAccent: "produire du contenu avec l'IA, sans rien publier sans validation",
    summary:
      "Un système éditorial pour les entreprises qui publient sur LinkedIn et X : il transforme une veille, des notes et des retours d'expérience en brouillons, les fait passer par un contrôle qualité, puis attend la validation explicite d'un responsable avant toute publication. Ce n'est pas un outil de publication automatique.",
    tags: ["Agents IA", "Validation humaine", "LinkedIn", "Traçabilité"],
    problem: {
      heading: "L'IA écrit vite, mais une publication ratée engage l'entreprise",
      contextNarrative:
        "Générer des posts avec l'IA est devenu facile. Ce qui reste difficile, c'est de garder la maîtrise : respecter la ligne éditoriale de l'entreprise, éviter les erreurs factuelles, savoir qui a validé quoi et ne jamais publier deux fois le même contenu par accident.",
      coreFrictions: [
        {
          title: "Publication sans relecture",
          description:
            "Les outils de publication automatique laissent partir des contenus que personne n'a relus.",
          impact: "Risque d'image et d'erreur publique.",
        },
        {
          title: "Ligne éditoriale diluée",
          description:
            "Chaque brouillon généré s'éloigne un peu du ton et des règles de la marque.",
          impact: "Contenus génériques, peu crédibles.",
        },
        {
          title: "Aucune trace des décisions",
          description:
            "Impossible de retrouver qui a approuvé un contenu, ni dans quelle version.",
          impact: "Responsabilités floues.",
        },
        {
          title: "Doublons de publication",
          description:
            "Une erreur réseau pendant l'envoi peut conduire à republier le même post.",
          impact: "Publication en double, gênante.",
        },
      ],
    },
    approach: {
      heading: "Une chaîne éditoriale avec un point d'arrêt humain obligatoire",
      lead:
        "Chaque contenu suit un parcours défini, de l'idée à la publication. L'IA prépare ; une personne habilitée décide.",
      stages: [
        {
          stageNumber: "01",
          title: "Veille et idées",
          description:
            "Des sources choisies (flux RSS, notes internes) alimentent une liste d'idées classées, que l'équipe trie.",
          badge: "Veille",
        },
        {
          stageNumber: "02",
          title: "Brouillons par plateforme",
          description:
            "Des agents IA rédigent des brouillons adaptés à LinkedIn et à X, en suivant le profil de marque défini par l'entreprise.",
          badge: "Rédaction",
        },
        {
          stageNumber: "03",
          title: "Contrôle qualité puis validation",
          description:
            "Un contrôle automatique vérifie le brouillon ; il est ensuite bloqué jusqu'à l'approbation explicite d'un responsable, qui peut aussi demander une réécriture ou rejeter.",
          badge: "Validation humaine",
        },
        {
          stageNumber: "04",
          title: "Publication tracée",
          description:
            "Le contenu approuvé est figé et horodaté ; il est publié au plus une fois, et chaque étape est inscrite dans un journal d'audit.",
          badge: "Traçabilité",
        },
      ],
      integrationDetails:
        "Rôles distincts (propriétaire, éditeur, lecteur), espaces séparés par entreprise et accès aux réseaux sociaux conservés chiffrés. Construit avec LangGraph, FastAPI, PostgreSQL et React.",
    },
    metrics: {
      heading: "Où en est le projet",
      lead:
        "ContentOps Harness fonctionne de bout en bout dans un environnement de test : les connexions à LinkedIn et X ont été testées sans publier sur de vrais comptes.",
      items: [
        {
          label: "Statut",
          value: "Prototype fonctionnel",
          subtext: "Parcours complet opérationnel en environnement de test.",
        },
        {
          label: "Code",
          value: "Dépôt public",
          subtext: "Code consultable sur GitHub (Gninhi/Content-builder).",
        },
        {
          label: "Tests",
          value: "Suite automatisée",
          subtext: "Tests unitaires, d'intégration et de sécurité exécutés à chaque modification.",
        },
        {
          label: "Prochaine étape",
          value: "Premier usage réel",
          subtext: "Utilisation pour les publications d'Analyticatech avant toute offre à des clients.",
        },
      ],
      methodology: {
        sampleAndScope: "Entreprises B2B qui publient régulièrement sur LinkedIn et X.",
        period: "Usage interne d'abord ; aucune date de commercialisation annoncée.",
        measurementConditions:
          "En usage réel : temps de préparation d'un post, part des brouillons acceptés sans réécriture, incidents de publication.",
        rigorDisclaimer:
          "Aucun résultat d'usage n'est publié tant que l'outil n'a pas servi sur de vrais comptes.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Ce que l'outil fait, et ce qu'il refuse de faire",
      lead: "La validation humaine n'est pas une option désactivable.",
      prerequisites: [
        "Un responsable éditorial disponible pour valider les contenus.",
        "Un profil de marque écrit : ton, sujets, règles à respecter.",
        "Des comptes LinkedIn ou X de l'entreprise.",
      ],
      applicabilityLimits: [
        "Ne publie jamais sans approbation explicite.",
        "Ne modifie pas seul les règles de la marque : l'IA propose, l'équipe décide.",
        "Ne remplace pas l'expertise du rédacteur sur le fond.",
      ],
      operationalConstraints: [
        "Respect des conditions d'utilisation de LinkedIn et de X.",
        "Accès aux comptes sociaux conservés chiffrés.",
        "Journal d'audit conservé pour chaque décision.",
      ],
    },
    relatedResources: [SERVICE_LINKS_FR.agents, SERVICE_LINKS_FR.automation, SERVICE_LINKS_FR.rag],
    cta: {
      question: "Vous voulez produire plus de contenu sans perdre la maîtrise de ce qui est publié ?",
      buttonLabel: "Échanger sur ContentOps",
    },
  },

  // =========================================================================
  // PROJET — AVIE (dépôt public Gninhi/viiper-v4)
  // =========================================================================
  avie: {
    slug: "avie",
    sector: "Veille · Stratégie produit",
    sectorBadge: "Projet en cours",
    statusBadge: "Outil interne",
    statusType: "new",
    title: "AVIE :",
    titleAccent: "une veille qui distingue les faits des suppositions",
    summary:
      "Un moteur de veille et d'analyse d'opportunités : il collecte des sources ouvertes, relie chaque affirmation aux éléments qui la soutiennent, signale les contradictions entre sources et prépare un dossier de synthèse. La décision de poursuivre ou non reste humaine.",
    tags: ["Veille", "Sources ouvertes", "Agents IA", "Décision humaine"],
    problem: {
      heading: "Une synthèse d'IA paraît toujours sûre d'elle, même quand elle se trompe",
      contextNarrative:
        "Pour évaluer une idée de produit ou un marché, on compile des articles, des études et des avis. Les assistants d'IA généralistes en tirent des synthèses fluides, mais sans dire ce qui est établi, ce qui est estimé et ce qui est contredit par une autre source.",
      coreFrictions: [
        {
          title: "Faits et opinions mélangés",
          description: "Une estimation reprise par plusieurs articles finit par passer pour un fait.",
          impact: "Décisions prises sur des bases fragiles.",
        },
        {
          title: "Effet chambre d'écho",
          description: "Dix articles qui reprennent la même dépêche ne valent pas dix sources indépendantes.",
          impact: "Consensus apparent, mais artificiel.",
        },
        {
          title: "Contradictions ignorées",
          description: "Les désaccords entre sources disparaissent dans le résumé final.",
          impact: "Risques non vus au moment de décider.",
        },
        {
          title: "Coût de la recherche",
          description: "Les bases de données payantes rendent la veille coûteuse pour une petite structure.",
          impact: "Veille rare ou superficielle.",
        },
      ],
    },
    approach: {
      heading: "Une chaîne qui va de la source à la décision, étape par étape",
      lead:
        "AVIE enchaîne des étapes explicites, orchestrées avec LangGraph, et s'arrête avant la décision pour laisser la main à une personne.",
      stages: [
        {
          stageNumber: "01",
          title: "Collecte de sources ouvertes",
          description:
            "Publications scientifiques (arXiv), données publiques (data.gouv.fr), discussions publiques (Reddit, données personnelles retirées) et flux RSS.",
          badge: "Sources",
        },
        {
          stageNumber: "02",
          title: "Affirmations typées",
          description:
            "Chaque affirmation est classée (fait, observation, estimation, hypothèse) et rattachée aux extraits qui la soutiennent.",
          badge: "Preuves",
        },
        {
          stageNumber: "03",
          title: "Indépendance et contradictions",
          description:
            "Les sources qui se recopient sont regroupées, et les désaccords sont classés (contradiction directe, écart de date, écart géographique…).",
          badge: "Contrôle",
        },
        {
          stageNumber: "04",
          title: "Dossier et décision humaine",
          description:
            "Un dossier de synthèse est produit ; l'analyse s'arrête sur une décision humaine : poursuivre, attendre ou abandonner.",
          badge: "Décision",
        },
      ],
      integrationDetails:
        "Utilisable en ligne de commande ou via une API ; les dossiers s'exportent en Markdown ou en JSON. Les connecteurs actuels n'utilisent que des sources gratuites.",
    },
    metrics: {
      heading: "Où en est le projet",
      lead: "AVIE est un outil que j'utilise pour mes propres analyses ; il n'est pas proposé comme produit.",
      items: [
        {
          label: "Statut",
          value: "Outil interne",
          subtext: "Utilisé pour la veille et l'évaluation d'idées d'Analyticatech.",
        },
        {
          label: "Code",
          value: "Dépôt public",
          subtext: "Code consultable sur GitHub (Gninhi/viiper-v4).",
        },
        {
          label: "Sources",
          value: "Ouvertes et gratuites",
          subtext: "arXiv, data.gouv.fr, Reddit, flux RSS.",
        },
        {
          label: "Usage client",
          value: "Sur demande",
          subtext: "La méthode peut être adaptée à une veille sectorielle dans le cadre d'une mission.",
        },
      ],
      methodology: {
        sampleAndScope: "Veille technologique, évaluation d'idées de produits et d'opportunités de marché.",
        period: "Outil maintenu au fil des besoins ; pas de feuille de route commerciale.",
        measurementConditions:
          "Qualité jugée sur la traçabilité : chaque conclusion doit pouvoir être reliée à ses sources.",
        rigorDisclaimer: "Un dossier AVIE aide à décider ; il ne remplace pas une étude de marché.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Ce qu'AVIE apporte, et ses limites",
      lead: "La qualité du dossier dépend directement des sources disponibles.",
      prerequisites: [
        "Une question précise (un marché, une idée, une technologie).",
        "Des sources publiques suffisantes sur le sujet.",
        "Une personne pour relire le dossier et décider.",
      ],
      applicabilityLimits: [
        "Ne couvre pas les bases de données payantes ou les informations confidentielles.",
        "Ne remplace pas des entretiens avec de vrais clients.",
        "Signale un manque de sources plutôt que de conclure quand même.",
      ],
      operationalConstraints: [
        "Respect des conditions d'utilisation des sources consultées.",
        "Données personnelles retirées des contenus collectés.",
      ],
    },
    relatedResources: [SERVICE_LINKS_FR.agents, SERVICE_LINKS_FR.rag, SERVICE_LINKS_FR.data],
    cta: {
      question: "Vous avez besoin d'une veille sectorielle dont chaque conclusion est sourcée ?",
      buttonLabel: "En parler",
    },
  },

  // =========================================================================
  // PISTE — PILOTAGE COMMERCIAL (slug historique conservé : retail-bi)
  // =========================================================================
  "retail-bi": {
    slug: "retail-bi",
    sector: "Commerce · Pilotage",
    sectorBadge: "Piste à construire",
    statusBadge: "Piste à construire",
    statusType: "methodology",
    title: "Pilotage commercial :",
    titleAccent: "ventes, marges et stocks dans un même tableau de bord",
    summary:
      "Une idée que je souhaite construire pour les PME de commerce et de distribution : un tableau de bord qui réunit ventes, marges et stocks par canal et par point de vente, avec des indicateurs définis une seule fois. Rien n'est encore construit.",
    tags: ["Business intelligence", "PME", "Marges", "Stocks"],
    problem: {
      heading: "Les chiffres existent, mais chacun a les siens",
      contextNarrative:
        "Dans beaucoup de PME de commerce, les ventes sont dans la caisse ou le site marchand, les stocks dans un autre logiciel et les marges dans un tableur. Chaque réunion commence par réconcilier des chiffres qui ne concordent pas.",
      coreFrictions: [
        {
          title: "Chiffres contradictoires",
          description: "Chaque service calcule la marge ou le stock à sa façon.",
          impact: "Temps perdu à réconcilier au lieu de décider.",
        },
        {
          title: "Information en retard",
          description: "Les tableaux sont mis à jour à la main, souvent une fois par mois.",
          impact: "Réassort et prix décidés trop tard.",
        },
      ],
    },
    approach: {
      heading: "Ce que je prévois de construire",
      lead: "Une démarche classique de business intelligence, adaptée à la taille d'une PME.",
      stages: [
        {
          stageNumber: "01",
          title: "Définir les indicateurs",
          description: "Fixer avec la direction la définition unique de la marge, du stock et des ventes.",
          badge: "Cadrage",
        },
        {
          stageNumber: "02",
          title: "Relier les sources",
          description: "Connecter la caisse, le site marchand et l'outil de stock à une base commune.",
          badge: "Données",
        },
        {
          stageNumber: "03",
          title: "Tableaux de bord",
          description: "Une vue par canal et par point de vente, mise à jour automatiquement.",
          badge: "Restitution",
        },
      ],
      integrationDetails:
        "Les outils seront choisis selon votre existant (par exemple Power BI et une base SQL).",
    },
    metrics: {
      heading: "Où en est cette piste",
      lead: "Il s'agit d'une idée de solution, pas d'une réalisation.",
      items: [
        { label: "Statut", value: "Piste à construire", subtext: "Aucun développement engagé." },
        {
          label: "Pourquoi cette piste",
          value: "Mon parcours en data et BI",
          subtext: "Elle prolonge directement le service Data & Décision Augmentée.",
        },
      ],
      methodology: {
        sampleAndScope: "PME de commerce et de distribution, plusieurs canaux ou points de vente.",
        period: "Construite avec une première entreprise partenaire, si le besoin se confirme.",
        measurementConditions: "Indicateurs de départ mesurés avant le projet, puis suivis après.",
        rigorDisclaimer: "Aucun résultat n'est annoncé : cette solution n'existe pas encore.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Conditions pour que cette piste ait du sens",
      lead: "Un tableau de bord ne vaut que par la qualité des données qui l'alimentent.",
      prerequisites: [
        "Des données de vente et de stock accessibles par export ou API.",
        "Une direction prête à arbitrer les définitions des indicateurs.",
      ],
      applicabilityLimits: [
        "Pas adapté à une activité sans historique de ventes.",
        "Ne remplace pas un logiciel de gestion des stocks.",
      ],
      operationalConstraints: ["Accès aux données limité aux personnes autorisées."],
    },
    relatedResources: [SERVICE_LINKS_FR.data, SERVICE_LINKS_FR.automation],
    cta: {
      question: "Ce besoin correspond à votre entreprise ?",
      buttonLabel: "En discuter",
    },
  },

  // =========================================================================
  // PISTE — PRÉVISION DE LA DEMANDE (slug historique conservé : logistics-ai)
  // =========================================================================
  "logistics-ai": {
    slug: "logistics-ai",
    sector: "Distribution · Approvisionnement",
    sectorBadge: "Piste à construire",
    statusBadge: "Piste à construire",
    statusType: "methodology",
    title: "Prévision de la demande :",
    titleAccent: "commander au bon moment, sans surstock",
    summary:
      "Une idée que je souhaite construire pour les PME de négoce et de distribution : prévoir les ventes à partir de l'historique pour proposer des quantités de réapprovisionnement, que l'acheteur valide ou corrige. Rien n'est encore construit.",
    tags: ["Prévision", "Approvisionnement", "PME", "Validation humaine"],
    problem: {
      heading: "Commander à l'intuition coûte cher dans les deux sens",
      contextNarrative:
        "Sans prévision, les commandes reposent sur l'expérience de l'acheteur et des moyennes passées. Le résultat oscille entre surstock, qui immobilise de la trésorerie, et ruptures, qui font perdre des ventes.",
      coreFrictions: [
        {
          title: "Saisonnalité mal anticipée",
          description: "Les pics et les creux de ventes sont repérés trop tard.",
          impact: "Ruptures ou surstock selon la période.",
        },
        {
          title: "Commandes manuelles",
          description: "Les quantités sont recalculées à la main pour chaque référence.",
          impact: "Temps d'acheteur absorbé par le calcul.",
        },
      ],
    },
    approach: {
      heading: "Ce que je prévois de construire",
      lead: "Une prévision simple et explicable, plutôt qu'un modèle opaque.",
      stages: [
        {
          stageNumber: "01",
          title: "Analyse de l'historique",
          description: "Vérifier que les données de ventes passées permettent une prévision utile.",
          badge: "Données",
        },
        {
          stageNumber: "02",
          title: "Prévision par référence",
          description: "Des modèles qui apprennent de l'historique, avec une explication lisible de chaque prévision.",
          badge: "Prévision",
        },
        {
          stageNumber: "03",
          title: "Proposition de commande",
          description: "Une quantité proposée pour chaque référence, que l'acheteur accepte ou modifie.",
          badge: "Décision humaine",
        },
      ],
      integrationDetails: "Connexion à l'outil de gestion commerciale ou au logiciel de stock existant.",
    },
    metrics: {
      heading: "Où en est cette piste",
      lead: "Il s'agit d'une idée de solution, pas d'une réalisation.",
      items: [
        { label: "Statut", value: "Piste à construire", subtext: "Aucun développement engagé." },
        {
          label: "Pourquoi cette piste",
          value: "Données et IA au service des achats",
          subtext: "Elle combine les services Data & Décision et Automatisation.",
        },
      ],
      methodology: {
        sampleAndScope: "PME de négoce et de distribution avec au moins deux ans d'historique de ventes.",
        period: "Construite avec une première entreprise partenaire, si le besoin se confirme.",
        measurementConditions: "Comparaison des ruptures et du stock moyen avant et après, sur une même période.",
        rigorDisclaimer: "Aucun résultat n'est annoncé : cette solution n'existe pas encore.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Conditions pour que cette piste ait du sens",
      lead: "Une prévision n'est fiable que sur un historique suffisant.",
      prerequisites: [
        "Un historique de ventes par référence, idéalement sur plusieurs années.",
        "Un acheteur qui garde la décision finale.",
      ],
      applicabilityLimits: [
        "Peu utile pour des produits sans historique ou vendus à l'unité sur commande.",
        "Ne pilote pas les tournées de livraison.",
      ],
      operationalConstraints: ["Prévisions présentées comme des propositions, jamais appliquées seules."],
    },
    relatedResources: [SERVICE_LINKS_FR.data, SERVICE_LINKS_FR.automation],
    cta: {
      question: "Vos achats reposent encore sur des calculs manuels ?",
      buttonLabel: "En discuter",
    },
  },

  // =========================================================================
  // PISTE — VEILLE CLIENTS & FOURNISSEURS (réutilise les connecteurs de Ciblioo)
  // =========================================================================
  "veille-registres": {
    slug: "veille-registres",
    sector: "Gestion des risques · PME",
    sectorBadge: "Piste à construire",
    statusBadge: "Piste à construire",
    statusType: "methodology",
    title: "Veille clients et fournisseurs :",
    titleAccent: "être prévenu des annonces légales qui vous concernent",
    summary:
      "Une idée issue de Ciblioo : surveiller les annonces légales (BODACC) de vos clients et fournisseurs pour être alerté d'une procédure collective, d'une cession ou d'un changement de dirigeant. Rien n'est encore construit, mais les connecteurs nécessaires existent déjà dans Ciblioo.",
    tags: ["BODACC", "Alertes", "Gestion des risques", "PME"],
    problem: {
      heading: "On apprend souvent trop tard qu'un client est en difficulté",
      contextNarrative:
        "Une procédure collective chez un client ou un fournisseur clé est publiée au BODACC, mais rares sont les PME qui surveillent ces annonces. L'information arrive souvent avec un impayé.",
      coreFrictions: [
        {
          title: "Information publique mais non suivie",
          description: "Personne n'a le temps de consulter les annonces légales pour chaque partenaire.",
          impact: "Risque d'impayé découvert trop tard.",
        },
        {
          title: "Changements non repérés",
          description: "Cessions et changements de dirigeant passent inaperçus.",
          impact: "Relation commerciale mal ajustée.",
        },
      ],
    },
    approach: {
      heading: "Ce que je prévois de construire",
      lead: "Réutiliser les connecteurs de Ciblioo pour une veille simple, centrée sur vos partenaires.",
      stages: [
        {
          stageNumber: "01",
          title: "Liste de partenaires",
          description: "Import de vos clients et fournisseurs, rattachés à leur SIREN.",
          badge: "Identité",
        },
        {
          stageNumber: "02",
          title: "Surveillance des annonces",
          description: "Lecture régulière des annonces BODACC concernant ces entreprises.",
          badge: "Sources",
        },
        {
          stageNumber: "03",
          title: "Alertes",
          description: "Un message clair quand une annonce importante paraît, avec le lien vers l'annonce officielle.",
          badge: "Alerte",
        },
      ],
      integrationDetails: "Import depuis un export de votre logiciel de facturation ou de votre CRM.",
    },
    metrics: {
      heading: "Où en est cette piste",
      lead: "Il s'agit d'une idée de solution, pas d'une réalisation.",
      items: [
        { label: "Statut", value: "Piste à construire", subtext: "Aucun développement engagé." },
        {
          label: "Briques existantes",
          value: "Connecteurs de Ciblioo",
          subtext: "Rapprochement par SIREN et lecture du BODACC déjà développés.",
        },
      ],
      methodology: {
        sampleAndScope: "PME qui travaillent avec un nombre important de clients ou de fournisseurs professionnels.",
        period: "Après le pilote de Ciblioo.",
        measurementConditions: "Délai entre la publication d'une annonce et l'alerte reçue.",
        rigorDisclaimer: "Aucun résultat n'est annoncé : cette solution n'existe pas encore.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Conditions pour que cette piste ait du sens",
      lead: "La veille ne porte que sur les informations publiées officiellement.",
      prerequisites: ["Une liste de partenaires identifiables par leur SIREN."],
      applicabilityLimits: [
        "Ne prédit pas les difficultés d'une entreprise : elle signale ce qui est publié.",
        "Ne couvre pas les entreprises étrangères.",
      ],
      operationalConstraints: ["Respect des conditions de réutilisation des données du BODACC."],
    },
    relatedResources: [SERVICE_LINKS_FR.automation, SERVICE_LINKS_FR.data],
    cta: {
      question: "Ce type d'alerte vous serait utile ?",
      buttonLabel: "En discuter",
    },
  },
};

const SOLUTIONS_DETAIL_EN: Record<string, SolutionDetailData> = {
  ciblioo: {
    ...SOLUTIONS_DETAIL_FR.ciblioo,
    sector: "M&A · Business transfers",
    sectorBadge: "Ongoing project",
    statusBadge: "In development",
    title: "Ciblioo:",
    titleAccent: "from mandate brief to a documented target list",
    summary:
      "A platform for business-transfer and M&A advisory firms: starting from a buy-side or sell-side mandate, it builds a list of target companies, matches data from public registries and links every piece of information to its source. The deal team keeps the final decision on every company.",
    tags: ["M&A", "Public registries", "Source traceability", "Human review"],
    problem: {
      heading: "Checking a target list takes longer than building it",
      contextNarrative:
        "A firm working on a mandate must hand its client a justified list of companies. Finding names is not the hard part: checking each company's identity, gathering useful information from several sources and showing where each figure comes from is. Done by hand in spreadsheets, this takes days and lets embarrassing mistakes through.",
      coreFrictions: [
        {
          title: "Uncertain identities",
          description: "The same company appears under several names or establishments; duplicates and mix-ups creep in.",
          impact: "Risk of presenting the wrong company to the client.",
        },
        {
          title: "Scattered sources",
          description: "Useful information is spread across the company directory, legal notices (BODACC) and other databases.",
          impact: "Slow collection that is hard to reproduce.",
        },
        {
          title: "Missing evidence",
          description: "When the client asks why a company was selected, the source of each figure has to be found again.",
          impact: "Weak justification of the selection.",
        },
        {
          title: "Fragile home-made automations",
          description: "Generic automation chains produce duplicates and data with no source attached.",
          impact: "Time spent fixing rather than analysing.",
        },
      ],
    },
    approach: {
      heading: "Every displayed value opens its evidence, or is marked unknown",
      lead:
        "Ciblioo organises work by mandate file and by batch of companies. Design principle: no data is shown without its source, date and the extract it comes from.",
      stages: [
        {
          stageNumber: "01",
          title: "Mandate file",
          description: "The client brief (sector, size, region, criteria) is recorded and versioned.",
          badge: "Scoping",
        },
        {
          stageNumber: "02",
          title: "Import and identity matching",
          description: "Imported companies are normalised and linked to their SIREN number; ambiguous cases are set aside for review rather than guessed.",
          badge: "Identity",
        },
        {
          stageNumber: "03",
          title: "Collection from public registries",
          description: "Connectors to the French company search API (DINUM) and BODACC legal notices are live; more sources will be added as needs are confirmed.",
          badge: "Sources",
        },
        {
          stageNumber: "04",
          title: "Human review and export",
          description: "The deal team approves or rejects each company; the exported list keeps, for every value, its source and consultation date.",
          badge: "Decision",
        },
      ],
      integrationDetails:
        "Multi-workspace web application: each firm's data is isolated from the others. The final list can be exported into the firm's usual tools.",
    },
    metrics: {
      heading: "Project status",
      lead:
        "Ciblioo is in development. The foundations (data isolation, connectors, navigation) are in place; the full journey from brief to exported list is being built.",
      items: [
        { label: "Status", value: "In development", subtext: "Not commercially available yet." },
        {
          label: "Already in place",
          value: "Technical foundations",
          subtext: "Per-firm data isolation, DINUM and BODACC connectors, baseline security.",
        },
        {
          label: "Next step",
          value: "Full batch journey",
          subtext: "Import, matching, collection, review and export with evidence.",
        },
        {
          label: "Then",
          value: "Pilot with a firm",
          subtext: "A first pilot is planned with a business-transfer advisory firm.",
        },
      ],
      methodology: {
        sampleAndScope: "Business-transfer and M&A advisory firms working with French SMEs and mid-sized companies.",
        period: "Pilot after the full journey is delivered; no date announced.",
        measurementConditions:
          "During the pilot: time needed to build and check a batch, and number of identity errors, measured before and with the tool.",
        rigorDisclaimer: "No time saving is claimed until it has been measured during the pilot.",
      },
    },
    limitsAndPrerequisites: {
      heading: "What Ciblioo does, and what it does not promise",
      lead: "The scope is deliberately narrow so that it stays verifiable.",
      prerequisites: [
        "A mandate with explicit selection criteria.",
        "Companies registered in France, identifiable by their SIREN.",
        "A deal team member available to review ambiguous cases.",
      ],
      applicabilityLimits: [
        "Does not predict which companies “will sell”: no reliable data allows that promise to be made honestly.",
        "Sends no outreach messages automatically.",
        "Does not cover foreign companies at this stage.",
      ],
      operationalConstraints: [
        "Compliance with each public source's terms of use.",
        "Processing of directors' data in line with the GDPR.",
        "One firm's data is never visible to another.",
      ],
    },
    relatedResources: [SERVICE_LINKS_EN.data, SERVICE_LINKS_EN.automation, SERVICE_LINKS_EN.agents],
    cta: {
      question: "Do you work in business transfers or M&A and recognise this problem?",
      buttonLabel: "Talk about Ciblioo",
    },
  },

  contentops: {
    ...SOLUTIONS_DETAIL_FR.contentops,
    sector: "Marketing · B2B content",
    sectorBadge: "Ongoing project",
    statusBadge: "Working prototype",
    title: "ContentOps Harness:",
    titleAccent: "producing content with AI, publishing nothing without approval",
    summary:
      "An editorial system for companies that publish on LinkedIn and X: it turns monitoring, notes and lessons learned into drafts, runs a quality check, then waits for explicit approval from a manager before anything is published. It is not an auto-posting tool.",
    tags: ["AI agents", "Human approval", "LinkedIn", "Traceability"],
    problem: {
      heading: "AI writes fast, but a bad post commits the company",
      contextNarrative:
        "Generating posts with AI has become easy. Staying in control is still hard: keeping to the company's editorial line, avoiding factual errors, knowing who approved what, and never publishing the same content twice by accident.",
      coreFrictions: [
        { title: "Publishing without review", description: "Auto-posting tools send out content nobody has read.", impact: "Reputational risk and public mistakes." },
        { title: "Diluted editorial line", description: "Each generated draft drifts a little from the brand's tone and rules.", impact: "Generic, less credible content." },
        { title: "No record of decisions", description: "There is no way to find who approved a piece of content, or which version.", impact: "Unclear accountability." },
        { title: "Duplicate posts", description: "A network error during sending can lead to the same post being published again.", impact: "Embarrassing double posts." },
      ],
    },
    approach: {
      heading: "An editorial chain with a mandatory human checkpoint",
      lead: "Each piece of content follows a defined path from idea to publication. AI prepares; an authorised person decides.",
      stages: [
        { stageNumber: "01", title: "Monitoring and ideas", description: "Chosen sources (RSS feeds, internal notes) feed a ranked list of ideas that the team sorts.", badge: "Monitoring" },
        { stageNumber: "02", title: "Drafts per platform", description: "AI agents write drafts suited to LinkedIn and X, following the brand profile defined by the company.", badge: "Writing" },
        { stageNumber: "03", title: "Quality check, then approval", description: "An automatic check reviews the draft; it is then blocked until a manager explicitly approves it, asks for a rewrite or rejects it.", badge: "Human approval" },
        { stageNumber: "04", title: "Traced publication", description: "Approved content is frozen and time-stamped; it is published at most once, and every step is written to an audit log.", badge: "Traceability" },
      ],
      integrationDetails:
        "Separate roles (owner, editor, viewer), separate workspaces per company and encrypted storage of social network access. Built with LangGraph, FastAPI, PostgreSQL and React.",
    },
    metrics: {
      heading: "Project status",
      lead: "ContentOps Harness works end to end in a test environment: LinkedIn and X connections have been tested without posting to real accounts.",
      items: [
        { label: "Status", value: "Working prototype", subtext: "Full journey running in a test environment." },
        { label: "Code", value: "Public repository", subtext: "Code available on GitHub (Gninhi/Content-builder)." },
        { label: "Tests", value: "Automated suite", subtext: "Unit, integration and security tests run on every change." },
        { label: "Next step", value: "First real use", subtext: "Used for Analyticatech's own posts before any client offer." },
      ],
      methodology: {
        sampleAndScope: "B2B companies that publish regularly on LinkedIn and X.",
        period: "Internal use first; no commercial launch date announced.",
        measurementConditions: "In real use: time to prepare a post, share of drafts accepted without rewrite, publishing incidents.",
        rigorDisclaimer: "No usage results are published until the tool has been used on real accounts.",
      },
    },
    limitsAndPrerequisites: {
      heading: "What the tool does, and what it refuses to do",
      lead: "Human approval cannot be switched off.",
      prerequisites: [
        "An editorial manager available to approve content.",
        "A written brand profile: tone, topics, rules.",
        "Company LinkedIn or X accounts.",
      ],
      applicabilityLimits: [
        "Never publishes without explicit approval.",
        "Does not change brand rules on its own: AI suggests, the team decides.",
        "Does not replace the writer's subject-matter expertise.",
      ],
      operationalConstraints: [
        "Compliance with LinkedIn and X terms of use.",
        "Social account access stored encrypted.",
        "Audit log kept for every decision.",
      ],
    },
    relatedResources: [SERVICE_LINKS_EN.agents, SERVICE_LINKS_EN.automation, SERVICE_LINKS_EN.rag],
    cta: {
      question: "Want to produce more content without losing control of what gets published?",
      buttonLabel: "Talk about ContentOps",
    },
  },

  avie: {
    ...SOLUTIONS_DETAIL_FR.avie,
    sector: "Monitoring · Product strategy",
    sectorBadge: "Ongoing project",
    statusBadge: "Internal tool",
    title: "AVIE:",
    titleAccent: "monitoring that separates facts from assumptions",
    summary:
      "A monitoring and opportunity-analysis engine: it collects open sources, links each claim to the evidence supporting it, flags contradictions between sources and prepares a summary file. The decision to go ahead or not stays human.",
    tags: ["Monitoring", "Open sources", "AI agents", "Human decision"],
    problem: {
      heading: "An AI summary always sounds confident, even when it is wrong",
      contextNarrative:
        "To assess a product idea or a market, you gather articles, studies and opinions. General-purpose AI assistants turn them into fluent summaries, without saying what is established, what is estimated and what another source contradicts.",
      coreFrictions: [
        { title: "Facts and opinions mixed up", description: "An estimate repeated by several articles ends up passing for a fact.", impact: "Decisions made on weak grounds." },
        { title: "Echo-chamber effect", description: "Ten articles repeating the same newswire are not ten independent sources.", impact: "Apparent but artificial consensus." },
        { title: "Ignored contradictions", description: "Disagreements between sources disappear in the final summary.", impact: "Risks unseen at decision time." },
        { title: "Cost of research", description: "Paid databases make monitoring expensive for a small company.", impact: "Rare or superficial monitoring." },
      ],
    },
    approach: {
      heading: "A chain from source to decision, step by step",
      lead: "AVIE runs explicit steps, orchestrated with LangGraph, and stops before the decision to hand over to a person.",
      stages: [
        { stageNumber: "01", title: "Open-source collection", description: "Scientific papers (arXiv), public data (data.gouv.fr), public discussions (Reddit, personal data removed) and RSS feeds.", badge: "Sources" },
        { stageNumber: "02", title: "Typed claims", description: "Each claim is classified (fact, observation, estimate, hypothesis) and linked to the extracts that support it.", badge: "Evidence" },
        { stageNumber: "03", title: "Independence and contradictions", description: "Sources that copy each other are grouped, and disagreements are classified (direct contradiction, date gap, geographic gap…).", badge: "Checks" },
        { stageNumber: "04", title: "File and human decision", description: "A summary file is produced; the analysis stops on a human decision: go, wait or drop.", badge: "Decision" },
      ],
      integrationDetails:
        "Usable from the command line or through an API; files export to Markdown or JSON. Current connectors only use free sources.",
    },
    metrics: {
      heading: "Project status",
      lead: "AVIE is a tool I use for my own analyses; it is not offered as a product.",
      items: [
        { label: "Status", value: "Internal tool", subtext: "Used for Analyticatech's monitoring and idea assessment." },
        { label: "Code", value: "Public repository", subtext: "Code available on GitHub (Gninhi/viiper-v4)." },
        { label: "Sources", value: "Open and free", subtext: "arXiv, data.gouv.fr, Reddit, RSS feeds." },
        { label: "Client use", value: "On request", subtext: "The method can be adapted to sector monitoring as part of an engagement." },
      ],
      methodology: {
        sampleAndScope: "Technology monitoring, product idea and market opportunity assessment.",
        period: "Maintained as needed; no commercial roadmap.",
        measurementConditions: "Quality judged on traceability: every conclusion must link back to its sources.",
        rigorDisclaimer: "An AVIE file helps you decide; it does not replace market research.",
      },
    },
    limitsAndPrerequisites: {
      heading: "What AVIE brings, and its limits",
      lead: "The quality of the file depends directly on the available sources.",
      prerequisites: [
        "A precise question (a market, an idea, a technology).",
        "Enough public sources on the topic.",
        "A person to review the file and decide.",
      ],
      applicabilityLimits: [
        "Does not cover paid databases or confidential information.",
        "Does not replace interviews with real customers.",
        "Flags a lack of sources rather than concluding anyway.",
      ],
      operationalConstraints: [
        "Compliance with the terms of use of the sources consulted.",
        "Personal data removed from collected content.",
      ],
    },
    relatedResources: [SERVICE_LINKS_EN.agents, SERVICE_LINKS_EN.rag, SERVICE_LINKS_EN.data],
    cta: {
      question: "Need sector monitoring where every conclusion is sourced?",
      buttonLabel: "Let's talk",
    },
  },

  "retail-bi": {
    ...SOLUTIONS_DETAIL_FR["retail-bi"],
    sector: "Retail · Steering",
    sectorBadge: "Idea to build",
    statusBadge: "Idea to build",
    title: "Sales steering:",
    titleAccent: "sales, margins and stock in one dashboard",
    summary:
      "An idea I want to build for retail and distribution SMEs: a dashboard bringing together sales, margins and stock by channel and by store, with indicators defined once. Nothing has been built yet.",
    tags: ["Business intelligence", "SMEs", "Margins", "Stock"],
    problem: {
      heading: "The figures exist, but everyone has their own",
      contextNarrative:
        "In many retail SMEs, sales live in the till or the online shop, stock in another tool and margins in a spreadsheet. Every meeting starts by reconciling figures that do not match.",
      coreFrictions: [
        { title: "Contradictory figures", description: "Each department calculates margin or stock its own way.", impact: "Time spent reconciling instead of deciding." },
        { title: "Late information", description: "Spreadsheets are updated by hand, often once a month.", impact: "Restocking and pricing decided too late." },
      ],
    },
    approach: {
      heading: "What I plan to build",
      lead: "A standard business-intelligence approach, sized for an SME.",
      stages: [
        { stageNumber: "01", title: "Define the indicators", description: "Agree with management on a single definition of margin, stock and sales.", badge: "Scoping" },
        { stageNumber: "02", title: "Connect the sources", description: "Connect the till, online shop and stock tool to a shared database.", badge: "Data" },
        { stageNumber: "03", title: "Dashboards", description: "A view by channel and by store, updated automatically.", badge: "Reporting" },
      ],
      integrationDetails: "Tools will be chosen to fit your setup (for example Power BI and a SQL database).",
    },
    metrics: {
      heading: "Status of this idea",
      lead: "This is a solution idea, not a delivered project.",
      items: [
        { label: "Status", value: "Idea to build", subtext: "No development started." },
        { label: "Why this idea", value: "My data and BI background", subtext: "It extends the Data & Augmented Decision service." },
      ],
      methodology: {
        sampleAndScope: "Retail and distribution SMEs with several channels or stores.",
        period: "Built with a first partner company, if the need is confirmed.",
        measurementConditions: "Baseline indicators measured before the project, then tracked after.",
        rigorDisclaimer: "No results are claimed: this solution does not exist yet.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Conditions for this idea to make sense",
      lead: "A dashboard is only as good as the data feeding it.",
      prerequisites: [
        "Sales and stock data available by export or API.",
        "Management ready to settle indicator definitions.",
      ],
      applicabilityLimits: [
        "Not suited to a business with no sales history.",
        "Does not replace stock management software.",
      ],
      operationalConstraints: ["Data access limited to authorised people."],
    },
    relatedResources: [SERVICE_LINKS_EN.data, SERVICE_LINKS_EN.automation],
    cta: { question: "Does this need match your company?", buttonLabel: "Let's discuss" },
  },

  "logistics-ai": {
    ...SOLUTIONS_DETAIL_FR["logistics-ai"],
    sector: "Distribution · Purchasing",
    sectorBadge: "Idea to build",
    statusBadge: "Idea to build",
    title: "Demand forecasting:",
    titleAccent: "order at the right time, without overstock",
    summary:
      "An idea I want to build for wholesale and distribution SMEs: forecast sales from history to suggest reorder quantities, which the buyer approves or corrects. Nothing has been built yet.",
    tags: ["Forecasting", "Purchasing", "SMEs", "Human approval"],
    problem: {
      heading: "Ordering by gut feeling is costly both ways",
      contextNarrative:
        "Without forecasts, orders rely on the buyer's experience and past averages. The result swings between overstock, which ties up cash, and stock-outs, which lose sales.",
      coreFrictions: [
        { title: "Seasonality spotted too late", description: "Sales peaks and dips are noticed too late.", impact: "Stock-outs or overstock depending on the period." },
        { title: "Manual orders", description: "Quantities are recalculated by hand for each item.", impact: "Buyer time absorbed by calculation." },
      ],
    },
    approach: {
      heading: "What I plan to build",
      lead: "A simple, explainable forecast rather than an opaque model.",
      stages: [
        { stageNumber: "01", title: "History review", description: "Check that past sales data allows a useful forecast.", badge: "Data" },
        { stageNumber: "02", title: "Forecast per item", description: "Models that learn from history, with a readable explanation of each forecast.", badge: "Forecast" },
        { stageNumber: "03", title: "Order proposal", description: "A suggested quantity for each item, which the buyer accepts or changes.", badge: "Human decision" },
      ],
      integrationDetails: "Connection to the existing sales management or stock software.",
    },
    metrics: {
      heading: "Status of this idea",
      lead: "This is a solution idea, not a delivered project.",
      items: [
        { label: "Status", value: "Idea to build", subtext: "No development started." },
        { label: "Why this idea", value: "Data and AI for purchasing", subtext: "It combines the Data & Decision and Automation services." },
      ],
      methodology: {
        sampleAndScope: "Wholesale and distribution SMEs with at least two years of sales history.",
        period: "Built with a first partner company, if the need is confirmed.",
        measurementConditions: "Stock-outs and average stock compared before and after, over the same period.",
        rigorDisclaimer: "No results are claimed: this solution does not exist yet.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Conditions for this idea to make sense",
      lead: "A forecast is only reliable with enough history.",
      prerequisites: [
        "Sales history per item, ideally over several years.",
        "A buyer who keeps the final decision.",
      ],
      applicabilityLimits: [
        "Of little use for items with no history or made to order.",
        "Does not plan delivery routes.",
      ],
      operationalConstraints: ["Forecasts are presented as proposals, never applied automatically."],
    },
    relatedResources: [SERVICE_LINKS_EN.data, SERVICE_LINKS_EN.automation],
    cta: { question: "Do your purchases still rely on manual calculations?", buttonLabel: "Let's discuss" },
  },

  "veille-registres": {
    ...SOLUTIONS_DETAIL_FR["veille-registres"],
    sector: "Risk management · SMEs",
    sectorBadge: "Idea to build",
    statusBadge: "Idea to build",
    title: "Customer and supplier monitoring:",
    titleAccent: "get alerted to legal notices that concern you",
    summary:
      "An idea that grew out of Ciblioo: monitor the legal notices (BODACC) of your customers and suppliers to be alerted to insolvency proceedings, a business sale or a change of director. Nothing has been built yet, but the connectors it needs already exist in Ciblioo.",
    tags: ["BODACC", "Alerts", "Risk management", "SMEs"],
    problem: {
      heading: "You often learn too late that a customer is in trouble",
      contextNarrative:
        "Insolvency proceedings at a key customer or supplier are published in the BODACC, but few SMEs monitor these notices. The news often arrives with an unpaid invoice.",
      coreFrictions: [
        { title: "Public but unmonitored information", description: "Nobody has time to check legal notices for every partner.", impact: "Unpaid invoices discovered too late." },
        { title: "Unnoticed changes", description: "Business sales and changes of director go unnoticed.", impact: "Poorly adjusted business relationships." },
      ],
    },
    approach: {
      heading: "What I plan to build",
      lead: "Reuse Ciblioo's connectors for simple monitoring focused on your partners.",
      stages: [
        { stageNumber: "01", title: "Partner list", description: "Import of your customers and suppliers, linked to their SIREN.", badge: "Identity" },
        { stageNumber: "02", title: "Notice monitoring", description: "Regular reading of BODACC notices about these companies.", badge: "Sources" },
        { stageNumber: "03", title: "Alerts", description: "A clear message when an important notice appears, with a link to the official notice.", badge: "Alert" },
      ],
      integrationDetails: "Import from an export of your invoicing software or CRM.",
    },
    metrics: {
      heading: "Status of this idea",
      lead: "This is a solution idea, not a delivered project.",
      items: [
        { label: "Status", value: "Idea to build", subtext: "No development started." },
        { label: "Existing building blocks", value: "Ciblioo connectors", subtext: "SIREN matching and BODACC reading already developed." },
      ],
      methodology: {
        sampleAndScope: "SMEs working with many business customers or suppliers.",
        period: "After the Ciblioo pilot.",
        measurementConditions: "Time between a notice's publication and the alert being received.",
        rigorDisclaimer: "No results are claimed: this solution does not exist yet.",
      },
    },
    limitsAndPrerequisites: {
      heading: "Conditions for this idea to make sense",
      lead: "Monitoring only covers officially published information.",
      prerequisites: ["A list of partners identifiable by their SIREN."],
      applicabilityLimits: [
        "Does not predict a company's difficulties: it reports what is published.",
        "Does not cover foreign companies.",
      ],
      operationalConstraints: ["Compliance with BODACC data reuse conditions."],
    },
    relatedResources: [SERVICE_LINKS_EN.automation, SERVICE_LINKS_EN.data],
    cta: { question: "Would this kind of alert be useful to you?", buttonLabel: "Let's discuss" },
  },
};

/** Clés de routage (identiques en FR et EN) — utilisées par generateStaticParams. */
export const SOLUTIONS_DETAIL_REGISTRY: Record<string, SolutionDetailData> = SOLUTIONS_DETAIL_FR;

/**
 * Anciennes fiches retirées de la page Solutions. Les URL sont redirigées en
 * 301 dans `next.config.ts` ; l'alias garde l'ancien sourcing M&A vers Ciblioo.
 */
const SOLUTION_ALIASES: Record<string, string> = {
  dealscoop: "ciblioo",
  "dealscoop-ma": "ciblioo",
  "ma-sourcing": "ciblioo",
  "private-equity-sourcing": "ciblioo",
  "sourcing-ma": "ciblioo",
  dealscope: "ciblioo",
  "content-ops": "contentops",
  "contentops-harness": "contentops",
};

/**
 * Récupère les données de détail d'une solution selon son slug et la langue.
 */
export function getSolutionDetailData(
  slug: string,
  locale: string = "fr"
): SolutionDetailData | null {
  if (!slug) return null;
  const normalizedSlug = slug.trim().toLowerCase();
  const resolvedSlug = SOLUTION_ALIASES[normalizedSlug] ?? normalizedSlug;
  const registry = locale === "en" ? SOLUTIONS_DETAIL_EN : SOLUTIONS_DETAIL_FR;
  return registry[resolvedSlug] ?? null;
}
