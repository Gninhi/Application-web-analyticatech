> Statut : Validé · Dernière révision : juillet 2026

# 02 — Product Discovery & UX

## 1. Epics

| Epic | Périmètre |
|---|---|
| E1 — Services & expertise | Présentation des 5 spécialisations, pages détail service |
| E2 — Solutions & cas d'usage | Catalogue interactif, études de cas |
| E3 — Engagement & contact | Formulaire, coordonnées, réseaux |
| E4 — Contenu & expertise | Blog, livres blancs, webinaires |
| E5 — À propos & transparence | Histoire, équipe, partenaires |
| E6 — Interfaces IA | Dashboard client, recherche sémantique, chatbot |

## 2. Parcours utilisateurs (synthèse par persona)

- **CINO** : Accueil → Services (IA) → Étude de cas quantifiée → Contact.
- **CIO** : Accueil → Architecture/Sécurité (doc 03) → Solutions automatisation → Contact avec preuve de conformité.
- **Process Manager** : Accueil → Solutions n8n/Crew AI → Témoignages → Démo.
- **Data Scientist** : Blog technique → Article LangChain/Claude → Livre blanc → Contact.

## 3. Architecture de l'information

Arborescence en 8 branches principales (Accueil, Services, Solutions, Études de cas, Contact, À propos, Blog/Insights, Pied de page), chaque branche de service se déclinant en sous-pages spécialisées.

## 4. Wireframes — pages principales

Spécifications détaillées pour Accueil, Services, Détail service, Solutions, Contact, Blog/Insights, Détail article, À propos, Études de cas — gabarits maintenus dans l'outil de design, synchronisés avec la grille de composition du doc 12.

### Page : Dashboard client

- Accès authentifié (JWT, doc 03).
- Vue d'ensemble : statut des missions en cours, documents partagés, historique d'échanges.
- Widget de recherche sémantique sur la base de connaissances client (doc 06, section RAG).
- États à spécifier avant développement : vide (onboarding), chargement, erreur, session expirée.

### Page : Chatbot IA

- Widget persistant en bas d'écran, non-intrusif, désactivable.
- Affiche explicitement qu'il s'agit d'un agent IA (transparence — doc 10, AI Act Art. 50).
- Échappement vers un humain après 2 tentatives infructueuses ou sur mot-clé de frustration détecté.
- Historique de conversation non persistant côté client sans consentement explicite (RGPD).

## 5. Spécifications UX/UI

- Esthétique « Corporate Cyberpunk » : glassmorphism, scramble-text au survol, spotlight effect.
- Responsive mobile-first, `Command Panel` plein écran sur mobile.
- Animations Framer Motion, `useScroll` pour stacking cards (Services), défilement horizontal piloté verticalement (Solutions).
- Accessibilité : WCAG 2.1 AA, cf. doc 03 section Design System.
- Le système de composition détaillé (grille bento, gabarits de cards, glassmorphism à deux intensités, typographie variable) est spécifié en doc 12, qui fait autorité sur ces points.
