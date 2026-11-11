"use client";

import React, { useState, useEffect, useMemo } from "react";
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
              {/* Header Bar */}
              <div className="h-8 px-2.5 border-b border-black flex items-center justify-between bg-[#F8F8F6] shrink-0 select-none">
                <span className="bg-black text-[#F8F8F6] px-1.5 py-0.5 font-display text-[9px] font-bold tracking-wider uppercase">
                  CASO {item.number}
                </span>

                {allImages.length > 1 && (
                  <span className="font-display text-[8.5px] uppercase tracking-wider text-black/60 font-semibold">
                    {imgIdx + 1} / {allImages.length}
                  </span>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Chiudi scheda"
                  className="w-5 h-5 flex items-center justify-center border border-black/30 hover:border-black hover:bg-black hover:text-[#F8F8F6] transition-colors cursor-pointer text-xs font-bold"
                >
                  <X className="w-3 h-3" />
                </button>
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

              {/* Bottom Bar: [ INFORMAZIONI ] | [ OLTRE ] | [ CHIUDI ] */}
              <div className="p-1.5 border-t border-black bg-[#F8F8F6] flex items-center justify-between gap-1 sm:gap-1.5 shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => setViewMode("info")}
                  className="flex-1 py-1.5 px-2 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1"
                >
                  <Info className="w-3 h-3" />
                  <span>INFORMAZIONI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("oltre")}
                  className="flex-1 py-1.5 px-2 bg-black text-[#F8F8F6] font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black/85 transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>OLTRE</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-1.5 px-2.5 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1"
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
            {/* Header Bar */}
            <div className="h-8 px-2.5 border-b border-black flex items-center justify-between bg-[#F8F8F6] shrink-0">
              <span className="bg-black text-[#F8F8F6] px-1.5 py-0.5 font-display text-[8.5px] font-bold tracking-wider uppercase">
                CASO {item.number} — INFO
              </span>

              <button
                type="button"
                onClick={onClose}
                aria-label="Chiudi scheda"
                className="w-5 h-5 flex items-center justify-center border border-black/30 hover:border-black hover:bg-black hover:text-[#F8F8F6] transition-colors cursor-pointer text-xs font-bold"
              >
                <X className="w-3 h-3" />
              </button>
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
                <p className="font-body text-[10.5px] leading-relaxed text-black/85">
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
                  <span className="font-body text-black/90 text-[10px] leading-relaxed">
                    {item.stileVisivo}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Bar: [ VEDI OPERA ] | [ OLTRE ] | [ CHIUDI ] */}
            <div className="p-1.5 border-t border-black bg-[#F8F8F6] flex items-center justify-between gap-1 sm:gap-1.5 shrink-0 select-none">
              <button
                type="button"
                onClick={() => setViewMode("image")}
                className="flex-1 py-1.5 px-2 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>VEDI OPERA</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("oltre")}
                className="flex-1 py-1.5 px-2 bg-black text-[#F8F8F6] font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black/85 transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1"
              >
                <span>OLTRE</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-1.5 px-2.5 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1"
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
          /* Allows navigating to all 76 case studies across 3 screens   */
          /* ========================================================== */
          <motion.div
            key="oltre-view"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-50 flex flex-col w-[96%] sm:w-[94%] max-w-[560px] max-h-[72vh] my-auto bg-[#F8F8F6] border-2 border-black shadow-2xl shadow-black/25 overflow-hidden text-black select-none"
          >
            {/* Header Bar */}
            <div className="h-8 px-3 border-b border-black flex items-center justify-between bg-[#F8F8F6] shrink-0 select-none">
              <div className="flex items-center gap-2">
                <span className="font-display text-[9.5px] sm:text-[10px] font-bold tracking-widest uppercase text-black">
                  {currentCatConfig.num} {currentCatConfig.label}
                </span>
                <span className="text-black/30 text-[9px]">•</span>
                <span className="font-display text-[8.5px] tracking-wider uppercase text-black/50 font-semibold">
                  CASO {item.number} SELEZIONATO
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Chiudi scheda"
                className="w-5 h-5 flex items-center justify-center border border-black/30 hover:border-black hover:bg-black hover:text-[#F8F8F6] transition-colors cursor-pointer text-xs font-bold"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Subcategories Columns (Categorical clusters from oltre.jpg) */}
            <div className="p-3 flex-1 min-h-0 bg-[#F8F8F6] overflow-y-auto custom-scrollbar">
              <div
                className={`grid gap-2 sm:gap-3 w-full h-full items-start ${
                  currentCatConfig.subcategories.length === 3 ? "grid-cols-3" : "grid-cols-4"
                }`}
              >
                {currentCatConfig.subcategories.map((subcat) => {
                  const list = subcategoryItems[subcat] || [];
                  return (
                    <div key={subcat} className="flex flex-col items-center min-w-0">
                      {/* Subcategory title */}
                      <div className="w-full text-center pb-1.5 mb-1.5 border-b border-black/15 shrink-0">
                        <span className="font-display text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-black block line-clamp-2">
                          {subcat}
                        </span>
                      </div>

                      {/* Cluster of case study thumbnails */}
                      <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-1.5 max-h-[46vh] overflow-y-auto custom-scrollbar p-1">
                        {list.map((c) => {
                          const isCurrent = c.id === item.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              title={`Caso ${c.number}: ${c.title}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectCaseFromOltre(c);
                              }}
                              className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 relative overflow-hidden cursor-pointer transition-all duration-150 select-none flex-shrink-0 ${
                                isCurrent
                                  ? "border-[2.5px] border-black shadow-lg shadow-black/40 scale-110 z-20"
                                  : "border border-black/25 hover:border-black hover:scale-115 hover:z-10 bg-[#ECECE8]"
                              }`}
                            >
                              <img
                                src={c.thumbnailUrl || c.imageUrl || ""}
                                alt={c.title}
                                draggable={false}
                                loading="lazy"
                                className="w-full h-full object-cover block filter-none pointer-events-none"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Bar: [ VEDI OPERA ] and 5 Category selectors on the right */}
            <div className="p-1.5 border-t border-black bg-[#F8F8F6] flex items-center justify-between gap-1 sm:gap-1.5 shrink-0 select-none">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("image")}
                  className="py-1 px-2 bg-[#F8F8F6] text-black font-display text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black shadow-sm cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-2.5 h-2.5" />
                  <span>VEDI OPERA</span>
                </button>
                <span className="font-display text-[9px] font-bold tracking-wider uppercase text-black/50 hidden sm:inline">
                  OLTRE
                </span>
              </div>

              {/* 5 Category Selector tabs (Origine, Intenzione, Sguardo, Scala, Cromia) */}
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto select-none">
                {OLTRE_CATEGORIES.map((cat) => {
                  const isActive = cat.id === activeCatKey;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCatKey(cat.id)}
                      className={`font-display text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider transition-colors cursor-pointer px-1.5 sm:px-2 py-0.5 sm:py-1 ${
                        isActive
                          ? "bg-black text-[#F8F8F6] border border-black shadow-sm"
                          : "text-black/60 hover:text-black hover:bg-black/5"
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
    </div>
  );
}
