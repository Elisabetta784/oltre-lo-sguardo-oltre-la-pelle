"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ArchiveItem } from "@/data/archiveData";

interface StationModalProps {
  item: ArchiveItem;
  portionIndex: number;
  onClose: () => void;
}

export function StationModal({ item, portionIndex, onClose }: StationModalProps) {
  const [imgIdx, setImgIdx] = useState(0);

  // Collect all available images for this case (main image + gallery if present)
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

  // Reset image index when item changes
  useEffect(() => {
    setImgIdx(0);
  }, [item.id]);

  // ESC key closes the modal
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
    <div className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-4 pointer-events-auto overflow-hidden">
      {/* 1. Translucent backdrop constrained strictly to this station */}
      {/* Light transparency with subtle blur so the underlying silhouettes remain softly visible */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={onClose}
        className="absolute inset-0 bg-[#F8F8F6]/78 backdrop-blur-[3.5px] cursor-pointer"
        aria-label="Chiudi popup"
      />

      {/* 2. Apple-inspired compact modal card, styled with the site's brutalist-editorial design */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 w-[90%] sm:w-[88%] max-w-[430px] max-h-[76vh] bg-[#F8F8F6] border-2 border-black shadow-2xl shadow-black/25 flex flex-col overflow-hidden text-black select-none my-auto"
      >
        {/* Top Header Bar: Station badge, Case Number & Close button */}
        <div className="h-10 px-3.5 border-b border-black flex items-center justify-between bg-[#F8F8F6] shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-black text-[#F8F8F6] px-1.5 py-0.5 font-display text-[9.5px] font-bold tracking-wider uppercase">
              CASO {item.number}
            </span>
            <span className="font-display text-[9.5px] tracking-wider uppercase text-black/60 font-semibold">
              STAZIONE {portionIndex} / 3
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi scheda"
            className="w-6 h-6 flex items-center justify-center border border-black/30 hover:border-black hover:bg-black hover:text-[#F8F8F6] transition-colors cursor-pointer text-xs font-bold"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero Case Media */}
        <div className="relative w-full h-[180px] sm:h-[200px] bg-black/5 overflow-hidden border-b border-black flex items-center justify-center shrink-0">
          <img
            src={currentImg}
            alt={item.title}
            className="w-full h-full object-cover filter-none select-none"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
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
                className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F8F8F6]/90 border border-black flex items-center justify-center text-black hover:bg-black hover:text-[#F8F8F6] transition-colors cursor-pointer shadow-sm"
                title="Immagine precedente"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImgIdx((prev) => (prev + 1) % allImages.length);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F8F8F6]/90 border border-black flex items-center justify-center text-black hover:bg-black hover:text-[#F8F8F6] transition-colors cursor-pointer shadow-sm"
                title="Immagine successiva"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/75 px-2 py-0.5">
                {allImages.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 transition-colors ${
                      i === imgIdx ? "bg-[#F8F8F6]" : "bg-[#F8F8F6]/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Essential Content Body: Nome caso, anno, autore, descrizione, stile visivo, segno, tono, tipologia, tipo di media */}
        <div className="p-3.5 sm:p-4 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar flex-1 min-h-0 bg-[#F8F8F6]">
          {/* Nome caso (Titolo) */}
          <div>
            <h2 className="font-display font-bold text-sm sm:text-base leading-tight uppercase text-black tracking-tight">
              {item.title}
            </h2>
            {/* Autore & Anno */}
            <div className="flex items-center gap-1.5 mt-1 font-display text-[10.5px] text-black/75 uppercase tracking-wider font-semibold">
              <span>{item.authorOrSubject}</span>
              <span className="text-black/30">•</span>
              <span>{item.year}</span>
            </div>
          </div>

          {/* Descrizione */}
          <div className="pt-2 border-t border-black/15">
            <span className="block font-display font-bold text-[9px] uppercase tracking-wider text-black/50 mb-0.5">
              DESCRIZIONE
            </span>
            <p className="font-body text-[11.5px] sm:text-[12px] leading-relaxed text-black/85">
              {item.sintesiConcettuale || item.excerpt || item.notes}
            </p>
          </div>

          {/* Essential Metadata Grid: Segno, Stile Visivo, Tono, Tipologia, Tipo di Media */}
          <div className="pt-2 border-t border-black/15 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
            <div>
              <span className="block font-display font-bold text-[8.5px] uppercase tracking-wider text-black/50">
                SEGNO
              </span>
              <span className="font-body font-semibold text-black text-[11px] leading-tight">
                {item.segno}
              </span>
            </div>

            <div>
              <span className="block font-display font-bold text-[8.5px] uppercase tracking-wider text-black/50">
                TONO
              </span>
              <span className="font-body font-semibold text-black text-[11px] leading-tight">
                {item.tono}
              </span>
            </div>

            <div>
              <span className="block font-display font-bold text-[8.5px] uppercase tracking-wider text-black/50">
                TIPOLOGIA
              </span>
              <span className="font-body font-semibold text-black text-[11px] leading-tight">
                {item.tipologia}
              </span>
            </div>

            <div>
              <span className="block font-display font-bold text-[8.5px] uppercase tracking-wider text-black/50">
                TIPO DI MEDIA
              </span>
              <span className="font-body font-semibold text-black text-[11px] leading-tight">
                {item.tipoDiMedia}
              </span>
            </div>

            <div className="col-span-2 pt-1.5 border-t border-black/10">
              <span className="block font-display font-bold text-[8.5px] uppercase tracking-wider text-black/50">
                STILE VISIVO
              </span>
              <span className="font-body text-black/90 text-[11px] leading-snug">
                {item.stileVisivo}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
