import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const TESTIMONIALS_DIR = path.join(process.cwd(), "content", "testimonials");

export interface Testimonial {
  text: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

export async function ensureTestimonialsDir() {
  try {
    await fs.access(TESTIMONIALS_DIR);
  } catch {
    await fs.mkdir(TESTIMONIALS_DIR, { recursive: true });
  }
}

export async function loadTestimonials(): Promise<Testimonial[]> {
  await ensureTestimonialsDir();
  
  const files = await fs.readdir(TESTIMONIALS_DIR);
  const testimonials: Testimonial[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const content = await fs.readFile(path.join(TESTIMONIALS_DIR, file), "utf-8");
    const { data } = matter(content);

    testimonials.push({
      text: data.text,
      author: data.author,
      role: data.role,
      company: data.company,
      avatar: data.avatar,
    });
  }

  return testimonials;
}
