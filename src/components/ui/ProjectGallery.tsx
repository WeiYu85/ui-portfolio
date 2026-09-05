'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Project } from '@/types';
import { ProjectCard } from './ProjectCard';
import { useAudioSFX } from './AudioSFXProvider';
import {
  Search,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  Monitor,
  Gamepad2,
  Smartphone,
  TabletSmartphone,
  Glasses
} from 'lucide-react';

interface ProjectGalleryProps {
  initialProjects: Project[];
}

const DEVICE_FILTERS = [
  { id: 'all', label: 'ALL PLATFORMS', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'PC / Desktop', label: 'PC / DESKTOP', icon: <Monitor className="w-3.5 h-3.5" /> },
  { id: 'Console (PS5 / Xbox)', label: 'CONSOLE', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
  { id: 'Mobile (iOS / Android)', label: 'MOBILE TOUCH', icon: <Smartphone className="w-3.5 h-3.5" /> },
  { id: 'Handheld / Steam Deck', label: 'STEAM DECK', icon: <TabletSmartphone className="w-3.5 h-3.5" /> },
  { id: 'VR / AR', label: 'VR / AR', icon: <Glasses className="w-3.5 h-3.5" /> },
];

export function ProjectGallery({ initialProjects }: ProjectGalleryProps) {
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fullscreen Lightbox
  const [lightbox, setLightbox] = useState<{
    open: boolean;
    images: string[];
    idx: number;
    title: string;
  }>({ open: false, images: [], idx: 0, title: '' });

  const { playHover, playTab, playClose } = useAudioSFX();

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox.open) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        lbPrev();
      } else if (e.key === 'ArrowRight') {
        lbNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.open, lightbox.images.length]);

  const filtered = useMemo(() => {
    return initialProjects.filter((p) => {
      const matchDevice = selectedDevice === 'all' || p.device === selectedDevice;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.overview.toLowerCase().includes(q) ||
        p.device.toLowerCase().includes(q);
      return matchDevice && matchSearch;
    });
  }, [initialProjects, selectedDevice, searchQuery]);

  // Counts per device
  const deviceCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialProjects.length };
    initialProjects.forEach((p) => {
      counts[p.device] = (counts[p.device] || 0) + 1;
    });
    return counts;
  }, [initialProjects]);

  const openLightbox = (images: string[], initialIndex: number, title: string) =>
    setLightbox({ open: true, images, idx: initialIndex, title });

  const closeLightbox = () => {
    playClose();
    setLightbox((p) => ({ ...p, open: false }));
  };

  const lbPrev = () => {
    playTab();
    setLightbox((p) => ({ ...p, idx: (p.idx - 1 + p.images.length) % p.images.length }));
  };
  const lbNext = () => {
    playTab();
    setLightbox((p) => ({ ...p, idx: (p.idx + 1) % p.images.length }));
  };

  return (
    <section id="work" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* Visual Depth Elements in Background */}
      <div className="absolute -top-12 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[450px] h-[450px] rounded-full bg-indigo-600/[0.05] blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.03] blur-[100px] pointer-events-none" />

      {/* Decorative Technical HUD Border Markings */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between text-[9px] font-mono text-cyan-500/40 pointer-events-none select-none">
        <span>// SEC-01.WORK_ARCHIVE</span>
        <span className="hidden sm:inline">COORD: [34.05° N, 118.24° W]</span>
        <span>RESOLUTION: 4K UHD // FLUID</span>
      </div>

      {/* Section Header with Tactical HUD Aesthetics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-slate-800 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2">
            <Layers className="w-4 h-4" />
            <span>01 // INTERFACE SHOWCASE & FRAMES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans uppercase">
            GAME UI REPERTOIRE
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-mono mt-1.5 max-w-2xl">
            Explore a selection of my in-game HUDs and multi-frame interface designs, organized by platform. This collection highlights some of my work, but there’s more to explore. Join my Discord to see additional projects and designs.
          </p>
        </div>

        {/* Search Bar (Safe-zone button removed as requested) */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, platform..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
            >
              ESC
            </button>
          )}
        </div>
      </div>

      {/* High-Tech Segmented Device Filter Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 custom-scrollbar relative z-10">
        {DEVICE_FILTERS.map((f) => {
          const isSelected = selectedDevice === f.id;
          const count = deviceCounts[f.id] || 0;
          return (
            <button
              key={f.id}
              type="button"
              onMouseEnter={playHover}
              onClick={() => {
                playTab();
                setSelectedDevice(f.id);
              }}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {f.icon}
              <span>{f.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Telemetry Status Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>
            SHOWING <strong className="text-cyan-300 font-bold">{filtered.length}</strong> / {initialProjects.length} PORTFOLIO PIECES
          </span>
        </div>
        <span className="hidden sm:inline text-slate-500 text-[11px]">
          TIP: USE THE DOTS (● ● ●) OR ARROWS ON CARDS TO BROWSE MULTI-IMAGE FRAMES
        </span>
      </div>

      {/* Grid of Projects */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenLightbox={openLightbox}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 rounded-lg border border-dashed border-slate-800 bg-slate-950/40 space-y-3 relative z-10">
          <p className="text-sm font-mono text-slate-400">NO INTERFACES MATCH THE CHOSEN PLATFORM FILTER</p>
          <button
            type="button"
            onClick={() => {
              setSelectedDevice('all');
              setSearchQuery('');
            }}
            className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
          >
            Reset platform filters
          </button>
        </div>
      )}

      {/* High-Resolution Fullscreen Lightbox Modal */}
      {lightbox.open && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/94 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6"
        >
          {/* Lightbox Top Header */}
          <div
            className="w-full max-w-6xl flex items-center justify-between z-10 bg-slate-950/80 p-3 rounded-lg border border-cyan-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                {lightbox.title}
              </span>
              {lightbox.images.length > 1 && (
                <span className="px-2.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/40 text-xs font-mono text-cyan-300 font-bold">
                  FRAME {lightbox.idx + 1} OF {lightbox.images.length}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 transition-colors cursor-pointer"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Center Image Viewport */}
          <div
            className="relative flex-1 w-full max-w-6xl flex items-center justify-center my-4 overflow-hidden rounded-lg border border-cyan-500/30 bg-[#040713]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.images[lightbox.idx]}
              alt={lightbox.title}
              className="max-h-[76vh] w-auto max-w-full object-contain rounded-lg select-none shadow-2xl"
            />

            {/* Left / Right Lightbox Arrows */}
            {lightbox.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={lbPrev}
                  onMouseEnter={playHover}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-950/90 hover:bg-cyan-400 hover:text-slate-950 text-white border border-slate-700 hover:border-cyan-300 flex items-center justify-center transition-all shadow-2xl cursor-pointer"
                  title="Previous frame (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={lbNext}
                  onMouseEnter={playHover}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-950/90 hover:bg-cyan-400 hover:text-slate-950 text-white border border-slate-700 hover:border-cyan-300 flex items-center justify-center transition-all shadow-2xl cursor-pointer"
                  title="Next frame (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Bottom Frame Dots */}
          {lightbox.images.length > 1 && (
            <div className="flex items-center gap-2 z-10" onClick={(e) => e.stopPropagation()}>
              <div className="px-5 py-2 rounded-full bg-slate-950/90 border border-slate-800 flex items-center gap-2.5 shadow-2xl">
                {lightbox.images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      playTab();
                      setLightbox((p) => ({ ...p, idx: i }));
                    }}
                    onMouseEnter={playHover}
                    className={`transition-all cursor-pointer ${
                      i === lightbox.idx
                        ? 'w-7 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.9)]'
                        : 'w-2.5 h-2.5 rounded-full bg-slate-600 hover:bg-slate-300'
                    }`}
                    aria-label={`Frame ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
