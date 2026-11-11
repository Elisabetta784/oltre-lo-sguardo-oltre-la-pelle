"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Info, ArrowLeft } from "lucide-react";
import { ArchiveItem, ARCHIVE_ASPECT_RATIOS } from "@/data/archiveData";

interface StationModalProps {
  item: ArchiveItem;
  portionIndex?: number;
  onClose: () => void;
}

export function StationModal({ item, onClose }: StationModalProps) {
  // Mode: "image" opens first (artwork in natural original format), "info" shows detailed text
  const [viewMode, setViewMode] = useState<"image" | "info">("image");
  const [imgIdx, setImgIdx] = useState(0);

  // Natural dimensions from archive
  const dim = ARCHIVE_ASPECT_RATIOS[item.id];

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

  // Reset to image mode and first slide on item change
  useEffect(() => {
    setViewMode("image");
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

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center p-2 sm:p-3 pointer-events-auto"
      onClick={onClose}
    >
      {/* AnimatePresence for seamless transition between IMAGE ONLY and INFO ONLY */}
      {/* Notice: No local backdrop here! The backdrop is rendered full-screen in MacroGrid for a unified, seamless wall look */}
      <AnimatePresence mode="wait">
        {viewMode === "image" ? (
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

              {/* Accessible Bottom Bar (Touch-friendly buttons at ergonomic hand level) */}
              <div className="p-1.5 border-t border-black bg-[#F8F8F6] flex items-center justify-between gap-1.5 shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => setViewMode("info")}
                  className="flex-1 py-1.5 px-2 bg-[#F8F8F6] text-black font-display text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1"
                >
                  <Info className="w-3 h-3" />
                  <span>INFORMAZIONI</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-1.5 px-2.5 bg-black text-[#F8F8F6] font-display text-[9px] font-bold uppercase tracking-wider hover:bg-black/85 transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>CHIUDI</span>
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
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

            {/* Essential Content Body: Nome caso, anno, autore, descrizione, stile visivo, segno, tono, tipologia, tipo di media */}
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

                {/* Stile Visivo: completely visible, never cut off! */}
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

            {/* Bottom Bar: Back to Image & Close */}
            <div className="p-1.5 border-t border-black bg-[#F8F8F6] flex items-center justify-between gap-1.5 shrink-0 select-none">
              <button
                type="button"
                onClick={() => setViewMode("image")}
                className="flex-1 py-1.5 px-2 bg-[#F8F8F6] text-black font-display text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-[#F8F8F6] transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>VEDI OPERA</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-1.5 px-2.5 bg-black text-[#F8F8F6] font-display text-[9px] font-bold uppercase tracking-wider hover:bg-black/85 transition-colors border border-black shadow-sm cursor-pointer flex items-center justify-center gap-1"
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
