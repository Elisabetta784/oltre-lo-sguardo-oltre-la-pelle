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
}

export type SizeTier = "large" | "medium" | "small";
export type Orientation = "portrait" | "landscape" | "square";

/**
 * Standardized modular height scales for the 3 sizing tiers (Large, Medium, Small).
 * The 'large' tier is prominently scaled up to inject dramatic visual dynamism and hierarchy,
 * while ensuring that artworks of the same format within a tier share a common side (height).
 */
export const TIER_HEIGHTS: Record<SizeTier, Record<Orientation, string>> = {
  large: {
    landscape: "clamp(100px, 13vh, 155px)",
    portrait: "clamp(128px, 16.5vh, 195px)",
    square: "clamp(112px, 14.5vh, 170px)",
  },
  medium: {
    landscape: "clamp(62px, 8.0vh, 92px)",
    portrait: "clamp(82px, 10.5vh, 122px)",
    square: "clamp(70px, 9.0vh, 104px)",
  },
  small: {
    landscape: "clamp(46px, 5.8vh, 68px)",
    portrait: "clamp(58px, 7.5vh, 88px)",
    square: "clamp(50px, 6.5vh, 76px)",
  },
};

export function getOrientation(ratio: number): Orientation {
  if (ratio < 0.95) return "portrait";
  if (ratio > 1.08) return "landscape";
  return "square";
}

interface PortionPlacement {
  item: ArchiveItem;
  row: number;
  col: number;
  colSpan: number;
  staggerX: number;
  staggerY: number;
  sizeTier: SizeTier;
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
  sizeTier: SizeTier;
  staggerX: number;
  staggerY: number;
}

// Portion 1 (26 items): Organic 4-column x 7-row layout with 2 hero 2-col spans + 24 single slots
const P1_SLOTS: SlotConfig[] = [
  // Row 1: Hero landscape (cols 1-2, Large) + 2 Medium items
  { row: 1, col: 1, colSpan: 2, sizeTier: "large", staggerX: 0, staggerY: 0 },
  { row: 1, col: 3, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 2 },
  { row: 1, col: 4, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },

  // Row 2: 4 items (Medium, Small, Medium, Medium)
  { row: 2, col: 1, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -2 },
  { row: 2, col: 2, colSpan: 1, sizeTier: "small", staggerX: 1, staggerY: 2 },
  { row: 2, col: 3, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 2, col: 4, colSpan: 1, sizeTier: "medium", staggerX: 2, staggerY: 1 },

  // Row 3: 4 items (Small, Medium, Medium, Small)
  { row: 3, col: 1, colSpan: 1, sizeTier: "small", staggerX: 1, staggerY: 2 },
  { row: 3, col: 2, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 3, col: 3, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 1 },
  { row: 3, col: 4, colSpan: 1, sizeTier: "small", staggerX: -1, staggerY: -2 },

  // Row 4: 3 items (Medium, Small, Hero landscape cols 3-4 Large)
  { row: 4, col: 1, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 4, col: 2, colSpan: 1, sizeTier: "small", staggerX: 1, staggerY: 2 },
  { row: 4, col: 3, colSpan: 2, sizeTier: "large", staggerX: 0, staggerY: 0 },

  // Row 5: 4 items (Medium, Medium, Medium, Medium)
  { row: 5, col: 1, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 1 },
  { row: 5, col: 2, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 5, col: 3, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 2 },
  { row: 5, col: 4, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },

  // Row 6: 4 items (Medium, Medium, Small, Medium)
  { row: 6, col: 1, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -2 },
  { row: 6, col: 2, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 1 },
  { row: 6, col: 3, colSpan: 1, sizeTier: "small", staggerX: -1, staggerY: 2 },
  { row: 6, col: 4, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: -1 },

  // Row 7: 4 items (Small, Medium, Medium, Medium)
  { row: 7, col: 1, colSpan: 1, sizeTier: "small", staggerX: 1, staggerY: 1 },
  { row: 7, col: 2, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 7, col: 3, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 2 },
  { row: 7, col: 4, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
];

// Portion 2 (25 items): Organic 4-column x 7-row layout with 3 hero 2-col spans + 22 single slots
const P2_SLOTS: SlotConfig[] = [
  // Row 1: 4 items (Medium, Small, Medium, Medium)
  { row: 1, col: 1, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 1, col: 2, colSpan: 1, sizeTier: "small", staggerX: 1, staggerY: 2 },
  { row: 1, col: 3, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 1, col: 4, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 1 },

  // Row 2: 3 items (Hero landscape cols 1-2 Large, Small, Medium)
  { row: 2, col: 1, colSpan: 2, sizeTier: "large", staggerX: 0, staggerY: 0 },
  { row: 2, col: 3, colSpan: 1, sizeTier: "small", staggerX: 1, staggerY: 2 },
  { row: 2, col: 4, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -2 },

  // Row 3: 4 items (Medium, Medium, Medium, Small)
  { row: 3, col: 1, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 1 },
  { row: 3, col: 2, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 3, col: 3, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 2 },
  { row: 3, col: 4, colSpan: 1, sizeTier: "small", staggerX: -1, staggerY: -2 },

  // Row 4: 3 items (Small, Medium, Hero landscape cols 3-4 Large)
  { row: 4, col: 1, colSpan: 1, sizeTier: "small", staggerX: 1, staggerY: 2 },
  { row: 4, col: 2, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 4, col: 3, colSpan: 2, sizeTier: "large", staggerX: 0, staggerY: 0 },

  // Row 5: 4 items (Medium, Medium, Small, Medium)
  { row: 5, col: 1, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 5, col: 2, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 2 },
  { row: 5, col: 3, colSpan: 1, sizeTier: "small", staggerX: -1, staggerY: 2 },
  { row: 5, col: 4, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: -1 },

  // Row 6: 3 items (Hero landscape cols 1-2 Large, Medium, Medium)
  { row: 6, col: 1, colSpan: 2, sizeTier: "large", staggerX: 0, staggerY: 0 },
  { row: 6, col: 3, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -2 },
  { row: 6, col: 4, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 1 },

  // Row 7: 4 items (Medium, Small, Medium, Medium)
  { row: 7, col: 1, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 1 },
  { row: 7, col: 2, colSpan: 1, sizeTier: "small", staggerX: -1, staggerY: 2 },
  { row: 7, col: 3, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: -1 },
  { row: 7, col: 4, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
];

// Portion 3 (25 items): Organic 4-column x 7-row layout with 3 hero 2-col spans + 22 single slots
const P3_SLOTS: SlotConfig[] = [
  // Row 1: 3 items (Medium, Medium, Hero landscape cols 3-4 Large)
  { row: 1, col: 1, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 1, col: 2, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 2 },
  { row: 1, col: 3, colSpan: 2, sizeTier: "large", staggerX: 0, staggerY: 0 },

  // Row 2: 4 items (Small, Medium, Medium, Small)
  { row: 2, col: 1, colSpan: 1, sizeTier: "small", staggerX: 1, staggerY: 2 },
  { row: 2, col: 2, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 2, col: 3, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 1 },
  { row: 2, col: 4, colSpan: 1, sizeTier: "small", staggerX: -1, staggerY: -2 },

  // Row 3: 4 items (Medium, Medium, Small, Medium)
  { row: 3, col: 1, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -2 },
  { row: 3, col: 2, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 1 },
  { row: 3, col: 3, colSpan: 1, sizeTier: "small", staggerX: -1, staggerY: 2 },
  { row: 3, col: 4, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: -1 },

  // Row 4: 3 items (Hero landscape cols 1-2 Large, Medium, Small)
  { row: 4, col: 1, colSpan: 2, sizeTier: "large", staggerX: 0, staggerY: 0 },
  { row: 4, col: 3, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 4, col: 4, colSpan: 1, sizeTier: "small", staggerX: 1, staggerY: 2 },

  // Row 5: 4 items (Medium, Small, Medium, Medium)
  { row: 5, col: 1, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 1 },
  { row: 5, col: 2, colSpan: 1, sizeTier: "small", staggerX: -1, staggerY: 2 },
  { row: 5, col: 3, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: -1 },
  { row: 5, col: 4, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },

  // Row 6: 3 items (Medium, Hero landscape cols 2-3 Large, Medium)
  { row: 6, col: 1, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 6, col: 2, colSpan: 2, sizeTier: "large", staggerX: 0, staggerY: 0 },
  { row: 6, col: 4, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 1 },

  // Row 7: 4 items (Small, Medium, Medium, Medium)
  { row: 7, col: 1, colSpan: 1, sizeTier: "small", staggerX: 1, staggerY: 2 },
  { row: 7, col: 2, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
  { row: 7, col: 3, colSpan: 1, sizeTier: "medium", staggerX: 1, staggerY: 1 },
  { row: 7, col: 4, colSpan: 1, sizeTier: "medium", staggerX: -1, staggerY: -1 },
];

/**
 * Builds an organic, semi-random, and harmoniously scaled distribution for a portion:
 * - Exactly 3 sizes across the entire wall (Large, Medium, Small).
 * - Artworks of the same shape/orientation share a common dimension (height).
 * - Original aspect ratios are strictly preserved without cropping or stretching.
 * - Dynamic placement with subtle organic staggers creates a modern museum gallery aesthetic.
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
    // Tailored row templates giving ample breathing room to rows hosting 2-col hero images
    let rowTemplate = "1.25fr 1fr 1fr 1.25fr 1fr 1fr 1fr";
    if (portionIndex === 0) {
      // Heroes on rows 1 and 4
      rowTemplate = "1.4fr 0.95fr 0.95fr 1.4fr 0.95fr 0.95fr 0.95fr";
    } else if (portionIndex === 1) {
      // Heroes on rows 2, 4, 6
      rowTemplate = "0.9fr 1.35fr 0.9fr 1.35fr 0.9fr 1.35fr 0.9fr";
    } else {
      // Heroes on rows 1, 4, 6
      rowTemplate = "1.35fr 0.9fr 0.9fr 1.35fr 0.9fr 1.35fr 0.9fr";
    }

    let slots: SlotConfig[] = [];
    if (portionIndex === 0) {
      slots = P1_SLOTS;
    } else if (portionIndex === 1) {
      slots = P2_SLOTS;
    } else {
      slots = P3_SLOTS;
    }

    // Separate items by format
    const wideHeroes = portionItems.filter(
      (it) => (ratiosMap[it.id]?.ratio || it.aspectRatio || 1.33) >= 1.45
    );
    const portraits = portionItems.filter(
      (it) => (ratiosMap[it.id]?.ratio || it.aspectRatio || 1.33) < 0.95
    );
    const others = portionItems.filter(
      (it) => !wideHeroes.includes(it) && !portraits.includes(it)
    );

    // Slots needing 2-column span heroes
    const heroSlots = slots.filter((s) => s.colSpan === 2);
    const singleSlots = slots.filter((s) => s.colSpan === 1);

    // Assign hero slots to wide landscapes
    let wideHeroIdx = 0;
    const heroAssignments: { slot: SlotConfig; item: ArchiveItem }[] = [];
    for (const s of heroSlots) {
      const it = wideHeroes[wideHeroIdx++] || others.pop() || portionItems[0];
      heroAssignments.push({ slot: s, item: it });
    }

    // Remaining items to distribute across single slots
    const remainingWide = wideHeroes.slice(wideHeroIdx);
    const remainingItems = [...portraits, ...others, ...remainingWide];

    const placements: PortionPlacement[] = [];

    // Add hero placements
    for (const ha of heroAssignments) {
      placements.push({
        item: ha.item,
        row: ha.slot.row,
        col: ha.slot.col,
        colSpan: ha.slot.colSpan,
        staggerX: ha.slot.staggerX,
        staggerY: ha.slot.staggerY,
        sizeTier: ha.slot.sizeTier,
      });
    }

    // Add single slots placements
    let remIdx = 0;
    for (const s of singleSlots) {
      if (remIdx < remainingItems.length) {
        const it = remainingItems[remIdx++];
        placements.push({
          item: it,
          row: s.row,
          col: s.col,
          colSpan: s.colSpan,
          staggerX: s.staggerX,
          staggerY: s.staggerY,
          sizeTier: s.sizeTier,
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
    const staggerY = (col + row) % 2 === 0 ? 3 : -3;
    const staggerX = col % 2 === 0 ? -2 : 2;
    // Exactly 3 size tiers in a balanced rhythm
    const sizeTier: SizeTier = i % 5 === 0 ? "large" : i % 3 === 0 ? "small" : "medium";

    placements.push({
      item: portionItems[i],
      row,
      col,
      colSpan: 1,
      staggerX,
      staggerY,
      sizeTier,
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
  staggerX: number;
  staggerY: number;
  sizeTier: SizeTier;
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
  staggerX,
  staggerY,
  sizeTier,
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
  const orientation = getOrientation(dim.ratio);
  const targetHeight = TIER_HEIGHTS[sizeTier][orientation];

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
        gridRow: `${row} / span 1`,
        gridColumn: `${col} / span ${colSpan}`,
        transform: `translate3d(${staggerX}px, ${staggerY}px, 0px)`,
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
          height: targetHeight,
          width: "auto",
          maxWidth: colSpan > 1 ? "96%" : "92%",
          maxHeight: "94%",
        }}
        className={`w-auto h-auto rounded-none overflow-hidden bg-transparent transition-all duration-200 cursor-pointer flex items-center justify-center border-0 ${
          isHovered
            ? "shadow-2xl shadow-black/30"
            : isActive
            ? "shadow-md shadow-black/20"
            : "shadow-2xs"
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
  const heightRef = useRef(0);
  const [height, setHeight] = useState(0);

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
    const cycleHeight = H + 6; // 6px row gap between repeating copies
    const normY = ((offsetYRef.current % cycleHeight) + cycleHeight) % cycleHeight;
    const trackY = -cycleHeight + normY;

    trackRef.current.style.transform = `translate3d(0px, ${trackY.toFixed(2)}px, 0px)`;
  }, []);

  // Update transform whenever height changes
  useEffect(() => {
    if (height > 0) {
      applyTransform();
    }
  }, [height, applyTransform]);

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

          if (currentDriftSpeedRef.current > 0.01 && heightRef.current > 0) {
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
      if (isThisModalOpen) return;
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
          staggerX={p.staggerX}
          staggerY={p.staggerY}
          sizeTier={p.sizeTier}
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
          gap: "6px",
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
            gap: "6px",
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
            gap: "6px",
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
            gap: "6px",
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



      {/* 3. MAIN EXHIBITION MEDIA WALL: ALL 76 CASES VISIBLE ACROSS 3 SEAMLESS PORTIONS AS ONE UNIFIED BLOCK */}
      <div className="relative w-full h-full max-h-screen overflow-hidden flex items-center justify-center px-2 sm:px-3 py-2 sm:py-3">
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
            className="w-full h-full max-h-full grid grid-cols-3 gap-x-1.5 sm:gap-x-2 items-stretch justify-items-stretch"
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
