'use client';

import React, { useState } from 'react';
import { useAudioSFX } from './AudioSFXProvider';
import { Sparkles, Shield, Heart, Zap, Crosshair, RefreshCw, Terminal, Sliders, Play, RotateCcw } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  tier: 'mythic' | 'legendary' | 'epic' | 'rare';
  type: string;
  damage: string;
  perk: string;
  icon: string;
  color: string;
}

const SAMPLE_ITEMS: InventoryItem[] = [
  { id: '1', name: 'ARX-9 Plasma Rifle', tier: 'mythic', type: 'Assault Weapon', damage: '380 DPS', perk: '+24% Armor Piercing', icon: '⚡', color: '#ffb800' },
  { id: '2', name: 'Valkyrie Shadow Cloak', tier: 'epic', type: 'Body Armor', damage: '420 DEF', perk: '+15% Stealth Duration', icon: '🛡️', color: '#a855f7' },
  { id: '3', name: 'Cryo-Stasis Grenade', tier: 'rare', type: 'Tactical Item', damage: '150 DMG', perk: 'Freezes target for 2.5s', icon: '❄️', color: '#00f0ff' },
  { id: '4', name: 'Nanite Medkit Mk.IV', tier: 'rare', type: 'Consumable', damage: '+100 HP', perk: 'Cleanses all debuffs', icon: '🧪', color: '#00ff88' },
  { id: '5', name: 'Void Piercer Katana', tier: 'mythic', type: 'Melee Weapon', damage: '510 DPS', perk: 'Critical hits cause Bleed', icon: '🗡️', color: '#ff007f' },
  { id: '6', name: 'Neural Overclock Chip', tier: 'legendary', type: 'Cyberware', damage: '+30% HASTE', perk: 'Reduces cooldowns by 40%', icon: '🧠', color: '#ffd700' },
];

const RADIAL_ABILITIES = [
  { id: 'recon', name: 'TACTICAL RECON', key: 'Q', icon: '📡', desc: 'Scan 40m area for hostile thermal signatures.' },
  { id: 'barrier', name: 'HARD-LIGHT SHIELD', key: 'E', icon: '🛡️', desc: 'Deploy 600HP directional defensive barrier.' },
  { id: 'stim', name: 'ADRENALINE STIM', key: 'Z', icon: '💉', desc: '+50% movement speed and instant shield kickstart.' },
  { id: 'orbital', name: 'ORBITAL STRIKE', key: 'X', icon: '🚀', desc: 'Call down targeted kinetic bombardment.' },
];

export function DesignSystemShowcase() {
  const { playHover, playClick, playSelect, playDamage, playShield, playTab } = useAudioSFX();
  
  // Interactive HUD state
  const [health, setHealth] = useState(85);
  const [shield, setShield] = useState(100);
  const [ammo, setAmmo] = useState(30);
  const maxAmmo = 30;
  const [selectedRadial, setSelectedRadial] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<InventoryItem | null>(SAMPLE_ITEMS[0]);
  const [dialogueChoice, setDialogueChoice] = useState<number | null>(null);

  // Take Damage Simulation
  const handleTakeDamage = () => {
    playDamage();
    if (shield > 0) {
      setShield((prev) => Math.max(0, prev - 25));
    } else {
      setHealth((prev) => Math.max(0, prev - 20));
    }
  };

  // Recharge Shield Simulation
  const handleRecharge = () => {
    playShield();
    setShield(100);
    setHealth(100);
  };

  // Fire Weapon Simulation
  const handleFire = () => {
    if (ammo > 0) {
      playClick();
      setAmmo((prev) => prev - 1);
    } else {
      playDamage();
    }
  };

  // Reload Simulation
  const handleReload = () => {
    playTab();
    setAmmo(maxAmmo);
  };

  return (
    <section id="design-system" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>02 // LIVE INTERACTIVE PLAYGROUND</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans uppercase">
          PLAYABLE GAME UI SYSTEM
        </h2>
        <p className="text-slate-400 text-sm sm:text-base font-mono mt-3">
          Interact with live game interface widgets below. Test state changes, sound feedback, and responsive layout behavior designed with Figma vector tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Vitals & Weapon Telemetry HUD (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h3 className="text-sm font-mono font-bold text-white tracking-wider uppercase">
                  WIDGET 01 // ADAPTIVE COMBAT TELEMETRY
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onMouseEnter={playHover}
                  onClick={handleTakeDamage}
                  className="px-3 py-1.5 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold transition-all active:scale-95 shadow-sm"
                >
                  ⚡ SIMULATE HIT (-25)
                </button>
                <button
                  type="button"
                  onMouseEnter={playHover}
                  onClick={handleRecharge}
                  className="px-3 py-1.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold transition-all active:scale-95 shadow-sm"
                >
                  <RotateCcw className="w-3 h-3 inline mr-1" /> RECHARGE
                </button>
              </div>
            </div>

            {/* Combat HUD Display Container */}
            <div className="bg-[#060a16] p-6 rounded-xl border border-cyan-500/20 relative">
              {/* Scanline overlay */}
              <div className="absolute inset-0 hud-scanlines opacity-30 pointer-events-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                {/* Vitals */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-cyan-400 mb-1">
                      <span className="flex items-center gap-1 font-bold">
                        <Shield className="w-3.5 h-3.5" /> SHIELD INTEGRITY
                      </span>
                      <span>{shield}%</span>
                    </div>
                    <div className="h-3 bg-slate-900 rounded overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                        style={{ width: `${shield}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono text-emerald-400 mb-1">
                      <span className="flex items-center gap-1 font-bold">
                        <Heart className="w-3.5 h-3.5" /> BIOLOGICAL VITALS
                      </span>
                      <span>{health}%</span>
                    </div>
                    <div className="h-3 bg-slate-900 rounded overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,136,0.8)]"
                        style={{ width: `${health}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Weapon Telemetry & Trigger */}
                <div className="flex flex-col justify-between p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">WEAPON CORE</span>
                      <div className="text-sm font-bold font-sans text-white">ARX-9 PLASMA RIFLE</div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black font-mono text-cyan-400">{ammo}</span>
                      <span className="text-xs font-mono text-slate-500">/{maxAmmo}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onMouseEnter={playHover}
                      onClick={handleFire}
                      className="flex-1 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95"
                    >
                      FIRE [CLICK]
                    </button>
                    <button
                      type="button"
                      onMouseEnter={playHover}
                      onClick={handleReload}
                      className="px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 transition-all active:scale-95"
                      title="Reload Magazine"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 02: Tactical Radial Ability Selector */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-mono font-bold text-white tracking-wider uppercase">
                WIDGET 02 // RADIAL ABILITY SELECTOR
              </h3>
              <span className="text-xs font-mono text-slate-400">SELECT WITH CLICK</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {RADIAL_ABILITIES.map((ability, idx) => {
                const isSelected = selectedRadial === idx;
                return (
                  <button
                    key={ability.id}
                    type="button"
                    onMouseEnter={playHover}
                    onClick={() => {
                      playSelect();
                      setSelectedRadial(idx);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-28 ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-105'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-2xl">{ability.icon}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-mono font-bold text-cyan-400 border border-slate-700">
                        [{ability.key}]
                      </span>
                    </div>
                    <div>
                      <div className={`text-xs font-mono font-bold uppercase ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {ability.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <span className="text-slate-500 uppercase">ACTIVE ABILITY:</span>
              <span className="text-white font-bold">{RADIAL_ABILITIES[selectedRadial].name}</span>
              <span className="text-slate-400 hidden sm:inline">— {RADIAL_ABILITIES[selectedRadial].desc}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory Slot Matrix & Tooltip Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-mono font-bold text-white tracking-wider uppercase">
                  WIDGET 03 // DIEGETIC INVENTORY MATRIX
                </h3>
                <span className="text-[11px] font-mono text-amber-400">HOVER TO INSPECT</span>
              </div>

              {/* 6 Grid Inventory Slots */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {SAMPLE_ITEMS.map((item) => {
                  const isHovered = hoveredItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => {
                        playHover();
                        setHoveredItem(item);
                      }}
                      className={`aspect-square rounded-xl bg-slate-950/90 border-2 p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isHovered
                          ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                      style={{ borderColor: isHovered ? item.color : undefined }}
                    >
                      <span className="text-3xl filter drop-shadow">{item.icon}</span>
                      <span className="text-[9px] font-mono text-slate-400 mt-1 line-clamp-1 text-center">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Item Tooltip Card */}
              {hoveredItem && (
                <div
                  className="p-4 rounded-xl bg-slate-950 border-2 transition-all space-y-3"
                  style={{ borderColor: hoveredItem.color }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold font-sans text-white">{hoveredItem.name}</h4>
                      <span
                        className="text-[10px] font-mono font-bold uppercase tracking-wider"
                        style={{ color: hoveredItem.color }}
                      >
                        {hoveredItem.tier} {hoveredItem.type}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white">
                      {hoveredItem.damage}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-[#070b18] border border-slate-800 text-xs font-mono text-slate-300">
                    <span className="text-cyan-400 font-bold block mb-0.5">✦ PERK EFFECT:</span>
                    {hoveredItem.perk}
                  </div>
                </div>
              )}
            </div>

            {/* Figma Token Sync Notice */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>FIGMA TOKENS: 100% SYNCED</span>
              <span className="text-emerald-400 font-bold">UMG READY</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
