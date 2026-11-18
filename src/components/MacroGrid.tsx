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

export type SizeTier = "large" | "medium" | "small";
export type Orientation = "portrait" | "landscape" | "square";

/**
 * Standardized modular height scales for the 3 sizing tiers (Large, Medium, Small).
 * The 'large' tier is prominently scaled up to inject dramatic visual dynamism and hierarchy,
 * while ensuring that artworks of the same format within a tier share a common side (height).
 */
export const TIER_HEIGHTS: Record<SizeTier, Record<Orientation, string>> = {
  large: {
    landscape: "clamp(90px, 9.8vh, 125px)",
    portrait: "clamp(120px, 14.2vh, 170px)",
    square: "clamp(100px, 11.5vh, 140px)",
  },
  medium: {
    landscape: "clamp(65px, 7.8vh, 95px)",
    portrait: "clamp(95px, 11.5vh, 138px)",
    square: "clamp(78px, 9.2vh, 110px)",
  },
  small: {
    landscape: "clamp(52px, 6.2vh, 75px)",
    portrait: "clamp(75px, 9.0vh, 108px)",
    square: "clamp(62px, 7.4vh, 90px)",
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
  rowSpan: number;
  role?: string;
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
  role?: string;
  id: string;
}

// Station 1 (26 items): Left station of museum installation, staggered top-left contour matching griglia2.jpg
const S1_SLOTS: SlotConfig[] = [
  // Row 1: Col 1 empty (stepped!), Col 2-3 single
  { row: 1, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-004" },
  { row: 1, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-005" },

  // Row 2: Col 1 single, Col 2-3 Hero Wide
  { row: 2, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-006" },
  { row: 2, col: 2, colSpan: 2, rowSpan: 1, role: "wide", id: "caso-001" },

  // Row 3: Col 1 Tall (rows 3-4), Col 2 audio card, Col 3 manuscript text card
  { row: 3, col: 1, colSpan: 1, rowSpan: 2, role: "tall", id: "caso-002" },
  { row: 3, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-019" },
  { row: 3, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-020" },

  // Row 4: Col 1 is taken by row 3 tall. Col 2-3 singles
  { row: 4, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-011" },
  { row: 4, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-012" },

  // Row 5: 3 singles
  { row: 5, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-013" },
  { row: 5, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-014" },
  { row: 5, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-015" },

  // Row 6: Col 1-2 Hero Wide, Col 3 Tall (rows 6-7)
  { row: 6, col: 1, colSpan: 2, rowSpan: 1, role: "wide", id: "caso-010" },
  { row: 6, col: 3, colSpan: 1, rowSpan: 2, role: "tall", id: "caso-007" },

  // Row 7: Col 1-2 singles (Col 3 taken)
  { row: 7, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-017" },
  { row: 7, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-018" },

  // Row 8: 3 singles
  { row: 8, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-021" },
  { row: 8, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-023" },
  { row: 8, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-024" },

  // Row 9: Col 1 Tall (rows 9-10), Col 2-3 Hero Wide
  { row: 9, col: 1, colSpan: 1, rowSpan: 2, role: "tall", id: "caso-008" },
  { row: 9, col: 2, colSpan: 2, rowSpan: 1, role: "wide", id: "caso-016" },

  // Row 10: Col 2-3 singles (Col 1 taken)
  { row: 10, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-025" },
  { row: 10, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-026" },

  // Row 11: 3 singles
  { row: 11, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-027" },
  { row: 11, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-028" },
  { row: 11, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-029" },
];

// Station 2 (25 items): Center station with iconic Grand Hero 2x2 centerpiece and stepped center silhouette matching griglia2.jpg
const S2_SLOTS: SlotConfig[] = [
  // Row 1: 3 singles
  { row: 1, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-032" },
  { row: 1, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-033" },
  { row: 1, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-036" },

  // Row 2: Col 1 audio card, Col 2-3 Grand Hero 2x2 centerpiece (Van Gogh inspired focal screen!)
  { row: 2, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-037" },
  { row: 2, col: 2, colSpan: 2, rowSpan: 2, role: "hero2x2", id: "caso-022" },

  // Row 3: Col 1 manuscript text card (Cols 2-3 taken by Grand Hero)
  { row: 3, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-038" },

  // Row 4: 3 singles
  { row: 4, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-039" },
  { row: 4, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-040" },
  { row: 4, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-041" },

  // Row 5: Col 1-2 Hero Wide, Col 3 single
  { row: 5, col: 1, colSpan: 2, rowSpan: 1, role: "wide", id: "caso-030" },
  { row: 5, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-043" },

  // Row 6: Col 1 Tall (rows 6-7), Col 2-3 Hero Wide
  { row: 6, col: 1, colSpan: 1, rowSpan: 2, role: "tall", id: "caso-031" },
  { row: 6, col: 2, colSpan: 2, rowSpan: 1, role: "wide", id: "caso-034" },

  // Row 7: Col 2-3 singles (Col 1 taken)
  { row: 7, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-044" },
  { row: 7, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-045" },

  // Row 8: 3 singles
  { row: 8, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-046" },
  { row: 8, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-047" },
  { row: 8, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-048" },

  // Row 9: Col 1-2 Hero Wide, Col 3 Tall (rows 9-10)
  { row: 9, col: 1, colSpan: 2, rowSpan: 1, role: "wide", id: "caso-042" },
  { row: 9, col: 3, colSpan: 1, rowSpan: 2, role: "tall", id: "caso-035" },

  // Row 10: Col 1-2 singles (Col 3 taken)
  { row: 10, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-049" },
  { row: 10, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-050" },

  // Row 11: 3 singles
  { row: 11, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-051" },
  { row: 11, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-052" },
  { row: 11, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-053" },
];

// Station 3 (25 items): Right station with wide cinematic landscape panels and stepped edges matching griglia2.jpg
const S3_SLOTS: SlotConfig[] = [
  // Row 1: Col 1 empty (stepped!), Col 2-3 Hero Wide
  { row: 1, col: 2, colSpan: 2, rowSpan: 1, role: "wide", id: "caso-070" },

  // Row 2: Col 1 audio, Col 2 manuscript text, Col 3 single
  { row: 2, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-055" },
  { row: 2, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-056" },
  { row: 2, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-058" },

  // Row 3: Col 1-2 Hero Wide (Kintsugi), Col 3 single
  { row: 3, col: 1, colSpan: 2, rowSpan: 1, role: "wide", id: "caso-003" },
  { row: 3, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-059" },

  // Row 4: Col 1-2 singles, Col 3 Tall (rows 4-5)
  { row: 4, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-060" },
  { row: 4, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-061" },
  { row: 4, col: 3, colSpan: 1, rowSpan: 2, role: "tall", id: "caso-054" },

  // Row 5: Col 1-2 singles (Col 3 taken)
  { row: 5, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-062" },
  { row: 5, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-063" },

  // Row 6: 3 singles
  { row: 6, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-065" },
  { row: 6, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-066" },
  { row: 6, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-067" },

  // Row 7: Col 1 Tall (rows 7-8), Col 2-3 Hero Wide
  { row: 7, col: 1, colSpan: 1, rowSpan: 2, role: "tall", id: "caso-068" },
  { row: 7, col: 2, colSpan: 2, rowSpan: 1, role: "wide", id: "caso-064" },

  // Row 8: Col 2-3 singles (Col 1 taken)
  { row: 8, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-069" },
  { row: 8, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-071" },

  // Row 9: Col 1-2 Hero Wide, Col 3 single
  { row: 9, col: 1, colSpan: 2, rowSpan: 1, role: "wide", id: "caso-057" },
  { row: 9, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-009" },

  // Row 10: 3 singles
  { row: 10, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-169" },
  { row: 10, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-172" },
  { row: 10, col: 3, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-171" },

  // Row 11: Col 1-2 singles, Col 3 empty (stepped bottom!)
  { row: 11, col: 1, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-159" },
  { row: 11, col: 2, colSpan: 1, rowSpan: 1, role: "mid", id: "caso-168" },
];

function packFilteredPortion(
  portionItems: ArchiveItem[],
  ratiosMap: Record<string, { w: number; h: number; ratio: number }>
): PortionData {
  const count = portionItems.length;
  if (count === 0) {
    return {
      cols: 3,
      rows: 1,
      rowTemplate: "clamp(135px, 16vh, 185px)",
      placements: [],
    };
  }

  const cols = 3;
  const placements: PortionPlacement[] = [];
  let curRow = 1;
  let curCol = 1;

  for (let i = 0; i < count; i++) {
    const item = portionItems[i];
    const r = ratiosMap[item.id]?.ratio || item.aspectRatio || 1.33;
    const isWide = r >= 1.5 && curCol <= 2;
    const isTall = r <= 0.85;

    const colSpan = isWide ? 2 : 1;
    const rowSpan = isTall ? 2 : 1;

    placements.push({
      item,
      row: curRow,
      col: curCol,
      colSpan,
      rowSpan,
      role: isWide ? "wide" : isTall ? "tall" : "mid",
    });

    curCol += colSpan;
    if (curCol > cols) {
      curCol = 1;
      curRow += 1;
    }
  }

  const rows = Math.max(1, curCol === 1 ? curRow - 1 : curRow);
  const rowTemplate = `repeat(${rows}, clamp(135px, 16vh, 185px))`;

  return { cols, rows, rowTemplate, placements };
}

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
    const itemMap = new Map<string, ArchiveItem>();
    displayItems.forEach((it) => itemMap.set(it.id, it));

    const p1Placements: PortionPlacement[] = S1_SLOTS.map((s) => ({
      item: itemMap.get(s.id) || displayItems[0],
      row: s.row,
      col: s.col,
      colSpan: s.colSpan,
      rowSpan: s.rowSpan,
      role: s.role,
    }));

    const p2Placements: PortionPlacement[] = S2_SLOTS.map((s) => ({
      item: itemMap.get(s.id) || displayItems[0],
      row: s.row,
      col: s.col,
      colSpan: s.colSpan,
      rowSpan: s.rowSpan,
      role: s.role,
    }));

    const p3Placements: PortionPlacement[] = S3_SLOTS.map((s) => ({
      item: itemMap.get(s.id) || displayItems[0],
      row: s.row,
      col: s.col,
      colSpan: s.colSpan,
      rowSpan: s.rowSpan,
      role: s.role,
    }));

    const rowTemplate = "repeat(11, clamp(135px, 16vh, 185px))";

    return {
      portion1: { cols: 3, rows: 11, rowTemplate, placements: p1Placements },
      portion2: { cols: 3, rows: 11, rowTemplate, placements: p2Placements },
      portion3: { cols: 3, rows: 11, rowTemplate, placements: p3Placements },
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
    portion1: packFilteredPortion(p1Items, ratiosMap),
    portion2: packFilteredPortion(p2Items, ratiosMap),
    portion3: packFilteredPortion(p3Items, ratiosMap),
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
  rowSpan?: number;
  role?: string;
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
  rowSpan = 1,
  role,
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
        opacity: 1,
      }}
      className={`pointer-events-auto w-full h-full min-h-0 min-w-0 cursor-pointer relative group ${
        isHovered ? "z-30" : "z-10"
      }`}
    >
      <motion.div
        layoutId={isClone ? undefined : `item-media-${item.id}`}
        animate={{
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full h-full rounded-[6px] overflow-hidden bg-[#161718] transition-all duration-200 cursor-pointer flex items-center justify-center relative border border-black/15 ${
          isHovered
            ? "shadow-2xl shadow-black/40 ring-1 ring-black/40"
            : isActive
            ? "shadow-lg shadow-black/25 ring-2 ring-black/60"
            : "shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
        }`}
      >
        {/* 1. PHOTO - Edge-to-edge coverage filling the modular exhibition screen */}
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
          <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-[#1C1E20] text-white select-none">
            <div className="flex items-center gap-1.5 h-8 w-full justify-center overflow-hidden px-2">
              {(item.audioWaveform || [40, 70, 90, 50, 80, 100, 60, 40, 75, 55])
                .slice(0, 10)
                .map((h, bIdx) => (
                  <div
                    key={bIdx}
                    style={{ height: `${h * 0.8}%` }}
                    className="w-1 bg-white/90 rounded-full"
                  />
                ))}
            </div>
            <div className="flex items-center gap-1.5 mt-2 opacity-80">
              <Volume2 className="w-3.5 h-3.5 text-white" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/90">AUDIO</span>
            </div>
            <span className="font-sans text-[10px] text-white/70 tracking-wide mt-0.5 line-clamp-1 px-2 text-center">
              {item.microKeyword || item.title}
            </span>
          </div>
        )}

        {/* 3. TEXT / MANUSCRIPT */}
        {item.type === "text" && (
          <div className="w-full h-full p-3.5 flex flex-col justify-between items-center bg-[#F4F3EE] overflow-hidden text-center select-none border border-black/10">
            <span className="font-sans text-[8.5px] font-bold text-black/50 tracking-widest uppercase">
              {item.authorOrSubject || "TESTIMONIANZA"}
            </span>
            <p className="font-serif italic text-[11px] sm:text-[12px] text-black/85 leading-snug line-clamp-4 px-1 my-auto">
              &ldquo;{item.excerpt || item.sintesiConcettuale || item.title}&rdquo;
            </p>
            <span className="font-mono text-[8px] uppercase tracking-wider text-black/45">
              {item.microKeyword || item.segno}
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
  const copyRef = useRef<HTMLDivElement>(null);
  const copyHeightRef = useRef<number>(1800);
  const [copyHeight, setCopyHeight] = useState<number>(1800);

  const isThisModalOpen = Boolean(stationModal);

  // Staggered initial vertical offset across the 3 stations
  const initialOffset = portionIndex === 2 ? -60 : portionIndex === 3 ? -30 : 0;
  const offsetYRef = useRef(initialOffset);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const glideRafIdRef = useRef<number | null>(null);
  const hasMovedRef = useRef(false);

  // Micro-scorrimento autonomo (Idle Drift):
  // Velocità ultra-lenta (11-14 px/s) e non invadente, con lieve sfasamento tra le 3 stazioni
  const targetDriftSpeed = useMemo(() => {
    if (portionIndex === 1) return 11;
    if (portionIndex === 2) return 14;
    return 12;
  }, [portionIndex]);

  const currentDriftSpeedRef = useRef(0);
  const lastInteractionTimeRef = useRef<number>(performance.now());

  const applyTransform = useCallback(() => {
    if (!trackRef.current) return;
    const H = copyHeightRef.current > 0 ? copyHeightRef.current : 1800;
    const cycleHeight = H + 10; // 10px row gap between repeating copies
    const normY = ((offsetYRef.current % cycleHeight) + cycleHeight) % cycleHeight;
    const trackY = -cycleHeight + normY;

    trackRef.current.style.transform = `translate3d(0px, ${trackY.toFixed(2)}px, 0px)`;
  }, []);

  // Measure rendered copy height dynamically with ResizeObserver
  useEffect(() => {
    const el = copyRef.current;
    if (!el) return;
    const update = () => {
      const h = el.offsetHeight;
      if (h > 0) {
        copyHeightRef.current = h;
        setCopyHeight(h);
        applyTransform();
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyTransform]);

  // Update transform whenever copyHeight changes
  useEffect(() => {
    applyTransform();
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
        // Stato inattivo (Idle): dopo 3.5 secondi di quiete, avvia la discesa lenta e continua
        const idleDuration = currentTime - lastInteractionTimeRef.current;
        const IDLE_WAIT_MS = 3500;

        if (idleDuration > IDLE_WAIT_MS) {
          // Accelera in modo ultra-morbido nell'arco di 2 secondi
          const rampRate = targetDriftSpeed / 2.0;
          currentDriftSpeedRef.current = Math.min(
            targetDriftSpeed,
            currentDriftSpeedRef.current + rampRate * dt
          );

          if (currentDriftSpeedRef.current > 0.01) {
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
          role={p.role}
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
          gap: "10px",
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
            gap: "10px",
            flexShrink: 0,
          }}
          className="items-stretch justify-items-stretch relative min-h-0 min-w-0"
        >
          {renderTilesCopy(0)}
        </div>

        {/* Copy 1: original center (measured) */}
        <div
          ref={copyRef}
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${portion.cols}, minmax(0, 1fr))`,
            gridTemplateRows: portion.rowTemplate,
            gap: "10px",
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
            gap: "10px",
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
      <div className="relative w-full h-full max-h-screen overflow-hidden flex items-center justify-center px-2 sm:px-3 py-2 sm:py-3">
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
            className="w-full h-full max-h-full grid grid-cols-3 gap-x-2.5 items-stretch justify-items-stretch"
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
