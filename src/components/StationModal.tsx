"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
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

  // Drag-to-scroll logic for INFO text view (no scrollbar, cursor drag)
  const infoScrollRef = useRef<HTMLDivElement>(null);
  const isInfoPointerDownRef = useRef(false);
  const infoStartYRef = useRef(0);
  const infoStartScrollTopRef = useRef(0);
  const [isInfoDragging, setIsInfoDragging] = useState(false);

  const handleInfoPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isInfoPointerDownRef.current = true;
    infoStartYRef.current = e.clientY;
    infoStartScrollTopRef.current = infoScrollRef.current?.scrollTop || 0;
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isInfoPointerDownRef.current || !infoScrollRef.current) return;
      const dy = e.clientY - infoStartYRef.current;
      if (Math.abs(dy) > 3) {
        setIsInfoDragging(true);
        infoScrollRef.current.scrollTop = infoStartScrollTopRef.current - dy;
      }
    };

    const handleGlobalPointerUp = () => {
      if (!isInfoPointerDownRef.current) return;
      isInfoPointerDownRef.current = false;
      setIsInfoDragging(false);
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
    <div className="absolute inset-0 z-40 flex items-center justify-center p-2 sm:p-3 pointer-events-auto overflow-hidden">
      {/* 1. Backdrop: touching outside the modal window closes it */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={onClose}
        style={maskStyle}
        className="absolute inset-0 z-30 bg-black/35 backdrop-blur-[3px] cursor-pointer"
        aria-label="Tocca fuori per chiudere"
      />

      {/* 2. Unified Morphing Modal Window (Squadrata, restored original #F6F6F4 color with subtle frosted glass transparency) */}
      <motion.div
        key="station-modal-unified"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 flex flex-col my-auto border border-black/10 shadow-2xl shadow-black/25 overflow-hidden text-black select-none rounded-none bg-[#F6F6F4]/82 backdrop-blur-2xl w-[94%] sm:w-[92%] max-w-[540px] sm:max-w-[580px] h-[450px] sm:h-[480px] max-h-[64vh] transition-[max-width,width,max-height,height] duration-280 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {/* =============================================================== */}
          {/* VIEW: IMAGE / FOTO (Natural aspect ratio, frosted glass borders)*/}
          {/* =============================================================== */}
          {viewMode === "image" && (
            <motion.div
              key="view-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none"
            >
              {/* Floating Pill Badge: CASO XX (top-left, matching foto.png) */}
              <div className="absolute top-3.5 left-4 z-20 px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-md text-black font-display font-semibold text-[10px] sm:text-[10.5px] uppercase tracking-wider border border-black/5 shadow-xs pointer-events-none">
                CASO {item.number}
              </div>

              {/* Artwork Image maintaining its original aspect ratio, letterboxed with transparent glass style */}
              <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-5 overflow-hidden select-none">
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

                {/* Circular Gallery Navigation Arrows (matching foto.png) */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8.5 h-8.5 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-md text-black flex items-center justify-center active:scale-95 transition-all shadow-md cursor-pointer border border-black/5"
                      title="Immagine precedente"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgIdx((prev) => (prev + 1) % allImages.length);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8.5 h-8.5 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-md text-black flex items-center justify-center active:scale-95 transition-all shadow-md cursor-pointer border border-black/5"
                      title="Immagine successiva"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </>
                )}

                {/* Floating INFO pill button (bottom-center, strictly matching foto.png) */}
                <button
                  type="button"
                  onClick={() => setViewMode("info")}
                  className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 px-6 py-1.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-black font-display font-bold text-[10.5px] sm:text-[11px] tracking-widest uppercase active:scale-95 transition-all cursor-pointer shadow-md border border-black/5"
                >
                  INFO
                </button>
              </div>
            </motion.div>
          )}

          {/* =============================================================== */}
          {/* VIEW: INFO (Squadrata, comfortable & readable on LED wall)      */}
          {/* =============================================================== */}
          {viewMode === "info" && (
            <motion.div
              key="view-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative w-full h-full flex flex-col overflow-hidden select-none"
            >
              {/* Header: CASO XX (top-left, NO 'X' in top-right) */}
              <div className="px-5 pt-3.5 pb-1 shrink-0 select-none">
                <span className="font-display font-semibold text-[10.5px] sm:text-[11px] uppercase tracking-wide text-black">
                  CASO {item.number}
                </span>
              </div>

              {/* Scrollable Body: Title, Subtitle, Description, Metadata */}
              <div
                ref={infoScrollRef}
                onPointerDown={handleInfoPointerDown}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
                className={`px-5 py-2 flex flex-col gap-2 overflow-y-auto no-scrollbar flex-1 min-h-0 select-none touch-pan-y ${
                  isInfoDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                {/* Title (matching info.png: e.g. ARR/SCARS) */}
                <h2 className="font-display font-black text-[17px] sm:text-[19px] leading-tight uppercase text-black tracking-tight">
                  {item.title}
                </h2>

                {/* Subtitle: Author & Year */}
                <p className="font-display text-[11px] sm:text-[11.5px] text-black/70 font-medium -mt-1">
                  {item.authorOrSubject} {item.year ? `— ${item.year}` : ""}
                </p>

                {/* Section Descrizione */}
                <div className="mt-1">
                  <span className="block font-display font-semibold text-[9.5px] text-black/40 uppercase tracking-wider mb-1">
                    Descrizione
                  </span>
                  <p className="font-body text-[11px] sm:text-[11.5px] leading-relaxed text-black/85 text-justify">
                    {item.sintesiConcettuale || item.excerpt || item.notes}
                  </p>
                </div>

                {/* Metadata Grid (matching info.png, comfortable on wall) */}
                <div className="mt-2 pt-2.5 border-t border-black/8 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2.5 text-[10px]">
                  <div>
                    <span className="block font-display font-medium text-[8.5px] uppercase tracking-wider text-black/40">
                      Segno
                    </span>
                    <span className="font-body font-semibold text-black text-[10.5px] leading-tight block mt-0.5">
                      {item.segno || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="block font-display font-medium text-[8.5px] uppercase tracking-wider text-black/40">
                      Tono
                    </span>
                    <span className="font-body font-semibold text-black text-[10.5px] leading-tight block mt-0.5">
                      {item.tono || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="block font-display font-medium text-[8.5px] uppercase tracking-wider text-black/40">
                      Tipologia
                    </span>
                    <span className="font-body font-semibold text-black text-[10.5px] leading-tight block mt-0.5">
                      {item.tipologia || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="block font-display font-medium text-[8.5px] uppercase tracking-wider text-black/40">
                      Media
                    </span>
                    <span className="font-body font-semibold text-black text-[10.5px] leading-tight block mt-0.5">
                      {item.tipoDiMedia || "—"}
                    </span>
                  </div>

                  {item.stileVisivo && (
                    <div className="col-span-2 sm:col-span-4 pt-2 border-t border-black/8">
                      <span className="block font-display font-medium text-[8.5px] uppercase tracking-wider text-black/40">
                        Stile visivo
                      </span>
                      <span className="font-body text-black/85 text-[10px] sm:text-[10.5px] leading-relaxed text-justify block mt-0.5">
                        {item.stileVisivo}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Navigation Bar: [ ← Preview ] and [ (●) OLTRE ] */}
              <div className="px-5 py-2.5 border-t border-black/8 flex items-center justify-between shrink-0 select-none">
                {/* Preview Button on bottom-left */}
                <button
                  type="button"
                  onClick={() => setViewMode("image")}
                  className="px-4 py-1.5 rounded-full bg-white/80 hover:bg-white text-black font-display font-semibold text-[10.5px] tracking-wide flex items-center gap-1.5 shadow-xs transition-all cursor-pointer border border-black/5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                {/* OLTRE Toggle Capsule on bottom-right */}
                <button
                  type="button"
                  onClick={() => setViewMode("oltre")}
                  className="px-4 py-1.5 rounded-full bg-black text-white hover:bg-black/85 font-display font-semibold text-[10.5px] tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-white/90" />
                  <span>OLTRE</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* =============================================================== */}
          {/* VIEW: OLTRE (Squadrata, matching oltree.jpg and oltre.jpg)      */}
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
              {/* Header: Category Badge (NO 'X' in top-right) */}
              <div className="px-5 pt-3 pb-0.5 flex items-center justify-between shrink-0 select-none">
                <div className="px-3.5 py-1 rounded-full bg-black/5 text-black font-display font-bold text-[9.5px] tracking-wider uppercase border border-black/5">
                  {currentCatConfig.num} {currentCatConfig.label}
                </div>
              </div>

              {/* 3D Perspective Card Carousel */}
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <OltreCardCarousel
                  categoryConfig={currentCatConfig}
                  subcategoryItems={subcategoryItems}
                  currentItemId={item.id}
                  onSelectCase={handleSelectCaseFromOltre}
                />
              </div>

              {/* 5 Category Selector tabs as rounded pill buttons */}
              <div className="px-4 py-1.5 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none border-t border-black/6">
                {OLTRE_CATEGORIES.map((cat) => {
                  const isActive = cat.id === activeCatKey;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCatKey(cat.id)}
                      className={`font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer px-3 py-1 rounded-full ${
                        isActive
                          ? "bg-black text-white shadow-xs"
                          : "text-black/60 hover:text-black hover:bg-black/5"
                      }`}
                    >
                      {cat.label.charAt(0) + cat.label.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Navigation Bar: [ ← Info ] and [ (●) OLTRE ] */}
              <div className="px-5 py-2.5 border-t border-black/8 flex items-center justify-between shrink-0 select-none">
                {/* Back to Info on bottom-left */}
                <button
                  type="button"
                  onClick={() => setViewMode("info")}
                  className="px-4 py-1.5 rounded-full bg-white/80 hover:bg-white text-black font-display font-semibold text-[10.5px] tracking-wide flex items-center gap-1.5 shadow-xs transition-all cursor-pointer border border-black/5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Info</span>
                </button>

                {/* Active OLTRE toggle on bottom-right (clicking toggles back to info) */}
                <button
                  type="button"
                  onClick={() => setViewMode("info")}
                  className="px-4 py-1.5 rounded-full bg-black text-white hover:bg-black/85 font-display font-semibold text-[10.5px] tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  title="Torna alle informazioni"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
                  <span>OLTRE</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ========================================================================== */
/* OltreCardCarousel: 3D perspective revolving cards matching oltree.jpg      */
/* Inside each card: cluster/mosaic of artworks matching oltre.jpg            */
/* ========================================================================== */

interface OltreCardCarouselProps {
  categoryConfig: OltreCategoryConfig;
  subcategoryItems: Record<string, ArchiveItem[]>;
  currentItemId: string;
  onSelectCase: (item: ArchiveItem) => void;
}

/* ========================================================================== */
/* OltreCardContent: subcategory header & draggable artwork cluster          */
/* Allows smooth mouse/touch drag-to-scroll and wheel scroll with indicators  */
/* ========================================================================== */

interface OltreCardContentProps {
  subcat: string;
  sortedList: ArchiveItem[];
  isCenter: boolean;
  currentItemId: string;
  onSelectCase: (item: ArchiveItem) => void;
}

function OltreCardContent({
  subcat,
  sortedList,
  isCenter,
  currentItemId,
  onSelectCase,
}: OltreCardContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef(false);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 6);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 6);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(checkScroll, 80);
    return () => clearTimeout(timeout);
  }, [sortedList, isCenter, checkScroll]);

  // Pointer drag-to-scroll
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isCenter) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    startYRef.current = e.clientY;
    startScrollTopRef.current = scrollRef.current?.scrollTop || 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !scrollRef.current) return;
    const dy = e.clientY - startYRef.current;
    if (Math.abs(dy) > 4) {
      hasDraggedRef.current = true;
      if (!isDragging) setIsDragging(true);
      scrollRef.current.scrollTop = startScrollTopRef.current - dy;
      checkScroll();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    isPointerDownRef.current = false;
    setTimeout(() => {
      setIsDragging(false);
      hasDraggedRef.current = false;
    }, 60);
  };

  // Wheel scroll with explicit scrollTop update (ensures 100% reliable scrolling in 3D perspective)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isCenter) return;
    e.stopPropagation();
    if (scrollRef.current) {
      scrollRef.current.scrollTop += e.deltaY;
      checkScroll();
    }
  };

  return (
    <>
      {/* Card Header: Subcategory Title (oltre.jpg) */}
      <div className="h-8 px-3 border-b border-black/8 flex items-center justify-between bg-white shrink-0 select-none">
        <span className="font-display font-bold text-[9.5px] sm:text-[10px] uppercase tracking-wider text-black">
          {subcat}
        </span>
        <span className="font-display text-[7.5px] sm:text-[8px] font-semibold text-black/45 tracking-wider">
          {sortedList.length} OPERE
        </span>
      </div>

      {/* Card Body: Cluster / Grid of Thumbnails with drag-to-scroll and wheel scroll */}
      <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden bg-[#FAFAF8]">
        {/* Top fade when scrolled down */}
        {canScrollUp && (
          <div className="pointer-events-none absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-black/8 to-transparent z-10" />
        )}

        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          onScroll={checkScroll}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
          className={`p-2 sm:p-2.5 flex-1 min-h-0 overflow-y-auto no-scrollbar touch-pan-y select-none ${
            isCenter ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-pointer"
          }`}
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 items-center justify-items-center pb-2.5">
            {sortedList.map((c) => {
              const isCurrent = c.id === currentItemId;
              return (
                <button
                  key={c.id}
                  type="button"
                  title={`Caso ${c.number}: ${c.title}`}
                  onClick={(e) => {
                    if (!isCenter) return;
                    e.stopPropagation();
                    // Prevent clicking if the user was dragging to scroll
                    if (hasDraggedRef.current) return;
                    onSelectCase(c);
                  }}
                  className={`relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 overflow-hidden rounded-none transition-all duration-150 select-none bg-[#ECECE8] ${
                    isCenter ? "cursor-pointer" : "cursor-default pointer-events-none"
                  } ${
                    isCurrent
                      ? "ring-2 ring-[#FF3B30] shadow-md shadow-[#FF3B30]/35 scale-105 z-10"
                      : "hover:scale-105 shadow-2xs border-0"
                  }`}
                >
                  <img
                    src={c.thumbnailUrl || c.imageUrl || ""}
                    alt={c.title}
                    draggable={false}
                    loading="lazy"
                    className="w-full h-full object-cover block filter-none pointer-events-none rounded-none"
                  />

                  {/* Case Number Tag */}
                  <div
                    className={`absolute bottom-0 inset-x-0 font-display text-[6px] font-bold text-center py-0.2 leading-tight pointer-events-none z-10 uppercase tracking-tighter rounded-none ${
                      isCurrent ? "bg-[#FF3B30] text-white" : "bg-black/55 text-white/95"
                    }`}
                  >
                    {c.number}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom soft fade when more items exist below */}
        {canScrollDown && (
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-[#FAFAF8]/80 to-transparent z-10" />
        )}
      </div>
    </>
  );
}

function OltreCardCarousel({
  categoryConfig,
  subcategoryItems,
  currentItemId,
  onSelectCase,
}: OltreCardCarouselProps) {
  const numCards = categoryConfig.subcategories.length;
  // Start on the central card so other cards are immediately visible flanking on both sides
  const defaultCenterIdx = Math.floor(numCards / 2);
  const [activeCardIdx, setActiveCardIdx] = useState(defaultCenterIdx);

  // When category changes, reset to the central card so cards are immediately visible on both sides
  useEffect(() => {
    const subcats = categoryConfig.subcategories;
    const centerIdx = Math.floor(subcats.length / 2);
    setActiveCardIdx(centerIdx);
  }, [categoryConfig.id, categoryConfig.subcategories]);

  return (
    <div className="relative w-full flex-1 min-h-0 flex flex-col items-center justify-between py-1 px-2 select-none overflow-hidden">
      {/* 3D Perspective Scene strictly matching oltree.jpg (squadrata and compact for wall) */}
      <div
        style={{ perspective: "950px", perspectiveOrigin: "center center" }}
        className="relative w-full flex-1 flex items-center justify-center min-h-[285px] sm:min-h-[305px] overflow-hidden"
      >
        {categoryConfig.subcategories.map((subcat, idx) => {
          // Circular offset: guarantees there is always a card on the left and right in the loop
          let offset = (idx - activeCardIdx) % numCards;
          if (offset > Math.floor(numCards / 2)) offset -= numCards;
          if (offset < -Math.floor((numCards - 1) / 2)) offset += numCards;

          const isCenter = offset === 0;

          // 3D positioning and perspective rotation strictly matching oltree.jpg:
          // Center card: flat, front and center (z = 0, rotateY = 0)
          // Left card (offset = -1): turned inwards toward center, inner edge tall, outer edge short (rotateY = -58deg, z = -55px)
          // Right card (offset = 1): turned inwards toward center, inner edge tall, outer edge short (rotateY = 58deg, z = -55px)
          let x = 0;
          let z = 0;
          let rotateY = 0;
          let opacity = 1;
          let zIndex = 30;

          if (offset === 0) {
            x = 0;
            z = 0;
            rotateY = 0;
            opacity = 1;
            zIndex = 30;
          } else if (offset === -1) {
            x = -150;
            z = -55;
            rotateY = -58;
            opacity = 0.92;
            zIndex = 15;
          } else if (offset === 1) {
            x = 150;
            z = -55;
            rotateY = 58;
            opacity = 0.92;
            zIndex = 15;
          } else if (offset < -1) {
            x = -225;
            z = -140;
            rotateY = -70;
            opacity = 0;
            zIndex = 5;
          } else if (offset > 1) {
            x = 225;
            z = -140;
            rotateY = 70;
            opacity = 0;
            zIndex = 5;
          }

          const rawList = subcategoryItems[subcat] || [];
          // Sort items: place active case first if in this subcategory
          const sortedList = [...rawList].sort((a, b) => {
            if (a.id === currentItemId) return -1;
            if (b.id === currentItemId) return 1;
            return 0;
          });

          return (
            <motion.div
              key={subcat}
              initial={false}
              animate={{
                x,
                z,
                rotateY,
                opacity,
                zIndex,
              }}
              transition={{
                duration: 0.38,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => {
                if (!isCenter) {
                  setActiveCardIdx(idx);
                }
              }}
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
              className={`absolute top-1/2 left-1/2 w-[200px] sm:w-[215px] h-[265px] sm:h-[285px] -mt-[132px] sm:-mt-[142px] -ml-[100px] sm:-ml-[108px] bg-white rounded-none shadow-xl shadow-black/10 border border-black/8 flex flex-col overflow-hidden transition-shadow ${
                isCenter
                  ? "cursor-default shadow-2xl shadow-black/20"
                  : "cursor-pointer hover:opacity-100"
              }`}
            >
              {/* Subtle 3D perspective shading overlay on receding side cards (oltree.jpg) */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 ${
                  isCenter ? "opacity-0" : "opacity-12 bg-black"
                }`}
              />

              {/* Card Header & Scrollable Body with Drag-to-Scroll & Wheel */}
              <OltreCardContent
                subcat={subcat}
                sortedList={sortedList}
                isCenter={isCenter}
                currentItemId={currentItemId}
                onSelectCase={onSelectCase}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Carousel Navigation (Circular Prev / Next matching foto.png & Dots) */}
      <div className="h-7 px-3 flex items-center justify-between w-full max-w-[340px] shrink-0 select-none mt-1">
        <button
          type="button"
          onClick={() => setActiveCardIdx((prev) => (prev - 1 + numCards) % numCards)}
          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-xs border border-black/10 cursor-pointer transition-all active:scale-95"
          title="Precedente"
        >
          <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        {/* Subcategory Dots */}
        <div className="flex items-center gap-1.5">
          {categoryConfig.subcategories.map((sub, i) => (
            <button
              key={sub}
              type="button"
              onClick={() => setActiveCardIdx(i)}
              aria-label={sub}
              className={`transition-all cursor-pointer rounded-full ${
                i === activeCardIdx
                  ? "w-4 h-1.5 bg-black"
                  : "w-1.5 h-1.5 bg-black/25 hover:bg-black/50"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setActiveCardIdx((prev) => (prev + 1) % numCards)}
          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-xs border border-black/10 cursor-pointer transition-all active:scale-95"
          title="Successivo"
        >
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
