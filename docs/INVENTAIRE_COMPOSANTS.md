# Inventaire des composants d'interface — 3 novembre 2026

Recensement des contrôles interactifs du site (boutons, liens en forme de bouton,
pilules, accordéons, boutons-icônes) : ce qui était codé en dur ou dupliqué, ce
qui a été réuni dans un composant partagé, et ce qui reste volontairement spécifique.

## Composants partagés (source unique)

| Composant | Fichier | Rôle |
| --- | --- | --- |
| `Button` | `src/components/ui/button.tsx` | Tous les boutons d'action et liens-boutons. Variantes `primary`, `outline`, `secondary`, `ghost`, `link`, `terminal`, `subtle`, `destructive` ; tailles `sm`, `md`, `lg`, `icon` (`iconOnly`). `href` rend un lien Next avec les mêmes attributs (`data-cta`, `aria-*`). |
| `AnimatedButtonBorder` | `src/components/ui/button-border.tsx` | Liseré animé, utilisé uniquement par `Button`. |
| `FilterPill` | `src/components/interactive/FilterPill.tsx` | Pilules de filtre et de sélection (`role="tab"`), avec pastille de couleur optionnelle. |
| `FaqAccordion` | `src/components/ui/FaqAccordion.tsx` | Accordéon de questions (accueil, contact, fiches service). |
| `ContactCta` | `src/components/ui/ContactCta.tsx` | Encart d'appel au premier échange en bas de page. |
| `BrandLogo` | `src/components/branding/BrandLogo.tsx` | Logotype officiel (`flux`, `signature`, `mot`). |

## Regroupements effectués

| Avant (codé en dur ou dupliqué) | Après |
| --- | --- |
| CTA du header : `ButtonBorder` en contour, forme différente du corps du site | `Button variant="primary" size="sm"` |
| CTA du menu mobile : `<button>` orange écrit à la main | `Button variant="primary" size="lg"` |
| CTA du footer : `<Link>` orange écrit à la main (`rounded-lg`, casse normale) | `Button variant="primary" size="md"` |
| Page Insights : deux `<Link>` stylés à la main | `Button` `outline` et `primary` |
| Bouton « Réessayer » des sections en erreur | `Button variant="outline" size="sm"` |
| Fermeture du menu mobile et du bandeau cookies, copie e-mail / téléphone | `Button iconOnly` (`secondary` ou `ghost`) |
| Pilules de la section Services (accueil) : boutons à styles en ligne | `FilterPill` + filtrage réel des cartes |
| Pilules « persona » de la page Services | `FilterPill` |
| Deux accordéons FAQ (accueil/contact et fiche service) de structures différentes | `FaqAccordion` |
| `ButtonBorder` (enveloppe redondante de `Button`) | supprimé |
| Ancien logo « A Tour Eiffel » + logotype écrit en texte | `BrandLogo` |

## Contrôles volontairement spécifiques

Ils portent une interaction propre que les composants génériques ne couvrent pas :
le bouton burger du header (icône animée ouvert/fermé),
le retour en haut (`BackToTop`, anneau de progression), les étapes de la méthode
(`AgentoryMethod`, `MethodOrbit`, `orbit-3d-method`), la bascule avant/après
(`BeforeAfterDemo`, couleurs de sens), le choix de domaine du formulaire de contact
(cases à cocher en grille), les cartes cliquables Insights (`HeroCard`, `ReportCard`),
le sommaire vertical (`VerticalSectionNav`), les liens de navigation (`NavLink`).

## Règles

- Un nouveau bouton ou lien d'action passe par `Button` ; un filtre par `FilterPill` ;
  une FAQ par `FaqAccordion`. Pas de `<button>` stylé à la main pour ces usages.
- Couleurs de texte : jamais de gris plus clair que `slate-600` en thème clair (4,5:1),
  `text-accent-ink` pour un texte d'accent (l'orange pur n'est lisible que sur fond sombre).
- Contrôle : audit axe WCAG 2.1 AA sur 16 pages, deux thèmes, desktop et mobile :
  aucune violation au 3 novembre 2026.
