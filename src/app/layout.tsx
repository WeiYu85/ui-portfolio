import type { Metadata } from 'next';
import './globals.css';
import { AudioSFXProvider } from '@/components/ui/AudioSFXProvider';

export const metadata: Metadata = {
  title: 'VUX — Game UI/UX Designer',
  description: 'Game UI/UX designer specializing in tactical HUDs, diegetic interfaces, and scalable design systems for PC, console, and mobile titles.',
  keywords: ['Game UI Designer', 'HUD Design', 'Game UX', 'Diegetic UI', 'Game Interface'],
  authors: [{ name: 'Vux' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#050813] text-slate-100 min-h-screen antialiased selection:bg-cyan-400 selection:text-slate-950 custom-scrollbar">
        <AudioSFXProvider>
          {children}
        </AudioSFXProvider>
      </body>
    </html>
  );
}
