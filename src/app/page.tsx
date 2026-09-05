import React from 'react';
import { getProjects, getProfile } from '@/lib/db';
import { Navbar } from '@/components/ui/Navbar';
import { HeroSection } from '@/components/ui/HeroSection';
import { ProjectGallery } from '@/components/ui/ProjectGallery';
import { AboutSection } from '@/components/ui/AboutSection';
import { ContactSection } from '@/components/ui/ContactSection';
import { Footer } from '@/components/ui/Footer';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [projects, profile] = await Promise.all([getProjects(), getProfile()]);

  return (
    <main className="site-atmosphere min-h-screen text-white selection:bg-cyan-400 selection:text-slate-950 flex flex-col justify-between relative">
      {/* HUD Navigation */}
      <Navbar
        designerName={profile.name}
        statusText={profile.status}
        availability={profile.availability}
      />

      {/* Hero Section with 3D Three.js interactive canvas */}
      <HeroSection profile={profile} />

      {/* Project Showcase Gallery with In-Page Multi-Image Frames */}
      <ProjectGallery initialProjects={projects} />

      {/* About the Designer */}
      <AboutSection profile={profile} />

      {/* Contact & Commission Portal */}
      <ContactSection profile={profile} />

      {/* Futuristic Cyber Footer */}
      <Footer />
    </main>
  );
}
