"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ArchiveItem } from "@/data/archiveData";

interface StationModalProps {
  item: ArchiveItem;
  portionIndex?: number;
  onClose: () => void;
}

export function StationModal({ item, onClose }: StationModalProps) {
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
    <div className="absolute inset-0 z-40 flex items-center justify-center p-2.5 sm:p-3 pointer-events-auto overflow-hidden">
      {/* 1. Translucent backdrop constrained strictly to this station */}
      {/* Light transparency with subtle blur so the underlying silhouettes remain softly visible */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={onClose}
        className="absolute inset-0 bg-[#F8F8F6]/78 backdrop-blur-[3.5px] cursor-pointer"
        aria-label="Chiudi popup"
      />

      {/* 2. Compact Apple-inspired modal card, calibrated for LED wall ergonomics and reach */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 w-[86%] sm:w-[84%] max-w-[360px] max-h-[58vh] bg-[#F8F8F6] border-2 border-black shadow-2xl shadow-black/25 flex flex-col overflow-hidden text-black select-none my-auto"
      >
        {/* Top Header Bar: Case Number badge & Top Close button */}
        <div className="h-8 px-3 border-b border-black flex items-center justify-between bg-[#F8F8F6] shrink-0">
          <span className="bg-black text-[#F8F8F6] px-1.5 py-0.5 font-display text-[9px] font-bold tracking-wider uppercase">
            CASO {item.number}
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

        {/* Hero Case Media (Compact height to preserve screen reachability) */}
        <div className="relative w-full h-[120px] sm:h-[135px] bg-black/5 overflow-hidden border-b border-black flex items-center justify-center shrink-0">
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
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#F8F8F6]/90 border border-black flex items-center justify-center text-black hover:bg-black hover:text-[#F8F8F6] transition-colors cursor-pointer shadow-sm"
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
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#F8F8F6]/90 border border-black flex items-center justify-center text-black hover:bg-black hover:text-[#F8F8F6] transition-colors cursor-pointer shadow-sm"
                title="Immagine successiva"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/75 px-1.5 py-0.5">
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
        <div className="p-2.5 sm:p-3 flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 min-h-0 bg-[#F8F8F6]">
          {/* Nome caso (Titolo) */}
          <div>
            <h2 className="font-display font-bold text-[12px] sm:text-[13px] leading-tight uppercase text-black tracking-tight line-clamp-2">
              {item.title}
            </h2>
            {/* Autore & Anno */}
            <div className="flex items-center gap-1.5 mt-0.5 font-display text-[9.5px] text-black/70 uppercase tracking-wider font-semibold">
              <span>{item.authorOrSubject}</span>
              <span className="text-black/30">•</span>
              <span>{item.year}</span>
            </div>
          </div>

          {/* Descrizione */}
          <div className="pt-1.5 border-t border-black/15">
            <span className="block font-display font-bold text-[8px] uppercase tracking-wider text-black/50 mb-0.5">
              DESCRIZIONE
            </span>
            <p className="font-body text-[10.5px] sm:text-[11px] leading-snug text-black/85">
              {item.sintesiConcettuale || item.excerpt || item.notes}
            </p>
          </div>

          {/* Essential Metadata Grid: Segno, Stile Visivo, Tono, Tipologia, Tipo di Media */}
          <div className="pt-1.5 border-t border-black/15 grid grid-cols-2 gap-x-2.5 gap-y-1.5 text-[10px]">
            <div>
              <span className="block font-display font-bold text-[7.5px] uppercase tracking-wider text-black/50">
                SEGNO
              </span>
              <span className="font-body font-semibold text-black text-[10.5px] leading-tight">
                {item.segno}
              </span>
            </div>

            <div>
              <span className="block font-display font-bold text-[7.5px] uppercase tracking-wider text-black/50">
                TONO
              </span>
              <span className="font-body font-semibold text-black text-[10.5px] leading-tight">
                {item.tono}
              </span>
            </div>

            <div>
              <span className="block font-display font-bold text-[7.5px] uppercase tracking-wider text-black/50">
                TIPOLOGIA
              </span>
              <span className="font-body font-semibold text-black text-[10.5px] leading-tight">
                {item.tipologia}
              </span>
            </div>

            <div>
              <span className="block font-display font-bold text-[7.5px] uppercase tracking-wider text-black/50">
                TIPO DI MEDIA
              </span>
              <span className="font-body font-semibold text-black text-[10.5px] leading-tight">
                {item.tipoDiMedia}
              </span>
            </div>

            <div className="col-span-2 pt-1 border-t border-black/10">
              <span className="block font-display font-bold text-[7.5px] uppercase tracking-wider text-black/50">
                STILE VISIVO
              </span>
              <span className="font-body text-black/90 text-[10px] leading-snug">
                {item.stileVisivo}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Bottom Accessible Touch Bar: Easy to tap right in front of the hands on a 3m LED wall */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 bg-black text-[#F8F8F6] font-display text-[9.5px] font-bold uppercase tracking-widest hover:bg-black/85 active:bg-black/70 transition-colors cursor-pointer text-center border-t border-black shrink-0 flex items-center justify-center gap-1.5"
        >
          <span>CHIUDI SCHEDA</span>
          <X className="w-3 h-3" />
        </button>
      </motion.div>
    </div>
  );
}
