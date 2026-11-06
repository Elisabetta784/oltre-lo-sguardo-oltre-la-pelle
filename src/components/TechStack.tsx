"use client";

import { 
  Cpu, 
  Palette, 
  Workflow, 
  Globe2, 
  Sparkles, 
  Gauge, 
  Check, 
  ArrowRight 
} from "lucide-react";

const STACK_ITEMS = [
  {
    icon: Cpu,
    color: "from-blue-500 to-indigo-500",
    name: "Next.js 16 (App Router & Turbopack)",
    role: "Core Framework",
    description:
      "La scelta naturale e nativa per Vercel. Server Components, static generation ad alte prestazioni, streaming SSR e bundling istantaneo con Turbopack.",
    benefits: ["Zero-config deploy su Vercel", "SEO & OpenGraph dinamico", "React 19 support"],
  },
  {
    icon: Palette,
    color: "from-cyan-500 to-blue-500",
    name: "Tailwind CSS v4",
    role: "Styling & Design Tokens",
    description:
      "Il nuovo motore CSS nativo lightning-fast. Fornisce token colore moderni, glassmorphism, gradienti mesh e zero overhead a runtime.",
    benefits: ["Nessun CSS inutile in bundle", "Design system scalabile", "Ottimizzato per Dark Mode"],
  },
  {
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    name: "Framer Motion & Lenis",
    role: "Motion & Smooth Scroll",
    description:
      "Il gold standard per siti web con design d'eccellenza (Awwwards/FWA level). Micro-animazioni cinematiche fluide a 60 FPS e scrolling inerziale.",
    benefits: ["Transizioni fluide tra elementi", "Scroll inerziale cinematografico", "Interazioni touch naturali"],
  },
  {
    icon: Globe2,
    color: "from-emerald-500 to-teal-500",
    name: "Vercel Edge Network",
    role: "Deployment & CDN",
    description:
      "Infrastruttura globale distribuita con compressione Brotli/Gzip automatica, Image Optimization integrata e preview automatiche per ogni git commit.",
    benefits: ["Deploy con 1 comando o Git Push", "Cache edge globale <50ms", "Certificati SSL automatici"],
  },
];

export function TechStack() {
  return (
    <section id="stack" className="py-20 px-4 sm:px-6 relative bg-white/[0.01]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            Architettura &amp; Scelte Tecniche
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Lo Stack Tecnologico Definitivo
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Ogni componente è stato selezionato per garantire massima resa visiva,
            tempi di caricamento istantanei e perfetta sinergia con la piattaforma Vercel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STACK_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel-interactive rounded-2xl p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-5">
                    <div
                      className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-indigo-300 block">
                        {item.role}
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="text-xs font-semibold text-zinc-300 mb-2.5">
                    Punti di forza:
                  </div>
                  <ul className="space-y-1.5">
                    {item.benefits.map((b, bIdx) => (
                      <li
                        key={bIdx}
                        className="text-xs text-zinc-400 flex items-center gap-2"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
