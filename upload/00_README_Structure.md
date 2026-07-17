# Documentation Projet — Analyticatech

Pile documentaire complète pour piloter le projet Analyticatech de bout en bout : cadrage stratégique, discovery/UX, architecture technique, delivery, gouvernance, et une couche dédiée à l'opérationnalisation de l'IA (orchestration agentique, specs exécutables, évaluation, conformité) qui s'ajoute aux livrables de delivery classiques parce qu'Analyticatech vend elle-même de l'agentique comme pilier métier — le site doit en être la démonstration, pas l'exception.

## Comment importer dans Notion

1. Dans Notion : espace cible → `...` → **Import** → **Markdown & CSV**.
2. Sélectionner tous les fichiers `.md` de ce dossier en une fois.
3. Notion crée une page par fichier, dans l'ordre alphabétique des noms — d'où la numérotation `01_`, `02_`, etc. Regrouper ensuite les pages `06` à `11` sous une page mère « IA & Orchestration » et `12`-`13` sous « Croissance & Mesure » pour obtenir la hiérarchie ci-dessous.
4. Tableaux, titres et listes à cocher sont importés nativement. Les blocs `> ` deviennent des callouts Notion.

## Hiérarchie

```
Analyticatech — Documentation Projet
├── 01 Stratégie & Cadrage
├── 02 Discovery & UX
├── 03 Architecture Technique
├── 04 Delivery & Gestion de Projet
├── 05 Gouvernance & Amélioration Continue
├── IA & Orchestration
│   ├── 06 Architecture Agentique & Orchestration
│   ├── 07 PRD Exécutable (Spec-Driven Development)
│   ├── 08 Suite d'Évals (Eval-Driven Development)
│   ├── 09 Registre des Décisions d'Architecture (ADR)
│   ├── 10 Gouvernance IA & Conformité AI Act
│   └── 11 Context Engineering & Manuel Claude Code
├── Croissance & Mesure
│   ├── 12 Architecture UI/UX Premium
│   └── 13 SEO, Recherche Agentique (GEO/AEO) & Analytics
└── 14 Traçabilité & Statut Global — à lire en premier
```

## Registre des statuts

| # | Document | Statut |
|---|---|---|
| 01 | Stratégie & Cadrage | Validé |
| 02 | Discovery & UX | Validé |
| 03 | Architecture Technique | Validé |
| 04 | Delivery & Gestion de Projet | Validé |
| 05 | Gouvernance & Amélioration Continue | Validé |
| 06 | Architecture Agentique & Orchestration | En revue — validation Tech Lead requise avant sprint 4 |
| 07 | PRD Exécutable | En revue |
| 08 | Suite d'Évals | En revue |
| 09 | Registre ADR | En revue |
| 10 | Gouvernance IA & AI Act | En revue — validation juridique requise avant mise en production du chatbot |
| 11 | Context Engineering | En revue |
| 12 | Architecture UI/UX Premium | Draft — validation interne requise avant implémentation |
| 13 | SEO, GEO/AEO & Analytics | Draft — validation interne requise avant implémentation |
| 14 | Traçabilité & Statut Global | Validé |

## Principe de gouvernance

Chaque document porte un statut et une date de dernière révision en en-tête. Un document en amont ne se modifie jamais sans propager la mise à jour en aval — le doc 14 en tient le registre. Toute décision structurante (choix technique, pattern d'architecture, fournisseur) fait l'objet d'une entrée dans le doc 09 (ADR) avant implémentation, pas après. Cette pile documentaire se traite comme du code : versionnée, revue, jamais éditée sans trace.
