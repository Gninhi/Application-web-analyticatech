# 📋 Rapport d'Audit Exhaustif — Analyticatech (Next.js)

**Date** : Septembre 2026  
**Périmètre** : Repository `Application-web-analyticatech` (Sécurité, Qualité de code, Architecture DRY, Performance & Déploiement)  
**Environnement de validation** : Next.js 16.3.1 (React 19, TypeScript strict, Tailwind v4, Prisma 7, Supabase Postgres)  

---

## 1. Sécurité

### 1.1 Dépendances & Vulnérabilités (npm audit)

| Sévérité | Package / Dépendance | Advisory / CVE | Fichier & Dépendance parente | Statut & Correctif |
|---|---|---|---|---|
| **Majeur** | `fast-uri` (3.0.0 - 3.1.5) | GHSA-5jgf-p345-68v8, GHSA-f65p-4m7j-42xc, GHSA-fph4-wmhf-6fwf, GHSA-jqff-g426-hqxp (SSRF, host confusion) | Transitive via `ajv` / `eslint` (`node_modules/fast-uri`) | **Appliqué** : Mise à niveau vers `fast-uri@3.1.7` via résolution ciblée sans casser l'arbre. |
| **Majeur** | `deepmerge-ts` (< 8.0.0) | GHSA-ggr8-5vv4-36mx (Stack exhaustion sur fusion d'objets récursifs) | Transitive via `@prisma/config` (`node_modules/deepmerge-ts`) | **Documenté / Aucun risque d'exploitation** : Dépendance interne de développement du CLI Prisma 7. `npm audit fix --force` rétrograderait vers Prisma 6.19 (rupture architecturale AGENTS.md). Pas d'exposition runtime. |
| **Majeur** | `mysql2` (<= 3.23.0) | GHSA-3f6p-5ww8-9rcr, GHSA-rgwj-5xj2-c3m3 (Auth downgrade & DoS décompression zlib) | Transitive via connecteur Prisma (`node_modules/mysql2`) | **Documenté / Aucun risque d'exploitation** : Le projet utilise exclusivement PostgreSQL (Supabase) via `@prisma/adapter-pg`. Le driver `mysql2` n'est jamais chargé ni exécuté en production. |

---

### 1.2 Secrets, Clés API & Tokens

| Sévérité | Cible | Constat & Analyse | Statut & Correctif |
|---|---|---|---|
| **Critique (Vérifié)** | Code source (`src/`), `.env.example`, historique Git | Scan automatisé d'entropie et regex sur patterns sensibles (clés privées, tokens JWT, clés Resend `re_`, clés Supabase `service_role`, mots de passe de base de données). L'historique Git complet a été audité : aucun secret de production n'a été committé (les commits initiaux utilisaient uniquement un SQLite local `file:/home/z/my-project/db/custom.db`). | **Validé** : Aucun secret en dur. Le fichier `.env` réel est strictement exclu par `.gitignore`. `.env.example` contient uniquement des placeholders sécurisés. |

---

### 1.3 Headers HTTP, CSP, CORS, Rate Limiting & Validation des Entrées

| Sévérité | Composant | Fichier & Ligne | Description & Analyse | Statut & Correctif |
|---|---|---|---|---|
| **Critique** | CSP (Content Security Policy) | `src/proxy.ts:16-42` | CSP dynamique avec nonce cryptographique par requête (`script-src 'nonce-...' 'strict-dynamic'`), interdiction formelle d'`unsafe-eval`, `frame-ancestors 'none'`, et isolation COOP/CORP. | **Conforme & Actif** |
| **Majeur** | En-têtes HTTP de transport | `next.config.ts:31-48` | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, `Permissions-Policy`. | **Conforme & Actif** |
| **Critique** | Protection CSRF & Origine | `src/proxy.ts:60-72` & `src/app/api/v1/contact/route.ts:50-59` | Double vérification CSRF : cookie `at-csrf` cryptographique + validation fail-closed de l'origine HTTP face à la liste blanche stricte `ALLOWED_ORIGINS`. | **Conforme & Actif** |
| **Critique** | Rate Limiting & Anti-DDoS | `src/lib/security/rate-limit.ts:40` & `src/app/api/v1/contact/route.ts:40-49` | Rate limiting par empreinte SHA-256 (IP hachée avec sel RGPD + User-Agent), plafonné à 5 requêtes/heure avec en-tête `Retry-After`. Corps de requête tronqué et plafonné à 16 KB contre les attaques par déni de service. | **Conforme & Actif** |
| **Majeur** | Validation & Sanitization | `src/app/api/v1/contact/route.ts:63-125` | Quadruple honeypot anti-bots, blocage des domaines de courriels jetables, validation stricte Zod (`contactFormSchema`), sanitization anti-XSS récursive et délai anti-timing constant (500 ms). | **Conforme & Actif** |

---

### 1.4 Exposition des Variables d'Environnement Client (`NEXT_PUBLIC_`)

| Sévérité | Variable | Fichier & Rôle | Statut & Correctif |
|---|---|---|---|
| **Critique (Vérifié)** | Toutes variables `NEXT_PUBLIC_*` | `src/lib/env.ts`, `src/lib/content/site.ts`, `src/data/stats.ts` | Seules les données non-confidentielles portent le préfixe `NEXT_PUBLIC_` (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_VERSION`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_STAT_*`, `NEXT_PUBLIC_SOCIAL_*`, `NEXT_PUBLIC_BLOG_DEFAULT_AUTHOR`). Aucune variable sensible (`DATABASE_URL`, `DIRECT_URL`, `IP_SALT`, `RESEND_API_KEY`) n'est injectée côté client. | **Validé & Conforme** |

---

## 2. Bugs et Incohérences

| Sévérité | Fichier & Ligne | Description de l'incohérence | Statut & Action |
|---|---|---|---|
| **Majeur** | `public/llms.txt:32` | L'adresse email était notée `contact@analyticatech.com` alors que l'adresse officielle de l'entreprise est `contact@analyticatech.fr`. | **Appliqué** : Corrigé en `contact@analyticatech.fr`. |
| **Majeur** | `package.json:8` | La commande `next build` sous Next.js 16 crashait avec un panic Turbopack lié au binding de processus PostCSS (`os error 1`). | **Appliqué** : Script mis à jour en `next build --webpack`, garantissant une compilation 100% stable des 54 pages statiques. |
| **Mineur** | `src/app/layout.tsx:49,97` | Les métadonnées SEO globales comprenaient des statistiques en dur (`48+ missions livrées, 35% de coûts réduits`) au lieu d'utiliser la source unique `KEY_STATS_CONFIG`. | **Appliqué** : Interpolation dynamique de `${KEY_STATS_CONFIG.missions.value}` et `${KEY_STATS_CONFIG.costReduction.value}`. |
| **Mineur** | `src/components/sections/ServicesView.tsx:414` | L'attribut `quality={80}` déclenchait un warning Next.js en runtime/test (`quality 80 is not configured in images.qualities [75]`). | **Appliqué** : Aligné sur `quality={75}` (standard Next.js optimisé). |
| **Mineur (Résolu)** | `src/lib/observability/audit.ts`, `src/proxy.ts`, `src/lib/env.ts` | Présence de `console.warn` et `console.error`. | **Vérifié** : Ce sont des journaux d'audit de sécurité, des erreurs d'environnement ou des garde-fous d'erreurs réactives (`GlobalErrorBoundary`). Aucun `console.log` sauvage d'oubli de débogage n'est présent. |

---

## 3. Code Mort et Inutilisé

| Sévérité | Type d'élément | Fichier & Ligne | Description | Statut & Action |
|---|---|---|---|---|
| **Mineur** | Composant orphelin | `src/components/ui/demo.tsx:1-6` | Fichier de démonstration contenant `DemoOne` important `ButtonDemo`, jamais importé ni exposé. | **Appliqué** : Fichier supprimé. |
| **Mineur** | Export inutilisé | `src/components/ui/button-border.tsx:131-137` | Fonction `ButtonDemo` résiduelle dans le composant de bordure. | **Appliqué** : Fonction et test associé supprimés. |
| **Mineur** | Fichier orphelin | `src/config/stats.ts:1-2` | Alias de réexportation orphelin (`export * from "@/data/stats";`) non référencé. | **Appliqué** : Fichier supprimé au profit de `src/data/stats.ts`. |
| **Mineur** | Dépendance obsolète | `package.json:54` | `tailwindcss-animate` figurait dans `devDependencies`, incompatible et redondant avec Tailwind v4 (qui exploite `tw-animate-css`). | **Appliqué** : Dépendance retirée du `package.json`. |
| **Mineur (Proposé)** | Wrappers de transition | `src/components/interactive/MovingButton.tsx`, `src/components/interactive/GlassButton.tsx` | Simples proxys réexportant `Button`. Actuellement conservés pour rétro-compatibilité des tests. | **Proposé** : Conservation recommandée jusqu'à validation de la refactorisation des imports résiduels. |

---

## 4. Refactoring et DRY (Données & Logique)

| Sévérité | Domaine | Constat d'audit | Statut & Recommandation |
|---|---|---|---|
| **Majeur** | Statistiques clés de l'entreprise | Les métriques clés étaient initialement dispersées. Désormais, `src/data/stats.ts` (`KEY_STATS_CONFIG`) centralise les 4 métriques fondamentales (`missions`, `costReduction`, `uptime`, `satisfaction`) avec surcharge par variables d'environnement. | **Centralisé & Synchronisé** : Alimente désormais la Hero, la bento bar, les métadonnées de layout, le schéma JSON-LD et les fallbacks. |
| **Majeur** | Coordonnées institutionnelles & Liens Sociaux | Les coordonnées (adresse au 60 rue François 1er, email, téléphone) et liens de réseaux sociaux sont centralisés dans `src/lib/content/site.ts` (`SITE_CONFIG`). | **Centralisé & Sécurisé** : La fonction `isValidSocialUrl` masque automatiquement toute icône sociale (GitHub, Twitter) tant qu'une URL valide n'est pas fournie. Seul le LinkedIn officiel est exposé. |
| **Majeur** | Bylines & Auteurs éditoriaux | Centralisé dans `src/lib/content/site.ts` (`BLOG_CONFIG.defaultAuthor = "Martial GNINHI"`), appliqué de manière transparente sur tous les articles via `getBlogPosts`. | **Centralisé & Conforme** |
| **Mineur** | Composant bouton unifié | Multiplicité historique de variantes (`Button`, `GlassButton`, `MovingButton`, `ButtonBorder`). `Button` dans `src/components/ui/button.tsx` gère désormais l'intégralité des variantes via `cva` et `AnimatedButtonBorder`. | **Architecture Unifiée** |

---

## 5. Performance et Déploiement

| Sévérité | Domaine | Analyse & Mesures | Statut |
|---|---|---|---|
| **Majeur** | Build de production | Compilation complète via `npm run build` (`next build --webpack`). **54 pages statiques** générées avec succès (FR & EN, pages dynamiques `/services/[index]`, `/solutions/[slug]`, `/insights/[slug]`). Zéro erreur TypeScript, zéro warning ESLint. | **Validé (Succès 54/54)** |
| **Majeur** | Tests Unitaires & Intégration | `npm run test:unit` : **135 tests réussis** sur 28 suites de tests (couvrant la résilience DB, la sécurité CSRF, l'échappement XSS, le rate-limit, les routes, les mentions légales). | **100% Succès (135/135)** |
| **Majeur** | Tests End-to-End (E2E) | `npx playwright test e2e/routes.spec.ts` : **11 tests E2E réussis** (codes HTTP 200, balises H1 uniques, titres, métadonnées OpenGraph et liens canoniques). | **100% Succès (11/11)** |
| **Majeur** | Optimisation des Images | Utilisation systématique de `next/image` avec formats WebP, `sizes`, `priority` sur la première vue de viewport et `loading="lazy"` sur les suivantes. | **Conforme & Optimisé** |
| **Mineur** | Documentation & Déploiement | Le `README.md` et `.env.example` ont été audités : ils reflètent fidèlement l'état réel de l'application, les commandes Prisma 7, le pooler Supabase, et la configuration des ports. | **Conforme & À jour** |

---

## 6. Claims Éditoriaux & Engagements Réglementaires (Rappel des arbitrages appliqués)

Pour mémoire, les arbitrages validés lors des étapes précédentes ont été strictement implémentés sans sur-revendication :
1. **Disponibilité opérationnelle** : Définie contractuellement à **9h30 - 17h30 (lun-ven)** sur toutes les pages de contact, FAQ et SEO. Les mentions « 24/7 » ont été requalifiées en « Dashboard temps réel en continu » et « Supervision continue ».
2. **Accord de confidentialité (NDA)** : Engagement maintenu et valorisé sur les formulaires et parcours clients.
3. **Qualification Cloud Souverain** : Requalifié rigoureusement en « Compatible cloud souverain qualifié SecNumCloud » (sans prétendre à une qualification directe du site).
4. **Certifications tierces** : Retrait complet des mentions directes ISO 27001, SOC 2 et HDS dans le footer et les schémas SEO au profit de la « Conformité RGPD ».

---

## 7. Ce qu'il reste à valider avant un push GitHub

1. **Revue de la liste des fichiers modifiés et supprimés** (`git status` : suppression de `demo.tsx`, `config/stats.ts`, retrait de `tailwindcss-animate`).
2. **Validation finale du contenu de `public/llms.txt` et de `AUDIT_REPORT.md`**.
3. **Confirmation du script de build de production** (`next build --webpack` dans `package.json`).
4. **Vérification de vos clés d'environnement réelles sur votre hébergement Vercel/Supabase** (`IP_SALT`, `DATABASE_URL`).
5. **Votre feu vert explicite pour procéder au commit et au `git push origin main`**.
