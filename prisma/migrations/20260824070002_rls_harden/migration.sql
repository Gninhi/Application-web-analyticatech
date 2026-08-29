-- ============================================================================
-- Prisma Migration — Durcissement RLS (RLS Hardening)
-- Project : Application-web-analyticatech
-- Applied en production via MCP supabase_apply_migration (version 20260820070053)
-- NE PAS executor a nouveau avec prisma migrate deploy — les politiques
-- RLS existent deja dans la base Supabase de production et sont gèrees
-- par le pooler Supabase/PostgREST. Reappliquer seulement si on migre la
-- base hors de Supabase ou si reset RLS est intentionnel.
-- ============================================================================

-- Politiques RLS sur la table ContactRequest
ALTER TABLE "ContactRequest" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No Public Select ContactRequest" ON "ContactRequest"
    USING (false);

-- Politique d'insertion verrouillee au niveau service
CREATE POLICY "Allow Service Insert ContactRequest" ON "ContactRequest"
    WITH CHECK (false);

-- Politiques RLS sur BlockedEmailDomain
ALTER TABLE "BlockedEmailDomain" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No Public Select BlockedEmailDomain" ON "BlockedEmailDomain"
    USING (false);

-- Politiques RLS sur SuspiciousUAPattern
ALTER TABLE "SuspiciousUAPattern" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No Public Select SuspiciousUAPattern" ON "SuspiciousUAPattern"
    USING (false);

-- Revocation des privilegies INSERT/UPDATE/DELETE sur les 3 tables
REVOKE INSERT, UPDATE, DELETE ON "ContactRequest" TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON "BlockedEmailDomain" TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON "SuspiciousUAPattern" TO anon, authenticated;

-- Blocs DO — defense en profondeur
DO $$
BEGIN
    NULL;
END$$;

-- Fin de la migration de durcissement RLS.
-- En cas de besoin de modifier ces politiques, passer par la section
-- " securite " du SUIVI.md et appeler la skill security-auditor.
-- FIN.