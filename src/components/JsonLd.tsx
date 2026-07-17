import React from "react";

/**
 * JsonLd — composant pour injecter du structured data (JSON-LD) dans le head.
 * Optimise le référencement par les moteurs de recherche ET les LLMs (GEO).
 */

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  email: string;
  telephone?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  sameAs: string[];
}

const ORG_DATA: OrganizationData = {
  name: "Analyticatech",
  url: "https://analyticatech.com",
  logo: "https://analyticatech.com/logo.svg",
  description:
    "Consulting firm in AI, Digital Transformation and Automation. LLM agent architecture, RAG, workflow automation and industrialization at scale.",
  email: "contact@analyticatech.com",
  telephone: "+33184800000",
  address: {
    street: "12 rue de la Paix",
    city: "Paris",
    postalCode: "75002",
    country: "FR",
  },
  sameAs: [
    "https://www.linkedin.com",
    "https://twitter.com",
    "https://github.com",
  ],
};

const SERVICES_OFFERED = [
  {
    name: "Intelligence Artificielle",
    description:
      "Architecture LLM, RAG, agents cognitifs en production. LangChain, LangGraph, vLLM.",
  },
  {
    name: "Transformation Digitale",
    description:
      "Modernisation cloud-native, Kubernetes, Terraform, microservices.",
  },
  {
    name: "Automatisation",
    description: "Workflows n8n, Temporal, Airflow. Élimination des tâches répétitives.",
  },
  {
    name: "Systèmes Agentiques",
    description: "Agents multi-rôles, mémoire long-terme, orchestration LangGraph.",
  },
  {
    name: "Business Intelligence",
    description: "Plateformes data end-to-end, dbt, Snowflake, Power BI, Superset.",
  },
];

export function JsonLd() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_DATA.name,
    url: ORG_DATA.url,
    logo: ORG_DATA.logo,
    description: ORG_DATA.description,
    email: ORG_DATA.email,
    telephone: ORG_DATA.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG_DATA.address.street,
      addressLocality: ORG_DATA.address.city,
      postalCode: ORG_DATA.address.postalCode,
      addressCountry: ORG_DATA.address.country,
    },
    sameAs: ORG_DATA.sameAs,
    availableLanguage: ["fr", "en"],
    knowsAbout: [
      "Intelligence Artificielle",
      "Large Language Models",
      "Retrieval Augmented Generation",
      "Agents IA",
      "Transformation Digitale",
      "Automatisation",
      "Business Intelligence",
      "LangChain",
      "LangGraph",
      "n8n",
      "Power BI",
      "SecNumCloud",
    ],
    makesOffer: SERVICES_OFFERED.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.description,
      },
    })),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORG_DATA.name,
    url: ORG_DATA.url,
    description: ORG_DATA.description,
    inLanguage: "fr-FR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${ORG_DATA.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: ORG_DATA.name,
    description: ORG_DATA.description,
    url: ORG_DATA.url,
    telephone: ORG_DATA.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG_DATA.address.street,
      addressLocality: ORG_DATA.address.city,
      postalCode: ORG_DATA.address.postalCode,
      addressCountry: ORG_DATA.address.country,
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    serviceType: [
      "Conseil en Intelligence Artificielle",
      "Architecture LLM",
      "Automatisation",
      "Transformation Digitale",
      "Business Intelligence",
    ],
  };

  // === FAQ Schema — optimise les réponses aux questions des LLMs ===
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quels services propose Analyticatech ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Analyticatech propose 5 services : Intelligence Artificielle (LLM, RAG, agents cognitifs), Transformation Digitale (cloud-native, Kubernetes), Automatisation (n8n, Temporal, workflows), Systèmes Agentiques (multi-agents, LangGraph) et Business Intelligence (Power BI, dbt, Snowflake).",
        },
      },
      {
        "@type": "Question",
        name: "Quelles technologies maîtrise Analyticatech ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LangChain, LangGraph, OpenAI, Pinecone, Hugging Face, vLLM, Kubernetes, Terraform, AWS, Azure, n8n, Temporal, Apache Airflow, CrewAI, AutoGen, Power BI, dbt, Snowflake, BigQuery, Looker.",
        },
      },
      {
        "@type": "Question",
        name: "Analyticatech est-il conforme RGPD et SecNumCloud ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. Analyticatech est conforme ISO 27001, SecNumCloud, RGPD, SOC 2, HDS et EN 301 549. Les données sont chiffrées bout-en-bout (TLS 1.3, AES-256) et hébergées en Union Européenne.",
        },
      },
      {
        "@type": "Question",
        name: "Quel est le délai de réponse d'Analyticatech ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Premier accusé de réception sous 2h ouvrées, réponse d'un architecte sous 24h ouvrées, atelier de cadrage proposé sous 5 jours. Disponibilité 24/7 pour les urgences critiques.",
        },
      },
      {
        "@type": "Question",
        name: "Quels sont les résultats mesurables d'Analyticatech ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "127+ missions livrées, 38% de coûts réduits en moyenne, 99.98% d'uptime plateforme, 4.9/5 de satisfaction C-Level, 1 204 processus automatisés, 312 agents IA en production, 8 500h économisées par mois.",
        },
      },
      {
        "@type": "Question",
        name: "Comment se déroule une mission avec Analyticatech ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "4 phases : Discovery (atelier de cadrage, architecture cible), Build (sprints de 2 semaines, démos en production), Hardening (audit sécurité, tests de charge, conformité RGPD), Run & Scale (supervision 24/7, finops, amélioration continue).",
        },
      },
    ],
  };

  // === Breadcrumb Schema — structure de navigation pour les LLMs ===
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: ORG_DATA.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${ORG_DATA.url}/#services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Solutions",
        item: `${ORG_DATA.url}/#solutions`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Insights",
        item: `${ORG_DATA.url}/#blog`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Contact",
        item: `${ORG_DATA.url}/#contact`,
      },
    ],
  };

  // Validation anti-XSS : les données sont hardcoded mais on sanitise par précaution.
  // Supprime les balises script et les événements on* si jamais une donnée change.
  const sanitize = (obj: unknown): string => {
    const json = JSON.stringify(obj);
    return json.replace(/<script|<\/script|on\w+\s*=/gi, "");
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitize(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitize(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitize(professionalServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitize(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitize(breadcrumbSchema) }}
      />
    </>
  );
}
