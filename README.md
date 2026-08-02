# Analyticatech — Site web officiel

Application web du cabinet de conseil **Analyticatech** (IA, Agents & Automatisation).
Construite avec **Next.js 16**, **Prisma**, **Supabase** et un design system
« Corporate Cyberpunk ». Bilingue FR/EN, SEO avancé et sécurité niveau bancaire.

Présentation des services, solutions sectorielles, blog, témoignages,
politique de confidentialité, mentions légales, formulaires de contact — le tout
piloté par une base de données Supabase PostgreSQL.

---

## Aperçu

- **Stack** : Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4,
  Prisma 6, Supabase (PostgreSQL).
- **Design** : thème clair/sombre, animations Framer Motion + Three.js, polices
  Space Grotesk / Inter / JetBrains Mono.
- **i18n** : français ( défaut) et anglais, basé sur un cookie `NEXT_LOCALE`.
- **Sécurité** : CSP stricte, CSRF (double-submit cookie), détection de bots,
  rate limiting, validation Zod, hachage RGPD des IP, RLS Supabase.
- **SEO** : metadata dynamique, JSON-LD, sitemap, robots.txt, Open Graph.

---

## Démarrage rapide

### Prérequis

- Node.js 20+
- Une base PostgreSQL (Supabase recommandé)

### Installation

```bash
# 1. Cloner et installer
git clone https://github.com/Gninhi/Application-web-analyticatech.git
cd Application-web-analyticatech
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos informations (DATABASE_URL, DIRECT_URL, IP_SALT...)

# 3. Initialiser la base de données
npx prisma generate
npx prisma db push
npm run seed

# 4. Lancer le serveur de développement
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

### Build de production

```bash
npm run build
npm start
```

---

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner :

| Variable | Description | Obligatoire |
|---|---|:---:|
| `DATABASE_URL` | URL PostgreSQL (transaction pooler, port 6543) | ✅ |
| `DIRECT_URL` | URL PostgreSQL directe (port 5432, pour Prisma migrate) | ✅ |
| `IP_SALT` | Sel cryptographique pour le hachage RGPD des IP | ✅ |
| `ALLOWED_ORIGINS` | Origines autorisées pour la vérification CSRF | ✅ |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site | ✅ |
| `RESEND_API_KEY` | Clé API Resend pour l'envoi de mails (mode stub si absent) | ⬜ |
| `MAIL_FROM` | Adresse d'expédition des notifications contact | ⬜ |
| `MAIL_TO` | Adresse de réception des demandes contact | ⬜ |

> **Sécurité** : ne jamais committer le fichier `.env`. Il est ignoré par défaut
> via `.gitignore`. En production, configurer ces variables dans le dashboard
> Vercel (Project Settings → Environment Variables).

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (port 3000) |
| `npm run build` | Build de production |
| `npm start` | Serveur de production |
| `npm run lint` | Lint ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm run db:push` | Pousser le schéma Prisma vers la base |
| `npm run db:generate` | Générer le client Prisma |
| `npm run db:migrate` | Créer/appliquer une migration |
| `npm run seed` | Peupler la base avec les données initiales |

---

## Architecture du projet

```
.
├── prisma/
│   ├── schema.prisma       # Schéma de la base (35+ modèles)
│   ├── seed.ts             # Données initiales (services, solutions, blog...)
│   └── rls.sql             # Politiques Row Level Security Supabase
├── public/                 # Assets statiques (logo, screenshots, backgrounds)
├── src/
│   ├── app/                # App Router Next.js (pages, API routes, layout)
│   │   ├── api/
│   │   │   ├── health/      # Health check pour monitoring
│   │   │   └── v1/contact/  # Formulaire de contact (validation + persistance)
│   │   ├── layout.tsx       # Layout racine (polices, ThemeProvider, i18n)
│   │   ├── page.tsx         # Page d'accueil (Server Component)
│   │   ├── robots.ts        # robots.txt dynamique
│   │   └── sitemap.ts       # Sitemap dynamique
│   ├── components/
│   │   ├── branding/        # Logo, ThemeToggle, LanguageToggle, CookieConsent
│   │   ├── effects/         # ImmersiveBackground, ParticleField
│   │   ├── interactive/     # AnimatedCounter, Marquee, ScrambleText, SpotlightCard...
│   │   ├── layout/          # Navbar, Footer, BackToTop, PageLoader, AppClientShell
│   │   ├── providers/       # ContentProvider
│   │   ├── sections/        # Vues : Home, About, Services, Solutions, Blog, Contact, Legal
│   │   ├── seo/             # JsonLd (données structurées)
│   │   ├── system/          # GlobalErrorBoundary
│   │   └── ui/              # Composants UI (toast, moving-border)
│   ├── hooks/               # useScrollState, use-toast
│   ├── lib/
│   │   ├── content/          # Constantes du site
│   │   ├── db/               # Client Prisma
│   │   ├── email/            # Mailer (Resend ou mode stub)
│   │   ├── http/             # safeFetch
│   │   ├── i18n/             # Provider + données FR/EN
│   │   ├── observability/    # Audit log
│   │   ├── security/         # CSRF, fingerprint, origin, rate-limit, sanitize, user-agent
│   │   ├── services/        # Services Prisma (content, seo, navigation, blog...)
│   │   ├── utils/            # cn, version
│   │   └── validation/       # Schémas Zod
│   ├── proxy.ts             # Middleware de sécurité (CSRF, bot detection, size limit)
│   └── types/               # Types TypeScript partagés
├── next.config.ts           # Config Next.js + CSP + security headers
├── tailwind.config.ts       # Config Tailwind (thème, darkMode classe)
└── eslint.config.mjs        # Config ESLint (Next + TypeScript)
```

---

## Sécurité

L'application met en œuvre une défense en profondeur « niveau bancaire » :

- **CSP stricte** dans `next.config.ts` (pas d'`unsafe-eval` en production).
- **Headers de sécurité** : `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `HSTS`, `Content-Security-Policy`.
- **CSRF** : double-submit cookie via `src/proxy.ts` (comparaison temps-constant).
- **Bot detection** : blocage des User-Agents suspects (sqlmap, nikto, nmap...).
- **Rate limiting** et **validation Zod** sur les entrées utilisateur.
- **RGPD** : hachage irréversible des IP avec un sel (`IP_SALT`).
- **RLS Supabase** : politiques d'accès sur les 35+ tables (`prisma/rls.sql`).
- **Isolation** : les demandes de contact ne sont lisibles que côté serveur.

---

## Base de données

Le schéma Prisma (`prisma/schema.prisma`) définit 35+ modèles organisés autour de :

- **Contenu** : `Service`, `Solution`, `Capability`, `BlogPost`, `Testimonial`
- **Marketing** : `Metric`, `ClientLogo`, `MarqueeKeyword`, `ActivityLogEntry`
- **Navigation** : `NavItem` + traductions
- **SEO** : `SeoMetadata`, `SeoSchema`, `FaqEntry`
- **Contact** : `ContactRequest` (avec statut, référence, IP hash)
- **Sécurité** : `BlockedEmailDomain`, `SuspiciousUAPattern`, `AppConfig`
- **Traductions** : chaque modèle de contenu possède une table `*Translation`
  (FR/EN) via l'enum `Locale`.

Le seed (`prisma/seed.ts`) peuple la base avec les données initiales
(site config, services, solutions, blog, SEO...).

Pour appliquer les politiques RLS :

```bash
# Dans le SQL Editor Supabase, exécuter :
cat prisma/rls.sql | psql "$DIRECT_URL"
```

---

## Déploiement (Vercel)

L'application est prête pour Vercel :

1. Push le dépôt sur GitHub.
2. Importer le projet dans Vercel.
3. Configurer les variables d'environnement (voir le tableau ci-dessus).
4. Vercel détecte automatiquement Next.js et lance `npm run build`.

L'option `output: "standalone"` est activée dans `next.config.ts` pour un
déploiement Docker optimisé.

---

## Licence

Code privé — © Analyticatech. Tous droits réservés.
