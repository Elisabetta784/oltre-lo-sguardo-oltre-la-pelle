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
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#F8F8F6]/95 backdrop-blur-md border-b border-black/10 px-4 sm:px-6 h-[52px] select-none">
      <div className="w-full h-full flex items-center justify-between text-xs sm:text-[13px] tracking-wider uppercase font-body">
        {/* Left: OLTRE, MACRO, MICRO */}
        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          <button
            type="button"
            onClick={() => onSelectView("beyond")}
            className={`cursor-pointer transition-all duration-150 font-display ${
              currentView === "beyond"
                ? "text-black font-bold underline underline-offset-6 decoration-black decoration-2"
                : "text-black/40 hover:text-black font-normal"
            }`}
          >
            OLTRE
          </button>

          <button
            type="button"
            onClick={() => onSelectView("macro")}
            className={`cursor-pointer transition-all duration-150 font-display ${
              currentView === "macro"
                ? "text-black font-bold underline underline-offset-6 decoration-black decoration-2"
                : "text-black/40 hover:text-black font-normal"
            }`}
          >
            MACRO
          </button>

          <button
            type="button"
            onClick={() => onSelectView("micro")}
            className={`cursor-pointer transition-all duration-150 font-display ${
              currentView === "micro"
                ? "text-black font-bold underline underline-offset-6 decoration-black decoration-2"
                : "text-black/40 hover:text-black font-normal"
            }`}
          >
            MICRO
          </button>
        </div>

        {/* Right: Clean minimal count / status */}
        <div className="flex items-center justify-end flex-shrink-0 font-body text-[10px] sm:text-[11px] text-black/50 tracking-wider">
          <span>76 CASI STUDIO</span>
        </div>
      </div>
    </header>
  );
}
