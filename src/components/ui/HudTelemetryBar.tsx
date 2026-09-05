'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Activity, Clock, ShieldCheck } from 'lucide-react';

export function HudTelemetryBar() {
  const [timeString, setTimeString] = useState('');
  const [fps] = useState('60.0');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        // Formats to user's exact local time (24h format) with timezone abbreviation/offset
        const timePart = now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        const tzPart =
          new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
            .formatToParts(now)
            .find((p) => p.type === 'timeZoneName')?.value || 'LOCAL';
        setTimeString(`${timePart} [${tzPart}]`);
      } catch {
        // Fallback to UTC if Intl is unavailable
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        setTimeString(`${hours}:${minutes}:${seconds} UTC`);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside
      aria-label="System telemetry bar"
      className="relative w-full bg-[#03060f]/95 border-b border-cyan-500/20 px-4 sm:px-8 py-1.5 text-[10px] font-mono text-slate-400 flex items-center justify-between overflow-x-auto whitespace-nowrap z-50 backdrop-blur-md"
    >
      {/* Left: System Status & Commission Status */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#00ff88]" />
          <span className="font-bold tracking-wider">SYSTEM: ONLINE</span>
        </div>

        <span className="text-slate-800 hidden sm:inline">|</span>

        <div className="hidden sm:flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span className="tracking-wider font-semibold">COMMISSIONS: OPEN</span>
        </div>
      </div>

      {/* Center: Live Clock (Synced with user's timezone) */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-cyan-300 font-bold px-2.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)] pointer-events-none">
        <Clock className="w-3 h-3 text-cyan-400 animate-spin-slow" />
        <span className="tracking-wider">{timeString || 'SYNCING TIME...'}</span>
      </div>

      {/* Right: FPS & Frequency (Grouped together on the right) */}
      <div className="flex items-center gap-3 shrink-0 ml-auto">
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>FPS: <strong className="text-emerald-300 font-bold">{fps}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800">
          <Radio className="w-3 h-3 text-cyan-400" />
          <span className="font-semibold text-cyan-400">FREQ: 142.85 MHz</span>
          <span className="text-slate-500 hidden sm:inline">// SEC-07</span>
        </div>
      </div>
    </aside>
  );
}
