import Link from "next/link";
import { Layers, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 py-12 px-4 sm:px-6 relative bg-black/40">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
            <Layers className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-semibold text-white text-sm">
            Archivio Sintesi
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs text-zinc-400">Design System &amp; Repository</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Next.js Docs
          </a>
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Tailwind CSS
          </a>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Vercel Platform
          </a>
        </div>

        <div className="text-xs text-zinc-500">
          Archivio Sintesi © {new Date().getFullYear()} — Ready for Vercel
        </div>
      </div>
    </footer>
  );
}
