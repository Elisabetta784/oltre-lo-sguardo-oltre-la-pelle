"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import {
  FILTER_CATEGORIES,
  FilterCategoryId,
  ARCHIVE_ITEMS,
  AMBITI_TEORICI,
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

export const FILTER_PREVIEW_IMAGES: Record<string, string> = {
  // Segno
  "Smagliatura": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80",
  "Ustioni da acido": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80",
  "Ustioni da fuoco": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80",
  "Cicatrici da incidente": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
  "Parto": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
  "Acne": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
  "Eczema": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80",
  "Cicatrici da mastectomia": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80",
  "Cicatrici chirurgiche": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80",
  "Tracce oncologiche": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",

  // Tipologia
  "Mostra/istallazione": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80",
  "Archivio/ricerca": "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1000&q=80",
  "Performance": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80",
  "Serie fotografica": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
  "Pubblicazioni editoriali": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1000&q=80",
  "Fotografia d’autore": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
  "Testimonianze personali": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80",

  // Tono
  "Politico/rivendicativo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
  "Intimo/confessionale": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
  "Clinico/scientifico": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80",
  "Poetico/evocativo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80",
  "Viscerale/radicale": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80",
  "Normalizzazione": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",

  // Tipo di media
  "Fotografia": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
  "Audio": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80",
  "Video": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80",
  "Pittura": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1000&q=80",
  "Scultura": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
  "Artefatto tessile": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=80",

  // Categorie
  "Traumi": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80",
  "Sistemici": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
  "Medici": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80",
  "Trasformazione": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
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
  // Exact 5 categories requested by user
  const categoryKeys: FilterCategoryId[] = [
    "segno",
    "tipologia",
    "tono",
    "tipoDiMedia",
    "categorie",
  ];

  const [activeCategoryTab, setActiveCategoryTab] = useState<FilterCategoryId>("segno");
  const [viewAllCategories, setViewAllCategories] = useState(false);
  const [isTeoriaHovered, setIsTeoriaHovered] = useState(false);

  // Total active selections
  const totalActiveFilters = Object.values(selectedFilters).reduce(
    (acc, arr) => acc + arr.length,
    0
  );

  // Dynamic count calculation matching Excel multi-tag taxonomy
  const getOptionCount = (category: FilterCategoryId, opt: string): number => {
    const optLower = opt.toLowerCase();
    return ARCHIVE_ITEMS.filter((item) => {
      if (category === "segno") {
        return (
          item.segno.toLowerCase().includes(optLower) ||
          (item.segnoTags && item.segnoTags.some((t) => t.toLowerCase() === optLower)) ||
          (item.ambitoTeorico && item.ambitoTeorico.toLowerCase() === optLower)
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

  // Preview image on hover directly from matching real archive case studies
  const activePreviewImage = hoveredFilter
    ? ARCHIVE_ITEMS.find((it) => {
        if (!it.imageUrl) return false;
        const valLower = hoveredFilter.value.toLowerCase();
        if (hoveredFilter.category === "segno") {
          return (
            it.segno.toLowerCase().includes(valLower) ||
            (it.segnoTags && it.segnoTags.some((t) => t.toLowerCase() === valLower)) ||
            (it.ambitoTeorico && it.ambitoTeorico.toLowerCase() === valLower)
          );
        }
        if (hoveredFilter.category === "tipologia") {
          return it.tipologia.toLowerCase().includes(valLower);
        }
        if (hoveredFilter.category === "tono") {
          return it.tono.toLowerCase() === valLower;
        }
        if (hoveredFilter.category === "tipoDiMedia") {
          return it.tipoDiMedia.toLowerCase().includes(valLower);
        }
        if (hoveredFilter.category === "categorie") {
          return (
            it.categorie.toLowerCase().includes(valLower) ||
            (it.clusterTags && it.clusterTags.some((t) => t.toLowerCase() === valLower))
          );
        }
        return false;
      })?.imageUrl || ARCHIVE_ITEMS.find((it) => it.imageUrl)?.imageUrl || ""
    : null;

  return (
    <>
      {/* 1. Toggle Button when sidebar is collapsed */}
      {!isOpen && (
        <button
          type="button"
          onClick={onToggleOpen}
          className="fixed left-4 sm:left-6 top-[68px] z-30 flex items-center gap-2.5 px-3 py-1.5 bg-[#f5f0e0] border border-[#88562C] text-[#523719] font-mono text-xs uppercase tracking-wider hover:bg-[#523719] hover:text-[#f5f0e0] transition-all duration-200 cursor-pointer shadow-md rounded-none hover:scale-105"
        >
          <span>[ + FILTRI ARCHIVIO ]</span>
          {(totalActiveFilters > 0 || searchQuery.trim() !== "") && (
            <span className="font-bold text-[11px] text-[#88562C]">
              [ {totalActiveFilters > 0 ? totalActiveFilters : filteredCount} ]
            </span>
          )}
        </button>
      )}

      {/* 2. Main Vertical Left Section (serotoninn.com inspired) */}
      <aside
        className={`fixed left-0 top-[52px] bottom-0 z-30 w-80 sm:w-96 lg:w-[400px] bg-[#f5f0e0] border-r border-[#88562C]/30 shadow-2xl flex flex-col rounded-none transition-transform duration-300 ease-out select-none overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        {/* ATMOSPHERIC BACKGROUND PREVIEW */}
        <AnimatePresence>
          {activePreviewImage && (
            <motion.div
              key={activePreviewImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.32, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
            >
              <img
                src={activePreviewImage}
                alt=""
                className="w-full h-full object-cover filter contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f5f0e0] via-[#f5f0e0]/75 to-[#f5f0e0]/90" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Container (Layered above background) */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-8">
          {/* Top Header matching serotoninn.com */}
          <div className="flex flex-col gap-2 border-b border-[#88562C]/20 pb-4">
            <div className="flex items-center justify-between font-mono text-[11px] text-[#88562C] uppercase tracking-wider">
              <span>ARCHIVIO / SEGNI DELLA PELLE</span>
              <button
                type="button"
                onClick={onToggleOpen}
                title="Chiudi menu filtri"
                className="hover:text-[#523719] cursor-pointer p-0.5"
              >
                [ – CHIUDI ]
              </button>
            </div>

            {/* SHOP ALL / ALL SIGNS ROW */}
            <div
              onClick={() => {
                onResetFilters();
                if (onSearchChange) onSearchChange("");
                onHoverFilter(null);
              }}
              className="flex items-center justify-between py-1 font-mono text-xs sm:text-[13px] tracking-wider uppercase cursor-pointer group text-[#523719] hover:text-[#88562C] transition-colors"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span>[</span>
                <span className="group-hover:tracking-widest transition-all">
                  TUTTI I SEGNI
                </span>
                <span>]</span>
              </div>
              <span className="font-mono text-xs text-[#88562C]">
                [ {totalItems} ]
              </span>
            </div>

            {/* SEARCH INPUT BAR */}
            <div className="relative my-1 flex items-center border border-[#88562C]/40 bg-[#f5f0e0]/90 px-2.5 py-1.5 focus-within:border-[#523719] focus-within:bg-[#f5f0e0] transition-colors">
              <Search className="w-3.5 h-3.5 text-[#88562C] mr-2 shrink-0 select-none" />
              <input
                type="text"
                placeholder="CERCA PER PAROLA O CASO..."
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full bg-transparent font-mono text-[11px] uppercase tracking-wider text-[#523719] placeholder-[#88562C]/60 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange && onSearchChange("")}
                  title="Cancella ricerca"
                  className="ml-1 text-[10px] font-mono text-[#88562C] hover:text-[#523719] cursor-pointer uppercase shrink-0"
                >
                  [ X ]
                </button>
              )}
            </div>

            {/* Active filters count & reset button */}
            {(totalActiveFilters > 0 || searchQuery.trim() !== "") && (
              <div className="flex items-center justify-between pt-1 font-mono text-[10px] text-[#88562C]">
                <span className="font-bold text-[#523719]">
                  {searchQuery.trim() !== "" ? (
                    <>
                      RICERCA: &ldquo;{searchQuery.trim().toUpperCase()}&rdquo; [{filteredCount}]
                    </>
                  ) : (
                    <>FILTRI ATTIVI: {totalActiveFilters} [{filteredCount}]</>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onResetFilters();
                    if (onSearchChange) onSearchChange("");
                  }}
                  className="hover:text-[#523719] underline cursor-pointer uppercase tracking-wider"
                >
                  [ AZZERA ]
                </button>
              </div>
            )}
          </div>

          {/* Category Tabs: SEGNO, TIPOLOGIA, TONO, TIPO DI MEDIA, CATEGORIE */}
          <div className="py-3 border-b border-[#88562C]/20">
            <div className="flex items-center justify-between mb-2 font-mono text-[10px] text-[#88562C] uppercase tracking-wider">
              <span>CATEGORIE:</span>
              <button
                type="button"
                onClick={() => setViewAllCategories(!viewAllCategories)}
                className="text-[9px] hover:text-[#523719] cursor-pointer uppercase underline"
              >
                {viewAllCategories ? "[ MOSTRA PER TAB ]" : "[ MOSTRA TUTTI ]"}
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
                      className={`font-mono text-[10px] sm:text-[11px] px-2 py-0.5 transition-all duration-150 uppercase tracking-wider cursor-pointer border rounded-none ${
                        isTabActive
                          ? "bg-[#523719] text-[#f5f0e0] border-[#523719] font-bold"
                          : "border-[#88562C]/30 text-[#523719] hover:border-[#523719] hover:bg-[#88562C]/10"
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

          {/* MAIN LIST OF FILTERS IN SEROTONINN SQUARE BRACKET STYLE */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-2">
            {viewAllCategories ? (
              // All categories stacked
              categoryKeys.map((catKey) => {
                const catDef = FILTER_CATEGORIES[catKey];
                return (
                  <div key={catKey} className="mb-4">
                    <div className="font-mono text-[10px] font-bold text-[#88562C] uppercase tracking-widest mb-1.5 border-b border-[#88562C]/15 pb-0.5">
                      {catDef.label} --
                    </div>
                    <div className="space-y-1">
                      {catDef.options.map((opt) => {
                        const isSelected = selectedFilters[catKey].includes(opt);
                        const count = getOptionCount(catKey, opt);
                        const isTeoria = catKey === "segno" && opt === "Traccia teorica";
                        const isSubActive = isTeoria && AMBITI_TEORICI.some(a => selectedFilters.segno.includes(a.name));
                        const showSub = isTeoria && (isTeoriaHovered || isSelected || isSubActive);

                        if (isTeoria) {
                          return (
                            <div
                              key={opt}
                              onMouseEnter={() => setIsTeoriaHovered(true)}
                              onMouseLeave={() => setIsTeoriaHovered(false)}
                              className="flex flex-col"
                            >
                              <div
                                onClick={() => onToggleFilter(catKey, opt)}
                                onMouseEnter={() =>
                                  onHoverFilter({
                                    category: catKey,
                                    value: opt,
                                    label: `${opt.toUpperCase()} (${catDef.label})`,
                                  })
                                }
                                onMouseLeave={() => {
                                  if (!isTeoriaHovered) onHoverFilter(null);
                                }}
                                className={`flex items-center justify-between py-1 cursor-pointer font-mono text-xs sm:text-[13px] tracking-wider transition-all duration-150 group ${
                                  isSelected
                                    ? "text-[#523719] font-bold"
                                    : "text-[#523719]/80 hover:text-[#523719]"
                                }`}
                              >
                                <span className="flex items-center gap-1.5 transition-transform duration-150 group-hover:translate-x-1">
                                  <span>[</span>
                                  <span className={isSelected ? "font-bold text-[#523719]" : ""}>
                                    {isSelected ? `■ ${opt.toUpperCase()}` : opt.toUpperCase()}
                                  </span>
                                  <span>]</span>
                                </span>
                                <span className="text-[#88562C] font-mono text-xs">
                                  [ {count} ]
                                </span>
                              </div>

                              <AnimatePresence>
                                {showSub && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden pl-3 py-1 space-y-1 border-l-2 border-[#523719]/40 my-1 ml-2 bg-[#523719]/[0.03]"
                                  >
                                    <div className="font-mono text-[9px] uppercase tracking-wider text-[#88562C] font-semibold pb-0.5">
                                      4 AMBITI EPISTEMOLOGICI:
                                    </div>
                                    {AMBITI_TEORICI.map((amb) => {
                                      const isSubSel = selectedFilters.segno.includes(amb.name);
                                      return (
                                        <div
                                          key={amb.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleFilter("segno", amb.name);
                                          }}
                                          onMouseEnter={(e) => {
                                            e.stopPropagation();
                                            onHoverFilter({
                                              category: "segno",
                                              value: amb.name,
                                              label: `${amb.shortLabel} (${amb.count})`,
                                            });
                                          }}
                                          onMouseLeave={() => {
                                            onHoverFilter({
                                              category: "segno",
                                              value: "Traccia teorica",
                                              label: "TRACCIA TEORICA (26)",
                                            });
                                          }}
                                          className={`flex items-center justify-between py-1 px-1.5 cursor-pointer font-mono text-[10.5px] tracking-wider transition-all duration-150 group border border-transparent rounded-none ${
                                            isSubSel
                                              ? "bg-[#523719]/15 text-[#523719] font-bold border-[#523719]/30"
                                              : "text-[#523719]/80 hover:text-[#523719] hover:bg-[#88562C]/10"
                                          }`}
                                        >
                                          <span className="flex items-center gap-1.5 transition-transform duration-150 group-hover:translate-x-1">
                                            <span className="text-[#88562C]">↳</span>
                                            <span className={isSubSel ? "font-bold text-[#523719]" : ""}>
                                              {isSubSel ? `■ ${amb.name.toUpperCase()}` : amb.name.toUpperCase()}
                                            </span>
                                          </span>
                                          <span className="text-[#88562C] font-mono text-[10px]">
                                            [ {amb.count} ]
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        }

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
                            className={`flex items-center justify-between py-1 cursor-pointer font-mono text-xs sm:text-[13px] tracking-wider transition-all duration-150 group ${
                              isSelected
                                ? "text-[#523719] font-bold"
                                : "text-[#523719]/80 hover:text-[#523719]"
                            }`}
                          >
                            <span className="flex items-center gap-1.5 transition-transform duration-150 group-hover:translate-x-1">
                              <span>[</span>
                              <span className={isSelected ? "font-bold text-[#523719]" : ""}>
                                {isSelected ? `■ ${opt.toUpperCase()}` : opt.toUpperCase()}
                              </span>
                              <span>]</span>
                            </span>
                            <span className="text-[#88562C] font-mono text-xs">
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
              // Active category list
              <div className="space-y-1.5">
                {FILTER_CATEGORIES[activeCategoryTab].options.map((opt) => {
                  const isSelected = selectedFilters[activeCategoryTab].includes(opt);
                  const count = getOptionCount(activeCategoryTab, opt);
                  const isTeoria = activeCategoryTab === "segno" && opt === "Traccia teorica";
                  const isSubActive = isTeoria && AMBITI_TEORICI.some(a => selectedFilters.segno.includes(a.name));
                  const showSub = isTeoria && (isTeoriaHovered || isSelected || isSubActive);

                  if (isTeoria) {
                    return (
                      <div
                        key={opt}
                        onMouseEnter={() => setIsTeoriaHovered(true)}
                        onMouseLeave={() => setIsTeoriaHovered(false)}
                        className="flex flex-col"
                      >
                        <div
                          onClick={() => onToggleFilter(activeCategoryTab, opt)}
                          onMouseEnter={() =>
                            onHoverFilter({
                              category: activeCategoryTab,
                              value: opt,
                              label: `${opt.toUpperCase()} (${FILTER_CATEGORIES[activeCategoryTab].label})`,
                            })
                          }
                          onMouseLeave={() => {
                            if (!isTeoriaHovered) onHoverFilter(null);
                          }}
                          className={`flex items-center justify-between py-1.5 px-1 cursor-pointer font-mono text-xs sm:text-[13px] tracking-wider transition-all duration-150 group border border-transparent hover:border-[#88562C]/20 rounded-none ${
                            isSelected
                              ? "bg-[#523719]/10 text-[#523719] font-bold border-[#523719]/30"
                              : "text-[#523719]/80 hover:text-[#523719] hover:bg-[#88562C]/5"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 transition-transform duration-150 group-hover:translate-x-1.5">
                            <span className="text-[#88562C] font-bold">[</span>
                            <span className={isSelected ? "font-bold text-[#523719]" : ""}>
                              {isSelected ? `■ ${opt.toUpperCase()}` : opt.toUpperCase()}
                            </span>
                            <span className="text-[#88562C] font-bold">]</span>
                          </span>
                          <span className="text-[#88562C] font-mono text-xs">
                            [ {count} ]
                          </span>
                        </div>

                        {/* AUTOMATIC DROPDOWN OF 4 SUBCATEGORIES */}
                        <AnimatePresence>
                          {showSub && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden pl-3 pr-1 py-1.5 space-y-1 border-l-2 border-[#523719]/40 my-1 ml-2 bg-[#523719]/[0.03]"
                            >
                              <div className="font-mono text-[9px] uppercase tracking-wider text-[#88562C] font-semibold pb-0.5">
                                4 AMBITI EPISTEMOLOGICI:
                              </div>
                              {AMBITI_TEORICI.map((amb) => {
                                const isSubSel = selectedFilters.segno.includes(amb.name);
                                return (
                                  <div
                                    key={amb.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onToggleFilter("segno", amb.name);
                                    }}
                                    onMouseEnter={(e) => {
                                      e.stopPropagation();
                                      onHoverFilter({
                                        category: "segno",
                                        value: amb.name,
                                        label: `${amb.shortLabel} (${amb.count})`,
                                      });
                                    }}
                                    onMouseLeave={() => {
                                      onHoverFilter({
                                        category: "segno",
                                        value: "Traccia teorica",
                                        label: "TRACCIA TEORICA (26)",
                                      });
                                    }}
                                    className={`flex items-center justify-between py-1 px-1.5 cursor-pointer font-mono text-[10.5px] sm:text-[11px] tracking-wider transition-all duration-150 group border border-transparent rounded-none ${
                                      isSubSel
                                        ? "bg-[#523719]/15 text-[#523719] font-bold border-[#523719]/30"
                                        : "text-[#523719]/80 hover:text-[#523719] hover:bg-[#88562C]/10 hover:border-[#88562C]/20"
                                    }`}
                                  >
                                    <span className="flex items-center gap-1.5 transition-transform duration-150 group-hover:translate-x-1">
                                      <span className="text-[#88562C]">↳</span>
                                      <span className={isSubSel ? "font-bold text-[#523719]" : ""}>
                                        {isSubSel ? `■ ${amb.name.toUpperCase()}` : amb.name.toUpperCase()}
                                      </span>
                                    </span>
                                    <span className="text-[#88562C] font-mono text-[10px]">
                                      [ {amb.count} ]
                                    </span>
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

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
                      className={`flex items-center justify-between py-1.5 px-1 cursor-pointer font-mono text-xs sm:text-[13px] tracking-wider transition-all duration-150 group border border-transparent hover:border-[#88562C]/20 rounded-none ${
                        isSelected
                          ? "bg-[#523719]/10 text-[#523719] font-bold border-[#523719]/30"
                          : "text-[#523719]/80 hover:text-[#523719] hover:bg-[#88562C]/5"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 transition-transform duration-150 group-hover:translate-x-1.5">
                        <span className="text-[#88562C] font-bold">[</span>
                        <span className={isSelected ? "font-bold text-[#523719]" : ""}>
                          {isSelected ? `■ ${opt.toUpperCase()}` : opt.toUpperCase()}
                        </span>
                        <span className="text-[#88562C] font-bold">]</span>
                      </span>
                      <span className="text-[#88562C] font-mono text-xs">
                        [ {count} ]
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* BOTTOM-LEFT BIG BOLD TITLE */}
          <div className="pt-4 border-t border-[#88562C]/20">
            <div className="min-h-[56px] flex flex-col justify-end">
              <AnimatePresence mode="wait">
                {hoveredFilter ? (
                  <motion.div
                    key={hoveredFilter.value}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tighter text-[#523719] leading-none">
                      {hoveredFilter.value}{" "}
                      <span className="text-base sm:text-lg font-mono font-normal opacity-70 tracking-normal block sm:inline">
                        ({FILTER_CATEGORIES[hoveredFilter.category].label})
                      </span>
                    </h2>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[11px] text-[#88562C] flex items-center justify-between"
                  >
                    <span>RISULTATI VISIBILI:</span>
                    <span className="font-bold text-[#523719]">
                      [ {filteredCount} / {totalItems} ]
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
