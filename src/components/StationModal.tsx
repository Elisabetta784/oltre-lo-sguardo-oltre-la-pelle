"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
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
                  {/* Header row: CASO and back-to-photo button */}
                  <div className="flex items-center justify-between pb-1 shrink-0 select-none border-b border-black/6">
                    <span className="font-display font-bold text-[8.5px] sm:text-[9px] uppercase tracking-wide text-black/60">
                      CASO {item.number}
                    </span>
                    <button
                      type="button"
                      onClick={scrollToTop}
                      className="text-black/50 hover:text-black font-display font-semibold text-[8px] sm:text-[8.5px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Foto</span>
                      <ChevronUp className="w-3 h-3 stroke-[2.5]" />
                    </button>
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
              {/* Header: Category Title without grey enclosing box (matching oltre.jpg) */}
              <div className="px-5 pt-3 pb-1 flex items-center justify-between shrink-0 select-none border-b border-black/8">
                <div className="text-black font-display font-bold text-[8.5px] sm:text-[9px] tracking-wider uppercase">
                  {currentCatConfig.num} {currentCatConfig.label}
                </div>
              </div>

              {/* Opaline Card Carousel with smooth cross-fade between categories */}
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeCatKey}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full flex-1 min-h-0 flex flex-col overflow-hidden"
                  >
                    <OltreCardCarousel
                      key={activeCatKey}
                      categoryConfig={currentCatConfig}
                      subcategoryItems={subcategoryItems}
                      currentItemId={item.id}
                      onSelectCase={handleSelectCaseFromOltre}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 5 Category Selector tabs as squared buttons (matching oltre.jpg) */}
              <div className="px-4 py-1.5 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none border-t border-black/8 bg-white/12 backdrop-blur-xs">
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
                          : "text-black/60 hover:text-black"
                      }`}
                    >
                      {cat.label.charAt(0) + cat.label.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Navigation Bar: [ ← Opera ] and [ (●) OLTRE ] with squared buttons */}
              <div className="px-5 py-2.5 border-t border-black/8 bg-white/20 backdrop-blur-xs flex items-center justify-between shrink-0 select-none">
                {/* Back to Artwork on bottom-left */}
                <button
                  type="button"
                  onClick={() => setViewMode("image")}
                  className="px-3.5 py-1 rounded-none bg-white/70 hover:bg-white text-black font-display font-semibold text-[8.5px] sm:text-[9px] tracking-wide flex items-center gap-1.5 shadow-xs transition-all cursor-pointer border border-black/10 backdrop-blur-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Opera</span>
                </button>

                {/* Active OLTRE toggle on bottom-right (clicking toggles back to artwork) */}
                <button
                  type="button"
                  onClick={() => setViewMode("image")}
                  className="px-3.5 py-1 rounded-none bg-black text-white hover:bg-black/85 font-display font-semibold text-[8.5px] sm:text-[9px] tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  title="Torna all'opera"
                >
                  <span className="w-1.5 h-1.5 rounded-none bg-[#FF3B30] animate-pulse" />
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
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const capturedPointerIdRef = useRef<number | null>(null);

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

  // Pointer drag-to-scroll: never capture pointer on pointerdown so child clicks are always delivered!
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startScrollTopRef.current = scrollRef.current?.scrollTop || 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !scrollRef.current) return;
    const dy = e.clientY - startYRef.current;
    if (Math.abs(dy) > 10) {
      hasDraggedRef.current = true;
      if (!isDragging) setIsDragging(true);

      if (isCenter) {
        if (capturedPointerIdRef.current === null) {
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
            capturedPointerIdRef.current = e.pointerId;
          } catch {}
        }
        scrollRef.current.scrollTop = startScrollTopRef.current - dy;
        checkScroll();
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (capturedPointerIdRef.current !== null) {
      try {
        e.currentTarget.releasePointerCapture(capturedPointerIdRef.current);
      } catch {}
      capturedPointerIdRef.current = null;
    }
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
      <div className="h-8 px-3 border-b border-black/8 flex items-center justify-between bg-white/60 backdrop-blur-xs shrink-0 select-none">
        <span className="font-display font-bold text-[8px] sm:text-[8.5px] uppercase tracking-wider text-black">
          {subcat}
        </span>
        <span className="font-display text-[6.5px] sm:text-[7px] font-semibold text-black/45 tracking-wider">
          {sortedList.length} OPERE
        </span>
      </div>

      {/* Card Body: Cluster / Grid of Thumbnails with drag-to-scroll and wheel scroll */}
      <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden bg-white/12 backdrop-blur-xs">
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
            isCenter ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
          }`}
        >
          {sortedList.length === 0 ? (
            <div className="h-full min-h-[160px] flex flex-col items-center justify-center p-4 text-center select-none">
              <span className="font-display text-[7.5px] sm:text-[8px] uppercase tracking-wider text-black/35 font-medium">
                Nessuna opera presente
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 items-center justify-items-center pb-2.5">
              {sortedList.map((c) => {
                const isCurrent = c.id === currentItemId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    title={`Caso ${c.number}: ${c.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Only allow selecting a case study if this card is in focus at the center
                      if (!isCenter) return;
                      // Prevent clicking if the user was dragging to scroll
                      if (isDragging) return;
                      onSelectCase(c);
                    }}
                    className={`relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 overflow-hidden rounded-none transition-all duration-150 select-none bg-[#ECECE8] z-10 ${
                      isCenter ? "cursor-pointer" : "pointer-events-none"
                    } ${
                      isCurrent
                        ? "ring-2 ring-[#FF3B30] shadow-md shadow-[#FF3B30]/35 scale-105"
                        : isCenter
                        ? "hover:scale-105 shadow-2xs border-0"
                        : "shadow-2xs border-0"
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
          )}
        </div>

        {/* Bottom soft fade when more items exist below */}
        {canScrollDown && (
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-[#FAFAF8]/80 to-transparent z-10" />
        )}
      </div>
    </>
  );
}

/**
 * Determines the best card to present initially in the 3D carousel.
 * Guarantees that an empty card (0 items) is NEVER presented as the initial/central card.
 * Prioritizes the active case study's subcategory if it has items;
 * otherwise selects the non-empty subcategory closest to the nominal center.
 */
function getInitialActiveCardIdx(
  subcategories: string[],
  subcategoryItems: Record<string, ArchiveItem[]>,
  currentItemId: string
): number {
  if (subcategories.length === 0) return 0;

  // 1. If the currently viewed case study belongs to one of the subcategories and it has items, center it!
  const currentSubIdx = subcategories.findIndex((sub) => {
    const list = subcategoryItems[sub] || [];
    return list.some((item) => item.id === currentItemId);
  });
  if (currentSubIdx !== -1 && (subcategoryItems[subcategories[currentSubIdx]] || []).length > 0) {
    return currentSubIdx;
  }

  // 2. Identify all non-empty subcategories (items.length > 0)
  const nonEmptyIndices = subcategories
    .map((sub, i) => ((subcategoryItems[sub] || []).length > 0 ? i : -1))
    .filter((i) => i !== -1);

  // Fallback if all subcategories are empty
  if (nonEmptyIndices.length === 0) {
    return Math.floor(subcategories.length / 2);
  }

  // 3. Pick the non-empty card closest to the nominal center so populated cards are immediately visible
  const nominalCenter = Math.floor(subcategories.length / 2);
  let bestIdx = nonEmptyIndices[0];
  let minDistance = Math.abs(bestIdx - nominalCenter);

  for (const idx of nonEmptyIndices) {
    const dist = Math.abs(idx - nominalCenter);
    if (dist < minDistance) {
      minDistance = dist;
      bestIdx = idx;
    }
  }

  return bestIdx;
}

function OltreCardCarousel({
  categoryConfig,
  subcategoryItems,
  currentItemId,
  onSelectCase,
}: OltreCardCarouselProps) {
  const numCards = categoryConfig.subcategories.length;

  // Never pick an empty card (0 items) as the central/initial card
  const [activeCardIdx, setActiveCardIdx] = useState(() =>
    getInitialActiveCardIdx(categoryConfig.subcategories, subcategoryItems, currentItemId)
  );

  // Keyboard navigation: Left/Right arrows to cycle smoothly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveCardIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveCardIdx((prev) => Math.min(numCards - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numCards]);

  // Touch swipe support to smoothly slide carousel left/right without wrapping jumps
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    const dy = e.changedTouches[0].clientY - touchStartYRef.current;

    // Trigger swipe if horizontal drag is dominant
    if (Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) {
        // Swiped left -> next card
        setActiveCardIdx((prev) => Math.min(numCards - 1, prev + 1));
      } else {
        // Swiped right -> prev card
        setActiveCardIdx((prev) => Math.max(0, prev - 1));
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full flex-1 min-h-0 flex flex-col items-center justify-between py-1 px-2 select-none overflow-hidden"
    >
      {/* Flat Opaline Carousel: center card in focus, side cards flat 2D & blurred opalino */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[235px] sm:min-h-[250px] overflow-hidden">
        {categoryConfig.subcategories.map((subcat, idx) => {
          // Linear distance relative to active card
          const distance = idx - activeCardIdx;
          const isCenter = distance === 0;

          // Smooth 2D positioning on horizontal track:
          // Cards move in complete unison in the same direction, eliminating sudden wrap-around jumps
          let x = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 30;
          let pointerEvents: "auto" | "none" = "auto";

          if (distance === 0) {
            x = 0;
            scale = 1;
            opacity = 1;
            zIndex = 30;
            pointerEvents = "auto";
          } else if (distance === -1) {
            x = -150;
            scale = 0.94;
            opacity = 0.85;
            zIndex = 15;
            pointerEvents = "auto";
          } else if (distance === 1) {
            x = 150;
            scale = 0.94;
            opacity = 0.85;
            zIndex = 15;
            pointerEvents = "auto";
          } else if (distance < -1) {
            x = -230;
            scale = 0.88;
            opacity = 0;
            zIndex = 5;
            pointerEvents = "none";
          } else if (distance > 1) {
            x = 230;
            scale = 0.88;
            opacity = 0;
            zIndex = 5;
            pointerEvents = "none";
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
                scale,
                opacity,
                zIndex,
              }}
              transition={{
                duration: 0.38,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() => {
                if (!isCenter) {
                  setActiveCardIdx(idx);
                }
              }}
              style={{
                willChange: "transform, opacity",
                pointerEvents,
              }}
              className={`absolute top-1/2 left-1/2 w-[175px] sm:w-[190px] h-[225px] sm:h-[245px] -mt-[112px] sm:-mt-[122px] -ml-[87px] sm:-ml-[95px] rounded-none border border-black/10 flex flex-col overflow-hidden transition-[box-shadow,background-color] duration-300 ${
                isCenter
                  ? "bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/15 ring-1 ring-white/80 cursor-default"
                  : "bg-white/50 backdrop-blur-md shadow-md shadow-black/[0.04] cursor-pointer hover:opacity-100"
              }`}
            >
              {/* Opaline frosted veil over side cards: catches clicks to bring the card to center without opening any case study */}
              <motion.div
                initial={false}
                animate={{ opacity: isCenter ? 0 : 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isCenter) {
                    setActiveCardIdx(idx);
                  }
                }}
                className={`absolute inset-0 z-20 ${
                  isCenter
                    ? "pointer-events-none"
                    : "pointer-events-auto cursor-pointer"
                } bg-white/40 backdrop-blur-[3px]`}
                title="Tocca per mettere a fuoco questa scheda"
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

      {/* Subcategory Indicator Dots (Clickable, reactive, smooth) */}
      <div className="h-6 flex items-center justify-center gap-1.5 w-full shrink-0 select-none mt-1">
        {categoryConfig.subcategories.map((sub, i) => (
          <button
            key={sub}
            type="button"
            onClick={() => setActiveCardIdx(i)}
            aria-label={`Vai a ${sub}`}
            title={sub}
            className="p-1.5 flex items-center justify-center cursor-pointer group"
          >
            <span
              className={`block transition-all duration-200 rounded-none ${
                i === activeCardIdx
                  ? "w-4 h-1.5 bg-black"
                  : "w-1.5 h-1.5 bg-black/25 group-hover:bg-black/50"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
