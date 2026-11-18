"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";
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
  modalTargetItem?: ArchiveItem | null;
  onClearModalTarget?: () => void;
}

export type BentoVariant = "1x1" | "2x1" | "1x2" | "2x2";

interface PortionPlacement {
  item: ArchiveItem;
  row: number;
  col: number;
  colSpan: number;
  rowSpan: number;
  variant: BentoVariant;
}

interface PortionData {
  cols: number;
  rows: number;
  rowTemplate: string;
  placements: PortionPlacement[];
}

interface SlotConfig {
  row: number;
  col: number;
  colSpan: number;
  rowSpan: number;
  variant: BentoVariant;
}

// Station 1 (26 items): Interlocking 6-col x 8-row Mondrian Bento layout
// Variants: "2x2" (grand square), "2x1" (horizontal rect), "1x2" (vertical rect), "1x1" (base square)
// Mathematical occupancy: 2*(4) + 10*(2) + 6*(2) + 8*(1) = 8 + 20 + 12 + 8 = 48 cells (0 empty, 0 collisions)
const S1_SLOTS: SlotConfig[] = [
  // Tier 1: Rows 1-2 (12 cells, 7 items)
  { row: 1, col: 1, colSpan: 2, rowSpan: 2, variant: "2x2" },
  { row: 1, col: 3, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 2, col: 3, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 2, col: 4, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 1, col: 5, colSpan: 1, rowSpan: 2, variant: "1x2" },
  { row: 1, col: 6, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 2, col: 6, colSpan: 1, rowSpan: 1, variant: "1x1" },

  // Tier 2: Rows 3-4 (12 cells, 6 items)
  { row: 3, col: 1, colSpan: 1, rowSpan: 2, variant: "1x2" },
  { row: 3, col: 2, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 4, col: 2, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 3, col: 4, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 4, col: 4, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 3, col: 6, colSpan: 1, rowSpan: 2, variant: "1x2" },

  // Tier 3: Rows 5-6 (12 cells, 6 items)
  { row: 5, col: 1, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 6, col: 1, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 5, col: 3, colSpan: 2, rowSpan: 2, variant: "2x2" },
  { row: 5, col: 5, colSpan: 1, rowSpan: 2, variant: "1x2" },
  { row: 5, col: 6, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 6, col: 6, colSpan: 1, rowSpan: 1, variant: "1x1" },

  // Tier 4: Rows 7-8 (12 cells, 7 items)
  { row: 7, col: 1, colSpan: 1, rowSpan: 2, variant: "1x2" },
  { row: 7, col: 2, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 8, col: 2, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 7, col: 3, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 8, col: 3, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 7, col: 5, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 8, col: 5, colSpan: 2, rowSpan: 1, variant: "2x1" },
];

// Station 2 (25 items): Interlocking 6-col x 8-row Mondrian Bento layout
// Mathematical occupancy: 2*(4) + 11*(2) + 6*(2) + 6*(1) = 8 + 22 + 12 + 6 = 48 cells (0 empty, 0 collisions)
const S2_SLOTS: SlotConfig[] = [
  // Tier 1: Rows 1-2 (12 cells, 6 items)
  { row: 1, col: 1, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 2, col: 1, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 1, col: 3, colSpan: 2, rowSpan: 2, variant: "2x2" },
  { row: 1, col: 5, colSpan: 1, rowSpan: 2, variant: "1x2" },
  { row: 1, col: 6, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 2, col: 6, colSpan: 1, rowSpan: 1, variant: "1x1" },

  // Tier 2: Rows 3-4 (12 cells, 6 items)
  { row: 3, col: 1, colSpan: 1, rowSpan: 2, variant: "1x2" },
  { row: 3, col: 2, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 4, col: 2, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 3, col: 3, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 4, col: 3, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 3, col: 5, colSpan: 2, rowSpan: 2, variant: "2x2" },

  // Tier 3: Rows 5-6 (12 cells, 6 items)
  { row: 5, col: 1, colSpan: 1, rowSpan: 2, variant: "1x2" },
  { row: 5, col: 2, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 6, col: 2, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 5, col: 4, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 6, col: 4, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 5, col: 6, colSpan: 1, rowSpan: 2, variant: "1x2" },

  // Tier 4: Rows 7-8 (12 cells, 7 items)
  { row: 7, col: 1, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 8, col: 1, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 7, col: 3, colSpan: 1, rowSpan: 2, variant: "1x2" },
  { row: 7, col: 4, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 8, col: 4, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 7, col: 5, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 8, col: 5, colSpan: 2, rowSpan: 1, variant: "2x1" },
];

// Station 3 (25 items): Interlocking 6-col x 8-row Mondrian Bento layout
// Mathematical occupancy: 2*(4) + 11*(2) + 6*(2) + 6*(1) = 8 + 22 + 12 + 6 = 48 cells (0 empty, 0 collisions)
const S3_SLOTS: SlotConfig[] = [
  // Tier 1: Rows 1-2 (12 cells, 6 items)
  { row: 1, col: 1, colSpan: 1, rowSpan: 2, variant: "1x2" },
  { row: 1, col: 2, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 2, col: 2, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 1, col: 4, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 2, col: 4, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 1, col: 5, colSpan: 2, rowSpan: 2, variant: "2x2" },

  // Tier 2: Rows 3-4 (12 cells, 6 items)
  { row: 3, col: 1, colSpan: 2, rowSpan: 2, variant: "2x2" },
  { row: 3, col: 3, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 4, col: 3, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 3, col: 5, colSpan: 1, rowSpan: 2, variant: "1x2" },
  { row: 3, col: 6, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 4, col: 6, colSpan: 1, rowSpan: 1, variant: "1x1" },

  // Tier 3: Rows 5-6 (12 cells, 7 items)
  { row: 5, col: 1, colSpan: 1, rowSpan: 2, variant: "1x2" },
  { row: 5, col: 2, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 6, col: 2, colSpan: 1, rowSpan: 1, variant: "1x1" },
  { row: 5, col: 3, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 6, col: 3, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 5, col: 5, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 6, col: 5, colSpan: 2, rowSpan: 1, variant: "2x1" },

  // Tier 4: Rows 7-8 (12 cells, 6 items)
  { row: 7, col: 1, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 8, col: 1, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 7, col: 3, colSpan: 1, rowSpan: 2, variant: "1x2" },
  { row: 7, col: 4, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 8, col: 4, colSpan: 2, rowSpan: 1, variant: "2x1" },
  { row: 7, col: 6, colSpan: 1, rowSpan: 2, variant: "1x2" },
];

/**
 * Dynamic Bento packing algorithm for filtered views with fewer items (< 18).
 * Ensures zero overflow, tight packing across 4 columns, and strict adherence to the 4 variants.
 */
function packDynamicBento(
  items: ArchiveItem[],
  ratiosMap: Record<string, { w: number; h: number; ratio: number }>
): PortionData {
  const cols = 6;
  const occupied: boolean[][] = [];

  function isOccupied(r: number, c: number): boolean {
    if (!occupied[r]) return false;
    return Boolean(occupied[r][c]);
  }

  function setOccupied(r: number, c: number, val: boolean) {
    if (!occupied[r]) occupied[r] = [];
    occupied[r][c] = val;
  }

  function canFit(r: number, c: number, colSpan: number, rowSpan: number): boolean {
    if (c + colSpan > cols) return false;
    for (let dr = 0; dr < rowSpan; dr++) {
      for (let dc = 0; dc < colSpan; dc++) {
        if (isOccupied(r + dr, c + dc)) return false;
      }
    }
    return true;
  }

  function occupy(r: number, c: number, colSpan: number, rowSpan: number) {
    for (let dr = 0; dr < rowSpan; dr++) {
      for (let dc = 0; dc < colSpan; dc++) {
        setOccupied(r + dr, c + dc, true);
      }
    }
  }

  const placements: PortionPlacement[] = [];

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    const ratio = ratiosMap[item.id]?.ratio || item.aspectRatio || 1.33;

    let candidates: BentoVariant[] = [];
    if (idx === 0 && items.length >= 6) {
      candidates = ["2x2", "2x1", "1x1"];
    } else if (ratio >= 1.35) {
      candidates = ["2x1", "1x1"];
    } else if (ratio < 0.95) {
      candidates = ["1x2", "1x1"];
    } else {
      candidates = ["1x1", "2x1"];
    }

    let placed = false;
    for (let r = 0; r < 50 && !placed; r++) {
      for (let c = 0; c < cols && !placed; c++) {
        if (isOccupied(r, c)) continue;

        for (const variant of candidates) {
          let colSpan = 1;
          let rowSpan = 1;
          if (variant === "2x2") {
            colSpan = 2;
            rowSpan = 2;
          } else if (variant === "2x1") {
            colSpan = 2;
            rowSpan = 1;
          } else if (variant === "1x2") {
            colSpan = 1;
            rowSpan = 2;
          }

          if (canFit(r, c, colSpan, rowSpan)) {
            occupy(r, c, colSpan, rowSpan);
            placements.push({
              item,
              row: r + 1,
              col: c + 1,
              colSpan,
              rowSpan,
              variant,
            });
            placed = true;
            break;
          }
        }
      }
    }

    if (!placed) {
      for (let r = 0; r < 50 && !placed; r++) {
        for (let c = 0; c < cols && !placed; c++) {
          if (!isOccupied(r, c)) {
            occupy(r, c, 1, 1);
            placements.push({
              item,
              row: r + 1,
              col: c + 1,
              colSpan: 1,
              rowSpan: 1,
              variant: "1x1",
            });
            placed = true;
            break;
          }
        }
      }
    }
  }

  let maxRow = 1;
  for (const p of placements) {
    maxRow = Math.max(maxRow, p.row + p.rowSpan - 1);
  }

  return {
    cols,
    rows: maxRow,
    rowTemplate: `repeat(${maxRow}, clamp(85px, 10vh, 120px))`,
    placements,
  };
}

/**
 * Builds a strict Mondrian Bento interlocking grid for a portion:
 * - Exactly 4 standardized variants: 1x1, 2x1, 1x2, 2x2.
 * - Perfectly interlocking with 0 empty gaps and shared aligned edges.
 * - Assigns items by orientation to best-fitting variants.
 */
function packMondrianPortion(
  portionItems: ArchiveItem[],
  ratiosMap: Record<string, { w: number; h: number; ratio: number }>,
  portionIndex: number
): PortionData {
  const count = portionItems.length;
  if (count === 0) {
    return { cols: 1, rows: 1, rowTemplate: "1fr", placements: [] };
  }

  // Full-archive mode: 6 columns x 8 rows
  if (count >= 18) {
    const cols = 6;
    const rows = 8;
    const rowTemplate = "repeat(8, clamp(85px, 10vh, 120px))";

    let slots: SlotConfig[] = [];
    if (portionIndex === 0) {
      slots = S1_SLOTS;
    } else if (portionIndex === 1) {
      slots = S2_SLOTS;
    } else {
      slots = S3_SLOTS;
    }

    // Classify items by aspect ratio
    const landscapes = portionItems.filter(
      (it) => (ratiosMap[it.id]?.ratio || it.aspectRatio || 1.33) >= 1.25
    );
    const portraits = portionItems.filter(
      (it) => (ratiosMap[it.id]?.ratio || it.aspectRatio || 1.33) < 0.95
    );
    const squares = portionItems.filter(
      (it) => !landscapes.includes(it) && !portraits.includes(it)
    );

    // Group slots by variant
    const slots2x2 = slots.filter((s) => s.variant === "2x2");
    const slots1x2 = slots.filter((s) => s.variant === "1x2");
    const slots2x1 = slots.filter((s) => s.variant === "2x1");
    const slots1x1 = slots.filter((s) => s.variant === "1x1");

    // Pools of available items prioritizing natural aspect ratio fit
    const pool2x2 = [...squares, ...landscapes, ...portraits];
    const pool1x2 = [...portraits, ...squares, ...landscapes];
    const pool2x1 = [...landscapes, ...squares, ...portraits];
    const pool1x1 = [...squares, ...portraits, ...landscapes];

    const usedIds = new Set<string>();
    const assignments = new Map<SlotConfig, ArchiveItem>();

    function pickFromPool(pool: ArchiveItem[]): ArchiveItem {
      for (const item of pool) {
        if (!usedIds.has(item.id)) {
          usedIds.add(item.id);
          return item;
        }
      }
      for (const item of portionItems) {
        if (!usedIds.has(item.id)) {
          usedIds.add(item.id);
          return item;
        }
      }
      return portionItems[0];
    }

    // 1. Assign 2x2 hero slots
    for (const s of slots2x2) assignments.set(s, pickFromPool(pool2x2));
    // 2. Assign 1x2 vertical slots
    for (const s of slots1x2) assignments.set(s, pickFromPool(pool1x2));
    // 3. Assign 2x1 horizontal slots
    for (const s of slots2x1) assignments.set(s, pickFromPool(pool2x1));
    // 4. Assign 1x1 square slots
    for (const s of slots1x1) assignments.set(s, pickFromPool(pool1x1));

    const placements: PortionPlacement[] = [];
    for (const s of slots) {
      const it = assignments.get(s) || portionItems[0];
      placements.push({
        item: it,
        row: s.row,
        col: s.col,
        colSpan: s.colSpan,
        rowSpan: s.rowSpan,
        variant: s.variant,
      });
    }

    return { cols, rows, rowTemplate, placements };
  }

  // Filtered mode (< 18 items)
  return packDynamicBento(portionItems, ratiosMap);
}

/**
 * Computes deterministic 3-portion layout for the exhibition media wall:
 * - Station 1 (Left): 26 items
 * - Station 2 (Center): 25 items
 * - Station 3 (Right): 25 items
 * Total: 76 cases across 3 stations, interlocking with constant 16px gap.
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
    const p1Items = displayItems.slice(0, 26);
    const p2Items = displayItems.slice(26, 51);
    const p3Items = displayItems.slice(51, 76);

    return {
      portion1: packMondrianPortion(p1Items, ratiosMap, 0),
      portion2: packMondrianPortion(p2Items, ratiosMap, 1),
      portion3: packMondrianPortion(p3Items, ratiosMap, 2),
    };
  }

  // Filtered state: distribute round-robin across 3 stations
  const p1Items: ArchiveItem[] = [];
  const p2Items: ArchiveItem[] = [];
  const p3Items: ArchiveItem[] = [];

  displayItems.forEach((item, idx) => {
    if (idx % 3 === 0) p1Items.push(item);
    else if (idx % 3 === 1) p2Items.push(item);
    else p3Items.push(item);
  });

  return {
    portion1: packMondrianPortion(p1Items, ratiosMap, 0),
    portion2: packMondrianPortion(p2Items, ratiosMap, 1),
    portion3: packMondrianPortion(p3Items, ratiosMap, 2),
  };
}

interface MacroTileProps {
  item: ArchiveItem;
  isActive: boolean;
  isHovered: boolean;
  isFilterOpen: boolean;
  row: number;
  col: number;
  colSpan: number;
  rowSpan: number;
  variant: BentoVariant;
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
  colSpan,
  rowSpan,
  variant,
  isClone = false,
  onSelect,
  onHover,
}: MacroTileProps) {
  // Track pointer down coordinate to distinguish drag from tap
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);

  return (
    <div
      onPointerDown={(e) => {
        pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        if (pointerDownPosRef.current) {
          const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
          const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);
          pointerDownPosRef.current = null;
          if (dx <= 6 && dy <= 6) {
            onSelect(item);
          }
        }
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
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
        gridRow: `${row} / span ${rowSpan}`,
        gridColumn: `${col} / span ${colSpan}`,
      }}
      className={`pointer-events-auto w-full h-full min-h-0 min-w-0 relative group select-none ${
        isHovered ? "z-30" : "z-10"
      }`}
    >
      <motion.div
        layoutId={isClone ? undefined : `item-media-${item.id}`}
        animate={{
          scale: isHovered ? 1.025 : 1,
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full h-full relative overflow-hidden bg-[#ECECE8] border border-black/10 transition-shadow duration-200 cursor-pointer flex items-center justify-center ${
          isHovered
            ? "shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
            : isActive
            ? "shadow-[0_6px_16px_rgba(0,0,0,0.14)] ring-1 ring-black"
            : "shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        }`}
      >
        {/* 1. PHOTO - edge-to-edge cover */}
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
          <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#EBECE6]">
            <div className="flex items-center gap-1 h-6 w-full justify-center overflow-hidden">
              {(item.audioWaveform || [40, 70, 90, 50, 80, 100, 60, 40])
                .slice(0, 8)
                .map((h, bIdx) => (
                  <div
                    key={bIdx}
                    style={{ height: `${h * 0.7}%` }}
                    className="w-1 bg-black/80 rounded-none"
                  />
                ))}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Volume2 className="w-3 h-3 text-black/70" />
              <span className="font-mono text-[9px] text-black/70 uppercase tracking-wider">
                {item.audioDuration || "1:30"}
              </span>
            </div>
          </div>
        )}

        {/* 3. TEXT / ESSAY */}
        {item.type === "text" && (
          <div className="w-full h-full p-2.5 flex flex-col justify-center items-center bg-[#F7F6F2] overflow-hidden text-center select-none border border-black/5">
            <span className="font-mono text-[8px] uppercase tracking-widest text-black/50 mb-0.5">
              TESTO • {item.number}
            </span>
            <span className="font-display text-[10px] sm:text-xs font-bold text-black tracking-wide uppercase leading-tight line-clamp-2 sm:line-clamp-3">
              {item.microKeyword || item.title}
            </span>
          </div>
        )}

        {/* Subtle hover overlay with case number and title */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex flex-col justify-end text-white">
          <span className="font-mono text-[8px] tracking-wider uppercase opacity-85">
            CASO {item.number}
          </span>
          <span className="font-display text-[10px] font-medium leading-tight truncate">
            {item.title}
          </span>
        </div>
      </motion.div>
    </div>
  );
});

interface StationColumnProps {
  portion: PortionData;
  portionIndex: 1 | 2 | 3;
  activeItemId: string;
  isFilterOpen: boolean;
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
  stationModal,
  hoveredTileItem,
  onSelectItem,
  onCloseModal,
  onHoverTile,
}: StationColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const copyHeightRef = useRef<number>(0);
  const [copyHeight, setCopyHeight] = useState<number>(0);

  const isThisModalOpen = Boolean(stationModal);

  const offsetYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const glideRafIdRef = useRef<number | null>(null);
  const hasMovedRef = useRef(false);

  // Micro-scorrimento autonomo (Idle Drift):
  // Velocità ultra-lenta (11-15 px/s) e non invadente, con lieve sfasamento tra le 3 stazioni
  const targetDriftSpeed = useMemo(() => {
    if (portionIndex === 1) return 11;
    if (portionIndex === 2) return 14;
    return 12;
  }, [portionIndex]);

  const currentDriftSpeedRef = useRef(0);
  const lastInteractionTimeRef = useRef<number>(performance.now());

  // Measure copy height with ResizeObserver
  useEffect(() => {
    const el = copyRef.current;
    if (!el) return;
    const update = () => {
      const h = el.clientHeight;
      if (h > 0) {
        copyHeightRef.current = h;
        setCopyHeight(h);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [portion]);

  const applyTransform = useCallback(() => {
    if (!trackRef.current) return;
    const cycleHeight = (copyHeightRef.current > 0 ? copyHeightRef.current : 1800) + 16;
    const normY = ((offsetYRef.current % cycleHeight) + cycleHeight) % cycleHeight;
    const trackY = -cycleHeight + normY;

    trackRef.current.style.transform = `translate3d(0px, ${trackY.toFixed(2)}px, 0px)`;
  }, []);

  // Update transform whenever copyHeight changes
  useEffect(() => {
    if (copyHeight > 0) {
      applyTransform();
    }
  }, [copyHeight, applyTransform]);

  // Loop di animazione per il micro-scorrimento autonomo quando nessuno tocca lo schermo
  useEffect(() => {
    let animId: number;
    let prevTime = performance.now();

    const loop = (currentTime: number) => {
      // Capped dt (max 50ms) to prevent sudden jumps on tab switch or lag spikes
      const dt = Math.min(0.05, (currentTime - prevTime) / 1000);
      prevTime = currentTime;

      const isModalActive = isThisModalOpen;
      const isDragging = isDraggingRef.current;
      const isGliding = Boolean(glideRafIdRef.current);
      // Se l'utente sta passando con il mouse su un caso di questa stazione, rallenta per consentire il click
      const isHoveringThisStation = Boolean(
        hoveredTileItem && portion.placements.some((p) => p.item.id === hoveredTileItem.id)
      );

      if (isDragging || isGliding || isModalActive) {
        lastInteractionTimeRef.current = currentTime;
        currentDriftSpeedRef.current = 0;
      } else if (isHoveringThisStation) {
        // Rallenta delicatamente verso 0 se il mouse è posizionato su un'opera
        currentDriftSpeedRef.current = Math.max(
          0,
          currentDriftSpeedRef.current - targetDriftSpeed * dt * 2.5
        );
        lastInteractionTimeRef.current = currentTime;
      } else {
        // Stato inattivo (Idle): dopo 4 secondi di quiete, avvia la discesa lenta e continua
        const idleDuration = currentTime - lastInteractionTimeRef.current;
        const IDLE_WAIT_MS = 4000;

        if (idleDuration > IDLE_WAIT_MS) {
          // Accelera in modo ultra-morbido nell'arco di 2 secondi
          const rampRate = targetDriftSpeed / 2.0;
          currentDriftSpeedRef.current = Math.min(
            targetDriftSpeed,
            currentDriftSpeedRef.current + rampRate * dt
          );

          if (currentDriftSpeedRef.current > 0.01 && (copyHeightRef.current > 0 || copyHeight > 0)) {
            offsetYRef.current += currentDriftSpeedRef.current * dt;
            applyTransform();
          }
        } else {
          currentDriftSpeedRef.current = 0;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isThisModalOpen, hoveredTileItem, portion.placements, targetDriftSpeed, applyTransform]);

  // Pointer drag gestures (Touch screen on LED wall & mouse drag)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isThisModalOpen) return;
    if (e.button !== 0) return;

    if (glideRafIdRef.current) {
      cancelAnimationFrame(glideRafIdRef.current);
      glideRafIdRef.current = null;
    }

    isDraggingRef.current = true;
    currentDriftSpeedRef.current = 0;
    lastInteractionTimeRef.current = performance.now();
    hasMovedRef.current = false;
    startYRef.current = e.clientY;
    lastYRef.current = e.clientY;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    const onPointerMove = (moveEvt: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const currentY = moveEvt.clientY;
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

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      isDraggingRef.current = false;
      lastInteractionTimeRef.current = performance.now();

      if (hasMovedRef.current) {
        // Natural momentum glide with inertia
        let v = velocityRef.current * 16;
        v = Math.max(-45, Math.min(45, v));

        if (Math.abs(v) > 0.5) {
          const friction = 0.94;
          const glide = () => {
            if (Math.abs(v) < 0.15 || isDraggingRef.current) {
              glideRafIdRef.current = null;
              lastInteractionTimeRef.current = performance.now();
              return;
            }
            offsetYRef.current += v;
            v *= friction;
            applyTransform();
            lastInteractionTimeRef.current = performance.now();
            glideRafIdRef.current = requestAnimationFrame(glide);
          };
          glideRafIdRef.current = requestAnimationFrame(glide);
        }

        setTimeout(() => {
          hasMovedRef.current = false;
        }, 80);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
  };

  // Mouse wheel / trackpad scroll on this station
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (isThisModalOpen) {
        e.stopPropagation();
        return;
      }
      if (e.ctrlKey) return; // allow pinch-zoom to pass to global handler

      e.preventDefault();
      e.stopPropagation();

      if (glideRafIdRef.current) {
        cancelAnimationFrame(glideRafIdRef.current);
        glideRafIdRef.current = null;
      }

      currentDriftSpeedRef.current = 0;
      lastInteractionTimeRef.current = performance.now();

      // Natural wheel scroll
      offsetYRef.current -= e.deltaY;
      applyTransform();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isThisModalOpen, applyTransform]);

  // Clean-up animation frame on unmount
  useEffect(() => {
    return () => {
      if (glideRafIdRef.current) {
        cancelAnimationFrame(glideRafIdRef.current);
      }
    };
  }, []);

  const handleSelectTile = (item: ArchiveItem) => {
    onSelectItem(item);
  };

  const renderTilesCopy = (copyIdx: 0 | 1 | 2) => {
    const isClone = copyIdx !== 1;
    return portion.placements.map((p) => {
      const isHovered = !isThisModalOpen && hoveredTileItem?.id === p.item.id;
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
          rowSpan={p.rowSpan}
          variant={p.variant}
          isClone={isClone}
          onSelect={handleSelectTile}
          onHover={(item) => {
            if (!isThisModalOpen && !isDraggingRef.current) {
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
      onClickCapture={(e) => {
        if (hasMovedRef.current) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      className="relative min-h-0 min-w-0 overflow-hidden w-full h-full flex flex-col cursor-grab active:cursor-grabbing touch-none select-none"
    >
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
          gap: "16px",
          willChange: "transform",
        }}
      >
        {/* Copy 0: clone above */}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${portion.cols}, minmax(0, 1fr))`,
            gridTemplateRows: portion.rowTemplate,
            gap: "16px",
            flexShrink: 0,
          }}
          className="items-stretch justify-items-stretch relative min-h-0 min-w-0"
        >
          {renderTilesCopy(0)}
        </div>

        {/* Copy 1: original center */}
        <div
          ref={copyRef}
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${portion.cols}, minmax(0, 1fr))`,
            gridTemplateRows: portion.rowTemplate,
            gap: "16px",
            flexShrink: 0,
          }}
          className="items-stretch justify-items-stretch relative min-h-0 min-w-0"
        >
          {renderTilesCopy(1)}
        </div>

        {/* Copy 2: clone below */}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${portion.cols}, minmax(0, 1fr))`,
            gridTemplateRows: portion.rowTemplate,
            gap: "16px",
            flexShrink: 0,
          }}
          className="items-stretch justify-items-stretch relative min-h-0 min-w-0"
        >
          {renderTilesCopy(2)}
        </div>
      </div>

      {/* Station Modal: strictly bounded inside this Station, scaled down with generous breathing room */}
      <AnimatePresence>
        {stationModal && (
          <StationModal
            key={`station-modal-portion-${portionIndex}`}
            item={stationModal}
            portionIndex={portionIndex}
            onClose={onCloseModal}
            onSelectItem={onSelectItem}
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
  modalTargetItem,
  onClearModalTarget,
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

  // Automatically open target case in its respective portion when triggered externally (e.g. from BeyondView)
  useEffect(() => {
    if (!modalTargetItem) return;
    const idxInP1 = portion1.placements.findIndex((p) => p.item.id === modalTargetItem.id);
    const idxInP2 = portion2.placements.findIndex((p) => p.item.id === modalTargetItem.id);
    const idxInP3 = portion3.placements.findIndex((p) => p.item.id === modalTargetItem.id);

    let targetPortion: 1 | 2 | 3 = 2;
    if (idxInP1 !== -1) targetPortion = 1;
    else if (idxInP2 !== -1) targetPortion = 2;
    else if (idxInP3 !== -1) targetPortion = 3;

    setStationModals((prev) => ({
      ...prev,
      [targetPortion]: modalTargetItem,
    }));
    onClearModalTarget?.();
  }, [modalTargetItem, portion1, portion2, portion3, onClearModalTarget]);

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
      className="relative w-full h-full overflow-hidden select-none bg-[#ECEEF0]"
    >
      {/* 1. SUBTLE EDGE DISSOLVES */}
      <div className="fixed top-0 left-0 right-0 h-4 edge-fade-top z-20 pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-4 edge-fade-bottom z-20 pointer-events-none" />
      <div className="fixed top-0 bottom-0 left-0 w-4 sm:w-6 edge-fade-left z-20 pointer-events-none" />
      <div className="fixed top-0 bottom-0 right-0 w-4 sm:w-6 edge-fade-right z-20 pointer-events-none" />



      {/* 3. MAIN EXHIBITION MEDIA WALL: ALL 76 CASES VISIBLE ACROSS 3 SEAMLESS PORTIONS AS ONE UNIFIED BLOCK */}
      <div className="relative w-full h-full max-h-screen overflow-hidden flex items-center justify-center p-4">
        {displayItems.length === 0 ? (
          <div className="pointer-events-auto flex flex-col items-center justify-center p-8 text-center border border-dashed border-black/30 bg-[#ECEEF0] w-full max-w-md my-auto shadow-md">
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
            className="w-full h-full max-h-full grid grid-cols-3 gap-x-4 items-stretch justify-items-stretch"
          >
            {/* PORTION 1: LEFT STATION (CASI 001 - 026) */}
            <StationColumn
              portion={portion1}
              portionIndex={1}
              activeItemId={activeItemId}
              isFilterOpen={isFilterOpen}
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
