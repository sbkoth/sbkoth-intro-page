import { z } from "zod";

export const socialsSchema = z.object({
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  email: z.string(),
});

export const profileSchema = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  avatar: z.string(),
  socials: socialsSchema,
});

export const projectSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  publishedAt: z.union([z.string(), z.date()]),
  thumbnail: z.string(),
  type: z.enum(["image", "pdf", "slides", "text"]),
  challenge: z.string().nullable().optional(),
  approach: z.string().nullable().optional(),
  implementation: z.string().nullable().optional(),
  outcomes: z.array(z.string()).nullable().optional(),
  clientTestimonial: z
    .object({
      quote: z.string(),
      author: z.string(),
      role: z.string(),
      company: z.string(),
    })
    .nullable()
    .optional(),
  technologies: z.array(z.string()).nullable().optional(),
});

export const featureSchema = z.object({
  title: z.string(),
  icon: z.string(),
  description: z.string(),
  highlights: z.array(z.string()),
  content: z.string(),
});

export const insertProjectSchema = projectSchema.omit({ id: true }).extend({
  thumbnailFile: z.any().optional(),
});

export const insertProfileSchema = profileSchema.omit({ id: true });

export type Project = z.infer<typeof projectSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Feature = z.infer<typeof featureSchema>;
