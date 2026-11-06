"use client";

import { useState } from "react";
import { Search, Tag, Clock, ArrowUpRight, BookOpen, Filter, CheckCircle2 } from "lucide-react";

interface SynthesisItem {
  id: string;
  title: string;
  category: "Design System" | "Architettura" | "Performance" | "AI & Product";
  summary: string;
  readingTime: string;
  updatedAt: string;
  tags: string[];
}

const SAMPLE_DATA: SynthesisItem[] = [
  {
    id: "1",
    title: "Design System & Micro-interazioni 2026",
    category: "Design System",
    summary:
      "Principi di composizione tipografica, palette dark-luxury e animazioni fluide con Framer Motion e Tailwind v4.",
    readingTime: "4 min",
    updatedAt: "Settembre 2026",
    tags: ["UI/UX", "Tailwind", "Motion"],
  },
  {
    id: "2",
    title: "Serverless & Edge Rendering su Vercel",
    category: "Architettura",
    summary:
      "Ottimizzazione delle route App Router, caching ISR intelligente e distribuzione a bassa latenza su CDN globale.",
    readingTime: "6 min",
    updatedAt: "Settembre 2026",
    tags: ["Next.js", "Edge", "Vercel"],
  },
  {
    id: "3",
    title: "Lighthouse 100/100: Core Web Vitals",
    category: "Performance",
    summary:
      "Guida pratica per azzerare LCP, INP e CLS attraverso next/font, bundling Turbopack e pre-fetching granulare.",
    readingTime: "5 min",
    updatedAt: "Agosto 2026",
    tags: ["Performance", "Turbopack", "SEO"],
  },
  {
    id: "4",
    title: "Integrazione AI per Sintesi Automatica",
    category: "AI & Product",
    summary:
      "Pattern di estrazione e riassunto automatico per documenti complessi con streaming UI in tempo reale.",
    readingTime: "7 min",
    updatedAt: "Settembre 2026",
    tags: ["AI", "Streaming", "Synthesis"],
  },
];

const CATEGORIES = ["Tutti", "Design System", "Architettura", "Performance", "AI & Product"] as const;

export function ArchivePreview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tutti");
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const filteredItems = SAMPLE_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === "Tutti" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="esplora" className="py-20 px-4 sm:px-6 relative">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
              Catalogo &amp; Sintesi
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Esplora l&apos;Archivio
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-xl">
              Filtra e consulta le schede di sintesi con ricerca in tempo reale e categorizzazione dinamica.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Cerca per titolo, tag o argomento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "glass-panel text-zinc-400 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => {
            const isSelected = activeCard === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveCard(isSelected ? null : item.id)}
                className={`glass-panel-interactive rounded-2xl p-6 cursor-pointer relative group flex flex-col justify-between ${
                  isSelected ? "ring-2 ring-indigo-500/50 bg-[#151828]" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                      <BookOpen className="h-3 w-3" />
                      {item.category}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Clock className="h-3.5 w-3.5" />
                      {item.readingTime}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs font-medium text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Dettagli</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="glass-panel text-center py-16 px-4 rounded-2xl">
            <p className="text-zinc-400 text-sm">Nessuna sintesi trovata per &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Tutti");
              }}
              className="mt-3 text-xs text-indigo-400 hover:underline"
            >
              Ripristina filtri
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
