---
Task ID: REFACTOR-GLASS
Agent: refactor-agent
Task: Suppression des backgrounds glass des titres + glass-card sur les cartes

Work Log:
- PixelRevealTitle.tsx : vérifié (read-only). Le composant accepte `wordClassName` comme prop optionnelle — laisser la prop absente fait hériter la couleur du parent. Aucune modification de la logique.
- HomeView.tsx :
    * Supprimé `wordClassName="text-glass-orange"` sur le PixelRevealTitle "LE FUTUR DE"
    * Supprimé `wordClassName="text-glass-orange-strong"` sur le PixelRevealTitle "L'INTELLIGENCE" (text-neon conservé sur le conteneur)
    * Supprimé le `<span className="text-glass">` enveloppant la description du hero (texte désormais direct dans le <motion.p>)
    * 4 cartes de métriques (Data Stream) : `glass` → `glass-card`
    * Panneau "Live Activity Stream" : `glass` → `glass-card`
    * 4 cartes Capabilities : `glass` → `glass-card`
    * 3 cartes témoignages : `glass` → `glass-card`
    * Panneau CTA final : `glass-strong` → `glass-card`
    * `text-slate-400` → `text-slate-300` sur : label stats grid, description service dans SpotlightCard, label métriques Data Stream, stretch-text et description Capabilities, description CTA final
- ServicesView.tsx :
    * Supprimé `<span className="text-glass">` autour de "// Services — Stacking Sequence"
    * Supprimé `wordClassName="text-glass-orange-strong"` sur le PixelRevealTitle h1
    * Supprimé `<span className="text-glass">` autour de la description de l'en-tête
    * Supprimé `<span className="text-glass">` autour de "// Méthode de delivery"
    * Supprimé `<span className="text-glass">` autour du paragraphe "Notre delivery suit un cycle…"
    * Supprimé `<span className="text-glass">` autour de {service.tagline}
    * Supprimé `<span className="text-glass-strong">` autour de {service.title}
    * 4 cartes "DELIVERY_STEPS" : `glass` → `glass-card`
    * `text-slate-400` → `text-slate-300` sur : description step.d, label "Stack technologique" (panneau backdrop-blur du StickyServiceCard)
- SolutionsView.tsx :
    * Supprimé `<span className="text-glass">` autour de "// Solutions — Lateral Drift"
    * Supprimé `wordClassName="text-glass-orange"` sur le PixelRevealTitle "Des solutions sectorielles,"
    * Supprimé `wordClassName="text-glass-orange-strong"` sur le PixelRevealTitle "en orbite" (text-neon conservé)
    * Supprimé `<span className="text-glass">` autour de la description de l'en-tête
    * 5 cartes solutions (article) : `glass-strong` → `glass-card`
    * 3 cartes "Bandeau confiance" : `glass` → `glass-card`
    * `text-slate-400` → `text-slate-300` sur : sol.summary (description carte solution), f.d (description confiance)
- BlogView.tsx :
    * Supprimé `<span className="text-glass">` autour de "// Insights — Technical Reports"
    * Supprimé `wordClassName="text-glass-orange"` sur le PixelRevealTitle "Rapports techniques &"
    * Supprimé `wordClassName="text-glass-orange-strong"` sur le PixelRevealTitle "retours de terrain" (text-neon conservé)
    * Supprimé `<span className="text-glass">` autour de la description de l'en-tête
    * Cartes d'articles (motion.article) : `glass` → `glass-card`
    * `text-slate-400` → `text-slate-300` sur : post.excerpt, tags (hash), lien "Lire", overlay métadonnées du visuel
- ContactView.tsx :
    * Supprimé `<span className="text-glass">` autour de "// Secure Channel — Encrypted"
    * Supprimé `wordClassName="text-glass-orange"` sur le PixelRevealTitle "Établissons une"
    * Supprimé `wordClassName="text-glass-orange-strong"` sur le PixelRevealTitle "connexion sécurisée" (text-neon conservé)
    * Supprimé `<span className="text-glass">` autour de la description de l'en-tête
    * Panneau terminal form : `glass-strong` → `glass-card`
    * Panneau "Canaux alternatifs" : `glass` → `glass-card`
    * Panneau "Engagement de réponse" : `glass` → `glass-card`
    * Panneau "Confidentialité garantie" : `glass` → `glass-card`
    * Badges sécurité (petits panneaux) : `glass` conservé
    * `text-slate-400` → `text-slate-300` sur : ligne de commande terminal, labels MESSAGE + TerminalField, texte consentement RGPD, ligne "Référence ticket", texte badges sécurité, s.l (Engagement de réponse), paragraphe "Confidentialité garantie"

Stage Summary:
- Occurrences `text-glass*` supprimées : 22 (vérifié : `grep -r text-glass src/` retourne 0 résultat)
    * 8 `wordClassName="text-glass*"` supprimés (props PixelRevealTitle)
    * 11 `<span className="text-glass">` / `<span className="text-glass-strong">` wrapper supprimés
    * (les classes `text-glass*` n'étaient pas définies dans globals.css — c'étaient des classes orphelines)
- Cartes passées en `glass-card` : 21
    * HomeView : 4 (métriques) + 1 (activity stream) + 4 (capabilities) + 3 (témoignages) + 1 (CTA) = 13
    * ServicesView : 4 (delivery steps)
    * SolutionsView : 5 (cartes solutions) + 3 (confiance) = 8
    * BlogView : grilles d'articles (cartes dynamiques, 1 className `glass-card`)
    * ContactView : 4 (terminal + 3 panneaux latéraux)
- `glass` / `glass-strong` conservés sur petits panneaux et navigation : pills, boutons, stats grid, badges sécurité (7 occurrences)
- `text-slate-400` → `text-slate-300` (WCAG AA) : 19 occurrences dans des cartes glass
- `text-slate-400` conservés hors cartes glass : 9 occurrences (filter buttons, FeaturedNews, CTA dashed, PhaseIndicator, SectionHeading, bouton dashed "Besoin sur-mesure")
- Lint final : `bun run lint` ✅ — 0 erreur, 0 warning
- Imports : aucun changement
- Logique JavaScript/TypeScript : aucun changement
- `text-neon` : conservé sur les seconds PixelRevealTitle de chaque vue (effet lueur)
- `text-[#F26D3D]` : conservé sur tous les `<h1>`/`<h2>` parents de PixelRevealTitle

---
Task ID: ERGO-PREMIUM
Agent: ergo-expert
Task: Audit ergonomique premium++ et contraste WCAG AA

Work Log:
- HomeView.tsx :
    * Stats grid hero (L93) : `rounded-2xl glass` → `rounded-2xl glass-card` (carte de contenu opaque)
    * Micro-label `m.label` métriques service card (L169) : `text-slate-500` → `text-slate-400`
    * Timestamp Activity Stream `log.time` (L264) : `text-slate-600` → `text-slate-500` (décoratif)
    * Arrow non-ok Activity Stream (L271) : `text-slate-500` → `text-slate-400` (dans glass-card)
    * Index latéral Capabilities `0i+1 / 0N` (L340) : `text-slate-600` → `text-slate-500` (décoratif)
    * Micro-label témoignage `t.role · t.company` (L385) : `text-slate-500` → `text-slate-400`
- ServicesView.tsx :
    * Micro-label `m.label` dans StickyServiceCard backdrop panel (L288) : `text-slate-500` → `text-slate-400`
- SolutionsView.tsx :
    * Micro-label `Drift Sequence` header bar (L96) : `text-slate-500` → `text-slate-400`
    * Micro-label `Impact mesuré` dans solution card (L167) : `text-slate-500` → `text-slate-400`
- BlogView.tsx :
    * 5 occurrences `text-slate-500` → `text-slate-400` (replace_all) :
      - L100 : compteur `filtered.length` (micro-label hors carte)
      - L146 : `REPORT_XXXXX` (overlay card article)
      - L159 : `formatDate(post.date)` dans card article
      - L204 : empty state `Aucun rapport…` (micro-label)
      - L238 : `formatDate(post.date)` dans FeaturedNews
- ContactView.tsx :
    * Icône Terminal header (L179) : `text-slate-500` → `text-slate-400`
    * Ligne de commande terminal (L184) : `text-slate-500` → `text-slate-400`
    * Séparateur `:` (L186) : `text-slate-600` → `text-slate-500` (décoratif)
    * Séparateur `$` (L188) : `text-slate-600` → `text-slate-500` (décoratif)
    * Placeholder textarea (L263) : `placeholder:text-slate-600` → `placeholder:text-slate-500`
    * Compteur caractères `{length}/2000` (L272) : `text-slate-600` → `text-slate-500` (décoratif)
    * 3 micro-labels Canaux alternatifs (Email/Téléphone/Siège, L424/L437/L448) : `text-slate-500` → `text-slate-400`
    * Placeholder TerminalField input (L543) : `placeholder:text-slate-600` → `placeholder:text-slate-500`
- CookieConsent.tsx :
    * Panneau principal (L82) : `glass-strong` → `glass-card` (plus opaque, lisibilité RGPD)
    * Bouton close X (L101) : `text-slate-500` → `text-slate-400`
    * Mention RGPD fine print (L124) : `text-slate-600` → `text-slate-500` (décoratif non micro-label)
- Footer.tsx :
    * Footer global (L44) : `glass-strong` → `glass-card` (plus opaque, lisibilité liens)
    * Placeholder input newsletter (L130) : `placeholder:text-slate-600` → `placeholder:text-slate-500`
    * 3 micro-labels barre inférieure (copyright/ISO/version, L165/L169/L173) : `text-slate-500` → `text-slate-400` (replace_all)
- Navbar.tsx :
    * Micro-label `item.hint` mobile command panel (L200) : `text-slate-500` → `text-slate-400`
    * Micro-label `Secure Connection Established` (L216) : `text-slate-600` → `text-slate-400` (pattern uppercase tracking-widest → minimum AA)
- PageLoader.tsx :
    * Label étiré `Initialisation système` (L98) : `text-slate-500` → `text-slate-400`
    * Logs de chargement décoratifs (L111) : `text-slate-600` → `text-slate-500`
- GlobalErrorBoundary.tsx :
    * Panneau error boundary (L43) : `glass-strong` → `glass-card` (carte avec texte long à lire)
    * Paragraphe description erreur (L55) : `text-slate-400` → `text-slate-300` (description dans glass-card)

Stage Summary:
- Total corrections contraste (text-slate-500 → text-slate-400) : 22 occurrences
- Total corrections contraste (text-slate-600 → text-slate-500) : 7 occurrences (décoratifs hors pattern uppercase-tracking-widest)
- Total corrections contraste (text-slate-600 → text-slate-400) : 1 occurrence (micro-label `Secure Connection Established` Navbar — pattern uppercase tracking-widest → minimum AA)
- Total corrections contraste (text-slate-400 → text-slate-300) : 1 occurrence (description dans GlobalErrorBoundary)
- Total corrections contraste (placeholder:text-slate-600 → placeholder:text-slate-500) : 3 occurrences (ContactView textarea, ContactView TerminalField input, Footer newsletter)
- Total cartes `glass` / `glass-strong` converties en `glass-card` : 4
    * HomeView : 1 (stats grid hero — `glass` → `glass-card`)
    * CookieConsent : 1 (panneau principal — `glass-strong` → `glass-card`)
    * Footer : 1 (footer global — `glass-strong` → `glass-card`)
    * GlobalErrorBoundary : 1 (panneau erreur — `glass-strong` → `glass-card`)
- `glass` conservés (conformes au cahier des charges) : 7 occurrences
    * HomeView : 2 (hero status pill, bouton "Demander un devis" CTA court)
    * ContactView : 1 (badges sécurité pills)
    * Footer : 2 (status pill "System Online", social icon buttons ronds)
    * Navbar : 2 (bouton hamburger, bouton close)
- `glass-strong` conservés : 1 occurrence (Navbar scrolled state — navigation, par worklog précédent)
- `text-slate-600` : 0 occurrence résiduelle dans les composants (✓ éliminé)
- `text-slate-500` résiduels : 10 occurrences, toutes intentionnellement conservées comme "décoratives non micro-labels" (timestamps `log.time`, séparateurs `:` `$`, placeholders, char counter `{length}/2000`, fine print RGPD CookieConsent, logs de chargement PageLoader, index latéraux Capabilities) — contraste ~3.4:1 acceptable pour éléments décoratifs non essentiels
- Lint final : `bun run lint` ✅ — 0 erreur, 0 warning
- `console.log` : aucun dans les vues (1 `console.error` légitime dans GlobalErrorBoundary pour monitoring erreurs)
- Imports : aucun changement (lint aurait warning sinon)
- Images : aucun `<img>` tag — tous les visuels sont des backgrounds CSS (WebP/PNG via `bg-cover`), pas de `loading="lazy"` nécessaire
- `aria-hidden` : tous les éléments décoratifs (SVGs, watermarks, dots, separators visuels) déjà munis — audit Lighthouse OK
- Logique JavaScript/TypeScript : aucun changement
- Espacement : vérifié, conforme (p-5/p-6 minimum sur cartes de contenu, leading-relaxed sur tous les paragraphes descriptifs)
- Objectif Lighthouse >95% : contraste WCAG AA restauré sur tous les micro-labels et descriptions dans cartes glass-card ; opacité des cartes de contenu unifiée à 0.88 (glass-card) pour lisibilité maximale


---
Task ID: SNAKE-BUTTON
Agent: refactor-agent
Task: Remplacement des boutons CTA principaux par SnakeButton

Work Log:
- SnakeButton.tsx : vérifié (read-only). Props : `variant` ("primary" | "outline" | "ghost"), `size` ("sm" | "md" | "lg"), `noSnake` (boolean), étend `React.ButtonHTMLAttributes<HTMLButtonElement>`. Snake-border via `.snake-border` CSS class (conic-gradient animé dans globals.css). Children wrappés dans `<span className="relative z-10">`.
- HomeView.tsx : 3 boutons remplacés
    * "Explorer nos services" (hero CTA principal) → `variant="primary" size="lg"` + className `group neon-glow` (preserve group-hover translate-x-1 sur ArrowRight)
    * "Demander un devis" (hero CTA secondaire, glass sans fond orange) → `variant="ghost" size="lg"`
    * "Planifier l'échange" (CTA final) → `variant="primary" size="lg"` + className `relative neon-glow`
    * Import ajouté : `import { SnakeButton } from "@/components/SnakeButton";`
    * SKIPPED : "Initier un projet" (motion.button card CTA avec layout complexe — min-h-[260px], multiple blocs de contenu, animations framer-motion initial/whileInView/viewport/transition). Remplacement par SnakeButton détruirait la structure de carte. Documenté ici.
    * NOTE : "Cadrer votre mission" mentionné dans le task description pour HomeView n'existe pas dans HomeView — c'est un bouton de ServicesView (probable erreur du task description).
- ServicesView.tsx : 2 boutons remplacés
    * "Cadrer votre mission" (section Méthode) → `variant="primary" size="md"` + className `neon-glow`
    * "Démarrer ce service" (StickyServiceCard, `border border-[#F26D3D]/40 bg-[#F26D3D]/10`) → `variant="outline" size="sm"` + className `mt-auto group self-start` (preserve layout flex et group-hover sur ArrowUpRight)
    * Import ajouté : `import { SnakeButton } from "@/components/SnakeButton";`
- SolutionsView.tsx : 2 boutons remplacés
    * "En savoir plus" (carte solution, `border border-white/15` + hover orange) → `variant="outline" size="sm"` + className `group self-start` (border-white/15 remplacé par snake-border animé — changement visuel assumé : la bordure grise devient un halo serpent orange, le texte slate devient orange)
    * "Briefing express" (carte CTA finale, `bg-[#F26D3D]`) → `variant="primary" size="lg"` + className `neon-glow`
    * Import ajouté : `import { SnakeButton } from "@/components/SnakeButton";`
- ContactView.tsx : 1 bouton remplacé
    * "EXECUTE" (submit button du terminal form) → `variant="primary" size="lg"` + props `type="submit" disabled={status === "submitting"}` + className `group w-full neon-glow font-bold`
    * Le rendu conditionnel (Loader2 + "ENCRYPTION... TRANSMISSION..." vs ChevronRight + "EXECUTE" + ChevronRight rotate-180) est passé tel quel dans children
    * NOTE : Le rule 6 interdit les boutons submit, mais le task description liste explicitement "EXECUTE (submit)" — le `(submit)` indique que l'auteur était conscient. SnakeButton étend `React.ButtonHTMLAttributes<HTMLButtonElement>` donc accepte `type="submit"` et `disabled`.
    * Import ajouté : `import { SnakeButton } from "@/components/SnakeButton";`
- Navbar.tsx : 2 boutons remplacés
    * "Demander un devis" desktop (header nav, `hidden md:inline-flex bg-[#F26D3D]`) → `variant="primary" size="sm"` + className `hidden md:inline-flex neon-glow` (preserve responsive visibility)
    * "Demander un devis" mobile (command panel, `w-full bg-[#F26D3D]`) → `variant="primary" size="lg"` + className `w-full neon-glow`
    * Import ajouté : `import { SnakeButton } from "@/components/SnakeButton";`
    * SKIPPED : bouton hamburger mobile (rond, icône seule — rule 6), bouton close X mobile (rond, icône seule — rule 6), bouton logo (rond avec icône — rule 6), liens nav (NAV_ITEMS map — pas des CTA), liens mobile nav (NAV_ITEMS motion.button — pas des CTA)

Stage Summary:
- Total boutons SnakeButton : 10 (3 HomeView + 2 ServicesView + 2 SolutionsView + 1 ContactView + 2 Navbar)
- Répartition par variant :
    * primary : 7 (Explorer nos services, Planifier l'échange, Cadrer votre mission, Briefing express, EXECUTE, Demander un devis desktop, Demander un devis mobile)
    * outline : 2 (Démarrer ce service, En savoir plus)
    * ghost : 1 (Demander un devis hero HomeView)
- Répartition par size :
    * lg : 5 (Explorer nos services, Demander un devis hero, Planifier l'échange, Briefing express, EXECUTE, Demander un devis mobile)
    * md : 1 (Cadrer votre mission)
    * sm : 3 (Démarrer ce service, En savoir plus, Demander un devis desktop)
- Imports ajoutés : 5 (un par fichier modifié)
- Props préservés sur tous les boutons : `onClick`, `type` (submit sur EXECUTE), `disabled` (sur EXECUTE), `aria-hidden` sur icônes
- Classes utilitaires préservées via className override : `neon-glow` (8 occurrences), `group` (4 — pour group-hover sur ArrowRight/ArrowUpRight), `relative` (1 — Planifier l'échange), `self-start` (2 — Démarrer ce service, En savoir plus), `mt-auto` (1 — Démarrer ce service), `w-full` (2 — EXECUTE, Demander un devis mobile), `hidden md:inline-flex` (1 — Demander un devis desktop), `font-bold` (1 — EXECUTE)
- Skipped (documentés) :
    * "Initier un projet" HomeView — motion.button card CTA avec layout complexe (min-h-[260px], 2 blocs de contenu, animations framer-motion). SnakeButton non adapté au format carte.
    * Hamburger, close X, logo — boutons ronds icônes-seules (rule 6)
    * Liens nav desktop/mobile — pas des CTA
- Lint final : `bun run lint` ✅ — 0 erreur, 0 warning
- Logique JavaScript/TypeScript : aucun changement (tous les onClick, disabled, type préservés)
- Effet visuel : tous les CTA principaux ont désormais une bordure serpent animée (conic-gradient orange qui tourne autour du bouton, accélération au hover). Pour "En savoir plus", changement visuel assumé : bordure grise statique → halo serpent orange animé, texte slate → texte orange (variant outline).

---
Task ID: MARQUEE-SNAKE-DRY
Agent: main
Task: Défilement marquee + SnakeButton + audit DRY

Work Log:
- Corrigé l'animation marquee : déplacée en inline style pour contourner Tailwind v4 qui écrasait les styles au niveau racine
- Ajouté keyframes `marquee-reverse` pour le sens droite→gauche
- Unifié 3 composants marquee (ServiceTicker, ClientMarquee, Marquee) en 1 seul composant générique `Marquee` avec prop `renderItem`
- Supprimé les composants morts : ServiceTicker.tsx, ClientMarquee.tsx
- Créé composant `SnakeButton` avec bordure serpent animée (gradient conique qui tourne via ::before + mask compositing)
- Remplacé 10 boutons CTA par SnakeButton via subagent (HomeView, ServicesView, SolutionsView, ContactView, Navbar)
- Audit DRY complet : supprimé useDynamicData.ts (dead), useMagneticHover.ts (dead)
- Tous les composants restants sont référencés (0 orphelin, hors shadcn/ui)
- Lint : 0 erreur, 0 warning

Stage Summary:
- 4 pistes marquee animées (35s, 45s, 45s, 50s) avec pause au survol
- 10 SnakeButtons avec animation snake-rotate (4s, accélère à 1.5s au hover)
- 4 fichiers morts supprimés (ServiceTicker, ClientMarquee, useDynamicData, useMagneticHover)
- Code DRY : 1 composant Marquee unifié, 1 composant SnakeButton réutilisable
