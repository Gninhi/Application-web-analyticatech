-- ============================================================================
-- Prisma Migration Baseline — Application-web-analyticatech
-- Date : 2026-08-24 (création manuelle, projet utilisant prisma db push)
-- But : tracer l'état actuel du schéma Prisma pour tout nouveau développeur.
-- ============================================================================
-- AVERTISSEMENT : ce fichier ne sera PAS appliqué via `prisma migrate deploy`
-- car le projet utilise `prisma db push`. Il sert de documentation
-- de référence de schéma. Toute modification du schéma doit être accompagnée
-- d'une mise à jour de ce fichier et d'un `prisma db push --filter`.
-- ============================================================================

-- Model : Metric
CREATE TABLE "Metric" (
  id           TEXT NOT NULL PRIMARY KEY,
  key          TEXT NOT NULL UNIQUE,
  label        TEXT NOT NULL,
  label_en     TEXT,
  value        TEXT,
  numeric_value FLOAT,
  suffix       TEXT,
  trend        FLOAT,
  sparkline    JSONB,
  source       TEXT NOT NULL DEFAULT 'static',
  order        INTEGER NOT NULL DEFAULT 0,
  active       BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Model : ClientLogo
CREATE TABLE "ClientLogo" (
  id           TEXT NOT NULL PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,
  sector       TEXT,
  logo_url     TEXT,
  website_url  TEXT,
  order        INTEGER NOT NULL DEFAULT 0,
  active       BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Model : Service
CREATE TABLE "Service" (
  id               TEXT NOT NULL PRIMARY KEY,
  index            TEXT NOT NULL UNIQUE,
  icon_key         TEXT,
  bg_image_path    TEXT,
  mesh_overlay     TEXT,
  order            INTEGER NOT NULL DEFAULT 0,
  active           BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Model : ServiceTranslation
CREATE TABLE "ServiceTranslation" (
  id           TEXT NOT NULL PRIMARY KEY,
  service_id     TEXT NOT NULL,
  locale         TEXT NOT NULL,
  title          TEXT,
  tagline        TEXT,
  description    TEXT,
  service        TEXT NOT NULL REFERENCES "Service"(id) ON DELETE CASCADE,

  UNIQUE(service_id, locale),
  INDEX(service_id, locale)
);

-- Model : ServiceMetric
CREATE TABLE "ServiceMetric" (
  id        TEXT NOT NULL PRIMARY KEY,
  service_id  TEXT NOT NULL,
  label       TEXT,
  value       TEXT,
  order       INTEGER NOT NULL DEFAULT 0,
  service     TEXT NOT NULL REFERENCES "Service"(id) ON DELETE CASCADE,

  INDEX(service_id)
);

-- Model : ServiceTechnology
CREATE TABLE "ServiceTechnology" (
  id        TEXT NOT NULL PRIMARY KEY,
  service_id  TEXT NOT NULL,
  name        TEXT,
  order       INTEGER NOT NULL DEFAULT 0,
  service     TEXT NOT NULL REFERENCES "Service"(id) ON DELETE CASCADE,

  UNIQUE(service_id, name),
  INDEX(service_id)
);

-- Model : Solution
CREATE TABLE "Solution" (
  id           TEXT NOT NULL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE
);

-- Model : SolutionTranslation
CREATE TABLE "SolutionTranslation" (
  id           TEXT NOT NULL PRIMARY KEY,
  solution_id  TEXT NOT NULL,
  locale       TEXT NOT NULL,
  title        TEXT,
  content      TEXT,
  solution     TEXT NOT NULL REFERENCES "Solution"(id) ON DELETE CASCADE,

  UNIQUE(solution_id, locale),
  INDEX(solution_id, locale)
);

-- Model : SolutionTag
CREATE TABLE "SolutionTag" (
  id           TEXT NOT NULL PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE
);

-- Model : BlogCategory
CREATE TABLE "BlogCategory" (
  id           TEXT NOT NULL PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE
);

-- Model : BlogCategoryTranslation
CREATE TABLE "BlogCategoryTranslation" (
  id           TEXT NOT NULL PRIMARY KEY,
  category_id  TEXT NOT NULL,
  locale       TEXT NOT NULL,
  name         TEXT,
  category     TEXT NOT NULL REFERENCES "BlogCategory"(id) ON DELETE CASCADE,

  UNIQUE(category_id, locale),
  INDEX(category_id, locale)
);

-- Model : BlogPost
CREATE TABLE "BlogPost" (
  id           TEXT NOT NULL PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  excerpt      TEXT,
  content      TEXT,
  published    BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  author       TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Model : BlogPostTranslation
CREATE TABLE "BlogPostTranslation" (
  id           TEXT NOT NULL PRIMARY KEY,
  blog_post_id TEXT NOT NULL,
  locale       TEXT NOT NULL,
  title        TEXT,
  excerpt      TEXT,
  content      TEXT,
  blog_post    TEXT NOT NULL REFERENCES "BlogPost"(id) ON DELETE CASCADE,

  UNIQUE(blog_post_id, locale),
  INDEX(blog_post_id, locale)
);

-- Model : BlogPostTag
CREATE TABLE "BlogPostTag" (
  id           TEXT NOT NULL PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE
);

-- Model : Capability
CREATE TABLE "Capability" (
  id           TEXT NOT NULL PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE
);

-- Model : CapabilityTranslation
CREATE TABLE "CapabilityTranslation" (
  id           TEXT NOT NULL PRIMARY KEY,
  capability_id TEXT NOT NULL,
  locale       TEXT NOT NULL,
  title        TEXT,
  description  TEXT,
  capability   TEXT NOT NULL REFERENCES "Capability"(id) ON DELETE CASCADE,

  UNIQUE(capability_id, locale),
  INDEX(capability_id, locale)
);

-- Model : Testimonial
CREATE TABLE "Testimonial" (
  id           TEXT NOT NULL PRIMARY KEY,
  author_name  TEXT,
  company      TEXT,
  rating       INTEGER,
  text         TEXT,
  published    BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Model : TestimonialTranslation
CREATE TABLE "TestimonialTranslation" (
  id           TEXT NOT NULL PRIMARY KEY,
  testimonial_id TEXT NOT NULL,
  locale       TEXT NOT NULL,
  author_name  TEXT,
  company      TEXT,
  text         TEXT,
  testimonial  TEXT NOT NULL REFERENCES "Testimonial"(id) ON DELETE CASCADE,

  UNIQUE(testimonial_id, locale),
  INDEX(testimonial_id, locale)
);

-- Model : NavItem
CREATE TABLE "NavItem" (
  id           TEXT NOT NULL PRIMARY KEY,
  label        TEXT NOT NULL,
  label_en     TEXT,
  path         TEXT NOT NULL,
  order        INTEGER NOT NULL DEFAULT 0,
  active       BOOLEAN NOT NULL DEFAULT true,
  parent_id    TEXT REFERENCES "NavItem"(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- RÉSUMÉ DU SCHEMA (40 tables au total, non exhaustif dans ce fichier)
-- Voir schema.prisma pour la définition complète des modèles, validations
-- (champs @unique, @default, relations @relation, enums, etc.).
-- ============================================================================

-- Fin de la migration baseline.
-- Toute modification du schéma Prisma doit être suivie d'un `prisma db push`
-- pour garder la base de données synchronisée en développement/local.
-- En production, les migrations Supabase (via le MCP) sont à appliquer
-- séparément (voir supra la migration harden_rls_contact_requests).
-- FIN.