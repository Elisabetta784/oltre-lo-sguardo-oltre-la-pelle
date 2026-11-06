"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Terminal, Zap, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-950/40 px-4 py-1.5 text-xs sm:text-sm font-medium text-indigo-300 shadow-inner backdrop-blur-md mb-8"
        >
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span>Next.js 16 • Tailwind CSS v4 • Framer Motion</span>
          <span className="hidden sm:inline text-indigo-400/40">|</span>
          <span className="hidden sm:inline text-indigo-200">Zero-Config Vercel</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
        >
          L&apos;archivio digitale <br />
          <span className="text-gradient-accent">con design ad alto livello</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 mb-10 leading-relaxed"
        >
          Uno stack all&apos;avanguardia progettato per sintesi, cataloghi e documentazione.
          Esperienza visiva fluida a 60 FPS, micro-interazioni curate e deploy istantaneo
          su Vercel.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="#esplora"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3.5 text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:scale-[1.02]"
          >
            Esplora Archivio
            <ArrowRight className="h-4 w-4" />
          </a>

          <a
            href="#deploy"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white px-7 py-3.5 text-sm font-medium backdrop-blur transition-all duration-200"
          >
            <Terminal className="h-4 w-4 text-zinc-400" />
            Guida al Deploy
          </a>
        </motion.div>

        {/* Highlight Stats / Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/5"
        >
          <div className="glass-panel p-4 rounded-xl text-left">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Velocità</span>
            </div>
            <div className="text-xl font-bold text-white">Turbopack</div>
            <div className="text-xs text-zinc-400">Build ultra-rapide</div>
          </div>

          <div className="glass-panel p-4 rounded-xl text-left">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Animazioni</span>
            </div>
            <div className="text-xl font-bold text-white">60 FPS</div>
            <div className="text-xs text-zinc-400">Framer Motion & Lenis</div>
          </div>

          <div className="glass-panel p-4 rounded-xl text-left">
            <div className="flex items-center gap-2 text-sky-400 mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Architettura</span>
            </div>
            <div className="text-xl font-bold text-white">Next.js App Router</div>
            <div className="text-xs text-zinc-400">Server & Client comp.</div>
          </div>

          <div className="glass-panel p-4 rounded-xl text-left">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Hosting</span>
            </div>
            <div className="text-xl font-bold text-white">Edge Vercel</div>
            <div className="text-xs text-zinc-400">CDN globale istantanea</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
