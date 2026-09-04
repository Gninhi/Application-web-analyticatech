"use client";

import {
  ArrowLeft,
  Building2,
  Server,
  ShieldCheck,
  Mail,
  Scale,
  Lock,
  ExternalLink,
  FileCheck,
} from "lucide-react";
import type { ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactCta } from "@/components/ui/ContactCta";
import { SectionContainer } from "@/components/ui/SectionContainer";

interface MentionsLegalesViewProps {
  onNavigate: (view: ViewKey) => void;
}

/**
 * MentionsLegalesView — Page officielle des mentions légales conforme à l'article 6-III de la LCEN.
 * Spécifiquement structurée pour une activité de conseil en systèmes, IA et ingénierie de données en France.
 */
export function MentionsLegalesView({ onNavigate }: MentionsLegalesViewProps) {
  const { t, locale } = useI18n();

  return (
    <div className="pt-28 md:pt-36 pb-20">
      <SectionContainer maxWidth="4xl">
        {/* Bouton retour */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("home")}
          icon={<ArrowLeft className="h-4 w-4" aria-hidden />}
          className="mb-8"
        >
          {t("legal.back")}
        </Button>

        {/* En-tête de page */}
        <div className="mb-10">
          <PageHeader
            icon={Scale}
            kicker="RÉGLEMENTATION & TRANSPARENCE"
            title="Mentions Légales"
            size="md"
          />
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span>
              {t("legal.lastUpdated")}{" "}
              {new Date().toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="hidden md:inline">•</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#F26D3D]">
              <FileCheck className="h-3.5 w-3.5" aria-hidden />
              Article 6-III de la loi n° 2004-575 (LCEN)
            </span>
          </div>

          <p className="mt-4 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Conformément aux dispositions de l&apos;article 6-III de la loi n° 2004-575 du 21 juin 2004
            pour la confiance dans l&apos;économie numérique (LCEN), les présentes mentions légales
            définissent l&apos;identité de l&apos;éditeur, les conditions d&apos;hébergement du site,
            le régime de propriété intellectuelle ainsi que les moyens de contact effectifs relatifs à
            l&apos;activité de conseil exercée par Analyticatech.
          </p>
        </div>

        {/* Corps des 4 sections obligatoires */}
        <div className="space-y-8">
          {/* ========================================================================= */}
          {/* 1. ÉDITEUR DU SITE */}
          {/* ========================================================================= */}
          <section
            id="editeur"
            className="glass-card rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 shrink-0">
                <Building2 className="h-5 w-5 text-[#F26D3D]" aria-hidden />
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#F26D3D]">
                  Section 1 • Article 6-III-1 a & b
                </span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">
                  1. Éditeur du site
                </h2>
              </div>
            </div>

            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Le site internet accessible à l&apos;adresse{" "}
              <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                https://analyticatech.fr
              </span>{" "}
              est édité et exploité par la société suivante :
            </p>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Dénomination sociale / Nom commercial
                </dt>
                <dd className="font-display font-bold text-base text-slate-900 dark:text-slate-50">
                  Analyticatech
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Forme juridique
                </dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">
                  Société par actions simplifiée (SAS)
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Capital social
                </dt>
                <dd className="font-mono font-medium text-slate-900 dark:text-slate-100">
                  1 000,00 €
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Adresse du siège social réel
                </dt>
                <dd className="text-slate-900 dark:text-slate-100">
                  60 rue François 1er, 75008 Paris, France
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Numéro SIREN
                </dt>
                <dd className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  984 609 198
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Numéro SIRET (siège)
                </dt>
                <dd className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  984 609 198 00010
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  RCS (Registre du Commerce et des Sociétés)
                </dt>
                <dd className="text-slate-900 dark:text-slate-100">
                  Immatriculée au R.C.S. de Paris sous le n° 984 609 198
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Numéro de TVA intracommunautaire
                </dt>
                <dd className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  FR96984609198
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4 md:col-span-2">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Directeur de la publication
                </dt>
                <dd className="text-slate-900 dark:text-slate-100 font-medium">
                  Martial GNINHI, en sa qualité de Président de la SAS
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4 md:col-span-2">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Activité exercée & Code NAF/APE
                </dt>
                <dd className="text-slate-900 dark:text-slate-100">
                  Conseil en systèmes et logiciels informatiques —{" "}
                  <span className="font-mono text-xs font-semibold text-[#F26D3D]">
                    Code NAF/APE : 62.02A
                  </span>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Prestations de conseil en architecture d&apos;intelligence artificielle (LLM, RAG,
                    systèmes multi-agents), automatisation de processus d&apos;entreprise et valorisation
                    des données décisionnelles.
                  </p>
                </dd>
              </div>
            </dl>
          </section>

          {/* ========================================================================= */}
          {/* 2. HÉBERGEUR DU SITE WEB (DISTINCT DES DONNÉES CLIENTS) */}
          {/* ========================================================================= */}
          <section
            id="hebergeur"
            className="glass-card rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 shrink-0">
                <Server className="h-5 w-5 text-[#F26D3D]" aria-hidden />
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#F26D3D]">
                  Section 2 • Article 6-III-1 d
                </span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">
                  2. Hébergeur du site web
                </h2>
              </div>
            </div>

            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
              A. Hébergement de la plateforme web vitrine (analyticatech.fr)
            </h3>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              La diffusion et l&apos;hébergement technique du présent site internet public sont assurés par :
            </p>

            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Nom de l&apos;hébergeur
                </dt>
                <dd className="font-display font-semibold text-slate-900 dark:text-slate-50">
                  Hostinger
                  <span className="block text-xs font-normal text-slate-500 dark:text-slate-400 mt-1">
                    Hostinger International Ltd.
                  </span>
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Adresse du siège
                </dt>
                <dd className="text-slate-900 dark:text-slate-100">
                  61 Lordou Vironos Street, 6023 Larnaca, Chypre
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Contact & Assistance
                </dt>
                <dd className="text-slate-900 dark:text-slate-100">
                  <a
                    href="https://www.hostinger.fr/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#F26D3D] hover:underline"
                  >
                    hostinger.fr/contact
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </dd>
              </div>
            </dl>

            {/* Encadré d'importance majeure : distinction avec les données clients */}
            <div className="rounded-2xl p-5 md:p-6 bg-gradient-to-br from-[#F26D3D]/10 via-[#F26D3D]/5 to-transparent border border-[#F26D3D]/30">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F26D3D]/20 text-[#F26D3D] shrink-0 mt-0.5">
                  <Lock className="h-4 w-4" aria-hidden />
                </span>
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-sm md:text-base text-slate-900 dark:text-slate-50">
                    B. Distinction essentielle : hébergement web vs données clients en mission
                  </h4>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    L&apos;hébergeur web susmentionné (Hostinger) intervient exclusivement dans le cadre de la
                    délivrance technique des pages publiques, scripts statiques et contenus institutionnels du
                    présent site vitrine.
                  </p>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    Cet hébergement est strictement étanche et distinct des infrastructures cloud, environnements
                    d&apos;exécution, bases de données vectorielles et pipelines de données exploités dans le cadre
                    des prestations de conseil et des solutions d&apos;intelligence artificielle développées pour
                    nos entreprises clientes :
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-slate-600 dark:text-slate-300 pl-1">
                    <li>
                      <strong className="text-slate-900 dark:text-slate-100">Infrastructures clientes dédiées :</strong>{" "}
                      Les flux de données sensibles sont traités soit directement au sein des tenants et clouds privés
                      de nos clients (VPC, On-Premise, Azure, AWS, GCP sécurisés), soit sur des environnements
                      infonuagiques souverains européens qualifiés SecNumCloud / ISO 27001 / SOC 2 choisis en concertation.
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-slate-100">Garanties contractuelles (DPA & NDA) :</strong>{" "}
                      Chaque mission de conseil fait l&apos;objet d&apos;un accord contractuel rigoureux de traitement
                      des données (Data Processing Agreement), d&apos;accords de confidentialité réciproques et d&apos;un
                      engagement absolu de non-réutilisation des données pour l&apos;entraînement de modèles tiers.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 3. PROPRIÉTÉ INTELLECTUELLE */}
          {/* ========================================================================= */}
          <section
            id="propriete-intellectuelle"
            className="glass-card rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 shrink-0">
                <ShieldCheck className="h-5 w-5 text-[#F26D3D]" aria-hidden />
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#F26D3D]">
                  Section 3 • Code de la Propriété Intellectuelle
                </span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">
                  3. Propriété intellectuelle
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                L&apos;ensemble des éléments composant le présent site web (incluant, sans s&apos;y limiter,
                l&apos;architecture générale, l&apos;arborescence, les textes, articles de recherche, études de cas,
                composants interactifs, visualisations de graphes, codes sources, maquettes, chartes graphiques,
                logotypes, dénominations, icônes, animations, photographies et bases de données) est la propriété
                exclusive d&apos;Analyticatech ou fait l&apos;objet d&apos;une licence ou d&apos;un droit d&apos;exploitation
                régulièrement concédé.
              </p>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4 space-y-2">
                <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Protection au titre des articles L. 111-1 et suivants du CPI
                </h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                  Toute reproduction, représentation, adaptation, modification, traduction, diffusion, intégration
                  dans un autre site, extraction substantielle ou exploitation commerciale, totale ou partielle, de
                  l&apos;un quelconque de ces éléments, par quelque procédé que ce soit, sans l&apos;accord écrit préalable
                  d&apos;Analyticatech, est formellement interdite. Elle est constitutive de contrefaçon sanctionnée par
                  les articles L. 335-2 et suivants du Code de la Propriété Intellectuelle.
                </p>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4 space-y-2">
                <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Extraction automatisée & Fouille de textes et de données (TDM / AI Scraping Opt-out)
                </h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                  Conformément à l&apos;article L. 122-5-3 du Code de la Propriété Intellectuelle, Analyticatech
                  s&apos;oppose expressément à toute extraction, aspiration ou réutilisation automatisée de ses contenus
                  à des fins de fouille de textes et de données (Text and Data Mining), ainsi qu&apos;à toute utilisation
                  visant l&apos;entraînement, le fine-tuning ou l&apos;évaluation de modèles d&apos;intelligence
                  artificielle tiers non autorisés.
                </p>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4 space-y-2">
                <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Marques tierces et livrables de conseil
                </h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                  Les marques, logotypes et dénominations de frameworks, modèles ou partenaires tiers (tels que
                  LangChain, n8n, OpenAI, Anthropic, Mistral AI, Microsoft, Google Cloud, PostgreSQL, etc.) cités à
                  titre de référence technique demeurent la propriété exclusive de leurs détenteurs respectifs.
                  Leur mention n&apos;implique aucune affiliation exclusive ni cession de droits.
                </p>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                  Les droits de propriété intellectuelle afférents aux développements spécifiques, architectures sur
                  mesure et livrables créés pour nos clients dans le cadre de nos missions de conseil sont régis
                  exclusivement par les contrats et devis signés entre les parties.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 4. CONTACT */}
          {/* ========================================================================= */}
          <section
            id="contact"
            className="glass-card rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 shrink-0">
                <Mail className="h-5 w-5 text-[#F26D3D]" aria-hidden />
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#F26D3D]">
                  Section 4 • Coordonnées effectives
                </span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">
                  4. Contact
                </h2>
              </div>
            </div>

            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Pour toute question d&apos;ordre réglementaire, demande d&apos;information relative à nos prestations
              de conseil en intelligence artificielle ou notification formelle, vous pouvez joindre Analyticatech
              via les canaux suivants :
            </p>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Courrier électronique
                </dt>
                <dd>
                  <a
                    href="mailto:contact@analyticatech.fr"
                    className="font-mono font-medium text-slate-900 dark:text-slate-50 hover:text-[#F26D3D] transition-colors"
                  >
                    contact@analyticatech.fr
                  </a>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Réponse sous 24 à 48 heures ouvrées
                  </span>
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Ligne téléphonique directe
                </dt>
                <dd>
                  <a
                    href="tel:+33768611310"
                    className="font-mono font-medium text-slate-900 dark:text-slate-50 hover:text-[#F26D3D] transition-colors"
                  >
                    +33 7 68 61 13 10
                  </a>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Du lundi au vendredi, 9h00 - 18h30 (CET)
                  </span>
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Adresse postale du siège réel
                </dt>
                <dd className="text-slate-900 dark:text-slate-100">
                  Analyticatech SAS — 60 rue François 1er, 75008 Paris, France
                </dd>
              </div>

              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Formulaire sécurisé en ligne
                </dt>
                <dd>
                  <button
                    type="button"
                    onClick={() => onNavigate("contact")}
                    className="inline-flex items-center gap-1.5 text-[#F26D3D] hover:underline font-medium"
                  >
                    Accéder à la page /contact
                    <ArrowLeft className="h-3.5 w-3.5 rotate-180" aria-hidden />
                  </button>
                </dd>
              </div>
            </dl>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong className="text-slate-700 dark:text-slate-300">Droit applicable et juridiction :</strong>{" "}
              Les présentes mentions légales sont régies par le droit français. En cas de contestation ou de litige
              relatif à la validité, l&apos;interprétation ou l&apos;exécution des présentes, et à défaut de résolution
              amiable, les tribunaux compétents du ressort de la Cour d&apos;appel de Paris seront seuls compétents.
            </div>
          </section>
        </div>

        {/* CTA Contact en bas de page */}
        <ContactCta
          question={t("legal.contact.question")}
          cta={t("legal.contact.cta")}
          onNavigate={onNavigate}
          size="md"
          glow={false}
          withIcon={false}
          className="mt-10"
          delay={0.25}
        />
      </SectionContainer>
    </div>
  );
}
