"use client";

import { useEffect, useRef, useState } from "react";
import { ArchiveItem, ARCHIVE_ASPECT_RATIOS } from "@/data/archiveData";

interface OltreCaseGridProps {
  items: ArchiveItem[];
  selectedId: string;
  onSelect: (item: ArchiveItem) => void;
}

export function OltreCaseGrid({ items, selectedId, onSelect }: OltreCaseGridProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cycleHeight = useRef(0);
  const [columns, setColumns] = useState(3);
  const [looping, setLooping] = useState(false);
  const lastInteraction = useRef(0);
  const paused = useRef(false);
  const dragging = useRef(false);
  const moved = useRef(false);
  const pointerY = useRef(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const copy = copyRef.current;
    if (!viewport || !copy) return;
    const observer = new ResizeObserver(() => {
      setColumns(Math.max(1, Math.min(4, Math.floor((viewport.clientWidth + 8) / 88))));
      cycleHeight.current = copy.offsetHeight + 8;
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
    <div
      ref={viewportRef}
      role="region"
      aria-label="Casi studio della narrazione"
      className="h-full min-h-0 overflow-y-auto overscroll-contain no-scrollbar touch-pan-y cursor-grab active:cursor-grabbing"
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
      <div className="flex flex-col gap-2">
        {(looping ? [0, 1, 2] : [0]).map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? copyRef : undefined}
            aria-hidden={looping && copy !== 1 ? true : undefined}
            className="grid gap-2 shrink-0"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gridAutoRows: "64px",
              gridAutoFlow: "dense",
            }}
          >
            {items.map((item) => {
              const ratio = ARCHIVE_ASPECT_RATIOS[item.id]?.ratio || item.aspectRatio || 1;
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
                    gridColumn: ratio >= 1.35 && columns >= 3 ? "span 2" : undefined,
                    gridRow: ratio < 0.95 ? "span 2" : undefined,
                  }}
                  className={`group relative min-w-0 min-h-0 overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black hover:bg-white/30 ${
                    item.id === selectedId ? "ring-2 ring-inset ring-black bg-black/5" : ""
                  }`}
                >
                  {image ? (
                    <img src={image} alt={item.title} draggable={false} loading="lazy" className="w-full h-full object-contain p-1" />
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
    </div>
  );
}
