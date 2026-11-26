"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";
import { ArchiveItem, ARCHIVE_ASPECT_RATIOS } from "@/data/archiveData";
import { StationModal } from "./StationModal";
import { BrandSlashes, BrandSlashCluster } from "./BrandSlashes";

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

export interface MockupSlot {
  x: number; // percentage (0..100)
  y: number; // percentage (0..100)
  w: number; // percentage
  h: number; // percentage
  ratio: number;
}

export interface PortionPlacement {
  item: ArchiveItem;
  // Mockup-based percentage positioning (Full Archive mode)
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  ratio?: number;
  // Dynamic Bento CSS Grid (Filtered mode)
  row?: number;
  col?: number;
  colSpan?: number;
  rowSpan?: number;
  variant?: BentoVariant;
}

export interface PortionData {
  isMockupLayout: boolean;
  aspectHeightRatio?: number;
  cols?: number;
  rows?: number;
  rowTemplate?: string;
  placements: PortionPlacement[];
}

// Station 1 (26 slots) - extracted directly from user Figma mockup (Screenshot 2026-11-18 alle 17.31.01.png)
// Matches Station 1 items: 7 portraits, 2 squares, 17 landscapes (height/width aspect ~1.92)
const S1_SLOTS: MockupSlot[] = [
  { x: 45.1, y: 0.0, w: 13.65, h: 5.26, ratio: 1.353 },
  { x: 0.0, y: 2.01, w: 39.47, h: 14.99, ratio: 1.371 },
  { x: 67.36, y: 4.17, w: 21.96, h: 14.84, ratio: 0.771 },
  { x: 45.1, y: 8.66, w: 16.32, h: 5.87, ratio: 1.447 },
  { x: 11.87, y: 19.17, w: 18.4, h: 11.59, ratio: 0.827 },
  { x: 67.36, y: 21.17, w: 32.64, h: 11.75, ratio: 1.447 },
  { x: 34.12, y: 21.95, w: 21.96, h: 11.59, ratio: 0.987 },
  { x: 0.0, y: 33.69, w: 15.43, h: 7.57, ratio: 1.061 },
  { x: 67.36, y: 35.39, w: 20.77, h: 11.75, ratio: 0.921 },
  { x: 23.15, y: 36.17, w: 39.17, h: 15.46, ratio: 1.32 },
  { x: 0.0, y: 46.21, w: 18.4, h: 11.59, ratio: 0.827 },
  { x: 80.42, y: 49.3, w: 18.99, h: 15.15, ratio: 0.653 },
  { x: 67.36, y: 52.09, w: 9.79, h: 6.34, ratio: 0.805 },
  { x: 33.53, y: 54.1, w: 22.55, h: 6.34, ratio: 1.854 },
  { x: 11.28, y: 61.98, w: 23.15, h: 7.57, ratio: 1.592 },
  { x: 45.1, y: 62.29, w: 29.97, h: 10.97, ratio: 1.423 },
  { x: 81.01, y: 70.02, w: 18.4, h: 6.34, ratio: 1.512 },
  { x: 0.0, y: 71.25, w: 33.53, h: 11.9, ratio: 1.468 },
  { x: 41.84, y: 77.28, w: 14.24, h: 5.26, ratio: 1.412 },
  { x: 62.02, y: 78.52, w: 37.39, h: 10.51, ratio: 1.853 },
  { x: 0.0, y: 85.16, w: 18.4, h: 7.73, ratio: 1.24 },
  { x: 39.76, y: 85.16, w: 16.32, h: 5.87, ratio: 1.447 },
  { x: 24.33, y: 86.55, w: 10.09, h: 6.34, ratio: 0.829 },
  { x: 77.45, y: 91.04, w: 14.24, h: 5.26, ratio: 1.412 },
  { x: 45.1, y: 92.58, w: 22.85, h: 7.42, ratio: 1.604 },
  { x: 11.87, y: 95.21, w: 21.66, h: 4.79, ratio: 2.355 },
];



/**
 * Dynamic Bento packing algorithm for filtered views with fewer items (< 18).
 * Ensures zero overflow, tight packing across 6 columns, and strict adherence to the 4 variants.
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
    if (p.row && p.rowSpan) {
      maxRow = Math.max(maxRow, p.row + p.rowSpan - 1);
    }
  }

  return {
    isMockupLayout: false,
    cols,
    rows: maxRow,
    rowTemplate: `repeat(${maxRow}, clamp(85px, 10vh, 120px))`,
    placements,
  };
}

/**
 * Builds the exact layout from the user's Figma mockup (Screenshot 2026-11-18 alle 17.31.01.png).
 * Adapts case studies by assigning each item to the slot with the closest natural aspect ratio.
 */
function packMockupPortion(
  portionItems: ArchiveItem[],
  slots: MockupSlot[],
  ratiosMap: Record<string, { w: number; h: number; ratio: number }>,
  aspectHeightRatio: number
): PortionData {
  if (portionItems.length === 0) {
    return {
      isMockupLayout: true,
      aspectHeightRatio,
      placements: [],
    };
  }

  // Sort items by natural aspect ratio ascending
  const itemsSorted = [...portionItems].sort((a, b) => {
    const rA = ratiosMap[a.id]?.ratio || a.aspectRatio || 1.33;
    const rB = ratiosMap[b.id]?.ratio || b.aspectRatio || 1.33;
    return rA - rB;
  });

  // Sort slots by target slot ratio ascending
  const slotsSorted = [...slots].sort((a, b) => a.ratio - b.ratio);

  const placements: PortionPlacement[] = [];
  for (let i = 0; i < slotsSorted.length; i++) {
    const slot = slotsSorted[i];
    const item = itemsSorted[i] || portionItems[i % portionItems.length];
    placements.push({
      item,
      x: slot.x,
      y: slot.y,
      w: slot.w,
      h: slot.h,
      ratio: slot.ratio,
    });
  }

  return {
    isMockupLayout: true,
    aspectHeightRatio,
    placements,
  };
}

/**
 * Computes deterministic 3-portion layout for the exhibition media wall:
 * - Station 1 (Left): 26 items (Casi 001 - 026) -> S1_SLOTS
 * - Station 2 (Center): 26 items (Casi 027 - 051 + 1 duplicate with alternate cover) -> S1_SLOTS
 * - Station 3 (Right): 26 items (Casi 052 - 076 + 1 duplicate with alternate cover) -> S1_SLOTS
 * Reproduces the balanced left layout across all 3 stations with zero large white spaces.
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
    // Station 1: exactly 26 items (Casi 001 - 026)
    const p1Items = displayItems.slice(0, 26);

    // Station 2: 25 items (Casi 027 - 051) + 1 duplicate with alternate cover photo
    const baseP2 = displayItems.slice(26, 51);
    const itemToDupP2 = baseP2.find((it) => it.id === "caso-028") || baseP2[0];
    const dupP2: ArchiveItem = {
      ...itemToDupP2,
      id: `${itemToDupP2.id}-alt`,
      imageUrl: "/archive/case-028-1.jpg",
      thumbnailUrl: "/archive/case-028-1.jpg",
    };
    const p2Items = [...baseP2, dupP2];

    // Station 3: 25 items (Casi 052 - 076) + 1 duplicate with alternate cover photo
    const baseP3 = displayItems.slice(51, 76);
    const itemToDupP3 = baseP3.find((it) => it.id === "caso-053") || baseP3[0];
    const dupP3: ArchiveItem = {
      ...itemToDupP3,
      id: `${itemToDupP3.id}-alt`,
      imageUrl: "/archive/case-053-1.jpg",
      thumbnailUrl: "/archive/case-053-1.jpg",
    };
    const p3Items = [...baseP3, dupP3];

    return {
      portion1: packMockupPortion(p1Items, S1_SLOTS, ratiosMap, 1.92),
      portion2: packMockupPortion(p2Items, S1_SLOTS, ratiosMap, 1.92),
      portion3: packMockupPortion(p3Items, S1_SLOTS, ratiosMap, 1.92),
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
    portion1: packDynamicBento(p1Items, ratiosMap),
    portion2: packDynamicBento(p2Items, ratiosMap),
    portion3: packDynamicBento(p3Items, ratiosMap),
  };
}

interface MacroTileProps {
  item: ArchiveItem;
  isActive: boolean;
  isHovered: boolean;
  isFilterOpen: boolean;
  placement: PortionPlacement;
  isMockupLayout: boolean;
  isClone?: boolean;
  onSelect: (item: ArchiveItem) => void;
  onHover: (item: ArchiveItem | null) => void;
}

const MacroTile = React.memo(function MacroTile({
  item,
  isActive,
  isHovered,
  isFilterOpen,
  placement,
  isMockupLayout,
  isClone = false,
  onSelect,
  onHover,
}: MacroTileProps) {
  // Track pointer down coordinate to distinguish drag from tap
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);

  const style: React.CSSProperties = isMockupLayout
    ? {
        position: "absolute",
        left: `${placement.x}%`,
        top: `${placement.y}%`,
        width: `${placement.w}%`,
        height: `${placement.h}%`,
      }
    : {
        gridRow: `${placement.row} / span ${placement.rowSpan}`,
        gridColumn: `${placement.col} / span ${placement.colSpan}`,
      };

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
      style={style}
      className={`pointer-events-auto min-h-0 min-w-0 select-none group ${
        isMockupLayout ? "" : "w-full h-full relative"
      } ${isHovered ? "z-30" : "z-10"}`}
    >
      <motion.div
        layoutId={isClone ? undefined : `item-media-${item.id}`}
        animate={{
          scale: isHovered ? 1.025 : 1,
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full h-full relative overflow-hidden transition-shadow duration-200 cursor-pointer flex items-center justify-center ${
          isHovered
            ? "shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
            : "shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        }`}
      >
        {/* 1. PHOTO - edge-to-edge, NO box/frame around photo, NO border */}
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

        {/* 2. AUDIO - subtle neutral card, NO border */}
        {item.type === "audio" && (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#EAEAE6]">
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

        {/* 3. TEXT / ESSAY - subtle neutral card, NO border */}
        {item.type === "text" && (
          <div className="w-full h-full p-2.5 flex flex-col justify-center items-center bg-[#F4F4EE] overflow-hidden text-center select-none">
            <span className="font-mono text-[8px] uppercase tracking-widest text-black/50 mb-0.5">
              <BrandSlashes className="mr-1.5" />
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
            CASO <BrandSlashes count={1} className="mx-1" /> {item.number}
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

  // Measure copy height with ResizeObserver:
  // For mockup percentage layout: height = containerWidth * aspectHeightRatio (~1.80)
  // For CSS grid layout: height = copyEl.clientHeight
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const update = () => {
      if (portion.isMockupLayout) {
        const w = containerEl.clientWidth;
        if (w > 0) {
          const mult = portion.aspectHeightRatio || 1.80;
          const h = Math.round(w * mult);
          if (h > 0 && h !== copyHeightRef.current) {
            copyHeightRef.current = h;
            setCopyHeight(h);
          }
        }
      } else {
        const copyEl = copyRef.current;
        if (copyEl) {
          const h = copyEl.clientHeight;
          if (h > 0 && h !== copyHeightRef.current) {
            copyHeightRef.current = h;
            setCopyHeight(h);
          }
        }
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerEl);
    if (copyRef.current) ro.observe(copyRef.current);
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
    return portion.placements.map((p, idx) => {
      const isHovered = !isThisModalOpen && hoveredTileItem?.id === p.item.id;
      return (
        <MacroTile
          key={`c${copyIdx}-${p.item.id}-${idx}`}
          item={p.item}
          isActive={
            activeItemId === p.item.id ||
            Boolean(activeItemId && activeItemId === p.item.id.replace("-alt", ""))
          }
          isHovered={isHovered}
          isFilterOpen={isFilterOpen}
          placement={p}
          isMockupLayout={portion.isMockupLayout}
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
        {portion.isMockupLayout ? (
          <>
            {/* Copy 0: clone above */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: `${copyHeight}px`,
                flexShrink: 0,
              }}
            >
              {renderTilesCopy(0)}
            </div>

            {/* Copy 1: original center */}
            <div
              ref={copyRef}
              style={{
                position: "relative",
                width: "100%",
                height: `${copyHeight}px`,
                flexShrink: 0,
              }}
            >
              {renderTilesCopy(1)}
            </div>

            {/* Copy 2: clone below */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: `${copyHeight}px`,
                flexShrink: 0,
              }}
            >
              {renderTilesCopy(2)}
            </div>
          </>
        ) : (
          <>
            {/* Dynamic Bento CSS Grid for filtered mode */}
            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: `repeat(${portion.cols || 6}, minmax(0, 1fr))`,
                gridTemplateRows: portion.rowTemplate,
                gap: "16px",
                flexShrink: 0,
              }}
              className="items-stretch justify-items-stretch relative min-h-0 min-w-0"
            >
              {renderTilesCopy(0)}
            </div>

            <div
              ref={copyRef}
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: `repeat(${portion.cols || 6}, minmax(0, 1fr))`,
                gridTemplateRows: portion.rowTemplate,
                gap: "16px",
                flexShrink: 0,
              }}
              className="items-stretch justify-items-stretch relative min-h-0 min-w-0"
            >
              {renderTilesCopy(1)}
            </div>

            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: `repeat(${portion.cols || 6}, minmax(0, 1fr))`,
                gridTemplateRows: portion.rowTemplate,
                gap: "16px",
                flexShrink: 0,
              }}
              className="items-stretch justify-items-stretch relative min-h-0 min-w-0"
            >
              {renderTilesCopy(2)}
            </div>
          </>
        )}
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
    const cleanTargetId = modalTargetItem.id.replace("-alt", "");
    const idxInP1 = portion1.placements.findIndex((p) => p.item.id.replace("-alt", "") === cleanTargetId);
    const idxInP2 = portion2.placements.findIndex((p) => p.item.id.replace("-alt", "") === cleanTargetId);
    const idxInP3 = portion3.placements.findIndex((p) => p.item.id.replace("-alt", "") === cleanTargetId);

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
      <div className="absolute top-3 right-6 z-20 text-black pointer-events-none">
        <BrandSlashCluster />
      </div>
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
                const cleanItem = displayItems.find((it) => it.id === item.id.replace("-alt", "")) || item;
                setStationModals((prev) => ({ ...prev, 1: cleanItem }));
                setHoveredTileItem(null);
                onSelectItem(cleanItem);
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
                const cleanItem = displayItems.find((it) => it.id === item.id.replace("-alt", "")) || item;
                setStationModals((prev) => ({ ...prev, 2: cleanItem }));
                setHoveredTileItem(null);
                onSelectItem(cleanItem);
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
                const cleanItem = displayItems.find((it) => it.id === item.id.replace("-alt", "")) || item;
                setStationModals((prev) => ({ ...prev, 3: cleanItem }));
                setHoveredTileItem(null);
                onSelectItem(cleanItem);
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
