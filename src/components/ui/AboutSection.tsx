'use client';

import React from 'react';
import { DesignerProfile } from '@/types';
import { useAudioSFX } from './AudioSFXProvider';
import {
  Terminal,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Quote,
  Sparkles
} from 'lucide-react';

interface AboutSectionProps {
  profile: DesignerProfile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  const { playHover, playClick } = useAudioSFX();
  const discordUsername = profile.discordTag || 'weiyu85';

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 relative">
      
      {/* Visual Background Depth Elements */}
      <div className="absolute top-10 right-10 w-[450px] h-[450px] rounded-full bg-cyan-500/[0.035] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-purple-600/[0.04] blur-[120px] pointer-events-none" />

      {/* Decorative Technical HUD Border Markings */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between text-[9px] font-mono text-cyan-500/40 pointer-events-none select-none">
        <span>// SEC-02.OPERATOR_DOSSIER</span>
        <span className="hidden sm:inline">CALLSIGN: [{profile.callsign}]</span>
        <span>STATUS: VERIFIED // AVAILABLE</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2 relative z-10">
        <Terminal className="w-4 h-4" />
        <span>02 // OPERATOR DOSSIER</span>
      </div>
      <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans uppercase mb-12 relative z-10">
        ABOUT THE DESIGNER
      </h2>

      {/* Main Designer Profile & Discord Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 relative z-10">
        {/* Left Column: Bio Card (7 cols) */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 sm:p-10 rounded-xl border border-cyan-500/30 space-y-5 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
            {/* Subtle glow orb */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-2xl sm:text-3xl font-bold font-sans text-white flex items-center gap-3">
                  <span>{profile.name}</span>
                  <span className="text-xs font-mono text-cyan-400 font-normal px-2.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40">
                    [{profile.callsign}]
                  </span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  VERIFIED
                </span>
              </div>

              <p className="text-cyan-300 font-mono text-xs sm:text-sm tracking-wider uppercase font-semibold">
                {profile.tagline}
              </p>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                {profile.bio}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>SPECIALTY: GAME INTERFACE DESIGN</span>
              <span className="text-cyan-400 font-bold">READY FOR DEPLOYMENT</span>
            </div>
          </div>
        </div>

        {/* Right Column: Discord Direct Channel (5 cols) */}
        <div className="lg:col-span-5">
          <div className="p-8 rounded-xl bg-gradient-to-br from-[#0c142c] to-[#080d1d] border-2 border-cyan-400/80 shadow-[0_0_25px_rgba(0,240,255,0.2)] space-y-5 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4" />
                  <span>DIRECT TRANSMISSION</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00ff88]" />
              </div>

              <h4 className="text-xl font-bold font-sans text-white">
                Connect on Discord
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Showcasing full-resolution game UI designs without compression. For commission briefs or questions, reach out directly.
              </p>

              {/* Discord Username Box */}
              <div className="p-4 rounded-lg bg-slate-950/90 border border-cyan-500/40 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Discord Username
                </span>
                <span className="text-base font-mono font-black text-cyan-300 block">
                  {discordUsername}
                </span>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <a
                href={profile.discordServerUrl || 'https://discord.gg/V4gZfxQCDc'}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHover}
                onClick={playClick}
                className="flex-1 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Discord Server</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-xs font-mono text-slate-400 font-bold">@{discordUsername}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Studio Endorsements (Full-width horizontal row) */}
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            <Quote className="w-4 h-4 text-amber-400" />
            <span>ENDORSEMENTS</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">VERIFIED CLIENT TESTIMONIALS</span>
        </div>

        {/* Horizontal grid layout for endorsements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              onMouseEnter={playHover}
              className="p-6 sm:p-8 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-400/50 transition-all shadow-xl space-y-4 relative group"
            >
              <Quote className="w-8 h-8 text-amber-400/20 absolute top-4 right-4 pointer-events-none group-hover:text-amber-400/30 transition-colors" />

              <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed relative z-10 font-sans">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white tracking-wide">
                  — {testimonial.author}
                </span>
                <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
                  RECOMMENDED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
