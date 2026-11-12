"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Info, ArrowLeft } from "lucide-react";
import { ArchiveItem, ARCHIVE_ITEMS, ARCHIVE_ASPECT_RATIOS } from "@/data/archiveData";
import {
  OLTRE_CATEGORIES,
  OltreCategoryKey,
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

  // Mode: "image" opens first (artwork in natural original format), "info" shows detailed text, "oltre" shows categorical network
  const [viewMode, setViewMode] = useState<"image" | "info" | "oltre">("image");
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

  // Reset to first slide on item change
  useEffect(() => {
    setImgIdx(0);
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
    onSelectItem?.(selectedCase);
    setViewMode("image");
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-2 sm:p-3 pointer-events-auto overflow-hidden">
      {/* 1. Lighter, delicate backdrop with wide 85px soft feathering on the outer column seam */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={onClose}
        style={maskStyle}
        className="absolute inset-0 z-30 bg-[#F8F8F6]/52 backdrop-blur-[2px] cursor-pointer"
        aria-label="Chiudi"
      />

      {/* AnimatePresence for seamless transition between IMAGE, INFO, and OLTRE */}
      <AnimatePresence mode="wait">
        {viewMode === "image" && (
          /* ========================================================== */
          /* VIEW 1: IMAGE ONLY (Original format & natural dimensions)  */
          /* Scaled down with generous breathing room between columns   */
          /* ========================================================== */
          <motion.div
            key="image-view"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-50 flex flex-col items-center w-[78%] sm:w-[74%] max-w-[310px] sm:max-w-[320px] my-auto"
          >
            <div className="w-full bg-[#F8F8F6] border-2 border-black shadow-2xl shadow-black/25 flex flex-col overflow-hidden">
              {/* Header Bar (No top X - close button is exclusively at the bottom) */}
              <div className="h-8 px-2.5 border-b border-black flex items-center justify-between bg-[#F8F8F6] shrink-0 select-none">
                <span className="bg-black text-[#F8F8F6] px-1.5 py-0.5 font-display text-[9px] font-bold tracking-wider uppercase">
                  CASO {item.number}
                </span>

                {allImages.length > 1 && (
                  <span className="font-display text-[8.5px] uppercase tracking-wider text-black/60 font-semibold">
                    {imgIdx + 1} / {allImages.length}
                  </span>
                )}
              </div>

              {/* Natural uncropped artwork container */}
              <div className="relative bg-[#ECECE8] flex items-center justify-center overflow-hidden max-h-[42vh] select-none">
                <img
                  src={currentImg}
                  alt={item.title}
                  draggable={false}
                  className="w-auto h-auto max-h-[42vh] max-w-full object-contain block filter-none select-none"
                  style={{
                    imageRendering: "-webkit-optimize-contrast",
                    aspectRatio: dim ? `${dim.w} / ${dim.h}` : undefined,
                  }}
                />

                {/* Gallery navigation controls if multiple images exist */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
                      }}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#F8F8F6]/90 border border-black flex items-center justify-center text-black hover:bg-black hover:text-[#F8F8F6] transition-colors cursor-pointer shadow-md"
                      title="Immagine precedente"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgIdx((prev) => (prev + 1) % allImages.length);
                      }}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#F8F8F6]/90 border border-black flex items-center justify-center text-black hover:bg-black hover:text-[#F8F8F6] transition-colors cursor-pointer shadow-md"
                      title="Immagine successiva"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>

              {/* Mode Toggle: [ OPERA ] [ OLTRE ] (Positioned in reachable lower area, not top) */}
              <div className="px-2 py-1 bg-[#ECECE8] border-t border-black flex items-center justify-center shrink-0 select-none">
                <div className="inline-flex items-center p-0.5 bg-[#F8F8F6] border border-black shadow-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode("image")}
                    className="px-3 sm:px-4 py-0.5 sm:py-1 font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer bg-black text-[#F8F8F6] shadow-sm"
                  >
                    OPERA
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("oltre")}
                    className="px-3 sm:px-4 py-0.5 sm:py-1 font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer text-black/60 hover:text-black hover:bg-black/5"
                  >
                    OLTRE
                  </button>
                </div>
              </div>

              {/* Bottom Bar: [ INFORMAZIONI ] | [ CHIUDI ] (No middle button) */}
              <div className="p-1.5 border-t border-black bg-[#F8F8F6] flex items-center justify-between gap-1.5 shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => setViewMode("info")}
                  className="flex-1 py-1.5 px-2 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Info className="w-3 h-3" />
                  <span>INFORMAZIONI</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-1.5 px-2.5 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>CHIUDI</span>
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === "info" && (
          /* ========================================================== */
          /* VIEW 2: INFO ONLY (All essential metadata, fully readable)  */
          /* Scaled down with generous breathing room between columns   */
          /* ========================================================== */
          <motion.div
            key="info-view"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-50 w-[78%] sm:w-[74%] max-w-[310px] sm:max-w-[320px] max-h-[50vh] bg-[#F8F8F6] border-2 border-black shadow-2xl shadow-black/25 flex flex-col overflow-hidden text-black select-none my-auto"
          >
            {/* Header Bar (No top X - close button is exclusively at the bottom) */}
            <div className="h-8 px-2.5 border-b border-black flex items-center justify-between bg-[#F8F8F6] shrink-0">
              <span className="bg-black text-[#F8F8F6] px-1.5 py-0.5 font-display text-[8.5px] font-bold tracking-wider uppercase">
                CASO {item.number} — INFO
              </span>
            </div>

            {/* Essential Content Body */}
            <div className="p-3 flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 min-h-0 bg-[#F8F8F6]">
              {/* Nome caso (Titolo) */}
              <div>
                <h2 className="font-display font-bold text-[12px] sm:text-[12.5px] leading-tight uppercase text-black tracking-tight">
                  {item.title}
                </h2>
                {/* Autore & Anno */}
                <div className="flex items-center gap-1.5 mt-0.5 font-display text-[9px] text-black/70 uppercase tracking-wider font-semibold">
                  <span>{item.authorOrSubject}</span>
                  <span className="text-black/30">•</span>
                  <span>{item.year}</span>
                </div>
              </div>

              {/* Descrizione */}
              <div className="pt-1.5 border-t border-black/15">
                <span className="block font-display font-bold text-[7.5px] uppercase tracking-wider text-black/50 mb-0.5">
                  DESCRIZIONE
                </span>
                <p className="font-body text-[10.5px] leading-relaxed text-black/85 text-justify">
                  {item.sintesiConcettuale || item.excerpt || item.notes}
                </p>
              </div>

              {/* Essential Metadata Grid */}
              <div className="pt-1.5 border-t border-black/15 grid grid-cols-2 gap-x-2.5 gap-y-1.5 text-[10px]">
                <div>
                  <span className="block font-display font-bold text-[7px] uppercase tracking-wider text-black/50">
                    SEGNO
                  </span>
                  <span className="font-body font-semibold text-black text-[10.5px] leading-tight">
                    {item.segno}
                  </span>
                </div>

                <div>
                  <span className="block font-display font-bold text-[7px] uppercase tracking-wider text-black/50">
                    TONO
                  </span>
                  <span className="font-body font-semibold text-black text-[10.5px] leading-tight">
                    {item.tono}
                  </span>
                </div>

                <div>
                  <span className="block font-display font-bold text-[7px] uppercase tracking-wider text-black/50">
                    TIPOLOGIA
                  </span>
                  <span className="font-body font-semibold text-black text-[10.5px] leading-tight">
                    {item.tipologia}
                  </span>
                </div>

                <div>
                  <span className="block font-display font-bold text-[7px] uppercase tracking-wider text-black/50">
                    TIPO DI MEDIA
                  </span>
                  <span className="font-body font-semibold text-black text-[10.5px] leading-tight">
                    {item.tipoDiMedia}
                  </span>
                </div>

                {/* Stile Visivo */}
                <div className="col-span-2 pt-1 border-t border-black/10">
                  <span className="block font-display font-bold text-[7px] uppercase tracking-wider text-black/50">
                    STILE VISIVO
                  </span>
                  <span className="font-body text-black/90 text-[10px] leading-relaxed text-justify block">
                    {item.stileVisivo}
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Toggle: [ OPERA ] [ OLTRE ] (Positioned in reachable lower area, not top) */}
            <div className="px-2 py-1 bg-[#ECECE8] border-t border-black flex items-center justify-center shrink-0 select-none">
              <div className="inline-flex items-center p-0.5 bg-[#F8F8F6] border border-black shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("image")}
                  className="px-3 sm:px-4 py-0.5 sm:py-1 font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer bg-black text-[#F8F8F6] shadow-sm"
                >
                  OPERA
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("oltre")}
                  className="px-3 sm:px-4 py-0.5 sm:py-1 font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer text-black/60 hover:text-black hover:bg-black/5"
                >
                  OLTRE
                </button>
              </div>
            </div>

            {/* Bottom Bar: [ TORNA ALL'OPERA ] | [ CHIUDI ] */}
            <div className="p-1.5 border-t border-black bg-[#F8F8F6] flex items-center justify-between gap-1.5 shrink-0 select-none">
              <button
                type="button"
                onClick={() => setViewMode("image")}
                aria-label="Torna all'opera"
                title="Torna all'opera"
                className="flex-1 py-1.5 px-2 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>TORNA ALL'OPERA</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-1.5 px-2.5 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>CHIUDI</span>
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          </motion.div>
        )}

        {viewMode === "oltre" && (
          /* ========================================================== */
          /* VIEW 3: OLTRE (Categorical Network inspired by oltre.jpg)  */
          /* Horizontal drag-to-scroll rows, active item first & red   */
          /* ========================================================== */
          <motion.div
            key="oltre-view"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-50 flex flex-col w-[96%] sm:w-[94%] max-w-[560px] max-h-[76vh] my-auto bg-[#F8F8F6] border-2 border-black shadow-2xl shadow-black/25 overflow-hidden text-black select-none"
          >
            {/* Header Bar: Only Category number & label (No top X - close button is exclusively at the bottom) */}
            <div className="h-8 px-3 border-b border-black flex items-center justify-between bg-[#F8F8F6] shrink-0 select-none">
              <div className="flex items-center gap-2">
                <span className="font-display text-[10px] font-bold tracking-widest uppercase text-black">
                  {currentCatConfig.num} {currentCatConfig.label}
                </span>
              </div>
            </div>

            {/* Subcategories Horizontal Rows (Scrollable with mouse drag / touch / wheel, no scrollbars) */}
            <div className="p-3 flex-1 min-h-0 bg-[#F8F8F6] overflow-y-auto no-scrollbar flex flex-col gap-2.5 sm:gap-3">
              {currentCatConfig.subcategories.map((subcat) => {
                const list = subcategoryItems[subcat] || [];
                return (
                  <OltreHorizontalRow
                    key={subcat}
                    title={subcat}
                    items={list}
                    currentItemId={item.id}
                    onSelectCase={handleSelectCaseFromOltre}
                  />
                );
              })}
            </div>

            {/* Mode Toggle: [ OPERA ] [ OLTRE ] (Positioned in reachable lower area, not top) */}
            <div className="px-2 py-1 bg-[#ECECE8] border-t border-black flex items-center justify-center shrink-0 select-none">
              <div className="inline-flex items-center p-0.5 bg-[#F8F8F6] border border-black shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("image")}
                  className="px-3 sm:px-4 py-0.5 sm:py-1 font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer text-black/60 hover:text-black hover:bg-black/5"
                >
                  OPERA
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("oltre")}
                  className="px-3 sm:px-4 py-0.5 sm:py-1 font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer bg-black text-[#F8F8F6] shadow-sm"
                >
                  OLTRE
                </button>
              </div>
            </div>

            {/* Bottom Bar: 5 Category Selector tabs & CHIUDI */}
            <div className="p-1.5 border-t border-black bg-[#F8F8F6] flex items-center justify-between gap-1.5 shrink-0 select-none">
              {/* 5 Category Selector tabs (Origine, Intenzione, Sguardo, Scala, Cromia) */}
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar select-none flex-1 min-w-0">
                {OLTRE_CATEGORIES.map((cat) => {
                  const isActive = cat.id === activeCatKey;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCatKey(cat.id)}
                      className={`font-display text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider transition-colors cursor-pointer px-1.5 sm:px-2 py-1 shrink-0 ${
                        isActive
                          ? "bg-black text-[#F8F8F6] border border-black shadow-sm"
                          : "text-black/60 hover:text-black hover:bg-black/5 border border-transparent"
                      }`}
                    >
                      {cat.label.charAt(0) + cat.label.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>

              {/* Close Button in bottom bar */}
              <button
                type="button"
                onClick={onClose}
                className="py-1 px-2.5 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black shadow-sm cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>CHIUDI</span>
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================================================================== */
/* OltreHorizontalRow: Horizontal row with mouse/touch drag-to-scroll,        */
/* wheel support, active case study placed first and highlighted in red.      */
/* ========================================================================== */

interface OltreHorizontalRowProps {
  title: string;
  items: ArchiveItem[];
  currentItemId: string;
  onSelectCase: (item: ArchiveItem) => void;
}

function OltreHorizontalRow({
  title,
  items,
  currentItemId,
  onSelectCase,
}: OltreHorizontalRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  // Sort items: always place the active item at index 0 (first in row)
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.id === currentItemId) return -1;
      if (b.id === currentItemId) return 1;
      return 0;
    });
  }, [items, currentItemId]);

  // Support mouse wheel horizontal scrolling
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Window listeners during pointer down so dragging works smoothly anywhere on screen
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current || !rowRef.current) return;
      const dx = e.clientX - startXRef.current;
      if (Math.abs(dx) > 4) {
        hasDraggedRef.current = true;
        setIsDragging(true);
        rowRef.current.scrollLeft = startScrollLeftRef.current - dx;
      }
    };

    const handleGlobalPointerUp = () => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;
      setIsDragging(false);
      if (hasDraggedRef.current) {
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 80);
      }
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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = rowRef.current?.scrollLeft || 0;
    hasDraggedRef.current = false;
  };

  return (
    <div className="flex flex-col gap-1 border-b border-black/10 last:border-b-0 pb-2">
      {/* Subcategory Label & Count */}
      <div className="flex items-center justify-between px-1 shrink-0 select-none">
        <span className="font-display text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider text-black">
          {title}
        </span>
        <span className="font-display text-[8px] sm:text-[8.5px] font-semibold text-black/40 tracking-wider">
          {sortedItems.length} OPERE
        </span>
      </div>

      {/* Horizontal Drag-To-Scroll Row */}
      <div
        ref={rowRef}
        onPointerDown={handlePointerDown}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        className={`flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 px-1 touch-pan-x select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {sortedItems.map((c) => {
          const isCurrent = c.id === currentItemId;
          return (
            <button
              key={c.id}
              type="button"
              draggable={false}
              title={`Caso ${c.number}: ${c.title}`}
              onClick={(e) => {
                e.stopPropagation();
                if (hasDraggedRef.current) return;
                onSelectCase(c);
              }}
              className={`relative flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-150 select-none ${
                isCurrent
                  ? "w-11 h-11 sm:w-12 sm:h-12 border-2 border-[#FF3B30] ring-2 ring-[#FF3B30]/35 shadow-md shadow-[#FF3B30]/30 scale-105 z-20 bg-white"
                  : "w-10 h-10 sm:w-11 sm:h-11 border border-black/25 hover:border-black hover:scale-105 z-0 bg-[#ECECE8]"
              }`}
            >
              <img
                src={c.thumbnailUrl || c.imageUrl || ""}
                alt={c.title}
                draggable={false}
                loading="lazy"
                className="w-full h-full object-cover block filter-none pointer-events-none"
              />

              {/* Discrete Case Number Tag */}
              <div
                className={`absolute bottom-0 inset-x-0 font-display text-[6.5px] sm:text-[7px] font-bold text-center py-0.2 leading-tight pointer-events-none z-10 uppercase tracking-tighter ${
                  isCurrent ? "bg-[#FF3B30] text-white" : "bg-black/65 text-white/95"
                }`}
              >
                {c.number}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
