'use client';

import React, { useState } from 'react';
import { DesignerProfile } from '@/types';
import { useAudioSFX } from './AudioSFXProvider';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Copy,
  Check,
  Calculator,
  Clock,
  FileCheck2,
  Sparkles,
  Layers
} from 'lucide-react';

interface ContactSectionProps {
  profile: DesignerProfile;
}

const COMMISSION_TIERS = [
  {
    id: 'frames-single',
    label: 'Single Frame / HUD Mockup',
    price: '< $50',
    budgetVal: '< $50 (Frames Only / Single HUD Screen)',
    turnaround: '3 - 5 Business Days',
    deliverables: ['1 High-Fidelity HUD / Screen Frame', 'Figma Vector Source File', 'PNG / SVG Clean Assets'],
  },
  {
    id: 'frames-multi',
    label: 'Multiple Frames Only',
    price: '$100 – $300',
    budgetVal: '$100 – $300 (Frames Only / Multi-Screen)',
    turnaround: '1 - 2 Weeks',
    deliverables: ['3 to 10 In-Game UI Screens', 'Component State Variants (Hover/Active)', 'Figma Auto-Layout 5.0 File'],
  },
  {
    id: 'full-ui',
    label: 'Full Game UI System',
    price: '$300 – $1,000',
    budgetVal: '$300 – $1,000 (Full Game UI)',
    turnaround: '2 - 4 Weeks',
    deliverables: ['Complete Game UI (HUD, Menus, Inventory)', 'Full Component Design System', 'Gamepad & Touch Ergonomics Guide'],
  },
  {
    id: 'aaa-ui',
    label: 'AAA Full Game UI & Handoff',
    price: '$2,000',
    budgetVal: '$2,000+ (AAA Full Game UI & Engine Handoff)',
    turnaround: '4 - 8 Weeks',
    deliverables: ['Complete Triple-A Multi-Platform UI', 'CommonUI / UMG Style Tokens & JSON', 'Motion Specs & Technical Documentation'],
  },
];

export function ContactSection({ profile }: ContactSectionProps) {
  const { playHover, playClick, playSelect, playAlert } = useAudioSFX();
  const discordUsername = profile.discordTag || 'weiyu85';

  const [selectedTierId, setSelectedTierId] = useState('full-ui');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studio: '',
    projectType: 'Full Game UI System ($300 – $1,000)',
    budget: '$300 – $1,000 (Full Game UI)',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const activeTier = COMMISSION_TIERS.find((t) => t.id === selectedTierId) || COMMISSION_TIERS[2];

  const handleSelectTier = (tier: typeof COMMISSION_TIERS[0]) => {
    playSelect();
    setSelectedTierId(tier.id);
    setFormData((prev) => ({
      ...prev,
      projectType: tier.label,
      budget: tier.budgetVal,
    }));
  };

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText(discordUsername);
    playSelect();
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Submission failed');
      playSelect();
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        studio: '',
        projectType: activeTier.label,
        budget: activeTier.budgetVal,
        message: '',
      });
    } catch {
      playAlert();
      setErrorMessage('Could not send message. Please reach out directly on Discord: weiyu85.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 relative">
      {/* Ambient background visual depth elements */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] rounded-full bg-indigo-600/[0.05] blur-[130px] pointer-events-none" />

      {/* Decorative Technical HUD Border Markings */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between text-[9px] font-mono text-cyan-500/40 pointer-events-none select-none">
        <span>// SEC-03.COMMISSION_PORTAL</span>
        <span className="hidden sm:inline">DISCORD CHANNEL: @{discordUsername}</span>
        <span>TRANSMISSION: ENCRYPTED // 2048-BIT</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2 relative z-10">
        <Mail className="w-4 h-4" />
        <span>03 // COMMISSION BRIEF & TRANSMISSION RELAY</span>
      </div>
      <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans uppercase mb-10 relative z-10">
        COMMISSION & DIRECT CONTACT
      </h2>

      {/* Interactive Scope & Tier Selector Bar */}
      <div className="mb-10 p-6 rounded-2xl glass-panel border border-cyan-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>INTERACTIVE SCOPE & BUDGET SELECTOR</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            CLICK A TIER TO AUTO-FILL BRIEF
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COMMISSION_TIERS.map((tier) => {
            const isSelected = selectedTierId === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onMouseEnter={playHover}
                onClick={() => handleSelectTier(tier)}
                className={`p-4 rounded-xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-mono font-bold uppercase ${
                      isSelected ? 'text-cyan-300' : 'text-slate-300'
                    }`}
                  >
                    {tier.label}
                  </span>
                  <span
                    className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tier.price}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mt-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{tier.turnaround}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Commission Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 rounded-2xl border border-cyan-500/30 shadow-2xl relative">
            <h3 className="text-xl font-bold font-sans text-white mb-1">
              Commission Brief Transmission
            </h3>
            <p className="text-xs font-mono text-slate-400 mb-6">
              Selected Scope: <strong className="text-cyan-400">{activeTier.label}</strong> ({activeTier.price})
            </p>

            {submitted ? (
              <div className="p-8 rounded-xl bg-cyan-950/40 border border-cyan-400/80 text-center space-y-3 shadow-inner">
                <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto animate-bounce" />
                <h4 className="text-lg font-mono font-bold text-white uppercase">
                  TRANSMISSION RECEIVED
                </h4>
                <p className="text-xs font-mono text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you! Your briefing has been transmitted. You can also ping me directly on Discord at{' '}
                  <strong className="text-cyan-400 font-mono">{discordUsername}</strong> for immediate discussion.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider shadow-md hover:bg-cyan-300 transition-all cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                      Your Name / Producer Tag *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="producer@gamestudio.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                      Studio / Game Title
                    </label>
                    <input
                      type="text"
                      value={formData.studio}
                      onChange={(e) => setFormData({ ...formData, studio: e.target.value })}
                      placeholder="e.g. Apex Strike / Indie Studio"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                      Project Scope
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                    >
                      <option value="Single Frame / HUD Mockup">Single Frame / HUD Mockup (&lt; $50)</option>
                      <option value="Multiple Frames Only">Multiple Frames Only ($100 – $300)</option>
                      <option value="Full Game UI System">Full Game UI System ($300 – $1,000)</option>
                      <option value="AAA Full Game UI & Handoff">AAA Full Game UI & Handoff ($2,000)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                    Budget Tier
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                  >
                    <option value="< $50 (Frames Only / Single HUD Screen)">&lt; $50 (Frames Only / Single HUD Screen)</option>
                    <option value="$100 – $300 (Frames Only / Multi-Screen)">$100 – $300 (Frames Only / Multi-Screen)</option>
                    <option value="$300 – $1,000 (Full Game UI)">$300 – $1,000 (Full Game UI)</option>
                    <option value="$2,000+ (AAA Full Game UI & Engine Handoff)">$2,000+ (AAA Full Game UI & Engine Handoff)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                    Project Brief & Specifications *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your game style, target platform (PC, Console, Mobile, Steam Deck, VR), timeline, and whether you need single frames or a full UI system..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors custom-scrollbar"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'TRANSMITTING BRIEF...' : 'TRANSMIT COMMISSION BRIEF'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Direct Channels & Discord Only (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Prominent Discord Direct Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#101b3b] to-[#091126] border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.25)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" />
                <span>PRIMARY DIRECT CHANNEL</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h4 className="text-xl font-bold font-sans text-white">
              Connect on Discord
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              For instant feedback, commission briefs, or bespoke UI quotes, message my Discord username directly.
            </p>

            <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Discord Username</span>
                <span className="text-base font-mono font-black text-cyan-300">{discordUsername}</span>
              </div>

              <button
                type="button"
                onClick={handleCopyDiscord}
                onMouseEnter={playHover}
                className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {copiedDiscord ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY USERNAME</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Direct Email Box */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-3">
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              DIRECT INBOX
            </h4>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">EMAIL ADDRESS</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm font-mono font-bold text-white hover:text-cyan-300 underline underline-offset-2 transition-colors"
                >
                  {profile.email}
                </a>
              </div>
            </div>
          </div>

          {/* Selected Tier Deliverables Card */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-3">
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4" />
              <span>TIER DELIVERABLES ({activeTier.label})</span>
            </h4>
            <ul className="space-y-2">
              {activeTier.deliverables.map((d, i) => (
                <li key={i} className="text-xs font-mono text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
