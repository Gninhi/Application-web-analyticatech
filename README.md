# Analyticatech — Site web officiel

Application web du cabinet de conseil **Analyticatech** (IA, Agents & Automatisation).
Construite avec **Next.js 16**, **Prisma 7**, **Supabase** et un design system
« Corporate Cyberpunk ». Bilingue FR/EN, SEO avancé et sécurité niveau bancaire.

Présentation des services, solutions sectorielles, blog, témoignages,
politique de confidentialité, mentions légales, formulaires de contact — le tout
piloté par une base de données Supabase PostgreSQL.

---

## Aperçu

- **Stack** : Next.js 16 (App Router), React 19, TypeScript 5 strict, Tailwind CSS 4,
  Prisma 7, Supabase PostgreSQL (via pooler Supabase).
- **Design system** : thème clair/sombre, animations Framer Motion 12, pas de Three.js.
  Polices : Space Grotesk (titres), Inter (corps), JetBrains Mono (code).
- **i18n** : français (par défaut) et anglais, basé sur cookie `NEXT_LOCALE`.
- **Sécurité** : CSP stricte, CSRF (double-submit cookie), détection de bots,
  rate limiting, validation Zod, hachage RGPD des IP, RLS Supabase.
- **SEO** : metadata dynamique, JSON-LD, sitemap, robots.txt, Open Graph.
- **Performance** : next/image, lazy sections avec IO rootMargin 1000px,
  placeholders SectionSkeleton par breakpoint, pas d`unmount en cours de scroll.
- **Interactive components** : CursorDot (curseur tech tracking mouse),
  ancien Marquee supprimé (code mort), pas d'animation `whileInView` sur home.

---

## Prérequis

- Node.js 20+
- Une base PostgreSQL (Supabase recommandé avec pooler)
- Compte Vercel (optionnel, pour le déploiement)

---

## Installation

```bash
# 1. Cloner et installer
git clone https://github.com/Gninhi/Application-web-analyticatech.git
cd Application-web-analyticatech
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos informations (voir tableau Variables d'environnement ci-dessous)

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

Copier `.env.example` en `.env` et renseigner les valeurs suivantes :

| Variable | Description | Obligatoire |
|---|---|:---:|
| `DATABASE_URL` | URL PostgreSQL (transaction pooler Supabase, port 6543) | ✅ |
| `DIRECT_URL` | URL PostgreSQL directe (port 5432, pour Prisma migrate) | ✅ |
| `IP_SALT` | **Sel cryptographique 64-char hexadécimal** pour le hachage RGPD des IP | ✅ |
| `ALLOWED_ORIGINS` | Origines autorisées pour la vérification CSRF (format: https://analyticatech.fr) | ✅ |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (ex: `https://analyticatech.fr`) | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase | ✅ |
| `RESEND_API_KEY` | Clé API Resend pour l'envoi de mails (mode stub si absent) | ⬜ |
| `MAIL_FROM` | Adresse d'expédition des notifications contact | ⬜ |
| `MAIL_TO` | Adresse de réception des demandes contact | ⬜ |

### Sécurité critique

- Ne jamais committer le fichier `.env`. Il est ignoré par défaut via `.gitignore`.
- En production, configurer ces variables dans le dashboard Vercel
  (Project Settings → Environment Variables).
- `IP_SALT` doit être une chaîne de 64 caractères hexadécimaux (32 octets d'entropie).
- `ALLOWED_ORIGINS` doit inclure l'origine du site produit.

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (port 3000, Turbopack) |
| `npm run build` | Build de production (standalone output) |
| `npm start` | Serveur de production (serveur standalone) |
| `npm run lint` | Lint ESLint (erreurs sont des erreurs) |
| `npm run typecheck` | Vérification TypeScript (`tsc --noEmit`) |
| `npm run test:unit` | Tests unitaires Vitest (75 tests, node env) |
| `npm run test:e2e` | Tests e2e Playwright (28/31 tests, 3 offline attendus) |
| `npm run test` | Exécuter unit + e2e |
| `npm run db:generate` | Générer le client Prisma |
| `npm run db:push` | Pousser le schéma Prisma vers la base |
| `npm run db:migrate` | Créer/appliquer une migration |
| `npm run seed` | Peupler la base avec les données initiales |

---

## Architecture du projet

```
.
├ prisma/
│   ├── schema.prisma       # Schéma de la base (35+ modèles)
│   ├── seed.ts             # Données initiales (services, solutions, blog...)
│   ├── rls.sql             # Politiques Row Level Security Supabase
│   └── migration/          # Migrations Prisma numérotées
├ public/                   # Assets statiques (logo, screenshots, backgrounds)
├ src/
│   ├── app/                # App Router Next.js (pages, API routes, layout)
│   │   ├── api/
│   │   │   ├── health/      # Health check pour monitoring
│   │   │   └── v1/contact/  # Formulaire de contact (validation + persistance)
│   │   ├── layout.tsx      # Layout racine (polices, ThemeProvider, i18n)
│   │   ├── page.tsx        # Page d'accueil (Server Component)
│   │   ├── robots.ts       # robots.txt dynamique
│   │   └── sitemap.ts       # Sitemap dynamique
│   ├── components/
│   │   ├── branding/        # Logo, ThemeToggle, LanguageToggle, CookieConsent
│   │   ├── effects/         # ImmersiveBackground, ParticleField
│   │   ├── interactive/     # **CursorDot** — curseur tech tracking mouse
│   │   │   └── CursorDot.tsx
│   │   ├── layout/          # Navbar, Footer, BackToTop, SiteShell
│   │   ├── providers/       # ContentProvider, I18nProvider
│   │   ├── sections/        # Vues : Home, About, Services, Solutions, Blog, Contact, Legal
│   │   ├── seo/             # JsonLd (données structurées)
│   │   ├── system/          # GlobalErrorBoundary
│   │   ├── ui/              # Composants UI (toast, moving-border)
│   │   └── ...
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
├ next.config.ts            # Config Next.js + CSP + security headers
├ tailwind.config.ts        # Config Tailwind (thème, darkMode classe)
└── eslint.config.mjs        # Config ESLint (Next + TypeScript)
```

### Composants interactifs (post-nettoyage)

- **CursorDot** (`src/components/interactive/CursorDot.tsx`) — Curseur
  tech avec suivi souris fluide (2 points : point suivant + grand cercle border au hover).
  Doit être inclus dans `SiteShell` pour apparaître sur toutes les pages.
- **Ancien Marquee** — Supprimé (`dead code removed`) ; voir git history si besoin.
- **Aucune animation `whileInView`** sur la page d'accueil — les sections utilisent
  `dynamic()` + `LazySection` avec préchargement idle.

---

## Déploiement (Vercel + domaine analyticatech.fr)

L'application est prête pour Vercel avec output `standalone` :

1. **Push** le dépôt sur GitHub.
2. **Importer** le projet dans Vercel (depuis GitHub).
3. **Configurer** les variables d'environnement dans Vercel
   (Project Settings → Environment Variables) en utilisant le tableau ci-dessus.
4. **Domaine personnalisé** : ajouter `analyticatech.fr` (et `www.analyticatech.fr`)
   dans Vercel → Domains. Les certificats SSL sont gérés automatiquement.
5. Vercel détecte automatiquement Next.js et lance `npm run build`.
6. L'option `output: "standalone"` dans `next.config.ts` garantit un déploiement
   Docker optimisé sans dépendances locales.

### Dépannage déploiement

- Si build échoue : vérifier les variables d'environnement Vercel (surtout
  `DATABASE_URL` et `IP_SALT`).
- Si CSP bloque des ressources : vérifier `next.config.ts` pour les `script-src`
  et `style-src` nécessaires aux animations Framer Motion et polices Google Fonts.
- Erreurs runtime : consulter `vercel_runtime_errors` ou les logs dans le tableau de bord Vercel.

---

## Contribution / Adding new features

Quand vous ajoutez une nouvelle fonctionnalité :

1. **Toujours TypeScript strict** — `npm run typecheck` doit passer à 0 erreur.
2. **Pas de `console.log` en production** — les warnings de lint sont des erreurs.
3. **Respecter la charte graphique** — couleurs `#F26D3D` (accent orange), `glass-card` /
   `glass-strong`, tags eyebrow uppercase.
4. **Animations** — transform/opacity seulement, respecter
   `prefers-reduced-motion` (`SiteShell` prop `reducedMotion="user"`).
5. **SSR-safe** — les composants `use client` doivent retourner `null` si
   `typeof window === "undefined"` (ex: `CursorDot`).
6. **Tests** — ajouter des tests unitaires dans `src/components/ui/*.test.tsx`
   et faire passer `npm run test:unit` (doit rester à 75/75 ou +).
7. **Build** — `npm run build` doit finir avec `13/13 pages` et aucun avertissement.

### Workflow git

```bash
git checkout -b feature/votre-nouvelle-feature
# ... développement ...
npm run lint && npm run typecheck && npm run build
git commit -m "feat: description concise de la feature"
git push origin feature/votre-nouvelle-feature
# Ouvrir PR sur GitHub, reviewer, merge
```

---

## Licence

Code privé — © Analyticatech. Tous droits réservés.
