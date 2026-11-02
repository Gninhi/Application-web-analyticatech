# Registre des informations publiées — analyticatech.fr

Dernière revue : 2 novembre 2026. Ce registre recense chaque information factuelle ou engageante publiée sur le site, sa source et son statut.
Toute nouvelle affirmation doit y être ajoutée avant publication. Le test `src/lib/content/content-charter.test.ts` bloque les formulations interdites ; il ne remplace pas ce registre.

Statuts : **Vérifié** (source primaire consultée) · **Déclaratif** (fourni par le fondateur, à justifier sur demande) · **À valider** (décision humaine attendue) · **Retiré**.

## 1. Identité de l'entreprise

| Information | Valeur publiée | Où | Source | Statut |
|---|---|---|---|---|
| Raison sociale, forme | Analyticatech, SAS | Mentions légales, JSON-LD | Annuaire des entreprises (recherche-entreprises.api.gouv.fr), SIREN 984 609 198 | Vérifié |
| SIREN / SIRET | 984 609 198 / 984 609 198 00010 | Mentions légales, JSON-LD | Idem | Vérifié |
| Date de création | 13/02/2024 | JSON-LD (`foundingDate`) | Idem | Vérifié |
| Siège social | 60 rue François 1er, 75008 Paris | Mentions légales, contact, pied de page, JSON-LD, llms.txt | Idem (un seul établissement) | Vérifié |
| Code NAF | 62.02A | Mentions légales | Idem | Vérifié |
| Président, directeur de publication | Martial GNINHI | Mentions légales, JSON-LD, articles | Idem | Vérifié |
| Capital social | 1 000,00 € | Mentions légales | Non présent dans l'API publique | À valider (extrait Kbis) |
| TVA intracommunautaire | FR96984609198 | Mentions légales, JSON-LD | VIES (Commission européenne), consulté le 02/11/2026 : valide, « SAS ANALYTICATECH, 60 rue François 1er » | Vérifié |
| Effectif | « Le fondateur, interlocuteur unique » | Accueil, contact, solutions | Annuaire : tranche « NN » (aucun salarié) | Vérifié |
| Bureau à Strasbourg | — | — | Absent du registre (un seul établissement) | Retiré |
| Téléphone, e-mail | +33 7 68 61 13 10 · contact@analyticatech.fr | Contact, mentions, llms.txt | Fournis par le fondateur | Déclaratif |
| LinkedIn | linkedin.com/company/102606877 | JSON-LD (`sameAs`), llms.txt | `src/lib/content/site.ts` | À valider (page active ?) |
| Parcours : diplôme de niveau 7 (RNCP) en IA | Page À propos | `src/locales/*/about.json` | Fondateur | Déclaratif (garder le justificatif) |

## 2. Engagements commerciaux (`src/data/commitments.ts`)

| Engagement | Valeur | Statut |
|---|---|---|
| Réponse personnelle | Sous 2 jours ouvrés | À valider (choix proposé le 02/11/2026) |
| Premier échange | 20 minutes, gratuit | Déclaratif |
| Proposition écrite | Sous 5 jours ouvrés après l'échange | À valider |
| Disponibilité | 9h30 – 17h30, lun–ven, heure de Paris | Déclaratif |
| NDA avant échange sensible | « Je signe un accord de confidentialité » | Déclaratif |
| Durées indicatives de la méthode | Cadrage 1–2 sem., prototype 4–6 sem., production 6–8 sem. | Déclaratif (indicatif, affiché comme tel) |

Retirés : « accusé de réception < 2 h », « réponse d'un architecte < 24 h », « feuille de route sous 72 h », « appel de 30 minutes ».

## 3. Projets (page Solutions — `src/lib/content/solutions-detail-data.ts`)

| Projet | Statut publié | Source | Statut |
|---|---|---|---|
| Ciblioo | En développement, pilote prévu avec un cabinet (non nommé), non commercialisé | Dépôt privé `Gninhi/Ciblioo`, dossier `refondation/` (roadmap L0–L2 livrés, L3 en cours) | Vérifié au 02/11/2026 |
| Connecteurs DINUM et BODACC actifs | Fiche Ciblioo | `refondation/06_ETAT_DEPOT_MATRICE_CODE_DOC.md` | Vérifié |
| ContentOps Harness | Prototype fonctionnel, testé en environnement de test, code public | Dépôt public `Gninhi/Content-builder` (connecteurs LinkedIn/X en sandbox) | Vérifié |
| AVIE | Outil interne, code public | Dépôt public `Gninhi/viiper-v4` | Vérifié |
| Pilotage commercial, prévision de la demande, veille BODACC | « Piste à construire », rien de construit | — | Déclaratif (la piste BODACC est une proposition à valider) |
| DealScope | Fusionné dans Ciblioo (redirection) | Dépôt `Gninhi/Dealscope` (avril 2026) | Vérifié |

Retirés : fiches conformité bancaire, santé, maintenance industrielle, énergie, et tous leurs indicateurs.

## 4. Cas réel publié

| Information | Où | Statut |
|---|---|---|
| Audit d'une architecture multi-agents : 3 semaines, 7 redondances de logique, client anonymisé | Accueil (« Cas réel »), fiche service 03 | Déclaratif — **conserver l'accord écrit du client** autorisant la publication anonymisée |

## 5. Conformité, sécurité et hébergement

| Affirmation | Où | Source | Statut |
|---|---|---|---|
| Site hébergé par Vercel Inc. (États-Unis) | Mentions, confidentialité | Projet Vercel `application-web-analyticatech` | Vérifié |
| Demandes stockées chez Supabase, UE (Francfort) | Mentions, confidentialité | Hôte `aws-1-eu-central-1.pooler.supabase.com` | Vérifié |
| E-mails de notification via Resend (États-Unis) | Confidentialité | `RESEND_API_KEY` présente sur Vercel | Vérifié |
| PostHog (UE) uniquement après consentement | Confidentialité, bandeau cookies | Code `instrumentation-client.ts` ; **clé absente en production** | Vérifié (outil inactif à ce jour) |
| Conservation des demandes : 3 ans après le dernier échange | Confidentialité, contact | Recommandation CNIL prospects | À valider — **aucune purge automatique n'existe encore** |
| Hébergeur qualifié SecNumCloud « possible si le contexte l'exige » | FAQ service 01, llms.txt | Analyticatech n'est ni qualifiée ni certifiée | Formulation conditionnelle conservée |
| Pas de délégué à la protection des données désigné | Confidentialité | Constat | Vérifié |
| Entraînement IA refusé, indexation autorisée | Mentions légales, `robots.ts` | Choix proposé le 02/11/2026 | À valider |

## 6. Contenus retirés pour défaut de preuve (historique)

« 48+ missions », « 35 % de coûts réduits », « 99,9 % d'uptime », « 4,9/5 satisfaction C-level », « 94,2 % de précision », « -65 % », témoignages clients, logos clients, auteurs fictifs (T. Nguyen, L. Marchand, C. Roth, S. Benali), « nos architectes », « équipe dédiée », « certifié SecNumCloud / ISO 27001 / SOC 2 », « garantie mathématique », dates d'articles antérieures à leur publication, article FinOps.
