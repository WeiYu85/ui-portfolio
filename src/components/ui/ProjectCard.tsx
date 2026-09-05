'use client';

import React, { useState } from 'react';
import { CardTilt3D } from '@/components/3d/CardTilt3D';
import { useAudioSFX } from './AudioSFXProvider';
import { Project } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Monitor,
  Smartphone,
  Gamepad2,
  TabletSmartphone,
  Glasses,
  Layers,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onOpenLightbox?: (images: string[], initialIndex: number, title: string) => void;
}

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  'PC / Desktop': <Monitor className="w-3.5 h-3.5" />,
  'Console (PS5 / Xbox)': <Gamepad2 className="w-3.5 h-3.5" />,
  'Mobile (iOS / Android)': <Smartphone className="w-3.5 h-3.5" />,
  'Handheld / Steam Deck': <TabletSmartphone className="w-3.5 h-3.5" />,
  'VR / AR': <Glasses className="w-3.5 h-3.5" />,
};

const DEVICE_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  'PC / Desktop': {
    bg: 'bg-cyan-950/70',
    text: 'text-cyan-300',
    border: 'border-cyan-500/50',
    glow: 'shadow-[0_0_12px_rgba(0,240,255,0.3)]',
  },
  'Console (PS5 / Xbox)': {
    bg: 'bg-blue-950/70',
    text: 'text-blue-300',
    border: 'border-blue-500/50',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]',
  },
  'Mobile (iOS / Android)': {
    bg: 'bg-fuchsia-950/70',
    text: 'text-fuchsia-300',
    border: 'border-fuchsia-500/50',
    glow: 'shadow-[0_0_12px_rgba(217,70,239,0.3)]',
  },
  'Handheld / Steam Deck': {
    bg: 'bg-emerald-950/70',
    text: 'text-emerald-300',
    border: 'border-emerald-500/50',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
  },
  'VR / AR': {
    bg: 'bg-purple-950/70',
    text: 'text-purple-300',
    border: 'border-purple-500/50',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.3)]',
  },
};

export function ProjectCard({ project, onOpenLightbox }: ProjectCardProps) {
  const { playHover, playTab, playOpen } = useAudioSFX();

  const allImages =
    project.images && project.images.length > 0
      ? project.images
      : [project.heroImage || project.thumbnailImage || ''];

  const [currentIdx, setCurrentIdx] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTab();
    setCurrentIdx((p) => (p > 0 ? p - 1 : allImages.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTab();
    setCurrentIdx((p) => (p < allImages.length - 1 ? p + 1 : 0));
  };

  const handleDot = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    playTab();
    setCurrentIdx(idx);
  };

  const handleExpand = () => {
    if (onOpenLightbox) {
      playOpen();
      onOpenLightbox(allImages, currentIdx, project.title);
    }
  };

  const devTheme =
    DEVICE_COLORS[project.device] || {
      bg: 'bg-slate-900/80',
      text: 'text-slate-300',
      border: 'border-slate-700/60',
      glow: '',
    };
  const devIcon = DEVICE_ICONS[project.device] || <Monitor className="w-3.5 h-3.5" />;

  return (
    <CardTilt3D maxTilt={7} scale={1.01} className="h-full">
      {/* Less rounded tactical corners (rounded-sm) matching the cyber corner crosshairs */}
      <div className="h-full flex flex-col rounded-sm overflow-hidden glass-panel border border-cyan-500/25 hover:border-cyan-400/80 transition-all duration-300 group shadow-[0_10px_35px_rgba(0,0,0,0.6)] relative">
        
        {/* Precise Cyber Corner Brackets */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/70 group-hover:border-cyan-300 transition-colors z-20 pointer-events-none" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/70 group-hover:border-cyan-300 transition-colors z-20 pointer-events-none" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/70 group-hover:border-cyan-300 transition-colors z-20 pointer-events-none" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/70 group-hover:border-cyan-300 transition-colors z-20 pointer-events-none" />

        {/* Multi-Image Showcase Area */}
        <div
          onClick={handleExpand}
          className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 cursor-pointer select-none group/img"
          title="Click to view full-resolution frame"
        >
          <img
            src={allImages[currentIdx]}
            alt={`${project.title} — Frame ${currentIdx + 1}`}
            className="w-full h-full object-cover transition-all duration-500 group-hover/img:scale-105"
            loading="lazy"
          />

          {/* Holographic Scanline Overlay */}
          <div className="absolute inset-0 hud-scanlines opacity-25 pointer-events-none" />

          {/* Device Target Badge (Top Left) */}
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${devTheme.bg} ${devTheme.text} ${devTheme.border} ${devTheme.glow}`}
            >
              {devIcon}
              <span>{project.device}</span>
            </span>
          </div>

          {/* Controls Badge Group (Top Right): Frame Counter + Fullscreen Lightbox */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            {allImages.length > 1 && (
              <span className="px-2 py-0.5 rounded-sm bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 shadow-md">
                FRAME {currentIdx + 1} / {allImages.length}
              </span>
            )}

            {/* Fullscreen Expand */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleExpand();
              }}
              onMouseEnter={playHover}
              className="p-1.5 rounded-sm bg-slate-950/80 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-400 backdrop-blur-md transition-colors"
              title="Expand High-Resolution Lightbox"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Prev / Next Carousel Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                onMouseEnter={playHover}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-sm bg-slate-950/90 hover:bg-cyan-400 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-cyan-300 flex items-center justify-center transition-all opacity-70 hover:opacity-100 shadow-xl"
                aria-label="Previous frame"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                onMouseEnter={playHover}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-sm bg-slate-950/90 hover:bg-cyan-400 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-cyan-300 flex items-center justify-center transition-all opacity-70 hover:opacity-100 shadow-xl"
                aria-label="Next frame"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Bottom Multi-Image Pagination Dots (● ● ●) */}
              <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-2xl">
                  {allImages.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={(e) => handleDot(dotIdx, e)}
                      onMouseEnter={playHover}
                      className={`transition-all ${
                        dotIdx === currentIdx
                          ? 'w-6 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.9)]'
                          : 'w-2 h-2 rounded-full bg-slate-600 hover:bg-slate-300'
                      }`}
                      aria-label={`Switch to frame ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Card Content Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div>
            {/* Title & Subtitle */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xl font-bold font-sans text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                {project.title}
              </h3>
              <span className="text-[10px] font-mono text-cyan-400/80 font-bold px-1.5 py-0.5 rounded-sm bg-cyan-950/60 border border-cyan-500/30 shrink-0">
                16:9
              </span>
            </div>

            <p className="text-xs font-mono text-cyan-400/90 mt-1 line-clamp-1">
              {project.subtitle}
            </p>

            {/* Overview / Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-3 line-clamp-3">
              {project.overview}
            </p>
          </div>

          {/* Quick Frame Switcher Pills (Visible if multiple frames) */}
          {allImages.length > 1 && (
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-400" />
                FRAMES:
              </span>
              <div className="flex items-center gap-1.5">
                {allImages.map((_, pillIdx) => (
                  <button
                    key={pillIdx}
                    type="button"
                    onClick={(e) => handleDot(pillIdx, e)}
                    onMouseEnter={playHover}
                    className={`px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold transition-all border ${
                      currentIdx === pillIdx
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    0{pillIdx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CardTilt3D>
  );
}
