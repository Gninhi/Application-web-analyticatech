# Audit et Mise en Conformité CNIL 2026 — Bandeau de Consentement Cookies

Ce rapport détaille l'audit d'évaluation (Phase 1) de l'implémentation existante du bandeau de cookies du site Analyticatech, les corrections techniques rigoureuses apportées en Phase 2, ainsi que les propositions de textes juridiques soumises à validation préalable avant publication en production.

---

## Phase 1 — Audit de l'existant (Doctrine CNIL 2026)

| # | Critère d'évaluation CNIL 2026 | Fichier source & Lignes | Diagnostic & Code source constaté | Statut |
|---|---|---|---|---|
| **1** | **Symétrie & Parité visuelle "Accepter" vs "Refuser"** | `src/components/branding/CookieConsent.tsx`<br>*(L120-138)* | Le bouton « Accepter » utilisait la variante `primary` avec classe `neon-glow` (fond orange vif `#F26D3D` avec halo lumineux), tandis que « Refuser » utilisait la variante `ghost` (fond transparent, texte discret). Cette asymétrie visuelle constitue un *dark pattern* interdit par la CNIL. | **NON CONFORME** |
| **2** | **Comportement à la fermeture (croix, clic extérieur, scroll)** | `src/components/branding/CookieConsent.tsx`<br>*(L105-114)* | La croix de fermeture appelait directement `saveChoice("refused")`. Aucun événement de scroll ni clic à l'extérieur ne fermait le bandeau ni ne valait acceptation tacite. Le silence vaut bien refus. | **CONFORME** |
| **3** | **Granularité par finalité** | `src/components/branding/CookieConsent.tsx`<br>*(L12-18)* | Le type de choix était binaire (`type ConsentChoice = "accepted" | "refused"`). Il n'existait aucune interface permettant de distinguer les cookies techniques essentiels de la mesure d'audience. | **NON CONFORME** |
| **4** | **Chargement de scripts avant consentement explicite** | `src/components/telemetry/PostHogProvider.tsx`<br>*(L26-29)*<br>`src/instrumentation-client.ts`<br>*(L17-36)* | `posthog.init()` était invoqué au montage du composant client. Bien que `opt_out_capturing_by_default: true` désactivait la capture des événements, l'appel à `init()` déclenchait un handshake réseau et la préparation du stockage local avant tout clic de l'utilisateur. | **NON CONFORME** |
| **5** | **Lien permanent "Gérer mes cookies" en pied de page** | `src/components/layout/Footer.tsx`<br>*(L200-230)* | Le footer proposait des liens vers « Confidentialité » et « Mentions légales », mais aucun bouton ou lien dédié permettant de rouvrir le panneau de consentement après avoir fait un choix initial. | **NON CONFORME** |
| **6** | **Preuve de consentement et durée de validité** | `src/components/branding/CookieConsent.tsx`<br>*(L14-35)* | Les données étaient stockées sous la clé `at-cookie-consent` avec version et horodatage. Cependant, aucune vérification de péremption n'était appliquée : le consentement persistait indéfiniment au lieu de la recommandation CNIL de 6 mois. | **NON CONFORME** |
| **7** | **Précision des finalités affichées** | `src/locales/fr/common.json`<br>*(L34)* | Libellé généraliste : *"Analyticatech utilise des cookies techniques nécessaires au bon fonctionnement de la plateforme et des mesures d'audience anonymisées conformes RGPD."* Le sous-traitant (PostHog EU) et l'hébergement européen n'étaient pas explicités. | **NON CONFORME** |

---

## Cartographie réelle des traceurs audités sur le site

Conformément à la consigne d'intégrité (ne pas inventer de traceurs inexistants), voici la cartographie exacte des technologies du site :

1. **Traceurs strictement nécessaires (Essentiels)** :
   - `at-cookie-consent` : Preuve locale du choix exprimé par l'utilisateur.
   - `at-csrf` : Jeton de protection contre les attaques CSRF sur l'API de contact.
   - `NEXT_LOCALE` : Mémorisation de la préférence linguistique (fr/en).
   - Exemptés de consentement au titre de l'article 82 de la loi Informatique et Libertés.
2. **Mesure d'audience & Télémétrie d'erreurs (Optionnel)** :
   - `posthog-js` : Métriques de navigation, suivi des clics CTA, détection d'erreurs techniques.
   - Hébergement : Région Union Européenne (`eu.i.posthog.com`), requêtes relayées via reverse proxy discret (`/_edge-relay`).
   - Soumis à consentement préalable obligatoire.
3. **Traceurs publicitaires ou réseaux sociaux** :
   - **Aucun** (0 pixel Meta, 0 tag Google Ads, 0 traceur LinkedIn/Twitter/TikTok).

---

## Phase 2 — Corrections techniques appliquées

Les modifications suivantes ont été implémentées, testées et validées sans aucune régression :

### 1. Blocage strict pré-consentement de PostHog
- **Fichier** : [src/instrumentation-client.ts](file:///Users/seansiehigninhi/Dossier_dev/apps/site_web/Application-web-analyticatech/src/instrumentation-client.ts)
- `initTelemetryClient()` vérifie désormais `isAnalyticsAllowed()`. Si aucun consentement n'a été donné, la fonction retourne immédiatement `null` sans appeler `posthog.init()`.
- **Zéro requête réseau**, **zéro cookie** et **zéro chargement de script tiers** tant que l'utilisateur n'a pas cliqué sur "Accepter" ou personnalisé ses choix.
- Dès que le consentement est accordé, l'événement `at:consent-change` initialise dynamiquement PostHog et active `opt_in_capturing()`. En cas de refus ultérieur, `opt_out_capturing()` et `posthog.reset()` sont immédiatement déclenchés.

### 2. Symétrie visuelle stricte "Tout accepter" vs "Tout refuser"
- **Fichier** : [src/components/branding/CookieConsent.tsx](file:///Users/seansiehigninhi/Dossier_dev/apps/site_web/Application-web-analyticatech/src/components/branding/CookieConsent.tsx)
- Les boutons « Tout accepter » et « Tout refuser » bénéficient de la même hauteur, de la même largeur (`flex-1`), de la même taille typographique (`text-sm font-semibold`) et d'un contraste élevé garanti en mode clair comme en mode sombre (fond solide ardoise contrasté avec icône pour « Tout refuser » face au fond orange `#F26D3D` pour « Tout accepter »).
- Aucun dark-pattern ni style "lien fantôme" estompé.

### 3. Granularité par finalité (Vue Paramétrage)
- Ajout d'une vue de personnalisation accessible via le bouton « Personnaliser » :
  - **Catégorie 1 — Cookies techniques (Strictement nécessaires)** : Actif par défaut, badge vert `Toujours actif`, non désactivable.
  - **Catégorie 2 — Mesure d'audience & Télémétrie technique (PostHog EU)** : Désactivé par défaut (opt-in strict), interrupteur toggle dédié.
- Bouton « Enregistrer mes choix » pour valider la sélection sur mesure.

### 4. Stockage de preuve avec péremption à 6 mois (CNIL 2026)
- **Structure de preuve enregistrée** (`ConsentProof`) :
  ```json
  {
    "version": "2.0",
    "timestamp": 1772921000000,
    "expiresAt": 1788473000000,
    "choices": {
      "essential": true,
      "analytics": false
    }
  }
  ```
- Vérification stricte : si `Date.now() > proof.expiresAt`, le consentement est automatiquement purgé du `localStorage` et le bandeau est représenté à l'utilisateur au terme des 6 mois (180 jours).

### 5. Lien permanent "Gestion des cookies" dans le Footer
- **Fichier** : [src/components/layout/Footer.tsx](file:///Users/seansiehigninhi/Dossier_dev/apps/site_web/Application-web-analyticatech/src/components/layout/Footer.tsx)
- Ajout d'un bouton permanent « Gestion des cookies » dans la barre inférieure du footer aux côtés de « Confidentialité » et « Mentions légales ».
- Au clic, il émet l'événement `at:open-cookie-preferences` qui rouvre instantanément le bandeau en mode personnalisation granulaire, permettant à l'utilisateur de modifier ou retirer son consentement à tout moment.

---

## Propositions de textes juridiques soumises à votre validation

Conformément à la consigne de ne pas modifier les textes juridiques sans votre validation explicite, voici la proposition de formulation exacte pour les versions française et anglaise :

### Proposition Français (`locales/fr/common.json`)
```json
{
  "cookie.title": "Gestion des cookies & confidentialité",
  "cookie.desc": "Analyticatech utilise des cookies techniques strictement nécessaires au fonctionnement du site et, avec votre accord, des traceurs de mesure d'audience et de télémétrie technique hébergés dans l'Union Européenne (PostHog EU) pour optimiser les performances de notre plateforme.",
  "cookie.accept": "Tout accepter",
  "cookie.refuse": "Tout refuser",
  "cookie.customize": "Personnaliser",
  "cookie.save": "Enregistrer mes choix",
  "cookie.close": "Fermer le bandeau (vaut refus)",
  "cookie.category.essential.title": "Cookies techniques (Strictement nécessaires)",
  "cookie.category.essential.desc": "Requis pour la sécurité (protection CSRF), la mémorisation de vos préférences de langue et la conservation de vos choix de consentement. Durée de validité : session / 6 mois.",
  "cookie.category.essential.alwaysActive": "Toujours actif",
  "cookie.category.analytics.title": "Mesure d'audience & Télémétrie d'erreurs",
  "cookie.category.analytics.desc": "Permet de mesurer anonymement la navigation, l'usage des fonctionnalités et d'intercepter les erreurs d'exécution pour améliorer la plateforme. Données traitées dans l'UE (PostHog EU) sans revente ni croisement tiers. Durée de conservation : 6 mois.",
  "cookie.rgpd": "Conforme à la doctrine CNIL 2026 & RGPD. Zéro cookie publicitaire tiers. Vous pouvez modifier votre choix à tout moment via le lien « Gestion des cookies » en bas de page."
}
```

### Proposition Anglais (`locales/en/common.json`)
```json
{
  "cookie.title": "Cookie Management & Privacy",
  "cookie.desc": "Analyticatech uses strictly necessary technical cookies and, with your consent, EU-hosted audience analytics and technical telemetry (PostHog EU) to improve platform reliability.",
  "cookie.accept": "Accept All",
  "cookie.refuse": "Decline All",
  "cookie.customize": "Customize",
  "cookie.save": "Save Preferences",
  "cookie.close": "Close banner (declines optional trackers)",
  "cookie.category.essential.title": "Technical Cookies (Strictly Necessary)",
  "cookie.category.essential.desc": "Required for security (CSRF protection), language preferences, and consent persistence. Retention: session / 6 months.",
  "cookie.category.essential.alwaysActive": "Always Active",
  "cookie.category.analytics.title": "Audience Analytics & Telemetry",
  "cookie.category.analytics.desc": "Measures anonymized website usage and technical exceptions to improve resilience. Processed within the EU (PostHog EU) with zero ad profiling. Retention: 6 months.",
  "cookie.rgpd": "Compliant with CNIL 2026 guidelines & GDPR. No third-party ad tracking. You can update your preferences anytime via 'Cookie Settings' in the footer."
}
```

---

## Validation des tests automatisés

- **Tests unitaires (Vitest)** : `155/155 tests passed` (dont tests dédiés pour le stockage, l'expiration à 6 mois, la symétrie, le footer et le blocage de PostHog).
- **Vérification de types (TypeScript)** : `tsc --noEmit` passé sans aucune erreur.
- **Linter (ESLint)** : 0 erreur, 0 avertissement.
