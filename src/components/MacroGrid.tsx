"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowUpRight } from "lucide-react";
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

interface PortionPlacement {
  item: ArchiveItem;
  row: number;
  col: number;
  colSpan: number;
  staggerY: number;
  sizeFactor: number;
}

interface PortionData {
  cols: number;
  rows: number;
  placements: PortionPlacement[];
}

/**
 * Packs items into a designated portion of the 5x3m wall.
 * In full-archive mode (~76 items split into 3 portions of 26, 25, 25 items):
 * - Grid: 4 columns x 8 rows = 32 slots per portion.
 * - 6 to 7 wide landscape items (aspect ratio >= 1.30) span 2 columns as prominent hero anchors.
 * - Single cells interlock compactly with varied size factors (0.92x to 1.08x) and subtle organic staggers.
 * - Strictly keeps all items inside this portion; zero items positioned between adjacent portions.
 */
function packPortionItems(
  portionItems: ArchiveItem[],
  ratiosMap: Record<string, { w: number; h: number; ratio: number }>
): PortionData {
  const count = portionItems.length;
  if (count === 0) {
    return { cols: 1, rows: 1, placements: [] };
  }

  // Full-archive mode: 4 columns x 8 rows = 32 slots
  if (count >= 18) {
    const cols = 4;
    const rows = 8;
    const slots = cols * rows; // 32
    const targetSpans = Math.max(0, slots - count); // 6 for 26 items, 7 for 25 items

    const grid: boolean[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => false)
    );
    const placements: PortionPlacement[] = [];

    let spansDone = 0;
    let itemPtr = 0;

    for (let r = 0; r < rows; r++) {
      let c = 0;
      while (c < cols && itemPtr < count) {
        if (grid[r][c]) {
          c++;
          continue;
        }

        const item = portionItems[itemPtr];
        const ratio = ratiosMap[item.id]?.ratio || item.aspectRatio || 1.33;

        const remainingSlots = (rows - r) * cols - c;
        const remainingItems = count - itemPtr;

        // Can we span 2 columns horizontally (landscape item)?
        const canSpan =
          spansDone < targetSpans &&
          c <= 2 &&
          !grid[r][c + 1] &&
          ratio >= 1.3 &&
          remainingSlots - 2 >= remainingItems - 1;

        const colSpan = canSpan ? 2 : 1;
        if (colSpan === 2) {
          spansDone++;
          grid[r][c] = true;
          grid[r][c + 1] = true;
        } else {
          grid[r][c] = true;
        }

        // Varied organic sizes:
        // Spanned hero items scale prominently (1.15x).
        // Single cells alternate rhythmically (0.92x to 1.06x) to interlock tightly.
        const staggers = [-3, 2, -2, 3, 0, -1, 2];
        const staggerY = staggers[(r * cols + c) % staggers.length];
        const sizePattern = [1.04, 0.93, 1.0, 0.92, 1.06, 0.94, 0.98];
        const sizeFactor =
          colSpan === 2 ? 1.15 : sizePattern[itemPtr % sizePattern.length];

        placements.push({
          item,
          row: r + 1,
          col: c + 1,
          colSpan,
          staggerY,
          sizeFactor,
        });

        c += colSpan;
        itemPtr++;
      }
    }

    return { cols, rows, placements };
  }

  // Filtered mode with fewer items per portion (1 to 17 items)
  const cols = Math.max(1, Math.min(3, Math.ceil(Math.sqrt(count * 1.2))));
  const rows = Math.ceil(count / cols);
  const placements: PortionPlacement[] = [];

  for (let i = 0; i < count; i++) {
    const col = (i % cols) + 1;
    const row = Math.floor(i / cols) + 1;
    const staggerY = col % 2 === 0 ? 2 : -2;
    placements.push({
      item: portionItems[i],
      row,
      col,
      colSpan: 1,
      staggerY,
      sizeFactor: 1.0,
    });
  }

  return { cols, rows, placements };
}

/**
 * Computes deterministic 3-portion layout for the 5m x 3m wall:
 * - Portion 1 (Left 1/3)
 * - Portion 2 (Center 1/3)
 * - Portion 3 (Right 1/3)
 * Strictly zero items placed across portion boundaries.
 */
function getThreePortionsLayout(
  displayItems: ArchiveItem[],
  ratiosMap: Record<string, { w: number; h: number; ratio: number }>
): {
  portion1: PortionData;
  portion2: PortionData;
  portion3: PortionData;
} {
  const total = displayItems.length;

  if (total >= 60) {
    // 76 cases split into 26 + 25 + 25
    const p1Items = displayItems.slice(0, 26);
    const p2Items = displayItems.slice(26, 51);
    const p3Items = displayItems.slice(51, 76);

    return {
      portion1: packPortionItems(p1Items, ratiosMap),
      portion2: packPortionItems(p2Items, ratiosMap),
      portion3: packPortionItems(p3Items, ratiosMap),
    };
  }

  // Filtered state: distribute round-robin to keep 3 stations visually balanced
  const p1Items: ArchiveItem[] = [];
  const p2Items: ArchiveItem[] = [];
  const p3Items: ArchiveItem[] = [];

  displayItems.forEach((item, idx) => {
    if (idx % 3 === 0) p1Items.push(item);
    else if (idx % 3 === 1) p2Items.push(item);
    else p3Items.push(item);
  });

  return {
    portion1: packPortionItems(p1Items, ratiosMap),
    portion2: packPortionItems(p2Items, ratiosMap),
    portion3: packPortionItems(p3Items, ratiosMap),
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
  colSpan?: number;
  staggerY: number;
  sizeFactor: number;
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
  colSpan = 1,
  staggerY,
  sizeFactor,
  onSelect,
  onHover,
}: MacroTileProps) {
  const tileOpacity = isFilterOpen
    ? 1
    : isHovered
    ? 1
    : hasHoveredSibling
    ? 0.45
    : 1;

  // Retrieve natural pixel dimensions & aspect ratio:
  const dim = ARCHIVE_ASPECT_RATIOS[item.id] || {
    w: 100,
    h: 100,
    ratio: item.aspectRatio || 1.33,
  };

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
        gridRow: `${row} / span 1`,
        gridColumn: `${col} / span ${colSpan}`,
        transform: `translateY(${staggerY}px)`,
        opacity: tileOpacity,
      }}
      className={`pointer-events-auto w-full h-full flex items-center justify-center cursor-pointer relative group transition-opacity duration-150 ${
        isHovered ? "z-30" : "z-10"
      }`}
    >
      <motion.div
        layoutId={`item-media-${item.id}`}
        animate={{
          scale: isHovered ? 1.09 : 1,
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        style={{
          aspectRatio: `${dim.w} / ${dim.h}`,
          maxWidth: `${Math.min(100, Math.round(98 * sizeFactor))}%`,
          maxHeight: `${Math.min(100, Math.round(96 * sizeFactor))}%`,
        }}
        className={`w-auto h-auto rounded-none overflow-hidden bg-transparent transition-all duration-200 cursor-pointer flex items-center justify-center ${
          isHovered
            ? "border-2 border-black shadow-2xl shadow-black/35"
            : isActive
            ? "border-2 border-black shadow-md shadow-black/15"
            : "border border-black/35 hover:border-black"
        }`}
      >
        {/* 1. PHOTO - 100% natural shape, NO white borders, edge-to-edge coverage */}
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
            className="w-full h-full object-cover block pointer-events-none select-none filter-none"
          />
        )}

        {/* 2. AUDIO */}
        {item.type === "audio" && (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#EAEAE5]">
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

        {/* 3. TEXT / ESSAY */}
        {item.type === "text" && (
          <div className="w-full h-full p-2 flex flex-col justify-center items-center bg-[#E5E5DE] overflow-hidden text-center select-none">
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
  onGoToBeyond,
}: MacroGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [hoveredTileItem, setHoveredTileItem] = useState<ArchiveItem | null>(null);

  const displayItems = items;

  // 3-Portion Layout: strictly separates Left, Center, and Right bays with zero items bridging them
  const { portion1, portion2, portion3 } = useMemo(
    () => getThreePortionsLayout(displayItems, ARCHIVE_ASPECT_RATIOS),
    [displayItems]
  );

  // Max scale at 100% zoom
  const maxScale = 2.8;

  const targetZoomRef = useRef(zoomLevel);
  const currentZoomRef = useRef(zoomLevel);
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

  // RAF loop for smooth zoom and panning across the media wall
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

      const zoomProgress =
        curZoom >= 0.24 ? Math.min(1, (curZoom - 0.24) / (1 - 0.24)) : 0;

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
  }, [maxScale, onZoomChange, onGoToBeyond]);

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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-[#F8F8F6]"
    >
      {/* 1. SUBTLE EDGE DISSOLVES */}
      <div className="fixed top-0 left-0 right-0 h-6 edge-fade-top z-20 pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-6 edge-fade-bottom z-20 pointer-events-none" />
      <div className="fixed top-0 bottom-0 left-0 w-6 sm:w-10 edge-fade-left z-20 pointer-events-none" />
      <div className="fixed top-0 bottom-0 right-0 w-6 sm:w-10 edge-fade-right z-20 pointer-events-none" />

      {/* 2. FLOATING PREVIEW DOCK: ONLY APPEARS ON CURSER HOVER OVER A CASE STUDY */}
      <AnimatePresence>
        {hoveredTileItem && (
          <motion.div
            key={hoveredTileItem.id}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectItem(hoveredTileItem);
            }}
            className="fixed bottom-5 right-5 z-40 w-64 sm:w-72 bg-[#F8F8F6] border-2 border-black p-3 shadow-2xl shadow-black/25 cursor-pointer group pointer-events-auto"
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
              <div className="flex items-center justify-between font-display text-[10px] text-black/70 uppercase">
                <span>{hoveredTileItem.authorOrSubject}</span>
                <span>{hoveredTileItem.year}</span>
              </div>
              <div className="pt-1.5 border-t border-black/10 flex items-center justify-between text-[9.5px] font-display text-black uppercase tracking-wider">
                <span className="font-bold text-black/80">{hoveredTileItem.segno}</span>
                <span className="flex items-center gap-0.5 text-black font-bold group-hover:translate-x-0.5 transition-transform">
                  ESPLORA <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MAIN EXHIBITION MEDIA WALL: 3-PORTION COMPACT ARCHITECTURE (5m x 3m LEDWALL) */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center p-2 sm:p-3">
        {displayItems.length === 0 ? (
          <div className="pointer-events-auto flex flex-col items-center justify-center p-8 text-center border border-dashed border-black/30 bg-[#F8F8F6] w-full max-w-md my-auto shadow-md">
            <p className="font-display text-sm uppercase tracking-wider text-black font-bold mb-1.5">
              NESSUN SEGNO CORRISPONDENTE
            </p>
            <p className="font-body text-xs text-black/60 max-w-xs">
              Prova a reimpostare o combinare diversamente i filtri selezionati.
            </p>
          </div>
        ) : (
          <div
            ref={gridRef}
            style={{
              transformOrigin: "center center",
              willChange: "transform",
            }}
            className="w-full h-full grid grid-cols-3 gap-x-5 sm:gap-x-7 lg:gap-x-9 items-stretch justify-items-stretch"
          >
            {/* ======================================================== */}
            {/* PORTION 1: LEFT STATION (CASI 001 - 026)                */}
            {/* ======================================================== */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${portion1.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${portion1.rows}, minmax(0, 1fr))`,
                gap: "5px",
                width: "100%",
                height: "100%",
              }}
              className="items-center justify-items-center relative"
            >
              {portion1.placements.map((p) => {
                const isHovered = hoveredTileItem?.id === p.item.id;
                return (
                  <MacroTile
                    key={p.item.id}
                    item={p.item}
                    isActive={activeItemId === p.item.id}
                    isHovered={isHovered}
                    hasHoveredSibling={hoveredTileItem !== null && !isHovered}
                    isFilterOpen={isFilterOpen}
                    row={p.row}
                    col={p.col}
                    colSpan={p.colSpan}
                    staggerY={p.staggerY}
                    sizeFactor={p.sizeFactor}
                    onSelect={onSelectItem}
                    onHover={setHoveredTileItem}
                  />
                );
              })}
            </div>

            {/* ======================================================== */}
            {/* PORTION 2: CENTER STATION (CASI 027 - 051)              */}
            {/* ======================================================== */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${portion2.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${portion2.rows}, minmax(0, 1fr))`,
                gap: "5px",
                width: "100%",
                height: "100%",
              }}
              className="items-center justify-items-center relative"
            >
              {portion2.placements.map((p) => {
                const isHovered = hoveredTileItem?.id === p.item.id;
                return (
                  <MacroTile
                    key={p.item.id}
                    item={p.item}
                    isActive={activeItemId === p.item.id}
                    isHovered={isHovered}
                    hasHoveredSibling={hoveredTileItem !== null && !isHovered}
                    isFilterOpen={isFilterOpen}
                    row={p.row}
                    col={p.col}
                    colSpan={p.colSpan}
                    staggerY={p.staggerY}
                    sizeFactor={p.sizeFactor}
                    onSelect={onSelectItem}
                    onHover={setHoveredTileItem}
                  />
                );
              })}
            </div>

            {/* ======================================================== */}
            {/* PORTION 3: RIGHT STATION (CASI 052 - 076)               */}
            {/* ======================================================== */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${portion3.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${portion3.rows}, minmax(0, 1fr))`,
                gap: "5px",
                width: "100%",
                height: "100%",
              }}
              className="items-center justify-items-center relative"
            >
              {portion3.placements.map((p) => {
                const isHovered = hoveredTileItem?.id === p.item.id;
                return (
                  <MacroTile
                    key={p.item.id}
                    item={p.item}
                    isActive={activeItemId === p.item.id}
                    isHovered={isHovered}
                    hasHoveredSibling={hoveredTileItem !== null && !isHovered}
                    isFilterOpen={isFilterOpen}
                    row={p.row}
                    col={p.col}
                    colSpan={p.colSpan}
                    staggerY={p.staggerY}
                    sizeFactor={p.sizeFactor}
                    onSelect={onSelectItem}
                    onHover={setHoveredTileItem}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
