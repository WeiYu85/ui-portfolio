'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Project, DesignerProfile, ContactMessage, DeviceType } from '@/types';
import { useAudioSFX } from '@/components/ui/AudioSFXProvider';
import {
  Layers, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Upload,
  ImageIcon, Settings, Mail, LogOut, CheckCircle2, AlertCircle,
  ArrowLeft, X, Copy, Check, Shield, Monitor, Smartphone, Gamepad2,
  TabletSmartphone
} from 'lucide-react';

const DEVICE_OPTIONS: DeviceType[] = [
  'PC / Desktop',
  'Console (PS5 / Xbox)',
  'Mobile (iOS / Android)',
  'Handheld / Steam Deck',
];

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  'PC / Desktop': <Monitor className="w-3.5 h-3.5" />,
  'Console (PS5 / Xbox)': <Gamepad2 className="w-3.5 h-3.5" />,
  'Mobile (iOS / Android)': <Smartphone className="w-3.5 h-3.5" />,
  'Handheld / Steam Deck': <TabletSmartphone className="w-3.5 h-3.5" />,
};

const STATUS_TEXT_BY_AVAILABILITY = {
  available: 'AVAILABLE',
  limited: 'LIMITED AVAILABILITY',
  booked: 'FULLY BOOKED',
} as const;

type Tab = 'projects' | 'media' | 'profile' | 'messages';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { playClick, playSelect, playAlert, playTab } = useAudioSFX();

  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<DesignerProfile | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [uploadedAssets, setUploadedAssets] = useState<string[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Project form modal
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    subtitle: '',
    slug: '',
    device: 'PC / Desktop',
    heroImage: '',
    thumbnailImage: '',
    images: [],
    overview: '',
    featured: true,
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  // Profile
  const [newPassword, setNewPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) { router.push('/admin/login'); return; }
        const [projRes, profRes, msgRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/profile'),
          fetch('/api/contact'),
        ]);
        const pj = await projRes.json();
        const pf = await profRes.json();
        const mg = await msgRes.json();
        if (pj.projects) setProjects(pj.projects);
        if (pf.profile) setProfile(pf.profile);
        if (mg.messages) setMessages(mg.messages);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [router]);

  const handleLogout = async () => {
    playClick();
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleFileUpload = async (files: FileList | null, addToProjectFrames?: boolean) => {
    if (!files || files.length === 0) return;
    playClick();
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('files', f));
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      if (data.urls?.length > 0) {
        playSelect();
        setUploadedAssets((prev) => [...data.urls, ...prev]);
        if (addToProjectFrames) {
          setProjectForm((prev) => {
            const imgs = [...(prev.images || []), ...data.urls];
            return { ...prev, images: imgs, heroImage: prev.heroImage || imgs[0], thumbnailImage: prev.thumbnailImage || imgs[0] };
          });
        }
      }
    } catch (error) {
      playAlert();
      alert(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const url = newImageUrl.trim();
    setProjectForm((prev) => {
      const imgs = [...(prev.images || []), url];
      return { ...prev, images: imgs, heroImage: prev.heroImage || imgs[0], thumbnailImage: prev.thumbnailImage || imgs[0] };
    });
    setNewImageUrl('');
    playClick();
  };

  const handleRemoveImage = (idx: number) => {
    setProjectForm((prev) => {
      const imgs = (prev.images || []).filter((_, i) => i !== idx);
      return { ...prev, images: imgs, heroImage: imgs[0] || '', thumbnailImage: imgs[0] || '' };
    });
  };

  const openCreate = () => {
    playClick();
    setEditingProjectId(null);
    setProjectForm({ title: '', subtitle: '', slug: '', device: 'PC / Desktop', heroImage: '', thumbnailImage: '', images: [], overview: '', featured: true });
    setIsEditingProject(true);
  };

  const openEdit = (proj: Project) => {
    playClick();
    setEditingProjectId(proj.id);
    const imgs = proj.images?.length ? proj.images : [proj.heroImage || ''].filter(Boolean);
    setProjectForm({ ...proj, images: imgs });
    setIsEditingProject(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const imgs = projectForm.images?.length ? projectForm.images : [projectForm.heroImage || ''].filter(Boolean);
    if (!projectForm.title || imgs.length === 0) { alert('Title and at least one image are required'); return; }
    const payload = { ...projectForm, images: imgs, heroImage: imgs[0], thumbnailImage: imgs[0] };
    try {
      if (editingProjectId) {
        const res = await fetch(`/api/projects/${editingProjectId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (data.project) { setProjects((p) => p.map((x) => x.id === editingProjectId ? data.project : x)); playSelect(); setIsEditingProject(false); }
      } else {
        const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (data.project) { setProjects((p) => [...p, data.project]); playSelect(); setIsEditingProject(false); }
      }
    } catch { playAlert(); alert('Failed to save project'); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    playClick();
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) { setProjects((p) => p.filter((x) => x.id !== id)); playSelect(); }
  };

  const handleDeleteMessage = async (id: string, name: string) => {
    if (!confirm(`Delete inquiry from "${name}"?`)) return;
    playClick();
    const res = await fetch('/api/contact', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) { setMessages((current) => current.filter((message) => message.id !== id)); playSelect(); }
  };

  const handleMove = async (idx: number, dir: 'up' | 'down') => {
    const ti = dir === 'up' ? idx - 1 : idx + 1;
    if (ti < 0 || ti >= projects.length) return;
    playTab();
    const np = [...projects];
    const [mv] = np.splice(idx, 1);
    np.splice(ti, 0, mv);
    setProjects(np);
    await fetch('/api/projects/reorder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: np.map((p) => p.id) }) });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    playClick();
    try {
      const payload: Record<string, unknown> = { ...profile };
      if (newPassword && newPassword.length >= 6) payload.newPassword = newPassword;
      const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { playSelect(); setNewPassword(''); setStatusMessage({ type: 'success', text: 'Profile saved!' }); setTimeout(() => setStatusMessage(null), 4000); }
    } catch { playAlert(); setStatusMessage({ type: 'error', text: 'Failed to save.' }); }
  };

  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); setCopiedUrl(url); playClick(); setTimeout(() => setCopiedUrl(null), 2000); };

  if (isLoading) {
    return <div className="min-h-screen bg-[#050813] flex items-center justify-center text-cyan-400 font-mono animate-pulse">LOADING CMS...</div>;
  }

  return (
    <div className="min-h-screen bg-[#050813] text-white flex flex-col selection:bg-cyan-400 selection:text-slate-950">
      {/* Header */}
      <header className="bg-[#080d1d] border-b border-cyan-500/20 px-3 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
        <div className="min-w-0 flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-xs font-mono transition-colors">
            <ArrowLeft className="w-4 h-4" /><span>LIVE SITE</span>
          </Link>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="truncate text-sm font-mono font-bold tracking-wider text-white">NEXUS // CMS</span>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-mono transition-colors">
          <LogOut className="w-3.5 h-3.5" /><span>LOGOUT</span>
        </button>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 min-w-0">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {([
            { id: 'projects', label: `PROJECTS (${projects.length})`, icon: <Layers className="w-4 h-4" /> },
            { id: 'media', label: 'MEDIA UPLOADER', icon: <ImageIcon className="w-4 h-4" /> },
            { id: 'profile', label: 'PROFILE', icon: <Settings className="w-4 h-4" /> },
            { id: 'messages', label: `INQUIRIES (${messages.length})`, icon: <Mail className="w-4 h-4" /> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((t) => (
            <button key={t.id} type="button" onClick={() => { playTab(); setActiveTab(t.id); }}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === t.id ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
              {t.icon}<span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Projects tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white uppercase">MANAGE PORTFOLIO</h2>
                <p className="text-xs font-mono text-slate-400">
                  Upload multiple images per project — they auto-generate paginated dots on the live site.
                </p>
              </div>
              <button type="button" onClick={openCreate} className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-2">
                <Plus className="w-4 h-4" /><span>UPLOAD NEW PROJECT</span>
              </button>
            </div>

            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="divide-y divide-slate-800">
                {projects.map((proj, idx) => {
                  const fc = proj.images?.length || 1;
                  return (
                    <div key={proj.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <button type="button" disabled={idx === 0} onClick={() => handleMove(idx, 'up')} className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 disabled:opacity-20"><ArrowUp className="w-3.5 h-3.5" /></button>
                          <button type="button" disabled={idx === projects.length - 1} onClick={() => handleMove(idx, 'down')} className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 disabled:opacity-20"><ArrowDown className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="w-20 h-12 rounded bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                          <img src={proj.thumbnailImage || proj.heroImage || proj.images?.[0]} alt={proj.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
                              {DEVICE_ICONS[proj.device]}{proj.device}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                              {fc} {fc === 1 ? 'FRAME' : 'FRAMES'}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-slate-400 line-clamp-1 mt-0.5">{proj.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button type="button" onClick={() => openEdit(proj)} className="px-3 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5">
                          <Edit2 className="w-3.5 h-3.5" /><span>EDIT</span>
                        </button>
                        <button type="button" onClick={() => handleDelete(proj.id, proj.title)} className="p-2 rounded bg-rose-950/40 hover:bg-rose-900 border border-rose-500/40 text-rose-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Media tab */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white uppercase">MEDIA UPLOADER</h2>
            <div className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-10 text-center bg-slate-950/60 transition-colors">
              <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-3 animate-bounce" />
              <h3 className="text-sm font-mono font-bold text-white uppercase">DROP PNG / SVG / JPG FILES</h3>
              <p className="text-xs font-mono text-slate-400 mt-1 mb-4">Or click to browse</p>
              <label className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono font-bold uppercase cursor-pointer">
                SELECT FILES<input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e.target.files)} className="hidden" />
              </label>
            </div>
            {uploadedAssets.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedAssets.map((url, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="aspect-[16/9] rounded overflow-hidden bg-black"><img src={url} alt="" className="w-full h-full object-cover" /></div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 truncate max-w-[100px]">{url.slice(-20)}</span>
                      <button type="button" onClick={() => copyUrl(url)} className="p-1 rounded bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-400">
                        {copiedUrl === url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile tab */}
        {activeTab === 'profile' && profile && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white uppercase">PROFILE & SETTINGS</h2>
            {statusMessage && (
              <div className={`p-4 rounded-xl border font-mono text-xs flex items-center gap-2 ${statusMessage.type === 'success' ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/60 border-rose-500/50 text-rose-300'}`}>
                {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {statusMessage.text}
              </div>
            )}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase">DESIGNER IDENTITY</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Name</label>
                    <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Discord Username</label>
                    <input type="text" value={profile.discordTag} onChange={(e) => setProfile({ ...profile, discordTag: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Email</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Availability</label>
                    <select
                      value={profile.availability}
                      onChange={(e) => {
                        const availability = e.target.value as keyof typeof STATUS_TEXT_BY_AVAILABILITY;
                        setProfile({
                          ...profile,
                          availability,
                          status: STATUS_TEXT_BY_AVAILABILITY[availability],
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="available">🟢 Available</option>
                      <option value="limited">🟡 Limited</option>
                      <option value="booked">🔴 Booked</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Bio</label>
                  <textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none" />
                </div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-mono font-bold text-amber-400 uppercase">CHANGE PASSWORD</h3>
                <p className="text-xs font-mono text-slate-400">Leave blank to keep current password.</p>
                <input type="password" placeholder="New password (min 6 chars)" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full sm:w-80 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none" />
              </div>
              <button type="submit" className="px-6 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono font-bold uppercase shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                SAVE CHANGES
              </button>
            </form>
          </div>
        )}

        {/* Messages tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white uppercase">CLIENT INQUIRIES ({messages.length})</h2>
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white">{msg.name}</h3>
                        <a href={`mailto:${msg.email}`} className="text-xs font-mono text-cyan-400 hover:underline">{msg.email}</a>
                        {msg.discordUsername && <p className="text-xs font-mono text-indigo-300">Discord: {msg.discordUsername}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {msg.studio && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">{msg.studio}</span>}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">{msg.budget}</span>
                        <button type="button" onClick={() => handleDeleteMessage(msg.id, msg.name)} className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900 border border-rose-500/40 text-rose-300" aria-label={`Delete inquiry from ${msg.name}`} title="Delete inquiry">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-900">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-950/40 rounded-xl border border-slate-800 font-mono text-xs text-slate-500">NO INQUIRIES YET</div>
            )}
          </div>
        )}
      </div>

      {/* Project modal */}
      {isEditingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-  -md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#090e1f] border border-cyan-500/30 w-full max-w-3xl rounded-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-mono font-bold text-white uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded bg-cyan-400 animate-pulse" />
                {editingProjectId ? 'EDIT PROJECT' : 'NEW PROJECT'}
              </h3>
              <button type="button" onClick={() => setIsEditingProject(false)} className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Title *</label>
                  <input type="text" required value={projectForm.title || ''} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="e.g. AETHERIA: 2088" className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Subtitle</label>
                  <input type="text" value={projectForm.subtitle || ''} onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })} placeholder="e.g. Tactical Extraction Shooter HUD" className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Target Device *</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {DEVICE_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setProjectForm({ ...projectForm, device: d })}
                      className={`px-3 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 justify-center ${projectForm.device === d ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-cyan-500/40'}`}
                    >
                      {DEVICE_ICONS[d]}{d.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-frame image manager */}
              <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-mono text-cyan-400 uppercase font-bold">
                      FRAME IMAGES ({projectForm.images?.length || 0}) *
                    </label>
                    <p className="text-[11px] font-mono text-slate-400">Multiple images → carousel dots on live site</p>
                  </div>
                  <label className="px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />UPLOAD
                    <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e.target.files, true)} className="hidden" />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input type="text" placeholder="Or paste image URL..." value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="flex-1 px-3 py-2 rounded bg-[#060a16] border border-slate-700 text-white text-xs font-mono" />
                  <button type="button" onClick={handleAddImageUrl} className="px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono border border-slate-700">ADD</button>
                </div>

                {projectForm.images && projectForm.images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {projectForm.images.map((img, i) => (
                      <div key={i} className="relative aspect-[16/9] rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-cyan-300">•{i + 1}</span>
                        <button type="button" onClick={() => handleRemoveImage(i)} className="absolute top-1 right-1 p-1 rounded bg-rose-950/90 text-rose-300 hover:bg-rose-900">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg text-xs font-mono text-slate-500">
                    UPLOAD OR PASTE AT LEAST 1 IMAGE
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Description *</label>
                <textarea required rows={3} value={projectForm.overview || ''} onChange={(e) => setProjectForm({ ...projectForm, overview: e.target.value })} placeholder="Describe the UI system, mechanics, layout..." className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none" />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800 justify-end">
                <button type="button" onClick={() => setIsEditingProject(false)} className="px-4 py-2 rounded bg-slate-900 text-slate-400 text-xs font-mono">CANCEL</button>
                <button type="submit" className="px-6 py-2.5 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono font-bold uppercase shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  {editingProjectId ? 'SAVE CHANGES' : 'CREATE PROJECT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
