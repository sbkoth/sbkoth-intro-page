/**
 * Build-time content export for static / GitHub Pages deployment.
 * Reads markdown + profile JSON and writes client/public/data/*.json
 * plus copies uploads into client/public/uploads.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

export const CONTENT_DIR = path.join(ROOT, "content");
export const PUBLIC_DIR = path.join(ROOT, "client", "public");
export const DATA_DIR = path.join(PUBLIC_DIR, "data");
export const UPLOADS_SRC = path.join(ROOT, "uploads");
export const UPLOADS_DEST = path.join(PUBLIC_DIR, "uploads");

export interface ServiceData {
  title: string;
  icon: string;
  description: string;
  content: string;
}

export interface FeatureData {
  title: string;
  icon: string;
  description: string;
  highlights: string[];
  content: string;
}

export interface ProjectData {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  thumbnail: string;
  type: string;
  challenge?: string | null;
  approach?: string | null;
  implementation?: string | null;
  outcomes?: string[] | null;
  clientTestimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  } | null;
  technologies?: string[] | null;
}

export interface ProfileData {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email: string;
  };
}

function normalizeOutcomes(outcomes: unknown): string[] {
  if (!outcomes) return [];
  if (Array.isArray(outcomes)) {
    return outcomes.map(String);
  }
  if (typeof outcomes === "object") {
    return Object.values(outcomes as Record<string, unknown>).map(String);
  }
  return [String(outcomes)];
}

export async function loadMarkdownDir<T extends Record<string, unknown>>(
  dir: string,
  map: (data: Record<string, unknown>, body: string, file: string) => T,
): Promise<T[]> {
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const items: T[] = [];
  for (const file of files.sort()) {
    if (!file.endsWith(".md")) continue;
    const raw = await fs.readFile(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    items.push(map(data as Record<string, unknown>, content, file));
  }
  return items;
}

export async function loadServices(): Promise<ServiceData[]> {
  return loadMarkdownDir(path.join(CONTENT_DIR, "services"), (data, body) => ({
    title: String(data.title ?? ""),
    icon: String(data.icon ?? "Code"),
    description: String(data.description ?? ""),
    content: body.trim(),
  }));
}

export async function loadFeatures(): Promise<FeatureData[]> {
  return loadMarkdownDir(path.join(CONTENT_DIR, "features"), (data, body) => ({
    title: String(data.title ?? ""),
    icon: String(data.icon ?? "Code2"),
    description: String(data.description ?? ""),
    highlights: Array.isArray(data.highlights)
      ? data.highlights.map(String)
      : [],
    content: body.trim(),
  }));
}

export async function loadProjects(): Promise<ProjectData[]> {
  const projects = await loadMarkdownDir(
    path.join(CONTENT_DIR, "projects"),
    (data, body, file) => {
      const slug = String(data.slug ?? file.replace(/\.md$/, ""));
      const publishedAt = data.publishedAt
        ? new Date(String(data.publishedAt)).toISOString()
        : new Date(0).toISOString();

      return {
        id: 0,
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        content: body.trim(),
        publishedAt,
        thumbnail: String(data.thumbnail ?? "/uploads/placeholder.jpg"),
        type: String(data.type ?? "text"),
        challenge: data.challenge != null ? String(data.challenge) : null,
        approach: data.approach != null ? String(data.approach) : null,
        implementation:
          data.implementation != null ? String(data.implementation) : null,
        outcomes: normalizeOutcomes(data.outcomes),
        clientTestimonial:
          (data.clientTestimonial as ProjectData["clientTestimonial"]) ?? null,
        technologies: Array.isArray(data.technologies)
          ? data.technologies.map(String)
          : [],
      };
    },
  );

  // Stable numeric ids for React keys (sorted by title then slug)
  projects.sort((a, b) => a.title.localeCompare(b.title));
  return projects.map((p, i) => ({ ...p, id: i + 1 }));
}

export async function loadProfile(): Promise<ProfileData> {
  const profilePath = path.join(CONTENT_DIR, "profile.json");
  const raw = await fs.readFile(profilePath, "utf-8");
  return JSON.parse(raw) as ProfileData;
}

async function copyDir(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  let entries: string[];
  try {
    entries = await fs.readdir(src);
  } catch {
    return;
  }
  for (const entry of entries) {
    const from = path.join(src, entry);
    const to = path.join(dest, entry);
    const stat = await fs.stat(from);
    if (stat.isDirectory()) {
      await copyDir(from, to);
    } else {
      await fs.copyFile(from, to);
    }
  }
}

export async function exportStaticContent(): Promise<{
  profile: ProfileData;
  projects: ProjectData[];
  services: ServiceData[];
  features: FeatureData[];
}> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const [profile, projects, services, features] = await Promise.all([
    loadProfile(),
    loadProjects(),
    loadServices(),
    loadFeatures(),
  ]);

  await Promise.all([
    fs.writeFile(
      path.join(DATA_DIR, "profile.json"),
      JSON.stringify(profile, null, 2),
    ),
    fs.writeFile(
      path.join(DATA_DIR, "projects.json"),
      JSON.stringify(projects, null, 2),
    ),
    fs.writeFile(
      path.join(DATA_DIR, "services.json"),
      JSON.stringify(services, null, 2),
    ),
    fs.writeFile(
      path.join(DATA_DIR, "features.json"),
      JSON.stringify(features, null, 2),
    ),
  ]);

  await copyDir(UPLOADS_SRC, UPLOADS_DEST);

  return { profile, projects, services, features };
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  exportStaticContent()
    .then(({ profile, projects, services, features }) => {
      console.log(
        `Exported static content: profile=${profile.name}, projects=${projects.length}, services=${services.length}, features=${features.length}`,
      );
    })
    .catch((err) => {
      console.error("Failed to export static content:", err);
      process.exit(1);
    });
}
