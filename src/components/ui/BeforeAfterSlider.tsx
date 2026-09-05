'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useAudioSFX } from './AudioSFXProvider';
import { ChevronsLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  description?: string;
  aspectRatio?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Figma Wireframe',
  afterLabel = 'Final In-Game Render',
  description,
  aspectRatio = 'aspect-[16/9]',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playHover, playTab } = useAudioSFX();

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(clamped);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
    playTab();
  };

  const handleTouchStart = () => {
    setIsDragging(true);
    playTab();
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleTouchEnd = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
      playTab();
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
      playTab();
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Interactive Wireframe vs Final UI comparison slider"
        className={`relative w-full ${aspectRatio} rounded-xl overflow-hidden select-none cursor-ew-resize border border-cyan-500/30 shadow-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400`}
      >
        {/* After Image (Background / Full Width) */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url("${afterImage}")` }}
        />

        {/* Before Image (Foreground Clipped) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div
            className="absolute inset-0 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url("${beforeImage}")`,
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw',
            }}
          />
        </div>

        {/* Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.9)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Cyber Handle */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseEnter={playHover}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.7)] pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          >
            <ChevronsLeftRight className="w-4 h-4 text-cyan-300 animate-pulse" />
          </div>
        </div>

        {/* Badges / Labels */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="px-3 py-1 rounded bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 text-xs font-mono font-bold tracking-wider uppercase">
            {beforeLabel}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <span className="px-3 py-1 rounded bg-cyan-950/80 backdrop-blur-md border border-cyan-400/80 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            {afterLabel}
          </span>
        </div>
      </div>

      {/* Description text */}
      {description && (
        <p className="mt-3 text-xs sm:text-sm font-mono text-slate-400 text-center max-w-2xl">
          <span className="text-cyan-400 font-bold mr-1">✦ PRO-TIP:</span>
          {description} (Drag slider or use ← / → keys)
        </p>
      )}
    </div>
  );
}
