"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Clock, User, Hash, Newspaper } from "lucide-react";
import {
  BLOG_POSTS,
  BLOG_CATEGORIES,
  type BlogCategory,
  type BlogPost,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type Filter = BlogCategory | "Tous";

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  IA: "text-[#F26D3D] border-[#F26D3D]/40 bg-[#F26D3D]/10",
  Automatisation: "text-[#4CAF50] border-[#4CAF50]/40 bg-[#4CAF50]/10",
  BI: "text-sky-300 border-sky-300/40 bg-sky-300/10",
  Architecture: "text-violet-300 border-violet-300/40 bg-violet-300/10",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BlogView() {
  const [filter, setFilter] = useState<Filter>("Tous");

  const filtered = useMemo<BlogPost[]>(() => {
    if (filter === "Tous") return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <div className="relative">
      {/* En-tête */}
      <section className="pt-32 md:pt-40 pb-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-3">
              {"// Insights — Technical Reports"}
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-slate-50 tracking-tight mb-4">
              Rapports techniques &amp;
              <br />
              <span className="text-gradient-accent">retours de terrain</span>
            </h1>
            <p className="text-slate-400 leading-relaxed text-lg">
              Nos architectes partagent leurs analyses : patterns de production,
              choix d&apos;outillage et leçons apprises sur les missions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filtres */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div
            className="flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label="Filtrer par catégorie"
          >
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={filter === cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all",
                  filter === cat
                    ? "border-[#F26D3D] bg-[#F26D3D] text-white"
                    : "border-white/15 text-slate-400 hover:border-white/40 hover:text-slate-200"
                )}
              >
                {cat === "Tous" ? "Tous les rapports" : cat}
              </button>
            ))}
            <span className="ml-auto font-mono text-[11px] uppercase tracking-widest text-slate-500">
              {filtered.length} entrée{filtered.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* Grille d'articles */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((post) => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group glass rounded-2xl overflow-hidden flex flex-col hover:border-[#F26D3D]/30 transition-colors cursor-pointer"
                >
                  {/* Visuel "rapport technique" avec motifs */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#022859] to-[#011C40]">
                    <div
                      className="absolute inset-0 opacity-25"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(242,109,61,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(242,109,61,0.2) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                      aria-hidden
                    />
                    {/* Métadonnées type terminal */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between font-mono text-[10px] text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5 uppercase tracking-widest text-[#F26D3D]">
                          {post.category}
                        </span>
                        <span className="text-slate-500">REPORT_{post.id.slice(0, 6).toUpperCase()}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="flex items-center gap-1.5"><Clock className="h-3 w-3" aria-hidden /> {post.readingTime}</p>
                        <p className="flex items-center gap-1.5"><User className="h-3 w-3" aria-hidden /> {post.author}</p>
                      </div>
                    </div>
                    {/* Icône décorative */}
                    <Newspaper className="absolute right-3 top-3 h-4 w-4 text-[#F26D3D]/40" aria-hidden />
                  </div>

                  {/* Corps */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                      {formatDate(post.date)}
                    </p>
                    <h3 className="font-display text-lg font-bold text-slate-50 mb-2 leading-snug group-hover:text-[#F26D3D] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-0.5 rounded-md border border-white/10 bg-black/20 px-1.5 py-0.5 font-mono text-[9px] text-slate-400"
                        >
                          <Hash className="h-2.5 w-2.5" aria-hidden />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest",
                          CATEGORY_COLORS[post.category]
                        )}
                      >
                        {post.category}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-[#F26D3D] transition-colors">
                        Lire
                        <ArrowUpRight className="h-3 w-3" aria-hidden />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-mono text-sm text-slate-500 uppercase tracking-widest">
                Aucun rapport dans cette catégorie.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
