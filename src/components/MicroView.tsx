"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Info, ExternalLink } from "lucide-react";
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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-full bg-[#F8F8F6] overflow-hidden flex flex-col select-none text-black font-body"
    >
      {/* Sub-header inside MicroView: Back breadcrumb & navigation */}
      <div className="h-10 px-5 sm:px-8 border-b border-black/15 flex items-center justify-between font-body text-[11px] text-black/60 bg-[#F8F8F6]">
        <button
          type="button"
          onClick={onBackToMacro}
          className="flex items-center gap-1.5 text-black hover:opacity-75 font-display font-bold cursor-pointer group uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>TORNA ALLA MATRICE [ESC]</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline font-body text-black/50">ARCHIVIO DEI SEGNI</span>
          <span className="text-black/30">•</span>
          <span className="font-display font-bold text-black">
            CASO {String(currentIndex + 1).padStart(3, "0")} / {String(totalItems).padStart(3, "0")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="p-1 hover:text-black cursor-pointer font-display font-semibold"
            title="Precedente [←]"
          >
            [ ← PREV ]
          </button>
          <button
            type="button"
            onClick={onNext}
            className="p-1 hover:text-black cursor-pointer font-display font-semibold"
            title="Successivo [→]"
          >
            [ NEXT → ]
          </button>
        </div>
      </div>

      {/* 50/50 SPLIT SCREEN LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-y-auto lg:overflow-hidden">
        {/* ======================================================== */}
        {/* LEFT HALF: LARGE IMAGE / MEDIA WITH CORNER ANNOTATIONS    */}
        {/* ======================================================== */}
        <div className="relative border-b lg:border-b-0 lg:border-r border-black/15 p-6 sm:p-10 flex flex-col justify-between bg-[#F2F2EF]/60">
          {/* Top Corner Technical Annotations */}
          <div className="w-full flex items-start justify-between font-body text-[10px] text-black/60 uppercase tracking-wider z-10">
            <div>
              <span className="font-display font-bold text-black">L. {item.number}</span> — {item.authorOrSubject}
              <br />
              <span className="opacity-75">ANNO: {item.year}</span>
            </div>
            <div className="text-right">
              {item.tipoDiMedia.toUpperCase()} / ARCHIVIO
              <br />
              <span className="opacity-75">{item.tipologia.toUpperCase()}</span>
            </div>
          </div>

          {/* Centered Media */}
          <div className="my-auto w-full flex flex-col items-center justify-center py-4">
            <motion.div
              layoutId={`item-media-${item.id}`}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full max-w-[500px] aspect-[4/3] sm:aspect-square rounded-none overflow-hidden bg-white border-2 border-black shadow-2xl shadow-black/10 flex flex-col justify-between"
            >
              {/* 1. PHOTO */}
              {item.type === "photo" && (
                <div className="w-full flex-1 min-h-0 flex items-center justify-center p-3 sm:p-5 bg-white">
                  <img
                    src={selectedImage || item.imageUrl || ""}
                    alt={item.title}
                    loading="eager"
                    draggable={false}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-none block select-none filter contrast-[1.02]"
                  />
                </div>
              )}

              {/* Didascalia esplicativa */}
              {item.isIllustrativeImage && (
                <div className="w-full bg-[#EAEAE5] border-t border-black/15 px-3 py-2 z-10 flex items-center justify-center gap-1.5 shrink-0">
                  <Info className="w-3.5 h-3.5 text-black/70 shrink-0" />
                  <p className="font-body text-[9.5px] text-black/80 leading-snug tracking-tight text-center select-none">
                    {item.imageDisclaimer || "Immagine esempio esplicativa del caso studio"}
                  </p>
                </div>
              )}

              {/* 2. AUDIO */}
              {item.type === "audio" && (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white">
                  <div className="flex items-center gap-1.5 h-20 w-full justify-center overflow-hidden mb-6">
                    {(item.audioWaveform || [40, 70, 90, 50, 80, 100, 60, 40]).map((h, idx) => (
                      <div
                        key={idx}
                        style={{ height: `${h * 0.9}%` }}
                        className="w-2.5 bg-black rounded-none"
                      />
                    ))}
                  </div>
                  <AudioPlayerSnippet
                    duration={item.audioDuration}
                    waveform={item.audioWaveform}
                  />
                </div>
              )}

              {/* 3. TEXT */}
              {item.type === "text" && (
                <div className="w-full h-full p-6 sm:p-10 flex flex-col justify-center bg-white overflow-y-auto">
                  {item.microKeyword && (
                    <div className="mb-4">
                      <span className="font-display text-xs font-bold tracking-widest text-black px-2.5 py-1 border border-black uppercase shadow-sm">
                        {item.microKeyword}
                      </span>
                    </div>
                  )}
                  <span className="text-4xl font-serif text-black/30 mb-2 select-none leading-none">“</span>
                  <p className="font-body text-xs sm:text-sm text-black leading-relaxed italic text-justify">
                    {item.sintesiConcettuale || item.excerpt}
                  </p>
                  <span className="font-body text-[10px] text-black/60 uppercase tracking-wider mt-4 text-right block">
                    — {item.authorOrSubject} ({item.year})
                  </span>
                </div>
              )}
            </motion.div>

            {/* Gallery Thumbnails */}
            {item.galleryUrls && item.galleryUrls.length > 0 && item.imageUrl && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 z-10 max-w-md">
                <div
                  onClick={() => setSelectedImage(item.imageUrl || "")}
                  className={`w-9 h-9 sm:w-11 sm:h-11 border cursor-pointer overflow-hidden transition-all ${
                    selectedImage === item.imageUrl
                      ? "border-black ring-2 ring-black scale-105"
                      : "border-black/20 opacity-70 hover:opacity-100"
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
                        ? "border-black ring-2 ring-black scale-105"
                        : "border-black/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={gUrl} alt="" className="w-full h-full object-cover pointer-events-none" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Corner Annotations */}
          <div className="w-full flex items-end justify-between font-body text-[10px] text-black/60 uppercase tracking-wider z-10">
            <div>
              ARCHIVIO · SEGNI E TESTIMONIANZE
              <br />
              <span className="opacity-75">STATUS: CONSERVATO</span>
            </div>
            <div className="text-right">
              ID: {item.id.toUpperCase()}
              <br />
              <span className="opacity-75">CATEGORIA: {item.categorie.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT HALF: TITLE, STORY & TECHNICAL SPEC SHEET          */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative h-full overflow-y-auto bg-[#F8F8F6] custom-scrollbar"
        >
          <div className="min-h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 pb-14 sm:pb-20">
            <div>
              {/* Category Boxed Tag */}
              <div className="inline-flex flex-wrap items-center gap-2 mb-4">
                <div className="border border-black px-2.5 py-1 font-display font-bold text-[10px] text-black uppercase tracking-wider bg-black/5">
                  <span>✱</span> {item.segno.toUpperCase()} · {item.tipologia.toUpperCase()}
                </div>
                <div className="border border-black/20 px-2 py-1 font-body text-[9px] text-black/70 uppercase tracking-wider">
                  TONO: {item.tono.toUpperCase()}
                </div>
                <div className="border border-black/20 px-2 py-1 font-body text-[9px] text-black/70 uppercase tracking-wider">
                  MEDIA: {item.tipoDiMedia.toUpperCase()}
                </div>
                <div className="border border-black/20 px-2 py-1 font-body text-[9px] text-black/70 uppercase tracking-wider">
                  CATEGORIA: {item.categorie.toUpperCase()}
                </div>
              </div>

              {/* Big Bold Headline in Alte Haas Grotesk */}
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-black leading-[1.08] mb-2">
                {item.title}
              </h1>

              {/* Author & Year Subheading */}
              <div className="font-body text-xs sm:text-[13px] text-black/60 uppercase tracking-wider mb-6 pb-2 border-b border-black/15">
                <span className="font-bold text-black">{item.authorOrSubject}</span> · {item.year}
              </div>

              {/* Sintesi Concettuale / Story in Indivisible */}
              <div className="font-body text-xs sm:text-[13px] text-black/85 leading-relaxed max-w-xl mb-6 text-justify">
                <p>{item.sintesiConcettuale || item.caption || item.excerpt}</p>
              </div>

              {/* TECHNICAL SPECIFICATION TABLE */}
              <div className="w-full border-t border-b border-black/20 font-body text-[11px] mb-6">
                {/* Row 1 */}
                <div className="grid grid-cols-2 border-b border-black/10 py-1.5">
                  <div className="flex items-center justify-between pr-4 border-r border-black/10">
                    <span className="text-black/50 text-[10px] uppercase font-semibold">SEGNATURA</span>
                    <span className="font-display font-bold text-black">SEG-{item.number}</span>
                  </div>
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-black/50 text-[10px] uppercase font-semibold">ANNO ORIGINE</span>
                    <span className="font-display font-bold text-black">{item.year}</span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 border-b border-black/10 py-1.5">
                  <div className="flex items-center justify-between pr-4 border-r border-black/10">
                    <span className="text-black/50 text-[10px] uppercase font-semibold">SEGNO</span>
                    <span className="font-display font-bold text-black uppercase">{item.segno}</span>
                  </div>
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-black/50 text-[10px] uppercase font-semibold">TIPOLOGIA</span>
                    <span className="font-display font-bold text-black uppercase">{item.tipologia}</span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-2 border-b border-black/10 py-1.5">
                  <div className="flex items-center justify-between pr-4 border-r border-black/10">
                    <span className="text-black/50 text-[10px] uppercase font-semibold">TONO</span>
                    <span className="font-display font-bold text-black">{item.tono}</span>
                  </div>
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-black/50 text-[10px] uppercase font-semibold">TIPO DI MEDIA</span>
                    <span className="font-display font-bold text-black uppercase">{item.tipoDiMedia}</span>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-2 border-b border-black/10 py-1.5">
                  <div className="flex items-center justify-between pr-4 border-r border-black/10">
                    <span className="text-black/50 text-[10px] uppercase font-semibold">CATEGORIA</span>
                    <span className="font-display font-bold text-black uppercase">{item.categorie}</span>
                  </div>
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-black/50 text-[10px] uppercase font-semibold">AUTORE / ARTISTA</span>
                    <span className="font-display font-bold text-black truncate">{item.authorOrSubject}</span>
                  </div>
                </div>

                {/* Row 5 - Stile Visivo */}
                {item.stileVisivo && item.stileVisivo !== "—" && (
                  <div className="py-1.5 border-b border-black/10">
                    <span className="text-black/50 text-[10px] uppercase block mb-0.5 font-semibold">STILE VISIVO</span>
                    <span className="text-black text-[11px] font-body text-justify hyphens-auto block">{item.stileVisivo}</span>
                  </div>
                )}

                {/* Row 6 - Sociological Indicators with Original Categories */}
                {(item.mascherabilita !== "—" || item.accettabilitaSociale !== "—") && (
                  <div className="grid grid-cols-2 py-2 bg-black/[0.03] px-2.5 mt-1 border border-black/10">
                    <div className="pr-2 border-r border-black/10 space-y-1">
                      <div className="text-[9.5px] text-black/60 uppercase">
                        MASCHERABILITÀ: <span className="font-display font-bold text-black">{item.mascherabilita}</span>
                      </div>
                      <div className="text-[9.5px] text-black/60 uppercase">
                        PERCEZIONE SOCIALE: <span className="font-display font-bold text-black">{item.percezioneSociale}</span>
                      </div>
                      <div className="text-[9.5px] text-black/60 uppercase">
                        VALENZA DEL RICORDO: <span className="font-display font-bold text-black">{item.valenzaDelRicordo}</span>
                      </div>
                    </div>
                    <div className="pl-2 space-y-1">
                      <div className="text-[9.5px] text-black/60 uppercase">
                        ACCETTABILITÀ SOCIALE: <span className="font-display font-bold text-black">{item.accettabilitaSociale}</span>
                      </div>
                      <div className="text-[9.5px] text-black/60 uppercase">
                        PERCEZIONE ESTETICA: <span className="font-display font-bold text-black">{item.percezioneEstetica}</span>
                      </div>
                      <div className="text-[9.5px] text-black/60 uppercase">
                        SENSO DI VERGOGNA: <span className="font-display font-bold text-black">{item.sensoDiVergogna}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Extra notes / context */}
              {item.notes && item.notes !== "Conservato nell'archivio." && (
                <div className="bg-black/[0.03] border-l-2 border-black p-3 font-body text-xs text-black/80 mb-4 text-justify hyphens-auto">
                  <span className="text-[10px] uppercase font-display font-bold text-black block mb-1">
                    NOTE & CONTESTO CURATORIALE:
                  </span>
                  {item.notes}
                </div>
              )}

              {/* External Link */}
              <div className="flex flex-wrap items-center gap-3 font-body text-[10px] mb-6">
                {item.externalLink && (
                  <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-[#F8F8F6] uppercase hover:bg-black/85 transition-colors font-display font-bold tracking-wider"
                  >
                    <span>[ APRI PROGETTO / FONTE ESTERNA ↗ ]</span>
                  </a>
                )}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-5 mt-6 border-t-2 border-black flex items-end justify-between font-body">
              <div>
                <span className="text-[10px] text-black/50 uppercase block mb-0.5 font-semibold">
                  SEGNATURA ARCHIVIO · CLASSIFICAZIONE
                </span>
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-black">
                  № {item.number}
                </span>
              </div>

              {/* Next/Prev Swipe Trigger Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrev}
                  className="px-3 py-1.5 border border-black hover:bg-black hover:text-[#F8F8F6] text-xs text-black font-display font-bold cursor-pointer transition-colors"
                >
                  [ ← PREV ]
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="px-3 py-1.5 border border-black hover:bg-black hover:text-[#F8F8F6] text-xs text-black font-display font-bold cursor-pointer transition-colors"
                >
                  [ NEXT → ]
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
