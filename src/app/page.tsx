"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ARCHIVE_ITEMS, ArchiveItem } from "@/data/archiveData";
import { HeaderNav } from "@/components/HeaderNav";
import { BeyondView } from "@/components/BeyondView";
import { MacroGrid } from "@/components/MacroGrid";
import { MicroView } from "@/components/MicroView";
import { VerticalTimeline } from "@/components/VerticalTimeline";
import { ManifestoModal } from "@/components/ManifestoModal";
import {
  FilterSidebar,
  SelectedFiltersState,
  INITIAL_FILTERS,
} from "@/components/FilterSidebar";
import { FilterCategoryId } from "@/data/archiveData";

export default function Home() {
  const [view, setView] = useState<"beyond" | "macro" | "micro">("macro");
  const [activeItemId, setActiveItemId] = useState<string>(ARCHIVE_ITEMS[0].id);
  const [zoomLevel, setZoomLevel] = useState<number>(0.24);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFiltersState>(INITIAL_FILTERS);
  const [hoveredFilter, setHoveredFilter] = useState<{
    category: FilterCategoryId;
    value: string;
    label: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // DYNAMIC FILTERING & HOVER REACTION:
  // When hovering a category on the left, the photos on the right react in real-time
  // exactly as seen in animazione menu.mov / serotoninn.com!
  const filteredItems = useMemo(() => {
    return ARCHIVE_ITEMS.filter((item) => {
      // 0. Check search query across title, author/subject, number, tags, synthesis, notes
      if (searchQuery.trim() !== "") {
        const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
        const matchesAll = terms.every((term) => {
          return (
            item.number.toLowerCase().includes(term) ||
            item.title.toLowerCase().includes(term) ||
            item.authorOrSubject.toLowerCase().includes(term) ||
            item.segno.toLowerCase().includes(term) ||
            (item.segnoTags && item.segnoTags.some((t) => t.toLowerCase().includes(term))) ||
            item.tipologia.toLowerCase().includes(term) ||
            item.tono.toLowerCase().includes(term) ||
            item.tipoDiMedia.toLowerCase().includes(term) ||
            item.categorie.toLowerCase().includes(term) ||
            (item.clusterTags && item.clusterTags.some((t) => t.toLowerCase().includes(term))) ||
            (item.stileVisivo && item.stileVisivo.toLowerCase().includes(term)) ||
            (item.sintesiConcettuale && item.sintesiConcettuale.toLowerCase().includes(term)) ||
            (item.notes && item.notes.toLowerCase().includes(term)) ||
            (item.excerpt && item.excerpt.toLowerCase().includes(term)) ||
            (item.microKeyword && item.microKeyword.toLowerCase().includes(term)) ||
            (item.caption && item.caption.toLowerCase().includes(term))
          );
        });
        if (!matchesAll) return false;
      }

      // 1. Check hovered filter first for real-time reaction
      if (hoveredFilter) {
        const valLower = hoveredFilter.value.toLowerCase();
        if (hoveredFilter.category === "segno") {
          const matchPrimary = item.segno.toLowerCase().includes(valLower);
          const matchTag = item.segnoTags && item.segnoTags.some((t) => t.toLowerCase() === valLower);
          const matchAmbito = item.ambitoTeorico && item.ambitoTeorico.toLowerCase() === valLower;
          if (!matchPrimary && !matchTag && !matchAmbito) return false;
        }
        if (hoveredFilter.category === "tipologia") {
          if (!item.tipologia.toLowerCase().includes(valLower)) return false;
        }
        if (hoveredFilter.category === "tono") {
          if (item.tono.toLowerCase() !== valLower) return false;
        }
        if (hoveredFilter.category === "tipoDiMedia") {
          if (!item.tipoDiMedia.toLowerCase().includes(valLower)) return false;
        }
        if (hoveredFilter.category === "categorie") {
          const matchPrimary = item.categorie.toLowerCase().includes(valLower);
          const matchTag = item.clusterTags && item.clusterTags.some((t) => t.toLowerCase() === valLower);
          if (!matchPrimary && !matchTag) return false;
        }
      }

      // 2. Check locked selected filters (for categories other than the hovered one)
      if (
        selectedFilters.segno.length > 0 &&
        (!hoveredFilter || hoveredFilter.category !== "segno")
      ) {
        const hasMatch = selectedFilters.segno.some((v) => {
          const vLower = v.toLowerCase();
          return (
            item.segno.toLowerCase().includes(vLower) ||
            (item.segnoTags && item.segnoTags.some((t) => t.toLowerCase() === vLower)) ||
            (item.ambitoTeorico && item.ambitoTeorico.toLowerCase() === vLower)
          );
        });
        if (!hasMatch) return false;
      }

      if (
        selectedFilters.tipologia.length > 0 &&
        (!hoveredFilter || hoveredFilter.category !== "tipologia")
      ) {
        const hasMatch = selectedFilters.tipologia.some((v) =>
          item.tipologia.toLowerCase().includes(v.toLowerCase())
        );
        if (!hasMatch) return false;
      }

      if (
        selectedFilters.tono.length > 0 &&
        (!hoveredFilter || hoveredFilter.category !== "tono")
      ) {
        const hasMatch = selectedFilters.tono.some(
          (v) => item.tono.toLowerCase() === v.toLowerCase()
        );
        if (!hasMatch) return false;
      }

      if (
        selectedFilters.tipoDiMedia.length > 0 &&
        (!hoveredFilter || hoveredFilter.category !== "tipoDiMedia")
      ) {
        const hasMatch = selectedFilters.tipoDiMedia.some((v) =>
          item.tipoDiMedia.toLowerCase().includes(v.toLowerCase())
        );
        if (!hasMatch) return false;
      }

      if (
        selectedFilters.categorie.length > 0 &&
        (!hoveredFilter || hoveredFilter.category !== "categorie")
      ) {
        const hasMatch = selectedFilters.categorie.some((v) => {
          const vLower = v.toLowerCase();
          return (
            item.categorie.toLowerCase().includes(vLower) ||
            (item.clusterTags && item.clusterTags.some((t) => t.toLowerCase() === vLower))
          );
        });
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [selectedFilters, hoveredFilter, searchQuery]);

  // Toggle individual filter values (multi-select)
  const handleToggleFilter = (category: FilterCategoryId, value: string) => {
    setSelectedFilters((prev) => {
      const currentList = prev[category];
      const isSelected = currentList.includes(value);
      const nextList = isSelected
        ? currentList.filter((v) => v !== value)
        : [...currentList, value];

      return {
        ...prev,
        [category]: nextList,
      };
    });
  };

  const handleResetFilters = () => {
    setSelectedFilters(INITIAL_FILTERS);
    setHoveredFilter(null);
    setSearchQuery("");
  };

  const activeIndex = filteredItems.findIndex((item) => item.id === activeItemId);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;
  const currentItem = filteredItems[safeIndex] || ARCHIVE_ITEMS[0];

  const handleSelectItem = (item: ArchiveItem) => {
    setActiveItemId(item.id);
    setView("micro");
  };

  const handleNext = () => {
    if (filteredItems.length === 0) return;
    const nextIndex = (safeIndex + 1) % filteredItems.length;
    setActiveItemId(filteredItems[nextIndex].id);
  };

  const handlePrev = () => {
    if (filteredItems.length === 0) return;
    const prevIndex = (safeIndex - 1 + filteredItems.length) % filteredItems.length;
    setActiveItemId(filteredItems[prevIndex].id);
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#f5f0e0] text-[#523719] font-mono-text relative select-none">
      {/* 1. Header: Strictly MACRO and MICRO on the left, Title in the center, MANIFESTO on the right */}
      <HeaderNav
        currentView={view}
        onSelectView={(targetView) => setView(targetView)}
        onOpenManifesto={() => setIsManifestoOpen(true)}
      />

      {/* 2. Left Vertical Menu (Serotoninn-inspired) - strictly ONLY in MACRO, removed in BEYOND */}
      {view === "macro" && (
        <FilterSidebar
          selectedFilters={selectedFilters}
          onToggleFilter={handleToggleFilter}
          onResetFilters={handleResetFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalItems={ARCHIVE_ITEMS.length}
          filteredCount={filteredItems.length}
          isOpen={isFilterOpen}
          onToggleOpen={() => setIsFilterOpen(!isFilterOpen)}
          hoveredFilter={hoveredFilter}
          onHoverFilter={setHoveredFilter}
        />
      )}

      {/* 3. Right Vertical Timeline: prominent, with Kellerstöckl ticks and live slider zoom */}
      <VerticalTimeline
        currentView={view}
        items={filteredItems.length > 0 ? filteredItems : ARCHIVE_ITEMS}
        activeItemId={activeItemId}
        zoomLevel={zoomLevel}
        onZoomChange={(newZoom) => setZoomLevel(newZoom)}
        onSelectItem={handleSelectItem}
        onToggleView={(targetView) => setView(targetView)}
      />

      {/* 4. Main Views: BEYOND (Circular Macro Groups), MACRO (Aligned Miniature Grid), MICRO (Detail View) */}
      <div className="relative w-full h-[calc(100vh-52px)] mt-[52px] overflow-hidden">
        <AnimatePresence>
          {view === "beyond" && (
            <motion.div
              key="beyond-view"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <BeyondView
                items={filteredItems.length > 0 ? filteredItems : ARCHIVE_ITEMS}
                activeItemId={activeItemId}
                onSelectItem={handleSelectItem}
                onBackToMacro={() => {
                  setView("macro");
                  setZoomLevel(0.24);
                }}
              />
            </motion.div>
          )}

          {view === "macro" && (
            <motion.div
              key="macro-view"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <MacroGrid
                items={filteredItems}
                activeItemId={activeItemId}
                zoomLevel={zoomLevel}
                onZoomChange={(newZoom) => {
                  setZoomLevel(newZoom);
                  if (newZoom < 0.06) {
                    setView("beyond");
                    setZoomLevel(0);
                  }
                }}
                onGoToBeyond={() => {
                  setView("beyond");
                  setZoomLevel(0);
                }}
                onSelectItem={handleSelectItem}
                isFilterOpen={isFilterOpen && view === "macro"}
                onCloseFilter={() => setIsFilterOpen(false)}
              />
            </motion.div>
          )}

          {view === "micro" && (
            <motion.div
              key="micro-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full z-40"
            >
              <MicroView
                item={currentItem}
                totalItems={filteredItems.length || ARCHIVE_ITEMS.length}
                currentIndex={safeIndex}
                onBackToMacro={() => {
                  setView("macro");
                  setZoomLevel(0.24);
                }}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Editorial Manifesto Modal */}
      <ManifestoModal
        isOpen={isManifestoOpen}
        onClose={() => setIsManifestoOpen(false)}
      />
    </main>
  );
}
