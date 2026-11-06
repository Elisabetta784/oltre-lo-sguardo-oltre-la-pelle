"use client";

import React from "react";

interface HeaderNavProps {
  currentView: "beyond" | "macro" | "micro";
  onSelectView: (view: "beyond" | "macro" | "micro") => void;
}

export function HeaderNav({
  currentView,
  onSelectView,
}: HeaderNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#f5f0e0] border-b border-[#88562C]/25 px-4 sm:px-6 h-[52px] select-none">
      <div className="w-full h-full flex items-center justify-between text-xs sm:text-[13px] tracking-wider uppercase font-mono-text">
        {/* Left: BEYOND, MACRO, MICRO */}
        <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
          <button
            type="button"
            onClick={() => onSelectView("beyond")}
            className={`cursor-pointer transition-all duration-150 ${
              currentView === "beyond"
                ? "text-[#523719] font-bold underline underline-offset-4 decoration-[#c026d3]"
                : "text-[#523719]/50 hover:text-[#523719]"
            }`}
          >
            BEYOND
          </button>

          <button
            type="button"
            onClick={() => onSelectView("macro")}
            className={`cursor-pointer transition-all duration-150 ${
              currentView === "macro"
                ? "text-[#523719] font-bold underline underline-offset-4 decoration-[#88562C]"
                : "text-[#523719]/50 hover:text-[#523719]"
            }`}
          >
            MACRO
          </button>

          <button
            type="button"
            onClick={() => onSelectView("micro")}
            className={`cursor-pointer transition-all duration-150 ${
              currentView === "micro"
                ? "text-[#523719] font-bold underline underline-offset-4 decoration-[#88562C]"
                : "text-[#523719]/50 hover:text-[#523719]"
            }`}
          >
            MICRO
          </button>
        </div>

        {/* Center: Title & Subtitle */}
        <div className="flex items-center gap-3 sm:gap-6 text-center px-2 truncate">
          <span className="font-display font-bold text-xs sm:text-sm text-[#523719] tracking-tight">
            I SEGNI DELLA PELLE
          </span>
          <span className="hidden md:inline w-6 h-[1px] bg-[#88562C]/30" />
          <span className="hidden sm:inline font-mono-text text-[11px] sm:text-xs text-[#88562C] tracking-widest uppercase">
            EVERY BODY HAS A STORY
          </span>
        </div>

        {/* Right: Balanced Spacer */}
        <div className="flex items-center justify-end flex-shrink-0 w-24 sm:w-48" />
      </div>
    </header>
  );
}
