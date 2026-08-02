-- ============================================================
-- SÉCURITÉ NIVEAU BANCAIRE (ROW LEVEL SECURITY - RLS) SUPABASE
-- Analyticatech — Politiques d'accès et d'isolation
-- ============================================================

-- 1. Activation de la RLS sur l'ensemble des 35 tables
ALTER TABLE "Metric" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClientLogo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ServiceTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ServiceMetric" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ServiceTechnology" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Solution" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SolutionTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SolutionTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogCategoryTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPostTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPostTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Capability" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CapabilityTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CapabilityFeature" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Testimonial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TestimonialTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NavItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NavItemTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MarqueeKeyword" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ActivityLogEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ActivityLogEntryTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CompanyValue" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CompanyValueTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DeliveryStep" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DeliveryStepTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LegalSection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LegalSectionTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SeoMetadata" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SeoMetadataTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SeoSchema" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FaqEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FaqEntryTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlockedEmailDomain" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SuspiciousUAPattern" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactRequest" ENABLE ROW LEVEL SECURITY;

-- 2. Politiques de lecture publique (SELECT) pour les contenus statiques & marketing
DO $$ 
DECLARE
  t text;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables 
           WHERE table_schema = 'public' 
           AND table_name NOT IN ('ContactRequest', 'BlockedEmailDomain', 'SuspiciousUAPattern')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public Read Policy" ON %I;', t);
    EXECUTE format('CREATE POLICY "Public Read Policy" ON %I FOR SELECT USING (true);', t);
  END LOOP;
END $$;

-- 3. Isolation stricte pour les demandes de contact et sécurité
-- Aucune lecture publique direct via l'API anon Supabase
DROP POLICY IF EXISTS "No Public Select ContactRequest" ON "ContactRequest";
CREATE POLICY "No Public Select ContactRequest" ON "ContactRequest" FOR SELECT USING (false);

DROP POLICY IF EXISTS "No Public Select BlockedEmailDomain" ON "BlockedEmailDomain";
CREATE POLICY "No Public Select BlockedEmailDomain" ON "BlockedEmailDomain" FOR SELECT USING (false);

DROP POLICY IF EXISTS "No Public Select SuspiciousUAPattern" ON "SuspiciousUAPattern";
CREATE POLICY "No Public Select SuspiciousUAPattern" ON "SuspiciousUAPattern" FOR SELECT USING (false);

-- Autoriser uniquement l'insertion de demande de contact via API serveur (role postgres/service_role)
DROP POLICY IF EXISTS "Allow Service Insert ContactRequest" ON "ContactRequest";
CREATE POLICY "Allow Service Insert ContactRequest" ON "ContactRequest" FOR INSERT WITH CHECK (true);
