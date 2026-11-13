"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Info, ArrowLeft } from "lucide-react";
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

      {/* 2. Unified Morphing Modal Window (Ultra-smooth width/height transition between OPERA and OLTRE) */}
      <motion.div
        key="station-modal-unified"
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className={`relative z-50 flex flex-col my-auto bg-[#F8F8F6] border border-black/15 shadow-2xl shadow-black/20 overflow-hidden text-black select-none transition-[max-width,width,max-height] duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          viewMode === "oltre"
            ? "w-[98%] sm:w-[96%] max-w-[660px] sm:max-w-[720px] max-h-[84vh]"
            : "w-[78%] sm:w-[74%] max-w-[310px] sm:max-w-[320px] max-h-[52vh]"
        }`}
      >
        {/* Header Bar */}
        <div className="h-8 px-2.5 sm:px-3 border-b border-black/10 flex items-center justify-between bg-[#F8F8F6] shrink-0 select-none">
          <AnimatePresence mode="wait" initial={false}>
            {viewMode === "image" && (
              <motion.div
                key="hdr-img"
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between w-full"
              >
                <span className="bg-black text-[#F8F8F6] px-1.5 py-0.5 font-display text-[9px] font-bold tracking-wider uppercase">
                  CASO {item.number}
                </span>

                {allImages.length > 1 && (
                  <span className="font-display text-[8.5px] uppercase tracking-wider text-black/60 font-semibold">
                    {imgIdx + 1} / {allImages.length}
                  </span>
                )}
              </motion.div>
            )}

            {viewMode === "info" && (
              <motion.div
                key="hdr-info"
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between w-full"
              >
                <span className="bg-black text-[#F8F8F6] px-1.5 py-0.5 font-display text-[8.5px] font-bold tracking-wider uppercase">
                  CASO {item.number} — INFO
                </span>
              </motion.div>
            )}

            {viewMode === "oltre" && (
              <motion.div
                key="hdr-oltre"
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <span className="font-display text-[10px] font-bold tracking-widest uppercase text-black">
                    {currentCatConfig.num} {currentCatConfig.label}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Body: Image vs Draggable Info vs 3D Cards Carousel (oltree.jpg & oltre.jpg) */}
        <div className="relative flex-1 min-h-0 overflow-hidden bg-[#F8F8F6] flex flex-col">
          <AnimatePresence mode="wait" initial={false}>
            {viewMode === "image" && (
              <motion.div
                key="body-img"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="relative bg-[#ECECE8] flex items-center justify-center overflow-hidden max-h-[42vh] select-none flex-1 min-h-0"
              >
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

                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
                      }}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#F8F8F6]/90 border border-black/30 flex items-center justify-center text-black hover:bg-black hover:text-[#F8F8F6] transition-colors cursor-pointer shadow-md"
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
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#F8F8F6]/90 border border-black/30 flex items-center justify-center text-black hover:bg-black hover:text-[#F8F8F6] transition-colors cursor-pointer shadow-md"
                      title="Immagine successiva"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {viewMode === "info" && (
              <motion.div
                key="body-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex-1 min-h-0 flex flex-col"
              >
                <div
                  ref={infoScrollRef}
                  onPointerDown={handleInfoPointerDown}
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                  className={`p-3 flex flex-col gap-2 overflow-y-auto no-scrollbar flex-1 min-h-0 bg-[#F8F8F6] select-none touch-pan-y ${
                    isInfoDragging ? "cursor-grabbing" : "cursor-grab"
                  }`}
                >
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
                  <div className="pt-1.5 border-t border-black/10">
                    <span className="block font-display font-bold text-[7.5px] uppercase tracking-wider text-black/50 mb-0.5">
                      DESCRIZIONE
                    </span>
                    <p className="font-body text-[10.5px] leading-relaxed text-black/85 text-justify">
                      {item.sintesiConcettuale || item.excerpt || item.notes}
                    </p>
                  </div>

                  {/* Essential Metadata Grid */}
                  <div className="pt-1.5 border-t border-black/10 grid grid-cols-2 gap-x-2.5 gap-y-1.5 text-[10px]">
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
              </motion.div>
            )}

            {viewMode === "oltre" && (
              <motion.div
                key="body-oltre"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex-1 min-h-0 flex flex-col overflow-hidden bg-[#F8F8F6]"
              >
                <OltreCardCarousel
                  categoryConfig={currentCatConfig}
                  subcategoryItems={subcategoryItems}
                  currentItemId={item.id}
                  onSelectCase={handleSelectCaseFromOltre}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mode Toggle: [ OPERA ] [ OLTRE ] (Positioned in reachable lower area, not top) */}
        <div className="px-2 py-1 bg-[#ECECE8] border-t border-black/10 flex items-center justify-center shrink-0 select-none">
          <div className="inline-flex items-center p-0.5 bg-[#F8F8F6] border border-black/15 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("image")}
              className={`px-3.5 sm:px-4 py-0.5 sm:py-1 font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "image" || viewMode === "info"
                  ? "bg-black text-[#F8F8F6] shadow-sm"
                  : "text-black/60 hover:text-black hover:bg-black/5"
              }`}
            >
              OPERA
            </button>
            <button
              type="button"
              onClick={() => setViewMode("oltre")}
              className={`px-3.5 sm:px-4 py-0.5 sm:py-1 font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "oltre"
                  ? "bg-black text-[#F8F8F6] shadow-sm"
                  : "text-black/60 hover:text-black hover:bg-black/5"
              }`}
            >
              OLTRE
            </button>
          </div>
        </div>

        {/* Bottom Bar: Action Buttons & Category Tabs */}
        <div className="p-1.5 border-t border-black/10 bg-[#F8F8F6] flex items-center justify-between gap-1.5 shrink-0 select-none">
          <AnimatePresence mode="wait" initial={false}>
            {viewMode === "image" && (
              <motion.div
                key="btn-img"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between gap-1.5 w-full"
              >
                <button
                  type="button"
                  onClick={() => setViewMode("info")}
                  className="flex-1 py-1.5 px-2 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black/20 shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Info className="w-3 h-3" />
                  <span>INFORMAZIONI</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-1.5 px-2.5 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black/20 shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>CHIUDI</span>
                  <X className="w-2.5 h-2.5" />
                </button>
              </motion.div>
            )}

            {viewMode === "info" && (
              <motion.div
                key="btn-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between gap-1.5 w-full"
              >
                <button
                  type="button"
                  onClick={() => setViewMode("image")}
                  aria-label="Torna all'opera"
                  title="Torna all'opera"
                  className="flex-1 py-1.5 px-2 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black/20 shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>TORNA ALL'OPERA</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-1.5 px-2.5 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black/20 shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>CHIUDI</span>
                  <X className="w-2.5 h-2.5" />
                </button>
              </motion.div>
            )}

            {viewMode === "oltre" && (
              <motion.div
                key="btn-oltre"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between gap-1.5 w-full"
              >
                {/* 5 Category Selector tabs (Origine, Intenzione, Sguardo, Scala, Cromia) */}
                <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar select-none flex-1 min-w-0">
                  {OLTRE_CATEGORIES.map((cat) => {
                    const isActive = cat.id === activeCatKey;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCatKey(cat.id)}
                        className={`font-display text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider transition-colors cursor-pointer px-2 py-1 shrink-0 ${
                          isActive
                            ? "bg-black text-[#F8F8F6] shadow-sm"
                            : "text-black/60 hover:text-black hover:bg-black/5"
                        }`}
                      >
                        {cat.label.charAt(0) + cat.label.slice(1).toLowerCase()}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-1 px-2.5 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black/20 shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <span>CHIUDI</span>
                  <X className="w-2.5 h-2.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 items-center justify-items-center pb-3">
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
                  className={`relative w-12 h-12 sm:w-13 sm:h-13 flex-shrink-0 overflow-hidden transition-all duration-150 select-none bg-[#ECECE8] ${
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
                    className="w-full h-full object-cover block filter-none pointer-events-none"
                  />

                  {/* Case Number Tag */}
                  <div
                    className={`absolute bottom-0 inset-x-0 font-display text-[6.5px] font-bold text-center py-0.2 leading-tight pointer-events-none z-10 uppercase tracking-tighter ${
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
      {/* 3D Perspective Scene strictly matching oltree.jpg */}
      <div
        style={{ perspective: "1000px", perspectiveOrigin: "center center" }}
        className="relative w-full flex-1 flex items-center justify-center min-h-[350px] sm:min-h-[385px] overflow-hidden"
      >
        {categoryConfig.subcategories.map((subcat, idx) => {
          // Circular offset: guarantees there is always a card on the left and right in the loop
          let offset = (idx - activeCardIdx) % numCards;
          if (offset > Math.floor(numCards / 2)) offset -= numCards;
          if (offset < -Math.floor((numCards - 1) / 2)) offset += numCards;

          const isCenter = offset === 0;

          // 3D positioning and perspective rotation strictly matching oltree.jpg:
          // Center card: flat, front and center (z = 0, rotateY = 0)
          // Left card (offset = -1): turned inwards toward center, inner edge tall, outer edge short (rotateY = -60deg, z = -70px)
          // Right card (offset = 1): turned inwards toward center, inner edge tall, outer edge short (rotateY = 60deg, z = -70px)
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
            x = -185;
            z = -70;
            rotateY = -60;
            opacity = 0.92;
            zIndex = 15;
          } else if (offset === 1) {
            x = 185;
            z = -70;
            rotateY = 60;
            opacity = 0.92;
            zIndex = 15;
          } else if (offset < -1) {
            x = -280;
            z = -180;
            rotateY = -72;
            opacity = 0;
            zIndex = 5;
          } else if (offset > 1) {
            x = 280;
            z = -180;
            rotateY = 72;
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
              className={`absolute top-1/2 left-1/2 w-[240px] sm:w-[260px] h-[335px] sm:h-[365px] -mt-[168px] sm:-mt-[182px] -ml-[120px] sm:-ml-[130px] bg-white shadow-xl shadow-black/10 border border-black/8 flex flex-col overflow-hidden transition-shadow ${
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

      {/* Carousel Navigation (Prev / Next & Dots) strictly matching oltree.jpg */}
      <div className="h-6 px-3 flex items-center justify-between w-full max-w-[340px] shrink-0 select-none mt-1">
        <button
          type="button"
          onClick={() => setActiveCardIdx((prev) => (prev - 1 + numCards) % numCards)}
          className="font-display text-[8.5px] uppercase tracking-wider font-bold text-black/70 hover:text-black transition-opacity cursor-pointer"
        >
          ← PREV
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
          className="font-display text-[8.5px] uppercase tracking-wider font-bold text-black/70 hover:text-black transition-opacity cursor-pointer"
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}
