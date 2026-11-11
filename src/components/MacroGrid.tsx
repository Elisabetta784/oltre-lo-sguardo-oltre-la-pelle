"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowUp } from "lucide-react";
import { ArchiveItem, ARCHIVE_ASPECT_RATIOS } from "@/data/archiveData";
import { StationModal } from "./StationModal";

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
  rowTemplate: string;
  placements: PortionPlacement[];
}

/**
 * Builds an organic, homogeneous, and balanced distribution for a portion:
 * - Row 1 across all 3 portions features 2-column wide landscape items flush with the top, completely eliminating empty white bands at the top.
 * - Rows 2 to 7 evenly intersperse tall portraits and wide landscapes in an alternating checkerboard pattern (1 to 2 tall items per row), preventing any rigid horizontal striping.
 * - In Row 4, hero landscape items span 2 columns with dynamic diagonal balance (left in P2, right in P3).
 * - Calibrated row templates ensure each row snugly wraps its content without vertical gaps.
 * - Guaranteed: ALL 76 case studies are 100% visible on screen simultaneously.
 * - Strictly keeps all items inside this portion; zero items positioned across adjacent portions.
 */
function packHomogeneousPortion(
  portionItems: ArchiveItem[],
  ratiosMap: Record<string, { w: number; h: number; ratio: number }>,
  portionIndex: number
): PortionData {
  const count = portionItems.length;
  if (count === 0) {
    return { cols: 1, rows: 1, rowTemplate: "1fr", placements: [] };
  }

  // Full-archive mode: 4 columns x 7 rows
  if (count >= 18) {
    const cols = 4;
    const rows = 7;
    const rowTemplate = "1.22fr 1.02fr 0.96fr 1.10fr 0.96fr 0.96fr 0.96fr";

    // 1. Select 2 wide landscape items for Row 1
    const wideCandidates = portionItems.filter(
      (it) => (ratiosMap[it.id]?.ratio || it.aspectRatio || 1.33) >= 1.45
    );
    const row1 = wideCandidates.slice(0, 2);
    let rem = portionItems.filter((it) => !row1.includes(it));

    // 2. Select 1 wide item for Row 4 hero span in portions with 25 items (P2, P3)
    let midHero: ArchiveItem | null = null;
    if (count === 25) {
      const remWide = rem.filter(
        (it) => (ratiosMap[it.id]?.ratio || it.aspectRatio || 1.33) >= 1.45
      );
      midHero = remWide[0] || rem[0];
      rem = rem.filter((it) => it !== midHero);
    }

    // 3. Separate remaining items into tall (< 1.1) and wide (>= 1.1)
    const tall = rem.filter(
      (it) => (ratiosMap[it.id]?.ratio || it.aspectRatio || 1.33) < 1.1
    );
    const wide = rem.filter(
      (it) => (ratiosMap[it.id]?.ratio || it.aspectRatio || 1.33) >= 1.1
    );

    const placements: PortionPlacement[] = [];

    // ROW 1: Flush top hero landscapes spanning 2 columns each (no white gaps above)
    placements.push({
      item: row1[0],
      row: 1,
      col: 1,
      colSpan: 2,
      staggerY: 0,
      sizeFactor: 1.02,
    });
    placements.push({
      item: row1[1],
      row: 1,
      col: 3,
      colSpan: 2,
      staggerY: 0,
      sizeFactor: 1.02,
    });

    if (count === 26) {
      // Portion 1 (26 items): 8 tall, 16 wide
      // Interwoven checkerboard pattern across rows 2-7:
      // Row 2: [W, T, W, T] (2 tall, 2 wide)
      // Row 3: [W, W, T, W] (1 tall, 3 wide)
      // Row 4: [T, W, T, W] (2 tall, 2 wide)
      // Row 5: [W, T, W, W] (1 tall, 3 wide)
      // Row 6: [W, W, W, T] (1 tall, 3 wide)
      // Row 7: [T, W, W, W] (1 tall, 3 wide)
      let tallPtr = 0;
      let widePtr = 0;
      const rowPatterns = [
        [false, true, false, true],
        [false, false, true, false],
        [true, false, true, false],
        [false, true, false, false],
        [false, false, false, true],
        [true, false, false, false],
      ];

      rowPatterns.forEach((pat, rIdx) => {
        const rowNum = rIdx + 2;
        pat.forEach((isTall, colIdx) => {
          let it: ArchiveItem;
          if (isTall && tallPtr < tall.length) {
            it = tall[tallPtr++];
          } else {
            it = wide[widePtr++];
          }
          const ratio = ratiosMap[it.id]?.ratio || it.aspectRatio || 1.33;
          const staggerY = (rowNum + colIdx) % 2 === 1 ? 1 : -1;
          placements.push({
            item: it,
            row: rowNum,
            col: colIdx + 1,
            colSpan: 1,
            staggerY,
            sizeFactor: ratio < 1.1 ? 1.0 : 0.99,
          });
        });
      });
    } else if (portionIndex === 1) {
      // Portion 2 (25 items): 8 tall, 14 wide + 1 midHero
      // Row 4: midHero (cols 1-2) + [Tall, Wide] (cols 3-4)
      // Rows 2, 3, 5, 6, 7 evenly intersperse remaining 7 tall and 13 wide
      let tallPtr = 0;
      let widePtr = 0;
      const p2RowPatterns = [
        [true, false, true, false], // Row 2 (2 tall, 2 wide)
        [false, true, false, false], // Row 3 (1 tall, 3 wide)
        [false, true, false, true], // Row 5 (2 tall, 2 wide)
        [true, false, false, false], // Row 6 (1 tall, 3 wide)
        [false, false, true, false], // Row 7 (1 tall, 3 wide)
      ];

      p2RowPatterns.forEach((pat, rIdx) => {
        const rowNum = rIdx < 2 ? rIdx + 2 : rIdx + 3;
        pat.forEach((isTall, colIdx) => {
          let it: ArchiveItem;
          if (isTall && tallPtr < tall.length) {
            it = tall[tallPtr++];
          } else {
            it = wide[widePtr++];
          }
          const ratio = ratiosMap[it.id]?.ratio || it.aspectRatio || 1.33;
          const staggerY = (rowNum + colIdx) % 2 === 1 ? 1 : -1;
          placements.push({
            item: it,
            row: rowNum,
            col: colIdx + 1,
            colSpan: 1,
            staggerY,
            sizeFactor: ratio < 1.1 ? 1.0 : 0.99,
          });
        });
      });

      // Row 4 for Portion 2
      if (midHero) {
        placements.push({
          item: midHero,
          row: 4,
          col: 1,
          colSpan: 2,
          staggerY: 0,
          sizeFactor: 1.02,
        });
      }
      if (tallPtr < tall.length) {
        placements.push({
          item: tall[tallPtr++],
          row: 4,
          col: 3,
          colSpan: 1,
          staggerY: 1,
          sizeFactor: 1.0,
        });
      }
      if (widePtr < wide.length) {
        placements.push({
          item: wide[widePtr++],
          row: 4,
          col: 4,
          colSpan: 1,
          staggerY: -1,
          sizeFactor: 0.99,
        });
      }
    } else {
      // Portion 3 (25 items): 5 tall, 17 wide + 1 midHero
      // Row 4: [Tall, Wide] (cols 1-2) + midHero (cols 3-4) -> diagonal balance!
      // Rows 2, 3, 5, 6, 7 evenly intersperse remaining 4 tall and 16 wide
      let tallPtr = 0;
      let widePtr = 0;
      const p3RowPatterns = [
        [false, true, false, false], // Row 2 (1 tall, 3 wide)
        [true, false, false, false], // Row 3 (1 tall, 3 wide)
        [false, false, true, false], // Row 5 (1 tall, 3 wide)
        [false, false, false, true], // Row 6 (1 tall, 3 wide)
        [false, false, false, false], // Row 7 (0 tall, 4 wide)
      ];

      p3RowPatterns.forEach((pat, rIdx) => {
        const rowNum = rIdx < 2 ? rIdx + 2 : rIdx + 3;
        pat.forEach((isTall, colIdx) => {
          let it: ArchiveItem;
          if (isTall && tallPtr < tall.length) {
            it = tall[tallPtr++];
          } else {
            it = wide[widePtr++];
          }
          const ratio = ratiosMap[it.id]?.ratio || it.aspectRatio || 1.33;
          const staggerY = (rowNum + colIdx) % 2 === 1 ? 1 : -1;
          placements.push({
            item: it,
            row: rowNum,
            col: colIdx + 1,
            colSpan: 1,
            staggerY,
            sizeFactor: ratio < 1.1 ? 1.0 : 0.99,
          });
        });
      });

      // Row 4 for Portion 3
      if (tallPtr < tall.length) {
        placements.push({
          item: tall[tallPtr++],
          row: 4,
          col: 1,
          colSpan: 1,
          staggerY: 1,
          sizeFactor: 1.0,
        });
      }
      if (widePtr < wide.length) {
        placements.push({
          item: wide[widePtr++],
          row: 4,
          col: 2,
          colSpan: 1,
          staggerY: -1,
          sizeFactor: 0.99,
        });
      }
      if (midHero) {
        placements.push({
          item: midHero,
          row: 4,
          col: 3,
          colSpan: 2,
          staggerY: 0,
          sizeFactor: 1.02,
        });
      }
    }

    return { cols, rows, rowTemplate, placements };
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

  return {
    cols,
    rows,
    rowTemplate: `repeat(${rows}, minmax(0, 1fr))`,
    placements,
  };
}

/**
 * Computes deterministic 3-portion layout for the 5m x 3m wall:
 * - Portion 1 (Left 1/3): 26 items
 * - Portion 2 (Center 1/3): 25 items
 * - Portion 3 (Right 1/3): 25 items
 * Strictly zero items placed across portion boundaries.
 * Spaced with subtle organic gutters so the wall appears unified and continuous ("non palese").
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
    // Exact 76 cases split into 26 + 25 + 25
    const p1Items = displayItems.slice(0, 26);
    const p2Items = displayItems.slice(26, 51);
    const p3Items = displayItems.slice(51, 76);

    return {
      portion1: packHomogeneousPortion(p1Items, ratiosMap, 0),
      portion2: packHomogeneousPortion(p2Items, ratiosMap, 1),
      portion3: packHomogeneousPortion(p3Items, ratiosMap, 2),
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
    portion1: packHomogeneousPortion(p1Items, ratiosMap, 0),
    portion2: packHomogeneousPortion(p2Items, ratiosMap, 1),
    portion3: packHomogeneousPortion(p3Items, ratiosMap, 2),
  };
}

interface MacroTileProps {
  item: ArchiveItem;
  isActive: boolean;
  isHovered: boolean;
  isFilterOpen: boolean;
  row: number;
  col: number;
  colSpan?: number;
  staggerY: number;
  sizeFactor: number;
  isClone?: boolean;
  onSelect: (item: ArchiveItem) => void;
  onHover: (item: ArchiveItem | null) => void;
}

const MacroTile = React.memo(function MacroTile({
  item,
  isActive,
  isHovered,
  isFilterOpen,
  row,
  col,
  colSpan = 1,
  staggerY,
  sizeFactor,
  isClone = false,
  onSelect,
  onHover,
}: MacroTileProps) {
  // Retrieve natural pixel dimensions & aspect ratio:
  const dim = ARCHIVE_ASPECT_RATIOS[item.id] || {
    w: 100,
    h: 100,
    ratio: item.aspectRatio || 1.33,
  };

  // Track pointer down coordinate to distinguish drag from tap
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);

  return (
    <div
      onPointerDown={(e) => {
        pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (pointerDownPosRef.current) {
          const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
          const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);
          if (dx > 6 || dy > 6) {
            // Drag gesture occurred: ignore click
            return;
          }
        }
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
        opacity: 1,
      }}
      className={`pointer-events-auto w-full h-full min-h-0 min-w-0 flex items-center justify-center cursor-pointer relative group ${
        isHovered ? "z-30" : "z-10"
      }`}
    >
      <motion.div
        layoutId={isClone ? undefined : `item-media-${item.id}`}
        animate={{
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        style={{
          aspectRatio: `${dim.w} / ${dim.h}`,
          maxWidth: `${Math.min(100, Math.round(99 * sizeFactor))}%`,
          maxHeight: `${Math.min(100, Math.round(98 * sizeFactor))}%`,
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

interface StationColumnProps {
  portion: PortionData;
  portionIndex: 1 | 2 | 3;
  activeItemId: string;
  isFilterOpen: boolean;
  hasAnyModalOpen: boolean;
  stationModal: ArchiveItem | null;
  hoveredTileItem: ArchiveItem | null;
  onSelectItem: (item: ArchiveItem) => void;
  onCloseModal: () => void;
  onHoverTile: (item: ArchiveItem | null) => void;
}

function StationColumn({
  portion,
  portionIndex,
  activeItemId,
  isFilterOpen,
  hasAnyModalOpen,
  stationModal,
  hoveredTileItem,
  onSelectItem,
  onCloseModal,
  onHoverTile,
}: StationColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef(0);
  const [height, setHeight] = useState(0);
  const [isMoved, setIsMoved] = useState(false);

  const offsetYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const hasMovedRef = useRef(false);

  // Measure container height with ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const h = el.clientHeight;
      if (h > 0) {
        heightRef.current = h;
        setHeight(h);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const applyTransform = useCallback(() => {
    if (!trackRef.current || heightRef.current <= 0) return;
    const H = heightRef.current;
    const cycleHeight = H + 5; // 5px row gap between repeating copies
    const normY = ((offsetYRef.current % cycleHeight) + cycleHeight) % cycleHeight;
    const trackY = -cycleHeight + normY;

    trackRef.current.style.transform = `translate3d(0px, ${trackY.toFixed(2)}px, 0px)`;

    const distFromOrigin = Math.min(normY, cycleHeight - normY);
    setIsMoved(distFromOrigin > 25);
  }, []);

  // Update transform whenever height changes
  useEffect(() => {
    if (height > 0) {
      applyTransform();
    }
  }, [height, applyTransform]);

  // Pointer drag gestures (Touch screen on LED wall & mouse drag)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (hasAnyModalOpen) return;
    if (e.button !== 0) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startYRef.current = e.clientY;
    lastYRef.current = e.clientY;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const currentY = e.clientY;
    const delta = currentY - lastYRef.current;

    if (Math.abs(currentY - startYRef.current) > 6) {
      hasMovedRef.current = true;
    }

    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    velocityRef.current = delta / dt;

    lastYRef.current = currentY;
    lastTimeRef.current = now;

    offsetYRef.current += delta;
    applyTransform();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Natural momentum glide with inertia
    let v = velocityRef.current * 16;
    v = Math.max(-45, Math.min(45, v));

    if (Math.abs(v) > 0.5) {
      const friction = 0.94;
      const glide = () => {
        if (Math.abs(v) < 0.15) {
          rafIdRef.current = null;
          return;
        }
        offsetYRef.current += v;
        v *= friction;
        applyTransform();
        rafIdRef.current = requestAnimationFrame(glide);
      };
      rafIdRef.current = requestAnimationFrame(glide);
    }
  };

  // Mouse wheel / trackpad scroll on this station
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (hasAnyModalOpen) return;
      if (e.ctrlKey) return; // allow pinch-zoom to pass to global handler

      e.preventDefault();
      e.stopPropagation();

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      // Natural wheel scroll
      offsetYRef.current -= e.deltaY;
      applyTransform();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [hasAnyModalOpen, applyTransform]);

  // Clean-up animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Reset alignment smoothly to nearest aligned cycle
  const resetToOrigin = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    const startOffset = offsetYRef.current;
    const H = heightRef.current;
    if (H <= 0) return;
    const cycleHeight = H + 5;

    const targetOffset = Math.round(startOffset / cycleHeight) * cycleHeight;
    const diff = targetOffset - startOffset;
    const duration = 380;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      offsetYRef.current = startOffset + diff * ease;
      applyTransform();

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(step);
      } else {
        rafIdRef.current = null;
        setIsMoved(false);
      }
    };
    rafIdRef.current = requestAnimationFrame(step);
  };

  const handleSelectTile = (item: ArchiveItem) => {
    if (hasMovedRef.current) {
      return;
    }
    onSelectItem(item);
  };

  const renderTilesCopy = (copyIdx: 0 | 1 | 2) => {
    const isClone = copyIdx !== 1;
    return portion.placements.map((p) => {
      const isHovered = !hasAnyModalOpen && hoveredTileItem?.id === p.item.id;
      return (
        <MacroTile
          key={`c${copyIdx}-${p.item.id}-${p.row}-${p.col}`}
          item={p.item}
          isActive={activeItemId === p.item.id}
          isHovered={isHovered}
          isFilterOpen={isFilterOpen}
          row={p.row}
          col={p.col}
          colSpan={p.colSpan}
          staggerY={p.staggerY}
          sizeFactor={p.sizeFactor}
          isClone={isClone}
          onSelect={handleSelectTile}
          onHover={(item) => {
            if (!hasAnyModalOpen && !isDraggingRef.current) {
              onHoverTile(item);
            }
          }}
        />
      );
    });
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative min-h-0 min-w-0 overflow-hidden w-full h-full flex flex-col cursor-grab active:cursor-grabbing touch-none select-none"
    >
      {/* Subtle top grab handle for pull affordance */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center justify-center opacity-30">
        <div className="w-8 h-1 bg-black/40 rounded-full" />
      </div>

      {/* Reset button when scrolled away from default alignment */}
      <AnimatePresence>
        {isMoved && !hasAnyModalOpen && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetToOrigin();
            }}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-black text-[#F8F8F6] px-2.5 py-1 font-display text-[9px] font-bold uppercase tracking-wider shadow-lg border border-black cursor-pointer flex items-center gap-1 hover:bg-black/80 transition-colors pointer-events-auto"
          >
            <ArrowUp className="w-2.5 h-2.5" />
            <span>RIPRISTINA IN ALTO</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Moving track with 3 seamlessly repeating copies for infinite continuous loop */}
      <div
        ref={trackRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          willChange: "transform",
          transform: height > 0 ? undefined : "translateY(-33.333333%)",
        }}
      >
        {/* Copy 0: clone above */}
        <div
          style={{
            width: "100%",
            height: height > 0 ? `${height}px` : "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${portion.cols}, minmax(0, 1fr))`,
            gridTemplateRows: portion.rowTemplate,
            gap: "5px",
            flexShrink: 0,
          }}
          className="items-center justify-items-center relative min-h-0 min-w-0"
        >
          {renderTilesCopy(0)}
        </div>

        {/* Copy 1: original center */}
        <div
          style={{
            width: "100%",
            height: height > 0 ? `${height}px` : "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${portion.cols}, minmax(0, 1fr))`,
            gridTemplateRows: portion.rowTemplate,
            gap: "5px",
            flexShrink: 0,
          }}
          className="items-center justify-items-center relative min-h-0 min-w-0"
        >
          {renderTilesCopy(1)}
        </div>

        {/* Copy 2: clone below */}
        <div
          style={{
            width: "100%",
            height: height > 0 ? `${height}px` : "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${portion.cols}, minmax(0, 1fr))`,
            gridTemplateRows: portion.rowTemplate,
            gap: "5px",
            flexShrink: 0,
          }}
          className="items-center justify-items-center relative min-h-0 min-w-0"
        >
          {renderTilesCopy(2)}
        </div>
      </div>

      {/* Station Modal: strictly bounded inside this Station, scaled down with generous breathing room */}
      <AnimatePresence>
        {stationModal && (
          <StationModal
            key={stationModal.id}
            item={stationModal}
            portionIndex={portionIndex}
            onClose={onCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

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

  // Independent modal state for each of the 3 stations (LED wall portions)
  const [stationModals, setStationModals] = useState<{ [portion: number]: ArchiveItem | null }>({
    1: null,
    2: null,
    3: null,
  });
  const hasAnyModalOpen = Boolean(stationModals[1] || stationModals[2] || stationModals[3]);

  // Global ESC key listener to dismiss any active station modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStationModals({ 1: null, 2: null, 3: null });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      if (isLocked || hasAnyModalOpen) return;

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
  }, [onGoToBeyond, hasAnyModalOpen]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-[#F8F8F6]"
    >
      {/* 1. SUBTLE EDGE DISSOLVES */}
      <div className="fixed top-0 left-0 right-0 h-4 edge-fade-top z-20 pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-4 edge-fade-bottom z-20 pointer-events-none" />
      <div className="fixed top-0 bottom-0 left-0 w-4 sm:w-6 edge-fade-left z-20 pointer-events-none" />
      <div className="fixed top-0 bottom-0 right-0 w-4 sm:w-6 edge-fade-right z-20 pointer-events-none" />



      {/* 3. MAIN EXHIBITION MEDIA WALL: ALL 76 CASES VISIBLE ACROSS 3 SEAMLESS PORTIONS */}
      <div className="relative w-full h-full max-h-screen overflow-hidden flex items-center justify-center p-1.5 sm:p-2">
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
            className="w-full h-full max-h-full grid grid-cols-3 gap-x-2 sm:gap-x-2.5 lg:gap-x-3 items-stretch justify-items-stretch"
          >
            {/* PORTION 1: LEFT STATION (CASI 001 - 026) */}
            <StationColumn
              portion={portion1}
              portionIndex={1}
              activeItemId={activeItemId}
              isFilterOpen={isFilterOpen}
              hasAnyModalOpen={hasAnyModalOpen}
              stationModal={stationModals[1]}
              hoveredTileItem={hoveredTileItem}
              onSelectItem={(item) => {
                setStationModals((prev) => ({ ...prev, 1: item }));
                setHoveredTileItem(null);
                onSelectItem(item);
              }}
              onCloseModal={() => setStationModals((prev) => ({ ...prev, 1: null }))}
              onHoverTile={setHoveredTileItem}
            />

            {/* PORTION 2: CENTER STATION (CASI 027 - 051) */}
            <StationColumn
              portion={portion2}
              portionIndex={2}
              activeItemId={activeItemId}
              isFilterOpen={isFilterOpen}
              hasAnyModalOpen={hasAnyModalOpen}
              stationModal={stationModals[2]}
              hoveredTileItem={hoveredTileItem}
              onSelectItem={(item) => {
                setStationModals((prev) => ({ ...prev, 2: item }));
                setHoveredTileItem(null);
                onSelectItem(item);
              }}
              onCloseModal={() => setStationModals((prev) => ({ ...prev, 2: null }))}
              onHoverTile={setHoveredTileItem}
            />

            {/* PORTION 3: RIGHT STATION (CASI 052 - 076) */}
            <StationColumn
              portion={portion3}
              portionIndex={3}
              activeItemId={activeItemId}
              isFilterOpen={isFilterOpen}
              hasAnyModalOpen={hasAnyModalOpen}
              stationModal={stationModals[3]}
              hoveredTileItem={hoveredTileItem}
              onSelectItem={(item) => {
                setStationModals((prev) => ({ ...prev, 3: item }));
                setHoveredTileItem(null);
                onSelectItem(item);
              }}
              onCloseModal={() => setStationModals((prev) => ({ ...prev, 3: null }))}
              onHoverTile={setHoveredTileItem}
            />
          </div>
        )}
      </div>
    </div>
  );
}
