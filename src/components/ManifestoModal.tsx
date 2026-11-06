"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Feather } from "lucide-react";

interface ManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManifestoModal({ isOpen, onClose }: ManifestoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop with blur & warm tint in #f5f0e0 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#f5f0e0]/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container: Squadrato (rounded-none) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#f5f0e0] border-2 border-[#88562C] rounded-none shadow-2xl p-6 sm:p-10 select-text"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 p-1 text-[#523719] hover:text-[#88562C] transition-colors cursor-pointer"
              aria-label="Chiudi Manifesto"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="border-b border-[#88562C]/25 pb-5 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-[#88562C] uppercase tracking-widest mb-1">
                <Feather className="w-3.5 h-3.5" />
                <span>MANIFESTO &amp; PROGETTO DI RICERCA</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#523719] tracking-tight">
                I Segni della Pelle
              </h2>
              <p className="font-mono-text text-xs text-[#88562C] uppercase tracking-wider mt-0.5">
                EVERY BODY HAS A STORY
              </p>
            </div>

            {/* Research Question Callout */}
            <div className="bg-[#88562C]/10 border-l-4 border-[#88562C] p-4 sm:p-5 rounded-none mb-6">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#88562C] mb-1.5 font-bold">
                [DOMANDA DI RICERCA]
              </div>
              <p className="font-display font-medium text-base sm:text-lg text-[#523719] leading-snug">
                «In quale modo la superficie del corpo si fa archivio vivente, cartografia dell&apos;esperienza individuale e collettiva? Tramite la mappatura dei segni involontari che si imprimono sulla nostra pelle e che raccontano una storia, quali sono le chiavi di lettura e la loro percezione sociale? »
              </p>
            </div>

            {/* Main Manifesto Body */}
            <div className="font-mono-text text-xs sm:text-[13px] text-[#523719]/90 space-y-4 leading-relaxed text-justify">
              <p>
                La pelle non è un supporto neutro né immutabile: è un territorio in costante trasformazione, è la barriera di confine fra la nostra persona e l’esterno, un registro di traumi, memorie affettive, tracce di imposizione sistemica e trasformazioni biologiche. Spesso considerati imperfezioni da cancellare o nascondere, i segni cutanei rappresentano invece la più intima e autentica testimonianza della nostra esistenza.
              </p>

              <p>
                Questo archivio digitale si pone come sguardo collettivo su tutti i segni involontari, quindi non causati dal proprio volere né dall’avanzamento naturale dell’invecchiamento, che raccontano una storia. La mappatura avviene attraverso la ricerca documentale (archivi multimediali, mostre, installazioni, progetti editoriali) e una ricerca attiva delle testimonianze narrate in prima persona.
              </p>

              <p>
                Il progetto invita a riscoprire il valore narrativo di ogni corpo tramite l’ingrandimento su ogni caso studio, ma se si allarga la prospettiva (letteralmente) è possibile vedere come i casi si raggruppano e si distinguono per tematiche sociali ricorrenti, quali la vergogna, la percezione estetica, la valenza del ricordo...
              </p>
            </div>

            {/* Colophon */}
            <div className="mt-8 pt-4 border-t border-[#88562C]/25 text-[10px] font-mono text-[#88562C] flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <span className="font-bold text-[#523719]">Archivio delle Memorie Corporee</span>
                <br />
                Progetto di Ricerca Visiva © 2026
              </div>
              <div className="sm:text-right">
                <span>Fotografia, Audio e Narrazioni aperte</span>
                <br />
                <span className="text-[#523719]">Tutti i corpi custodiscono una storia.</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
