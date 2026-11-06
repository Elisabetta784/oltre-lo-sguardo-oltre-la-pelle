"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Layers, ArrowUpRight, Search, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel flex h-14 items-center justify-between rounded-2xl px-4 sm:px-6 border border-white/10 shadow-lg shadow-black/20">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-white text-base">
              Archivio <span className="text-indigo-400">Sintesi</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="#esplora"
              className="text-zinc-400 hover:text-white transition-colors duration-150"
            >
              Archivio
            </Link>
            <Link
              href="#stack"
              className="text-zinc-400 hover:text-white transition-colors duration-150"
            >
              Tecnologie
            </Link>
            <Link
              href="#caratteristiche"
              className="text-zinc-400 hover:text-white transition-colors duration-150"
            >
              Caratteristiche
            </Link>
            <Link
              href="#deploy"
              className="text-zinc-400 hover:text-white transition-colors duration-150"
            >
              Deploy Vercel
            </Link>
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Vercel Ready
            </div>
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white text-zinc-950 px-3.5 py-1.5 text-xs font-semibold shadow hover:bg-zinc-200 transition-colors"
            >
              Deploy
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-1.5 text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="glass-panel mt-2 rounded-2xl p-4 flex flex-col gap-3 md:hidden border border-white/10 animate-in fade-in slide-in-from-top-2">
            <Link
              href="#esplora"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm py-1.5 text-zinc-300 hover:text-white"
            >
              Archivio
            </Link>
            <Link
              href="#stack"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm py-1.5 text-zinc-300 hover:text-white"
            >
              Tecnologie
            </Link>
            <Link
              href="#caratteristiche"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm py-1.5 text-zinc-300 hover:text-white"
            >
              Caratteristiche
            </Link>
            <Link
              href="#deploy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm py-1.5 text-zinc-300 hover:text-white"
            >
              Deploy Vercel
            </Link>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Vercel Ready
              </span>
              <a
                href="https://vercel.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold bg-white text-black px-3 py-1.5 rounded-lg"
              >
                Deploy Now
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
