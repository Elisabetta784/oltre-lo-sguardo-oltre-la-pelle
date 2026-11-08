"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
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
 * Staggered text layers with offset horizontal/vertical positions and fading opacities using Alte Haas Grotesk.
 */
function KineticTypoEcho({ text, categoryLabel }: { text: string; categoryLabel?: string }) {
  return (
    <div className="relative py-1 overflow-hidden select-none">
      {/* Echo 3 - Faintest Ghost */}
      <motion.div
        key={`echo-3-${text}`}
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 0.12, x: 16 }}
        exit={{ opacity: 0, x: 8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black leading-none pointer-events-none absolute left-0 top-1 truncate max-w-full"
      >
        {text}
      </motion.div>

      {/* Echo 2 - Intermediate Ghost */}
      <motion.div
        key={`echo-2-${text}`}
        initial={{ opacity: 0, x: -3 }}
        animate={{ opacity: 0.28, x: 8 }}
        exit={{ opacity: 0, x: 5 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black leading-none pointer-events-none absolute left-0 top-1 truncate max-w-full"
      >
        {text}
      </motion.div>

      {/* Main Crisp Layer */}
      <motion.div
        key={`main-${text}`}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -3 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black leading-none truncate">
          {text}
        </h2>
        {categoryLabel && (
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="font-display text-[9px] uppercase tracking-widest text-black/70 font-bold">
              [{categoryLabel}]
            </span>
            <span className="w-3.5 h-[1px] bg-black/25" />
            <span className="font-display text-[8.5px] uppercase tracking-wider text-black/50 font-medium">
              FILTRO ATTIVO
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

  const [activeCategoryTab, setActiveCategoryTab] = useState<"all" | FilterCategoryId>("segno");

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
          {/* 1. Backdrop scrim: subtle click-outside dismiss without blocking vision */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onToggleOpen}
            className="fixed inset-0 z-30 bg-black/15 backdrop-blur-[0.5px]"
          />

          {/* 2. Vertical Panel Anchored to the Right Side (Directly Above FILTRI section on the bottom bar) */}
          <motion.aside
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-[56px] right-2 sm:right-6 z-40 w-[94vw] sm:w-[380px] max-h-[50vh] sm:max-h-[410px] h-[390px] bg-[#F8F8F6] border-2 border-black shadow-2xl shadow-black/35 flex flex-col justify-between select-none"
          >
            {/* A. HEADER */}
            <div className="p-2.5 sm:p-3 border-b-2 border-black bg-[#F8F8F6] flex flex-col gap-2 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-black" />
                  <span className="font-display font-bold text-xs uppercase tracking-wider text-black">
                    FILTRI ARCHIVIO
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onToggleOpen}
                  className="flex items-center gap-1 font-display text-[10px] font-bold text-black hover:opacity-70 uppercase tracking-widest cursor-pointer border border-black/30 px-2 py-0.5"
                >
                  <span>CHIUDI</span>
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Integrated Search Input (Alte Haas Grotesk) */}
              <div className="relative flex items-center border border-black bg-white px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-black transition-all">
                <Search className="w-3.5 h-3.5 text-black/50 mr-2 shrink-0 select-none" />
                <input
                  type="text"
                  placeholder="CERCA PER PAROLA, SEGNO O CASO..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  className="w-full bg-transparent font-display text-[11px] font-medium uppercase tracking-wider text-black placeholder-black/40 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange && onSearchChange("")}
                    title="Cancella ricerca"
                    className="ml-1 text-[10px] font-display font-bold text-black/60 hover:text-black cursor-pointer uppercase shrink-0"
                  >
                    [X]
                  </button>
                )}
              </div>

              {/* Status and Reset */}
              <div className="flex items-center justify-between font-display text-[10.5px] text-black">
                <span className="font-medium text-black/80">
                  {searchQuery.trim() !== "" ? (
                    <>RICERCA: &ldquo;{searchQuery.trim().toUpperCase()}&rdquo; [{filteredCount}]</>
                  ) : (
                    <>MOSTRATI: <strong className="font-display font-bold text-black">{filteredCount}</strong> / {totalItems} CASI</>
                  )}
                </span>

                {(totalActiveFilters > 0 || searchQuery.trim() !== "") && (
                  <button
                    type="button"
                    onClick={() => {
                      onResetFilters();
                      if (onSearchChange) onSearchChange("");
                      onHoverFilter(null);
                    }}
                    className="font-display text-[9.5px] font-bold uppercase tracking-wider text-black underline hover:opacity-70 cursor-pointer"
                  >
                    [ AZZERA FILTRI ]
                  </button>
                )}
              </div>
            </div>

            {/* B. CATEGORY TABS STRIP (Alte Haas Grotesk) */}
            <div className="px-2.5 py-1.5 border-b border-black/15 bg-black/5 flex items-center gap-1 overflow-x-auto custom-scrollbar shrink-0">
              {categoryKeys.map((catKey) => {
                const countInCat = selectedFilters[catKey].length;
                const isActive = activeCategoryTab === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setActiveCategoryTab(catKey)}
                    className={`font-display text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition-colors cursor-pointer shrink-0 border rounded-none ${
                      isActive
                        ? "bg-black text-[#F8F8F6] border-black font-bold shadow-xs"
                        : "border-black/20 text-black/70 hover:border-black hover:text-black bg-white"
                    }`}
                  >
                    {FILTER_CATEGORIES[catKey].label}
                    {countInCat > 0 && ` (${countInCat})`}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setActiveCategoryTab("all")}
                className={`font-display text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition-colors cursor-pointer shrink-0 border rounded-none ${
                  activeCategoryTab === "all"
                    ? "bg-black text-[#F8F8F6] border-black font-bold shadow-xs"
                    : "border-black/20 text-black/70 hover:border-black hover:text-black bg-white"
                }`}
              >
                TUTTE
              </button>
            </div>

            {/* C. SCROLLABLE VERTICAL OPTIONS LIST (Alte Haas Grotesk for titolotti and items) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 space-y-1">
              {activeCategoryTab === "all" ? (
                /* ALL CATEGORIES STACKED */
                categoryKeys.map((catKey) => {
                  const catDef = FILTER_CATEGORIES[catKey];
                  return (
                    <div key={catKey} className="mb-2.5">
                      <div className="font-display font-bold text-[10.5px] uppercase tracking-wider text-black mb-1 pb-0.5 border-b border-black/15 flex items-center justify-between">
                        <span>{catDef.label}</span>
                        <span className="font-display text-[9px] font-medium text-black/50">
                          {catDef.options.length} OPZIONI
                        </span>
                      </div>
                      <div className="space-y-0.5">
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
                              className={`flex items-center justify-between py-1.5 px-2 cursor-pointer font-display text-xs font-medium tracking-wider transition-all duration-150 border ${
                                isSelected
                                  ? "bg-black text-[#F8F8F6] font-bold border-black shadow-xs"
                                  : "border-transparent hover:border-black/30 hover:bg-black/5 text-black/85 hover:text-black"
                              }`}
                            >
                              <span className="truncate mr-2 font-display">
                                {isSelected ? `■ ${opt.toUpperCase()}` : `[ ${opt.toUpperCase()} ]`}
                              </span>
                              <span className={`font-display text-[10.5px] shrink-0 ${isSelected ? "text-[#F8F8F6]/80 font-bold" : "text-black/50 font-medium"}`}>
                                [ {count} ]
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* SINGLE CATEGORY OPTIONS */
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between pb-1 mb-1 border-b border-black/10">
                    <span className="font-display text-[10px] font-bold uppercase tracking-wider text-black/60">
                      SELEZIONA PER FILTRARE:
                    </span>
                    <span className="font-display text-[10px] font-bold text-black">
                      {FILTER_CATEGORIES[activeCategoryTab].options.length} OPZIONI
                    </span>
                  </div>
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
                        className={`flex items-center justify-between py-1.5 px-2 cursor-pointer font-display text-xs font-medium tracking-wider transition-all duration-150 border rounded-none ${
                          isSelected
                            ? "bg-black text-[#F8F8F6] font-bold border-black shadow-xs"
                            : "border-transparent hover:border-black/30 hover:bg-black/5 text-black/85 hover:text-black"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate mr-2 font-display">
                          <span className={isSelected ? "text-[#F8F8F6]/80" : "text-black/40"}>[</span>
                          <span className={`truncate ${isSelected ? "font-bold text-[#F8F8F6]" : ""}`}>
                            {isSelected ? `■ ${opt.toUpperCase()}` : opt.toUpperCase()}
                          </span>
                          <span className={isSelected ? "text-[#F8F8F6]/80" : "text-black/40"}>]</span>
                        </span>
                        <span className={`font-display text-[10.5px] shrink-0 ${isSelected ? "text-[#F8F8F6]/80 font-bold" : "text-black/50 font-medium"}`}>
                          [ {count} ]
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* D. BOTTOM KINETIC TYPOGRAPHY ECHO (inspo filtri.png with Alte Haas Grotesk) */}
            <div className="p-2 sm:p-2.5 border-t-2 border-black bg-[#F2F2EF] shrink-0">
              <KineticTypoEcho
                text={currentEchoText}
                categoryLabel={currentEchoCat}
              />
              <div className="mt-0.5 font-display text-[8.5px] uppercase tracking-wider text-black/45 flex items-center justify-between font-medium">
                <span>[ REAZIONE IN TEMPO REALE SULLA PARETE ]</span>
                <span>[ ALTE HAAS GROTESK ]</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
