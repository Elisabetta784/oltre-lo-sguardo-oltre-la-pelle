"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

interface AudioPlayerSnippetProps {
  duration?: string;
  waveform?: number[];
  title?: string;
  compact?: boolean;
}

export function AudioPlayerSnippet({
  duration = "01:30",
  waveform = [30, 50, 80, 40, 90, 60, 45, 75, 100, 60, 40, 70, 85, 30, 50],
  title,
  compact = false,
}: AudioPlayerSnippetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Soft synthetic organic ambient sound generator
  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      osc.type = "sine";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(148, ctx.currentTime + 1.5);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch {
      // AudioContext unavailable
    }
  };

  const stopAudio = () => {
    if (gainRef.current && audioCtxRef.current) {
      try {
        gainRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioCtxRef.current.currentTime + 0.2
        );
        setTimeout(() => {
          oscRef.current?.stop();
          audioCtxRef.current?.close();
        }, 220);
      } catch {
        // ignore
      }
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      startAudio();
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            stopAudio();
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`flex items-center gap-3 bg-black/[0.04] border border-black/20 rounded-none px-3 select-none ${
        compact ? "py-1.5" : "py-2.5"
      }`}
    >
      <button
        type="button"
        onClick={togglePlay}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-none bg-black hover:bg-black/85 text-[#F8F8F6] flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer shadow-sm"
        title={isPlaying ? "Pausa registrazione" : "Ascolta traccia vocale"}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform graphic */}
      <div className="flex-1 flex items-center gap-0.5 sm:gap-1 h-6 sm:h-8 overflow-hidden">
        {waveform.map((height, i) => {
          const barProgress = (i / waveform.length) * 100;
          const isPassed = barProgress <= progress;
          return (
            <div
              key={i}
              style={{
                height: `${Math.max(15, height * (isPlaying ? 0.7 + Math.random() * 0.4 : 0.8))}%`,
              }}
              className={`w-1 sm:w-1.5 rounded-none transition-all duration-150 ${
                isPassed
                  ? "bg-black"
                  : isPlaying
                  ? "bg-black/60"
                  : "bg-black/25"
              }`}
            />
          );
        })}
      </div>

      {/* Duration / Status */}
      <div className="text-[10px] sm:text-xs font-body text-black/60 flex items-center gap-1.5 flex-shrink-0">
        <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? "animate-pulse text-black" : ""}`} />
        <span>{isPlaying ? `${Math.round(progress)}%` : duration}</span>
      </div>
    </div>
  );
}
