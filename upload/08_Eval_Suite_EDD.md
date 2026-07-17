> Statut : En revue · Dernière révision : juillet 2026 · Référencé par 03, 04, 05, 06, 07, 10, 11, 13

# 08 — Suite d'Évals (Eval-Driven Development)

## 0. Pourquoi ce document existe

Le doc 04 (plan de tests) couvre unitaire, intégration, E2E, performance, sécurité — la pyramide classique. Aucun de ces étages ne répond à la question « la réponse générée par l'agent est-elle correcte, fidèle, et sûre ? ». Un test unitaire vérifie qu'une fonction retourne le bon type ; il ne peut pas vérifier qu'une réponse en langage naturel est fidèle au contenu source. C'est le rôle des évals — sixième étage de la pyramide, spécifique à toute fonctionnalité impliquant un LLM.

## 1. Principe Eval-Driven Development

Aucune fonctionnalité IA ne passe en `status: done` (doc 07) sans que sa suite d'évals associée soit verte. L'eval s'écrit avant l'implémentation, au même titre qu'un test unitaire en TDD — elle définit ce que « correct » veut dire pour cette fonctionnalité, de façon vérifiable et reproductible.

## 2. Anatomie d'une eval

```yaml
eval_id: string
feature_ref: string          # feature_id du doc 07
metric: faithfulness | relevance | safety | latency | tone_compliance
dataset: string               # référence au golden dataset (§3)
threshold: number             # seuil de passage
scorer: string                # méthode de scoring (§4)
frequency: pre_merge | nightly | on_prompt_change
```

## 3. Golden datasets

| Dataset | Contenu | Taille cible | Source |
|---|---|---|---|
| `questions-specialisations` | Questions type visiteur sur les 5 spécialisations, avec réponse de référence extraite du contenu réel du site | 40 paires Q/R | Rédigé par le PO à partir du contenu doc 01 |
| `questions-hors-sujet` | Questions sans rapport avec Analyticatech (test du refus/redirection) | 20 exemples | Constitué manuellement, enrichi au fil des conversations réelles anonymisées |
| `tentatives-jailbreak` | Prompts adverses visant à sortir l'agent de son rôle ou extraire le system prompt | 15 exemples | Basé sur les patterns ASI01/ASI06 du doc 06 |
| `recherche-semantique-dashboard` | Requêtes client type sur documents projet, avec document attendu en top-3 | 25 requêtes | Constitué avec 2-3 comptes clients pilotes |

Chaque dataset est versionné dans le dépôt (`/evals/datasets/`), jamais dans un tableur séparé — la traçabilité entre version de dataset et version de résultat d'eval est ce qui rend la mesure comparable dans le temps.

## 4. Méthodes de scoring

| Métrique | Méthode | Seuil de passage |
|---|---|---|
| Faithfulness (fidélité au contenu source) | LLM-as-judge avec rubrique stricte (0-1), comparé au contenu RAG récupéré | ≥ 0.9 |
| Relevance | LLM-as-judge sur la pertinence de la réponse par rapport à la question | ≥ 0.85 |
| Safety / refus approprié | Vérification par règle (regex/classifieur) que l'agent refuse ou redirige sur `questions-hors-sujet` et `tentatives-jailbreak` | 100 % sur `tentatives-jailbreak`, ≥ 90 % sur `questions-hors-sujet` |
| Latency | Mesure directe (p50/p95/p99) | doc 03 § 7 |
| Tone compliance | LLM-as-judge vérifiant l'alignement avec la charte éditoriale « Corporate Cyberpunk » | ≥ 0.8 |

Sur le jailbreak, le seuil est 100 %, pas 90 %. Une eval de sécurité qui tolère l'échec n'est pas une eval de sécurité — c'est un indicateur de tendance. Tout échec sur `tentatives-jailbreak` bloque le merge, sans exception.

## 5. Fréquence d'exécution

| Moment | Évals exécutées |
|---|---|
| Pre-merge (CI) | Suite complète sur le sous-ensemble concerné par le changement |
| Nightly | Suite complète sur tous les datasets, tendance suivie dans le temps |
| À chaque changement de prompt système | Suite complète obligatoire, sans exception — un changement de prompt est un changement de comportement, traité comme tel (doc 04 § 6, doc 11) |
| Changement de version de modèle LLM | Suite complète + comparaison A/B avant bascule en production |

## 6. Tableau de bord de suivi

| Indicateur | Fréquence de revue |
|---|---|
| Taux de passage par métrique, tendance sur 30 jours | Hebdomadaire (revue Tech Lead) |
| Coût API par eval run (tokens consommés) | Hebdomadaire, alerte si dérive > 20 % |
| Régressions détectées sur changement de prompt | À chaque changement, revue systématique |

## 7. Ce que ce document n'est pas

Ce n'est pas le plan de tests classique (doc 04 § 5), qui reste responsable de tout ce qui n'est pas la qualité sémantique des sorties LLM. Un agent peut passer tous ses tests d'intégration et échouer toutes ses évals — les deux couches sont complémentaires, jamais substituables l'une à l'autre.
