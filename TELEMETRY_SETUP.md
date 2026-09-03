# 📡 Configuration de la Télémétrie PostHog — Analyticatech

Ce document résume l'architecture de télémétrie, la liste exhaustive des événements collectés, la configuration des variables d'environnement pour Vercel, et les obligations de conformité RGPD.

---

## 1. Architecture & Reverse Proxy Discret

Pour contourner les bloqueurs de publicité/tracking (uBlock Origin, Brave Shields, AdBlock) tout en respectant scrupuleusement la vie privée des visiteurs, un **reverse proxy discret** est configuré au niveau de Next.js (`next.config.ts`) :

- **Chemin discret** : `/_edge-relay/*`
- **Destination EU (Assets)** : `https://eu-assets.i.posthog.com/static/:path*`
- **Destination EU (API)** : `https://eu.i.posthog.com/:path*`
- **Destination EU (Decide)** : `https://eu.i.posthog.com/decide`

Toutes les requêtes de tracking partent vers `https://analyticatech.fr/_edge-relay/...` (même domaine, premier parti), évitant tout blocage DNS/heuristique par les extensions tierces.

---

## 2. Variables d'Environnement (Vercel & Production)

Sur **Vercel** (`Project Settings > Environment Variables`), configurer les clés suivantes :

| Variable | Valeur recommandée | Portée | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Client & Serveur | Clé publique de projet PostHog EU |
| `NEXT_PUBLIC_POSTHOG_HOST` | `/_edge-relay` | Client | Route du reverse proxy interne |
| `POSTHOG_API_KEY` | *(Optionnel - si clé dédiée)* | Serveur uniquement | Clé serveur Node pour flush serverless |
| `POSTHOG_HOST` | `https://eu.i.posthog.com` | Serveur uniquement | Hôte direct de l'ingestion serveur |

> [!NOTE]
> En environnement local (`.env`), vous pouvez renseigner ces mêmes variables pour tester les flux d'ingestion.

---

## 3. Événements Trackés (Client & Serveur)

Tous les événements sont **100% anonymisés et dépourvus de PII** (nom, email, téléphone, contenu de message systématiquement purgés avant envoi).

### Côté Client (`src/instrumentation-client.ts`)

| Nom de l'Événement | Déclencheur | Propriétés envoyées | Protection PII |
| :--- | :--- | :--- | :--- |
| `$pageview` | Changement de route (App Router) | `pathname`, `title`, `$current_url` | URL anonymisée |
| `$pageleave` | Fermeture ou changement d'onglet | Durée de la session | Aucune donnée personnelle |
| `cta_clicked` | Clic sur les boutons clés (Devis, Audit, Contact, Solutions) | `cta_name`, `location` (section), `destination` (href) | Zéro donnée utilisateur |
| `contact_form_submitted` | Envoi réussi du formulaire de contact | `subject_length`, `has_company`, `locale`, `reference`, `status` | **ZÉRO message**, zéro email, zéro nom |
| `scroll_depth_reached` | Défilement sur les pages de contenu (`/`, `/services`, `/solutions`) | `depth_percent` (25%, 50%, 75%, 90%), `pathname` | Données de navigation pures |
| `$exception` | Erreurs JavaScript non interceptées & Error Boundary | `$exception_message`, `$exception_type`, `route` | Traces d'erreurs techniques pures |

### Côté Serveur (`src/lib/posthog-server.ts`)

| Nom de l'Événement | Déclencheur | Propriétés envoyées | Identification |
| :--- | :--- | :--- | :--- |
| `contact_form_processed_server` | Validation et persistance en base de données | `reference`, `subject_len`, `has_company`, `status: "success"` | `distinct_id` = ID PostHog client ou fingerprint SHA-256 (jamais "anonymous") |

---

## 4. Conformité RGPD & CNIL (Site Français)

### Mécanismes déjà implémentés dans le code :
1. **Opt-out strict par défaut (`opt_out_capturing_by_default: true`)** :  
   Avant que le visiteur ne clique sur « Tout accepter » dans le bandeau de consentement (`CookieConsent`), **aucune requête PostHog n'est envoyée**.
2. **Session Replay sécurisé** :  
   Tous les champs de saisie (`inputs`, `textarea`, `select`) et tous les textes sont masqués (`maskAllInputs: true`, `maskTextSelector: "*"`).
3. **Filtre `before_send`** :  
   Supprime automatiquement toute tentative accidentelle de transmettre des champs `email`, `name`, `phone`, `message`, `content`.
4. **Interdiction de l'email comme identifiant** :  
   `identifyTelemetryUser()` rejette formellement toute valeur contenant un `@`.

### Points restant sous la responsabilité d'Analyticatech :
- **Texte du bandeau de consentement** :  
  Vérifier que les mentions de `src/components/branding/CookieConsent.tsx` expliquent clairement l'usage de la mesure d'audience et de l'amélioration de la stabilité technique.
- **Mise à jour de la Politique de Confidentialité (`/confidentialite`)** :  
  Ajouter un paragraphe explicitant :
  - L'utilisation de PostHog hébergé en Union Européenne (`eu.i.posthog.com`).
  - La finalité : analyse d'audience agrégée et détection des anomalies techniques.
  - La base légale : consentement explicite (Article 6.1.a du RGPD).
  - La durée de conservation des cookies de consentement (1 an max).

---

## 5. Procédure de Vérification Pas-à-Pas

Pour valider l'installation de bout en bout :

1. **Ouvrir une fenêtre de navigation privée** :
   - Rendez-vous sur votre site (`https://analyticatech.fr` ou votre prévisualisation Vercel).
2. **Ouvrir les Outils de Développement (F12 > onglet Réseau / Network)** :
   - Filtrer par `_edge-relay` ou `posthog`.
   - **Vérification 1 (Non-consentement)** : Naviguez entre les pages. **Aucune requête réseau ne doit apparaître dans le filtre**. Aucun cookie `ph_*` ne doit être déposé.
3. **Cliquer sur « Tout accepter » sur le bandeau de cookies** :
   - **Vérification 2 (Reverse proxy discret)** : Des requêtes POST vers `https://votre-domaine/_edge-relay/e/...` ou `/_edge-relay/decide` apparaissent immédiatement.
   - Vérifiez l'en-tête de la requête : elle part bien vers votre propre nom de domaine et **non directement vers `posthog.com`**.
4. **Tester les événements spécifiques** :
   - Cliquez sur le bouton CTA de la Navbar (« Demander un audit ») ou du Hero : un événement `cta_clicked` est envoyé.
   - Faites défiler la page `/services` : des événements `scroll_depth_reached` (25, 50, 75, 90) sont émis.
   - Soumettez un message de test sur `/contact` : l'événement `contact_form_submitted` est émis côté client, et `contact_form_processed_server` est émis côté serveur.
5. **Vérifier dans PostHog Dashboard** :
   - Connectez-vous sur [eu.posthog.com](https://eu.posthog.com).
   - Ouvrez l'onglet **Activity > Live Events**.
   - Ouvrez un événement `contact_form_submitted` : confirmez qu'aucune donnée personnelle (ni nom, ni email, ni corps de message) n'apparaît dans les propriétés.
