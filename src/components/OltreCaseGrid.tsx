"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArchiveItem, ARCHIVE_ASPECT_RATIOS } from "@/data/archiveData";

interface OltreCaseGridProps {
  items: ArchiveItem[];
  selectedId: string;
  onSelect: (item: ArchiveItem) => void;
}

// Balance complete rows instead of leaving unused cells around portrait images.
function packRows(ratios: number[], width: number): number[][] {
  const costs = Array(ratios.length + 1).fill(Infinity);
  const previous = Array(ratios.length + 1).fill(0);
  costs[0] = 0;
  for (let end = 1; end <= ratios.length; end++) {
    let totalRatio = 0;
    for (let start = end - 1; start >= Math.max(0, end - 6); start--) {
      totalRatio += ratios[start];
      const height = (width - (end - start - 1) * 4) / totalRatio;
      if (height <= 0) continue;
      const cost = costs[start] + (height - 90) ** 2;
      if (cost < costs[end]) {
        costs[end] = cost;
        previous[end] = start;
      }
    }
  }
  const rows: number[][] = [];
  for (let end = ratios.length; end > 0;) {
    const start = previous[end];
    rows.unshift(Array.from({ length: end - start }, (_, index) => start + index));
    end = start;
  }
  return rows;
}

export function OltreCaseGrid({ items, selectedId, onSelect }: OltreCaseGridProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cycleHeight = useRef(0);
  const [width, setWidth] = useState(280);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [looping, setLooping] = useState(false);
  const lastInteraction = useRef(0);
  const paused = useRef(false);
  const dragging = useRef(false);
  const moved = useRef(false);
  const pointerY = useRef(0);
  const ratios = useMemo(() => items.map((item) =>
    ARCHIVE_ASPECT_RATIOS[item.id]?.ratio || item.aspectRatio || 1
  ), [items]);
  const rows = useMemo(() => packRows(ratios, width), [ratios, width]);
  const rowHeights = rows.map((row) =>
    (width - (row.length - 1) * 4) / row.reduce((sum, index) => sum + ratios[index], 0)
  );
  const contentHeight = rowHeights.reduce((sum, height) => sum + height, 0);
  // If everything fits, spread the rows across the full viewport instead of leaving a blank bottom.
  const rowScale = contentHeight > 0
    ? Math.max(1, (viewportHeight - Math.max(0, rows.length - 1) * 4) / contentHeight)
    : 1;

  useEffect(() => {
    const viewport = viewportRef.current;
    const copy = copyRef.current;
    if (!viewport || !copy) return;
    const observer = new ResizeObserver(() => {
      setWidth(Math.max(1, viewport.clientWidth));
      setViewportHeight(viewport.clientHeight);
      cycleHeight.current = copy.offsetHeight + 4;
      setLooping(copy.offsetHeight > viewport.clientHeight + 1);
    });
    observer.observe(viewport);
    observer.observe(copy);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = looping ? cycleHeight.current : 0;
    }
    lastInteraction.current = performance.now();
  }, [looping]);

  useEffect(() => {
    if (!looping || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let previous = performance.now();
    let drift = 0;
    const tick = (now: number) => {
      const elapsed = Math.min(now - previous, 50);
      previous = now;
      if (!paused.current && !dragging.current && now - lastInteraction.current > 4000) {
        drift += elapsed * 0.012;
        const pixels = Math.floor(drift);
        if (pixels > 0) {
          viewportRef.current?.scrollBy(0, pixels);
          drift -= pixels;
        }
      } else {
        drift = 0;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [looping]);

  return (
    <div className="h-full min-h-0 flex flex-col gap-2">
      <div
        ref={viewportRef}
        role="region"
        aria-label="Casi studio della narrazione"
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar touch-pan-y cursor-grab active:cursor-grabbing"
        onScroll={(event) => {
          event.stopPropagation();
          if (!looping || !cycleHeight.current) return;
          const viewport = event.currentTarget;
          const cycle = cycleHeight.current;
          if (viewport.scrollTop < cycle || viewport.scrollTop >= cycle * 2) {
            viewport.scrollTop = cycle + ((viewport.scrollTop % cycle) + cycle) % cycle;
          }
        }}
        onWheel={(event) => {
          event.stopPropagation();
          lastInteraction.current = performance.now();
        }}
        onPointerEnter={() => { paused.current = true; }}
        onPointerLeave={() => {
          paused.current = false;
          dragging.current = false;
          lastInteraction.current = performance.now();
        }}
        onFocusCapture={() => { paused.current = true; }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            paused.current = false;
            lastInteraction.current = performance.now();
          }
        }}
        onPointerDown={(event) => {
          lastInteraction.current = performance.now();
          moved.current = false;
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          dragging.current = true;
          pointerY.current = event.clientY;
        }}
        onPointerMove={(event) => {
          if (!dragging.current) return;
          const delta = pointerY.current - event.clientY;
          if (!moved.current && Math.abs(delta) < 6) return;
          moved.current = true;
          pointerY.current = event.clientY;
          event.currentTarget.scrollTop += delta;
        }}
        onPointerUp={() => {
          dragging.current = false;
          lastInteraction.current = performance.now();
        }}
        onPointerCancel={() => { dragging.current = false; }}
        onClickCapture={(event) => {
          if (moved.current) {
            event.preventDefault();
            event.stopPropagation();
            moved.current = false;
          }
        }}
      >
        <div className="flex flex-col gap-1">
          {(looping ? [0, 1, 2] : [0]).map((copy) => (
            <div
              key={copy}
              ref={copy === 0 ? copyRef : undefined}
              aria-hidden={looping && copy !== 1 ? true : undefined}
              className="flex flex-col gap-1 shrink-0"
            >
              {rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex gap-1"
                  style={{ height: rowHeights[rowIndex] * rowScale }}
                >
                  {row.map((index) => {
                    const item = items[index];
                    const image = item.imageUrl || item.thumbnailUrl || item.galleryUrls?.[0];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        tabIndex={looping && copy !== 1 ? -1 : 0}
                        onClick={() => onSelect(item)}
                        title={`${item.number} — ${item.title} (${item.authorOrSubject})`}
                        aria-label={`Caso ${item.number}: ${item.title}`}
                        style={{
                          flex: `${ratios[index]} 1 0%`,
                        }}
                        className={`group relative min-w-0 min-h-0 overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black hover:bg-white/30 ${
                          item.id === selectedId ? "ring-2 ring-inset ring-black bg-black/5" : ""
                        }`}
                      >
                        {image ? (
                          <img src={image} alt={item.title} draggable={false} loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] font-mono">{item.number}</span>
                        )}
                        <span className="absolute top-1 left-1 px-1 bg-black/75 text-white text-[7px] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                          {item.number}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
