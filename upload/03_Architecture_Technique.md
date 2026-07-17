> Statut : Validé · Dernière révision : juillet 2026

# 03 — Architecture Technique & Design System

## 1. Frontend

| Aspect | Choix |
|---|---|
| Framework | Next.js (React), TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| 3D/Immersif | Three.js |
| Icônes | Lucide-React |

Composants clés : `ImmersiveBackground.tsx` (particules Three.js, parallaxe souris, thème clair/sombre, réduction mobile), `Navbar.tsx` (glassmorphism, Command Panel mobile, scramble-text desktop), `Footer.tsx` (horloge UTC, statut système).

Résilience : `ErrorBoundary` global (« System Alert »), `safeFetch` avec gestion de timeout.

## 2. Backend

Node.js + Express + TypeScript, validation Zod, ORM Drizzle recommandé pour les entités relationnelles classiques ; requêtes SQL directes autorisées pour les opérations vectorielles (pgvector, cf. § 3), Drizzle ne les couvrant pas nativement.

**Endpoints :**

| Route | Fonction |
|---|---|
| `POST /api/v1/contact` | Validation stricte, honeypot, délai anti-timing |
| `GET /api/health` | Monitoring Docker |
| `POST /api/v1/chat` | Interface chatbot, streaming SSE, rate limiting dédié |
| `GET /api/v1/search` | Recherche sémantique dashboard client |

**Posture de sécurité.** Le backend est calibré « sécurité de niveau bancaire » (JWT + rotation, RBAC, chiffrement au repos, gestion de secrets externalisée, mention PCI DSS) alors que le périmètre fonctionnel réel est un formulaire de contact, un blog, un dashboard client et un chatbot — sans flux de paiement. C'est un choix de positionnement assumé : le site démontre par sa propre architecture la rigueur qu'Analyticatech vend à ses clients CIO (doc 01, persona Antoine Lefevre). La mention PCI DSS n'a de sens que présentée explicitement comme démonstration et non comme exigence fonctionnelle — à clarifier pour tout tiers technique qui auditerait le projet. Le raisonnement complet de ce choix est tracé en doc 09, ADR-003.

**Middleware et sécurité :** Helmet (CSP stricte, HSTS, X-Frame-Options DENY), rate limiting (`express-rate-limit`, 5 req/h/IP sur `/contact`), sanitization anti-XSS stocké, CORS restreint via `CORS_ORIGIN`, JWT + RBAC pour les endpoints sensibles, TLS 1.2+, protection OWASP Top 10.

## 3. Infrastructure IA

Le dashboard client (recherche sémantique) et le chatbot IA reposent sur une infrastructure dédiée, détaillée en doc 06 (architecture agentique et orchestration) :

| Composant | Rôle | Technologie de référence |
|---|---|---|
| Base vectorielle | Indexation sémantique du contenu (blog, études de cas, base de connaissance client) | pgvector, colocalisé avec Postgres — cf. doc 09, ADR-005 |
| Pipeline RAG | Retrieval-augmented generation pour la recherche sémantique et le chatbot | LangChain / LangGraph, embeddings via API Claude ou modèle open-weight |
| Service d'orchestration agentique | Exécution des agents avec état, outils, permissions | LangGraph — cf. doc 06 pour la carte des agents, doc 09 ADR-004 pour le choix de pattern |
| Garde-fous agentiques | Contrôle des permissions d'outils, limites de tokens, détection de prompt injection | Mapping OWASP Agentic Top 10 (ASI01-10) — doc 06 § 4 |

Ces composants sont chiffrés au même niveau que le reste du backend et journalisés séparément — un agent qui appelle des outils externes constitue une surface d'attaque distincte du CRUD classique (doc 06, section sécurité agentique).

## 4. Architecture de données

Schéma relationnel (contacts, contenus blog, études de cas) étendu d'un index vectoriel pour la recherche sémantique. Diagrammes C4 (contexte, conteneurs, composants) maintenus pour le périmètre applicatif, complétés d'un diagramme de composants pour le service d'orchestration (doc 06).

## 5. Infrastructure & déploiement

Docker multi-stage, image `alpine`, exécution non-root. Cloud Vercel/AWS (doc 09, ADR-001 pour le choix de framework qui structure ce choix), pipeline CI/CD GitHub Actions, environnements dev/staging/production, CDN et cache, monitoring et alerting — étendu pour couvrir le service d'orchestration IA (latence LLM, coûts par appel, cf. doc 08 pour le monitoring d'évaluation).

## 6. Sécurité — synthèse

Threat modeling, headers de sécurité complets, flux auth/autorisation, chiffrement des données, plan de réponse aux incidents. Le threat model inclut les vecteurs spécifiques à l'agentique (prompt injection, exfiltration via outils, boucles d'agents incontrôlées) traités en détail dans le doc 06. Les obligations de transparence propres aux systèmes d'IA (mention explicite au visiteur, documentation modèle) relèvent du doc 10, pas de cette section.

Les décisions structurantes de cette section (Next.js, Drizzle en option, posture de sécurité disproportionnée assumée, orchestration LangGraph) sont chacune justifiées et datées dans le doc 09 (ADR) — en cas de remise en question d'un choix par un nouvel arrivant, humain ou agent, le doc 09 est la référence, cette section ne décrivant que l'état actuel sans le raisonnement.

## 7. Performance

Core Web Vitals, optimisation de bundle, images, lazy loading, budget de performance. Budget de latence spécifique pour le chatbot (premier token < 800 ms en p95) et pour la recherche sémantique (< 400 ms en p95).

## 8. Design System

**Typographie :** Space Grotesk (titres), Inter (corps), JetBrains Mono (tech/data).

**Couleurs :**

| Usage | Valeur |
|---|---|
| Fond clair | `slate-50` |
| Fond sombre (défaut) | `#011C40` |
| Primaires | `#03318C`, `#022873`, `#022859` |
| Accent | `#F26D3D` |

**Signature visuelle :** glassmorphism (`backdrop-blur-md`), scramble-text au survol, spotlight effect sur cartes. Design tokens, bibliothèque de composants (Atomic Design), grilles, système d'icônes, accessibilité WCAG 2.1 AA.

Cette section reste le résumé de référence rapide. Pour le système de grille détaillé (bento grid, gabarits de cards), les deux intensités de glassmorphism et la migration vers les fontes variables, le doc 12 fait autorité et prévaut sur ce résumé en cas d'écart.

## Références

[1] Node.js Security Best Practices — nodejs.org/learn.
[2] Semaphore, *Securing Node.js Applications in Production*.
[3] Snyk, *Top 10 Node.js Security Best Practices*.
