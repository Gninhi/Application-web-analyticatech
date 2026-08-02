"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Target, Eye, Heart, Users } from "lucide-react";
import type { ViewKey } from "@/lib/i18n/data-fr";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { MovingButton } from "@/components/interactive/MovingButton";
import { Logo } from "@/components/branding/Logo";

interface AboutViewProps {
  onNavigate: (view: ViewKey) => void;
}

const VALUE_ICONS: Record<string, any> = { Target, Eye, Heart, Users };

export function AboutView({ onNavigate }: AboutViewProps) {
  const { t } = useI18n();
  const { companyValues: DB_VALUES, metrics: DB_METRICS } = useAppContent();

  const VALUES = DB_VALUES.map((v) => ({
    icon: VALUE_ICONS[v.iconKey] || Target,
    title: v.title,
    description: v.description,
  }));

  const STATS = DB_METRICS.slice(0, 4).map((m) => ({ v: m.value, l: m.label }));

  return (
    <div className="pt-28 md:pt-36 pb-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* Retour */}
        <MovingButton
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("home")}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("legal.back")}
        </MovingButton>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <Logo size={64} delay={0.2} />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-[#F26D3D] tracking-tight mb-4">
            {t("about.title")}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t("about.desc")}
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">
              {t("about.mission.title")}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Rendre l'intelligence artificielle opérationnelle et souveraine pour les
              organisations européennes. Du POC à la production, nous transformons
              l'IA en avantage concurrentiel durable — avec précision, sécurité et
              impact mesurable.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">
              {t("about.vision.title")}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Un futur où chaque organisation maîtrise ses systèmes agentiques,
              où la donnée est un levier et non une contrainte, et où l'IA
              sert l'humain — pas l'inverse. Nous bâtissons cette souveraineté
              technologique, une mission à la fois.
            </p>
          </motion.div>
        </div>

        {/* Valeurs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8 text-center">
            {t("about.values.title")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 mb-4">
                  <value.icon className="h-6 w-6 text-[#F26D3D]" aria-hidden />
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-8 md:p-12 mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.l}>
                <p className="font-display text-3xl md:text-4xl font-bold text-[#F26D3D]">
                  {stat.v}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-2">
                  {stat.l}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <MovingButton
            variant="primary"
            size="lg"
            onClick={() => onNavigate("contact")}
            className="neon-glow"
          >
            {t("about.cta")}
          </MovingButton>
        </motion.div>
      </div>
    </div>
  );
}
