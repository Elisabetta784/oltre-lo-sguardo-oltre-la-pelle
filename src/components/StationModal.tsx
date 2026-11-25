"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { ArchiveItem, ARCHIVE_ITEMS, ARCHIVE_ASPECT_RATIOS } from "@/data/archiveData";
import {
  OLTRE_CATEGORIES,
  OltreCategoryKey,
  getItemsByOltreCategory,
  getOltreCategoryForCase,
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

  // Image details and the compact narrative grid share the same modal.
  const [viewMode, setViewMode] = useState<"image" | "oltre">("image");
  const [imgIdx, setImgIdx] = useState(0);

  // Active category in Oltre view (defaults to category of current item)
  const [activeCatKey, setActiveCatKey] = useState<OltreCategoryKey>(() =>
    getOltreCategoryForCase(initialItem.id)
  );

  useEffect(() => {
    setActiveCatKey(getOltreCategoryForCase(item.id));
  }, [item.id]);

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

  // Oltre category config and items
  const currentCatConfig = useMemo(
    () => OLTRE_CATEGORIES.find((c) => c.id === activeCatKey) || OLTRE_CATEGORIES[0],
    [activeCatKey]
  );

  const categoryItems = useMemo(
    () => getItemsByOltreCategory(ARCHIVE_ITEMS, activeCatKey),
    [activeCatKey]
  );

  const [oltreGridElement, setOltreGridElement] = useState<HTMLDivElement | null>(null);
  const [oltreGridColumns, setOltreGridColumns] = useState(5);

  useEffect(() => {
    if (!oltreGridElement) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const count = categoryItems.length;
      const gap = 6;
      let bestColumns = 1;
      let bestSize = 0;
      for (let columns = 1; columns <= count; columns++) {
        const rows = Math.ceil(count / columns);
        const size = Math.min(
          (width - gap * (columns - 1)) / columns,
          (height - gap * (rows - 1)) / rows
        );
        if (size > bestSize) {
          bestSize = size;
          bestColumns = columns;
        }
      }
      setOltreGridColumns(bestColumns);
    });
    observer.observe(oltreGridElement);
    return () => observer.disconnect();
  }, [oltreGridElement, categoryItems.length]);

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
        className={`relative z-50 flex flex-col shrink-0 border-0 border-none ring-0 outline-none shadow-2xl shadow-black/[0.08] overflow-hidden text-black select-none rounded-none bg-white/[0.25] backdrop-blur-[12px] w-[88%] sm:w-[84%] max-w-[430px] sm:max-w-[465px] ${viewMode === "oltre" ? "h-[560px] sm:h-[600px] max-h-[82vh]" : "h-[430px] sm:h-[465px] max-h-[66vh]"} transition-[max-width,width,max-height,height] duration-280 ease-[cubic-bezier(0.22,1,0.36,1)]`}
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
                <div className="relative w-full h-[430px] sm:h-[465px] max-h-[66vh] shrink-0 flex flex-col justify-between overflow-hidden select-none">
                  {/* Floating Badge: CASO XX (top-left, squadrato glass, no borders, sheer) */}
                  <div className="absolute top-3.5 left-4 z-20 px-3 py-0.5 rounded-none bg-white/[0.18] backdrop-blur-sm text-black font-display font-semibold text-[8px] sm:text-[8.5px] uppercase tracking-wider border-0 border-none shadow-2xs pointer-events-none">
                    CASO {item.number}
                  </div>

                  {/* Artwork Image Area (Clean, Unobstructed - gallery arrows NEVER overlay the image) */}
                  <div className="flex-1 min-h-0 w-full flex items-center justify-center pt-8 pb-1 px-4 sm:px-6 overflow-hidden">
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
                  </div>

                  {/* Gallery Navigation: Dedicated row BELOW the artwork, ONLY when there are multiple images */}
                  {allImages.length > 1 && (
                    <div className="shrink-0 w-full flex items-center justify-center gap-2.5 py-1 z-20 select-none">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImgIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
                        }}
                        className="w-6 h-6 rounded-none bg-white/[0.18] hover:bg-white/[0.35] backdrop-blur-sm text-black flex items-center justify-center active:scale-95 transition-all shadow-2xs cursor-pointer border-0 border-none"
                        title="Immagine precedente"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <span className="font-display font-bold text-[8.5px] uppercase tracking-widest text-black/60 select-none px-1">
                        {imgIdx + 1} / {allImages.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImgIdx((prev) => (prev + 1) % allImages.length);
                        }}
                        className="w-6 h-6 rounded-none bg-white/[0.18] hover:bg-white/[0.35] backdrop-blur-sm text-black flex items-center justify-center active:scale-95 transition-all shadow-2xs cursor-pointer border-0 border-none"
                        title="Immagine successiva"
                      >
                        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  )}

                  {/* VISIBLE SCROLL DIVIDER & DISTINCTIVE SCROLL-DOWN ACTION */}
                  <div className="w-full shrink-0 relative flex items-center justify-center py-2 px-4 border-t border-black/15 bg-white/20 backdrop-blur-xs select-none">
                    <button
                      type="button"
                      onClick={scrollToInfo}
                      className="group flex items-center gap-2 px-3.5 py-1 bg-black text-white hover:bg-black/85 rounded-none font-display font-semibold text-[8px] sm:text-[8.5px] uppercase tracking-wider shadow-sm transition-all cursor-pointer border-0 border-none"
                      title="Scorri verso le informazioni del caso studio"
                    >
                      <span>Scorri per le info</span>
                      <ChevronDown className="w-3.5 h-3.5 stroke-[2.5] text-white animate-bounce" />
                    </button>
                  </div>
                </div>

                {/* SCREEN 2: Info Content Arriving by Scrolling */}
                <div
                  id="station-modal-info-section"
                  className="w-full shrink-0 flex flex-col justify-center px-5 py-4 border-t border-black/8 bg-white/[0.12] backdrop-blur-xs select-none h-[430px] sm:h-[465px] min-h-[430px] sm:min-h-[465px]"
                >
                  {/* Centered vertically inside the riquadro with balanced space above & below */}
                  <div className="w-full my-auto flex flex-col gap-2">
                    {/* Header row: CASO (left-aligned as previous version) */}
                    <div className="flex items-center justify-between pb-1 shrink-0 select-none border-b border-black/6">
                      <span className="font-display font-bold text-[8.5px] sm:text-[9px] uppercase tracking-wide text-black/60">
                        CASO {item.number}
                      </span>
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
                          <span className="font-body text-black/90 text-[8.5px] sm:text-[9px] leading-relaxed text-left text-pretty hyphens-auto block mt-0.5">
                            {item.stileVisivo?.replace(/\s+/g, ' ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions inside Info section: [ ↑ Torna su ] and [ (●) OLTRE ] */}
                    <div className="mt-2 pt-2 border-t border-black/8 flex items-center justify-between shrink-0 select-none pb-1">
                      <button
                        type="button"
                        onClick={scrollToTop}
                        className="px-3 py-1 rounded-none bg-white/[0.18] hover:bg-white/[0.35] backdrop-blur-sm text-black font-display font-semibold text-[8px] sm:text-[8.5px] tracking-wider uppercase flex items-center gap-1 shadow-2xs transition-all cursor-pointer border-0 border-none"
                      >
                        <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Torna su</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewMode("oltre")}
                        className="px-3.5 py-1 rounded-none bg-black text-white hover:bg-black/85 font-display font-semibold text-[8px] sm:text-[8.5px] tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border-0 border-none"
                      >
                        <span className="w-1.5 h-1.5 rounded-none bg-white/90" />
                        <span>OLTRE</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* =============================================================== */}
          {/* VIEW: OLTRE (Griglia squadrata matching oltre.jpg)              */}
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
              <div className="px-5 pt-3.5 pb-2.5 flex flex-col gap-1.5 shrink-0 select-none border-b border-black/8 bg-white/20 backdrop-blur-xs">
                <h2 className="font-display font-black text-[12px] sm:text-[13px] tracking-wider uppercase">
                  Narrazioni
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9.5px] font-bold text-black/60 tracking-wider">
                      {currentCatConfig.num}
                    </span>
                    <h3 className="font-display font-black text-[12px] sm:text-[13px] tracking-wider uppercase text-black whitespace-nowrap">
                      {currentCatConfig.label}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-none bg-white/[0.22] text-black font-mono text-[8px] tracking-widest font-semibold border-0">
                    {categoryItems.length} OPERE
                  </span>
                </div>
                <p className="font-body text-[10px] sm:text-[11px] text-black/85 leading-[1.4]">
                  {currentCatConfig.description}
                </p>
              </div>

              {/* Both axes share the available space: every case fits on one page. */}
              <div className="flex-1 min-h-0 p-3 sm:p-4">
                  <div
                    ref={setOltreGridElement}
                    className="grid w-full h-full min-h-0 gap-1.5"
                    style={{
                      gridTemplateColumns: `repeat(${oltreGridColumns}, minmax(0, 1fr))`,
                      gridTemplateRows: `repeat(${Math.max(1, Math.ceil(categoryItems.length / oltreGridColumns))}, minmax(0, 1fr))`,
                    }}
                  >
                    {categoryItems.map((c) => {
                      const isSelected = c.id === item.id;
                      const imgSrc =
                        c.imageUrl ||
                        c.thumbnailUrl ||
                        (c.galleryUrls && c.galleryUrls[0]) ||
                        "";

                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectCaseFromOltre(c)}
                          title={`${c.number} — ${c.title} (${c.authorOrSubject})`}
                          aria-label={`Caso ${c.number}: ${c.title}`}
                          className={`group relative w-full h-full min-w-0 min-h-0 overflow-hidden transition-shadow duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                            isSelected
                              ? "ring-2 ring-inset ring-black bg-black/5"
                              : "hover:bg-white/30 hover:shadow-sm"
                          }`}
                        >
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={c.title}
                              className="w-full h-full object-contain p-1"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/10 text-black/50 font-mono text-[9px]">
                              {c.number}
                            </div>
                          )}
                          {/* Number tag top-left on hover */}
                          <div className="absolute top-1 left-1 px-1 py-0.2 bg-black/75 backdrop-blur-xs text-white font-mono text-[7px] leading-tight font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            {c.number}
                          </div>
                        </button>
                      );
                    })}
                  </div>
              </div>

              {/* Fixed category controls remain reachable below the complete grid. */}
              <div className="@container px-4 py-2.5 shrink-0 border-t border-black/8 bg-white/30 backdrop-blur-xs">
                <div className="grid grid-cols-2 @min-[340px]:grid-cols-4 gap-1.5 w-full" role="group" aria-label="Narrazioni">
                  {OLTRE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      aria-pressed={cat.id === activeCatKey}
                      onClick={() => setActiveCatKey(cat.id)}
                      className={`min-h-8 px-2 py-1.5 rounded-none font-display font-semibold text-[8.5px] sm:text-[9px] uppercase tracking-wide whitespace-nowrap shadow-2xs transition-colors cursor-pointer border-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                        cat.id === activeCatKey
                          ? "bg-black text-white"
                          : "bg-white/[0.18] hover:bg-white/[0.35] text-black"
                      }`}
                    >
                      {cat.tabLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Navigation Bar: [ ← Opera ] */}
              <div className="px-5 py-2.5 border-t border-black/8 bg-white/20 backdrop-blur-xs flex items-center justify-start shrink-0 select-none">
                {/* Back to Artwork */}
                <button
                  type="button"
                  onClick={() => setViewMode("image")}
                  className="px-3.5 py-1 rounded-none bg-white/[0.18] hover:bg-white/[0.35] backdrop-blur-sm text-black font-display font-semibold text-[8.5px] sm:text-[9px] tracking-wide flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer border-0 border-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Opera</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
