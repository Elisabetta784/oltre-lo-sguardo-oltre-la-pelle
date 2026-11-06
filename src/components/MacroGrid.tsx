"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { ArchiveItem } from "@/data/archiveData";

interface MacroGridProps {
  items: ArchiveItem[];
  activeItemId: string;
  zoomLevel: number; // 0 (0% full overview) to 1 (100% tiles touching)
  onZoomChange: (newZoom: number) => void;
  onSelectItem: (item: ArchiveItem) => void;
  isFilterOpen?: boolean;
  onCloseFilter?: () => void;
  onGoToBeyond?: () => void;
}

// Exactly 4 rows x 12 columns = 48 tiles matching Layout.png and zoom.mov
const COLS = 12;
const ROWS = 4;

/**
 * Computes deterministic, collision-free grid positions for both the full 177-item overview and filtered states.
 * - When totalCount > 100 (unfiltered overview of all 177 cases): uses 18 columns x 10 rows.
 * - When totalCount > 48 (partially filtered): uses 14 columns x rows.
 * - When totalCount <= 48 (filtered): uses 12 columns x 4 rows in a space-filling scattered 2D layout.
 */
function getGridConfig(totalCount: number) {
  if (totalCount > 100) {
    const cols = 18;
    const rows = Math.ceil(totalCount / cols);
    const positions: { row: number; col: number }[] = [];
    for (let i = 0; i < totalCount; i++) {
      positions.push({
        row: Math.floor(i / cols) + 1,
        col: (i % cols) + 1,
      });
    }
    return {
      cols,
      rows,
      positions,
      baseTilePx: 28,
      maxTilePx: 72,
      isDense: true,
    };
  }

  if (totalCount > 48) {
    const cols = 14;
    const rows = Math.ceil(totalCount / cols);
    const positions: { row: number; col: number }[] = [];
    for (let i = 0; i < totalCount; i++) {
      positions.push({
        row: Math.floor(i / cols) + 1,
        col: (i % cols) + 1,
      });
    }
    return {
      cols,
      rows,
      positions,
      baseTilePx: 35,
      maxTilePx: 94,
      isDense: true,
    };
  }

  // Scattered 4x12 layout for filtered items
  const cols = 12;
  const rows = 4;
  if (totalCount === 1) {
    return {
      cols,
      rows,
      positions: [{ row: 2, col: 6 }],
      baseTilePx: 68,
      maxTilePx: 130,
      isDense: false,
    };
  }
  if (totalCount === 2) {
    return {
      cols,
      rows,
      positions: [
        { row: 2, col: 5 },
        { row: 3, col: 8 },
      ],
      baseTilePx: 68,
      maxTilePx: 130,
      isDense: false,
    };
  }
  if (totalCount === 3) {
    return {
      cols,
      rows,
      positions: [
        { row: 2, col: 4 },
        { row: 1, col: 7 },
        { row: 3, col: 9 },
      ],
      baseTilePx: 68,
      maxTilePx: 130,
      isDense: false,
    };
  }

  const itemsByRow: number[][] = [[], [], [], []];
  for (let i = 0; i < totalCount; i++) {
    itemsByRow[i % rows].push(i);
  }

  const positions: { row: number; col: number }[] = new Array(totalCount);
  const rowOffsets = [0, 1, -1, 1];

  for (let r = 0; r < rows; r++) {
    const rowIndices = itemsByRow[r];
    const count = rowIndices.length;
    if (count === 0) continue;

    const offset = rowOffsets[r];
    const step = cols / (count + 1);

    const rowCols: number[] = [];
    for (let c = 0; c < count; c++) {
      let idealCol = Math.round((c + 1) * step + offset);
      idealCol = Math.max(1, Math.min(cols, idealCol));
      if (c > 0 && idealCol <= rowCols[c - 1]) {
        idealCol = rowCols[c - 1] + 1;
      }
      rowCols.push(idealCol);
    }
    for (let c = count - 1; c >= 0; c--) {
      if (rowCols[c] > cols) rowCols[c] = cols;
      if (c < count - 1 && rowCols[c] >= rowCols[c + 1]) rowCols[c] = rowCols[c + 1] - 1;
    }

    rowIndices.forEach((itemIdx, c) => {
      positions[itemIdx] = {
        row: r + 1,
        col: Math.max(1, rowCols[c]),
      };
    });
  }

  return {
    cols,
    rows,
    positions,
    baseTilePx: 64,
    maxTilePx: 130,
    isDense: false,
  };
}

interface MacroTileProps {
  item: ArchiveItem;
  isActive: boolean;
  row: number;
  col: number;
  onSelect: (item: ArchiveItem) => void;
}

const MacroTile = React.memo(function MacroTile({
  item,
  isActive,
  row,
  col,
  onSelect,
}: MacroTileProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
      style={{
        gridRow: row,
        gridColumn: col,
        width: "var(--tile-size)",
        height: "var(--tile-size)",
      }}
      className="pointer-events-auto flex items-center justify-center cursor-pointer relative group"
    >
      <motion.div
        layoutId={`item-media-${item.id}`}
        whileHover={{ scale: 1.18 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          height: "100%",
        }}
        className={`w-full h-full rounded-none overflow-hidden bg-[#ebe4d1] border transition-colors duration-150 ${
          isActive
            ? "border-[#523719] shadow-md shadow-[#523719]/40 ring-1 ring-[#523719]"
            : "border-[#88562C]/30 group-hover:border-[#523719] group-hover:shadow-lg group-hover:shadow-[#523719]/25"
        }`}
      >
        {/* 1. PHOTO: Using ultra-lightweight WebP/JPEG thumbnail with async decoding */}
        {item.type === "photo" && (
          <img
            src={item.thumbnailUrl || item.imageUrl || ""}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover rounded-none block pointer-events-none"
          />
        )}

        {/* 2. AUDIO */}
        {item.type === "audio" && (
          <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-[#ebe4d1]">
            <div className="flex items-center gap-0.5 h-5 w-full justify-center overflow-hidden">
              {(item.audioWaveform || [40, 70, 90, 50, 80, 100, 60, 40])
                .slice(0, 7)
                .map((h, bIdx) => (
                  <div
                    key={bIdx}
                    style={{ height: `${h * 0.75}%` }}
                    className="w-0.5 sm:w-1 bg-[#88562C] rounded-none"
                  />
                ))}
            </div>
            <Volume2 className="w-3 h-3 text-[#523719] mt-0.5 opacity-75" />
          </div>
        )}

        {/* 3. TEXT / THEORETICAL ESSAY: Single prominent, readable keyword in miniature */}
        {item.type === "text" && (
          <div className="w-full h-full p-1 flex flex-col justify-center items-center bg-[#ede7d5] overflow-hidden text-center select-none border border-[#88562C]/20 group-hover:border-[#523719] transition-colors">
            <span className="font-mono text-[8px] sm:text-[9.5px] font-black text-[#523719] tracking-wider uppercase leading-tight line-clamp-2 px-0.5">
              {item.microKeyword || item.title.split(" ")[0]}
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
  onGoToBeyond,
}: MacroGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Show all matching items
  const displayItems = items;
  const gridConfig = useMemo(
    () => getGridConfig(displayItems.length),
    [displayItems.length]
  );
  const { cols, rows, positions, baseTilePx, maxTilePx, isDense } = gridConfig;

  // Max scale at 100% zoom: magnifies area around cursor so approx 4-6 images fill screen (like zoom.mov)
  const maxScale = isDense ? 5.2 : 3.4;

  // Smooth inertial interpolation for trackpad zoom
  const targetZoomRef = useRef(zoomLevel);
  const currentZoomRef = useRef(zoomLevel);
  const lastTilePxRef = useRef(baseTilePx);
  const rafRef = useRef<number | null>(null);
  const lastReportedZoomRef = useRef(zoomLevel);
  const lastReportTimeRef = useRef(0);

  // Cursor focus anchor: (u, v) normalized to 0..1 within container
  const targetFocusRef = useRef({ u: 0.5, v: 0.5 });
  const currentFocusRef = useRef({ u: 0.5, v: 0.5 });

  // Sync external zoomLevel (e.g. from vertical slider on the right) when not actively zooming
  useEffect(() => {
    targetZoomRef.current = zoomLevel;
  }, [zoomLevel]);

  // Track mouse position over the grid container to anchor zoom
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

  // Smooth 60/120fps RAF lerp loop: computes scale, tile expansion, & cursor-anchored translation on GPU
  useEffect(() => {
    let isRunning = true;

    const animateLoop = () => {
      if (!isRunning) return;

      // 1. Lerp zoom level smoothly
      const zoomDiff = targetZoomRef.current - currentZoomRef.current;
      if (Math.abs(zoomDiff) > 0.0001) {
        currentZoomRef.current += zoomDiff * 0.12;
      } else {
        currentZoomRef.current = targetZoomRef.current;
      }

      // 2. Lerp cursor anchor point smoothly
      const focusXDiff = targetFocusRef.current.u - currentFocusRef.current.u;
      currentFocusRef.current.u += focusXDiff * 0.09;

      const focusYDiff = targetFocusRef.current.v - currentFocusRef.current.v;
      currentFocusRef.current.v += focusYDiff * 0.09;

      const curZoom = currentZoomRef.current;

      // 3. Dual expansion:
      // - zoomProgress goes from 0 (baseline 0.24) to 1 (full zoom 1.0)
      // - curTilePx grows from baseTilePx up to maxTilePx: this fills the cell, meaning the gap between adjacent images contracts!
      // - scale scales the grid up to maxScale: this magnifies the 4-6 tiles around the cursor to fill the viewport!
      // - when dezoomed: tiles shrink back and spread apart across the matrix.
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

      // 4. Compute translation to keep cursor point stationary while scaling
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

        // Translation so that point under cursor stays anchored
        let tx = -dx * (scale - 1);
        let ty = -dy * (scale - 1);

        // Boundary clamping so we don't pan into outer void
        const maxTx = Math.max(0, (W * scale - W) / 2);
        const maxTy = Math.max(0, (H * scale - H) / 2);

        tx = Math.max(-maxTx, Math.min(maxTx, tx));
        ty = Math.max(-maxTy, Math.min(maxTy, ty));

        // Dynamically update --tile-size directly on DOM style (zero React re-renders)
        if (lastTilePxRef.current !== curTilePx) {
          lastTilePxRef.current = curTilePx;
          gridRef.current.style.setProperty("--tile-size", `${curTilePx}px`);
        }

        // Apply hardware-accelerated GPU transform: zero reflow, zero repaint, silky 120fps
        gridRef.current.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0px) scale(${scale.toFixed(4)})`;
      }

      // 5. Throttle reporting zoom to parent (for timeline slider)
      const now = performance.now();
      if (
        now - lastReportTimeRef.current > 40 &&
        Math.abs(curZoom - lastReportedZoomRef.current) > 0.006
      ) {
        lastReportTimeRef.current = now;
        lastReportedZoomRef.current = curZoom;
        onZoomChange(curZoom);
      }

      if (curZoom === targetZoomRef.current && lastReportedZoomRef.current !== targetZoomRef.current) {
        lastReportedZoomRef.current = targetZoomRef.current;
        onZoomChange(targetZoomRef.current);
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

  // Trackpad pinch-to-zoom & two-finger scroll handler
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
        // Pinch gesture on trackpad
        delta = -e.deltaY * 0.0035;
      } else {
        // Two-finger vertical scroll
        delta = -e.deltaY * 0.00075;
      }

      // Check for intentional dezoom into Beyond when already at or near baseline overview:
      // Require a smooth, deliberate dezoom gesture (accumulatedDezoom > 0.065) so it doesn't snap suddenly
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

      // Update cursor anchor at point of scroll/pinch
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
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden flex items-center justify-center select-none bg-[#f5f0e0]"
    >
      {/* Offuscato overlay when filter sidebar is open */}
      {isFilterOpen && (
        <div
          onClick={onCloseFilter}
          className="absolute inset-0 z-10 bg-[#523719]/12 backdrop-blur-[6px] transition-all duration-300 cursor-pointer"
        />
      )}

      {/* Edge overlays matching Layout.png: softly dissolve the outer edges into #f5f0e0 */}
      <div className="fixed top-[52px] left-0 right-0 h-14 edge-fade-top z-20 pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-16 edge-fade-bottom z-20 pointer-events-none" />
      <div className="fixed top-[52px] bottom-0 left-0 w-16 sm:w-28 edge-fade-left z-20 pointer-events-none" />
      <div className="fixed top-[52px] bottom-0 right-14 sm:right-24 w-16 sm:w-28 edge-fade-right z-20 pointer-events-none" />

      {/* Trackpad zoom indicator hint */}
      <div className="fixed bottom-4 left-6 z-20 font-mono text-[10px] text-[#88562C]/70 pointer-events-none hidden sm:block tracking-wider">
        PINCH / SCROLL SUL TRACKPAD PER ZOOMARE E DEZOOMARE
      </div>

      {/* SYMMETRICALLY CENTERED CSS GRID WITH CSS VARIABLE FOR TILE SIZE */}
      <div
        ref={gridRef}
        style={containerStyle}
        className={`relative z-20 w-full h-full max-w-[95vw] max-h-[88vh] p-3 transition-none grid items-center justify-items-center ${
          isFilterOpen
            ? "pl-80 sm:pl-96 lg:pl-[420px] pr-8 sm:pr-12 pointer-events-none"
            : "pl-6 sm:pl-16 pr-16 sm:pr-24 pointer-events-auto"
        }`}
      >
        {displayItems.length === 0 ? (
          <div className="col-span-full row-span-full pointer-events-auto flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#88562C]/40 bg-[#ebe4d1]/70 w-full max-w-md my-auto shadow-md">
            <p className="font-mono text-xs uppercase tracking-wider text-[#523719] font-bold mb-2">
              NESSUN SEGNO CORRISPONDENTE
            </p>
            <p className="font-mono text-[11px] text-[#88562C] max-w-xs">
              Prova a rimuovere o combinare diversamente i filtri selezionati sulla sinistra.
            </p>
          </div>
        ) : (
          displayItems.map((item, idx) => {
            const pos = positions[idx] || { row: 1, col: 1 };
            return (
              <MacroTile
                key={item.id}
                item={item}
                isActive={activeItemId === item.id}
                row={pos.row}
                col={pos.col}
                onSelect={onSelectItem}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
