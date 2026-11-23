"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft, ChevronDown, ChevronUp, X } from "lucide-react";
import { ArchiveItem, ARCHIVE_ITEMS, ARCHIVE_ASPECT_RATIOS } from "@/data/archiveData";
import {
  OLTRE_CATEGORIES,
  OltreCategoryKey,
  OltreCategoryConfig,
  getItemsByOltreSubcategory,
} from "@/data/oltreData";

interface StationModalProps {
  item: ArchiveItem;
  portionIndex?: number;
  onClose: () => void;
  onSelectItem?: (item: ArchiveItem) => void;
}

export function StationModal({
  item: initialItem,
  portionIndex = 2,
  onClose,
  onSelectItem,
}: StationModalProps) {
  const [item, setItem] = useState<ArchiveItem>(initialItem);

  useEffect(() => {
    setItem(initialItem);
  }, [initialItem]);

  // Mode: "image" opens with large artwork + scrollable info, "oltre" opens 3D categorical perspective
  const [viewMode, setViewMode] = useState<"image" | "oltre">("image");
  const [imgIdx, setImgIdx] = useState(0);

  // Active category in Oltre view (defaults to "origine": "la prima si apre subito")
  const [activeCatKey, setActiveCatKey] = useState<OltreCategoryKey>("origine");

  // Natural dimensions from archive
  const dim = ARCHIVE_ASPECT_RATIOS[item.id];

  // Ultra-soft, delicate edge feathering (85px wide) on the boundary bordering the neighboring column(s)
  const maskStyle = useMemo(() => {
    if (portionIndex === 1) {
      // Station 1: right edge borders Station 2 -> soft 85px gradual feather on right seam only
      return {
        maskImage:
          "linear-gradient(to right, black 0%, black calc(100% - 85px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, black 0%, black calc(100% - 85px), transparent 100%)",
      };
    }
    if (portionIndex === 3) {
      // Station 3: left edge borders Station 2 -> soft 85px gradual feather on left seam only
      return {
        maskImage:
          "linear-gradient(to right, transparent 0%, black 85px, black 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 85px, black 100%)",
      };
    }
    // Station 2 (center): borders both Station 1 and 3 -> soft 85px gradual feather on both seams
    return {
      maskImage:
        "linear-gradient(to right, transparent 0%, black 85px, black calc(100% - 85px), transparent 100%)",
      WebkitMaskImage:
        "linear-gradient(to right, transparent 0%, black 85px, black calc(100% - 85px), transparent 100%)",
    };
  }, [portionIndex]);

  // Collect all available images for this case study (main image + gallery)
  const allImages = useMemo(() => {
    const list: string[] = [];
    if (item.imageUrl) list.push(item.imageUrl);
    if (item.galleryUrls && Array.isArray(item.galleryUrls)) {
      item.galleryUrls.forEach((g) => {
        if (g && !list.includes(g)) list.push(g);
      });
    }
    if (list.length === 0 && item.thumbnailUrl) {
      list.push(item.thumbnailUrl);
    }
    return list;
  }, [item]);

  // Ref for the unified scrollable container (large image + info arriving on scroll)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  // Reset to first slide and scroll to top on item change
  useEffect(() => {
    setImgIdx(0);
    setIsScrolledDown(false);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [item.id]);

  // Global ESC key listener to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const currentImg = allImages[imgIdx] || item.imageUrl || item.thumbnailUrl || "";

  // Oltre category config
  const currentCatConfig = useMemo(
    () => OLTRE_CATEGORIES.find((c) => c.id === activeCatKey) || OLTRE_CATEGORIES[0],
    [activeCatKey]
  );

  const subcategoryItems = useMemo(() => {
    const res: Record<string, ArchiveItem[]> = {};
    currentCatConfig.subcategories.forEach((sub) => {
      res[sub] = getItemsByOltreSubcategory(ARCHIVE_ITEMS, activeCatKey, sub);
    });
    return res;
  }, [currentCatConfig, activeCatKey]);

  const handleSelectCaseFromOltre = (selectedCase: ArchiveItem) => {
    setItem(selectedCase);
    setViewMode("image");
    setImgIdx(0);
    setIsScrolledDown(false);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "instant" });
    onSelectItem?.(selectedCase);
  };

  // Smooth scroll helpers (strictly confined within the modal window)
  const scrollToInfo = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.clientHeight, behavior: "smooth" });
      setIsScrolledDown(true);
    }
  };

  const scrollToTop = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsScrolledDown(false);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Drag-to-scroll logic for the unified modal content
  const isPointerDownRef = useRef(false);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if ((e.target as HTMLElement).closest("button")) return;
    isPointerDownRef.current = true;
    startYRef.current = e.clientY;
    startScrollTopRef.current = scrollContainerRef.current?.scrollTop || 0;
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current || !scrollContainerRef.current) return;
      const dy = e.clientY - startYRef.current;
      if (Math.abs(dy) > 4) {
        setIsDragging(true);
        scrollContainerRef.current.scrollTop = startScrollTopRef.current - dy;
      }
    };

    const handleGlobalPointerUp = () => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;
      setTimeout(() => setIsDragging(false), 50);
    };

    window.addEventListener("pointermove", handleGlobalPointerMove);
    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointercancel", handleGlobalPointerUp);
    };
  }, []);

  return (
    <div
      onScroll={(e) => {
        // Prevent outer container from ever being scrolled out of center
        (e.currentTarget as HTMLDivElement).scrollTop = 0;
      }}
      onWheel={(e) => {
        // Stop wheel events from escaping to MacroGrid or document
        e.stopPropagation();
      }}
      className="absolute inset-0 z-40 flex items-center justify-center pt-8 sm:pt-11 pb-2 px-2 sm:px-3 pointer-events-auto overflow-hidden"
    >
      {/* 1. Backdrop: ultra-light, luminous veil allowing the underlying macro grid to stay bright and clear */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={onClose}
        style={maskStyle}
        className="absolute inset-0 z-30 bg-white/12 backdrop-blur-[1px] cursor-pointer"
        aria-label="Tocca fuori per chiudere"
      />

      {/* 2. Unified Morphing Modal Window (Luminous frosted glass with gentle coverage for optimal readability) */}
      <motion.div
        key="station-modal-unified"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        className="relative z-50 flex flex-col shrink-0 border border-white/70 shadow-xl shadow-black/[0.05] overflow-hidden text-black select-none rounded-none bg-white/[0.22] backdrop-blur-[11px] ring-1 ring-white/60 w-[88%] sm:w-[84%] max-w-[430px] sm:max-w-[465px] h-[370px] sm:h-[395px] max-h-[54vh] transition-[max-width,width,max-height,height] duration-280 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {/* =============================================================== */}
          {/* VIEW: IMAGE & SCROLLABLE INFO (Unified seamless scroll)         */}
          {/* =============================================================== */}
          {viewMode === "image" && (
            <motion.div
              key="view-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative w-full h-full flex flex-col overflow-hidden select-none"
            >
              <div
                ref={scrollContainerRef}
                onScroll={(e) => {
                  const top = e.currentTarget.scrollTop;
                  setIsScrolledDown(top > 50);
                }}
                onPointerDown={handlePointerDown}
                onWheel={(e) => e.stopPropagation()}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
                className={`relative w-full h-full overflow-y-auto no-scrollbar scroll-smooth flex flex-col select-none touch-pan-y ${
                  isDragging ? "cursor-grabbing" : "cursor-default"
                }`}
              >
                {/* SCREEN 1: Large Artwork Image View (fills first screen of modal) */}
                <div className="relative w-full min-h-full h-[370px] sm:h-[395px] max-h-[54vh] shrink-0 flex items-center justify-center p-3.5 sm:p-4 overflow-hidden select-none">
                  {/* Badge: CASO XX (top-left) */}
                  <div className="absolute top-3.5 left-4 z-20 px-2.5 py-0.5 rounded-none bg-white/70 backdrop-blur-md text-black font-display font-semibold text-[8px] sm:text-[8.5px] uppercase tracking-wider border border-black/10 shadow-xs pointer-events-none">
                    CASO {item.number}
                  </div>

                  {/* Close button: X (top-right, matching info.png) */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3.5 right-4 z-20 w-6 h-6 flex items-center justify-center rounded-none bg-white/70 hover:bg-white backdrop-blur-md text-black border border-black/10 shadow-xs cursor-pointer transition-all"
                    title="Chiudi"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Artwork Image maintaining its original aspect ratio */}
                  <img
                    src={currentImg}
                    alt={item.title}
                    draggable={false}
                    className="w-auto h-auto max-w-full max-h-full object-contain block filter-none select-none shadow-xs rounded-none"
                    style={{
                      imageRendering: "-webkit-optimize-contrast",
                      aspectRatio: dim ? `${dim.w} / ${dim.h}` : undefined,
                    }}
                  />

                  {/* Squared Gallery Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImgIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-7.5 h-7.5 rounded-none bg-white/70 hover:bg-white backdrop-blur-md text-black flex items-center justify-center active:scale-95 transition-all shadow-md cursor-pointer border border-black/10"
                        title="Immagine precedente"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImgIdx((prev) => (prev + 1) % allImages.length);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-7.5 h-7.5 rounded-none bg-white/70 hover:bg-white backdrop-blur-md text-black flex items-center justify-center active:scale-95 transition-all shadow-md cursor-pointer border border-black/10"
                        title="Immagine successiva"
                      >
                        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </>
                  )}
                </div>

                {/* SCREEN 2: Info Content Arriving by Scrolling */}
                <div
                  id="station-modal-info-section"
                  className="w-full shrink-0 flex flex-col px-5 pt-3.5 pb-4 gap-2 border-t border-black/8 bg-white/[0.12] backdrop-blur-xs select-none"
                >
                  {/* Header row: CASO, back-to-photo, and close button */}
                  <div className="flex items-center justify-between pb-1 shrink-0 select-none border-b border-black/6">
                    <span className="font-display font-bold text-[8.5px] sm:text-[9px] uppercase tracking-wide text-black/60">
                      CASO {item.number}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={scrollToTop}
                        className="text-black/50 hover:text-black font-display font-semibold text-[8px] sm:text-[8.5px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Foto</span>
                        <ChevronUp className="w-3 h-3 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-black/50 hover:text-black font-display font-semibold text-[8px] sm:text-[8.5px] uppercase tracking-wider flex items-center cursor-pointer transition-colors"
                        title="Chiudi"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-display font-black text-[13px] sm:text-[14px] leading-tight uppercase text-black tracking-tight">
                    {item.title}
                  </h2>

                  {/* Subtitle: Author & Year */}
                  <p className="font-display text-[9px] sm:text-[9.5px] text-black/75 font-medium -mt-1">
                    {item.authorOrSubject} {item.year ? `— ${item.year}` : ""}
                  </p>

                  {/* Section Descrizione */}
                  <div className="mt-0.5">
                    <span className="block font-display font-bold text-[7.5px] sm:text-[8px] text-black/45 uppercase tracking-wider mb-1">
                      Descrizione
                    </span>
                    <p className="font-body text-[9.5px] sm:text-[10px] leading-relaxed text-black/90 text-left text-pretty hyphens-auto">
                      {(item.sintesiConcettuale || item.excerpt || item.notes)?.replace(/\s+/g, ' ')}
                    </p>
                  </div>

                  {/* Metadata Grid */}
                  <div className="mt-1 pt-2 border-t border-black/8 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-[9px]">
                    <div>
                      <span className="block font-display font-semibold text-[7px] sm:text-[7.5px] uppercase tracking-wider text-black/45">
                        Segno
                      </span>
                      <span className="font-body font-bold text-black text-[8.5px] sm:text-[9px] leading-tight block mt-0.5">
                        {item.segno || "—"}
                      </span>
                    </div>

                    <div>
                      <span className="block font-display font-semibold text-[7px] sm:text-[7.5px] uppercase tracking-wider text-black/45">
                        Tono
                      </span>
                      <span className="font-body font-bold text-black text-[8.5px] sm:text-[9px] leading-tight block mt-0.5">
                        {item.tono || "—"}
                      </span>
                    </div>

                    <div>
                      <span className="block font-display font-semibold text-[7px] sm:text-[7.5px] uppercase tracking-wider text-black/45">
                        Tipologia
                      </span>
                      <span className="font-body font-bold text-black text-[8.5px] sm:text-[9px] leading-tight block mt-0.5">
                        {item.tipologia || "—"}
                      </span>
                    </div>

                    <div>
                      <span className="block font-display font-semibold text-[7px] sm:text-[7.5px] uppercase tracking-wider text-black/45">
                        Media
                      </span>
                      <span className="font-body font-bold text-black text-[8.5px] sm:text-[9px] leading-tight block mt-0.5">
                        {item.tipoDiMedia || "—"}
                      </span>
                    </div>

                    {item.stileVisivo && (
                      <div className="col-span-2 sm:col-span-4 pt-1.5 border-t border-black/8">
                        <span className="block font-display font-semibold text-[7px] sm:text-[7.5px] uppercase tracking-wider text-black/45">
                          Stile visivo
                        </span>
                        <span className="font-body text-black/90 text-[8.5px] sm:text-[9px] leading-relaxed text-left block mt-0.5 text-pretty hyphens-auto">
                          {item.stileVisivo?.replace(/\s+/g, ' ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action inside Info section: [ (●) OLTRE ] */}
                  <div className="mt-2 pt-2 border-t border-black/8 flex items-center justify-end shrink-0 select-none pb-7 sm:pb-8">
                    <button
                      type="button"
                      onClick={() => setViewMode("oltre")}
                      className="px-3 py-1 rounded-none bg-black text-white hover:bg-black/85 font-display font-semibold text-[8px] sm:text-[8.5px] tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-none bg-white/90" />
                      <span>OLTRE</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Quick Action Button (Tastino squadrato): Arrow Down to scroll to info, Arrow UP to return to photo */}
              <button
                type="button"
                onClick={isScrolledDown ? scrollToTop : scrollToInfo}
                className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 w-7 h-7 rounded-none bg-white/85 hover:bg-white backdrop-blur-md text-black flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-md border border-black/10 group"
                aria-label={isScrolledDown ? "Torna alla foto" : "Scorri verso il basso"}
                title={isScrolledDown ? "Torna alla foto" : "Scorri verso la spiegazione"}
              >
                {isScrolledDown ? (
                  <ChevronUp className="w-4 h-4 stroke-[2.5] text-black/80 group-hover:text-black" />
                ) : (
                  <ChevronDown className="w-4 h-4 stroke-[2.5] text-black/80 group-hover:text-black animate-bounce" />
                )}
              </button>
            </motion.div>
          )}

          {/* =============================================================== */}
          {/* VIEW: OLTRE (Clean multi-column layout matching oltre.jpg)       */}
          {/* =============================================================== */}
          {viewMode === "oltre" && (
            <motion.div
              key="view-oltre"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full flex flex-col overflow-hidden select-none"
            >
              {/* Header: Category Title (matching oltre.jpg) and Close button */}
              <div className="px-5 pt-3 pb-1.5 flex items-center justify-between shrink-0 select-none border-b border-black/8">
                <div className="text-black font-display font-bold text-[9px] sm:text-[10px] tracking-wider uppercase">
                  {currentCatConfig.num} {currentCatConfig.label}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-black/50 hover:text-black font-display font-semibold text-[8px] sm:text-[8.5px] uppercase tracking-wider cursor-pointer transition-colors p-1"
                  title="Chiudi"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Multi-Column Subcategories Layout (Clean, borderless, NO grey boxes/cards, matching oltre.jpg) */}
              <div className="flex-1 min-h-0 flex flex-row items-start justify-start sm:justify-center gap-4 sm:gap-6 px-4 py-3 overflow-x-auto custom-scrollbar select-none">
                {currentCatConfig.subcategories.map((subcat) => {
                  const rawList = subcategoryItems[subcat] || [];
                  const sortedList = [...rawList].sort((a, b) => {
                    if (a.id === item.id) return -1;
                    if (b.id === item.id) return 1;
                    return 0;
                  });

                  return (
                    <div
                      key={subcat}
                      className="flex flex-col items-center flex-shrink-0 min-w-[105px] max-w-[135px]"
                    >
                      {/* Subcategory title: pure typography, NO enclosing box */}
                      <div className="font-display font-bold text-[8px] sm:text-[8.5px] uppercase tracking-wider text-black text-center mb-2 select-none h-6 flex items-center justify-center">
                        <span>{subcat}</span>
                      </div>

                      {/* Cluster / Grid of Case Studies matching oltre.jpg */}
                      {sortedList.length === 0 ? (
                        <div className="h-24 flex items-center justify-center text-center">
                          <span className="font-display text-[7px] uppercase tracking-wider text-black/30 font-medium">
                            Nessuna opera
                          </span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 items-center justify-items-center">
                          {sortedList.map((c) => {
                            const isCurrent = c.id === item.id;
                            return (
                              <button
                                key={c.id}
                                type="button"
                                title={`Caso ${c.number}: ${c.title}`}
                                onClick={() => handleSelectCaseFromOltre(c)}
                                className={`relative w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 overflow-hidden rounded-none transition-all duration-150 cursor-pointer select-none bg-[#ECECE8] ${
                                  isCurrent
                                    ? "border-2 border-black ring-1 ring-black shadow-md scale-105 z-10"
                                    : "border border-black/25 hover:border-black hover:scale-105"
                                }`}
                              >
                                <img
                                  src={c.thumbnailUrl || c.imageUrl || ""}
                                  alt={c.title}
                                  draggable={false}
                                  loading="lazy"
                                  className="w-full h-full object-cover block filter-none rounded-none pointer-events-none"
                                />
                                <div
                                  className={`absolute bottom-0 inset-x-0 font-display text-[5.5px] font-bold text-center py-0.2 leading-tight pointer-events-none z-10 uppercase tracking-tighter rounded-none ${
                                    isCurrent ? "bg-black text-white" : "bg-black/55 text-white/95"
                                  }`}
                                >
                                  {c.number}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Navigation Bar: [ ← Opera ] on left, 5 categories on right (matching oltre.jpg) */}
              <div className="px-4 py-2 border-t border-black/8 bg-white/20 backdrop-blur-xs flex items-center justify-between shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => setViewMode("image")}
                  className="px-3 py-1 rounded-none bg-white/70 hover:bg-white text-black font-display font-semibold text-[8px] sm:text-[8.5px] tracking-wide flex items-center gap-1 shadow-xs transition-all cursor-pointer border border-black/10 backdrop-blur-xs"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Opera</span>
                </button>

                {/* 5 Category Selector tabs as squared buttons matching oltre.jpg */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {OLTRE_CATEGORIES.map((cat) => {
                    const isActive = cat.id === activeCatKey;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCatKey(cat.id)}
                        className={`font-display text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer px-2.5 py-0.5 rounded-none ${
                          isActive
                            ? "bg-black text-white shadow-xs"
                            : "text-black/60 hover:text-black bg-transparent"
                        }`}
                      >
                        {cat.label.charAt(0) + cat.label.slice(1).toLowerCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
