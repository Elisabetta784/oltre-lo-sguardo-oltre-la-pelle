"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, ArrowRight } from "lucide-react";
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
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 0.12, x: 38 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-black leading-none pointer-events-none absolute left-0 top-2"
      >
        {text}
      </motion.div>

      {/* Echo 2 - Intermediate Ghost */}
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 0.32, x: 18 }}
        exit={{ opacity: 0, x: 12 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-black leading-none pointer-events-none absolute left-0 top-2"
      >
        {text}
      </motion.div>

      {/* Main Crisp Layer */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-black leading-none">
          {text}
        </h2>
        {categoryLabel && (
          <div className="mt-1 flex items-center gap-2">
            <span className="font-body text-[10px] uppercase tracking-widest text-black/60 font-semibold">
              [{categoryLabel}]
            </span>
            <span className="w-8 h-[1px] bg-black/20" />
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

  const [activeCategoryTab, setActiveCategoryTab] = useState<FilterCategoryId>("segno");
  const [viewAllCategories, setViewAllCategories] = useState(false);

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

  // Find a representative active label for bottom kinetic echo
  const currentEchoText = hoveredFilter
    ? hoveredFilter.value
    : totalActiveFilters > 0
    ? Object.entries(selectedFilters).find(([, vals]) => vals.length > 0)?.[1][0] || "FILTRI"
    : "TUTTI I SEGNI";

  const currentEchoCat = hoveredFilter
    ? FILTER_CATEGORIES[hoveredFilter.category].label
    : totalActiveFilters > 0
    ? "SELEZIONE ATTIVA"
    : "ARCHIVIO CORPOREO";

  return (
    <>
      {/* 1. MINIMAL TAB TOGGLE BUTTON WHEN SIDEBAR IS CLOSED - STRICTLY ONLY AT THE TOP */}
      {!isOpen && (
        <button
          type="button"
          onClick={onToggleOpen}
          className="fixed left-0 top-[68px] z-30 bg-black text-[#F8F8F6] px-3.5 py-2 font-display text-[11px] font-bold tracking-widest uppercase cursor-pointer hover:bg-black/85 transition-colors border-r border-t border-b border-black shadow-md flex items-center gap-2"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>FILTRI {totalActiveFilters > 0 && `[${totalActiveFilters}]`}</span>
        </button>
      )}

      {/* 2. MAIN SIDEBAR CONTAINER */}
      <aside
        className={`fixed top-[52px] left-0 bottom-0 z-40 w-full sm:w-[380px] lg:w-[420px] bg-[#F8F8F6] border-r-2 border-black transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none shadow-2xl flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full h-full flex flex-col justify-between p-5 sm:p-7">
          {/* TOP BAR */}
          <div className="flex flex-col gap-2.5 border-b-2 border-black pb-4">
            <div className="flex items-center justify-between font-body text-[10px] text-black/60 uppercase tracking-wider">
              <span>ARCHIVIO / SEGNI E TESTIMONIANZE</span>
              <button
                type="button"
                onClick={onToggleOpen}
                className="hover:text-black cursor-pointer font-bold flex items-center gap-1 p-0.5"
              >
                <span>[ CHIUDI</span>
                <X className="w-3 h-3" />
                <span>]</span>
              </button>
            </div>

            {/* RESET / ALL SIGNS ROW */}
            <div
              onClick={() => {
                onResetFilters();
                if (onSearchChange) onSearchChange("");
                onHoverFilter(null);
              }}
              className="flex items-center justify-between py-1.5 font-display text-sm tracking-wide uppercase cursor-pointer group text-black hover:opacity-75 transition-opacity"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span>[</span>
                <span className="group-hover:tracking-wider transition-all">
                  MOSTRA TUTTI I CASI
                </span>
                <span>]</span>
              </div>
              <span className="font-body text-xs text-black/60">
                [ {totalItems} ]
              </span>
            </div>

            {/* SEARCH INPUT BAR */}
            <div className="relative my-1 flex items-center border border-black bg-white px-3 py-2 focus-within:ring-1 focus-within:ring-black transition-all">
              <Search className="w-3.5 h-3.5 text-black/50 mr-2 shrink-0 select-none" />
              <input
                type="text"
                placeholder="CERCA PER PAROLA O CASO..."
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
                  [ X ]
                </button>
              )}
            </div>

            {/* Active filters status */}
            {(totalActiveFilters > 0 || searchQuery.trim() !== "") && (
              <div className="flex items-center justify-between pt-1 font-body text-[10px] text-black">
                <span className="font-semibold text-black/80">
                  {searchQuery.trim() !== "" ? (
                    <>
                      RICERCA: &ldquo;{searchQuery.trim().toUpperCase()}&rdquo; [{filteredCount}]
                    </>
                  ) : (
                    <>FILTRI ATTIVI: {totalActiveFilters} [{filteredCount} CASI]</>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onResetFilters();
                    if (onSearchChange) onSearchChange("");
                  }}
                  className="hover:underline cursor-pointer uppercase tracking-wider font-bold"
                >
                  [ AZZERA ]
                </button>
              </div>
            )}
          </div>

          {/* CATEGORY TABS */}
          <div className="py-3 border-b border-black/15">
            <div className="flex items-center justify-between mb-2 font-body text-[10px] text-black/60 uppercase tracking-wider">
              <span>CATEGORIE:</span>
              <button
                type="button"
                onClick={() => setViewAllCategories(!viewAllCategories)}
                className="text-[9px] hover:text-black cursor-pointer uppercase underline font-semibold"
              >
                {viewAllCategories ? "[ PER TAB ]" : "[ MOSTRA TUTTI ]"}
              </button>
            </div>

            {!viewAllCategories && (
              <div className="flex flex-wrap gap-1.5">
                {categoryKeys.map((catKey) => {
                  const catDef = FILTER_CATEGORIES[catKey];
                  const isTabActive = activeCategoryTab === catKey;
                  const activeInCat = selectedFilters[catKey].length;

                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setActiveCategoryTab(catKey)}
                      className={`font-display text-[10px] sm:text-[11px] px-2.5 py-1 transition-all duration-150 uppercase tracking-wider cursor-pointer border rounded-none ${
                        isTabActive
                          ? "bg-black text-[#F8F8F6] border-black font-bold"
                          : "border-black/20 text-black hover:border-black hover:bg-black/5"
                      }`}
                    >
                      {catDef.label}
                      {activeInCat > 0 && ` (${activeInCat})`}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* MAIN LIST OF FILTER OPTIONS */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-3 space-y-1.5">
            {viewAllCategories ? (
              categoryKeys.map((catKey) => {
                const catDef = FILTER_CATEGORIES[catKey];
                return (
                  <div key={catKey} className="mb-4">
                    <div className="font-display text-[11px] font-bold text-black uppercase tracking-wider mb-1.5 border-b border-black/15 pb-0.5">
                      {catDef.label} —
                    </div>
                    <div className="space-y-1">
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
                            className={`flex items-center justify-between py-1 px-1.5 cursor-pointer font-body text-xs tracking-wider transition-all duration-150 group border border-transparent hover:border-black/20 ${
                              isSelected
                                ? "bg-black text-[#F8F8F6] font-bold border-black"
                                : "text-black/85 hover:text-black hover:bg-black/5"
                            }`}
                          >
                            <span className="flex items-center gap-1.5 transition-transform duration-150 group-hover:translate-x-1">
                              <span>[</span>
                              <span className={isSelected ? "font-bold text-[#F8F8F6]" : ""}>
                                {isSelected ? `■ ${opt.toUpperCase()}` : opt.toUpperCase()}
                              </span>
                              <span>]</span>
                            </span>
                            <span className={`font-body text-xs ${isSelected ? "text-[#F8F8F6]/80" : "text-black/50"}`}>
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
              <div className="space-y-1">
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
                      className={`flex items-center justify-between py-1.5 px-2 cursor-pointer font-body text-xs sm:text-[13px] tracking-wider transition-all duration-150 group border ${
                        isSelected
                          ? "bg-black text-[#F8F8F6] font-bold border-black"
                          : "border-transparent hover:border-black/30 hover:bg-black/5 text-black/85 hover:text-black"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 transition-transform duration-150 group-hover:translate-x-1.5">
                        <span className={isSelected ? "text-[#F8F8F6]/80" : "text-black/50"}>[</span>
                        <span className={isSelected ? "font-bold text-[#F8F8F6]" : ""}>
                          {isSelected ? `■ ${opt.toUpperCase()}` : opt.toUpperCase()}
                        </span>
                        <span className={isSelected ? "text-[#F8F8F6]/80" : "text-black/50"}>]</span>
                      </span>
                      <span className={`font-body text-xs ${isSelected ? "text-[#F8F8F6]/80" : "text-black/50"}`}>
                        [ {count} ]
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* BOTTOM KINETIC TYPOGRAPHY ECHO (Direct implementation of inspo filtri.png) */}
          <div className="pt-3 border-t-2 border-black min-h-[90px] flex flex-col justify-end">
            <KineticTypoEcho
              text={currentEchoText}
              categoryLabel={currentEchoCat}
            />
            {/* Subtle editorial caption matching filtri.png */}
            <div className="mt-1 font-body text-[9px] uppercase tracking-wider text-black/45">
              [ SPRING TO FIND PICTURES WHERE THERE ARE NO HORNS ]
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
