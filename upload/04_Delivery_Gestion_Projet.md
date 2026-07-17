> Statut : Validé · Dernière révision : juillet 2026

# 04 — Gestion de Projet & Delivery

## 1. Roadmap — phases

Cadrage → Discovery/UX → Architecture → Sprints de delivery (8 sprints, S1-S16) → Tests/UAT → Lancement (Q4 2026). Les sprints 4 (dashboard/recherche sémantique) et 6 (chatbot) dépendent explicitement de la brique « Infrastructure IA » (doc 03 § 3) et de la validation du doc 06 — cette dépendance conditionne le démarrage effectif de la partie IA de ces deux sprints.

## 2. Backlog priorisé (MoSCoW)

| Priorité | Item | Dépendance |
|---|---|---|
| Must | Formulaire de contact sécurisé | — |
| Must | Design system & pages statiques | — |
| Should | Dashboard client + recherche sémantique | Infrastructure IA (doc 03 § 3) livrée avant le début du sprint ; spec exécutable (doc 07) à rédiger |
| Should | Chatbot IA | Orchestration agentique (doc 06) et garde-fous ASI validés avant mise en production |
| Could | Notifications, blog SEO avancé | — |
| Won't (cette itération) | Personnalisation multi-tenant avancée | — |

## 3. Sprint planning — synthèse

8 sprints de 2 semaines (S1-S16). Les sprints 4 et 6 ne démarrent leur partie IA que si le gate d'architecture (doc 03 § 3) et le gate d'eval (doc 08) sont au vert — critère explicite de la Definition of Ready pour ces deux sprints.

## 4. Definition of Ready / Definition of Done

**DoR :** user story priorisée, critères d'acceptation écrits, maquette validée, dépendances techniques identifiées. Pour toute story impliquant un agent ou un LLM : une spec exécutable au format doc 07 existe et est passée en statut `approved`, avec des critères d'acceptation exprimés sous forme évaluable (doc 08) — pas seulement une description fonctionnelle.

**DoD :** code revu, tests passants, déployé en staging, accessibilité vérifiée. Pour toute fonctionnalité IA : la suite d'évals correspondante (doc 08) est verte avant merge en production, au même titre que les tests unitaires.

## 5. Plan de tests

Pyramide de tests (unitaires → intégration → E2E → performance → sécurité) complétée d'un sixième étage pour tout composant IA : les évals d'agents (doc 08). Ce n'est pas un remplacement des tests classiques mais une couche supplémentaire — un test unitaire ne vérifie pas la qualité sémantique d'une réponse générée.

## 6. Stratégie CI/CD et DevOps

Pipeline GitHub Actions, environnements et promotion, feature flags, stratégie de rollback, monitoring de déploiement. Les modifications de prompts système ou de configuration d'agent passent par le même pipeline de revue que le code — versionnées, testées, jamais éditées directement en production (doc 11).
