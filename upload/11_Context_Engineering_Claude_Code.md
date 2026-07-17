> Statut : En revue · Dernière révision : juillet 2026 · Référencé par 04, 07, 08

# 11 — Context Engineering & Manuel Opérationnel Claude Code

## 0. Pourquoi ce document existe

Les documents précédents décrivent le produit. Celui-ci décrit le processus de fabrication du produit quand une partie du code est générée avec un agent (Claude Code). Sans convention explicite, chaque session de génération repart d'un contexte différent, produit un style de code incohérent, et perd le fil des décisions déjà prises (doc 09). Ce document fixe les règles d'engagement entre l'architecte et l'agent de code.

## 1. Fichier `CLAUDE.md` du dépôt

Chaque dépôt de code porte un `CLAUDE.md` à la racine, lu automatiquement en début de session. Contenu type :

```markdown
# CLAUDE.md — Analyticatech Site

## Stack
Next.js + TS + Tailwind + Three.js (front) · Node/Express + TS + Zod (back)
Voir doc 03 pour le détail complet — ne pas réinventer les choix déjà tracés en doc 09 (ADR).

## Conventions de code
- Composants React : PascalCase, un composant par fichier
- Pas de `any` implicite — Zod pour toute validation d'entrée
- Commits : Conventional Commits (feat/fix/chore/docs)

## Avant de coder une fonctionnalité IA
1. Vérifier qu'une spec existe en /specs/<feature_id>.yaml (doc 07)
2. Vérifier que le gate d'architecture est vert (doc 03 §3, doc 06)
3. Écrire l'eval avant l'implémentation (doc 08)

## Ne jamais faire
- Modifier un prompt système en production sans passer par une eval de non-régression (doc 08 §5)
- Ajouter une permission d'outil à un agent sans mise à jour du registre (doc 06 §3)
- Introduire une dépendance sans ADR si le choix est structurant (doc 09)
```

## 2. Découpage en sub-agents

Pour les tâches complexes, décomposer explicitement plutôt que de tout confier à une session monolithique :

| Sub-agent | Responsabilité | Contexte fourni |
|---|---|---|
| `spec-writer` | Rédige la spec YAML (doc 07) à partir de l'epic | doc 02 (epic concerné), doc 03/06 (architecture disponible) |
| `implementer` | Implémente une spec `approved` | spec YAML uniquement + `CLAUDE.md` — pas le PRD narratif complet, pour limiter le bruit de contexte |
| `eval-writer` | Écrit les évals correspondant aux `acceptance.criteria` de la spec | spec YAML, doc 08 (méthodes de scoring) |
| `reviewer` | Revue de code + vérification de conformité ADR | Diff proposé + doc 09 (ADR pertinents) |

Chaque sub-agent reçoit le minimum de contexte nécessaire à sa tâche, pas l'intégralité de la documentation projet — principe de budget de contexte (§ 3).

## 3. Budget de contexte

Un agent avec 200 000 tokens de contexte disponibles ne doit pas en consommer 150 000 en documentation de fond avant de commencer à travailler.

- **Contexte systématique** (toujours chargé) : `CLAUDE.md`, la spec YAML de la tâche en cours.
- **Contexte à la demande** (chargé seulement si la tâche le requiert) : doc 03/06 pour toute question d'architecture, doc 09 pour toute question de décision déjà prise, doc 08 pour l'écriture d'évals.
- **Contexte jamais chargé en masse** : ne pas coller l'intégralité de la documentation projet dans une session — utiliser les références croisées (chaque document pointe vers les autres par section précise) pour que l'agent aille chercher l'information exacte dont il a besoin.

## 4. Boucle de collaboration recommandée

1. Identifier la feature à construire, la relier à l'epic (doc 02).
2. `spec-writer` rédige `/specs/<feature_id>.yaml` (doc 07). Validation `draft → approved`.
3. `eval-writer` écrit les évals correspondantes (doc 08) — avant tout code.
4. `implementer` implémente contre la spec, en boucle jusqu'à ce que tests et évals passent.
5. `reviewer` vérifie la conformité aux ADR (doc 09), propose une nouvelle entrée ADR si une décision structurante a été prise en cours de route.
6. Merge, mise à jour du statut `done` dans la spec.

## 5. Ce que ce document n'est pas

Ce n'est pas un guide de prompt engineering générique — c'est la déclinaison opérationnelle, propre à ce projet, de la façon dont la documentation doit être consommée par un agent de code sans perte de fidélité ni surcharge de contexte. À adapter légèrement pour chaque dépôt en conservant la structure.
