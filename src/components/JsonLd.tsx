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
    "Cabinet de conseil en IA, Transformation Digitale et Automatisation. Architecture d'agents LLM, RAG, automatisation workflows et industrialisation à l'échelle.",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
    </>
  );
}
