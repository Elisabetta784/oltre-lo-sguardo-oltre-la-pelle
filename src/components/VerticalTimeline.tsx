"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArchiveItem } from "@/data/archiveData";

interface VerticalTimelineProps {
  currentView: "beyond" | "macro" | "micro";
  items: ArchiveItem[];
  activeItemId: string;
  zoomLevel: number; // 0 (full beyond) to 1 (full micro)
  onZoomChange: (zoom: number) => void;
  onSelectItem: (item: ArchiveItem) => void;
  onToggleView: (view: "beyond" | "macro" | "micro") => void;
}

export function VerticalTimeline({
  currentView,
  items,
  activeItemId,
  zoomLevel,
  onZoomChange,
  onSelectItem,
  onToggleView,
}: VerticalTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const activeIndex = items.findIndex((i) => i.id === activeItemId);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  // The thumb position percentage (0% to 100%)
  const thumbPercent =
    currentView === "micro"
      ? 100
      : currentView === "beyond"
      ? 0
      : Math.max(12, Math.min(88, zoomLevel <= 0.24 ? 24 : 24 + ((zoomLevel - 0.24) / (1 - 0.24)) * 64));

  const currentLabelNumber =
    currentView === "micro"
      ? String(safeActiveIndex + 1).padStart(3, "0")
      : currentView === "beyond"
      ? "BEYOND"
      : zoomLevel <= 0.25
      ? "MACRO"
      : `${Math.round(zoomLevel * 100)}%`;

  const handlePointerMove = (clientY: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    if (currentView === "micro") {
      // In micro, scrub items
      const targetIndex = Math.min(
        items.length - 1,
        Math.max(0, Math.round(ratio * (items.length - 1)))
      );
      if (items[targetIndex]) {
        onSelectItem(items[targetIndex]);
      }
    } else {
      if (ratio < 0.08) {
        onZoomChange(0);
        if (currentView !== "beyond") onToggleView("beyond");
      } else if (ratio >= 0.08 && ratio < 0.88) {
        const macroZoom = 0.24 + ((ratio - 0.08) / (0.88 - 0.08)) * (1 - 0.24);
        onZoomChange(macroZoom);
        if (currentView !== "macro") onToggleView("macro");
      } else {
        onZoomChange(1);
        onToggleView("micro");
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointerMove(e.clientY);
  };

  const handlePointerMoveEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handlePointerMove(e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (currentView === "beyond") {
      if (e.deltaY > 0 || (e.ctrlKey && e.deltaY < 0)) {
        onToggleView("macro");
        onZoomChange(0.24);
      }
      return;
    }
    const delta = -e.deltaY * 0.002;
    const nextZoom = Math.max(0, Math.min(1, zoomLevel + delta));
    if (nextZoom < 0.05) {
      onToggleView("beyond");
      onZoomChange(0);
    } else {
      onZoomChange(nextZoom);
    }
  };

  return (
    <aside className="fixed right-3 sm:right-6 top-[68px] bottom-8 z-30 flex flex-col items-end select-none">
      {/* Top Value indicator (e.g. 025% or DOC 042) */}
      <div className="font-mono text-xs sm:text-[13px] font-bold text-[#523719] mb-3 tracking-widest text-right pr-1">
        {currentLabelNumber}
      </div>

      {/* Main Track container with separate label column and line track */}
      <div className="relative flex-1 flex items-stretch gap-2.5 sm:gap-3 touch-none">
        {/* Left Column: Dedicated interactive labels (positioned to the left, never overlapping the line) */}
        <div className="relative flex flex-col justify-between py-0 text-right min-w-[56px] pointer-events-auto">
          {/* 1. BEYOND (Sopra - 0%) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleView("beyond");
              onZoomChange(0);
            }}
            className={`absolute top-0 right-0 -translate-y-1/2 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase transition-all cursor-pointer whitespace-nowrap px-1 py-0.5 ${
              currentView === "beyond"
                ? "text-[#c026d3] font-black scale-105"
                : "text-[#88562C]/60 hover:text-[#523719] font-semibold"
            }`}
            title="Vista Beyond (0%)"
          >
            BEYOND
          </button>

          {/* 2. MACRO (Poco più giù - 24%) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleView("macro");
              onZoomChange(0.24);
            }}
            style={{ top: "24%" }}
            className={`absolute right-0 -translate-y-1/2 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase transition-all cursor-pointer whitespace-nowrap px-1 py-0.5 ${
              currentView === "macro"
                ? "text-[#523719] font-black scale-105"
                : "text-[#88562C]/60 hover:text-[#523719] font-semibold"
            }`}
            title="Vista Macro (24%)"
          >
            MACRO
          </button>

          {/* 3. MICRO (In fondo - 100%) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleView("micro");
              onZoomChange(1);
            }}
            className={`absolute bottom-0 right-0 translate-y-1/2 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase transition-all cursor-pointer whitespace-nowrap px-1 py-0.5 ${
              currentView === "micro"
                ? "text-[#523719] font-black scale-105"
                : "text-[#88562C]/60 hover:text-[#523719] font-semibold"
            }`}
            title="Vista Micro (100%)"
          >
            MICRO
          </button>
        </div>

        {/* Right Column: Track with Central Line, Ticks, and Draggable Thumb */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMoveEvent}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          className="relative w-5 sm:w-6 flex items-center justify-center cursor-pointer group"
          title="Trascina o usa la rotellina per zoomare tra Beyond, Macro e Micro"
        >
          {/* The Central Line */}
          <div className="relative w-[1.5px] h-full bg-[#88562C]/40 group-hover:bg-[#88562C] transition-colors">
            {/* Tick marks along the track (inspired by Kellerstöckl style.css) */}
            {Array.from({ length: 25 }, (_, i) => {
              const isTall = i % 4 === 0;
              const topPct = (i / 24) * 100;
              return (
                <div
                  key={i}
                  style={{ top: `${topPct}%` }}
                  className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                    isTall
                      ? "w-4 sm:w-5 h-[1.5px] bg-[#523719]"
                      : "w-2 sm:w-2.5 h-[1px] bg-[#88562C]/50"
                  }`}
                />
              );
            })}

            {/* Solid prominent thumb (pallino), 18px diameter */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
              animate={{ top: `${thumbPercent}%` }}
              transition={
                isDragging
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 400, damping: 30 }
              }
            >
              <div className="relative flex items-center justify-center">
                {/* Outer ring */}
                <div className="w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-full bg-[#523719] border-2 border-[#f5f0e0] shadow-md shadow-[#523719]/40" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </aside>
  );
}
