'use client';

import React from 'react';
import Link from 'next/link';
import { HeroCanvas } from '@/components/3d/HeroCanvas';
import { useAudioSFX } from './AudioSFXProvider';
import { Sparkles, ChevronDown, Layers, Crosshair } from 'lucide-react';
import { DesignerProfile } from '@/types';

interface HeroSectionProps {
  profile: DesignerProfile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const { playHover, playClick, playSelect } = useAudioSFX();

  return (
    <section className="relative min-h-[94vh] flex flex-col justify-center items-center pt-28 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden bg-holo-grid">
      <HeroCanvas />

      <div className="pointer-events-none absolute inset-4 sm:inset-8 border border-cyan-500/15 rounded-2xl hidden md:block">
        <div className="absolute top-2 left-2 flex items-center gap-1.5 font-mono text-[9px] text-cyan-400/80">
          <span className="w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400" />
          <span>[COORD: 45.22° N, 122.68° W]</span>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1.5 font-mono text-[9px] text-cyan-400/80">
          <span>[SYSTEM: SEC-07 // ONLINE]</span>
          <span className="w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400" />
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 font-mono text-[9px] text-emerald-400/80">
          <span className="w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400" />
          <span>[RADAR: ACTIVE // NO THREAT]</span>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 font-mono text-[9px] text-purple-400/80">
          <span>[VER: 4.8 // 60 FPS]</span>
          <span className="w-2.5 h-2.5 border-b-2 border-r-2 border-purple-400" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex max-w-full items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/95 border border-cyan-500/40 text-slate-200 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
          <Crosshair className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span className="font-bold text-cyan-300">{profile.title}</span>
          <span className="text-slate-600">|</span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            COMMISSION QUEUE OPEN
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase font-sans mb-5 text-balance drop-shadow-2xl">
          GAME UI/UX <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-glow-cyan">
            DESIGNER
          </span>
        </h1>

        <div className="relative isolate w-full max-w-3xl mx-auto mb-8 overflow-hidden rounded-xl border border-cyan-400/40 bg-gradient-to-b from-[#0a1630]/35 via-[#060d1f]/45 to-[#02050f]/55 shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(0,240,255,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-sm transition-all hover:border-cyan-400/70 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_40px_rgba(0,240,255,0.15),inset_0_1px_0_rgba(255,255,255,0.18)] p-5 sm:p-7 text-center space-y-3.5">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5 text-[11px] font-mono">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              GAME UI SPECIALIST
            </span>
            <span className="text-slate-400">
              DISCORD USERNAME: <strong className="text-cyan-300 font-mono">{profile.discordTag}</strong>
            </span>
          </div>

          <p className="text-slate-100 text-sm sm:text-base lg:text-[1.05rem] font-sans font-semibold leading-relaxed">
            I bridge{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 font-bold">
              detailed UI design
            </span>{' '}
            with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-200 font-bold">
              real-time engine implementation
            </span>
            , creating tactical HUDs, immersive game systems, and scalable design systems for modern games.
          </p>

          <p className="text-slate-300/90 text-xs sm:text-sm font-sans leading-relaxed">
            From Figma concepts to production-ready interfaces, I bring a strong focus on visual polish, usability, and
            making every element feel like a natural part of the game world.
          </p>
        </div>

        <div className="w-full flex flex-wrap items-center justify-center gap-4 mb-10">
          <Link
            href="/#work"
            onMouseEnter={playHover}
            onClick={playSelect}
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:shadow-[0_0_35px_rgba(0,240,255,0.8)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>INSPECT UI ARCHIVES (6)</span>
          </Link>

          <Link
            href="/#contact"
            onMouseEnter={playHover}
            onClick={playClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-slate-900/90 hover:bg-cyan-950/60 text-cyan-300 hover:text-white font-mono font-bold text-sm tracking-wider uppercase border border-cyan-500/50 hover:border-cyan-400 transition-all shadow-md hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>COMMISSION BRIEF</span>
          </Link>
        </div>

        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 hover:border-cyan-400/80 transition-all group hover:-translate-y-1 shadow-lg">
            <div className="text-3xl sm:text-4xl font-mono font-black text-cyan-400 group-hover:text-glow-cyan">
              {profile.stats.shippedTitles}+
            </div>
            <div className="text-xs font-mono text-slate-300 mt-1 uppercase tracking-wider font-semibold">
              Shipped Titles &amp; DLCs
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">PC • Console • Mobile</div>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-emerald-500/30 hover:border-emerald-400/80 transition-all group hover:-translate-y-1 shadow-lg">
            <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-400 group-hover:text-glow-emerald">
              {profile.stats.experienceYears}+ YRS
            </div>
            <div className="text-xs font-mono text-slate-300 mt-1 uppercase tracking-wider font-semibold">
              Interface Specialization
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Tactical &amp; Diegetic UI</div>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-purple-500/30 hover:border-purple-400/80 transition-all group hover:-translate-y-1 shadow-lg">
            <div className="text-3xl sm:text-4xl font-mono font-black text-purple-400 group-hover:text-glow-purple">
              {profile.stats.totalFramesDesigned}+
            </div>
            <div className="text-xs font-mono text-slate-300 mt-1 uppercase tracking-wider font-semibold">
              UI Frames &amp; Screens
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Vector-Engineered</div>
          </div>
        </div>

        <Link
          href="/#work"
          onMouseEnter={playHover}
          onClick={playClick}
          className="mt-10 text-slate-500 hover:text-cyan-400 transition-colors flex flex-col items-center gap-1 group"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 group-hover:text-cyan-400">
            SCROLL TO INSPECT FRAMES
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-cyan-400" />
        </Link>
      </div>
    </section>
  );
}
