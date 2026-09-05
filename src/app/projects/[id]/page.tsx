import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectById, getProjectBySlug, getProjects, getProfile } from '@/lib/db';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { ArrowLeft, ArrowRight, Monitor, Smartphone, Gamepad2, TabletSmartphone } from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  'PC / Desktop': <Monitor className="w-4 h-4" />,
  'Console (PS5 / Xbox)': <Gamepad2 className="w-4 h-4" />,
  'Mobile (iOS / Android)': <Smartphone className="w-4 h-4" />,
  'Handheld / Steam Deck': <TabletSmartphone className="w-4 h-4" />,
};

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  let project = await getProjectById(id);
  if (!project) project = await getProjectBySlug(id);
  if (!project) notFound();

  const [allProjects, profile] = await Promise.all([getProjects(), getProfile()]);
  const currentIndex = allProjects.findIndex((p) => p.id === project!.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const allImages = project.images?.length ? project.images : [project.heroImage || ''];

  return (
    <main className="min-h-screen bg-[#050813] text-white selection:bg-cyan-400 selection:text-slate-950 flex flex-col justify-between">
      <Navbar designerName={profile.name} statusText={profile.status} availability={profile.availability} />

      <div className="pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full min-w-0">
        {/* Back link */}
        <div className="mb-8">
          <Link href="/#work" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-white uppercase tracking-wider transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            RETURN TO PORTFOLIO
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-3 mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            {DEVICE_ICONS[project.device]}
            <span>{project.device}</span>
          </div>
          <h1 className="text-3xl sm:text-6xl font-black text-white uppercase tracking-tight break-words">{project.title}</h1>
          {project.subtitle && <p className="text-sm font-mono text-cyan-400">{project.subtitle}</p>}
        </div>

        {/* All frames shown inline */}
        <div className="space-y-6 mb-12">
          {allImages.map((img, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-slate-950">
              <img
                src={img}
                alt={`${project.title} — frame ${i + 1}`}
                className="w-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              {allImages.length > 1 && (
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold">
                  FRAME {i + 1} / {allImages.length}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Description */}
        {project.overview && (
          <div className="glass-panel p-5 sm:p-8 rounded-2xl border border-cyan-500/20 mb-12">
            <h2 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider mb-4">ABOUT THIS PROJECT</h2>
            <p className="text-slate-300 text-base leading-relaxed">{project.overview}</p>
          </div>
        )}

        {/* Prev / Next navigation */}
        <div className="flex items-center justify-between gap-4 pt-8 border-t border-slate-800">
          {prevProject ? (
            <Link href={`/projects/${prevProject.slug || prevProject.id}`} className="min-w-0 flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl glass-panel border border-slate-800 hover:border-cyan-500/40 transition-colors group max-w-[48%]">
              <ArrowLeft className="w-5 h-5 text-cyan-400 shrink-0 group-hover:-translate-x-1 transition-transform" />
              <div className="min-w-0">
                <span className="block text-[10px] font-mono text-slate-500 uppercase">PREV</span>
                <span className="block text-sm font-bold text-white truncate">{prevProject.title}</span>
              </div>
            </Link>
          ) : <div />}

          {nextProject ? (
            <Link href={`/projects/${nextProject.slug || nextProject.id}`} className="min-w-0 flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl glass-panel border border-slate-800 hover:border-cyan-500/40 transition-colors group max-w-[48%] text-right ml-auto">
              <div className="min-w-0">
                <span className="block text-[10px] font-mono text-slate-500 uppercase">NEXT</span>
                <span className="block text-sm font-bold text-white truncate">{nextProject.title}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : <div />}
        </div>
      </div>

      <Footer />
    </main>
  );
}
