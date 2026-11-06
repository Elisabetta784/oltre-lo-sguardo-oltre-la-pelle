"use client";

import { useState } from "react";
import { Terminal, Copy, Check, ExternalLink, ArrowRight, GitBranch } from "lucide-react";

export function DeployGuide() {
  const [copied, setCopied] = useState(false);

  const command = "npx vercel";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="deploy" className="py-20 px-4 sm:px-6 relative">
      <div className="mx-auto max-w-5xl">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          {/* Ambient blur */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/15 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Guida Rapida al Deploy
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Pronto per il deploy su Vercel in 60 secondi
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mb-8 leading-relaxed">
              Il repository include già tutte le configurazioni native per Vercel. Scegli
              il metodo che preferisci per andare online.
            </p>

            {/* Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Option A: CLI */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
                    <Terminal className="h-4 w-4 text-indigo-400" />
                    Opzione 1: Vercel CLI (Istantaneo)
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                    Esegui il comando dalla cartella del progetto per effettuare il deploy direttamente da terminale:
                  </p>
                </div>

                <div className="flex items-center justify-between bg-black/60 rounded-xl px-3.5 py-2.5 border border-white/10">
                  <code className="text-xs text-indigo-300 font-mono">
                    {command}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-1 text-zinc-400 hover:text-white transition-colors"
                    title="Copia comando"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Option B: Git Push */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
                    <GitBranch className="h-4 w-4 text-purple-400" />
                    Opzione 2: Git Repository + Dashboard Vercel
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                    Carica il progetto su un repository GitHub o GitLab e importalo dalla dashboard di Vercel per abilitare deploy continui ad ogni commit.
                  </p>
                </div>

                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-white text-zinc-950 font-semibold text-xs py-2.5 hover:bg-zinc-200 transition-colors"
                >
                  Importa su Vercel Dashboard
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Steps bullet */}
            <div className="border-t border-white/10 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-400">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold">1</span>
                  <span><strong>Zero Config</strong>: Next.js viene rilevato in automatico senza build command custom.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold">2</span>
                  <span><strong>Edge Speed</strong>: Assets statici e bundle distribuiti su CDN globale.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold">3</span>
                  <span><strong>Preview URLs</strong>: Ogni branch ottiene un link di anteprima unico e condivisibile.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
