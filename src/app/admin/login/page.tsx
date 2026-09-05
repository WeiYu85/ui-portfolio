'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAudioSFX } from '@/components/ui/AudioSFXProvider';

export default function AdminLoginPage() {
  const router = useRouter();
  const { playHover, playClick, playSelect, playAlert } = useAudioSFX();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      playSelect();
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      playAlert();
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050813] flex flex-col justify-center items-center px-4 relative overflow-hidden bg-holo-grid">
      {/* Background glow circle */}
      <div className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Return home link */}
      <Link
        href="/"
        onMouseEnter={playHover}
        onClick={playClick}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO PORTFOLIO</span>
      </Link>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-cyan-500/40 relative z-10 shadow-2xl space-y-6">
        {/* Terminal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-sans text-white uppercase tracking-tight">
            DESIGNER CMS PORTAL
          </h1>
          <p className="text-xs font-mono text-cyan-400">
            NEXUS PROTOCOL // SECURE ACCESS
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Admin Username
            </label>
            <input
              type="text"
              required
              placeholder="Enter username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            onMouseEnter={playHover}
            onClick={playClick}
            className="w-full py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{isLoading ? 'AUTHENTICATING...' : 'AUTHORIZE LOGIN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
