# Guide & Budget de Performance Web — Analyticatech

Ce document définit les règles, seuils stricts et budgets de performance applicables à l'application web **Analyticatech**. Il garantit la non-régression des gains de vitesse, d'accessibilité et de Core Web Vitals lors des évolutions futures.

---

## 1. Budget de Performance par Page (Seuils Stricts)

| Métrique / Page | Accueil (`/`) | Fiche Service (`/services/01`) | Page Insights (`/insights`) | Seuil Google CWV ("Good") | Seuil Strict Analyticatech |
|---|:---:|:---:|:---:|:---:|:---:|
| **LCP (Largest Contentful Paint)** | ~550 ms | ~420 ms | ~380 ms | < 2500 ms | **< 1200 ms** |
| **CLS (Cumulative Layout Shift)** | 0.000 | 0.000 | 0.000 | < 0.100 | **< 0.050** |
| **INP (Interaction to Next Paint)** | < 40 ms | < 30 ms | < 25 ms | < 200 ms | **< 100 ms** |
| **TTFB (Time to First Byte)** | ~180 ms | ~150 ms | ~140 ms | < 800 ms | **< 300 ms** |
| **Poids JS initial (Gzip)** | ~210 KB | ~195 KB | ~190 KB | - | **< 250 KB** |
| **Chunk JS unique max (Gzip)** | < 70 KB | < 70 KB | < 70 KB | - | **< 140 KB** |
| **Poids total transféré (Gzip)** | ~380 KB | ~320 KB | ~280 KB | - | **< 550 KB** |
| **Requêtes réseau max** | 36 | 36 | 34 | - | **<= 40** |

---

## 2. Règles d'Or de Développement

### A. Images & Médias
- **Formats Modernes Uniquement** : Toujours utiliser WebP ou SVG vectoriel optimisé (`svgo`). Aucun fichier PNG/JPEG lourd non compressé.
- **Taille Max par Asset Image** :
  - Icônes & logos : **< 30 KB**
  - Graphiques de couverture / Hero : **< 100 KB**
- **Priorisation & Lazy Loading** :
  - Seule l'image critique visible au-dessus de la ligne de flottaison (LCP) doit porter `priority` / `loading="eager"`.
  - Toutes les autres images doivent être en `loading="lazy"` avec réservation d'espace explicite (`width`, `height` ou `aspect-ratio`).

### B. JavaScript & Dépendances
- **Imports Granulaires** : Ne jamais faire d'import global sur des bibliothèques d'icônes ou de calculs (ex: importer depuis `lucide-react` de manière ciblée).
- **Code Splitting & Dynamic Imports** : Les sections sous la ligne de flottaison (ex: graphiques interactifs, démos, modales lourdes) doivent utiliser `dynamic()` avec un `SectionSkeleton` pour préserver le CLS à 0.
- **Règles React 19 & Framer Motion** :
  - Toujours préférer `transform` et `opacity` pour les animations GPU-accelerated.
  - Respecter `prefers-reduced-motion` (`useReducedMotion()`).
  - Révéler les sections au montage plutôt qu'avec `whileInView` sur les sections pré-chargées hors écran.

### C. Caching & Headers CDN
- **Assets statiques fingerprintés** (`/_next/static/*`, `/services/*`, `/screenshots/*`) : `Cache-Control: public, max-age=31536000, immutable`.
- **Assets légers racine** (`/logo.svg`, `/og-image.*`, `/favicon.ico`) : `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`.
- **Dédoublonnage Client** : Le `ContentProvider` déduplique les requêtes de contenu en vol et met en cache mémoire les réponses pour éviter les doubles fetches lors de la navigation ou du changement de langue.

---

## 3. Contrôle Automatisé en CI & Monitoring

### A. Vérification de Budget en CI (GitHub Actions)
Le pipeline CI exécute automatiquement les contrôles suivants :
1. **`npm run check:perf`** : Analyse post-build des tailles des chunks JavaScript générés par Next.js (`scripts/check-performance-budget.mjs`).
2. **`npx playwright test e2e/performance-budget.spec.ts`** : Test d'intégration bout en bout qui mesure le LCP réel, le CLS accumulé, le nombre de requêtes et le poids total transféré sur Chromium.

### B. Real User Monitoring (RUM) en Production
Le projet intègre nativement :
- **`@vercel/speed-insights`** : Collecte des Core Web Vitals réels vécus par les visiteurs selon leur localisation et leur type de terminal.
- **`@vercel/analytics`** : Télémétrie anonymisée du trafic et des parcours utilisateurs respectueuse du RGPD.
