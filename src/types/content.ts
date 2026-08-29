export type Locale = "fr" | "en";

export type ViewKey =
  | "home"
  | "services"
  | "solutions"
  | "blog"
  | "contact"
  | "rgpd"
  | "legal"
  | "about"
  | "service-detail"
  | "solution-detail"
  | "blog-detail";

export interface MetricDTO {
  id: string;
  key: string;
  label: string;
  value: string;
  numericValue: number | null;
  suffix: string | null;
  trend: number | null;
  sparkline: number[] | null;
  source: string;
  order: number;
}

export interface ClientLogoDTO {
  id: string;
  name: string;
  sector: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  order: number;
}

export interface ServiceDTO {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  iconKey: string;
  bgImagePath: string | null;
  meshOverlay: string | null;
  metrics: { label: string; value: string }[];
  order: number;
  persona: {
    ceo: string;
    architect: string;
    operational: string;
  };
}

export interface SolutionDTO {
  id: string;
  slug: string;
  sector: string;
  title: string;
  summary: string;
  impact: string;
  tags: string[];
  order: number;
}

export interface BlogCategoryDTO {
  id: string;
  key: string;
  label: string;
  colorClass: string | null;
  order: number;
}

export interface BlogPostDTO {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  categoryKey: string;
  categoryLabel: string;
  date: string; // ISO String
  readingTime: string;
  author: string;
  tags: string[];
}

export interface CapabilityDTO {
  id: string;
  key: string;
  stretch: string;
  title: string;
  description: string;
  features: string[];
  order: number;
}

export interface TestimonialDTO {
  id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  order: number;
}

export interface NavItemDTO {
  id: string;
  viewKey: string;
  label: string;
  hint: string;
  order: number;
}

export interface ActivityLogDTO {
  id: string;
  time: string;
  level: "info" | "ok" | "warn";
  event: string;
}

export interface CompanyValueDTO {
  id: string;
  iconKey: string;
  title: string;
  description: string;
  order: number;
}

export interface DeliveryStepDTO {
  id: string;
  iconKey: string;
  label: string;
  description: string;
  order: number;
}

export interface LegalSectionDTO {
  id: string;
  type: string;
  heading: string;
  body: string;
  order: number;
}

export interface SiteConfigDTO {
  siteName: string;
  url: string;
  email: string;
  phone: string;
  phoneHref: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  countryCode: string;
  socialLinkedin: string | null;
  socialTwitter: string | null;
  socialGithub: string | null;
  geoLat: number | null;
  geoLng: number | null;
}

export interface SeoMetadataDTO {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string;
  twitterCard: string;
}

export interface SeoSchemaDTO {
  id: string;
  type: string;
  payload: Record<string, unknown>;
}

export interface AppContentDTO {
  locale: Locale;
  siteConfig: SiteConfigDTO;
  navItems: NavItemDTO[];
  metrics: MetricDTO[];
  clientLogos: ClientLogoDTO[];
  services: ServiceDTO[];
  solutions: SolutionDTO[];
  blogCategories: BlogCategoryDTO[];
  blogPosts: BlogPostDTO[];
  capabilities: CapabilityDTO[];
  testimonials: TestimonialDTO[];
  marqueeKeywords: string[];
  activityLogs: ActivityLogDTO[];
  companyValues: CompanyValueDTO[];
  deliverySteps: DeliveryStepDTO[];
  rgpdSections: LegalSectionDTO[];
  legalSections: LegalSectionDTO[];
  seoMetadata: SeoMetadataDTO;
  seoSchemas: SeoSchemaDTO[];
}
