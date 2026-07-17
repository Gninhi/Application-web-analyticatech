> Statut : Validé · Dernière révision : juillet 2026

# 05 — Gouvernance & Amélioration Continue

## 1. Matrice RACI

| Activité | PO | Tech Lead | Frontend | Backend | UX | DevOps | QA | Stakeholders |
|---|---|---|---|---|---|---|---|---|
| Définition Vision/Objectifs | R | C | I | I | C | I | I | C |
| Gestion Backlog Produit | R | C | I | I | C | I | I | C |
| Conception UX/UI | A | I | I | I | R | I | C | C |
| Développement Frontend | I | A | R | I | C | I | C | I |
| Développement Backend | I | A | I | R | I | R | C | I |
| Intégration CI/CD | I | A | C | C | I | R | C | I |
| Tests | I | C | C | C | I | I | R | I |
| Gestion Infra/Sécurité | I | C | I | C | I | R | I | I |
| Communication/Reporting | R | I | I | I | I | I | I | C |
| Validation Livrables | A | C | I | I | C | I | C | R |
| Mise en Production | A | R | I | I | I | R | I | I |
| Maintenance/Support | C | A | R | R | I | R | C | I |
| Orchestration & agents IA | C | A | I | R | I | R | C | I |

## 2. Plan de communication

Rituels agiles (daily, sprint review, rétrospective), reporting et dashboards, communication stakeholders, outils de collaboration, escalade et résolution de conflits.

## 3. Gestion des risques

Identification, matrice probabilité/impact, plans de mitigation et de contingence, suivi et revue.

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Dérive de coût des appels API LLM (chatbot, recherche sémantique) | Moyenne | Moyen-Élevé | Budget de tokens par fonctionnalité, alerting sur seuil, doc 08 pour le monitoring d'usage |
| Hallucination ou réponse inappropriée du chatbot en production | Moyenne | Élevé (image de marque) | Suite d'évals obligatoire avant mise en production (doc 08), garde-fous ASI (doc 06) |

## 4. Plan de maintenance et évolution

SLA, gestion des dépendances, roadmap post-lancement, dette technique — incluant explicitement la dérive de prompts (prompt drift) et l'obsolescence de modèles comme catégorie de dette à part entière, revue au même rythme que les dépendances logicielles classiques.

## 5. Stratégie SEO & Growth

Audit technique, stratégie de contenu, mots-clés par spécialisation — le socle SEO éditorial classique. Le volet recherche agentique (GEO/AEO), la stack de tracking et la boucle d'amélioration continue sont traités en doc 13, qui étend cette section sans la remplacer.

## Références

Voir doc 13 pour les sources spécifiques au volet GEO/AEO et analytics.
