"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, Check } from "lucide-react";
import {
  FILTER_CATEGORIES,
  FilterCategoryId,
  ARCHIVE_ITEMS,
} from "@/data/archiveData";

export interface SelectedFiltersState {
  segno: string[];
  tipologia: string[];
  tono: string[];
  tipoDiMedia: string[];
  categorie: string[];
}

export const INITIAL_FILTERS: SelectedFiltersState = {
  segno: [],
  tipologia: [],
  tono: [],
  tipoDiMedia: [],
  categorie: [],
};

interface FilterSidebarProps {
  selectedFilters: SelectedFiltersState;
  onToggleFilter: (category: FilterCategoryId, value: string) => void;
  onResetFilters: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  totalItems: number;
  filteredCount: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  hoveredFilter: { category: FilterCategoryId; value: string; label: string } | null;
  onHoverFilter: (filter: { category: FilterCategoryId; value: string; label: string } | null) => void;
}

/**
 * Kinetic Typographic Echo component recreating the exact visual movement in inspo filtri.png:
 * Staggered text layers with offset horizontal/vertical positions and fading opacities.
 */
function KineticTypoEcho({ text, categoryLabel }: { text: string; categoryLabel?: string }) {
  return (
    <div className="relative py-2 overflow-hidden select-none">
      {/* Echo 3 - Faintest Ghost */}
      <motion.div
        key={`echo-3-${text}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 0.12, x: 26 }}
        exit={{ opacity: 0, x: 15 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="font-display font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight text-black leading-none pointer-events-none absolute left-0 top-2 truncate max-w-full"
      >
        {text}
      </motion.div>

      {/* Echo 2 - Intermediate Ghost */}
      <motion.div
        key={`echo-2-${text}`}
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 0.3, x: 12 }}
        exit={{ opacity: 0, x: 8 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="font-display font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight text-black leading-none pointer-events-none absolute left-0 top-2 truncate max-w-full"
      >
        {text}
      </motion.div>

      {/* Main Crisp Layer */}
      <motion.div
        key={`main-${text}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight text-black leading-none truncate">
          {text}
        </h2>
        {categoryLabel && (
          <div className="mt-1 flex items-center gap-2">
            <span className="font-body text-[10px] uppercase tracking-widest text-black/60 font-semibold">
              [{categoryLabel}]
            </span>
            <span className="w-6 h-[1px] bg-black/20" />
            <span className="font-body text-[9px] uppercase tracking-wider text-black/45">
              FILTRO ARCHIVIO ATTIVO
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function FilterSidebar({
  selectedFilters,
  onToggleFilter,
  onResetFilters,
  searchQuery = "",
  onSearchChange,
  totalItems,
  filteredCount,
  isOpen,
  onToggleOpen,
  hoveredFilter,
  onHoverFilter,
}: FilterSidebarProps) {
  const categoryKeys: FilterCategoryId[] = [
    "segno",
    "tipologia",
    "tono",
    "tipoDiMedia",
    "categorie",
  ];

  // "all" displays the 5 horizontal columns side-by-side; or filter to a single category
  const [activeCategoryTab, setActiveCategoryTab] = useState<"all" | FilterCategoryId>("all");

  const totalActiveFilters = Object.values(selectedFilters).reduce(
    (acc, arr) => acc + arr.length,
    0
  );

  const getOptionCount = (category: FilterCategoryId, opt: string): number => {
    const optLower = opt.toLowerCase();
    return ARCHIVE_ITEMS.filter((item) => {
      if (category === "segno") {
        return (
          item.segno.toLowerCase().includes(optLower) ||
          (item.segnoTags && item.segnoTags.some((t) => t.toLowerCase() === optLower))
        );
      }
      if (category === "tipologia") {
        return item.tipologia.toLowerCase().includes(optLower);
      }
      if (category === "tono") {
        return item.tono.toLowerCase() === optLower;
      }
      if (category === "tipoDiMedia") {
        return item.tipoDiMedia.toLowerCase().includes(optLower);
      }
      if (category === "categorie") {
        return (
          item.categorie.toLowerCase().includes(optLower) ||
          (item.clusterTags && item.clusterTags.some((t) => t.toLowerCase() === optLower))
        );
      }
      return false;
    }).length;
  };

  // Find a representative active label for kinetic echo preview
  const currentEchoText = hoveredFilter
    ? hoveredFilter.value
    : totalActiveFilters > 0
    ? Object.entries(selectedFilters).find(([, vals]) => vals.length > 0)?.[1][0] || "FILTRI ATTIVI"
    : "TUTTI I SEGNI";

  const currentEchoCat = hoveredFilter
    ? FILTER_CATEGORIES[hoveredFilter.category].label
    : totalActiveFilters > 0
    ? "SELEZIONE ATTIVA"
    : "ARCHIVIO CORPOREO";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Backdrop scrim - click outside to dismiss */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onToggleOpen}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px]"
          />

          {/* 2. Horizontal Filter Console Opening From Bottom */}
          <motion.aside
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#F8F8F6] border-t-2 border-black shadow-2xl flex flex-col h-[54vh] sm:h-[48vh] max-h-[85vh] select-none"
          >
            {/* A. DRAWER HEADER STRIP */}
            <div className="w-full px-4 sm:px-8 py-3 border-b-2 border-black bg-[#F8F8F6] flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* Left: Title + Integrated Search Input */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-black" />
                  <span className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-black whitespace-nowrap">
                    FILTRI ARCHIVIO
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative flex items-center border border-black bg-white px-2.5 py-1 focus-within:ring-1 focus-within:ring-black transition-all w-52 sm:w-72">
                  <Search className="w-3.5 h-3.5 text-black/50 mr-2 shrink-0 select-none" />
                  <input
                    type="text"
                    placeholder="CERCA PER PAROLA, SEGNO O CASO..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    className="w-full bg-transparent font-body text-[11px] uppercase tracking-wider text-black placeholder-black/40 outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange && onSearchChange("")}
                      title="Cancella ricerca"
                      className="ml-1 text-[10px] font-body text-black/60 hover:text-black cursor-pointer uppercase shrink-0 font-bold"
                    >
                      [X]
                    </button>
                  )}
                </div>
              </div>

              {/* Center: Status & Quick Reset */}
              <div className="flex items-center gap-3">
                <span className="font-body text-[11px] text-black/70 uppercase tracking-wider">
                  MOSTRATI: <strong className="text-black font-display font-bold">{filteredCount}</strong> / {totalItems} CASI
                </span>

                {(totalActiveFilters > 0 || searchQuery.trim() !== "") && (
                  <button
                    type="button"
                    onClick={() => {
                      onResetFilters();
                      if (onSearchChange) onSearchChange("");
                      onHoverFilter(null);
                    }}
                    className="flex items-center gap-1 font-display text-[10px] sm:text-[11px] font-bold text-black uppercase tracking-wider cursor-pointer border border-black px-2.5 py-1 bg-white hover:bg-black hover:text-white transition-colors"
                  >
                    <span>[ AZZERA FILTRI ]</span>
                  </button>
                )}
              </div>

              {/* Right: View mode tabs + Close Button */}
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                {/* Horizontal Category Switcher */}
                <div className="hidden md:flex items-center gap-1 border border-black/20 p-0.5 bg-black/5">
                  <button
                    type="button"
                    onClick={() => setActiveCategoryTab("all")}
                    className={`font-display text-[10px] px-2 py-0.5 uppercase tracking-wider transition-colors cursor-pointer ${
                      activeCategoryTab === "all"
                        ? "bg-black text-[#F8F8F6] font-bold shadow-xs"
                        : "text-black/70 hover:text-black hover:bg-black/10"
                    }`}
                  >
                    TUTTE [ORIZZONTALE]
                  </button>
                  {categoryKeys.map((catKey) => {
                    const countInCat = selectedFilters[catKey].length;
                    return (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setActiveCategoryTab(catKey)}
                        className={`font-display text-[10px] px-2 py-0.5 uppercase tracking-wider transition-colors cursor-pointer ${
                          activeCategoryTab === catKey
                            ? "bg-black text-[#F8F8F6] font-bold shadow-xs"
                            : "text-black/70 hover:text-black hover:bg-black/10"
                        }`}
                      >
                        {FILTER_CATEGORIES[catKey].label}
                        {countInCat > 0 && ` (${countInCat})`}
                      </button>
                    );
                  })}
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onToggleOpen}
                  className="flex items-center gap-1 font-display text-xs font-bold text-[#F8F8F6] bg-black hover:bg-black/85 px-3 py-1.5 uppercase tracking-widest cursor-pointer transition-colors shadow-sm"
                >
                  <span>CHIUDI</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* B. DRAWER HORIZONTAL BODY */}
            <div className="flex-1 w-full overflow-hidden flex flex-row items-stretch">
              {activeCategoryTab === "all" ? (
                /* 5 HORIZONTAL COLUMNS SIDE-BY-SIDE + KINETIC ECHO COLUMN */
                <div className="flex-1 w-full overflow-x-auto overflow-y-hidden custom-scrollbar flex flex-row items-stretch divide-x-2 divide-black">
                  {categoryKeys.map((catKey) => {
                    const catDef = FILTER_CATEGORIES[catKey];
                    const activeInCat = selectedFilters[catKey].length;

                    return (
                      <div
                        key={catKey}
                        className="w-[240px] sm:w-[270px] lg:w-[290px] shrink-0 flex flex-col justify-between p-3.5 sm:p-4 bg-[#F8F8F6]"
                      >
                        {/* Column Header */}
                        <div className="pb-2 mb-2 border-b border-black/20 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-bold text-xs uppercase tracking-wider text-black">
                              {catDef.label}
                            </span>
                            {activeInCat > 0 && (
                              <span className="bg-black text-[#F8F8F6] font-display text-[9px] font-bold px-1.5 py-0.2">
                                {activeInCat}
                              </span>
                            )}
                          </div>
                          <span className="font-body text-[9px] uppercase tracking-wider text-black/40">
                            {catDef.options.length} OPZIONI
                          </span>
                        </div>

                        {/* Column Scrollable Options List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                          {catDef.options.map((opt) => {
                            const isSelected = selectedFilters[catKey].includes(opt);
                            const count = getOptionCount(catKey, opt);

                            return (
                              <div
                                key={opt}
                                onClick={() => onToggleFilter(catKey, opt)}
                                onMouseEnter={() =>
                                  onHoverFilter({
                                    category: catKey,
                                    value: opt,
                                    label: `${opt.toUpperCase()} (${catDef.label})`,
                                  })
                                }
                                onMouseLeave={() => onHoverFilter(null)}
                                className={`flex items-center justify-between py-1.5 px-2 cursor-pointer font-body text-xs tracking-wider transition-all duration-150 group border rounded-none ${
                                  isSelected
                                    ? "bg-black text-[#F8F8F6] font-bold border-black shadow-xs"
                                    : "border-transparent hover:border-black/30 hover:bg-black/5 text-black/85 hover:text-black"
                                }`}
                              >
                                <span className="flex items-center gap-1.5 transition-transform duration-150 group-hover:translate-x-1 truncate mr-2">
                                  <span className={isSelected ? "text-[#F8F8F6]/80" : "text-black/50"}>[</span>
                                  <span className={`truncate ${isSelected ? "font-bold text-[#F8F8F6]" : ""}`}>
                                    {isSelected ? `■ ${opt.toUpperCase()}` : opt.toUpperCase()}
                                  </span>
                                  <span className={isSelected ? "text-[#F8F8F6]/80" : "text-black/50"}>]</span>
                                </span>
                                <span
                                  className={`font-body text-[11px] shrink-0 ${
                                    isSelected ? "text-[#F8F8F6]/80 font-semibold" : "text-black/50"
                                  }`}
                                >
                                  [ {count} ]
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* 6. Kinetic Typographic Echo Preview Column (inspo filtri.png) */}
                  <div className="w-[280px] sm:w-[320px] shrink-0 p-4 sm:p-5 flex flex-col justify-between bg-[#F2F2EF]">
                    <div>
                      <div className="font-display font-bold text-[10px] text-black/60 uppercase tracking-widest pb-1 border-b border-black/15">
                        ANTEPRIMA HOVER & ATTIVO
                      </div>
                      <div className="mt-4">
                        <KineticTypoEcho
                          text={currentEchoText}
                          categoryLabel={currentEchoCat}
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-black/15">
                      <div className="font-body text-[9px] uppercase tracking-wider text-black/50">
                        [ REAZIONE IN TEMPO REALE SULLA PARETE VISIVA ]
                      </div>
                      <div className="mt-1 font-body text-[8px] uppercase tracking-wider text-black/35">
                        [ SPRING TO FIND PICTURES WHERE THERE ARE NO HORNS ]
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* SINGLE CATEGORY EXPANDED HORIZONTAL GRID */
                <div className="flex-1 w-full p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-black">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-sm sm:text-base uppercase tracking-wider text-black">
                          {FILTER_CATEGORIES[activeCategoryTab].label}
                        </span>
                        <span className="font-body text-xs text-black/50">
                          ({FILTER_CATEGORIES[activeCategoryTab].options.length} OPZIONI DISPONIBILI)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveCategoryTab("all")}
                        className="font-display text-[11px] font-bold text-black uppercase tracking-wider underline cursor-pointer"
                      >
                        ← MOSTRA TUTTE LE CATEGORIE
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {FILTER_CATEGORIES[activeCategoryTab].options.map((opt) => {
                        const isSelected = selectedFilters[activeCategoryTab].includes(opt);
                        const count = getOptionCount(activeCategoryTab, opt);

                        return (
                          <div
                            key={opt}
                            onClick={() => onToggleFilter(activeCategoryTab, opt)}
                            onMouseEnter={() =>
                              onHoverFilter({
                                category: activeCategoryTab,
                                value: opt,
                                label: `${opt.toUpperCase()} (${FILTER_CATEGORIES[activeCategoryTab].label})`,
                              })
                            }
                            onMouseLeave={() => onHoverFilter(null)}
                            className={`flex items-center justify-between py-2 px-2.5 cursor-pointer font-body text-xs tracking-wider transition-all duration-150 group border ${
                              isSelected
                                ? "bg-black text-[#F8F8F6] font-bold border-black shadow-xs"
                                : "border-black/20 hover:border-black hover:bg-black/5 text-black"
                            }`}
                          >
                            <span className="truncate mr-1 font-medium">
                              {isSelected ? `■ ${opt.toUpperCase()}` : opt.toUpperCase()}
                            </span>
                            <span className={`text-[10px] shrink-0 ${isSelected ? "text-[#F8F8F6]/80" : "text-black/50"}`}>
                              [{count}]
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/15 flex items-center justify-between mt-3">
                    <KineticTypoEcho
                      text={currentEchoText}
                      categoryLabel={currentEchoCat}
                    />
                    <div className="font-body text-[9px] uppercase tracking-wider text-black/40 hidden sm:block">
                      [ SELEZIONA PER FILTRARE LE OPERE DELL&apos;ARCHIVIO ]
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
