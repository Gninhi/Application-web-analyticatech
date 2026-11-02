-- Suppression des 37 tables de contenu qui ne sont plus lues : le contenu
-- éditorial est versionné dans le code (src/lib/content, src/locales).
-- Appliquée en production le 02/11/2026 via Supabase (apply_migration
-- « drop_stale_content_tables »), après sauvegarde JSON des 301 lignes.
DROP TABLE "ActivityLogEntryTranslation", "ActivityLogEntry", "AppConfig", "BlogPostTag", "BlogPostTranslation", "BlogPost", "BlogCategoryTranslation", "BlogCategory", "CapabilityFeature", "CapabilityTranslation", "Capability", "ClientLogo", "CompanyValueTranslation", "CompanyValue", "DeliveryStepTranslation", "DeliveryStep", "FaqEntryTranslation", "FaqEntry", "LegalSectionTranslation", "LegalSection", "MarqueeKeyword", "Metric", "NavItemTranslation", "NavItem", "SeoMetadataTranslation", "SeoMetadata", "SeoSchema", "ServiceMetric", "ServiceTechnology", "ServiceTranslation", "Service", "SiteConfig", "SolutionTag", "SolutionTranslation", "Solution", "TestimonialTranslation", "Testimonial";

DROP TYPE IF EXISTS "Locale", "MetricSource", "FaqCategory", "AppConfigKey";
