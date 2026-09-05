'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Shield, ArrowUp } from 'lucide-react';
import { useAudioSFX } from './AudioSFXProvider';

export function Footer() {
  const { playHover, playClick } = useAudioSFX();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-cyan-500/20 bg-[#03060f] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand Callout */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-950/60 border border-cyan-400 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
            <Terminal className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="font-mono text-sm font-black tracking-widest text-white">
              NEXUS // WEIYU
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              GAME UI/UX DESIGN & INTERFACE SYSTEMS
            </div>
          </div>
        </div>

        {/* Center Notice */}
        <div className="text-center md:text-left text-xs font-mono text-slate-500">
          <span>HIGH-RESOLUTION INTERFACES • THREE.JS WEBGL ACCELERATED</span>
        </div>

        {/* Right Actions: Back to top & CMS access */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/login"
            onMouseEnter={playHover}
            onClick={playClick}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/40 px-3 py-1.5 rounded-lg bg-slate-950 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>DESIGNER CMS</span>
          </Link>

          <button
            type="button"
            onClick={scrollToTop}
            onMouseEnter={playHover}
            className="p-2 rounded-lg bg-slate-900 hover:bg-cyan-950 text-slate-400 hover:text-cyan-400 border border-slate-800 transition-colors cursor-pointer"
            title="Return to top of page"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
