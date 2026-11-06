"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Volume2, ArrowLeft, Info } from "lucide-react";
import { ArchiveItem } from "@/data/archiveData";
import { AudioPlayerSnippet } from "./AudioPlayerSnippet";

interface MicroViewProps {
  item: ArchiveItem;
  totalItems: number;
  currentIndex: number;
  onBackToMacro: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function MicroView({
  item,
  totalItems,
  currentIndex,
  onBackToMacro,
  onNext,
  onPrev,
}: MicroViewProps) {
  const [selectedImage, setSelectedImage] = useState<string>(item.imageUrl || "");

  useEffect(() => {
    setSelectedImage(item.imageUrl || "");
  }, [item.id, item.imageUrl]);

  // Keyboard navigation: ArrowLeft, ArrowRight, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "Escape") onBackToMacro();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev, onBackToMacro]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-full bg-[#f5f0e0] overflow-hidden flex flex-col select-none"
    >
      {/* Outer framing container with technical border matching micro2.jpeg */}
      <div className="w-full h-full flex flex-col border-t border-[#88562C]/25">
        {/* Sub-header inside MicroView: Back breadcrumb & navigation */}
        <div className="h-10 px-6 sm:px-10 border-b border-[#88562C]/25 flex items-center justify-between font-mono text-[11px] text-[#88562C] bg-[#f5f0e0]">
          <button
            type="button"
            onClick={onBackToMacro}
            className="flex items-center gap-2 text-[#523719] hover:text-[#88562C] font-bold cursor-pointer group uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>← TORNA A MACRO [ESC]</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">REGISTRO NAZIONALE SEGNI CORPOREI</span>
            <span>•</span>
            <span className="font-bold text-[#523719]">
              DOC. {String(currentIndex + 1).padStart(3, "0")} / {String(totalItems).padStart(3, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              className="p-1 hover:text-[#523719] cursor-pointer"
              title="Precedente [←]"
            >
              [ ← PREV ]
            </button>
            <button
              type="button"
              onClick={onNext}
              className="p-1 hover:text-[#523719] cursor-pointer"
              title="Successivo [→]"
            >
              [ NEXT → ]
            </button>
          </div>
        </div>

        {/* 50/50 SPLIT SCREEN LAYOUT IDENTICAL TO micro2.jpeg */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-y-auto lg:overflow-hidden">
          {/* ======================================================== */}
          {/* LEFT HALF: LARGE IMAGE / MEDIA WITH CORNER ANNOTATIONS    */}
          {/* ======================================================== */}
          <div className="relative border-b lg:border-b-0 lg:border-r border-[#88562C]/25 p-6 sm:p-10 flex flex-col justify-between bg-[#F8F0D3]/50">
            {/* Top Corner Technical Annotations */}
            <div className="w-full flex items-start justify-between font-mono text-[9px] sm:text-[10px] text-[#88562C] uppercase tracking-wider z-10">
              <div>
                L. {item.number} — {item.authorOrSubject}
                <br />
                <span className="opacity-70">ANNO: {item.year}</span>
              </div>
              <div className="text-right">
                {item.tipoDiMedia.toUpperCase()} / ARCHIVIO
                <br />
                <span className="opacity-70">{item.tipologia.toUpperCase()}</span>
              </div>
            </div>

            {/* Centered Media with deliberate slow shared element transition (micro.mov style) */}
            <div className="my-auto w-full flex flex-col items-center justify-center py-4">
              <motion.div
                layoutId={`item-media-${item.id}`}
                transition={{
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1], // Slow, clearly visible luxury curve
                }}
                className="relative w-full max-w-[500px] aspect-[4/3] sm:aspect-square rounded-none overflow-hidden bg-[#EFE4C2] border border-[#88562C]/30 shadow-2xl shadow-[#88562C]/15 flex flex-col justify-between"
              >
                {/* 1. PHOTO */}
                {item.type === "photo" && (
                  <div className="w-full flex-1 min-h-0 flex items-center justify-center p-2 sm:p-4 bg-[#EFE4C2]">
                    <img
                      src={selectedImage || item.imageUrl || ""}
                      alt={item.title}
                      loading="eager"
                      draggable={false}
                      style={{
                        imageRendering: "-webkit-optimize-contrast",
                      }}
                      className="max-w-full max-h-full w-auto h-auto object-contain rounded-none block shadow-sm select-none"
                    />
                  </div>
                )}

                {/* Didascalia esplicativa per casi con contenuto visivo aggiunto */}
                {item.isIllustrativeImage && (
                  <div className="w-full bg-[#E5D7B1] border-t border-[#88562C]/30 px-3 py-2 z-10 flex items-center justify-center gap-1.5 shrink-0">
                    <Info className="w-3.5 h-3.5 text-[#88562C] shrink-0 opacity-80" />
                    <p className="font-mono text-[9px] sm:text-[9.5px] text-[#523719] leading-snug tracking-tight text-center select-none">
                      {item.imageDisclaimer || "Immagine esempio esplicativa del caso studio, il testo era stato selezionato in origine senza alcuna immagine allegata"}
                    </p>
                  </div>
                )}

                {/* 2. AUDIO */}
                {item.type === "audio" && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#EFE4C2]">
                    <div className="flex items-center gap-1.5 h-20 w-full justify-center overflow-hidden mb-6">
                      {(item.audioWaveform || [40, 70, 90, 50, 80, 100, 60, 40]).map((h, idx) => (
                        <div
                          key={idx}
                          style={{ height: `${h * 0.9}%` }}
                          className="w-2.5 bg-[#88562C] rounded-none"
                        />
                      ))}
                    </div>
                    <AudioPlayerSnippet
                      duration={item.audioDuration}
                      waveform={item.audioWaveform}
                    />
                  </div>
                )}

                {/* 3. TEXT / THEORETICAL ESSAY */}
                {item.type === "text" && (
                  <div className="w-full h-full p-6 sm:p-10 flex flex-col justify-center bg-[#EFE4C2] overflow-y-auto">
                    {item.microKeyword && (
                      <div className="mb-4">
                        <span className="font-mono text-xs font-black tracking-widest text-[#523719] px-2.5 py-1 border border-[#523719] bg-[#f5f0e0] uppercase shadow-sm">
                          {item.microKeyword}
                        </span>
                      </div>
                    )}
                    <span className="text-4xl font-serif text-[#88562C]/40 mb-2 select-none leading-none">“</span>
                    <p className="font-mono text-xs sm:text-sm text-[#523719] leading-relaxed italic text-justify">
                      {item.sintesiConcettuale || item.excerpt}
                    </p>
                    <span className="font-mono text-[10px] text-[#88562C] uppercase tracking-wider mt-4 text-right block">
                      — {item.authorOrSubject} ({item.year})
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Gallery Thumbnails Selector if item has multiple images */}
              {item.galleryUrls && item.galleryUrls.length > 0 && item.imageUrl && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 z-10 max-w-md">
                  <div
                    onClick={() => setSelectedImage(item.imageUrl || "")}
                    className={`w-9 h-9 sm:w-11 sm:h-11 border cursor-pointer overflow-hidden transition-all ${
                      selectedImage === item.imageUrl
                        ? "border-[#523719] ring-2 ring-[#523719] scale-105"
                        : "border-[#88562C]/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover pointer-events-none" />
                  </div>
                  {item.galleryUrls.map((gUrl, gIdx) => (
                    <div
                      key={gIdx}
                      onClick={() => setSelectedImage(gUrl)}
                      className={`w-9 h-9 sm:w-11 sm:h-11 border cursor-pointer overflow-hidden transition-all ${
                        selectedImage === gUrl
                          ? "border-[#523719] ring-2 ring-[#523719] scale-105"
                          : "border-[#88562C]/30 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={gUrl} alt="" className="w-full h-full object-cover pointer-events-none" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Corner Technical Annotations */}
            <div className="w-full flex items-end justify-between font-mono text-[9px] sm:text-[10px] text-[#88562C] uppercase tracking-wider z-10">
              <div>
                ARCHIVIO · SEGNI DELLA PELLE
                <br />
                <span className="opacity-70">STATUS: CONSERVATO</span>
              </div>
              <div className="text-right">
                ID. {item.id.toUpperCase()}
                <br />
                <span className="opacity-70">CATEGORIA {item.categorie.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT HALF: TITLE, STORY & TECHNICAL SPEC SHEET (TABLE)   */}
          {/* ======================================================== */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.25, // Appears as the image glides gracefully into the left slot
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative h-full overflow-y-auto bg-[#f5f0e0] custom-scrollbar"
          >
            <div className="min-h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 pb-14 sm:pb-20">
              <div>
              {/* Category Boxed Tag (like [ * DESK TOOLS · 道具 ] in micro2.jpeg) */}
              <div className="inline-flex flex-wrap items-center gap-2 mb-4">
                <div className="border border-[#88562C]/50 px-2.5 py-1 font-mono text-[10px] text-[#523719] uppercase tracking-wider bg-[#ebe4d1]/60">
                  <span>✱</span> {item.segno.toUpperCase()} · {item.tipologia.toUpperCase()}
                </div>
                <div className="border border-[#88562C]/30 px-2 py-1 font-mono text-[9px] text-[#88562C] uppercase tracking-wider">
                  TONO: {item.tono.toUpperCase()}
                </div>
                <div className="border border-[#88562C]/30 px-2 py-1 font-mono text-[9px] text-[#88562C] uppercase tracking-wider">
                  MEDIA: {item.tipoDiMedia.toUpperCase()}
                </div>
                <div className="border border-[#88562C]/30 px-2 py-1 font-mono text-[9px] text-[#88562C] uppercase tracking-wider">
                  CATEGORIA: {item.categorie.toUpperCase()}
                </div>
              </div>

              {/* Big Bold Headline in Forma DJR Deck (like TAPE CUTTER MK.II in micro2.jpeg) */}
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#523719] leading-[1.08] mb-2">
                {item.title}
              </h1>

              {/* Author & Year Subheading */}
              <div className="font-mono text-xs sm:text-[13px] text-[#88562C] uppercase tracking-wider mb-6 pb-2 border-b border-[#88562C]/20">
                <span className="font-bold text-[#523719]">{item.authorOrSubject}</span> · {item.year}
              </div>

              {/* Sintesi Concettuale / Editorial Story */}
              <div className="font-mono text-xs sm:text-[13px] text-[#523719]/90 leading-relaxed max-w-xl mb-6 text-justify">
                <p>{item.sintesiConcettuale || item.caption || item.excerpt}</p>
              </div>

              {/* TECHNICAL SPECIFICATION TABLE (EXACT COPY OF micro2.jpeg GRID) */}
              <div className="w-full border-t border-b border-[#88562C]/30 font-mono text-[11px] mb-6">
                {/* Row 1 */}
                <div className="grid grid-cols-2 border-b border-[#88562C]/20 py-1.5">
                  <div className="flex items-center justify-between pr-4 border-r border-[#88562C]/20">
                    <span className="text-[#88562C] text-[10px] uppercase">SEGNATURA</span>
                    <span className="font-bold text-[#523719]">SEG-{item.number}</span>
                  </div>
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-[#88562C] text-[10px] uppercase">ANNO ORIGINE</span>
                    <span className="font-bold text-[#523719]">{item.year}</span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 border-b border-[#88562C]/20 py-1.5">
                  <div className="flex items-center justify-between pr-4 border-r border-[#88562C]/20">
                    <span className="text-[#88562C] text-[10px] uppercase">SEGNO</span>
                    <span className="font-bold text-[#523719] uppercase">{item.segno}</span>
                  </div>
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-[#88562C] text-[10px] uppercase">TIPOLOGIA</span>
                    <span className="font-bold text-[#523719] uppercase">{item.tipologia}</span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-2 border-b border-[#88562C]/20 py-1.5">
                  <div className="flex items-center justify-between pr-4 border-r border-[#88562C]/20">
                    <span className="text-[#88562C] text-[10px] uppercase">TONO</span>
                    <span className="font-bold text-[#523719]">{item.tono}</span>
                  </div>
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-[#88562C] text-[10px] uppercase">TIPO DI MEDIA</span>
                    <span className="font-bold text-[#523719] uppercase">{item.tipoDiMedia}</span>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-2 border-b border-[#88562C]/20 py-1.5">
                  <div className="flex items-center justify-between pr-4 border-r border-[#88562C]/20">
                    <span className="text-[#88562C] text-[10px] uppercase">CATEGORIA</span>
                    <span className="font-bold text-[#523719] uppercase">{item.categorie}</span>
                  </div>
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-[#88562C] text-[10px] uppercase">AUTORE / ARTISTA</span>
                    <span className="font-bold text-[#523719] truncate">{item.authorOrSubject}</span>
                  </div>
                </div>

                {/* Row 5 - Stile Visivo */}
                {item.stileVisivo && item.stileVisivo !== "—" && (
                  <div className="py-1.5 border-b border-[#88562C]/20">
                    <span className="text-[#88562C] text-[10px] uppercase block mb-0.5">STILE VISIVO</span>
                    <span className="text-[#523719] text-[11px]">{item.stileVisivo}</span>
                  </div>
                )}

                {/* Row 6 - Sociological Indicators */}
                {(item.mascherabilita !== "—" || item.accettabilitaSociale !== "—") && (
                  <div className="grid grid-cols-2 py-1.5 bg-[#ebe4d1]/30 px-2 mt-1">
                    <div className="pr-2 border-r border-[#88562C]/20 space-y-0.5">
                      <div className="text-[9px] text-[#88562C] uppercase">
                        COPERTO / SCOPERTO: <span className="font-bold text-[#523719]">{item.mascherabilita}</span>
                      </div>
                      <div className="text-[9px] text-[#88562C] uppercase">
                        SOTTRAZIONE: <span className="font-bold text-[#523719]">{item.percezioneSociale}</span>
                      </div>
                      <div className="text-[9px] text-[#88562C] uppercase">
                        TRACCIATO: <span className="font-bold text-[#523719]">{item.valenzaDelRicordo}</span>
                      </div>
                    </div>
                    <div className="pl-2 space-y-0.5">
                      <div className="text-[9px] text-[#88562C] uppercase">
                        EROICIZZAZIONE: <span className="font-bold text-[#523719]">{item.accettabilitaSociale}</span>
                      </div>
                      <div className="text-[9px] text-[#88562C] uppercase">
                        CONFIGURAZIONE: <span className="font-bold text-[#523719]">{item.percezioneEstetica}</span>
                      </div>
                      <div className="text-[9px] text-[#88562C] uppercase">
                        ATTRITO: <span className="font-bold text-[#523719]">{item.sensoDiVergogna}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Extra notes / context */}
              {item.notes && item.notes !== "Conservato nell'archivio." && (
                <div className="bg-[#88562C]/10 border-l-2 border-[#88562C] p-3 font-mono text-xs text-[#523719] mb-4">
                  <span className="text-[10px] uppercase font-bold text-[#88562C] block mb-1">
                    NOTE & CONTESTO CURATORIALE:
                  </span>
                  {item.notes}
                </div>
              )}

              {/* External Link */}
              <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] mb-6">
                {item.externalLink && (
                  <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#523719] text-[#f5f0e0] uppercase hover:bg-[#88562C] transition-colors"
                  >
                    <span>[ APRI PROGETTO / FONTE ESTERNA ↗ ]</span>
                  </a>
                )}
              </div>
            </div>

            {/* Bottom Row (like UNIT / TAX INCL. ¥6,800 in micro2.jpeg) */}
            <div className="pt-6 mt-8 border-t border-[#88562C]/25 flex items-end justify-between font-mono">
              <div>
                <span className="text-[10px] text-[#88562C] uppercase block mb-0.5">
                  SEGNATURA ARCHIVIO · CLASSIFICAZIONE
                </span>
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#523719]">
                  № {item.number}
                </span>
              </div>

              {/* Next/Prev Swipe Trigger Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrev}
                  className="px-3 py-1.5 border border-[#88562C]/40 hover:bg-[#88562C]/15 text-xs text-[#523719] font-bold cursor-pointer"
                >
                  [ ← PREV ]
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="px-3 py-1.5 border border-[#88562C]/40 hover:bg-[#88562C]/15 text-xs text-[#523719] font-bold cursor-pointer"
                >
                  [ NEXT → ]
                </button>
              </div>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
