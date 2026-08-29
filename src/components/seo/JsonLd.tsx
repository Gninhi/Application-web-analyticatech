"use client";

import Script from "next/script";
import { useAppContentOptional } from "@/components/providers/ContentProvider";

/**
 * JsonLd — injecte le structured data (JSON-LD) via next/script.
 * Utilise next/script avec strategy="afterInteractive" pour éviter l'avertissement
 * React sur les balises <script> brutes dans les composants clients.
 * Données chargées dynamiquement depuis Supabase via useAppContent().
 */
export function JsonLd() {
  const content = useAppContentOptional();
  if (!content) return null;

  const { siteConfig, services, seoSchemas, seoMetadata } = content;

  const sanitize = (obj: unknown): string => {
    const json = JSON.stringify(obj);
    // Anti-XSS : retire toute balise script et attribut on* injectés dans les données
    return json.replace(/<script|<\/script|on\w+\s*=/gi, "");
  };

  const sameAs = [
    siteConfig.socialLinkedin,
    siteConfig.socialTwitter,
    siteConfig.socialGithub,
  ].filter(Boolean) as string[];

  const schemas: Record<string, unknown>[] = [
    // Organization
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.siteName,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.svg`,
      description: seoMetadata.description,
      email: siteConfig.email,
      telephone: siteConfig.phoneHref,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.streetAddress,
        addressLocality: siteConfig.city,
        postalCode: siteConfig.postalCode,
        addressCountry: siteConfig.countryCode,
      },
      sameAs,
      availableLanguage: ["fr", "en"],
      knowsAbout: [
        "Intelligence Artificielle",
        "Large Language Models",
        "Retrieval Augmented Generation",
        "Agents IA",
        "Automatisation",
        "Business Intelligence",
        "LangChain",
        "LangGraph",
        "n8n",
        "Power BI",
        "SecNumCloud",
      ],
      makesOffer: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
        },
      })),
    },
    // WebSite
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.siteName,
      url: siteConfig.url,
      description: seoMetadata.description,
      inLanguage: "fr-FR",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteConfig.url}/insights?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    // ProfessionalService
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: siteConfig.siteName,
      description: seoMetadata.description,
      url: siteConfig.url,
      telephone: siteConfig.phoneHref,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.streetAddress,
        addressLocality: siteConfig.city,
        postalCode: siteConfig.postalCode,
        addressCountry: siteConfig.countryCode,
      },
      areaServed: { "@type": "Country", name: "France" },
      serviceType: services.map((s) => s.title),
    },
    // FAQPage
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Quels services propose Analyticatech ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `Analyticatech propose les services suivants : ${services.map((s) => s.title).join(", ")}.`,
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
    },
    // BreadcrumbList — URLs réelles des routes App Router
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteConfig.url}/services` },
        { "@type": "ListItem", position: 3, name: "Solutions", item: `${siteConfig.url}/solutions` },
        { "@type": "ListItem", position: 4, name: "Insights", item: `${siteConfig.url}/insights` },
        { "@type": "ListItem", position: 5, name: "Contact", item: `${siteConfig.url}/contact` },
      ],
    },
    // Schémas dynamiques Supabase
    ...seoSchemas.map((s) => s.payload as Record<string, unknown>),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <Script
          key={i}
          id={`jsonld-${i}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: sanitize(schema) }}
        />
      ))}
    </>
  );
}
