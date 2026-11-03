# Inventaire des composants d'interface — 3 novembre 2026

Recensement des contrôles interactifs du site (boutons, liens en forme de bouton,
pilules, accordéons, boutons-icônes) : ce qui était codé en dur ou dupliqué, ce
qui a été réuni dans un composant partagé, et ce qui reste volontairement spécifique.

## Composants partagés (source unique)

| Composant | Fichier | Rôle |
| --- | --- | --- |
| `Button` | `src/components/ui/button.tsx` | Tous les boutons d'action et liens-boutons. Variantes `primary`, `outline`, `secondary`, `ghost`, `link`, `terminal`, `subtle`, `destructive` ; tailles `sm`, `md`, `lg`, `icon` (`iconOnly`). `href` rend un lien Next avec les mêmes attributs (`data-cta`, `aria-*`). |
| `AnimatedButtonBorder` | `src/components/ui/button-border.tsx` | Liseré animé, utilisé uniquement par `Button`. |
| `FilterPill` | `src/components/interactive/FilterPill.tsx` | Pilules de filtre et de sélection (`role="tab"`), avec pastille de couleur optionnelle. Variante `segment` : segment d'un commutateur compact sur une ligne, dans la piste de verre `FilterSegmentGroup` (même fichier), qui défile latéralement sur mobile. |
| `FaqAccordion` | `src/components/ui/FaqAccordion.tsx` | Accordéon de questions (accueil, contact, fiches service). |
| `ContactCta` | `src/components/ui/ContactCta.tsx` | Encart d'appel au premier échange en bas de page. |
| `BrandLogo` | `src/components/branding/BrandLogo.tsx` | Logotype officiel (`flux`, `signature`, `mot`). |
| `IconBadge` | `src/components/ui/IconBadge.tsx` | Pastille d'icône commune : cercle, anneaux au trait fin, voile d'accent, pictogramme 1,5 px, balayage au survol. Tailles `sm` (36 px), `md` (44), `lg` (56), `xl` (72) ; tons `accent`, `link`, `danger`, `neutral` ou `color` propre. |

## Regroupements effectués

| Avant (codé en dur ou dupliqué) | Après |
| --- | --- |
| CTA du header : `ButtonBorder` en contour, forme différente du corps du site | `Button variant="primary" size="sm"` |
| CTA du menu mobile : `<button>` orange écrit à la main | `Button variant="primary" size="lg"` |
| CTA du footer : `<Link>` orange écrit à la main (`rounded-lg`, casse normale) | `Button variant="primary" size="md"` |
| Page Insights : deux `<Link>` stylés à la main | `Button` `outline` et `primary` |
| Bouton « Réessayer » des sections en erreur | `Button variant="outline" size="sm"` |
| Fermeture du menu mobile et du bandeau cookies, copie e-mail / téléphone | `Button iconOnly` (`secondary` ou `ghost`) |
| Pilules de la section Services (accueil) : boutons à styles en ligne, puis pilules mono capitales sur deux lignes | `FilterSegmentGroup` + `FilterPill variant="segment"` (libellés courts) + filtrage réel des cartes |
| Pilules « persona » de la page Services | `FilterPill` |
| Deux accordéons FAQ (accueil/contact et fiche service) de structures différentes | `FaqAccordion` |
| `ButtonBorder` (enveloppe redondante de `Button`) | supprimé |
| Ancien logo « A Tour Eiffel » + logotype écrit en texte | `BrandLogo` |

## Iconographie (3 novembre 2026)

Inspirée des puces des cartes services et des systèmes d'icônes primés (Awwwards,
catégorie Icons) : un seul trait fin, monochrome d'accent, cadre circulaire au trait
fin, animation discrète au survol, sans 3D, verre ni dégradé.

- Icônes « de repère » (en tête de carte, de section, d'état) : toujours `IconBadge`.
  Remplacées : contact (moyens de contact, e-mail, téléphone, adresse, confidentialité),
  bandeau cookies, page 404, en-têtes de page, valeurs (À propos), étapes et fiches
  Services, solutions, problèmes métiers, trace de la section 05, ligne éditoriale Insights,
  fiches service, article et solution, états d'erreur et de succès du formulaire,
  capsules de la sphère Méthode (dont l'ancien dégradé est retiré).
- Icônes fonctionnelles (flèches, chevrons, fermer, coches, 12–16 px) : Lucide nu,
  même trait 1,5 px (règle `svg.lucide` dans globals.css).
- Cartes Solutions et Insights (3 novembre 2026) : plus d'en-tête générique commun
  (grille + balayage en boucle) ni de grand numéro « /01 ». Chaque solution a son
  pictogramme et le schéma de ses étapes (tirées du texte publié) ; chaque catégorie
  d'article a son motif (réseau, flux, courbes sans valeurs, blocs). Aucune zone ne
  défile à l'intérieur d'une carte (test e2e `cards-wheel-scroll.spec.ts`).
- Cartes Services de l'accueil (3 novembre 2026) : les puces animées propres à la
  section (`ServiceAnimatedIcon`, CSS `.svc-icon`) sont remplacées par `IconBadge` avec
  l'icône de chaque service ; un seul repère « 01 / 04 » (plus de numéro géant en fond
  ni de « Fiche #01 ») ; accroche en phrase, outils sur une ligne au lieu de pastilles.
- Engagements (section 02 de l'accueil) : plus de sous-cartes au fond de page (noir
  sidéral en thème sombre) ; quatre colonnes séparées par des filets dans la carte de
  verre, chacune avec son `IconBadge`.
- Correctif : les 4 services affichaient le même pictogramme (clés `brain`/`workflow`/
  `bot`/`chart` absentes de `SERVICE_ICONS`).

## Contrôles volontairement spécifiques

Ils portent une interaction propre que les composants génériques ne couvrent pas :
le bouton burger du header (icône animée ouvert/fermé),
le retour en haut (`BackToTop`, anneau de progression), les étapes de la méthode
(`AgentoryMethod`, `MethodOrbit`, `orbit-3d-method`), la bascule avant/après
(`BeforeAfterDemo`, couleurs de sens), le choix de domaine du formulaire de contact
(cases à cocher en grille), les cartes Insights (`HeroCard` à la une, `InsightRow` en liste, couvertures `InsightCover` par catégorie — de vrais liens),
les cartes Solutions (`SolutionCard` : schéma du parcours de l'outil, trait plein pour un projet, pointillés pour une piste),
le sommaire vertical (`VerticalSectionNav`), les liens de navigation (`NavLink`).

## Règles

- Un nouveau bouton ou lien d'action passe par `Button` ; un filtre par `FilterPill` ;
  une FAQ par `FaqAccordion`. Pas de `<button>` stylé à la main pour ces usages.
- Couleurs de texte : jamais de gris plus clair que `slate-600` en thème clair (4,5:1),
  `text-accent-ink` pour un texte d'accent (l'orange pur n'est lisible que sur fond sombre).
- Contrôle : audit axe WCAG 2.1 AA sur 16 pages, deux thèmes, desktop et mobile :
  aucune violation au 3 novembre 2026.
