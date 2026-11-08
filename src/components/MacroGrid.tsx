"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { ArchiveItem, ARCHIVE_ASPECT_RATIOS } from "@/data/archiveData";

interface MacroGridProps {
  items: ArchiveItem[];
  activeItemId: string;
  zoomLevel: number; // 0 to 1
  onZoomChange: (newZoom: number) => void;
  onSelectItem: (item: ArchiveItem) => void;
  isFilterOpen?: boolean;
  onCloseFilter?: () => void;
  onToggleFilter?: () => void;
  onGoToBeyond?: () => void;
}

/**
 * Computes deterministic grid positions for visual cases and inserts the interactive ribbon
 * directly above the penultimate row, faithfully recreating inspo/nuova home.png.
 */
function getGridConfig(totalCount: number) {
  if (totalCount > 50) {
    const cols = 11;
    const numImageRows = Math.ceil(totalCount / cols); // 7 image rows
    // Penultimate image row is row (numImageRows - 1) = row 6.
    // The interactive bar sits right above the penultimate row => gridRow = 6.
    // Rows 1..5: images (55 cases)
    // Row 6: INTERACTIVE NAVIGATION RIBBON (OLTRE | MACRO | FILTRI)
    // Row 7: images (penultimate row of images, 11 cases)
    // Row 8: images (last row of images, 10 cases)
    const barRow = numImageRows - 1; // 6
    const totalRows = numImageRows + 1; // 8
    const positions: { row: number; col: number; offsetX: number; offsetY: number }[] = [];
    
    // Subtle organic rhythm for exhibition wall
    const offsets = [
      { x: 0, y: 0 },
      { x: 3, y: -4 },
      { x: -4, y: 3 },
      { x: 2, y: 3 },
      { x: -3, y: -2 },
      { x: 4, y: 2 },
      { x: -2, y: -3 },
    ];

    for (let i = 0; i < totalCount; i++) {
      const off = offsets[i % offsets.length];
      const imageRow = Math.floor(i / cols) + 1;
      const row = imageRow >= barRow ? imageRow + 1 : imageRow;
      const col = (i % cols) + 1;
      positions.push({
        row,
        col,
        offsetX: off.x,
        offsetY: off.y,
      });
    }

    return {
      cols,
      totalRows,
      barRow,
      positions,
      baseTilePx: 104, // Area reference dimension
      maxTilePx: 210,
    };
  }

  // Filtered state with fewer items (e.g. 5-30 items)
  const cols = Math.max(4, Math.min(8, Math.ceil(Math.sqrt(totalCount * 1.5))));
  const numImageRows = Math.ceil(totalCount / cols);
  const barRow = numImageRows >= 3 ? numImageRows - 1 : Math.max(1, numImageRows);
  const totalRows = numImageRows >= 2 ? numImageRows + 1 : 2;
  const positions: { row: number; col: number; offsetX: number; offsetY: number }[] = [];

  for (let i = 0; i < totalCount; i++) {
    const imageRow = Math.floor(i / cols) + 1;
    const row = imageRow >= barRow ? imageRow + 1 : imageRow;
    const col = (i % cols) + 1;
    positions.push({
      row,
      col,
      offsetX: 0,
      offsetY: 0,
    });
  }

  return {
    cols,
    totalRows,
    barRow,
    positions,
    baseTilePx: 124,
    maxTilePx: 240,
  };
}

interface MacroTileProps {
  item: ArchiveItem;
  isActive: boolean;
  isHovered: boolean;
  hasHoveredSibling: boolean;
  isFilterOpen: boolean;
  row: number;
  col: number;
  offsetX: number;
  offsetY: number;
  onSelect: (item: ArchiveItem) => void;
  onHover: (item: ArchiveItem | null) => void;
}

const MacroTile = React.memo(function MacroTile({
  item,
  isActive,
  isHovered,
  hasHoveredSibling,
  isFilterOpen,
  row,
  col,
  offsetX,
  offsetY,
  onSelect,
  onHover,
}: MacroTileProps) {
  // Focus & Sharpness:
  // - In filter mode: All matching images are 100% in focus, sharp and clear ("a fuoco")!
  // - In normal mode: Full sharpness and clarity, subtle highlight on hover
  const tileOpacity = isFilterOpen
    ? 1
    : isHovered
    ? 1
    : hasHoveredSibling
    ? 0.45
    : 1;

  // Retrieve natural pixel aspect ratio to strictly preserve original proportions:
  const dim = ARCHIVE_ASPECT_RATIOS[item.id] || { w: 100, h: 100, ratio: item.aspectRatio || 1.33 };
  const ratio = dim.ratio;
  // Area-normalized scale factor:
  // width = base * sqrt(ratio), height = base / sqrt(ratio)
  // Guarantees balanced visual surface area while perfectly respecting original proportions.
  const sqrtRatio = Math.sqrt(Math.max(0.5, Math.min(2.1, ratio)));

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(item);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item);
        }
      }}
      onMouseEnter={() => onHover(item)}
      onMouseLeave={() => onHover(null)}
      style={{
        gridRow: row,
        gridColumn: col,
        width: `calc(var(--tile-size) * ${sqrtRatio.toFixed(3)})`,
        height: `calc(var(--tile-size) / ${sqrtRatio.toFixed(3)})`,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        opacity: tileOpacity,
      }}
      className={`pointer-events-auto flex items-center justify-center cursor-pointer relative group transition-opacity duration-150 ${
        isHovered ? "z-30" : "z-10"
      }`}
    >
      <motion.div
        layoutId={`item-media-${item.id}`}
        animate={{
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          height: "100%",
          aspectRatio: `${dim.w} / ${dim.h}`,
        }}
        className={`w-full h-full rounded-none overflow-hidden bg-white transition-all duration-200 cursor-pointer ${
          isHovered
            ? "border-2 border-black shadow-xl shadow-black/25"
            : isActive
            ? "border-2 border-black shadow-md shadow-black/15"
            : "border border-black/25 hover:border-black"
        }`}
      >
        {/* 1. PHOTO - Sharp, in focus, 100% natural proportions */}
        {item.type === "photo" && (
          <img
            src={item.thumbnailUrl || item.imageUrl || ""}
            alt={item.title}
            draggable={false}
            loading="eager"
            decoding="async"
            style={{
              imageRendering: "-webkit-optimize-contrast",
            }}
            className="w-full h-full object-cover rounded-none block pointer-events-none select-none filter-none"
          />
        )}

        {/* 2. AUDIO */}
        {item.type === "audio" && (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#F2F2EF]">
            <div className="flex items-center gap-1 h-6 w-full justify-center overflow-hidden">
              {(item.audioWaveform || [40, 70, 90, 50, 80, 100, 60, 40])
                .slice(0, 8)
                .map((h, bIdx) => (
                  <div
                    key={bIdx}
                    style={{ height: `${h * 0.75}%` }}
                    className="w-1 bg-black rounded-none"
                  />
                ))}
            </div>
            <Volume2 className="w-3.5 h-3.5 text-black mt-1 opacity-80" />
          </div>
        )}

        {/* 3. TEXT / THEORETICAL ESSAY */}
        {item.type === "text" && (
          <div className="w-full h-full p-2 flex flex-col justify-center items-center bg-[#EAEAE5] overflow-hidden text-center select-none">
            <span className="font-display text-[9px] font-bold text-black tracking-wider uppercase leading-tight line-clamp-2">
              {item.microKeyword || item.title}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
});

export function MacroGrid({
  items,
  activeItemId,
  zoomLevel,
  onZoomChange,
  onSelectItem,
  isFilterOpen = false,
  onCloseFilter,
  onToggleFilter,
  onGoToBeyond,
}: MacroGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [hoveredTileItem, setHoveredTileItem] = useState<ArchiveItem | null>(null);

  const displayItems = items;
  const gridConfig = useMemo(
    () => getGridConfig(displayItems.length),
    [displayItems.length]
  );
  const { cols, totalRows, barRow, positions, baseTilePx, maxTilePx } = gridConfig;

  // Max scale at 100% zoom
  const maxScale = 2.8;

  const targetZoomRef = useRef(zoomLevel);
  const currentZoomRef = useRef(zoomLevel);
  const lastTilePxRef = useRef(baseTilePx);
  const rafRef = useRef<number | null>(null);
  const lastReportedZoomRef = useRef(zoomLevel);
  const lastReportTimeRef = useRef(0);

  // Normalized cursor anchor (0..1)
  const targetFocusRef = useRef({ u: 0.5, v: 0.5 });
  const currentFocusRef = useRef({ u: 0.5, v: 0.5 });

  useEffect(() => {
    targetZoomRef.current = zoomLevel;
  }, [zoomLevel]);

  // Track cursor position
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const u = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const v = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        targetFocusRef.current = { u, v };
      }
    };

    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // RAF loop for silky smooth zoom and panning
  useEffect(() => {
    let isRunning = true;

    const animateLoop = () => {
      if (!isRunning) return;

      const zoomDiff = targetZoomRef.current - currentZoomRef.current;
      if (Math.abs(zoomDiff) > 0.0001) {
        currentZoomRef.current += zoomDiff * 0.12;
      } else {
        currentZoomRef.current = targetZoomRef.current;
      }

      const focusXDiff = targetFocusRef.current.u - currentFocusRef.current.u;
      currentFocusRef.current.u += focusXDiff * 0.09;

      const focusYDiff = targetFocusRef.current.v - currentFocusRef.current.v;
      currentFocusRef.current.v += focusYDiff * 0.09;

      const curZoom = currentZoomRef.current;

      const zoomProgress = curZoom >= 0.24
        ? Math.min(1, (curZoom - 0.24) / (1 - 0.24))
        : 0;

      const curTilePx = Math.round(baseTilePx + Math.pow(zoomProgress, 1.1) * (maxTilePx - baseTilePx));

      let scale = 1.0;
      if (curZoom >= 0.24) {
        scale = 1.0 + Math.pow(zoomProgress, 1.15) * (maxScale - 1.0);
      } else {
        const dezoomProgress = Math.max(0, curZoom / 0.24);
        scale = 0.88 + dezoomProgress * (1.0 - 0.88);
      }

      const el = containerRef.current;
      if (el && gridRef.current) {
        const rect = el.getBoundingClientRect();
        const W = rect.width;
        const H = rect.height;
        const cx = W / 2;
        const cy = H / 2;

        const cursorX = currentFocusRef.current.u * W;
        const cursorY = currentFocusRef.current.v * H;

        const dx = cursorX - cx;
        const dy = cursorY - cy;

        let tx = -dx * (scale - 1);
        let ty = -dy * (scale - 1);

        const maxTx = Math.max(0, (W * scale - W) / 2);
        const maxTy = Math.max(0, (H * scale - H) / 2);

        tx = Math.max(-maxTx, Math.min(maxTx, tx));
        ty = Math.max(-maxTy, Math.min(maxTy, ty));

        if (lastTilePxRef.current !== curTilePx) {
          lastTilePxRef.current = curTilePx;
          gridRef.current.style.setProperty("--tile-size", `${curTilePx}px`);
        }

        gridRef.current.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0px) scale(${scale.toFixed(4)})`;
      }

      const now = performance.now();
      if (
        now - lastReportTimeRef.current > 40 &&
        Math.abs(curZoom - lastReportedZoomRef.current) > 0.006
      ) {
        lastReportTimeRef.current = now;
        lastReportedZoomRef.current = curZoom;
        onZoomChange(curZoom);
      }

      if (curZoom <= 0.05 && targetZoomRef.current <= 0.05) {
        onGoToBeyond?.();
      }

      rafRef.current = requestAnimationFrame(animateLoop);
    };

    rafRef.current = requestAnimationFrame(animateLoop);
    return () => {
      isRunning = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [baseTilePx, maxTilePx, maxScale, onZoomChange, onGoToBeyond]);

  // Trackpad pinch/wheel
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let accumulatedDezoom = 0;
    let dezoomTimer: NodeJS.Timeout | null = null;
    let isLocked = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isLocked) return;

      let delta = 0;
      if (e.ctrlKey) {
        delta = -e.deltaY * 0.0035;
      } else {
        delta = -e.deltaY * 0.00075;
      }

      if (delta < 0 && targetZoomRef.current <= 0.26) {
        accumulatedDezoom += Math.abs(delta);
        if (accumulatedDezoom > 0.065) {
          isLocked = true;
          accumulatedDezoom = 0;
          onGoToBeyond?.();
          return;
        }
        if (dezoomTimer) clearTimeout(dezoomTimer);
        dezoomTimer = setTimeout(() => {
          accumulatedDezoom = 0;
        }, 400);
      } else if (delta > 0) {
        accumulatedDezoom = 0;
      }

      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const u = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const v = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        targetFocusRef.current = { u, v };
      }

      const nextTarget = Math.max(0, Math.min(1, targetZoomRef.current + delta));
      targetZoomRef.current = nextTarget;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (dezoomTimer) clearTimeout(dezoomTimer);
    };
  }, [onGoToBeyond]);

  const containerStyle = {
    "--tile-size": `${baseTilePx}px`,
    transformOrigin: "center center",
    willChange: "transform",
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: Array.from({ length: totalRows }, (_, idx) => {
      const rowNum = idx + 1;
      if (rowNum === barRow) {
        return "auto";
      }
      return "minmax(0, 1fr)";
    }).join(" "),
    gap: "16px",
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden flex items-center justify-center select-none bg-[#F8F8F6]"
    >
      {/* 1. BOTTOM LEFT: Trackpad hint only */}
      <div className="fixed bottom-6 left-6 z-20 font-body text-[10px] text-black/40 uppercase tracking-wider hidden sm:block pointer-events-none">
        PINCH / SCROLL PER ZOOMARE
      </div>

      {/* 2. BOTTOM-RIGHT CORNER PREVIEW DOCK: ONLY APPEARS ON CURSOR HOVER (WHEN FILTERS ARE CLOSED) */}
      <AnimatePresence>
        {hoveredTileItem && !isFilterOpen && (
          <motion.div
            key={hoveredTileItem.id}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectItem(hoveredTileItem);
            }}
            className="fixed bottom-6 right-6 sm:right-8 z-30 w-64 sm:w-72 bg-[#F8F8F6] border-2 border-black p-3 shadow-2xl shadow-black/25 cursor-pointer group pointer-events-auto"
          >
            <div className="relative w-full aspect-[4/3] bg-white overflow-hidden mb-2.5 border border-black/15">
              <img
                src={hoveredTileItem.imageUrl || hoveredTileItem.thumbnailUrl || ""}
                alt={hoveredTileItem.title}
                loading="eager"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter-none"
              />
              <div className="absolute top-2 left-2 bg-black text-[#F8F8F6] px-1.5 py-0.5 font-display text-[9px] font-bold tracking-wider">
                SEG-{hoveredTileItem.number}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-bold text-xs text-black uppercase tracking-tight line-clamp-1 group-hover:underline">
                {hoveredTileItem.title}
              </h3>
              <div className="flex items-center justify-between font-body text-[10px] text-black/60 uppercase">
                <span>{hoveredTileItem.authorOrSubject}</span>
                <span>{hoveredTileItem.year}</span>
              </div>
              <div className="pt-1.5 border-t border-black/10 flex items-center justify-between text-[9px] font-body text-black uppercase tracking-wider">
                <span className="font-semibold text-black/80">{hoveredTileItem.segno}</span>
                <span className="flex items-center gap-0.5 text-black font-bold group-hover:translate-x-0.5 transition-transform">
                  ESPLORA <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. EDGE DISSOLVES IN #F8F8F6 */}
      <div className="fixed top-0 left-0 right-0 h-16 edge-fade-top z-20 pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-16 edge-fade-bottom z-20 pointer-events-none" />
      <div className="fixed top-0 bottom-0 left-0 w-16 sm:w-28 edge-fade-left z-20 pointer-events-none" />
      <div className="fixed top-0 bottom-0 right-0 w-16 sm:w-28 edge-fade-right z-20 pointer-events-none" />

      {/* 4. SYMMETRICALLY CENTERED CSS GRID WITH FULL CLICKABILITY AND ZERO BLUR */}
      <div
        ref={gridRef}
        style={containerStyle}
        className="relative z-20 w-full h-full max-w-[96vw] max-h-[90vh] p-4 px-6 sm:px-12 transition-all duration-300 grid items-center justify-items-center pointer-events-auto"
      >
        {displayItems.length === 0 ? (
          <div className="col-span-full row-span-full pointer-events-auto flex flex-col items-center justify-center p-8 text-center border border-dashed border-black/30 bg-[#F8F8F6] w-full max-w-md my-auto shadow-md">
            <p className="font-display text-sm uppercase tracking-wider text-black font-bold mb-1.5">
              NESSUN SEGNO CORRISPONDENTE
            </p>
            <p className="font-body text-xs text-black/60 max-w-xs">
              Prova a reimpostare o combinare diversamente i filtri selezionati.
            </p>
          </div>
        ) : (
          <>
            {displayItems.map((item, idx) => {
              const pos = positions[idx] || { row: 1, col: 1, offsetX: 0, offsetY: 0 };
              const isHovered = hoveredTileItem?.id === item.id;
              return (
                <MacroTile
                  key={item.id}
                  item={item}
                  isActive={activeItemId === item.id}
                  isHovered={isHovered}
                  hasHoveredSibling={hoveredTileItem !== null && !isHovered}
                  isFilterOpen={isFilterOpen}
                  row={pos.row}
                  col={pos.col}
                  offsetX={pos.offsetX}
                  offsetY={pos.offsetY}
                  onSelect={onSelectItem}
                  onHover={setHoveredTileItem}
                />
              );
            })}

            {/* 5. INTERACTIVE HORIZONTAL RIBBON ABOVE PENULTIMATE ROW (INSPO NUOVA HOME.PNG) */}
            <div
              style={{
                gridRow: barRow,
                gridColumn: "1 / -1",
              }}
              className="w-full my-1 pointer-events-auto z-20"
            >
              <div className="w-full bg-[#0D0D0D] text-[#F8F8F6] border-y border-black/50 shadow-xl shadow-black/25 flex flex-col sm:flex-row items-stretch justify-between divide-y sm:divide-y-0 sm:divide-x divide-white/15">
                {/* SECTION 1: OLTRE */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGoToBeyond?.();
                  }}
                  className="group flex-1 flex items-center justify-between px-5 py-3.5 hover:bg-[#1A1A1A] transition-colors cursor-pointer text-left"
                >
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-xs sm:text-sm tracking-widest text-[#F8F8F6] group-hover:text-white flex items-center gap-2">
                      OLTRE
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#F8F8F6]/60 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </span>
                    <span className="font-body text-[9px] text-[#F8F8F6]/50 uppercase tracking-wider group-hover:text-[#F8F8F6]/80 transition-colors">
                      VISIONE SISTEMICA / 6 DIALETTICHE
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="w-1.5 h-1.5 rounded-full border border-white" />
                    <span className="w-1.5 h-1.5 rounded-full border border-white" />
                    <span className="w-1.5 h-1.5 rounded-full border border-white" />
                  </div>
                </button>

                {/* SECTION 2: MACRO */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    targetZoomRef.current = 0.24;
                    currentZoomRef.current = 0.24;
                    targetFocusRef.current = { u: 0.5, v: 0.5 };
                    currentFocusRef.current = { u: 0.5, v: 0.5 };
                    onZoomChange?.(0.24);
                  }}
                  className="group flex-1 flex items-center justify-between px-5 py-3.5 hover:bg-[#161616] transition-colors cursor-pointer text-left bg-[#141414]"
                >
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-xs sm:text-sm tracking-widest text-[#F8F8F6] flex items-center gap-2">
                      MACRO
                      <span className="inline-block w-2 h-2 rounded-full bg-white shadow-sm shadow-white/80" />
                    </span>
                    <span className="font-body text-[9px] text-[#F8F8F6]/60 uppercase tracking-wider">
                      ARCHIVIO VISIVO · {displayItems.length} CASI
                    </span>
                  </div>
                  <div className="hidden lg:block font-body text-[9px] uppercase tracking-widest text-[#F8F8F6]/50 border border-white/20 px-2 py-0.5">
                    PANORAMICA
                  </div>
                </button>

                {/* SECTION 3: FILTRI */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFilter?.();
                  }}
                  className={`group flex-1 flex items-center justify-between px-5 py-3.5 transition-colors cursor-pointer text-left ${
                    isFilterOpen
                      ? "bg-[#F8F8F6] text-black hover:bg-white"
                      : "hover:bg-[#1A1A1A] text-[#F8F8F6]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span
                      className={`font-display font-bold text-xs sm:text-sm tracking-widest flex items-center gap-2 ${
                        isFilterOpen ? "text-black" : "text-[#F8F8F6] group-hover:text-white"
                      }`}
                    >
                      FILTRI
                      <SlidersHorizontal
                        className={`w-3.5 h-3.5 ${
                          isFilterOpen ? "text-black" : "text-[#F8F8F6]/70 group-hover:text-white"
                        }`}
                      />
                    </span>
                    <span
                      className={`font-body text-[9px] uppercase tracking-wider ${
                        isFilterOpen ? "text-black/70 font-semibold" : "text-[#F8F8F6]/50 group-hover:text-[#F8F8F6]/80"
                      }`}
                    >
                      {isFilterOpen ? "CHIUDI PANNELLO FILTRI" : "SELEZIONA PER SEGNO & CATEGORIA"}
                    </span>
                  </div>
                  <div
                    className={`text-[9px] font-display font-bold uppercase tracking-wider px-2 py-0.5 border ${
                      isFilterOpen
                        ? "border-black bg-black text-[#F8F8F6]"
                        : "border-white/30 text-[#F8F8F6]/80 group-hover:border-white group-hover:text-white"
                    }`}
                  >
                    {isFilterOpen ? "ATTIVO" : "APRI"}
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
