export type DeviceType = 'PC / Desktop' | 'Console (PS5 / Xbox)' | 'Mobile (iOS / Android)' | 'Handheld / Steam Deck' | 'VR / AR';

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  device: DeviceType;
  heroImage: string;
  thumbnailImage?: string;
  images: string[]; // Multi-image frames for the carousel with bottom dots
  overview: string;
  featured: boolean;
  order: number;
}

export interface DesignerProfile {
  name: string;
  callsign: string;
  title: string;
  tagline: string;
  bio: string;
  status: string;
  availability: 'available' | 'limited' | 'booked';
  email: string;
  discordTag: string; // 'weiyu85'
  discordServerUrl?: string;
  stats: {
    shippedTitles: number;
    experienceYears: number;
    totalFramesDesigned: number;
  };
  skills?: Array<{
    category: string;
    items: string[];
  }>;
  testimonials: Array<{
    id: string;
    quote: string;
    author: string; // Only message and name, no role or studio
  }>;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  studio: string;
  discordUsername?: string;
  projectType: string;
  budget: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAtIso: string;
}

export interface DatabaseSchema {
  projects: Project[];
  profile: DesignerProfile;
  messages: ContactMessage[];
  adminPasswordHash: string;
}
