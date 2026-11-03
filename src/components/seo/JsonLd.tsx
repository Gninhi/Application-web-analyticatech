import type { AppContentDTO } from "@/types/content";
import { isValidSocialUrl } from "@/lib/content/site";

/**
 * JsonLd — données structurées (JSON-LD) rendues côté serveur dans le HTML
 * initial, pour qu'elles soient lues par tous les robots, y compris ceux des
 * assistants d'IA qui n'exécutent pas JavaScript.
 *
 * Ne déclare que des faits vérifiables (immatriculation, fondateur, adresse,
 * services). Pas de FAQPage ni de SearchAction : leur contenu n'existe pas
 * tel quel sur les pages, ce que Google considère comme trompeur.
 */

/** Échappe `<` pour qu'aucune donnée ne puisse fermer la balise <script>. */
function serialize(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

export function buildJsonLdSchemas(content: AppContentDTO): Record<string, unknown>[] {
  const { siteConfig, services, seoMetadata } = content;
  const sameAs = [siteConfig.socialLinkedin, siteConfig.socialTwitter, siteConfig.socialGithub].filter(
    (url): url is string => isValidSocialUrl(url)
  );
  const address = {
    "@type": "PostalAddress",
    streetAddress: siteConfig.streetAddress,
    addressLocality: siteConfig.city,
    postalCode: siteConfig.postalCode,
    addressCountry: siteConfig.countryCode,
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.siteName,
      legalName: "Analyticatech SAS",
      url: siteConfig.url,
      logo: `${siteConfig.url}/brand/analyticatech-logotype-A-flux.svg`,
      description: seoMetadata.description,
      email: siteConfig.email,
      telephone: siteConfig.phoneHref.replace(/^tel:/, ""),
      address,
      foundingDate: "2024-02-13",
      founder: {
        "@type": "Person",
        name: "Martial Gninhi",
        jobTitle: "Fondateur et Président",
      },
      identifier: { "@type": "PropertyValue", propertyID: "SIREN", value: "984609198" },
      vatID: "FR96984609198",
      areaServed: { "@type": "Country", name: "France" },
      availableLanguage: ["fr", "en"],
      sameAs,
      knowsAbout: [
        "Intelligence artificielle",
        "Retrieval Augmented Generation",
        "Agents IA",
        "Automatisation des processus",
        "Business intelligence",
      ],
      makesOffer: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.description },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.siteName,
      url: siteConfig.url,
      inLanguage: content.locale === "en" ? "en" : "fr-FR",
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
  ];
}

export function JsonLd({ content }: { content: AppContentDTO }) {
  return (
    <>
      {buildJsonLdSchemas(content).map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(schema) }}
        />
      ))}
    </>
  );
}
