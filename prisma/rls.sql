-- ============================================================
-- ROW LEVEL SECURITY (RLS) SUPABASE
-- Analyticatech — Politiques d'accès et d'isolation
-- La base ne contient plus que 3 tables : ContactRequest,
-- BlockedEmailDomain et SuspiciousUAPattern (le contenu éditorial est
-- versionné dans le code ; tables de contenu supprimées le 02/11/2026).
-- ============================================================

-- 1. Activation de la RLS
ALTER TABLE "BlockedEmailDomain" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SuspiciousUAPattern" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactRequest" ENABLE ROW LEVEL SECURITY;

-- 2. Isolation stricte : aucune lecture publique via l'API anon Supabase
DROP POLICY IF EXISTS "No Public Select ContactRequest" ON "ContactRequest";
CREATE POLICY "No Public Select ContactRequest" ON "ContactRequest" FOR SELECT USING (false);

DROP POLICY IF EXISTS "No Public Select BlockedEmailDomain" ON "BlockedEmailDomain";
CREATE POLICY "No Public Select BlockedEmailDomain" ON "BlockedEmailDomain" FOR SELECT USING (false);

DROP POLICY IF EXISTS "No Public Select SuspiciousUAPattern" ON "SuspiciousUAPattern";
CREATE POLICY "No Public Select SuspiciousUAPattern" ON "SuspiciousUAPattern" FOR SELECT USING (false);

-- Insertion de demandes de contact réservée à l'API serveur (Prisma).
-- Prisma se connecte avec le rôle propriétaire (postgres) qui bypass RLS
-- nativement → les inserts serveur continuent de fonctionner.
-- `WITH CHECK (false)` = verrou absolu côté PostgREST : la clé anon (publique)
-- ne peut JAMAIS insérer, contournant ainsi CSRF / rate-limit / validation Zod.
DROP POLICY IF EXISTS "Allow Service Insert ContactRequest" ON "ContactRequest";
CREATE POLICY "Allow Service Insert ContactRequest" ON "ContactRequest"
  FOR INSERT WITH CHECK (false);

-- Verrouillage des privilèges au niveau table (PostgREST / clés anon & authenticated)
REVOKE INSERT, UPDATE, DELETE ON "ContactRequest" FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON "BlockedEmailDomain" FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON "SuspiciousUAPattern" FROM anon, authenticated;

-- Garde-fou complémentaire : révoquer TOUTE écriture aux rôles publics sur toutes
-- les tables du schéma public.
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables
           WHERE table_schema = 'public'
  LOOP
    EXECUTE format('REVOKE INSERT, UPDATE, DELETE ON %I FROM anon, authenticated;', t);
  END LOOP;
END $$;
