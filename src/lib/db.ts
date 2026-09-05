import fs from 'fs';
import path from 'path';
import { DatabaseSchema, Project, DesignerProfile, ContactMessage } from '@/types';
import { INITIAL_DATABASE } from '@/data/seed-data';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const STATUS_TEXT_BY_AVAILABILITY = {
  available: 'AVAILABLE',
  limited: 'LIMITED AVAILABILITY',
  booked: 'FULLY BOOKED',
} as const;

function normalizeDatabase(data: DatabaseSchema): DatabaseSchema {
  const projects = (data.projects || []).map((project) => {
    const { category, genre, platforms, tools, tags, ...cleanProject } = project as Project & Record<string, unknown>;
    void category;
    void genre;
    void platforms;
    void tools;
    void tags;
    const platformNames = Array.isArray(platforms) ? platforms.map(String).join(' ').toLowerCase() : '';
    const device = project.device || (
      platformNames.includes('mobile') || platformNames.includes('ios') || platformNames.includes('android')
        ? 'Mobile (iOS / Android)'
        : platformNames.includes('steam deck') || platformNames.includes('handheld')
          ? 'Handheld / Steam Deck'
          : platformNames.includes('playstation') || platformNames.includes('xbox') || platformNames.includes('console')
            ? 'Console (PS5 / Xbox)'
            : 'PC / Desktop'
    );
    return { ...cleanProject, device } as Project;
  });

  const profile = data.profile
    ? {
        ...data.profile,
        status: STATUS_TEXT_BY_AVAILABILITY[data.profile.availability] || data.profile.status,
        testimonials: data.profile.testimonials.map((testimonial) => {
          const { role, studio, ...cleanTestimonial } = testimonial as typeof testimonial & Record<string, unknown>;
          void role;
          void studio;
          return cleanTestimonial;
        }),
      }
    : INITIAL_DATABASE.profile;

  const { socials, discordServerUrl, discordMigrationNotice, skills, ...cleanProfile } = profile as typeof profile & Record<string, unknown>;
  void socials;
  void discordServerUrl;
  void discordMigrationNotice;
  void skills;
  return { ...data, projects, profile: cleanProfile };
}

function ensureDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATABASE, null, 2), 'utf-8');
      return INITIAL_DATABASE;
    }

    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = normalizeDatabase(JSON.parse(content) as DatabaseSchema);
    return parsed;
  } catch (error) {
    console.error('Failed to read database file, using initial data:', error);
    return INITIAL_DATABASE;
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save database file:', error);
  }
}

export async function getProjects(): Promise<Project[]> {
  const db = ensureDb();
  return (db.projects || []).sort((a, b) => a.order - b.order);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = ensureDb();
  return db.projects.find((p) => p.slug === slug) || null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const db = ensureDb();
  return db.projects.find((p) => p.id === id) || null;
}

export async function createProject(projectData: Omit<Project, 'id' | 'order'>): Promise<Project> {
  const db = ensureDb();
  const id = `proj-${Date.now()}`;
  const order = (db.projects.length > 0 ? Math.max(...db.projects.map((p) => p.order)) : 0) + 1;

  const slug =
    projectData.slug ||
    projectData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const newProject: Project = { ...projectData, id, slug, order };
  db.projects.push(newProject);
  saveDb(db);
  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const db = ensureDb();
  const index = db.projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.projects[index] = {
    ...db.projects[index],
    ...updates,
    id: db.projects[index].id,
  };

  saveDb(db);
  return db.projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = ensureDb();
  const initialLength = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  if (db.projects.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

export async function reorderProjects(ids: string[]): Promise<Project[]> {
  const db = ensureDb();
  const projectMap = new Map(db.projects.map((p) => [p.id, p]));
  
  const reordered: Project[] = [];
  ids.forEach((id, index) => {
    const proj = projectMap.get(id);
    if (proj) {
      proj.order = index + 1;
      reordered.push(proj);
      projectMap.delete(id);
    }
  });

  // Append any remaining projects that were not in the reordered list
  let currentOrder = reordered.length + 1;
  projectMap.forEach((proj) => {
    proj.order = currentOrder++;
    reordered.push(proj);
  });

  db.projects = reordered;
  saveDb(db);
  return db.projects;
}

export async function getProfile(): Promise<DesignerProfile> {
  const db = ensureDb();
  return db.profile || INITIAL_DATABASE.profile;
}

export async function updateProfile(updates: Partial<DesignerProfile>): Promise<DesignerProfile> {
  const db = ensureDb();
  db.profile = {
    ...db.profile,
    ...updates,
  };
  saveDb(db);
  return db.profile;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const db = ensureDb();
  return db.messages || [];
}

export async function saveContactMessage(messageData: Omit<ContactMessage, 'id' | 'createdAtIso' | 'status'>): Promise<ContactMessage> {
  const db = ensureDb();
  const newMsg: ContactMessage = {
    ...messageData,
    id: `msg-${Date.now()}`,
    createdAtIso: new Date().toISOString(),
    status: 'unread',
  };

  if (!db.messages) db.messages = [];
  db.messages.unshift(newMsg);
  saveDb(db);
  return newMsg;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const db = ensureDb();
  const initialLength = (db.messages || []).length;
  db.messages = (db.messages || []).filter((message) => message.id !== id);
  if (db.messages.length === initialLength) return false;
  saveDb(db);
  return true;
}

export async function updateMessageStatus(id: string, status: 'unread' | 'read' | 'replied'): Promise<boolean> {
  const db = ensureDb();
  const msg = (db.messages || []).find((m) => m.id === id);
  if (msg) {
    msg.status = status;
    saveDb(db);
    return true;
  }
  return false;
}

export async function getAdminPasswordHash(): Promise<string> {
  const db = ensureDb();
  return db.adminPasswordHash || INITIAL_DATABASE.adminPasswordHash;
}

export async function updateAdminPasswordHash(newHash: string): Promise<void> {
  const db = ensureDb();
  db.adminPasswordHash = newHash;
  saveDb(db);
}
