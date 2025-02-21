import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const SERVICES_DIR = path.join(process.cwd(), "content", "services");

export interface Service {
  title: string;
  icon: string;
  description: string;
  content: string;
}

export async function ensureServicesDir() {
  try {
    await fs.access(SERVICES_DIR);
  } catch {
    await fs.mkdir(SERVICES_DIR, { recursive: true });
  }
}

export async function loadServices(): Promise<Service[]> {
  await ensureServicesDir();
  
  const files = await fs.readdir(SERVICES_DIR);
  const services: Service[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const content = await fs.readFile(path.join(SERVICES_DIR, file), "utf-8");
    const { data, content: markdown } = matter(content);

    services.push({
      title: data.title,
      icon: data.icon,
      description: data.description,
      content: markdown,
    });
  }

  return services;
}
