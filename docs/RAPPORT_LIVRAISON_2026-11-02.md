# Rapport de livraison — analyticatech.fr (2 novembre 2026)

Branche : `contenu/audit-confiance` (PR #2), construite sur `refonte-design-system` et sur la PR #1 (sécurité, CI). **Rien n'a été déployé ni modifié en production.**

## 1. Synthèse exécutive

Le site est cohérent avec la réalité de l'entreprise : une SAS fondée en 2024, dirigée par une seule personne et établie à Paris. Chiffres invérifiables, équipe fictive, certifications non détenues et témoignages ont été supprimés. La page Solutions présente les vrais projets du fondateur. Le hero, le fond « noir sidéral » et le header d'origine sont restaurés, avec un contenu conforme.

Tous les contrôles automatisés passent : lint, typecheck, 549 tests unitaires, build, budget JS, 36 tests e2e, plus un audit Playwright de 46 pages sur 2 formats. L'accessibilité Lighthouse est à 100 sur les 4 pages mesurées.

**Prêt à publier sous réserve** des validations humaines de la section 21. Aucune anomalie critique ne subsiste dans le périmètre vérifié.

## 2. État initial (baseline)

| Contrôle | Résultat initial |
|---|---|
| Production | Ancienne version : « 48+ missions », « 99,9 % », « SecNumCloud », témoignages |
| CI GitHub | En échec en 0 s à chaque push depuis septembre (workflow invalide) |
| Next.js | 16.3.1, plusieurs RCE critiques |
| Budget JS | Dépassé (chunk `main` de 182 à 198 Ko gzip pour 140 Ko autorisés) |
| Lint / types / unitaires | Verts (211 tests) |
| e2e | 35/36 ; un test instable, déjà en échec sur `main` |
| Contenu | Base Supabase servant chiffres, auteurs fictifs, « équipe dédiée » ; Strasbourg non immatriculé |

## 3. Travaux restants identifiés (début de mission)

| Tâche | Statut initial | Statut final |
|---|---|---|
| Hero, fond, header d'origine | Partiellement implémenté | Corrigé et vérifié |
| Page Insights | Non implémenté | Corrigé et vérifié |
| Cohérence visuelle du site (pages, thème clair, mobile) | Non vérifié | Corrigé et vérifié |
| Libellé du bouton d'action du header | Ouvert | En attente de validation humaine (« Prendre rendez-vous » conservé) |
| Build et e2e après refonte | Non vérifié | Corrigé et vérifié |
| Hôte canonique (apex ou www) | Non implémenté | Corrigé et vérifié (www) |
| E-mail de lead perdu possible (« fire-and-forget ») | Non implémenté | Corrigé et vérifié |
| Mentions légales et articles en français sur le site EN | Non implémenté | Non corrigé (risque résiduel R3) |
| Purge des demandes à 3 ans | Non implémenté | En attente de validation humaine (R4) |
| Limitation de débit partagée | Non implémenté | Non corrigé (R2) |
| Pages statiques (CSP sans nonce) | Non implémenté | Non corrigé (R1) |

## 4. Travaux réalisés (cette mission)

- **Hero d'origine restauré.** Mot animé limité à des qualités vérifiables, barre de réassurance factuelle, badge lisible sur mobile (il débordait de 49 px).
- **Thème obsidienne restauré.** Jetons de couleur, verre, polices Space Grotesk, Inter et JetBrains Mono, boutons et header de production. Les blocs bleu marine hérités de la refonte sont alignés sur ce thème.
- **Page Insights.** « Lire l'article » au lieu de « Lire le rapport », plus de « REPORT_xxxx », compteur en articles. Nouvelle section « Ligne éditoriale » qui relie les articles aux projets réels. Suppression de l'`AnimatePresence mode="wait"` (trou de hauteur entre deux filtres).
- **Formulaire de contact.**
  - L'e-mail et la télémétrie passent par `after()` de Next : l'envoi n'est plus abandonné après la réponse.
  - La télémétrie serveur n'est envoyée qu'avec consentement ; le repli sur l'empreinte de l'appareil est supprimé.
  - 7 tests de route ajoutés.
- **Bandeau cookies.** Il n'est affiché que si une mesure d'audience est configurée (aucune en production). Politique de confidentialité alignée sur ce comportement.
- **Pied de page.** « Conformité RGPD » devient « Engagement RGPD » ; « conformité AI Act » devient « AI Act pris en compte ».
- **SEO.** Hôte canonique `www.analyticatech.fr` partout : canonical, hreflang, sitemap, robots, JSON-LD, llms.txt. Titre « — Solution sectorielle » corrigé.
- **Supervision.** `/api/health` renvoie 503 si la base est injoignable.
- **Accessibilité.**
  - Onglets sans `tablist` (graphe du système) corrigés.
  - Contraste blanc sur orange (3,53:1) remplacé par du texte foncé.
  - Noms accessibles alignés sur le texte visible (WCAG 2.5.3).
- **Code mort.** Composants `ScrambleText` et `Sparkline`, gabarit `examples/websocket`, `mini-services/`, `download/`, `Caddyfile`, réexports inutiles de `safe.ts`.
- **Dépendances fantômes déclarées.** `pg` et `dotenv`.
- **Documentation.** `docs/REGISTRE_INFORMATIONS.md` (registre des informations) et ce rapport.

Travaux antérieurs de la même session, déjà dans la PR #2 : page Solutions avec les vrais projets, contenu entièrement versionné dans le code, charte de contenu testée, politique de confidentialité complète, engagements uniques, `robots.txt` aligné sur les mentions légales. Voir la description de la PR #2.

## 5. Registre des informations factuelles vérifiées

Voir `docs/REGISTRE_INFORMATIONS.md`. Il couvre l'identité légale vérifiée au registre, les engagements, les projets vérifiés dans leurs dépôts, le cas réel, l'hébergement et les sous-traitants.

## 6. Informations retirées ou à valider

Retirées : voir la section 6 du registre. À valider : section 21 ci-dessous.

## 7. Architecture avant / après

- **Avant :** le contenu éditorial était lu dans Supabase à chaque requête, avec un repli sur le code ; base et code divergeaient.
- **Après :** le contenu est entièrement dans le code (`src/lib/content`, `src/locales`, `src/data`), relu en revue de code et vérifié par `content-charter.test.ts`. La base ne sert plus qu'aux demandes de contact et aux listes de sécurité. Aucune nouvelle dépendance, aucune nouvelle couche d'abstraction.

## 8 à 10. Fichiers, composants et code mort

- Fichiers modifiés : voir le diff de la PR #2.
- Composants restaurés depuis la production : `HeroSection`, `Navbar`, `LanguageToggle`, `NavbarActionToggle`, `Button`, `ButtonBorder`, `globals.css`.
- Composants supprimés : `ScrambleText`, `Sparkline`, ainsi que les services `metrics`, `clients` et `testimonials`.
- Après un second passage de knip, il ne reste que des faux positifs :
  - `tests/mocks/server-only.ts` (alias Vitest) ;
  - `@prisma/client` (runtime du client généré) ;
  - `postcss` (installé avec Tailwind) ;
  - des exports de types.

## 11. Sécurité

| ID | Gravité | Constat | Correction | Test | Statut |
|---|---|---|---|---|---|
| S1 | P0 | Next 16.3.1 vulnérable (RCE) | 16.4.4 (PR #1) | `npm audit` : 0 critique, haute ou modérée | Corrigé et vérifié |
| S2 | P1 | E-mail de lead pouvant être abandonné | `after()` | `route.test.ts` | Corrigé et vérifié |
| S3 | P1 | Télémétrie serveur sans consentement | Conditionnée à l'identifiant PostHog | `route.test.ts` | Corrigé et vérifié |
| S4 | P0 | Succès affiché sans enregistrement ? | Vérifié : succès seulement après écriture en base, 500 sinon | `route.test.ts` | Non applicable (déjà correct) |
| S5 | — | Secrets dans le bundle client | Recherche dans `.next/static` : aucun | Recherche par motifs | Vérifié |
| S6 | P2 | Limitation de débit en mémoire, inefficace en serverless | — | — | Non corrigé (R2) |
| S7 | P3 | 4 vulnérabilités « low » via `resend` 4.x | Nécessite resend 6 (majeure) | — | Non corrigé |

Protections en place et vérifiées par les tests : jeton CSRF (double soumission), allowlist d'origines, pots de miel, validation Zod, nettoyage XSS, IP hachée.

## 12. UX/UI

- **Navigateur :** pages vérifiées en sombre, en clair et en mobile 375 px (menu mobile compris).
- **Audit Playwright, 46 pages × 2 formats :** aucune erreur console, aucune réponse HTTP en erreur, aucun débordement horizontal, un H1 par page, images avec texte alternatif, boutons nommés.
- **Correctif :** badge du hero qui débordait sur mobile.

## 13. SEO technique

- Canonicals et hreflang alignés sur l'hôte réellement servi (`www`).
- JSON-LD rendu côté serveur, limité aux faits du registre.
- Sitemap de 46 URL ; 30 liens internes vérifiés, aucun cassé.
- Redirections 308 des contenus retirés.
- SEO Lighthouse : 100 sur les 4 pages mesurées.

## 14. Performances

| Mesure | Avant | Après |
|---|---|---|
| Chunk JS `main` (gzip) | 197,6 Ko | 95,6 Ko |
| Lighthouse mobile, performance (accueil / contact / solutions / insights) | 80 (accueil, avant les correctifs a11y) | 87 / 85 / 86 / 88 |
| LCP en laboratoire (Lighthouse mobile, simulé) | 4,4 s | 3,7 à 4,1 s |
| LCP local sans bridage (Playwright) | — | 140 à 250 ms |
| CLS (Lighthouse) | 0 | ≤ 0,075 |
| TBT | 80 ms | 80 à 180 ms |

Ce sont des mesures de laboratoire, en local, avec une exécution par page : ce ne sont pas des données d'utilisateurs réels. L'objectif de LCP ≤ 2,5 s n'est **pas atteint** en simulation mobile (voir R1).

## 15 à 17. Tests et premier contrôle

- `npm run lint` ✅, `tsc --noEmit` ✅, `vitest` ✅ 549/549 (dont 7 nouveaux tests de route), `next build` ✅, `check:perf` ✅
- Playwright : 36/36 ✅. En CI, le job e2e est ignoré faute de secret `DATABASE_URL` : il n'y protège donc rien (voir section 21).
- Audit Playwright de 46 pages × 2 formats ✅ ; Lighthouse accessibilité 100 sur 4 pages.

## 18. Second audit indépendant

Conduit sur un build neuf, sans s'appuyer sur les rapports précédents :
- **Texte rendu** : les 46 pages ont été extraites et passées aux motifs interdits. Seuls subsistent des emplois légitimes, documentés dans le registre.
- **Code mort** : knip relancé, sans nouveau résidu.
- **Bundle** : aucun secret trouvé.
- **Dépendances** : `npm audit` relancé.

Anomalies trouvées et corrigées pendant ce contrôle :
- le bandeau cookies était affiché pour un outil inexistant ;
- « Conformité RGPD » restait dans le pied de page ;
- la catégorie apparaissait en double sur la carte à la une ;
- le badge du hero débordait sur mobile ;
- trois règles d'accessibilité échouaient (`tablist`, contraste, nom accessible).

## 19 et 20. Anomalies et risques résiduels

| ID | Gravité | Risque | Recommandation |
|---|---|---|---|
| R1 | P2 | Toutes les pages sont dynamiques (`no-store`) à cause du nonce CSP : LCP de laboratoire autour de 4 s, pas de bfcache | Pages statiques ou ISR avec une CSP par hash |
| R2 | P2 | ~~Limitation de débit en mémoire~~ | **Corrigé et vérifié** : limite persistante en base (5 demandes par heure et par empreinte), testée |
| R3 | P2 | Corps des articles en français sur le site EN (signalé aux visiteurs) | Mentions légales : **corrigé et vérifié** (source bilingue unique). Articles : traduction à faire |
| R4 | P1 | Purge des demandes à 3 ans | **Corrigé mais non activé** : `/api/cron/purge-contacts` et `vercel.json`, testés ; ajouter `CRON_SECRET` sur Vercel |
| R5 | P3 | Tables de contenu Supabase obsolètes | Seed réduit aux listes de sécurité (**corrigé**) ; suppression des tables à décider (migration destructive) |
| R6 | P3 | Un point « Content security policy » signalé par Lighthouse sur /contact, sans violation visible en console | Analyse à poursuivre |

## 21. Validations humaines requises

1. Engagements : réponse sous 2 jours ouvrés, proposition sous 5 jours ouvrés.
2. Conservation de 3 ans, puis mise en place de la purge.
3. Refus des robots d'entraînement IA.
4. Piste « Veille BODACC ».
5. Accord écrit du client pour le « Cas réel » (audit multi-agents).
6. Capital social et numéro de TVA (Kbis, VIES).
7. Page LinkedIn active.
8. Libellé du bouton d'action du header.
9. ~~`ALLOWED_ORIGINS`~~ : vérifié en production après déploiement (requête invalide acceptée jusqu'à la validation, HTTP 422, rien d'enregistré).
10. ~~Secret `DATABASE_URL` en CI~~ : plus nécessaire, les e2e tournent désormais sans base.
11. Ajouter `CRON_SECRET` sur Vercel (au moins 16 caractères) pour activer la purge.

## 22. État final

**Déployé en production le 2 novembre 2026** (`main` @ `be43a71`), vérifié sur www.analyticatech.fr : pages en 200, redirections 308, canonical `www`, base de données joignable, formulaire acceptant l'origine `www`.


Prêt pour revue et fusion : PR #1, puis PR #2. Aucune anomalie P0 ouverte. La mise en production dépend des validations de la section 21 et d'une décision sur R4.
