# Worklog — Projet Analyticatech

Journal d'audit et d'interventions sur le codebase Analyticatech
(Next.js 16 + TypeScript + Tailwind + Framer Motion + Three.js).

---

## AUDIT-1 — Audit approfondi de code (agent: code-audit)

**Rôle** : Agent d'audit de code expert
**Périmètre** : 19 fichiers (composants sections, hooks, lib, API route, app router)
**Date** : 2025-07-09

### Résumé exécutif

Audit exhaustif (qualité, performance, accessibilité, sécurité, bugs) de 19 fichiers
clés du projet. **45+ problèmes identifiés**, dont 5 CRITICAL et 17 HIGH.

### Findings critiques (CRITICAL)

1. **`ServicesView.tsx` — Bug de stacking cards** : Le `stickyTop = ${index * 28}px`
   + conteneur sticky transparent (h-screen avec carte 64–68 vh centrée) fait que la
   carte précédente reste visible quand la suivante s'empile. Fix : `top: 0` constant
   + fond opaque ou `overflow: hidden` sur la section.

2. **`route.ts` — Pas de persistance** : La référence `AT-2025-XXXXXX` est générée
   mais non stockée. Ni Prisma, ni email, ni file. Bug fonctionnel majeur.

3. **`rateLimit.ts` — `x-forwarded-for` spoofable** : Un client peut forger cet
   header pour obtenir un bucket frais à chaque requête → contournement total du
   rate limit. Fix : lire `x-real-ip` (Caddy), refuser si absent.

4. **`ContactView.tsx` — Honeypot `aria-hidden` sur élément focusable** : Violation
   WCAG. Retirer `aria-hidden`, garder le masquage CSS.

5. **`route.ts` — Log d'IP (PII RGPD)** : `console.info` journalise l'IP même
   tronquée — donnée personnelle. Hasher ou supprimer.

### Findings HIGH (sélection)

- `Navbar.tsx` : Dialog mobile sans focus trap, sans Escape, sans restauration focus.
- `HomeView.tsx` : `id="spark-grad"` dupliqué sur 4 Sparklines (HTML invalide).
- `BlogView.tsx` : Cartes articles non cliquables (`cursor-pointer` sans handler) +
  faux liens `href="#"`.
- `SolutionsView.tsx` : `x` scroll horizontal hardcodé à `"-78%"` non adaptatif —
  dernière carte non atteignable correctement.
- `safeFetch.ts` : Spread de `HeadersInit` non robuste (perte de headers si `Headers`
  ou array passé).
- `sanitize.ts` : `sanitizeObject` ne traite pas les objets dans arrays (XSS latent).
- `Footer.tsx` : `useUtcClock` re-render tout le Footer chaque seconde.
- `PageLoader.tsx` : `aria-live="polite"` avec updates 60 fps = spam SR.
- `SolutionsView`/`BlogView`/`ContactView` : Hiérarchie de titres h1 → h3 (sans h2).
- `layout.tsx` : Pas d'export `viewport`, pas de `metadataBase`.

### Performance

- `useMagneticHover` : `mousemove` non throttlé + `getBoundingClientRect()` à chaque
  event = reflow 60+ fois/s.
- `ParticleField` : `useFrame` tourne en continu même hors-champ ; pas de
  `prefers-reduced-motion` ; pas de pause sur `document.hidden`.
- `ServicesView` : 5 cartes sticky avec backdrop-blur + 3 overlays absolute chacun =
  charge GPU lourde.
- `Navbar` : `onScroll` non throttlé.

### Accessibilité

- Pas de skip-link dans `page.tsx`.
- Pas de focus management sur changement de vue.
- `role="tablist"`/`tab` incomplet dans `BlogView` (pas de `tabpanel`,
  pas d'`aria-controls`).
- Faux liens (`href="#"` + `preventDefault`) dans `BlogView`, `Footer`, `ContactView`.
- Télephone/adresse en texte brut dans `ContactView` (pas de `tel:`/maps).
- `ScrambleText` dans Navbar : risque de texte incompréhensible pour SR.

### Bugs potentiels

- `SolutionsView` `PhaseIndicator` : bornes `0.14/0.15/0.16` incohérentes (micro-saut).
- `BlogView` : 3 premiers posts affichés deux fois (FeaturedNews + grille).
- `safeFetch` : retry sur `JSON.parse` failure d'un 200 (non-retryable).
- `rateLimit` : fallback `"unknown"` partage un bucket entre tous les clients sans IP.
- `route.ts` : `Date.now().toString(36).slice(-6)` → risque de collision en pic.

### Recommandations transverses

- Factoriser `ICONS` (dupliqué `HomeView`/`ServicesView`).
- Unifier les types `metrics.value` (string vs number).
- Externaliser `BLOCKED_DOMAINS`, `SECURITY_HEADERS` (doivent être globaux via
  `next.config.ts`).
- Ajouter `prefers-reduced-motion` partout (ParticleField, Marquee, PageLoader).
- Migrer le honeypot vers une stratégie non-focusable.

### Détail complet

Le rapport exhaustif (45+ problèmes, fichier par fichier, avec lignes et fixes
recommandés) a été livré dans la réponse à l'utilisateur. Ce worklog n'en contient
que le résumé.

### Actions suivantes suggérées

1. Corriger en priorité les 5 CRITICAL.
2. Planifier un sprint accessibilité (focus management, ARIA, reduced-motion).
3. Ajouter une suite de tests E2E pour valider le stacking ServicesView après fix.
4. Mesurer les performances Lighthouse avant/après fixes perf.

---
