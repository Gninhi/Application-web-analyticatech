> Statut : Draft — validation interne requise avant implémentation · Dernière révision : juillet 2026 · Référencé par 01, 05, 09, 12

# 13 — SEO, Recherche Agentique (GEO/AEO) & Stack Analytics

## 0. Pourquoi ce document existe

Le doc 01 fixe un objectif de +50 % de trafic organique (SMART, doc 01 § 5) et le doc 05 couvre le SEO classique. Ce qui manque : la recherche par IA générative change une partie substantielle des règles du jeu — jusqu'à 60 % des recherches ne généreront aucun clic vers un site d'ici 2026, l'IA compilant la réponse directement à partir de plusieurs sources. Analyticatech, qui vend elle-même de l'agentique à ses clients, ne peut pas se permettre d'être invisible aux crawlers IA (GPTBot, ClaudeBot, PerplexityBot). Ce document couvre le SEO technique, son extension vers la recherche agentique, et la couche de mesure qui permet de savoir ce qui marche.

## 1. SEO technique classique — fondation non négociable

Le GEO ne remplace pas le SEO, il s'appuie dessus — un contenu non indexé n'a aucune chance d'être cité par une IA, qui puise dans les mêmes index que Google.

| Élément | Exigence |
|---|---|
| Indexabilité | `sitemap.xml` à jour, `robots.txt` sans blocage accidentel, pas de `noindex` erroné |
| Canonicalisation | Balise canonique sur toute variante d'URL |
| Erreurs techniques | Zéro erreur 4xx/5xx, pas de chaîne de redirections |
| Rendu | Contenu important en rendu serveur (SSR/SSG, cohérent avec le choix Next.js — doc 03), jamais uniquement côté client pour le contenu qu'on veut voir indexé |
| Core Web Vitals | doc 03 § 7 — un prérequis GEO autant que SEO |
| Structured data | Schema.org : `Organization`, `Service`, `Article`, `FAQPage`, `BreadcrumbList` sur les pages concernées |

## 2. Optimisation pour la recherche agentique (GEO/AEO)

### 2.1. Deux écoles, une position assumée

Deux positions coexistent dans l'industrie mi-2026 : les praticiens GEO recommandent des tactiques spécifiques (llms.txt, découpage du contenu en passages autonomes) ; Google recommande explicitement d'ignorer les « hacks AEO/GEO » comme le chunking artificiel ou la création de fichiers llms.txt jugés superflus, et de miser sur le SEO fondamental plus le suivi via le rapport de performance IA générative de Search Console.

**Position retenue pour Analyticatech** : le SEO technique classique (§ 1) est la base non négociable, les tactiques GEO ci-dessous un complément à faible coût — elles ne nuisent jamais si elles n'aident pas, et le llms.txt en particulier coûte une demi-journée à mettre en place. Ne pas leur sacrifier de budget qui devrait aller au SEO fondamental.

### 2.2. Fichier `llms.txt`

Fichier texte brut à la racine (`analyticatech.fr/llms.txt`) qui indexe les pages prioritaires pour un LLM qui consulte le site :

```markdown
# Analyticatech

> Cabinet de conseil en IA, transformation digitale et intégration
> agentique pour décideurs C-Level en France (Grand Est).

## Services
- [Intelligence Artificielle](/services/intelligence-artificielle)
- [Création & Intégration Agentique](/services/agentique)
- [Automatisation de Processus](/services/automatisation)
- [Business Intelligence](/services/business-intelligence)
- [Transformation Digitale](/services/transformation-digitale)

## Études de cas
- [Voir toutes les études de cas](/etudes-de-cas)

## À propos
- [Notre histoire et valeurs](/a-propos)
```

### 2.3. Robots.txt — autoriser explicitement les crawlers IA

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

Point de vigilance : si le CDN ou le WAF (Cloudflare notamment) est configuré pour bloquer les bots IA par défaut, cette configuration réseau prime sur le `robots.txt` — vérifier les deux couches, pas seulement le fichier.

### 2.4. Structurer le contenu pour la citation par IA

Une IA générative extrait des passages, pas des pages entières (fonctionnement RAG). Règles d'écriture pour le blog et les pages service (doc 02) :

- Chaque section répond à une question précise, en ouvrant par la réponse directe avant le développement.
- Un sous-titre `<h2>`/`<h3>` par idée, jamais un sous-titre qui couvre trois sujets différents.
- Chiffres et faits vérifiables plutôt que des formulations vagues — une IA cite plus volontiers une statistique précise et sourcée qu'une affirmation générale.
- Date de dernière mise à jour visible sur les articles et études de cas — les moteurs génératifs pondèrent la fraîcheur du contenu.

### 2.5. Mesure

Pas de tableau de bord GEO unifié standard à ce jour — suivi via le rapport de performance IA générative de Google Search Console, complété d'un contrôle manuel mensuel : requêtes types des personas (doc 01) posées à ChatGPT/Claude/Perplexity, vérification de la présence et de l'exactitude d'Analyticatech dans la réponse.

## 3. Stack de tracking et mesure

### 3.1. Pourquoi le pixel client-side seul ne suffit plus

Le tracking purement client-side (Meta Pixel, GA4 seuls) plafonne autour de 70-80 % de fiabilité : blocage par les extensions anti-pub, limitation des cookies first-party à 7 jours par l'ITP de Safari, isolation des cookies par Firefox. La réponse standard 2026 n'est pas d'abandonner les pixels mais de les doubler d'un canal server-side.

### 3.2. Architecture recommandée

Ce choix d'architecture est documenté comme décision structurante en doc 09, ADR-006.

| Couche | Rôle | Techno |
|---|---|---|
| Tag manager server-side | Point de passage unique des événements, avant redistribution | Google Tag Manager côté serveur (sGTM), hébergé sur l'infra existante (doc 03) ou via un service managé pour éviter la charge d'exploitation |
| API de conversion publicitaire | Envoi direct serveur → plateforme, contourne le blocage navigateur | Meta Conversions API, Google Enhanced Conversions |
| Mesure produit | Comportement, funnels, feature flags | GA4 (Measurement Protocol côté serveur) — ou alternative privacy-first si le profil RGPD du client CIO (doc 01) l'exige |
| Consentement | Respect RGPD, blocage conditionnel des envois tant que non consenti | Consent Mode v2 (Google) ou équivalent, intégré en amont du sGTM |

Le persona CIO (doc 01) est sensible à la démonstration de rigueur technique (doc 03 § 2) — une architecture de tracking qui respecte nativement le consentement et minimise la dépendance à des scripts tiers non maîtrisés s'inscrit dans la même logique de preuve par l'exemple que le reste du site.

### 3.3. Alternative privacy-first à GA4

Si un client pilote (persona CIO, secteur financier) exige un traitement de données strictement européen :

| Outil | Positionnement | Coût indicatif |
|---|---|---|
| Plausible | Léger, sans cookie, hébergement EU disponible | à partir de ~9 $/mois pour 10k pages vues |
| Fathom | Simple, conforme RGPD nativement | à partir de ~15 $/mois pour 100k pages vues |
| Matomo | Le plus complet, auto-hébergeable | gratuit en self-host, ou cloud à partir de ~23 $/mois |

Recommandation par défaut : GA4 + sGTM pour la richesse fonctionnelle, avec Matomo self-hosted en option si un client CIO conditionne la signature à une preuve de souveraineté des données de mesure.

### 3.4. Heatmaps et session replay

Le tracking quantitatif (§ 3.2) dit *ce qui* se passe ; les heatmaps et enregistrements de session disent *pourquoi*.

| Outil | Positionnement 2026 | Recommandation |
|---|---|---|
| Microsoft Clarity | Gratuit, sans plafond de trafic annoncé, résumés de session par IA inclus | Choix par défaut pour démarrer — aucun frein budgétaire à tester |
| PostHog | Facturation à la session enregistrée, bundle heatmaps + analytics produit + feature flags | À évaluer si le dashboard client (doc 02, E6) grandit en complexité produit |
| Hotjar (désormais Contentsquare) | Positionnement enterprise depuis la fusion | Non prioritaire pour le lancement |

Point d'attention : Microsoft Clarity héberge les données aux États-Unis — à documenter dans la politique de confidentialité (doc 10 § 5) et à réévaluer si un client CIO impose une exigence de souveraineté des données comportementales.

## 4. Boucle d'amélioration continue

Le principe qui structure le doc 08 (eval-driven development pour l'IA) s'applique identiquement ici : ne rien changer sans mesure avant/après.

1. **Hypothèse** — formulée à partir d'un signal heatmap/session replay (§ 3.4) ou d'une chute de KPI (doc 01 § 6).
2. **Test** — modification isolée, déployée derrière un feature flag (doc 04 § 6).
3. **Mesure** — comparaison sur les mêmes KPIs (doc 01 § 6) avant/après, fenêtre de mesure fixée à l'avance.
4. **Décision** — garder, ajuster, ou revenir en arrière ; documenter comme ADR si structurant (doc 09).

**Cadence recommandée :** revue hebdomadaire des KPIs d'acquisition/engagement (doc 01 § 6), revue mensuelle du rapport de performance IA générative (§ 2.5), revue trimestrielle de la pile de tracking elle-même — un setup de mesure peut casser silencieusement après une mise à jour de plateforme ou de navigateur, il ne faut jamais le considérer comme définitivement acquis.

## 5. Plan d'implémentation priorisé

| Priorité | Action | Effort |
|---|---|---|
| 1 | Sécuriser le SEO technique de base (§ 1) | Faible |
| 2 | Déployer Microsoft Clarity (§ 3.4) | Très faible |
| 3 | Publier `llms.txt` + vérifier `robots.txt` pour les crawlers IA (§ 2.2-2.3) | Faible |
| 4 | Mettre en place sGTM + Meta CAPI + GA4 Measurement Protocol (§ 3.2) | Moyen |
| 5 | Structurer le contenu blog/services au format citation-friendly (§ 2.4) | Continu |
| 6 | Évaluer Matomo self-hosted si un client CIO pilote le demande (§ 3.3) | Conditionnel |
