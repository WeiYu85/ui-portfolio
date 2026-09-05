'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Shield, Menu, X, Terminal, Radio } from 'lucide-react';
import { useAudioSFX } from './AudioSFXProvider';
import { HudTelemetryBar } from './HudTelemetryBar';

interface NavbarProps {
  designerName?: string;
  statusText?: string;
  availability?: string;
}

export function Navbar({
  designerName = 'VUX',
  statusText = 'AVAILABLE FOR CONTRACTS & AAA',
  availability = 'available',
}: NavbarProps) {
  const { isMuted, toggleMute, playHover, playClick, playTab } = useAudioSFX();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Top Atmospheric Telemetry Bar */}
      <HudTelemetryBar />

      {/* Main HUD Navigation Bar */}
      <div className="bg-[#050813]/90 backdrop-blur-xl border-b border-cyan-500/25 relative shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        {/* Subtle Cyber Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
          
          {/* Brand / Callsign with Tactical Reticle */}
          <Link
            href="/"
            onMouseEnter={playHover}
            onClick={playClick}
            className="flex items-center gap-3.5 group"
          >
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-950 to-slate-950 border border-cyan-400/80 flex items-center justify-center text-cyan-300 font-mono font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-105 group-hover:border-cyan-300 transition-all">
              <Terminal className="w-4 h-4 text-cyan-400" />
              {/* Corner crosshairs */}
              <span className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-cyan-300" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t border-r border-cyan-300" />
              <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b border-l border-cyan-300" />
              <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-cyan-300" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black tracking-widest text-white group-hover:text-cyan-300 transition-colors">
                  NEXUS // {designerName}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 tracking-wider">
                  OPERATOR
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    availability === 'available'
                      ? 'bg-emerald-400 animate-pulse shadow-[0_0_6px_#00ff88]'
                      : availability === 'limited'
                      ? 'bg-amber-400 shadow-[0_0_6px_#ffb800]'
                      : 'bg-rose-400'
                  }`}
                />
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                  {statusText}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links with Tactical Numbering */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#work"
              onMouseEnter={playHover}
              onClick={playClick}
              className="text-xs font-mono tracking-wider text-slate-300 hover:text-cyan-400 transition-colors py-1 relative group"
            >
              <span className="text-cyan-500/70 group-hover:text-cyan-300 mr-1.5 font-bold">01.</span>
              PROJECTS
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-200 shadow-[0_0_8px_#00f0ff]" />
            </Link>

            <Link
              href="/#about"
              onMouseEnter={playHover}
              onClick={playClick}
              className="text-xs font-mono tracking-wider text-slate-300 hover:text-cyan-400 transition-colors py-1 relative group"
            >
              <span className="text-cyan-500/70 group-hover:text-cyan-300 mr-1.5 font-bold">02.</span>
              ABOUT & PIPELINE
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-200 shadow-[0_0_8px_#00f0ff]" />
            </Link>

            <Link
              href="/#contact"
              onMouseEnter={playHover}
              onClick={playClick}
              className="text-xs font-mono tracking-wider text-slate-300 hover:text-cyan-400 transition-colors py-1 relative group"
            >
              <span className="text-cyan-500/70 group-hover:text-cyan-300 mr-1.5 font-bold">03.</span>
              CONTACT & COMMISSIONS
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-200 shadow-[0_0_8px_#00f0ff]" />
            </Link>
          </nav>

          {/* Right Action Controls: Audio Visualizer SFX + CMS Access */}
          <div className="flex items-center gap-3">
            {/* Audio SFX Toggle with Dynamic Equalizer */}
            <button
              type="button"
              onClick={toggleMute}
              onMouseEnter={playHover}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider border transition-all ${
                !isMuted
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50 hover:border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-slate-900/80 text-slate-500 border-slate-800 hover:text-slate-400'
              }`}
              title={!isMuted ? 'Mute Game UI Sound FX' : 'Enable Game UI Sound FX'}
            >
              {!isMuted ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-cyan-400 animate-pulse" />
                    <span className="w-0.5 h-3 bg-emerald-400 animate-bounce" />
                    <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse delay-75" />
                  </span>
                  <span className="hidden sm:inline text-[11px] font-bold">SFX: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline text-[11px]">SFX: OFF</span>
                </>
              )}
            </button>

            {/* CMS Portal Trigger */}
            <Link
              href="/admin/login"
              onMouseEnter={playHover}
              onClick={playClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-cyan-950/70 text-slate-300 hover:text-cyan-300 text-xs font-mono border border-slate-700/80 hover:border-cyan-400/60 transition-all shadow-sm"
              title="Designer Login & CMS Management"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">CMS</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => {
                playTab();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 text-slate-400 hover:text-cyan-400 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#070b18]/98 border-b border-cyan-500/30 px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <Link
              href="/#work"
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-mono text-slate-300 hover:text-cyan-400"
            >
              01 // PROJECTS & FRAMES
            </Link>
            <Link
              href="/#about"
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-mono text-slate-300 hover:text-cyan-400"
            >
              02 // ABOUT & PIPELINE
            </Link>
            <Link
              href="/#contact"
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-mono text-slate-300 hover:text-cyan-400"
            >
              03 // CONTACT & COMMISSIONS
            </Link>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <Link
                href="/admin/login"
                onClick={() => {
                  playClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs font-mono text-cyan-400"
              >
                <Shield className="w-4 h-4" />
                ADMIN CMS PORTAL
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
